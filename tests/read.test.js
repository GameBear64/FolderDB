import { describe, expect, test } from 'bun:test';

import * as fs from 'fs';
import path from 'path';

import FolderDB from '../src/index.js';
import { ValueType } from '../src/utils/enums.js';

const db = new FolderDB({ dbPath: './test-db', mergeInstances: true });

describe('[FOLDERS]', () => {
  test('Wrong db path', () => {
    const errorDB = db._clone();
    errorDB.dbPath = './nothing';

    expect(() => {
      errorDB.get('nothing');
    }).toThrow('Invalid directory path: ./nothing');
  });

  test('Wrong parameters', () => {
    expect(() => {
      db.get();
    }).toThrow('Value must be string');
  });

  test('Empty pointers', () => {
    const result = db.get('');
    const dir = fs.readdirSync('./test-db');

    expect(result.data).toEqual(dir);
  });

  test('Folder navigation', () => {
    const result = db.get('users');
    const dir = fs.readdirSync('./test-db/users');

    expect(result.data).toEqual(dir);
    expect(result.valueType).toEqual(ValueType.DIRECTORY);
  });

  test('Wrong directory', () => {
    expect(() => {
      db.get('nothing');
    }).toThrow('Error reading file');
  });
});

describe('[FILES]', () => {
  test('Navigating to a file', () => {
    const result = db.get('users.posts.first');
    const directory = path.resolve('test-db/users/posts/first.json');
    const data = fs.readFileSync(directory, 'UTF-8');

    expect(result.data).toEqual(JSON.parse(data));
    expect(result.valueType).toEqual(ValueType.FILE);
    expect(result.targetFile).toMatch(directory);
  });

  test('Wrong file', () => {
    expect(() => {
      db.get('users.posts.nothing');
    }).toThrow('Error reading file');
  });
});

describe('[VALUES]', () => {
  test('Pointers within a file', () => {
    const result = db.get('users.posts.first.title');
    const directory = path.resolve('test-db/users/posts/first.json');
    const data = fs.readFileSync(directory, 'UTF-8');

    expect(result.data).toEqual(JSON.parse(data).title);
    expect(result.valueType).toEqual(ValueType.VALUE);
    expect(result.targetFile).toMatch(directory);
  });

  test('Navigating arrays', () => {
    const result = db.get('users.posts.first.links.0.name');
    const data = fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8');

    expect(result.data).toEqual(JSON.parse(data).links[0].name);
  });

  test('Wrong value', () => {
    expect(() => {
      db.get('users.posts.first.nothing');
    }).toThrow('Path not found: nothing');
  });
});

describe('[TREE]', () => {
  // TODO
});

describe('[BACK]', () => {
  test('Navigating backwards', () => {
    const data = fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8');

    const result = db.get('users.posts.first.author.name');
    expect(result.data).toEqual(JSON.parse(data).author.name);

    result.back();
    expect(result.data).toEqual(JSON.parse(data).author);

    result.back(2);
    const dirData = fs.readdirSync('./test-db/users/posts');
    expect(result.data).toEqual(dirData);
  });

  test('Wrong back value', () => {
    expect(() => {
      db.get('users.posts.first').back('first');
    }).toThrow('Steps must be a positive number');
  });
});

describe('[OTHER]', () => {
  test('Chaining methods', () => {
    const result = db.get('users.posts').get('first').get('title');
    const data = fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8');

    expect(result.data).toEqual(JSON.parse(data).title);
  });
});
