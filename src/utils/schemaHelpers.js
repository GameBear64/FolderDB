import { pick, omit as omitFn, transformCase, parseOptionalParams } from './utilities.js';

function validateAndTransform(object) {
  if (!this.blueprint) throw new Error('Cant use validateBlueprint() outside of schema');

  for (const key in this.blueprint) {
    const rules = this.blueprint[key];

    if (object[key]) {
      object[key] = validateBlueprint.bind(this)(object[key], rules, key);
      object[key] = transformBlueprint(object[key], rules);
    } else {
      const result = additiveTransform(rules, key);
      if (result != undefined) object[key] = result;
    }
  }

  const timestamps = this.schemaOptions?.timestamps ? ['created_at', 'updated_at'] : [];
  return pick(object, [...Object.keys(this.blueprint), ...timestamps]);
}

function validateBlueprint(value, rules, key) {
  if (rules?.type) {
    const types = Array.isArray(rules.type) ? rules.type : [rules.type];

    const isValidType = (value, type) =>
      (type === Array && Array.isArray(value)) || typeof value === type.name.toLowerCase();

    if (!types.some(type => isValidType(value, type))) {
      throw new Error(`Schema: ${key} must be of type ${types.map(t => t.name).join(' or ')}.`);
    }
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

function additiveTransform(rules, key) {
  if (rules?.required) {
    throw new Error(`Schema: ${key} is required.`);
  }

  let value;

  // it could be false, check by property
  if (rules.hasOwnProperty('default')) {
    value = rules.default;
  }

  return value;
}

function populateGet(name) {
  let object = this._get(name);
  for (const key in this.schemaOptions.populate) {
    try {
      if (object.data.hasOwnProperty(key)) object = object._populate(key);
    } catch (error) {
      /* silent fail */
      object.data[key] = null;
    }
  }
  return object.data;
}

function returnFormatter({ id, document, omit }) {
  document = omitFn(document, omit || this.schemaOptions.omit);

  if (!id) return document;
  if (!this.schemaOptions?.inlineId) return [id, document];
  return { _id: id, ...document };
}

export { validateAndTransform, populateGet, returnFormatter };
