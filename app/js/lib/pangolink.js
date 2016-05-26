/** globals: localforage, io, md5 */

(function (global) {
  "use strict";

  var storage = localforage.createInstance({ name: '__pangolink-1.0.0' });

  var pangolink = global.pangolink = {
    _socket: null,

    /** Register the client with the server. */
    connect() {
      return this.getMyId()
        .then(id => new Promise((fulfill, reject) => {
          return new Promise((fulfil, reject) => {
            this._socket = io();
            setTimeout(() => {
              this._socket.emit('identify', id);
              this._socket.on('file', details => this._advertFile(details));
            }, 1000);
            fulfil();
          });
        }));
    },

    /** Generates the MD5 hash of the seed as the id for the client. */
    generateMyId(seed) {
      return Promise.resolve(md5(seed));
    },

    /** Obtains the id. */
    getMyId() {
      return storage.getItem('me');
    },

    /** Obtains the link for the stored id. */
    getMyLink() {
      return this.getMyId()
        .then(id => id ? new URL(`#${id}`, window.location) : null)
        .then(url => url ? url.href : null);
    },

    /** Sets a new id. */
    setMyId(id) {
      return storage.setItem('me', id);
    },

    /** Obtains an object with friends by friend id. */
    getFriends() {
      return storage.getItem('friends').then(friends => friends || {});
    },

    /** Obtains the list of downloads. */
    getDownloads() {
      return storage.getItem('downloads').then(downloads => downloads || []);
    },

    /** Checks if an id is a friend. */
    isMyFriend(id) {
      return this.getFriends()
        .then(friends => !!friends[id]);
    },

    /** Register a new friend with an alias. */
    addFriend({id, alias}) {
      return this.getFriends()
        .then(friends => {
          friends[id] = alias;
          return storage.setItem('friends', friends);
        })
    },

    /**
     * Factory of functions for getting the hex representation of a buffer.
     * The factory accepts an argument count to determine how many digits to
     * take from the representation.
     */
    _hex(count) {
      return buffer => {
        var hexCodes = [];
        var view = new DataView(buffer);
        for (var i = 0; i < view.byteLength; i += 4) {
          var value = view.getUint32(i);
          var stringValue = value.toString(16);
          var padding = '00000000';
          var paddedValue = (padding + stringValue).slice(-padding.length);
          hexCodes.push(paddedValue);
        }
        var hexString = hexCodes.join("");
        return count ? hexString.substr(0, count) : hexString;
      };
    },

    /** Return the link for the id. */
    _toLink(id) {
      var current = new URL('/', window.location);
      current.hash = id;
      return current.href;
    },

    /** Save the information of receive file and calls the proper callbacks. */
    _advertFile(details) {
      this.getDownloads()
        .then(downloads => {
          downloads.push(details);
          return storage.setItem('downloads', downloads);
        });
      this.onfile && this.onfile(details);
    }
  };

}(this));
