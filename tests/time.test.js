import { describe, expect, test } from 'bun:test';
import * as fs from 'fs';

import FolderDB from '../src/index.js';

const db = new FolderDB({ dbPath: './test-db', mergeInstances: true });

describe('[CREATE]', () => {
  test('Creating timestamp', () => {
    let result = db.get('users.posts.first').setTimestamp('updated_at');
    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.updated_at).toEqual(result.updated_at);

    result = db.get('users.posts.first.updated_at').setTimestamp();
    data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.updated_at).toEqual(result);
  });

  test('Creating future timestamp', () => {
    let result = db.get('users.posts.first').setFutureTimestamp('will_update_at', 6000);
    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.will_update_at).toEqual(result.will_update_at);

    result = db.get('users.posts.first.will_update_at').setFutureTimestamp(3000);
    data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.will_update_at).toEqual(result);
  });

  test('Error handling', () => {
    expect(() => {
      db.get('users.posts.first.will_update_at').setFutureTimestamp('aaa');
    }).toThrow('This method can only be used with numbers representing timestamps');
  });
});

describe('[UPDATE]', () => {
  test('Updating timestamp', () => {
    let result = db.get('users.posts.first.will_update_at').increaseTimestamp(2000);
    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.will_update_at).toEqual(result);
  });

  test('Error handling', () => {
    expect(() => {
      db.get('users.posts.first.will_update_at').increaseTimestamp('aaa');
    }).toThrow('This method can only be used on numbers representing timestamps');
  });
});

describe('[CHECK]', () => {
  test('Checking if timestamp has passed', () => {
    expect(db.get('users.posts.first.will_update_at').isPast()).toEqual(false);
  });
});
