
var PANGOLINK_CACHE = '__pangolink-1.0.0';
var ASSETS = [
  '/bower_components/js-md5/build/md5.min.js',
  '/bower_components/localforage/dist/localforage.nopromises.min.js',
  '/socket.io/socket.io.js',
  '/css/style.css',
  '/icons/192x192.png',
  '/',
  '/index.html',
  '/js/index.js',
  '/js/lib/pangolink.js',
  '/js/ui/downloads.js',
  '/js/ui/friends.js',
  '/js/ui/me.js',
  '/js/ui/notifications.js',
  '/js/ui/offline.js'
];

this.oninstall = evt => {
  var precacheAssets = caches.open(PANGOLINK_CACHE)
    .then(cache => cache.addAll(ASSETS));

  evt.waitUntil(precacheAssets);
};

this.onfetch = evt => {
  var request = evt.request;
  var url = new URL(request.url);
  if (request.method === 'GET' && isAsset(url)) {
    var cacheResponse = fromCache(request);
    var networkResponse = fromNetwork(request);
    evt.respondWith(race(
      cacheResponse,
      networkResponse.then(response => response.clone())
    ));
    evt.waitUntil(networkResponse.then(response => update(request, response.clone())));
  }
};

function isAsset(url) {
  return isNotApi(url) && isNotDownload(url) && isNotSocket(url);
}

function isNotApi(url) {
  return !url.pathname.startsWith('/api/');
}

function isNotDownload(url) {
  return !url.pathname.startsWith('/uploads/');
}

function isNotSocket(url) {
  return !/\/socket.io\/\?/.test(url.href);
}

function race(promiseA, promiseB) {
  return new Promise((fulfil, reject) => {
    promiseA.then(fulfil, () => promiseB.catch(reject));
    promiseB.then(fulfil, () => promiseA.catch(reject));
  });
}

function fromCache(request) {
  return caches.match(request)
    .then(response => {
      if (!response) {
        return Promise.reject('not-found');
      }
      return Promise.resolve(response);
    });
}

function fromNetwork(request) {
  return fetch(request);
}

function update(request, response) {
  return self.caches.open(PANGOLINK_CACHE)
    .then(cache => cache.put(request, response));
}
