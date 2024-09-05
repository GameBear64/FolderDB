function inc() {
  const value = Number(this.data);
  if (isNaN(value)) throw new Error('You can only increment numbers.');

  this._set(value + 1);
  return this.data;
}

function dec() {
  const value = Number(this.data);
  if (isNaN(value)) throw new Error('You can only decrement numbers.');

  this._set(value - 1);
  return this.data;
}

function add(number) {
  const value = Number(this.value());
  if (isNaN(number)) throw new Error('Values can only be numbers.');
  if (isNaN(value)) throw new Error('You can only add to numbers.');

  this.set(value + number);
  return this;
}

function sub(number) {
  const value = Number(this.value());
  if (isNaN(number)) throw new Error('Values can only be numbers.');
  if (isNaN(value)) throw new Error('You can only subtract to numbers.');

  this.set(value - number);
  return this;
}

function random(max, min = 0) {
  if (isNaN(min) || isNaN(max)) throw new Error('You can only use random() with numbers.');

  const randomized = Math.floor(Math.random() * (max - min + 1) + min);
  this.set(randomized);
  return this;
}

function addRandom(max, min = 0) {
  const value = Number(this.value());
  if (isNaN(max) && isNaN(min)) throw new Error('Values can only be numbers.');
  if (isNaN(value)) throw new Error('You can only add to numbers.');

  const randomized = Math.floor(Math.random() * (max - min + 1) + min);
  this.set(value + randomized);
  return randomized;
}

function subRandom(max, min = 0) {
  const value = Number(this.value());
  if (isNaN(max) && isNaN(min)) throw new Error('Values can only be numbers.');
  if (isNaN(value)) throw new Error('You can only subtract to numbers.');

  const randomized = Math.floor(Math.random() * (max - min + 1) + min);
  this.set(value - randomized);
  return randomized;
}

export { inc, dec };
// export { inc, dec, add, sub, random, addRandom, subRandom };

// NOTE: Copied from ThunderDB, will need a rework
