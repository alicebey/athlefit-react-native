import {MMKV} from 'react-native-mmkv';
const MMKV_KEY = '1627V-263BS-HBAYG-BAB21-6627S';


// Setup for local storage 

// Usage for keeping data login
class MMKVStoragePersistHelper {
  storages = undefined;

  constructor(instance) {
    this.init = this.init.bind(this);
    this.setItem = this.setItem.bind(this);
    this.getItem = this.getItem.bind(this);
    this.removeItem = this.removeItem.bind(this);

    this.init(instance);
  }

  init(name) {
    let instance_name = name;
    this.storages = new MMKV({
      id: instance_name,
      encryptionKey: MMKV_KEY,
    });
  }

  setItem(name, value) {
    this.storages.set(name, value);
  }

  getItem(name) {
    return this.storages.getString(name);
  }

  removeItem(name) {
    this.storages.delete(name);
  }
}

export default MMKVStoragePersistHelper;
