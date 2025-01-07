import { pick as _pick, omit as _omit } from '../../utils/utilities.js';

/**
 * Merges the properties of the given object with the current object.
 * If there are overlapping properties, the values from the given object will overwrite those in the current object.
 *
 * @param {Object} object - The object whose properties will be merged into the current object.
 * @returns {Object} The current object for chaining.
 * @throws {Error} Throws an error if either the current data or the provided object is not an object.
 */
function merge(object) {
  let value = this.data;
  if (value !== Object(value) || object !== Object(object)) throw new Error('merge() can only be used on objects.');

  this._set({ ...value, ...object });
  return this;
}

/**
 * Picks specific fields from the current object and sets them as the new object.
 *
 * @param {string[]} desiredFields - An array of fields to pick from the current object.
 * @returns {Object} The current object for chaining.
 * @throws {Error} Throws an error if the current data is not an object, or if desiredFields is not an array.
 */
function pick(desiredFields) {
  let value = this.data;
  if (value !== Object(value)) throw new Error('pick() can only be used on objects.');
  if (!Array.isArray(desiredFields)) throw new Error('pick() needs an array with the desired fields');

  this._set(_pick(value, desiredFields));

  return this;
}

/**
 * Omits specific fields from the current object.
 *
 * @param {string[]} fieldsToOmit - An array of fields to omit from the current object.
 * @returns {Object} The current object for chaining.
 * @throws {Error} Throws an error if the current data is not an object, or if fieldsToOmit is not an array.
 */
function omit(fieldsToOmit) {
  let value = this.data;
  if (value !== Object(value)) throw new Error('omit() can only be used on objects.');
  if (!Array.isArray(fieldsToOmit)) throw new Error('omit() needs an array with the fields to omit');

  this._set(_omit(value, fieldsToOmit));

  return this;
}

// NOTE: intersection, XOR, difference and differenceInsert in the arrays methods also handle objects
export { merge, pick, omit };
