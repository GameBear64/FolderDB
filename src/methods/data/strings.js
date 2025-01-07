import { transformCase } from '../../utils/utilities.js';

/**
 * Changes the case format of the target string property.
 *
 * @param {CaseFormat} format - The desired case format to change the string to.
 * @returns {Object} The current object for chaining.
 * @throws {Error} Throws an error if the target property is not a string.
 * @throws {Error} Throws an error if the provided format is not supported.
 */
function changeCase(format) {
  let value = this.data;

  this._set(transformCase(value, format));

  return this;
}

/**
 * Normalizes the case of the target string by converting it to a sentence case format.
 * Handles camelCase, PascalCase, underscores, hyphens, and multiple spaces.
 *
 * @returns {Object} The current object for chaining.
 * @throws {Error} Throws an error if the target property is not a string.
 */
function normalizeCase() {
  let value = this.data;

  if (typeof value !== 'string') {
    throw new Error('You can only use normalizeCase on strings.');
  }

  this._set(
    value
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Convert camelCase and PascalCase to separate words
      .replace(/[_-]/g, ' ') // Replace underscores and hyphens with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
      .trim() // Remove leading and trailing spaces
      .toLowerCase() // Convert to lowercase
      .replace(/^\w/g, match => match.toUpperCase()) // Capitalize first letter of sentence
  );

  return this;
}

export { changeCase, normalizeCase };
