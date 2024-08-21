function merge(object) {
  let value = this.value();
  if (value !== Object(value) || object !== Object(object)) throw new Error('merge() can only be used on objects.');

  this.set({ ...value, ...object });
  return this;
}

function invert() {
  let value = this.value();
  if (value !== Object(value)) throw new Error('invert() can only be used on objects.');

  const inverted = Object.keys(value).reduce((acc, key) => {
    acc[value[key]] = key;
    return acc;
  }, {});

  this.set(inverted);
  return this;
}

// Returns a new object with only the specified keys from the original object.
function pick(...keys) {
  let value = this.value();
  if (value !== Object(value)) throw new Error('pick() can only be used on objects.');

  const picked = keys.reduce((obj, key) => {
    if (key in value) obj[key] = value[key];
    return obj;
  }, {});

  this.set(picked);
  return this;
}

function omit(...keys) {
  let value = this.value();
  if (value !== Object(value)) throw new Error('omit() can only be used on objects.');

  const omitted = Object.keys(value).reduce((obj, key) => {
    if (!keys.includes(key)) obj[key] = value[key];
    return obj;
  }, {});

  this.set(omitted);
  return this;
}

// NOTE: Some provided by GPT, check and test
