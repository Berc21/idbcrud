
const idb = require('idb');

export default class IdbCRUD {

  constructor(dbname, version, objectStore, keyPath = null, autoIncrement = false) {
    if (typeof idb === 'undefined') {
      console.warn(`Please add idb library first,here's the cdn https://cdn.jsdelivr.net/npm/idb@2.1.2/lib/idb.min.js`)
    } else {
   
    this.dbname = dbname;
    this.version = version;
    this.objectStore = objectStore;
    this.keyPath = keyPath
    this.autoIncrement = autoIncrement;

    if (('indexedDB' in window)) {
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

  deleteDB(dbname) {
    return indexedDB.deleteDatabase(dbname);
  }

  add(data) {
    return this.promise.then((db) => {
      const tx = db.transaction(this.objectStore, "readwrite");
      const store = tx.objectStore(this.objectStore);

      store.put(data);
      return tx.complete;
    });
  }

  addAll(array) {
    return array.map(data => this.add(data))
  }

  getAll() {
    return this.promise.then((db) => {
      const tx = db.transaction(this.objectStore, "readonly");
      const store = tx.objectStore(this.objectStore);
      return store.getAll();
    });
  }

  delete(id) {
    return this.promise.then((db) => {
      const tx = db.transaction(this.objectStore, "readwrite");
      const store = tx.objectStore(this.objectStore);
      store.delete(id);
      return tx.complete;
    });
  }

  deleteAll(st) {
    return this.promise
      .then((db) => {
        const tx = db.transaction(this.objectStore, 'readwrite');
        const store = tx.objectStore(this.objectStore);
        store.clear();
        return tx.complete;
      });
  }
}


