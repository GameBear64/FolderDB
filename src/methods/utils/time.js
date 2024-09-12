function setTimestamp(name) {
  const currentTimestamp = new Date().getTime();

  name ? this._set(name, currentTimestamp) : this._set(currentTimestamp);

  return this;
}

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

// add enums that correspond to milliseconds
function advanceTime(milliseconds) {
  const value = Number(this.data);
  if (typeof value !== 'number' || typeof milliseconds !== 'number') {
    throw new Error('This method can only be used on numbers representing timestamps');
  }

  this._set(value + milliseconds);
  return this;
}

function rewindTime(milliseconds) {
  const value = Number(this.data);
  if (typeof value !== 'number' || typeof milliseconds !== 'number') {
    throw new Error('This method can only be used on numbers representing timestamps');
  }

  this._set(value - milliseconds);
  return this;
}

export { setTimestamp, setFutureTimestamp, advanceTime, rewindTime };
