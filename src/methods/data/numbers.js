/**
 * Increases the target property by one.
 * @returns {Object} The current object for chaining.
 * @throws {Error} Throws an error if the target property is not a number.
 */
function inc() {
  const value = Number(this.data);
  if (isNaN(value)) throw new Error('You can only increment numbers.');

  this._set(value + 1);
  return this;
}

/**
 * Decreases the target property by one.
 * @returns {Object} The current object for chaining.
 * @throws {Error} Throws an error if the target property is not a number.
 */
function dec() {
  const value = Number(this.data);
  if (isNaN(value)) throw new Error('You can only decrement numbers.');

  this._set(value - 1);
  return this;
}

/**
 * Adds a given number to the target property.
 * @param {number} number The number to add.
 * @returns {Object} The current object for chaining.
 * @throws {Error} Throws an error if the target property or parameter is not a number.
 */
function add(number) {
  const value = Number(this.data);
  if (isNaN(number)) throw new Error('Values can only be numbers.');
  if (isNaN(value)) throw new Error('You can only add to numbers.');

  this._set(value + number);
  return this;
}

/**
 * Subtracts a given number from the target property.
 * @param {number} number The number to subtract.
 * @returns {Object} The current object for chaining.
 * @throws {Error} Throws an error if the target property or parameter is not a number.
 */
function sub(number) {
  const value = Number(this.data);
  if (isNaN(number)) throw new Error('Values can only be numbers.');
  if (isNaN(value)) throw new Error('You can only subtract to numbers.');

  this._set(value - number);
  return this;
}

/**
 * Increases the target property by a given percentage.
 * @param {number} percentage The percentage to add.
 * @returns {Object} The current object for chaining.
 * @throws {Error} Throws an error if the target property or parameter is not a number.
 */
function addPercentage(percentage) {
  const value = Number(this.data);
  if (isNaN(percentage)) throw new Error('Values can only be numbers.');
  if (isNaN(value)) throw new Error('You can only add percentage to numbers.');

  this._set(value + value * (percentage / 100));
  return this;
}

/**
 * Decreases the target property by a given percentage.
 * @param {number} percentage The percentage to subtract.
 * @returns {Object} The current object for chaining.
 * @throws {Error} Throws an error if the target property or parameter is not a number.
 */
function subPercentage(percentage) {
  const value = Number(this.data);
  if (isNaN(percentage)) throw new Error('Values can only be numbers.');
  if (isNaN(value)) throw new Error('You can only subtract percentage from numbers.');

  this._set(value - value * (percentage / 100));
  return this;
}

/**
 * Sets the target property to a random number between the given minimum and maximum values.
 * @param {number} max The maximum value for the random number.
 * @param {number} [min=0] The minimum value for the random number.
 * @returns {Object} The current object for chaining.
 * @throws {Error} Throws an error if the parameters are not numbers.
 */
function random(max, min = 0) {
  if (isNaN(min) || isNaN(max)) throw new Error('You can only use random() with numbers.');

  const randomized = Math.floor(Math.random() * (max - min + 1) + min);
  this._set(randomized);
  return this;
}

/**
 * Adds a random number between the given minimum and maximum values to the target property.
 * @param {number} max The maximum value for the random number.
 * @param {number} [min=0] The minimum value for the random number.
 * @returns {number} The generated random number.
 * @throws {Error} Throws an error if the target property or parameters are not numbers.
 */
function addRandom(max, min = 0) {
  const value = Number(this.data);
  if (isNaN(max) && isNaN(min)) throw new Error('Values can only be numbers.');
  if (isNaN(value)) throw new Error('You can only add to numbers.');

  const randomized = Math.floor(Math.random() * (max - min + 1) + min);
  this._set(value + randomized);
  return randomized;
}

/**
 * Subtracts a random number between the given minimum and maximum values from the target property.
 * @param {number} max The maximum value for the random number.
 * @param {number} [min=0] The minimum value for the random number.
 * @returns {number} The generated random number.
 * @throws {Error} Throws an error if the target property or parameters are not numbers.
 */
function subRandom(max, min = 0) {
  const value = Number(this.data);
  if (isNaN(max) && isNaN(min)) throw new Error('Values can only be numbers.');
  if (isNaN(value)) throw new Error('You can only subtract to numbers.');

  const randomized = Math.floor(Math.random() * (max - min + 1) + min);
  this._set(value - randomized);
  return randomized;
}

/**
 * Clamps the target property value between a minimum and maximum range.
 * @param {number} min The minimum value.
 * @param {number} max The maximum value.
 * @returns {Object} The current object for chaining.
 * @throws {Error} Throws an error if the target property, min, or max are not numbers, or if min is greater than max.
 */
function clamp(min, max) {
  const value = Number(this.data);
  if (isNaN(value)) throw new Error('Value must be a number.');
  if (isNaN(min) || isNaN(max)) throw new Error('Min and max must be numbers.');
  if (min > max) throw new Error('Min cannot be greater than max.');

  this._set(Math.min(Math.max(value, min), max));
  return this;
}

/**
 * Rounds the target property's floating-point number to a specified number of digits.
 * @param {number} digits The number of digits to round to.
 * @returns {Object} The current object for chaining.
 * @throws {Error} Throws an error if the target property is not a number or if digits is not a non-negative integer.
 */
function roundFloat(digits) {
  const value = Number(this.data);
  if (isNaN(value)) throw new Error('Value must be a number.');
  if (!Number.isInteger(digits) || digits < 0) throw new Error('Digits must be a non-negative integer.');

  const roundedValue = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

  this._set(Number(roundedValue));
  return this;
}

export { inc, dec, add, sub, addPercentage, subPercentage, random, addRandom, subRandom, clamp, roundFloat };
