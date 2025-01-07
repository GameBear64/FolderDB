import { ValueType, TimeFormat } from '../../utils/enums.js';

import { pick, omit } from '../../utils/utilities.js';

// NOTE: General methods don't edit the value

// ========= Utility ===========
/**
 * Populates a value from a specified location in the data tree.
 * @param {string} location - Dot-separated path to the location in the data tree.
 * @returns {Object} The current object for chaining.
 * @throws {Error} Throws an error if the value type is a directory or if the path is not found.
 */
function populate(location) {
  if (this.valueType == ValueType.DIRECTORY) {
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

/**
 * Dumps the current data to the console.
 * @returns {Object} The current object for chaining.
 */
function dump() {
  console.log(this.data);

  return this;
}

/**
 * Applies a callback function to the current data without modifying it.
 * @param {Function} callback - A function to be executed on the data.
 * @returns {Object} The current object for chaining.
 * @throws {Error} Throws an error if the callback is not a function.
 */
function tap(callback) {
  if (typeof callback !== 'function') throw new Error('You must provide a function to tap().');
  callback(this.data);
  return this;
}

// ========== Array ============
/**
 * Calculates the average of an array of numbers.
 * @returns {Object} The current object for chaining.
 * @throws {Error} Throws an error if the data is not a non-empty array of numbers.
 */
function average() {
  const numbers = this.data;

  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error('Input must be a non-empty array of numbers.');
  }

  const sum = numbers.reduce((acc, num) => acc + num, 0);
  this.data = sum / numbers.length;

  return this;
}

/**
 * Selects random elements from an array.
 * @param {number} [count=1] - The number of elements to select.
 * @returns {Object} The current object for chaining.
 * @throws {Error} Throws an error if the data is not an array, the count is not a positive number, or if the count exceeds the array length.
 */
function sample(count = 1) {
  const array = this.data;

  if (!Array.isArray(array) || array.length === 0) throw new Error('Input must be a non-empty array.');

  if (typeof count !== 'number' || count <= 0) throw new Error('Count must be a positive number.');

  if (count > array.length) throw new Error('Count cannot be greater than the length of the array.');

  const getRandomElements = (arr, num) => {
    const result = [];
    const arrayCopy = [...arr];

    for (let i = 0; i < num; i++) {
      const randomIndex = Math.floor(Math.random() * arrayCopy.length);
      result.push(arrayCopy.splice(randomIndex, 1)[0]);
    }

    return result;
  };

  this.data = count === 1 ? getRandomElements(array, 1)[0] : getRandomElements(array, count);
  return this;
}

// =============== OBJECTS ============
/**
 * Picks specific fields from an object.
 * @param {string[]} desiredFields - An array of fields to pick from the object.
 * @returns {Object} The current object for chaining.
 * @throws {Error} Throws an error if the data is not an object or if the desiredFields is not an array.
 */
function selectPick(desiredFields) {
  let value = this.data;
  if (value !== Object(value)) throw new Error('selectPick() can only be used on objects.');
  if (!Array.isArray(desiredFields)) throw new Error('selectPick() needs an array with the desired fields');

  this.data = pick(value, desiredFields);

  return this;
}

/**
 * Omits specific fields from an object.
 * @param {string[]} fieldsToOmit - An array of fields to omit from the object.
 * @returns {Object} The current object for chaining.
 * @throws {Error} Throws an error if the data is not an object or if fieldsToOmit is not an array.
 */
function selectOmit(fieldsToOmit) {
  let value = this.data;
  if (value !== Object(value)) throw new Error('selectOmit() can only be used on objects.');
  if (!Array.isArray(fieldsToOmit)) throw new Error('selectOmit() needs an array with the fields to omit');

  this.data = omit(value, fieldsToOmit);

  return this;
}

// ======= TIME ==========
/**
 * Checks if the current timestamp is in the past.
 * @returns {boolean} True if the timestamp is in the past, otherwise false.
 * @throws {Error} Throws an error if the data is not a number representing a timestamp.
 */
function isPast() {
  const value = Number(this.data);

  if (!value) {
    throw new Error('This method can only be used on numbers representing timestamps');
  }

  return new Date().getTime() > value;
}

/**
 * Formats a timestamp into a specified format.
 * @param {TimeFormat} [format=TimeFormat.MEDIUM] - The format to apply to the timestamp.
 * @returns {string} The formatted date string.
 * @throws {Error} Throws an error if the data is not a valid timestamp or if the format is invalid.
 */
function formatTimestamp(format = TimeFormat.MEDIUM) {
  const value = Number(this.data);
  if (isNaN(value)) throw new Error('Value must be a valid timestamp.');

  const date = new Date(value);

  let formattedDate;

  switch (format) {
    case TimeFormat.SHORT:
      // Format: MM/DD/YYYY
      formattedDate = date.toLocaleDateString('en-US');
      break;

    case TimeFormat.MEDIUM:
      // Format: MMM DD, YYYY, HH:mm
      formattedDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      break;

    case TimeFormat.LONG:
      // Format: Day, Month DD, YYYY, HH:mm:ss
      formattedDate = date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      break;

    default:
      throw new Error('Invalid format option. Use the TimeFormat enum.');
  }

  return formattedDate;
}

/**
 * Formats a timestamp into a relative time string.
 * @returns {string} The formatted relative time string.
 * @throws {Error} Throws an error if the data is not a valid timestamp.
 */
function formatRelativeTime() {
  const value = Number(this.data);
  if (isNaN(value)) throw new Error('Value must be a valid timestamp.');

  const now = Date.now();
  const secondsAgo = Math.floor((now - value) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const timeUnits = [
    { unit: 'year', threshold: 31536000 }, // 60 * 60 * 24 * 365
    { unit: 'month', threshold: 2592000 }, // 60 * 60 * 24 * 30
    { unit: 'day', threshold: 86400 }, // 60 * 60 * 24
    { unit: 'hour', threshold: 3600 }, // 60 * 60
    { unit: 'minute', threshold: 60 }, // 60
    { unit: 'second', threshold: 1 },
  ];

  const absSecondsAgo = Math.abs(secondsAgo);

  for (const { unit, threshold } of timeUnits) {
    if (absSecondsAgo >= threshold) {
      return secondsAgo < 0
        ? rtf.format(Math.floor(absSecondsAgo / threshold), unit)
        : rtf.format(-Math.floor(absSecondsAgo / threshold), unit);
    }
  }

  return rtf.format(0, 'second');
}

export { populate, dump, tap, average, sample, selectPick, selectOmit, isPast, formatTimestamp, formatRelativeTime };
