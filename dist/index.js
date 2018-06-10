'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var idb = require('idb');

var IdbCRUD = function () {
  function IdbCRUD(dbname, version, objectStore) {
    var keyPath = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var autoIncrement = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    _classCallCheck(this, IdbCRUD);

    if (typeof idb === 'undefined') {
      console.warn('Please add idb library first,here\'s the cdn https://cdn.jsdelivr.net/npm/idb@2.1.2/lib/idb.min.js');
    } else {

      this.dbname = dbname;
      this.version = version;
      this.objectStore = objectStore;
      this.keyPath = keyPath;
      this.autoIncrement = autoIncrement;

      if ('indexedDB' in window) {
        this.promise = idb.open(dbname, version, function (db) {
          if (!db.objectStoreNames.contains(objectStore)) {
            db.createObjectStore(objectStore, {
              keyPath: keyPath,
              autoIncrement: autoIncrement
            });
          }
        });
      }
    }
  }

  _createClass(IdbCRUD, [{
    key: 'deleteDB',
    value: function deleteDB(dbname) {
      return indexedDB.deleteDatabase(dbname);
    }
  }, {
    key: 'add',
    value: function add(data) {
      var _this = this;

      return this.promise.then(function (db) {
        var tx = db.transaction(_this.objectStore, "readwrite");
        var store = tx.objectStore(_this.objectStore);

        store.put(data);
        return tx.complete;
      });
    }
  }, {
    key: 'addAll',
    value: function addAll(array) {
      var _this2 = this;

      return array.map(function (data) {
        return _this2.add(data);
      });
    }
  }, {
    key: 'getAll',
    value: function getAll() {
      var _this3 = this;

      return this.promise.then(function (db) {
        var tx = db.transaction(_this3.objectStore, "readonly");
        var store = tx.objectStore(_this3.objectStore);
        return store.getAll();
      });
    }
  }, {
    key: 'delete',
    value: function _delete(id) {
      var _this4 = this;

      return this.promise.then(function (db) {
        var tx = db.transaction(_this4.objectStore, "readwrite");
        var store = tx.objectStore(_this4.objectStore);
        store.delete(id);
        return tx.complete;
      });
    }
  }, {
    key: 'deleteAll',
    value: function deleteAll(st) {
      var _this5 = this;

      return this.promise.then(function (db) {
        var tx = db.transaction(_this5.objectStore, 'readwrite');
        var store = tx.objectStore(_this5.objectStore);
        store.clear();
        return tx.complete;
      });
    }
  }]);

  return IdbCRUD;
}();

exports.default = IdbCRUD;
