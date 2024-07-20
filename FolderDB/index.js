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
    this.fileMode = false;

    this.bindMethods(this, Object.values(methods));
  }

  bindMethods(instance, methods) {
    methods.forEach(method => {
      instance[method.name] = method.bind(instance);
    });
  }

  async get(value) {
    // problem
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
  }
}

export default FolderDB;
