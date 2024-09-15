/**
 * Adds one or more values to the end of the array.
 *
 * @param {...any} value - The values to add to the array.
 * @returns {Object} The current instance for chaining.
 * @throws {Error} If the target is not an array.
 */
function push(...value) {
  let list = this.data;
  if (!Array.isArray(list)) throw new Error('You can only push to arrays.');

  list.push(...value);
  this._set(list);

  return this;
}

/**
 * Adds unique values to the array (only values not already present).
 *
 * @param {...any} value - The values to add to the array.
 * @returns {Object} The current instance for chaining.
 * @throws {Error} If the target is not an array.
 */
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

/**
 * Removes and returns the last value from the array.
 *
 * @param {Object} [options] - The options object.
 * @param {boolean} [options.result=false] - If true, returns the removed value.
 * @returns {any|Object} The removed value or the current instance for chaining.
 * @throws {Error} If the target is not an array.
 */
function pull({ result = false } = {}) {
  let list = this.data;
  if (!Array.isArray(list)) throw new Error('You can only pull from arrays.');

  let pulled = list.pop();
  this._set(list);

  if (result) return pulled;
  return this;
}

/**
 * Removes and returns the first value from the array.
 *
 * @param {Object} [options] - The options object.
 * @param {boolean} [options.result=false] - If true, returns the removed value.
 * @returns {any|Object} The removed value or the current instance for chaining.
 * @throws {Error} If the target is not an array.
 */
function shift({ result = false } = {}) {
  let list = this.data;
  if (!Array.isArray(list)) throw new Error('You can only shift arrays.');

  let shifted = list.shift();
  this._set(list);

  if (result) return shifted;
  return this;
}

/**
 * Adds one or more values to the start of the array.
 *
 * @param {...any} value - The values to add to the array.
 * @returns {Object} The current instance for chaining.
 * @throws {Error} If the target is not an array.
 */
function unshift(...value) {
  let list = this.data;
  if (!Array.isArray(list)) throw new Error('You can only unshift arrays.');

  list.unshift(...value);
  this._set(list);

  return this;
}

/**
 * Changes the content of an array by removing or replacing existing elements and/or adding new elements.
 *
 * @param {number} start - The index to start changing the array.
 * @param {number} deleteCount - The number of elements to remove.
 * @param {...any} [items] - The elements to add to the array.
 * @returns {Array} The removed elements.
 * @throws {Error} If the target is not an array.
 */
function splice(start, deleteCount, ...items) {
  let list = this.data;
  if (!Array.isArray(list)) throw new Error('You can only use .splice() on arrays.');

  const removedItems = list.splice(start, deleteCount, ...items);
  this._set(list);

  return removedItems;
}

/**
 * Creates a new array populated with the results of calling a provided function on every element.
 *
 * @param {function} func - The function to execute on each element.
 * @returns {Object} The current instance for chaining.
 * @throws {Error} If the target is not an array or func is not a function.
 */
function map(func) {
  let list = this.data;
  if (typeof func !== 'function') throw new Error('You can only pass functions to .map().');
  if (!Array.isArray(list)) throw new Error('You can only map arrays.');

  list = list.map(func);
  this._set(list);

  return this;
}

/**
 * Sorts the elements of the array in place.
 *
 * @param {function} [func] - The comparison function to use for sorting.
 * @returns {Object} The current instance for chaining.
 * @throws {Error} If the target is not an array or func is not a function.
 */
function sort(func) {
  let list = this.data;
  if (typeof func !== 'function' && func !== undefined)
    throw new Error('You can only pass functions or nothing to .sort().');
  if (!Array.isArray(list)) throw new Error('You can only sort arrays.');

  list.sort(func);
  this._set(list);

  return this;
}

/**
 * Creates a new array with all elements that pass the test implemented by the provided function.
 *
 * @param {function} func - The function to test each element.
 * @returns {Object} The current instance for chaining.
 * @throws {Error} If the target is not an array or func is not a function.
 */
function filter(func) {
  let list = this.data;
  if (typeof func !== 'function') throw new Error('You can only pass functions to .filter().');
  if (!Array.isArray(list)) throw new Error('You can only filter arrays.');

  list = list.filter(func);
  this._set(list);

  return this;
}

/**
 * Applies a function against an accumulator and each element in the array to reduce it to a single value.
 *
 * @param {function} func - The function to execute on each element.
 * @returns {Object} The current instance for chaining.
 * @throws {Error} If the target is not an array or func is not a function.
 */
function reduce(func) {
  let list = this.data;
  if (typeof func !== 'function') throw new Error('You can only pass functions to .reduce().');
  if (!Array.isArray(list)) throw new Error('You can only reduce arrays.');

  let reducedValue = list.reduce(func);
  this._set(reducedValue);

  return this;
}

/**
 * Concatenates arrays and returns a new array.
 *
 * @param {...Array} arrays - The arrays to concatenate.
 * @returns {Object} The current instance for chaining.
 * @throws {Error} If the target is not an array.
 */
function concat(...arrays) {
  let list = this.data;
  if (!Array.isArray(list)) throw new Error('You can only use .concat() on arrays.');

  const result = list.concat(...arrays);
  this._set(result);

  return this;
}

/**
 * Removes duplicate values from an array.
 *
 * @returns {Object} The current instance for chaining.
 * @throws {Error} If the target is not an array.
 */
function unique() {
  let value = this.data;
  if (!Array.isArray(value)) throw new Error('unique() can only be used on arrays.');

  this._set([...new Set(value)]);
  return this;
}

/**
 * Splits an array into chunks of the specified size.
 *
 * @param {number} size - The size of each chunk.
 * @returns {Object} The current instance for chaining.
 * @throws {Error} If the target is not an array.
 */
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

/**
 * Flattens a nested array into a single-level array.
 *
 * @returns {Object} The current instance for chaining.
 * @throws {Error} If the target is not an array.
 */
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

/**
 * Shuffles the array in place using the Fisher-Yates algorithm.
 *
 * @returns {Object} The current instance for chaining.
 * @throws {Error} If the target is not an array.
 */
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

/**
 * Returns the intersection of two arrays or objects.
 *
 * @param {Array|Object} input - The input array or object to compare.
 * @returns {Object} The current instance for chaining.
 * @throws {Error} If the target or input is not an array or object.
 */
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

/**
 * Returns the symmetric difference (XOR) of two arrays or objects.
 *
 * @param {Array|Object} input - The input array or object to compare.
 * @returns {Object} The current instance for chaining.
 * @throws {Error} If the target or input is not an array or object.
 */
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

/**
 * Returns the difference between two arrays or objects (elements present in the target but not in the input).
 *
 * @param {Array|Object} input - The input array or object to compare.
 * @returns {Object} The current instance for chaining.
 * @throws {Error} If the target or input is not an array or object.
 */
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

/**
 * Returns the difference between two arrays or objects (elements present in the input but not in the target).
 *
 * @param {Array|Object} input - The input array or object to compare.
 * @returns {Object} The current instance for chaining.
 * @throws {Error} If the target or input is not an array or object.
 */
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
