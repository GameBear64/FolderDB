import * as fs from 'fs';
import path from 'path';

import { ValueType } from '../../utils/enums';

function dirNavigator(directory = this.dbPath) {
  let dir;
  try {
    dir = fs.readdirSync(directory);
  } catch (error) {
    throw new Error(`Error reading directory ${directory}`, error);
  }

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
  this.targetFile = path.join(this.targetFile, `${this.pointers[0]}.json`);

  try {
    let data = fs.readFileSync(this.targetFile, 'UTF-8');
    this.data = JSON.parse(data);

    this.valueType = ValueType.FILE;
  } catch (error) {
    throw new Error(`Error reading file ${this.targetFile}`, error);
  }

  this.pointers.shift();
}

function fileNavigator() {
  if (!Array.isArray(this.pointers)) {
    throw new Error('fileNav path is not an array');
  }

  // we stop removing pointers to be able to navigate back here

  for (let i = 0; i < this.pointers.length; i++) {
    this.valueType = ValueType.VALUE;
    const key = this.pointers[i];

    if (this.data.hasOwnProperty(key)) {
      this.data = this.data[key];
    } else {
      throw new Error(`Path not found: ${key}`);
    }
  }
}

function get(value) {
  if (typeof value !== 'string') {
    throw new Error('value must be string');
  }

  this.pointers = [];
  this.targetFile = this.dbPath;
  this.data = null;
  this.valueType = ValueType.DIRECTORY;

  this.pointers = value.split('.').filter(p => p !== '');

  const { doNext } = this._dirNavigator();

  if (doNext) {
    this._getFile();
    this._fileNavigator();
  }

  return this;
}

export { dirNavigator, getFile, fileNavigator, get };
