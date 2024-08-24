function setTimestamp(name) {
  const currentTimestamp = new Date().getTime();

  if (name) {
    this._set(name, currentTimestamp);
  } else {
    this._set(currentTimestamp);
  }

  return this.data;
}

function setFutureTimestamp(name, ms) {
  if (!ms) {
    if (typeof name !== 'number') {
      throw new Error('This method can only be used with numbers representing timestamps');
    }
  } else {
    if (typeof name !== 'string' && typeof ms !== 'number') {
      throw new Error('The first argument must be a string (for name) or a number (for milliseconds)');
    }
  }

  const futureTimestamp = new Date().getTime() + (ms || name);

  if (!!ms) {
    this._set(name, futureTimestamp);
  } else {
    this._set(futureTimestamp);
  }

  return this.data;
}

function increaseTimestamp(milliseconds) {
  const value = Number(this.data);
  if (typeof value !== 'number' || typeof milliseconds !== 'number') {
    throw new Error('This method can only be used on numbers representing timestamps');
  }

  this._set(value + milliseconds);
  return this.data;
}

function isPast() {
  const value = Number(this.data);
  if (typeof value !== 'number') {
    throw new Error('This method can only be used on numbers representing timestamps');
  }

  return new Date().getTime() > value;
}

export { setTimestamp, setFutureTimestamp, increaseTimestamp, isPast };
