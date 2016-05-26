(function (global) {
  "use strict";

  var ui = global.meUi = {

    /* Set up the HTML elements of the UI. */
    init(el) {
      this._el = el;
      this._gravatar = el.querySelector('img');
      this._linkDisplay = el.querySelector('#link-display');
      // Select the complete link on clicking.
      this._linkDisplay.onclick = () => {
        window.getSelection().removeAllRanges();
        var range = document.createRange();
        range.selectNodeContents(this._linkCaption);
        window.getSelection().addRange(range);
      };

      this._linkCaption = el.querySelector('#link-display p');
      this._linkSetup = el.querySelector('#link-setup');
      this._email = el.querySelector('input');
      this._go = el.querySelector('button');
    },

    /** Displays my link. */
    showLink(id, link) {
      this._gravatar.src = `https://www.gravatar.com/avatar/${id}`;
      this._linkSetup.remove();
      this._linkDisplay.hidden = false;
      this._linkCaption.textContent = link;
    },

    /** Displays the UI for retrieving the e-mail and resolve once it gets the e-mail. */
    getEmail() {
      return new Promise((fulfil, reject) => {
        this._linkSetup.hidden = false;
        this._go.onclick = evt => {
          evt.preventDefault();
          var email = (this._email.value || '').trim();
          if (email) {
            fulfil(email);
          }
        }
      });
    }
  };

}(this));
