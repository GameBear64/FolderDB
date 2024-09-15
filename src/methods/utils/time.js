/**
 * Sets the current timestamp.
 *
 * @param {string} [name] - The optional name to assign the timestamp to.
 * @returns {Object} The current instance for chaining.
 * @throws {Error} If the target is not set correctly.
 */
function setTimestamp(name) {
  const currentTimestamp = new Date().getTime();

  name ? this._set(name, currentTimestamp) : this._set(currentTimestamp);

  return this;
}

/**
 * Sets a future timestamp by adding a number of milliseconds to the current time.
 *
 * @param {string|number} name - The name for the timestamp or the number of milliseconds.
 * @param {number} [ms] - The number of milliseconds to add. Required if `name` is a string.
 * @returns {Object} The current instance for chaining.
 * @throws {Error} If the input types are incorrect.
 */
function setFutureTimestamp(name, ms) {
  if (!ms) {
    if (typeof name !== 'number') {
      throw new Error('This method can only be used with numbers representing timestamps');
    }
  } else {
    if (typeof name !== 'string' || typeof ms !== 'number') {
      throw new Error('The first argument must be a string (for name) or a number (for milliseconds)');
    }
  }

  const futureTimestamp = new Date().getTime() + (ms || name);

  !!ms ? this._set(name, futureTimestamp) : this._set(futureTimestamp);

  return this;
}

/**
 * Advances the current timestamp by a specified number of milliseconds.
 *
 * @param {number} milliseconds - The number of milliseconds to advance the timestamp.
 * @returns {Object} The current instance for chaining.
 * @throws {Error} If the current data or milliseconds are not numbers.
 */
function advanceTime(milliseconds) {
  const value = Number(this.data);
  if (typeof value !== 'number' || typeof milliseconds !== 'number') {
    throw new Error('This method can only be used on numbers representing timestamps');
  }

  this._set(value + milliseconds);
  return this;
}

/**
 * Rewinds the current timestamp by a specified number of milliseconds.
 *
 * @param {number} milliseconds - The number of milliseconds to rewind the timestamp.
 * @returns {Object} The current instance for chaining.
 * @throws {Error} If the current data or milliseconds are not numbers.
 */
function rewindTime(milliseconds) {
  const value = Number(this.data);
  if (typeof value !== 'number' || typeof milliseconds !== 'number') {
    throw new Error('This method can only be used on numbers representing timestamps');
  }

  this._set(value - milliseconds);
  return this;
}

export { setTimestamp, setFutureTimestamp, advanceTime, rewindTime };
