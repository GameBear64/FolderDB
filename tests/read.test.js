import { describe, expect, test } from 'bun:test';

import * as fs from 'fs';
import path from 'path';

import FolderDB from '../src/index.js';
import { ValueType } from '../src/utils/enums.js';

const db = new FolderDB({ dbPath: './test-db', mergeInstances: true });

describe('[FOLDERS]', () => {
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
    const result = db.get('nothing');
    expect(result.data).toEqual(null);
  });
});

describe('[FILES]', () => {
  test('Navigating to a file', () => {
    const result = db.get('users.posts.first');
    const directory = path.resolve('test-db/users/posts/first.json');
    const data = JSON.parse(fs.readFileSync(directory, 'UTF-8'));

    expect(result.data).toEqual(data);
    expect(result.valueType).toEqual(ValueType.FILE);
    expect(result.targetFile).toMatch(directory);
  });

  test('Reading an image', () => {
    const result = db.get('assets.airplane');
    const directory = path.resolve('test-db/assets/airplane.jpg');
    const data = fs.readFileSync(directory);

    expect(result.data).toEqual({ buffer: data, name: 'airplane', ext: '.jpg' });
  });

  test('Wrong file', () => {
    const result = db.get('users.posts.nothing');
    expect(result.data).toEqual(null);
  });
});

describe('[VALUES]', () => {
  test('Pointers within a file', () => {
    const result = db.get('users.posts.first.title');
    const directory = path.resolve('test-db/users/posts/first.json');
    const data = JSON.parse(fs.readFileSync(directory, 'UTF-8'));

    expect(result.data).toEqual(data.title);
    expect(result.valueType).toEqual(ValueType.VALUE);
    expect(result.targetFile).toMatch(directory);
  });

  test('Navigating arrays', () => {
    const result = db.get('users.posts.first.links.0.name');
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(result.data).toEqual(data.links[0].name);
  });

  test('Range selector and values', () => {
    const result = db.get('users.posts.first.links.[1:3].name');
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(result.data).toEqual(['discord', 'twitter']);
    expect(result.data).toEqual([data.links[1].name, data.links[2].name]);
  });

  test('Array selected values values', () => {
    const result = db.get('users.posts.first.links.name');
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(result.data).toEqual(['google', 'discord', 'twitter']);
    expect(result.data).toEqual(data.links.map(l => l.name));
  });

  test('Wrong value', () => {
    const result = db.get('users.posts.first.nothing');
    expect(result.data).toEqual(null);
  });
});

describe('[TREE]', () => {
  test('Retrieve directory structure', () => {
    const usersDataFirst = fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8');
    const usersGam = fs.readFileSync('./test-db/users/gam.json', 'UTF-8');
    const products = fs.readFileSync('./test-db/products.json', 'UTF-8');

    const result = db.getTree('');

    expect(result.users.posts.first).toEqual(JSON.parse(usersDataFirst));
    expect(result.users.gam).toEqual(JSON.parse(usersGam));
    expect(result.products).toEqual(JSON.parse(products));
  });

  test('Retrieve partial file structure', () => {
    const usersDataFirst = fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8');

    const result = db.getTree('users.posts.first.links');

    expect(result).toEqual(JSON.parse(usersDataFirst).links);
  });

  test('Error handling for non-string value', () => {
    expect(() => {
      db.get('').getTree(123);
    }).toThrow('Value must be string');
  });

  test('Error handling for invalid path', () => {
    expect(() => {
      db.get('').getTree('nonexistentFile');
    }).toThrow('No such file or directory');
  });

  test('Error handling for path not in directory', () => {
    expect(() => {
      db.get('').getTree('file1.nonexistentFile');
    }).toThrow('No such file or directory');
  });
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

describe('[FILE_EXISTS]', () => {
  test('Checking if a file exists', () => {
    db.get('users').createFile('existingFile');
    const filePath = './test-db/users/existingFile.json';

    // Test for an existing file
    expect(fs.existsSync(filePath)).toBe(true);
    expect(db.get('users').fileExists('existingFile.json')).toBe(true);

    // Test for a non-existing file
    expect(db.get('users').fileExists('nonExistentFile.json')).toBe(false);
  });
});

describe('[METADATA]', () => {
  test('Retrieving file metadata', () => {
    const userData = { id: 1, name: 'John Doe' };
    db.get('users').createFile('metadataFile', userData);

    const metadata = db.get('users.metadataFile').metadata();
    expect(metadata).toBeTruthy();
    expect(metadata.type).toBe('file');
    expect(metadata.size).toBeGreaterThan(0);
    expect(metadata.createdAt).toBeInstanceOf(Date);
    expect(metadata.modifiedAt).toBeInstanceOf(Date);

    // Test for non-existing file metadata
    const nonExistentMetadata = db.get('users.nothing').metadata();
    expect(nonExistentMetadata).toBeNull();
  });
});

describe('[OTHER]', () => {
  test('Chaining methods', () => {
    const result = db.get('users.posts').get('first').get('title');
    const data = fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8');

    expect(result.data).toEqual(JSON.parse(data).title);
  });
});
