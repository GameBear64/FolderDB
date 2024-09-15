import { CaseFormat } from '../../utils/enums';

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

  if (typeof value !== 'string') throw new Error('You can only use changeCase on strings.');
  if (!Object.values(CaseFormat).includes(format)) throw new Error('Unsupported case format.');

  switch (format) {
    case CaseFormat.LOWER:
      this._set(value.toLowerCase());
      break;
    case CaseFormat.UPPER:
      this._set(value.toUpperCase());
      break;

    case CaseFormat.PASCAL:
      this._set(value.replace(/\w+/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()));
      break;

    case CaseFormat.SNAKE:
      this._set(value.replace(/\W+/g, '_').toLowerCase());
      break;

    case CaseFormat.CAMEL:
      this._set(
        value
          .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
            index == 0 ? match.toLowerCase() : match.toUpperCase()
          )
          .replace(/\s+/g, '')
      );
      break;

    case CaseFormat.KEBAB:
      this._set(value.replace(/\W+/g, '-').toLowerCase());
      break;

    case CaseFormat.FLAT:
      this._set(value.replace(/\W+/g, '').toLowerCase());
      break;

    case CaseFormat.TRAIN:
      this._set(
        value
          .replace(/\W+/g, '-')
          .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
            index == 0 ? match.toUpperCase() : match.toUpperCase()
          )
      );
      break;

    case CaseFormat.SLUG:
      this._set(
        value
          .toString()
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '')
      );
      break;

    case CaseFormat.REVERSE:
      this._set(value.split('').reverse().join(''));
      break;
  }
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
