
(function (global) {
  "use strict";

  var notifications = global.notifications = {
    /** Ask the user to allow this page to show notifications. */
    askForPermissions() {
      return Notification.requestPermission();
    }
  };
}(this));
