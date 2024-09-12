import { ValueType } from '../../utils/enums';

import * as fs from 'fs';
import path from 'path';

async function createFolder(name) {
  fs.mkdirSync(path.resolve(this.targetFile, name), { recursive: true });

  return this;
}

async function createFile(name, buffer) {
  const details = path.parse(name);

  if (details.dir != '') {
    this._createFolder(path.resolve(this.targetFile, details.dir));
  }

  if (details.ext == '') {
    fs.writeFileSync(path.resolve(this.targetFile, details.dir, details.name + '.json'), buffer || JSON.stringify({}));
  } else {
    fs.writeFileSync(path.resolve(this.targetFile, details.dir, details.base), buffer);
  }
  return this;
}

function set(_key, _value) {
  if (this.valueType == ValueType.DIRECTORY) {
    throw new Error('Only values can be set');
  }

  const value = _value !== undefined ? _value : _key;
  const extraPointers = _value === undefined ? [] : _key.includes('.') ? _key.split('.').filter(p => p != '') : [_key];
  const pointers = [...this.pointers, ...extraPointers];

  this.data = JSON.parse(fs.readFileSync(this.targetFile, 'UTF-8'));
  let current = this.data; // reference, pointer

  for (let i = 0; i < pointers.length - 1; i++) {
    const key = pointers[i];
    if (typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }

  current[pointers[pointers.length - 1]] = value;

  fs.writeFileSync(this.targetFile, JSON.stringify(this.data, null, 2));

  // Get updated value
  this.__fileNavigator();

  return this;
}

function rename(newName) {
  switch (this.valueType) {
    case ValueType.DIRECTORY:
    case ValueType.FILE:
      fs.renameSync(this.targetFile, path.resolve(path.parse(this.targetFile).dir, newName));
      break;
    case ValueType.VALUE:
      const file = JSON.parse(fs.readFileSync(this.targetFile, 'UTF-8'));
      const oldKey = this.pointers.pop();
      const target = file[this.pointers];

      if (target.hasOwnProperty(oldKey)) {
        target[newName] = target[oldKey];
        delete target[oldKey];

        this.data = target;
        this.pointers.push(newName);
        fs.writeFileSync(this.targetFile, JSON.stringify(file, null, 2));
      }

      break;
  }

  return this;
}

function remove() {
  switch (this.valueType) {
    case ValueType.DIRECTORY:
      fs.rmdirSync(this.targetFile, { recursive: true });
      break;
    case ValueType.FILE:
      fs.unlinkSync(this.targetFile);
      break;
    case ValueType.VALUE:
      const file = JSON.parse(fs.readFileSync(this.targetFile, 'UTF-8'));
      const keyToRemove = this.pointers.pop();
      const target = file[this.pointers];

      if (target.hasOwnProperty(keyToRemove)) {
        delete target[keyToRemove];

        this.data = target;
        fs.writeFileSync(this.targetFile, JSON.stringify(file, null, 2));
      }
      break;
  }

  return this;
}

export { createFolder, createFile, set, rename, remove };
