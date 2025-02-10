// Unlike helpers.js this file is meant for small reusable pieces of code
// helpers is about again reusable functions but that can be used only in certain scenarios

import { CaseFormat } from './enums.js';
const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function parseOptionalParams(args, paramCount) {
  const startIndex = paramCount - args.length;

  return Array.from({ length: paramCount }, (_, i) => (startIndex <= i ? args[i - startIndex] : undefined));
}

function convertBase(value, toBase) {
  if (toBase > chars.length) throw new Error('Base can not be larger than charset');

  let range = chars.split('');
  let toRange = range.slice(0, toBase);
  let newValue = '';

  while (value > 0) {
    newValue = toRange[value % toBase] + newValue;
    value = (value - (value % toBase)) / toBase;
  }
  return newValue || 0;
}

function generateRandomId(length = 20) {
  const timestamp = convertBase(Math.floor(new Date().getTime() / 1000), 62);

  const random = Array.from(
    { length: Math.max(length - timestamp.length, 4) },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');

  return random + timestamp;
}

function pick(value, desiredFields) {
  return Object.assign({}, ...desiredFields.map(field => ([field] in value ? { [field]: value[field] } : {})));
}

function omit(value, fieldsToOmit) {
  return Object.assign(
    {},
    ...Object.keys(value)
      .filter(key => !fieldsToOmit.includes(key))
      .map(key => ({ [key]: value[key] }))
  );
}

function transformCase(value, format) {
  if (typeof value !== 'string') throw new Error('You can only use changeCase on strings.');
  if (!Object.values(CaseFormat).includes(format)) throw new Error('Unsupported case format.');

  switch (format) {
    case CaseFormat.TITLE:
      return value.replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

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
      return value.replace(/\W+/g, '-');

    case CaseFormat.FLAT:
      return value.replace(/\W+/g, '').toLowerCase();

    case CaseFormat.SLUG:
      return value
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');

    case CaseFormat.REVERSE:
      return value.split('').reverse().join('');

    case CaseFormat.ASCII:
      return value.replace(/[^\x00-\x7F]/g, '').trim();

    default:
      return value;
  }
}

export { parseOptionalParams, generateRandomId, pick, omit, convertBase, transformCase };
