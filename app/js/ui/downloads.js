(function (global) {
  "use strict";

  var ui = global.downloadsUi = {
    /** Stores the current visibility. */
    _visibilityClass: 'dismissed',

    /** Set up the HTML elements of the component. */
    init(el) {
      this._el = el;
      this._fileList = el.querySelector('ul');
      this._toggle = el.querySelector('button');
      this._toggle.onclick = () => this._toggleVisibility();
    },

    /** Modifies the UI to warn about new files available. */
    advertNewFiles() {
      if (this._visibilityClass === 'dismissed') {
        this._toggle.classList.add('attention');
      }
    },

    /** Adds a new item to the download list. */
    addDownload(details) {
      var li = document.createElement('LI');
      var a = document.createElement('A');
      a.href = details.url;
      a.setAttribute('download', details.originalname);
      a.textContent = details.originalname;
      li.appendChild(a);
      this._fileList.insertBefore(li, this._fileList.firstChild);
    },

    /** Changes between the different visualizations of the downloads list. */
    _toggleVisibility() {
      var oldClass = this._visibilityClass;

      switch (oldClass) {
      case 'dismissed':
        this._visibilityClass = 'showing-first';
        this._toggle.classList.remove('attention');
        break;
      case 'showing-first':
        this._visibilityClass = 'shown';
        break;
      case 'shown':
        this._visibilityClass = 'dismissed';
        break;
      }

      this._el.classList.add(this._visibilityClass);
      requestAnimationFrame(() => this._el.classList.remove(oldClass));
    }
  };

}(this));
