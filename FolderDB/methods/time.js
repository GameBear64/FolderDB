function setTimestamp() {
  const currentTimestamp = Date.now().getTime();
  this.set(currentTimestamp);
  return this;
}

// numbers inc?
function increaseTimestamp(milliseconds) {
  let value = this.value();
  if (typeof value !== 'number')
    throw new Error('increaseTimestamp() can only be used on numbers representing timestamps.');

  this.set(value + milliseconds);
  return this;
}

function inPast() {
  let value = this.value();
  if (typeof value !== 'number')
    throw new Error('hasTimestampPassed() can only be used on numbers representing timestamps.');

  return Date.now().getTime() > value;
}

function setFutureTimestamp(milliseconds) {
  const futureTimestamp = Date.now().getTime() + milliseconds;
  this.set(futureTimestamp);
  return this;
}

function getTimeDifference() {
  let value = this.value();
  if (typeof value !== 'number')
    throw new Error('getTimeDifference() can only be used on numbers representing timestamps.');

  return Date.now().getTime() - value;
}

function formatTimestamp() {
  let value = this.value();
  if (typeof value !== 'number')
    throw new Error('formatTimestamp() can only be used on numbers representing timestamps.');

  const date = new Date(value);
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

// NOTE: Some provided by GPT, check and test
