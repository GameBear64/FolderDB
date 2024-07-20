export default class TaskQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  // Method to add a task to the queue
  add(task) {
    // assert task is function
    // console.log('ping', task);
    this.queue.push(task);
    this.startNext();
  }

  // Method to process the next task in the queue
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

// // Example usage:

// const queue = new TaskQueue();

// // Define some example tasks (these can be any functions returning a Promise)
// const task1 = () =>
//   new Promise(resolve => {
//     console.log('Executing task 1');
//     setTimeout(resolve, 1000); // Simulating async work with a timeout
//   });

// const task2 = () =>
//   new Promise(resolve => {
//     console.log('Executing task 2');
//     setTimeout(resolve, 500);
//   });

// const task3 = () =>
//   new Promise(resolve => {
//     console.log('Executing task 3');
//     setTimeout(resolve, 700);
//   });

// // Add tasks to the queue
// queue.addTask(task1);
// queue.addTask(task2);
// queue.addTask(task3);
