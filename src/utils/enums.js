export const ValueType = Object.freeze({
  DIRECTORY: Symbol('DIRECTORY'),
  FILE: Symbol('FILE'),
  VALUE: Symbol('VALUE'),
});

export const CaseFormat = Object.freeze({
  TITLE: Symbol('title'),
  LOWER: Symbol('lower'),
  UPPER: Symbol('upper'),
  PASCAL: Symbol('pascal'),
  SNAKE: Symbol('snake'),
  DOT: Symbol('dot'),
  CAMEL: Symbol('camel'),
  KEBAB: Symbol('kebab'),
  FLAT: Symbol('flat'),
  SLUG: Symbol('slug'),
  REVERSE: Symbol('reverse'),
  ASCII: Symbol('ascii'),
});

export const TimeFormat = Object.freeze({
  SHORT: Symbol('short'),
  MEDIUM: Symbol('medium'),
  LONG: Symbol('long'),
});
