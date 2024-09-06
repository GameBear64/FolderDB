import { ValueType } from '../../utils/enums';

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

function tap(callback) {
  if (typeof callback !== 'function') throw new Error('You must provide a function to tap().');
  callback(this.data);
  return this;
}

export { populate, select, tap };
