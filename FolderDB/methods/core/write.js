import assert from 'node:assert';
import { ValueType } from '../../utils/enums';

import * as fs from 'fs';

async function createFolder(name) {
  fs.mkdirSync(name, { recursive: true });

  return this;
}

async function createFile(name) {
  const pointers = name.split('/');

  const fileName = pointers.splice(-1)[0];

  this._createFolder(pointers.join('/'));

  fs.writeFileSync([...pointers, fileName].join('/') + '.json');

  return this;
}

function set(_key, _value) {
  if (this.valueType == ValueType.DIRECTORY) {
    throw new Error('Only values can be set');
  }
  let target = JSON.parse(fs.readFileSync(this.targetFile, 'UTF-8'));

  const value = _value || _key;
  const extraPointers = _value === undefined ? [] : _key.includes('.') ? _key.split('.').filter(p => p != '') : [_key];
  const pointers = [...this.pointers, ...extraPointers];

  // ensure all pointers exist
  for (let i = 0; i < pointers.length; i++) {
    if (target[pointers.slice(0, -1)] == undefined) target[pointers.slice(0, -1)] = {};
  }

  console.log(pointers);

  console.log(target[pointers]);

  target[pointers] = value;

  fs.writeFileSync(this.targetFile, JSON.stringify(target, null, 2));

  return this;
}

async function rename(newName) {
  switch (this.valueType) {
    case ValueType.DIRECTORY:
    case ValueType.FILE:
      const foldersDir = this.targetFile.split('/').slice(0, -1);
      let newPath = [...foldersDir, newName].join('/');

      if (this.valueType === ValueType.FILE) {
        newPath += '.json';
      }

      fs.renameSync(this.targetFile, newPath);
      break;
    case ValueType.VALUE:
      let target = JSON.parse(fs.readFileSync(this.targetFile, 'UTF-8'));
      const oldKey = this.pointers[this.pointers.length - 1];

      if (target[oldKey] !== undefined) {
        target[newName] = target[oldKey];
        delete target[oldKey];
        fs.writeFileSync(this.targetFile, JSON.stringify(target, null, 2));
      }
      break;
  }

  return this;
}

async function remove() {
  switch (this.valueType) {
    case ValueType.DIRECTORY:
      fs.rmdirSync(this.targetFile, { recursive: true });
      break;
    case ValueType.FILE:
      fs.unlinkSync(this.targetFile);
      break;
    case ValueType.VALUE:
      let target = JSON.parse(fs.readFileSync(this.targetFile, 'UTF-8'));

      const keyToRemove = this.pointers[this.pointers.length - 1];

      if (target[keyToRemove] !== undefined) {
        delete target[keyToRemove];
        fs.writeFileSync(this.targetFile, JSON.stringify(target, null, 2));
      }
      break;
  }

  return this;
}

export { createFolder, createFile, set, rename, remove };
