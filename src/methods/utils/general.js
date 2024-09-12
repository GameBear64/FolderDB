import { ValueType, TimeFormat } from '../../utils/enums';

// NOTE: General methods don't edit the value

// ========= Utility ===========
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

function dump() {
  console.log(this.data);

  return this;
}

function tap(callback) {
  if (typeof callback !== 'function') throw new Error('You must provide a function to tap().');
  callback(this.data);
  return this;
}

// ========== Array ============
function average() {
  const numbers = this.data;

  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error('Input must be a non-empty array of numbers.');
  }

  const sum = numbers.reduce((acc, num) => acc + num, 0);
  this.data = sum / numbers.length;

  console.log(this.data);

  return this;
}

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

function selectPick(desiredFields) {
  let value = this.data;
  if (value !== Object(value)) throw new Error('selectPick() can only be used on objects.');
  if (!Array.isArray(desiredFields)) throw new Error('selectPick() needs an array with the desired fields');

  this.data = Object.assign({}, ...desiredFields.map(field => ([field] in value ? { [field]: value[field] } : {})));

  return this;
}

function selectOmit(fieldsToOmit) {
  let value = this.data;
  if (value !== Object(value)) throw new Error('selectOmit() can only be used on objects.');
  if (!Array.isArray(fieldsToOmit)) throw new Error('selectOmit() needs an array with the fields to omit');

  this.data = Object.assign(
    {},
    ...Object.keys(value)
      .filter(key => !fieldsToOmit.includes(key))
      .map(key => ({ [key]: value[key] }))
  );

  return this;
}

// ======= TIME ==========

function isPast() {
  const value = Number(this.data);
  console.log(value);

  if (!value) {
    throw new Error('This method can only be used on numbers representing timestamps');
  }

  return new Date().getTime() > value;
}

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
