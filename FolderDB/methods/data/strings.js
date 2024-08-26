import { CaseFormat } from '../../utils/enums';

function changeCase(format) {
  let value = this.data;

  if (typeof value !== 'string') throw new Error('You can only use changeCase on strings.');

  switch (format) {
    case CaseFormat.LOWER:
      return value.toLowerCase();
    case CaseFormat.UPPER:
      return value.toUpperCase();
    case CaseFormat.PASCAL:
      return value.replace(/\w+/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    case CaseFormat.SNAKE:
      return value.replace(/\W+/g, '_').toLowerCase();
    case CaseFormat.CAMEL:
      return value
        .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => (index == 0 ? match.toLowerCase() : match.toUpperCase()))
        .replace(/\s+/g, '');
    case CaseFormat.KEBAB:
      return value.replace(/\W+/g, '-').toLowerCase();
    case CaseFormat.FLAT:
      return value.replace(/\W+/g, '').toLowerCase();
    case CaseFormat.TRAIN:
      return value
        .replace(/\W+/g, '-')
        .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => (index == 0 ? match.toUpperCase() : match.toUpperCase()));
    default:
      throw new Error('Unsupported case format.');
  }
}

function toString(method, save = false) {
  let value = this.value();
  if (typeof value === 'string') throw new Error('This is already a string.');
  if (typeof method === 'boolean') {
    save = method;
    method = '';
  }

  if (typeof value === 'number') value = value.toString();
  if (method === 'json' && (Array.isArray(value) || value === Object(value))) {
    value = JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    if (method === 'join') {
      value = value.join('');
    } else if (method.length !== 0) {
      value = value.join(method);
    } else {
      value = value.join(', ');
    }
  }

  if (save) {
    this.set(value);
    return this;
  }
  return value;
}

function trim() {
  let value = this.value();
  if (typeof value !== 'string') throw new Error('You can only use .trim() on strings.');

  this.set(value.trim());
  return this;
}

function replace(oldStr, newStr) {
  let value = this.value();
  if (typeof value !== 'string') throw new Error('You can only use .replace() on strings.');

  this.set(value.replace(oldStr, newStr));
  return this;
}

function reverse(save = false) {
  let value = this.value();

  if (typeof value === 'string') {
    value = value.split('').reverse().join('');
  } else if (Array.isArray(value)) {
    value = value.reverse();
  } else throw new Error('You can only use .reverse() on strings and arrays.');

  if (save) {
    this.set(value);
    return this;
  }
  return value;
}

// NOTE: Ideas
// sanitize - removes dangerous characters, unicode and other
// toCase - you can chose a case to transform the characters to - upper, lower, kebab, snake, pascal

export { changeCase, toString, trim, replace, reverse };

// NOTE: Copied from ThunderDB, will need a rework
