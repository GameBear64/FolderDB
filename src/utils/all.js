import EventManager from './structures/EventManager.js';
import TaskQueue from './structures/Queue.js';
export { EventManager, TaskQueue };

import { ValueType } from './enums.js';
import methods from '../methods/all.js';

import * as coreHelpers from './helpers.js';
import * as schemaHelpers from './schemaHelpers.js';

const allHelpers = { ...coreHelpers, ...schemaHelpers, clone };

// Clone method to create a new instance with the same state
function clone({ clean } = { clean: false }) {
  const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);

  if (clean) {
    clone.pointers = [];
    clone.targetFile = this.dbPath;
    clone.data = null;
    clone.valueType = ValueType.DIRECTORY;
  }

  // Rebind methods to the clone
  this.__bindHelpers(clone, Object.values(allHelpers));
  this.__bindMethods(clone, Object.values(methods));

  return clone;
}

export default allHelpers;
