import assert from 'node:assert';
import * as fs from 'fs/promises';

async function createFile(value) {
  // trim dots
  assert(Array.isArray(value), 'dirNav path not array');
}

async function setValue(value) {
  // trim dots
}

async function set(key, value) {
  return this.queue.add(() => this._set(key, value));
}

async function _set(key, value) {
  // check if value is undefined, if yes, key is value
  //
  // check if in file mode
  // if in file mode, do as stormDB
  // if in directory mode, create files and folders
  //
  // handle undefined paths
}

async function rename(key, value) {}

async function remove(key, value) {}

export { createFile, _set, set };
