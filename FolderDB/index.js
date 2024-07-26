import methods from './methods/all';

import TaskQueue from './utils/queue';

// https://github.com/typicode/steno

// TODO: needs to be singleton

class FolderDB {
  constructor(options) {
    this.dbPath = options?.dbPath || './db';
    this.path = [];
    this.visibleData;
    this.queue = new TaskQueue();
    this.targetFile = '';

    this.__bindMethods(this, Object.values(methods));
  }

  // _ means private
  // __ means very private
  __bindMethods(instance, methods) {
    methods.forEach(method => {
      // move queue here?
      instance[method.name] = method.bind(instance);
    });
  }
}

export default FolderDB;
