/** globals: meUi, friendsUi, downloadsUi, pangolink, notifications */

var swRegistration;
if ('serviceWorker' in navigator) {
  swRegistration = navigator.serviceWorker.register('sw.js');
}

document.addEventListener('DOMContentLoaded', evt => {
  "use strict";

  // Initialize the different components of the UI.
  meUi.init(document.getElementById('me'));
  friendsUi.init(document.getElementById('friends'));
  downloadsUi.init(document.getElementById('downloads'));
  offlineUi.init(document.getElementById('offline-overlay'));
  notifications.askForPermissions();

  // Intercept the add to home screen prompt
  window.addEventListener('beforeinstallprompt', evt => {
    // And prevent it from showing if we are in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      evt.preventDefault();
    }
  });

  // Show or hide the offline overlay attending to the connection status.
  window.addEventListener('offline', () => offlineUi.show());
  window.addEventListener('online', () => offlineUi.hide());
  offlineUi[navigator.onLine ? 'hide' : 'show']();

  // Set the callback to invoke when receiving a new file.
  pangolink.onfile = details => {
    // Upon a new file, add this to the list of downloads...
    downloadsUi.addDownload(details);

    // ...and notify.
    downloadsUi.advertNewFiles();
  };

  // Show my downloads.
  pangolink.getDownloads()
    .then(downloads => downloads.forEach(details => downloadsUi.addDownload(details)));

  // Show my friends.
  pangolink.getFriends()
    .then(friends => friendsUi.addFriends(friends));

  // Ensure I have an id before...
  ensureMyId()
    .then(id => {
      // ...allowing to add new friends.
      window.onhashchange = addFriend;
      addFriend();

      // And start the application.
      return startApp();
    });

  /** Connect to the server */
  function startApp() {
    if (swRegistration) {
      return swRegistration
        .then(subscribe)
	// Send the endpoint to the server
        .then(subscription => pangolink.connect(subscription.endpoint));
    }
    return pangolink.connect();
  }

  /** Use Push API to get a push subscription with an endpoint. */
  function subscribe(registration) {
    return registration.pushManager.getSubscription()
      .then(subscription => {
        if (subscription) {
          return subscription;
        }
        return registration.pushManager.subscribe({ userVisibleOnly: true });
      });
  }

  /** Check if there is an ID and displays the UI to get one if not. */
  function ensureMyId() {
    return pangolink.getMyLink()
      .then(link => {
        if (link) {
          return pangolink.getMyId()
            .then(id => {
              meUi.showLink(id, link);
              return id;
            });
        }

        return meUi.getEmail()
          .then(email => pangolink.generateMyId(email))
          .then(id => pangolink.setMyId(id))
          .then(ensureMyId);
      });
  }

  /** Parses the hash to add a new friend. */
  function addFriend() {
    var id = window.location.hash.substr(1); // drop the # symbol
    return pangolink.getMyId()
      .then(myId => {
        var isNotMe = id !== myId;
        if (id && isNotMe) {
          return pangolink.isMyFriend(id)
            .then(isMyFriend => {
              if (!isMyFriend) {
                return friendsUi.addNewFriend(id)
                  .then(friend => pangolink.addFriend(friend))
                  .catch();
              }
            });
        }
      });
  }

});
