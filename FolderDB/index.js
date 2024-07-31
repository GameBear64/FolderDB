import TaskQueue from './utils/queue';
import methods from './methods/all';

// TODO: needs to be singleton
class FolderDB {
  constructor(options) {
    if (FolderDB._instance) throw new Error('Only one instance allowed!');
    FolderDB._instance = this;

    this.dbPath = options.dbPath;
    this.queue = new TaskQueue();

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
