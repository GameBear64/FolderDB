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

  __bindMethods(instance, methods) {
    methods.forEach(method => {
      // NOTE: this way we can skip the queue for internal use
      instance['_' + method.name] = method.bind(instance);

      instance[method.name] = (...args) => this.queue.add(() => method.apply(instance, args));
    });
  }
}

export default FolderDB;
