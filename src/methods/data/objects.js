function merge(object) {
  let value = this.data;
  if (value !== Object(value) || object !== Object(object)) throw new Error('merge() can only be used on objects.');

  this._set({ ...value, ...object });
  return this;
}

function pick(desiredFields) {
  let value = this.data;
  if (value !== Object(value)) throw new Error('pick() can only be used on objects.');
  if (!Array.isArray(desiredFields)) throw new Error('pick() needs an array with the desired fields');

  this._set(Object.assign({}, ...desiredFields.map(field => ([field] in value ? { [field]: value[field] } : {}))));

  return this;
}

function omit(fieldsToOmit) {
  let value = this.data;
  if (value !== Object(value)) throw new Error('omit() can only be used on objects.');
  if (!Array.isArray(fieldsToOmit)) throw new Error('omit() needs an array with the fields to omit');

  this._set(
    Object.assign(
      {},
      ...Object.keys(value)
        .filter(key => !fieldsToOmit.includes(key))
        .map(key => ({ [key]: value[key] }))
    )
  );

  return this;
}

// NOTE: intersection, XOR, difference and differenceInsert in the arrays methods also handle objects
export { merge, pick, omit };
