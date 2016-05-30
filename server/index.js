"use strict";

var express = require('express');
var multer = require('multer');
var http = require('http');
var socketIo = require('socket.io');
var contentDisposition = require('content-disposition');
var webPush = require('web-push');

/** Configure webPush to work with GCM */
webPush.setGCMAPIKey(process.env.PANGOLINK_GCM_API_KEY);

var app = express();
var server = http.Server(app);
var io = socketIo(server);
var upload = multer({ dest: 'uploads/' });

/**
 * Store the original names for the uploads in order to send proper
 * content dispositions.
 */
var originalNames = {};

// Register the routes in priority order:

// The upload API first to not be statically served.
app.post('/api/files', upload.single('file'), (req, res) => {
  var destinatary = req.body.destinatary;
  res.status(201).json({ destinatary });
  originalNames[req.file.filename] = req.file.originalname;
  enqueueFile(req.file, destinatary);
  sendPendingFiles(destinatary);
});

// Now the special uploads static folder to be serve the file with
// the proper headers.
app.use('/uploads', express.static('uploads', { setHeaders: customContentDisposition }));

/**
 * Sets the Content-Disposition header for the file to be served with
 * the original name.
 */
function customContentDisposition(res, path, stat) {
  var tokens = path.split('/');
  var name = tokens[tokens.length - 1];
  var originalName = originalNames[name];
  res.setHeader('Content-Disposition', contentDisposition(originalName, { type: 'attachment' }));
}

// Lastly, serve the app on the root.
app.use('/', express.static('app'));

/** Stores the sockets by client id. */
var clients = {};

/** Stores the endpoints by client id. */
var endpoints = {};

// The socket API simply manages client presence and file queues.
io.on('connection', socket => {
  socket.on('identify', ({ id, pushEndpoint }) => {
    console.log(`${id} connected to Pangolink with push endpoint ${pushEndpoint}\n`);
    clients[id] = socket;
    endpoints[id] = pushEndpoint;
    socket.on('disconnect', () => {
      delete clients[id];
      console.log(`Lost connection with ${id}`);
    });

    // Queues are instructed to be flushed when a client identify itself.
    sendPendingFiles(id);
  });
});

/** Stores the files queues by destinatary id. */
var queues = {};

/** Add a new file for a destinatary and flush her queue. */
function enqueueFile(file, id) {
  queues[id] = queues[id] || [];
  queues[id].push(file);
}

/** Empties a queue by notifying the client about her pending files. */
function sendPendingFiles(id) {
  queues[id] = queues[id] || [];

  var pushEndpoint = endpoints[id];
  if (pushEndpoint && queues[id].length > 0) {
    webPush.sendNotification(pushEndpoint, { ttl: 24 * 60 * 60 }).catch(reason => console.error(reason));
    console.log(`Notification of incoming files sent to ${pushEndpoint}\n`);
  }

  var socket = clients[id];
  if (socket) {
    queues[id].forEach(file => socket.emit('file', {
      url: '/uploads/' + file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    }));
    queues[id] = [];
  }
}

// Start the server.
const PORT = 8000;
server.listen(PORT, (err, res) => {
  if (err) {
    console.error(err);
  }
  else {
    console.log(`Pangolink server running on port ${PORT}`);
  }
});
