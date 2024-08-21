function inc() {
  let value = Number(this.value());
  if (isNaN(value)) throw new Error('You can only increment numbers.');

  this.set(value + 1);
  return this;
}

function dec() {
  let value = Number(this.value());
  if (isNaN(value)) throw new Error('You can only decrement numbers.');

  this.set(value - 1);
  return this;
}

function add(number) {
  let value = Number(this.value());
  if (isNaN(number)) throw new Error('Values can only be numbers.');
  if (isNaN(value)) throw new Error('You can only add to numbers.');

  this.set(value + number);
  return this;
}

function sub(number) {
  let value = Number(this.value());
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
  let value = Number(this.value());
  if (isNaN(max) && isNaN(min)) throw new Error('Values can only be numbers.');
  if (isNaN(value)) throw new Error('You can only add to numbers.');

  const randomized = Math.floor(Math.random() * (max - min + 1) + min);
  this.set(value + randomized);
  return randomized;
}

function subRandom(max, min = 0) {
  let value = Number(this.value());
  if (isNaN(max) && isNaN(min)) throw new Error('Values can only be numbers.');
  if (isNaN(value)) throw new Error('You can only subtract to numbers.');

  const randomized = Math.floor(Math.random() * (max - min + 1) + min);
  this.set(value - randomized);
  return randomized;
}

export { inc, dec, add, sub, random, addRandom, subRandom };

// NOTE: Copied from ThunderDB, will need a rework
