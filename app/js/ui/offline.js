(function (global) {
  "use strict";

  var ui = global.offlineUi = {
    /** Set up the HTML elements of the component. */
    init(el) {
      this._el = el;
    },

    show() {
      this._el.hidden = false;
    },

    hide() {
      this._el.hidden = true;
    }
  };

}(this));
