function type() {
  let value = this.value();
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

function isEmpty() {
  let value = this.value();

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

  return deepEqual(this.value(), compareValue);
}

function log() {
  console.log(this.value());
  return this;
}

function tap(callback) {
  if (typeof callback !== 'function') throw new Error('You must provide a function to tap().');
  callback(this.value());
  return this;
}

// NOTE: Some provided by GPT, check and test
