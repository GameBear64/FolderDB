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

function addRandom(max, min = 0) {
  let value = Number(this.value());
  if (isNaN(max) && isNaN(min)) throw new Error('Values can only be numbers.');
  if (isNaN(value)) throw new Error('You can only add to numbers.');

  let randomized = Math.floor(Math.random() * (max - min + 1) + min);
  this.set(value + randomized);
  return randomized;
}

function subRandom(max, min = 0) {
  let value = Number(this.value());
  if (isNaN(max) && isNaN(min)) throw new Error('Values can only be numbers.');
  if (isNaN(value)) throw new Error('You can only subtract to numbers.');

  let randomized = Math.floor(Math.random() * (max - min + 1) + min);
  this.set(value - randomized);
  return randomized;
}

// Copied from ThunderDB, will probably need a rework
export { inc, dec, add, sub, addRandom, subRandom };
