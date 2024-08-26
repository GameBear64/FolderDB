import { describe, expect, test } from 'bun:test';
import * as fs from 'fs';

import FolderDB from '../FolderDB/index.js';

const db = new FolderDB({ dbPath: './db', mergeInstances: true });

describe('[CREATE]', () => {
  test('Creating timestamp', async () => {
    let result = db.get('users.posts.1234').setTimestamp('updated_at');
    let data = JSON.parse(fs.readFileSync('./db/users/posts/1234.json', 'UTF-8'));

    expect(data.updated_at).toEqual(result.updated_at);

    result = db.get('users.posts.1234.updated_at').setTimestamp();
    data = JSON.parse(fs.readFileSync('./db/users/posts/1234.json', 'UTF-8'));

    expect(data.updated_at).toEqual(result);
  });

  test('Creating future timestamp', async () => {
    let result = db.get('users.posts.1234').setFutureTimestamp('will_update_at', 6000);
    let data = JSON.parse(fs.readFileSync('./db/users/posts/1234.json', 'UTF-8'));

    expect(data.will_update_at).toEqual(result.will_update_at);

    result = db.get('users.posts.1234.will_update_at').setFutureTimestamp(3000);
    data = JSON.parse(fs.readFileSync('./db/users/posts/1234.json', 'UTF-8'));

    expect(data.will_update_at).toEqual(result);
  });

  test('Error handling', async () => {
    expect(() => {
      db.get('users.posts.1234.will_update_at').setFutureTimestamp('aaa');
    }).toThrow('This method can only be used with numbers representing timestamps');
  });
});

describe('[UPDATE]', () => {
  test('Updating timestamp', async () => {
    let result = db.get('users.posts.1234.will_update_at').increaseTimestamp(2000);
    let data = JSON.parse(fs.readFileSync('./db/users/posts/1234.json', 'UTF-8'));

    expect(data.will_update_at).toEqual(result);
  });

  test('Error handling', async () => {
    expect(() => {
      db.get('users.posts.1234.will_update_at').increaseTimestamp('aaa');
    }).toThrow('This method can only be used on numbers representing timestamps');
  });
});

describe('[CHECK]', () => {
  test('Checking if timestamp has passed', async () => {
    expect(db.get('users.posts.1234.will_update_at').isPast()).toEqual(false);
  });
});
