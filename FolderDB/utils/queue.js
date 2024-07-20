export default class TaskQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  add(task) {
    this.queue.push(task);
    this.startNext();
  }

  async startNext() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const currentTask = this.queue.shift();

    try {
      await currentTask();
    } catch (error) {
      console.error('Task failed:', error);
    } finally {
      this.processing = false;
      this.startNext();
    }
  }
}
