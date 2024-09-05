import { ValueType } from '../../utils/enums';

function isEmpty() {
  let value = this.data;

  if (value === null || value === undefined) return true;

  if (Array.isArray(value) || typeof value === 'string') {
    return value.length === 0;
  } else if (value === Object(value)) {
    return Object.keys(value).length === 0;
  } else {
    throw new Error('isEmpty() can only be used on arrays, objects, or strings.');
  }
}

function isEqual(compareValue) {
  const deepEqual = (a, b) => {
    if (a === b) return true;

    if (typeof a !== typeof b) return false;

    if (typeof a === 'object' && typeof b === 'object') {
      if (Array.isArray(a) !== Array.isArray(b)) return false;

      const aKeys = Object.keys(a);
      const bKeys = Object.keys(b);

      if (aKeys.length !== bKeys.length) return false;

      return aKeys.every(key => deepEqual(a[key], b[key]));
    }

    return false;
  };

  return deepEqual(this.data, compareValue);
}

function log() {
  console.log(this.data);
  return this;
}

function tap(callback) {
  if (typeof callback !== 'function') throw new Error('You must provide a function to tap().');
  callback(this.data);
  return this;
}

function populate(location) {
  if (this.valueType == ValueType.VALUE) {
    throw new Error('You can only populate at the value level.');
  }

  const pointers = location.split('.').filter(p => p !== '');
  let current = this.data;

  for (const key of pointers) {
    if (current.hasOwnProperty(key)) {
      current = current[key];
    } else {
      throw new Error(`Path not found: ${key}`);
    }
  }

  const clone = this._clone({ clean: true });

  if (!Array.isArray(current)) {
    this.data[pointers] = clone._getTree(current);
  } else {
    this.data[pointers] = current.map(item => clone._getTree(item));
  }

  return this;
}

function select(desiredFields) {
  this.data = Object.assign(
    {},
    ...desiredFields.map(field => ([field] in this.data ? { [field]: this.data[field] } : {}))
  );

  return this;
}

export { populate };

// NOTE: Some provided by GPT, check and test
