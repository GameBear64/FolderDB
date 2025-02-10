export default class EventManager {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) this.events[event] = [];

    this.events[event].push(callback);
  }

  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  once(event, callback) {
    const onceCallback = (...args) => {
      callback(...args);
      this.off(event, onceCallback);
    };

    this.on(event, onceCallback);
  }

  emit(event, ...args) {
    if (!this.events[event]) return;

    let lastResult;
    for (const callback of this.events[event]) {
      lastResult = callback(...args);
    }
    return lastResult;
  }
}
