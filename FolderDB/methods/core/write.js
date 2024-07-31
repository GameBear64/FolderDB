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
  // check if value is undefined, if yes, key is value
  //
  // check if in file mode
  // if in file mode, do as stormDB
  // if in directory mode, create files and folders
  //
  // handle undefined paths
  //
  // if (value === undefined) {
  //   this.setValue(key);
  // } else {
  //   let extraPointers;
  //   if (typeof key === 'string') extraPointers = key.split('.');
  //   else extraPointers = [key];
  //   this.setValue(value, extraPointers);
  // }
  // return this;
}

// async function setValue(value, pointers = []) {
//   let depth = 0;

//   pointers = [...this.pointers, ...pointers];

//   const func = (a, b) => {
//     depth += 1;

//     let finalLevel = depth === pointers.length;
//     if (typeof a[b] === 'undefined' && !finalLevel) {
//       a[b] = {};
//       return a[b];
//     }

//     if (finalLevel) {
//       a[b] = value;
//       return value;
//     } else {
//       return a[b];
//     }
//   };
//   pointers.reduce(func, this.state);
// }

async function rename(key, value) {}

async function remove(key, value) {}

export { createFile, set };
