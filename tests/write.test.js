import { describe, expect, test } from 'bun:test';
import * as fs from 'fs';

import FolderDB from '../FolderDB/index.js';

const db = new FolderDB({ dbPath: './db', mergeInstances: true });

describe('[SET]', () => {
  test('Writing with key and value', async () => {
    db.get('users.posts.1234.test').set('nestedKey', 'new value');
    let data = JSON.parse(fs.readFileSync('./db/users/posts/1234.json', 'UTF-8'));

    expect(data.test.nestedKey).toEqual('new value');
  });

  test('Writing without key', async () => {
    db.get('users.posts.1234.test.nestedKey').set('new value 2');
    let data = JSON.parse(fs.readFileSync('./db/users/posts/1234.json', 'UTF-8'));

    expect(data.test.nestedKey).toEqual('new value 2');
  });

  test('Writing with many keys', async () => {
    db.get('users.posts.1234').set('test2.deep.nest', 'nested new value');
    let data = JSON.parse(fs.readFileSync('./db/users/posts/1234.json', 'UTF-8'));

    expect(data.test2.deep.nest).toEqual('nested new value');
  });

  test('Overriding and instances', async () => {
    let instance = db.get('users.posts.1234.test').set('nestedKey', 'some value');
    let data = JSON.parse(fs.readFileSync('./db/users/posts/1234.json', 'UTF-8'));

    expect(data.test.nestedKey).toEqual('some value');

    instance.set('nestedKey', 'some other value');
    data = JSON.parse(fs.readFileSync('./db/users/posts/1234.json', 'UTF-8'));

    expect(data.test.nestedKey).toEqual('some other value');
  });
});

describe('[FILE]', () => {});

describe('[FOLDER]', () => {});

describe('[RENAME]', () => {});

describe('[REMOVE]', () => {});

describe('[ERRORS]', () => {});
