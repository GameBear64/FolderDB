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
function dirNavigator(directory = this.dbPath) {
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

    return this._dirNavigator(path.join(directory, this.pointers.shift()));
  }

  return { doNext: true };
}

/**
 * Reads a JSON file and parses its content.
 *
 * @returns {void}
 * @throws {Error} - Throws an error if the file cannot be read or parsed.
 */
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

/**
 * Navigates through the data structure based on the current pointers.
 *
 * @returns {void}
 * @throws {Error} - Throws an error if a path in the pointers does not exist in the data.
 */
function fileNavigator() {
  if (!this.pointers || !this.data) {
    throw new Error('Pointers or data not properly initialized.');
  }

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

  clone.pointers = value.split('.').filter(p => p !== '');

  if (clone.valueType == ValueType.DIRECTORY) {
    const { doNext } = clone._dirNavigator();

    if (doNext) {
      clone._getFile();
      clone._fileNavigator();
    }
  } else {
    clone._fileNavigator();
  }

  return clone;
}

export { dirNavigator, getFile, fileNavigator, get };
