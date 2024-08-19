import TaskQueue from './utils/queue';
import methods from './methods/all';

import { ValueType } from './utils/enums';

class FolderDB {
  constructor(options) {
    if (FolderDB._instance) throw new Error('Only one instance allowed!');
    FolderDB._instance = this;

    this.dbPath = options.dbPath;
    this.queue = new TaskQueue();

    this.pointers = [];
    this.targetFile = this.dbPath;
    this.data = null;
    this.valueType = ValueType.DIRECTORY;

    this.__bindMethods(this, Object.values(methods));
  }
  __bindMethods(instance, methods) {
    methods.forEach(method => {
      // NOTE: this way we can skip the queue for internal use
      instance['_' + method.name] = method.bind(instance);

      instance[method.name] = (...args) => this.queue.add(() => method.apply(instance, args));
    });
  }

  // Clone method to create a new instance with the same state
  _clone() {
    const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);

    this.__bindMethods(clone, Object.values(methods));

    return clone;
  }
}

export default FolderDB;
