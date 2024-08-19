import { describe, expect, test } from 'bun:test';
import * as fs from 'fs';

import FolderDB from '../FolderDB/index.js';
import { ValueType } from '../FolderDB/utils/enums.js';

const db = new FolderDB({ dbPath: './db' });

describe('[FOLDERS]', () => {
  test('Empty pointers', async () => {
    const result = db.get('');
    const dir = fs.readdirSync('./db');

    expect(result.data).toEqual(dir);
  });

  test('Folder navigation', async () => {
    const result = db.get('users');
    const dir = fs.readdirSync('./db/users');

    expect(result.data).toEqual(dir);
    expect(result.valueType).toEqual(ValueType.DIRECTORY);
  });
});

describe('[FILES]', () => {
  test('Navigating to a file', async () => {
    const result = db.get('users.posts.1234');
    const data = fs.readFileSync('./db/users/posts/1234.json', 'UTF-8');

    expect(result.data).toEqual(JSON.parse(data));
    expect(result.valueType).toEqual(ValueType.FILE);
    expect(result.targetFile).toEqual('db/users/posts/1234.json');
  });
});

describe('[VALUES]', () => {
  test('Pointers within a file', async () => {
    const result = db.get('users.posts.1234.title');
    const data = fs.readFileSync('./db/users/posts/1234.json', 'UTF-8');

    expect(result.data).toEqual(JSON.parse(data).title);
    expect(result.valueType).toEqual(ValueType.VALUE);
    expect(result.targetFile).toEqual('db/users/posts/1234.json');
  });

  test('Navigating arrays', async () => {
    const result = db.get('users.posts.1234.links.0.name');
    const data = fs.readFileSync('./db/users/posts/1234.json', 'UTF-8');

    expect(result.data).toEqual(JSON.parse(data).links[0].name);
  });
});

describe('[ERROR HANDLING]', () => {
  test('Wrong db path', async () => {
    const errorDB = db._clone();
    errorDB.dbPath = './nothing';

    expect(() => {
      errorDB.get('nothing');
    }).toThrow('Error reading directory ./nothing');
  });

  test('Wrong parameters', async () => {
    expect(() => {
      db.get();
    }).toThrow('Value must be string');
  });

  test('Wrong directory', async () => {
    expect(() => {
      db.get('nothing');
    }).toThrow('Error reading file db/nothing.json');
  });

  test('Wrong file', async () => {
    expect(() => {
      db.get('users.posts.nothing');
    }).toThrow('Error reading file db/users/posts/nothing.json');
  });

  test('Wrong value', async () => {
    expect(() => {
      db.get('users.posts.1234.nothing');
    }).toThrow('Path not found: nothing');
  });
});

describe('[OTHER]', () => {
  test('Chaining methods', async () => {
    const result = db.get('users.posts').get('1234').get('title');
    const data = fs.readFileSync('./db/users/posts/1234.json', 'UTF-8');

    expect(result.data).toEqual(JSON.parse(data).title);
  });
});
