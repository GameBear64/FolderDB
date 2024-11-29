import path from 'path';
import * as fs from 'fs';

import TaskQueue from './utils/queue.js';
import methods from './methods/all.js';
import * as helpers from './utils/helpers.js';

import * as e from './utils/enums.js';

class FolderDB {
  /**
   * @param {Object} options - Configuration options for the FolderDB instance.
   * @param {string} options.dbPath - The path to the database directory.
   * @param {boolean} [options.mergeInstances=false] - If true, merges this instance with any existing instance.
   */
  constructor(options) {
    if (FolderDB._instance && !options.mergeInstances) {
      throw new Error('Only one instance allowed!');
    }

    FolderDB._instance = this;
    this.dbPath = path.resolve(options.dbPath);
    this.queue = new TaskQueue();

    if (!fs.statSync(this.dbPath, { throwIfNoEntry: false })) {
      fs.mkdirSync(this.dbPath, { recursive: true });
    }

    this.pointers = [];
    this.targetFile = this.dbPath;
    this.data = null;
    this.valueType = e.ValueType.DIRECTORY;

    this.__bindHelpers(this, Object.values(helpers));
    this.__bindMethods(this, Object.values(methods));
  }

  __bindHelpers(instance, methods) {
    methods.forEach(method => {
      instance['_' + method.name] = method.bind(instance);
    });
  }

  __bindMethods(instance, methods) {
    methods.forEach(method => {
      // NOTE: this way we can skip the queue for internal use
      instance['_' + method.name] = method.bind(instance);

      instance[method.name] = (...args) => this.queue.add(() => method.apply(instance, args));
    });
  }
}

export const enums = Object.fromEntries(Object.entries(e));
export default FolderDB;
