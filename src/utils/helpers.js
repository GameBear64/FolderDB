import * as fs from 'fs';
import path from 'path';

import methods from '../methods/all.js';
import * as helpers from './helpers.js';

import { ValueType } from './enums.js';

const rangeRegex = /\[(-?\d*):(-?\d*)]/;

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
  this.__bindHelpers(clone, Object.values(helpers));
  this.__bindMethods(clone, Object.values(methods));

  return clone;
}

function dirNavigator(directory = this.dbPath) {
  let dir = fs.readdirSync(directory);

  if (this.pointers.length === 0) {
    this.data = dir;
    return;
  }

  if (dir.includes(this.pointers[0])) {
    this.targetFile = path.join(this.targetFile, this.pointers[0]);

    return this._dirNavigator(path.join(directory, this.pointers.shift()));
  }

  return;
}

function getFile() {
  // Going back with .back()
  if (fs.lstatSync(this.targetFile).isFile()) {
    const fileDetails = path.parse(this.targetFile);

    if (fileDetails.ext == '.json') {
      this.data = JSON.parse(fs.readFileSync(this.targetFile, 'UTF-8'));
    }

    this.valueType = ValueType.FILE;
    return;
  }

  try {
    const currentDir = fs.readdirSync(this.targetFile);
    const foundFile = path.parse(currentDir.find(file => path.parse(file).name == this.pointers[0]));

    if (!foundFile) return;

    this.targetFile = path.join(this.targetFile, foundFile.base);
    this.pointers.shift();

    if (foundFile.ext == '.json') {
      this.data = JSON.parse(fs.readFileSync(this.targetFile, 'UTF-8'));
    } else {
      this.data = { buffer: fs.readFileSync(this.targetFile), name: foundFile.name, ext: foundFile.ext };
    }

    this.valueType = ValueType.FILE;
  } catch (error) {
    return;
  }
}

function fileNavigator() {
  if (this.valueType == ValueType.DIRECTORY) return;
  if (this.pointers.length > 0) this.valueType = ValueType.VALUE;

  for (const key of this.pointers) {
    if (this.data?.hasOwnProperty(key)) {
      this.data = this.data[key];
    } else if (rangeRegex.test(key) && Array.isArray(this.data)) {
      // Range pattern detected
      let [start, end] = key.slice(1, -1).split(':');
      this.data = this.data.slice(start || 0, end || this.data.length);
    } else if (Array.isArray(this.data)) {
      this.data = this.data.map(item => item[key]);
    } else {
      this.data = null;
      break;
    }
  }
}

function traverseDir(currentDir) {
  const dirContent = fs.readdirSync(currentDir);
  const result = {};

  dirContent.forEach(item => {
    const fullPath = path.join(currentDir, item);

    if (fs.lstatSync(fullPath).isDirectory()) {
      result[item] = traverseDir(fullPath);
    } else if (item.endsWith('.json')) {
      const data = fs.readFileSync(fullPath, 'utf-8');
      result[item.slice(0, -5)] = JSON.parse(data);
    } else {
      result[item] = null; // Dead end
    }
  });

  return result;
}

const traverseAndSet = (current, keys, newValue) => {
  let pointer = current;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // Range key
    if (rangeRegex.test(key) && Array.isArray(pointer)) {
      const [start, end] = key.slice(1, -1).split(':').map(Number);
      const remainingKeys = keys.slice(i + 1);

      for (let j = start; j < end; j++) {
        traverseAndSet(pointer[j], remainingKeys, newValue);
        // NOTE: A lot of loops...
      }
      return;
    }

    // Normal key
    if (i === keys.length - 1) {
      pointer[key] = newValue;
    } else {
      if (!pointer[key] || typeof pointer[key] !== 'object') {
        pointer[key] = {};
      }
      pointer = pointer[key];
    }
  }
};

export { clone, dirNavigator, getFile, fileNavigator, traverseDir, traverseAndSet };
