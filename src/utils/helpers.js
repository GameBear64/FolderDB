import * as fs from 'fs';
import path from 'path';

import methods from '../methods/all.js';
import * as helpers from './helpers.js';
import { pick, transformCase } from './utilities.js';

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

function validateAndTransform(object) {
  if (!this.blueprint) throw new Error('Cant use validateBlueprint() outside of schema');

  for (const key in this.blueprint) {
    const rules = this.blueprint[key];

    if (object[key]) {
      object[key] = validateBlueprint(object[key], rules, key);
      object[key] = transformBlueprint(object[key], rules);
    } else if (rules.hasOwnProperty('default')) {
      object[key] = rules.default;
    } else if (rules?.required) {
      throw new Error(`Schema: ${key} is required.`);
    }
  }

  const timestamps = this.schemaOptions?.timestamps ? ['created_at', 'updated_at'] : [];
  return pick(object, [...Object.keys(this.blueprint), ...timestamps]);
}

function validateBlueprint(value, rules, key) {
  if (rules?.type && typeof value !== rules.type.name.toLowerCase()) {
    throw new Error(`Schema: ${key} must be of type ${rules.type.name}.`);
  }

  if (rules?.minLength && typeof value === 'string' && value.length < rules.minLength) {
    throw new Error(`Schema: ${key} must have at least ${rules.minLength} characters.`);
  }

  if (rules?.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
    throw new Error(`Schema: ${key} must have at most ${rules.maxLength} characters.`);
  }

  if (rules?.min !== undefined && typeof value === 'number' && value < rules.min) {
    throw new Error(`Schema: ${key} must be at least ${rules.min}.`);
  }

  if (rules?.max !== undefined && typeof value === 'number' && value > rules.max) {
    throw new Error(`Schema: ${key} must be at most ${rules.max}.`);
  }

  if (rules?.enum && !rules.enum.includes(value)) {
    throw new Error(`Schema: ${key} must be one of ${rules.enum.join(', ')}.`);
  }

  if (rules?.validate && typeof rules.validate === 'function') {
    if (!rules.validate(value)) throw new Error(`Schema: ${key} does not satisfy custom validation rule.`);
  }

  return value;
}

function transformBlueprint(value, rules) {
  if (rules?.trim && typeof value === 'string') {
    value = value.trim();
  }

  if (rules?.innerTrim && typeof value === 'string') {
    value = value.replace(/\s+/g, ' ').trim();
  }

  if (rules?.toCase && typeof value === 'string') {
    value = transformCase(value, rules.toCase);
  }

  if (rules?.transform && typeof rules.transform === 'function') {
    value = rules.transform(value);
  }

  return value;
}

export { clone, dirNavigator, getFile, fileNavigator, traverseDir, traverseAndSet, validateAndTransform };
