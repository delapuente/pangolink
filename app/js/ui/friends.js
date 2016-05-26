(function (globals) {
  "use strict";

  var ui = globals.friendsUi = {
    /** Set up the different HTML elements of the UI. */
    init(el) {
      this._el = el;
      this._fileForm = el.querySelector('form');
      this._destinatary = el.querySelector('input[name="destinatary"]');
      this._file = el.querySelector('input[name="file"]');
      this._file.onchange = () => this._uploadFile();

      this._list = el.querySelector('ul');
      this._friendTemplate = el.querySelector('#friend-template');

      /**
       * Stores the template for the friend item. Each time you access, you obtain
       * a brand new clone of the template ready to be populated.
       */
      Object.defineProperty(this, '_friendTemplateItem', {
        get() {
          return document.importNode(this._friendTemplate.content.querySelector('li'), true);
        }
      });
    },

    /** Accept an object of alias per friend id and convert them into a list of friends. */
    addFriends(friends) {
      Object.keys(friends).forEach(id => {
        this._addFriendItem(friends[id], id);
      });
    },

    /** Ask for an alias and adds a new friend. */
    addNewFriend(id) {
      return this._enterAlias()
        .then(alias => {
          this._addFriendItem(alias, id);
          return { alias, id };
        });
    },

    /** Displays a UI for entering an alias. Rejects if the alias is not valid. */
    _enterAlias() {
      return new Promise((fulfil, reject) => {
        var alias = (prompt('Enter an alias for your contact') || '').trim();
        if (alias) {
          fulfil(alias);
        }
        else {
          reject();
        }
      });
    },

    /** Create the HTML item that represents the new friend. */
    _addFriendItem(alias, id) {
      var li = this._friendTemplateItem;
      li.dataset.id = id;
      li.addEventListener('click', () => {
        this._destinatary.value = id;
        this._file.click()
      });

      var img = li.querySelector('img');
      img.src = `https://www.gravatar.com/avatar/${id}`;

      var span = li.querySelector('figurecaption');
      span.textContent = alias;

      this._list.appendChild(li);
    },

    /** Send the file to the server and displays the progress of the upload. */
    // TODO: Move this to pangolink library.
    _uploadFile() {
      var id = this._destinatary.value;
      var progressBar = this._el.querySelector(`li[data-id="${id}"] progress`);
      progressBar.hidden = false;

      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/files');
      xhr.upload.onprogress = evt => progressBar.value = evt.loaded / evt.total;
      var data = new FormData(this._fileForm);
      xhr.send(data);
      this._file.value = '';
    }
  };

}(this))
