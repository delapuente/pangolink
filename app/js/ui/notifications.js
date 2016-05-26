
(function (global) {
  "use strict";

  var notifications = global.notifications = {
    /** Ask the user to allow this page to show notifications. */
    askForPermissions() {
      return Notification.requestPermission();
    },

    /** Creates a new notification. Does not work on Chrome without service worker. */
    newIncomingFilesNotification() {
      return new Notification('New incoming files', {
        body: 'You have new files ready to download',
        vibrate: true,
        icon: '/icons/192x192.png'
      });
    }
  };
}(this));
