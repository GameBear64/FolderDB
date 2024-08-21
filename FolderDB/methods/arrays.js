function push(...value) {
  let list = this.value();

  if (!Array.isArray(list)) throw new Error('You can only push to arrays.');

  list.push(...value);
  this.set(list);

  return this;
}

function pushSet(...value) {
  let list = this.value();

  if (!Array.isArray(list)) throw new Error('You can only push to arrays.');

  let newList = Array.from(value);
  value.forEach(el => {
    if (list.includes(el)) {
      newList.shift();
    }
  });

  list.push(...newList);
  this.set(list);

  return this;
}

function pull({ getList = false, save = false } = {}) {
  let list = this.value();
  if (!Array.isArray(list)) throw new Error('You can only pull from arrays.');

  let popped = list.pop();

  if (save) this.set(list);
  if (getList) return popped;

  return this;
}

function shift({ getList = false, save = false } = {}) {
  let list = this.value();
  if (!Array.isArray(list)) throw new Error('You can only shift arrays.');

  let shifted = list.shift();

  if (save) this.set(list);
  if (getList) return shifted;

  return this;
}

function unshift(...value) {
  let list = this.value();
  if (!Array.isArray(list)) throw new Error('You can only unshift arrays.');

  list.unshift(...value);
  this.set(list);

  return this;
}

function every(func) {
  let list = this.value();

  if (typeof func !== 'function') throw new Error('You can only pass functions to .every().');
  if (!Array.isArray(list)) throw new Error('You can only check arrays.');

  return list.every(func);
}

function some(func) {
  let list = this.value();

  if (typeof func !== 'function') throw new Error('You can only pass functions to .some().');
  if (!Array.isArray(list)) throw new Error('You can only check arrays.');

  return list.some(func);
}

function has(value) {
  let list = this.value();

  if (Array.isArray(list)) {
    return list.includes(value);
  } else if (list === Object(list)) {
    return Object.keys(list).includes(value);
  } else {
    throw new Error('You can only check arrays or objects.');
  }
}

function map(func, save = false) {
  let list = this.value();

  if (typeof func !== 'function') throw new Error('You can only pass functions to .map().');
  if (!Array.isArray(list)) throw new Error('You can only map arrays.');

  list = list.map(func);

  if (save) {
    this.set(list);
    return this;
  }
  return list;
}

function sort(func, save = false) {
  let list = this.value();

  if (typeof func !== 'function' && func !== undefined)
    throw new Error('You can only pass functions or nothing to .sort().');
  if (!Array.isArray(list)) throw new Error('You can only sort arrays.');

  list.sort(func);

  if (save) {
    this.set(list);
    return this;
  }
  return list;
}

function filter(func, save = false) {
  let list = this.value();

  if (typeof func !== 'function') throw new Error('You can only pass functions to .filter().');
  if (!Array.isArray(list)) throw new Error('You can only filter arrays.');

  list = list.filter(func);

  if (save) {
    this.set(list);
    return this;
  }
  return list;
}

function reduce(func, save = false) {
  let list = this.value();

  if (typeof func !== 'function') throw new Error('You can only pass functions to .reduce().');
  if (!Array.isArray(list)) throw new Error('You can only reduce arrays.');

  let reducedValue = list.reduce(func);

  if (save) {
    this.set(reducedValue);
    return this;
  }
  return reducedValue;
}

function length() {
  let value = this.value();
  if (value.length === undefined) throw new Error('Cannot get length.');

  return value.length;
}

function concat(...arrays) {
  let list = this.value();
  if (!Array.isArray(list)) throw new Error('You can only use .concat() on arrays.');

  const result = list.concat(...arrays);
  this.set(result);
  return this;
}

function splice(start, deleteCount, ...items) {
  let list = this.value();
  if (!Array.isArray(list)) throw new Error('You can only use .splice() on arrays.');

  const removedItems = list.splice(start, deleteCount, ...items);
  this.set(list);
  return removedItems;
}

function toArray() {
  let value = this.value();

  if (Array.isArray(value)) return value;

  if (typeof value === 'string') return value.split('');

  if (value === Object(value)) return Object.values(value);

  return [value];
}

function unique() {
  let value = this.value();
  if (!Array.isArray(value)) throw new Error('unique() can only be used on arrays.');

  this.set([...new Set(value)]);
  return this;
}

function chunk(size) {
  let value = this.value();
  if (!Array.isArray(value)) throw new Error('chunk() can only be used on arrays.');

  const chunked = [];
  for (let i = 0; i < value.length; i += size) {
    chunked.push(value.slice(i, i + size));
  }

  this.set(chunked);
  return this;
}

function intersection(array) {
  let value = this.value();
  if (!Array.isArray(value) || !Array.isArray(array)) throw new Error('intersection() can only be used on arrays.');

  const intersected = value.filter(v => array.includes(v));
  this.set(intersected);
  return this;
}

function difference(array) {
  let value = this.value();
  if (!Array.isArray(value) || !Array.isArray(array)) throw new Error('difference() can only be used on arrays.');

  const diff = value.filter(v => !array.includes(v));
  this.set(diff);
  return this;
}

export {
  push,
  pushSet,
  pull,
  shift,
  unshift,
  every,
  some,
  has,
  map,
  sort,
  filter,
  reduce,
  length,
  concat,
  splice,
  toArray,
  unique,
  chunk,
  intersection,
  difference,
};

// NOTE: Copied from ThunderDB, will need a rework
// NOTE: Some provided by GPT, check and test
