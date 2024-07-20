import assert from 'node:assert';

import * as methods from './methods/read';

import TaskQueue from './utils/queue';

// https://github.com/typicode/steno

class FolderDB {
  constructor(options) {
    this.dbPath = options?.dbPath || './db';
    this.path = [];
    this.visibleData;
    this.queue = new TaskQueue();
    this.targetFile = '';

    this.bindMethods(this, Object.values(methods));
  }

  bindMethods(instance, methods) {
    methods.forEach(method => {
      instance[method.name] = method.bind(instance);
    });
  }

  async get(value) {
    return this.queue.add(() => this._get(value));
  }

  async _get(value) {
    assert(typeof value === 'string', 'value must be string');

    const result = await this.dirNavigator(value ? value.split('.') : [])
      .then(this.getFile)
      .then(this.fileNavigator.bind(this))
      .then(false, x => x);
    // NOTE: This was the only way to have early returns

    return result.data;
    // return this;
  }

  async set(key, value) {
    return this.queue.add(() => this._set(key, value));
  }

  async _set(key, value) {
    // check if value is undefined, if yes, key is value
    //
    // check if in file mode
    // if in file mode, do as stormDB
    // if in directory mode, create files and folders
    //
    // handle undefined paths
  }
}

export default FolderDB;
