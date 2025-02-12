import * as fs from 'fs';
import path from 'path';

import { ValueType } from '../../utils/enums.js';
import { parseOptionalParams, generateRandomId, omit } from '../../utils/utilities.js';
// NOTE: import from here, avoid circular dependency
import EventManager from '../../utils/structures/EventManager.js';

/**
 * Defines a schema for data validation and transformation.
 * @param {Object} blueprint - Blueprint defining the schema.
 * @param {Object} [options={}] - Additional options for schema.
 * @throws {Error} If not a folder or if options/blueprint are missing.
 * @returns {Object} An object containing queued methods.
 */
function schema(blueprint, options = {}) {
  if (this.valueType != ValueType.DIRECTORY) throw new Error('Not a folder');
  if (!options || !blueprint) throw new Error('Options and blueprint are required.');

  const clone = this._clone();

  clone.eventManager = new EventManager();
  clone.blueprint = blueprint;
  clone.schemaOptions = {
    ...options,
    omit: Object.entries(blueprint)
      .filter(i => i[1]?.omit)
      .map(i => i[0]),
    populate: Object.fromEntries(Object.entries(blueprint).filter(i => i[1]?.populate)),
    immutable: [
      'created_at',
      'updated_at',
      ...Object.entries(blueprint)
        .filter(i => i[1]?.immutable)
        .map(i => i[0]),
    ],
  };

  const methods = { hook, create, read, find, update, rename, destroy };

  const queuedMethods = Object.fromEntries(
    Object.entries(methods).map(([name, method]) => [
      name,
      (...args) => clone.queue.add(() => method.apply(clone, args)),
    ])
  );

  return queuedMethods;
}

/**
 * Adds an event hook.
 * @param {string|string[]} event - Event name(s) to hook into.
 * @param {Function} callback - Callback function to execute.
 */
function hook(event, callback) {
  if (Array.isArray(event)) {
    event.forEach(e => this.eventManager.on(e, callback));
  } else {
    this.eventManager.on(event, callback);
  }
}

/**
 * Creates a new document.
 * @param {string} name - Optional name for the document.
 * @param {Object} object - The document data to create.
 * @throws {Error} If file name contains dots.
 */
function create(...args) {
  let [name, object] = parseOptionalParams(args, 2);

  if (!name) {
    let randomIdLength = this.schemaOptions?.idLength - (this.schemaOptions?.namePrefix?.length || 0);
    name = generateRandomId(randomIdLength || 20);
  }

  if (name.includes('.')) throw new Error('File name should not contain dots.');

  object = this.eventManager.emit('pre-create', object) || object;
  object = this._validateAndTransform(object);

  if (this.schemaOptions?.timestamps) {
    object.created_at = new Date().getTime();
    object.updated_at = new Date().getTime();
  }

  if (this.schemaOptions.namePrefix) {
    name = this.schemaOptions?.namePrefix + name;
  }

  this._createFile(name, object);
  object = this._populateGet(name);
  object = this._returnFormatter({ id: name, document: object, omit: [] });

  this.eventManager.emit('post-create', object);

  return object;
}

/**
 * Reads a document by key.
 * @param {string} value - Key of the document to read.
 * @param {Object} [options={ omit: this.schemaOptions.omit }] - Options for reading.
 * @returns {Object} The read document, with omitted fields.
 */
function read(value, options = { omit: this.schemaOptions.omit }) {
  this.eventManager.emit('pre-read', value);

  const result = this._get(value);

  if (result.valueType == ValueType.DIRECTORY) return null;

  let resultData = this._returnFormatter({ id: value, document: this._populateGet(value), omit: options.omit });

  this.eventManager.emit('post-read', resultData);

  return resultData;
}

/**
 * Finds documents matching a query.
 * @param {Object|Function} query - Query object or function.
 * @param {Object} [options={ first: false, omit: this.schemaOptions.omit }] - Options for finding.
 * @returns {Object|[string, string]} The found document(s).
 */
function find(query, options = {}) {
  this.eventManager.emit('pre-find', query);

  this._dirNavigator();
  const files = fs.readdirSync(this.targetFile);
  let result = [];

  for (const file of files) {
    const fileName = path.parse(file).name;
    const fileData = this._get(fileName).data;

    let isMatch = false;
    if (typeof query === 'object') {
      isMatch = Object.keys(query).every(key => fileData?.[key] === query[key]);
    } else if (typeof query === 'function') {
      // NOTE: so we don't need optional chaining (user?.age)
      try {
        isMatch = query(fileData);
      } catch (e) {}
    }

    if (isMatch) {
      result.push(this._returnFormatter({ id: fileName, document: fileData, omit: options?.omit }));

      if (options?.first) {
        result = result[0];
        // NOTE: consistent with create method
        break;
      }
    }
  }

  // supporting 2 formatting types requires this :/
  if (Array.isArray(result) && !this.schemaOptions?.inlineId && !options?.first) {
    result = Object.fromEntries(result);
  }

  // TODO: unit tests for second format type in all methods

  this.eventManager.emit('post-find', result);

  return result;
}

/**
 * Updates a document.
 * @param {string} key - Key of the document to read.
 * @param {Object} object - The document data to update.
 * @throws {Error} If file name is missing.
 * @returns {Object|null} The updated document, or null if update fails.
 */
function update(key, value, options) {
  if (!key) throw new Error('File name is required');

  if (Object.keys(value).some(v => this.schemaOptions.immutable.includes(v))) {
    // silent fail
    return null;
  }

  value = this.eventManager.emit('pre-update', value) || value;

  const target = this._get(key);
  let newValue = { ...target.data, ...value };

  if (this.schemaOptions?.timestamps) {
    // TODO: allow certain keys to not update timestamp
    // for example in the blueprint -> silent: true
    newValue.updated_at = new Date().getTime();
  }

  newValue = this._validateAndTransform(newValue);
  target._set(newValue);

  newValue = this._returnFormatter({ id: key, document: newValue, omit: options?.omit });

  this.eventManager.emit('post-update', newValue);

  return newValue;
}

/**
 * Renames a document.
 *
 * @param {string} oldName - The current name of the entity to be renamed.
 * @param {string} newName - The new name to assign to the entity.
 * @throws {Error} If either oldName or newName is not provided.
 */
function rename(oldName, newName) {
  if (!oldName || !newName) throw new Error('Old name and new name required');

  let value = this.eventManager.emit('pre-rename', oldName) || newName;
  this._get(oldName).rename(value);
  this.eventManager.emit('post-rename', value);
}

/**
 * Destroys a document.
 * @param {*} target - Key of the document to destroy.
 */
function destroy(target) {
  const document = this._get(target);

  this.eventManager.emit('pre-destroy', target);

  document.remove();

  this.eventManager.emit('post-destroy', document.data); // no return formatting
}

export { schema };
