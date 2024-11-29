import * as fs from 'fs';
import path from 'path';

import methods from '../methods/all.js';
import * as helpers from './helpers.js';

import { ValueType } from './enums.js';

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
  if (!fs.existsSync(directory) || !fs.lstatSync(directory).isDirectory()) {
    this.createFolder(directory);
  }

  let dir = fs.readdirSync(directory);

  if (this.pointers.length === 0) {
    this.data = dir;
    return this;
  }

  if (dir.includes(this.pointers[0])) {
    this.targetFile = path.join(this.targetFile, this.pointers[0]);

    return this._dirNavigator(path.join(directory, this.pointers.shift()));
  }

  return { doNext: true };
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
  if (this.pointers.length > 0) this.valueType = ValueType.VALUE;
  // we stop removing pointers to be able to navigate back here

  for (const key of this.pointers) {
    if (this.data?.hasOwnProperty(key)) {
      this.data = this.data[key];
    } else {
      this.data = null;
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

export { clone, dirNavigator, getFile, fileNavigator, traverseDir };
