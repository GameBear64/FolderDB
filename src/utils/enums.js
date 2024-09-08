export const ValueType = Object.freeze({
  DIRECTORY: Symbol('DIRECTORY'),
  FILE: Symbol('FILE'),
  VALUE: Symbol('VALUE'),
});

export const CaseFormat = Object.freeze({
  LOWER: Symbol('lower'),
  UPPER: Symbol('upper'),
  PASCAL: Symbol('pascal'),
  SNAKE: Symbol('snake'),
  CAMEL: Symbol('camel'),
  KEBAB: Symbol('kebab'),
  FLAT: Symbol('flat'),
  TRAIN: Symbol('train'),
  SLUG: Symbol('slug'),
  REVERSE: Symbol('reverse'),
});

export const TimeFormat = Object.freeze({
  SHORT: Symbol('short'),
  MEDIUM: Symbol('medium'),
  LONG: Symbol('long'),
});
