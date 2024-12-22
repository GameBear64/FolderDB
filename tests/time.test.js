import { describe, expect, test } from 'bun:test';
import * as fs from 'fs';

import FolderDB from '../src/index.js';

const db = new FolderDB({ dbPath: './test-db', mergeInstances: true });

describe('[CREATE]', () => {
  test('Creating timestamp', () => {
    let result = db.get('users.posts.first').setTimestamp('updated_at');
    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.updated_at).toEqual(result.data.updated_at);

    result = db.get('users.posts.first.updated_at').setTimestamp();
    data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.updated_at).toEqual(result.data);
  });

  test('Creating future timestamp', () => {
    let result = db.get('users.posts.first').setFutureTimestamp('will_update_at', 6000);
    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.will_update_at).toEqual(result.data.will_update_at);

    result = db.get('users.posts.first.will_update_at').setFutureTimestamp(3000);
    data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.will_update_at).toEqual(result.data);
  });

  test('Error handling wrong argument', () => {
    expect(() => {
      db.get('users.posts.first.will_update_at').setFutureTimestamp('aaa');
    }).toThrow('This method can only be used with numbers representing timestamps');
  });

  test('Error handling multiple wrong arguments', () => {
    expect(() => {
      db.get('users.posts.first.will_update_at').setFutureTimestamp('aaa', 'bbb');
    }).toThrow('The first argument must be a string (for name) or a number (for milliseconds)');
  });
});

describe('[UPDATE]', () => {
  test('Advancing timestamp', () => {
    let original = db.get('users.posts.first.will_update_at');
    let result = db.get('users.posts.first.will_update_at').advanceTime(2000);

    expect(result.data).toEqual(original.data + 2000);

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.will_update_at).toEqual(result.data);
  });

  test('Rewinding timestamp', () => {
    let original = db.get('users.posts.first.will_update_at');
    let result = db.get('users.posts.first.will_update_at').rewindTime(5000);

    expect(result.data).toEqual(original.data - 5000);

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.will_update_at).toEqual(result.data);
  });

  test('Error handling', () => {
    expect(() => {
      db.get('users.posts.first.will_update_at').advanceTime('aaa');
    }).toThrow('This method can only be used on numbers representing timestamps');
  });
});
