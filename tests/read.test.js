import { describe, expect, test } from 'bun:test';
import * as fs from 'fs';

import FolderDB from '../FolderDB/index.js';

const db = new FolderDB({ dbPath: './db' });

describe('[FOLDERS]', () => {
  test('Error handling', async () => {
    expect(() => {
      db.get('nothing');
    }).toThrow('Error reading file db/nothing.json');
  });

  test('Reading empty get', async () => {
    const result = db.get('');
    const dir = fs.readdirSync('./db');

    expect(result.data).toEqual(dir);
  });

  test('Reading folder get', async () => {
    const result = db.get('users');
    const dir = fs.readdirSync('./db/users');

    expect(result.data).toEqual(dir);
  });
});

describe('[FILES]', () => {
  test('Error handing', async () => {
    expect(() => {
      db.get('users.posts.nothing');
    }).toThrow('Error reading file db/users/posts/nothing.json');
  });

  test('Reading file get', async () => {
    const result = db.get('users.posts.1234');
    const data = fs.readFileSync('./db/users/posts/1234.json', 'UTF-8');

    expect(result.data).toEqual(JSON.parse(data));
  });
});

describe('[VALUES]', () => {
  test('Error handing', async () => {
    expect(() => {
      db.get('users.posts.1234.nothing');
    }).toThrow('Path not found: nothing');
  });

  test('Reading value', async () => {
    const result = db.get('users.posts.1234.title');
    const data = fs.readFileSync('./db/users/posts/1234.json', 'UTF-8');

    expect(result.data).toEqual(JSON.parse(data).title);
  });

  test('Array values', async () => {
    const result = db.get('users.posts.1234.links.0.name');
    const data = fs.readFileSync('./db/users/posts/1234.json', 'UTF-8');

    expect(result.data).toEqual(JSON.parse(data).links[0].name);
  });
});

describe('[OTHER]', () => {
  test('Chaining gets', async () => {
    const result = db.get('users.posts').get('1234').get('title');
    const data = fs.readFileSync('./db/users/posts/1234.json', 'UTF-8');

    expect(result.data).toEqual(JSON.parse(data).title);
  });
});
