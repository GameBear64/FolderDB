import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { EventManager, TaskQueue } from '../src/utils/all.js';

describe('EVENT MANAGER', () => {
  let eventManager;

  beforeEach(() => {
    eventManager = new EventManager();
  });

  test('should register an event listener with on()', () => {
    const callback = mock();
    eventManager.on('test', callback);
    expect(eventManager.events['test']).toContain(callback);
  });

  test('should remove an event listener with off()', () => {
    const callback = mock();
    eventManager.on('test', callback);
    eventManager.off('test', callback);
    expect(eventManager.events['test']).not.toContain(callback);
  });

  test('should call a listener only once with once()', () => {
    const callback = mock();
    eventManager.once('test', callback);
    eventManager.emit('test');
    eventManager.emit('test');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should emit an event and call all listeners', () => {
    const callback1 = mock();
    const callback2 = mock();
    eventManager.on('test', callback1);
    eventManager.on('test', callback2);
    eventManager.emit('test', 'data');
    expect(callback1).toHaveBeenCalledWith('data');
    expect(callback2).toHaveBeenCalledWith('data');
  });

  test('should return the last listener result from emit()', () => {
    eventManager.on('test', () => 1);
    eventManager.on('test', () => 2);
    const result = eventManager.emit('test');
    expect(result).toBe(2);
  });

  test('should handle emit() with no listeners', () => {
    expect(() => eventManager.emit('nonexistent')).not.toThrow();
  });

  test('should not fail when off() is called for an event with no listeners', () => {
    expect(() => eventManager.off('nonexistent', mock())).not.toThrow();
  });
});

describe('QUEUE', () => {
  let taskQueue;

  beforeEach(() => {
    taskQueue = new TaskQueue();
  });

  test('should add a task to the queue', () => {
    const task = mock();
    taskQueue.add(task);
    expect(taskQueue.queue).toHaveLength(0);
  });

  test('should process tasks in the queue', () => {
    const task1 = mock();
    const task2 = mock();
    taskQueue.add(task1);
    taskQueue.add(task2);
    expect(task1).toHaveBeenCalledTimes(1);
    expect(task2).toHaveBeenCalledTimes(1);
  });

  test('should process tasks sequentially', () => {
    const taskOrder = [];
    const task1 = () => taskOrder.push(1);
    const task2 = () => taskOrder.push(2);
    taskQueue.add(task1);
    taskQueue.add(task2);
    expect(taskOrder).toEqual([1, 2]);
  });

  test('should handle tasks that throw errors', () => {
    const errorTask = mock(() => {
      throw new Error('Task failed');
    });
    const nextTask = mock();
    expect(() => taskQueue.add(errorTask)).toThrow('Task failed');
    taskQueue.add(nextTask);
    expect(nextTask).toHaveBeenCalledTimes(1);
  });

  test('should not start processing if already processing', () => {
    const task1 = mock(() => {
      taskQueue.add(() => {});
    });
    const task2 = mock();
    taskQueue.add(task1);
    taskQueue.add(task2);
    expect(task1).toHaveBeenCalledTimes(1);
    expect(task2).toHaveBeenCalledTimes(1);
  });

  test('should return the result of the current task', () => {
    const task = mock(() => 'result');
    const result = taskQueue.add(task);
    expect(result).toBe('result');
  });
});
