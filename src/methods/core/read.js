import * as fs from 'fs';
import path from 'path';

import { ValueType } from '../../utils/enums';

/**
 * Navigates through a directory structure based on the current pointers.
 *
 * @param {string} [directory=this.dbPath] The directory path to navigate.
 * @returns {Object|this} Returns the current instance or an object indicating the next action.
 * @throws {Error} Throws an error if the directory cannot be read.
 */
function _dirNavigator(directory = this.dbPath) {
  if (!fs.existsSync(directory) || !fs.lstatSync(directory).isDirectory()) {
    throw new Error(`Invalid directory path: ${directory}`);
  }

  let dir = fs.readdirSync(directory);

  if (this.pointers.length === 0) {
    this.data = dir;
    return this;
  }

  if (dir.includes(this.pointers[0])) {
    this.targetFile = path.join(this.targetFile, this.pointers[0]);

    return this.__dirNavigator(path.join(directory, this.pointers.shift()));
  }

  return { doNext: true };
}

/**
 * Reads a JSON file and parses its content.
 *
 * @returns {void}
 * @throws {Error} - Throws an error if the file cannot be read or parsed.
 */
function _getFile() {
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

    if (!foundFile) throw new Error('Target file not found');

    this.targetFile = path.join(this.targetFile, foundFile.base);
    this.pointers.shift();

    if (foundFile.ext == '.json') {
      this.data = JSON.parse(fs.readFileSync(this.targetFile, 'UTF-8'));
    } else {
      this.data = { buffer: fs.readFileSync(this.targetFile), name: foundFile.name, ext: foundFile.ext };
    }

    this.valueType = ValueType.FILE;
  } catch (error) {
    throw new Error(`Error reading file ${this.targetFile}`, error);
  }
}

/**
 * Navigates through the data structure based on the current pointers.
 *
 * @returns {void}
 * @throws {Error} - Throws an error if a path in the pointers does not exist in the data.
 */
function _fileNavigator() {
  if (this.pointers.length > 0) this.valueType = ValueType.VALUE;
  // we stop removing pointers to be able to navigate back here

  for (const key of this.pointers) {
    if (this.data.hasOwnProperty(key)) {
      this.data = this.data[key];
    } else {
      throw new Error(`Path not found: ${key}`);
    }
  }
}

/**
 * Retrieves a value based on a dot-separated string path.
 *
 * @param {string} value - The dot-separated string path to retrieve the value.
 * @returns {Object} - Returns a clone of the current instance with the retrieved value.
 * @throws {Error} - Throws an error if the value is not a string.
 */
function get(value) {
  if (typeof value !== 'string') {
    throw new Error('Value must be string');
  }

  const clone = this._clone();

  clone.pointers = [...clone.pointers, ...value.split('.').filter(p => p !== '')];

  const { doNext } = clone.__dirNavigator();

  if (doNext) {
    clone.__getFile();
    clone.__fileNavigator();
  }

  return clone;
}

function _traverseDir(currentDir) {
  const dirContent = fs.readdirSync(currentDir);
  const result = {};

  dirContent.forEach(item => {
    const fullPath = path.join(currentDir, item);

    if (fs.lstatSync(fullPath).isDirectory()) {
      result[item] = _traverseDir(fullPath);
    } else if (item.endsWith('.json')) {
      const data = fs.readFileSync(fullPath, 'utf-8');
      result[item.slice(0, -5)] = JSON.parse(data);
    } else {
      result[item] = null; // Dead end
    }
  });

  return result;
}

/**
 * Recursively navigates through a directory and builds a tree structure.
 *
 * @param {string} value - The dot-separated string path to retrieve the value.
 * @returns {Object} - Returns the directory tree structure.
 * @throws {Error} - Throws an error if the directory cannot be read.
 */
function getTree(value) {
  if (typeof value !== 'string') {
    throw new Error('Value must be string');
  }

  const clone = this._clone();
  const pointers = value.split('.').filter(p => p !== '');

  let currentDir = clone.dbPath;

  for (let i = 0; i < pointers.length; i++) {
    if (clone.valueType == ValueType.DIRECTORY) {
      currentDir = path.join(currentDir, pointers[i]);

      if (fs.existsSync(currentDir + '.json')) {
        clone.pointers = pointers.slice(i, pointers.length);
        clone.__getFile();
      } else {
        clone.targetFile = currentDir;
      }
    }
  }

  if (clone.valueType == ValueType.FILE) {
    clone.__fileNavigator();
    return clone.data;
  } else {
    return _traverseDir(currentDir);
  }
}

/**
 * Reverses the navigation by going back a specified number of steps up the directory or file structure.
 *
 * @param {number} steps - The number of steps to go back. Defaults to 1.
 * @returns {this} - Returns the current instance for chaining.
 * @throws {Error} - Throws an error if unable to navigate back.
 */
function back(steps = 1) {
  if (typeof steps !== 'number' || steps < 1) {
    throw new Error('Steps must be a positive number');
  }

  const totalDepth = this.targetFile.replace(this.dbPath, '').split(path.sep).length - 1 + this.pointers.length;
  if (steps > totalDepth) {
    throw new Error('Steps cannot be more than the available depth');
  }

  for (let i = 0; i < steps; i++) {
    this.pointers.pop();

    switch (this.valueType) {
      case ValueType.VALUE:
        this.__getFile();
        this.__fileNavigator();
        break;

      case ValueType.FILE:
        this.valueType = ValueType.DIRECTORY;
        this.pointers = path.dirname(this.targetFile.replace(this.dbPath, '')).split(path.sep).slice(1);
        this.targetFile = this.dbPath;

      case ValueType.DIRECTORY:
        this.data = fs.readdirSync(`${this.targetFile}/${this.pointers.join(path.sep)}`);
        break;
    }
  }

  return this;
}

export { _dirNavigator, _getFile, _fileNavigator, get, getTree, back };
