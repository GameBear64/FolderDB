function inc() {
  const value = Number(this.data);
  if (isNaN(value)) throw new Error('You can only increment numbers.');

  this._set(value + 1);
  return this;
}

function dec() {
  const value = Number(this.data);
  if (isNaN(value)) throw new Error('You can only decrement numbers.');

  this._set(value - 1);
  return this;
}

function add(number) {
  const value = Number(this.data);
  if (isNaN(number)) throw new Error('Values can only be numbers.');
  if (isNaN(value)) throw new Error('You can only add to numbers.');

  this._set(value + number);
  return this;
}

function sub(number) {
  const value = Number(this.data);
  if (isNaN(number)) throw new Error('Values can only be numbers.');
  if (isNaN(value)) throw new Error('You can only subtract to numbers.');

  this._set(value - number);
  return this;
}

function addPercentage(percentage) {
  const value = Number(this.data);
  if (isNaN(percentage)) throw new Error('Values can only be numbers.');
  if (isNaN(value)) throw new Error('You can only add percentage to numbers.');

  this._set(value + value * (percentage / 100));
  return this;
}

function subPercentage(percentage) {
  const value = Number(this.data);
  if (isNaN(percentage)) throw new Error('Values can only be numbers.');
  if (isNaN(value)) throw new Error('You can only subtract percentage from numbers.');

  this._set(value - value * (percentage / 100));
  return this;
}

function random(max, min = 0) {
  if (isNaN(min) || isNaN(max)) throw new Error('You can only use random() with numbers.');

  const randomized = Math.floor(Math.random() * (max - min + 1) + min);
  this._set(randomized);
  return this;
}

function addRandom(max, min = 0) {
  const value = Number(this.data);
  if (isNaN(max) && isNaN(min)) throw new Error('Values can only be numbers.');
  if (isNaN(value)) throw new Error('You can only add to numbers.');

  const randomized = Math.floor(Math.random() * (max - min + 1) + min);
  this._set(value + randomized);
  return randomized;
}

function subRandom(max, min = 0) {
  const value = Number(this.data);
  if (isNaN(max) && isNaN(min)) throw new Error('Values can only be numbers.');
  if (isNaN(value)) throw new Error('You can only subtract to numbers.');

  const randomized = Math.floor(Math.random() * (max - min + 1) + min);
  this._set(value - randomized);
  return randomized;
}

function clamp(min, max) {
  const value = Number(this.data);
  if (isNaN(value)) throw new Error('Value must be a number.');
  if (isNaN(min) || isNaN(max)) throw new Error('Min and max must be numbers.');
  if (min > max) throw new Error('Min cannot be greater than max.');

  this._set(Math.min(Math.max(value, min), max));
  return this;
}

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
