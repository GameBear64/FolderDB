function push(...value) {
  let list = this.data;
  if (!Array.isArray(list)) throw new Error('You can only push to arrays.');

  list.push(...value);
  this._set(list);

  return this;
}

function pushSet(...value) {
  let list = this.data;
  if (!Array.isArray(list)) throw new Error('You can only push to arrays.');

  let newList = Array.from(value);
  value.forEach(el => {
    if (list.includes(el)) {
      newList.shift();
    }
  });

  list.push(...newList);
  this._set(list);

  return this;
}

function pull({ result = false } = {}) {
  let list = this.data;
  if (!Array.isArray(list)) throw new Error('You can only pull from arrays.');

  let pulled = list.pop();
  this._set(list);

  if (result) return pulled;
  return this;
}

function shift({ result = false } = {}) {
  let list = this.data;
  if (!Array.isArray(list)) throw new Error('You can only shift arrays.');

  let shifted = list.shift();
  this._set(list);

  if (result) return shifted;
  return this;
}

function unshift(...value) {
  let list = this.data;
  if (!Array.isArray(list)) throw new Error('You can only unshift arrays.');

  list.unshift(...value);
  this._set(list);

  return this;
}

function splice(start, deleteCount, ...items) {
  let list = this.data;
  if (!Array.isArray(list)) throw new Error('You can only use .splice() on arrays.');

  const removedItems = list.splice(start, deleteCount, ...items);
  this._set(list);
  return removedItems;
}

function map(func, result = false) {
  let list = this.data;
  if (typeof func !== 'function') throw new Error('You can only pass functions to .map().');
  if (!Array.isArray(list)) throw new Error('You can only map arrays.');

  list = list.map(func);
  this._set(list);

  if (result) return list;
  return this;
}

function sort(func, result = false) {
  let list = this.data;
  if (typeof func !== 'function' && func !== undefined)
    throw new Error('You can only pass functions or nothing to .sort().');
  if (!Array.isArray(list)) throw new Error('You can only sort arrays.');

  list.sort(func);
  this._set(list);

  if (result) return list;
  return this;
}

function filter(func, result = false) {
  let list = this.data;
  if (typeof func !== 'function') throw new Error('You can only pass functions to .filter().');
  if (!Array.isArray(list)) throw new Error('You can only filter arrays.');

  list = list.filter(func);
  this._set(list);

  if (result) return list;
  return this;
}

function reduce(func, result = false) {
  let list = this.data;
  if (typeof func !== 'function') throw new Error('You can only pass functions to .reduce().');
  if (!Array.isArray(list)) throw new Error('You can only reduce arrays.');

  let reducedValue = list.reduce(func);
  this._set(reducedValue);

  if (result) return reducedValue;
  return this;
}

function concat(...arrays) {
  let list = this.data;
  if (!Array.isArray(list)) throw new Error('You can only use .concat() on arrays.');

  const result = list.concat(...arrays);
  this._set(result);
  return this;
}

function unique() {
  let value = this.data;
  if (!Array.isArray(value)) throw new Error('unique() can only be used on arrays.');

  this._set([...new Set(value)]);
  return this;
}

function chunk(size) {
  let value = this.data;
  if (!Array.isArray(value)) throw new Error('chunk() can only be used on arrays.');

  const chunked = [];
  for (let i = 0; i < value.length; i += size) {
    chunked.push(value.slice(i, i + size));
  }

  this._set(chunked);
  return this;
}

function flattenMatrix() {
  const array = this.data;
  if (!Array.isArray(array)) throw new Error('Value must be an array.');

  function flatten(arr) {
    return arr.reduce((acc, val) => {
      if (Array.isArray(val)) {
        acc.push(...flatten(val));
      } else {
        acc.push(val);
      }
      return acc;
    }, []);
  }

  this.set(flatten(array));
  return this;
}

function shuffleArray() {
  const array = this.data;
  if (!Array.isArray(array)) throw new Error('Value must be an array.');

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }

  this.set(array);
  return this;
}

function intersection(input) {
  let value = this.data;

  if (Array.isArray(value) && Array.isArray(input)) {
    const intersected = value.filter(v => input.includes(v));
    this._set(intersected);
  } else if (typeof value === 'object' && typeof input === 'object') {
    const intersected = {};
    for (const key in value) {
      if (value.hasOwnProperty(key) && input.hasOwnProperty(key)) {
        intersected[key] = value[key];
      }
    }
    this._set(intersected);
  } else {
    throw new Error('intersection() can only be used on arrays or objects.');
  }

  return this;
}

function XOR(input) {
  let value = this.data;

  if (Array.isArray(value) && Array.isArray(input)) {
    const result = value.filter(v => !input.includes(v)).concat(input.filter(v => !value.includes(v)));
    this._set(result);
  } else if (typeof value === 'object' && typeof input === 'object') {
    const result = {};
    for (const key in value) {
      if (value.hasOwnProperty(key) && !input.hasOwnProperty(key)) {
        result[key] = value[key];
      }
    }
    for (const key in input) {
      if (input.hasOwnProperty(key) && !value.hasOwnProperty(key)) {
        result[key] = input[key];
      }
    }
    this._set(result);
  } else {
    throw new Error('XOR() can only be used on arrays or objects.');
  }

  return this;
}

function difference(input) {
  let value = this.data;

  if (Array.isArray(value) && Array.isArray(input)) {
    const result = value.filter(v => !input.includes(v));
    this._set(result);
  } else if (typeof value === 'object' && typeof input === 'object') {
    const result = {};
    for (const key in value) {
      if (value.hasOwnProperty(key) && !input.hasOwnProperty(key)) {
        result[key] = value[key];
      }
    }
    this._set(result);
  } else {
    throw new Error('difference() can only be used on arrays or objects.');
  }

  return this;
}

function differenceInsert(input) {
  let value = this.data;

  if (Array.isArray(value) && Array.isArray(input)) {
    const result = input.filter(v => !value.includes(v));
    this._set(result);
  } else if (typeof value === 'object' && typeof input === 'object') {
    const result = {};
    for (const key in input) {
      if (input.hasOwnProperty(key) && !value.hasOwnProperty(key)) {
        result[key] = input[key];
      }
    }
    this._set(result);
  } else {
    throw new Error('differenceInsert() can only be used on arrays or objects.');
  }

  return this;
}

export {
  push,
  pushSet,
  pull,
  shift,
  unshift,
  splice,
  map,
  sort,
  filter,
  reduce,
  concat,
  unique,
  chunk,
  flattenMatrix,
  shuffleArray,
  intersection,
  XOR,
  difference,
  differenceInsert,
};
