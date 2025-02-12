import { ValueType } from '../../utils/enums.js';

import * as fs from 'fs';
import path from 'path';

/**
 * Asynchronously creates a new folder at the target location.
 *
 * @param {string} name - The name of the folder to create.
 * @returns {Object} The current instance for chaining.
 */
function createFolder(name) {
  this.targetFile = fs.mkdirSync(path.resolve(this.targetFile, name), {
    recursive: true,
  });
  return this;
}

/**
 * Asynchronously creates a new file at the target location.
 * If the file has no extension, a .json file is created.
 * If directories are included in the name, they are created if they don't exist.
 *
 * @param {string} name - The name of the file, including directory if necessary.
 * @param {Buffer|Object|string} [buffer] - The content to write to the file. Defaults to an empty JSON object if omitted.
 * @returns {Object} The current instance for chaining.
 */
function createFile(name, buffer) {
  const fullPath = path.resolve(this.targetFile, ...this.pointers);
  const details = path.parse(name);
  const dirPath = path.resolve(fullPath, details.dir);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = details.ext
    ? path.resolve(dirPath, details.base)
    : path.resolve(dirPath, details.name + '.json');

  fs.writeFileSync(
    filePath,
    details.ext ? buffer : JSON.stringify(buffer || {}, null, 2)
  );
  return this;
}

/**
 * Sets a value at a specific key or path within the file.
 * Throws an error if attempting to set a value on a directory type.
 *
 * @param {string} _key - The key or path where the value should be set.
 * @param {any} [_value] - The value to set. If omitted, _key is treated as the value.
 * @returns {Object} The current instance for chaining.
 * @throws {Error} If attempting to set a value in a directory.
 */
function set(_key, _value) {
  if (this.valueType == ValueType.DIRECTORY) {
    throw new Error('Not a file');
  }

  let value = _value !== undefined ? _value : _key;
  let pointers = this.pointers;

  if (_value !== undefined) {
    const extraPointers = _key.includes('.')
      ? _key.split('.').filter(Boolean)
      : [_key];
    pointers = [...pointers, ...extraPointers];
  }

  this.data = JSON.parse(fs.readFileSync(this.targetFile, 'UTF-8'));

  if (pointers.length === 0) {
    this.data = value;
  } else {
    this._traverseAndSet(this.data, pointers, value);
  }

  fs.writeFileSync(this.targetFile, JSON.stringify(this.data, null, 2));
  this._fileNavigator(); // Get updated value
  return this;
}

/**
 * Renames a file, folder, or value.
 *
 * @param {string} newName - The new name for the file, folder, or value.
 * @returns {Object} The current instance for chaining.
 */
function rename(newName) {
  switch (this.valueType) {
    case ValueType.DIRECTORY:
    case ValueType.FILE:
      fs.renameSync(
        this.targetFile,
        path.resolve(
          path.parse(this.targetFile).dir,
          newName + path.parse(this.targetFile).ext
        )
      );
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

/**
 * Removes a directory, file, or value based on its type.
 *
 * @returns {Object} The current instance for chaining.
 */
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
