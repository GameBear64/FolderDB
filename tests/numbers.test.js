import { describe, expect, test } from 'bun:test';
import * as fs from 'fs';

import FolderDB from '../FolderDB/index.js';

const db = new FolderDB({ dbPath: './db', mergeInstances: true });

describe('[INC]', () => {
  test('Incrementing', async () => {
    const result = db.get('users.posts.1234.likes').inc();
    let data = JSON.parse(fs.readFileSync('./db/users/posts/1234.json', 'UTF-8'));

    expect(data.likes).toEqual(result);
  });

  test('Error handling', async () => {
    expect(() => {
      db.get('users.posts.1234.title').inc();
    }).toThrow('You can only increment numbers.');
  });
});

describe('[DEC]', () => {
  test('Decrementing', async () => {
    const result = db.get('users.posts.1234.likes').dec();
    let data = JSON.parse(fs.readFileSync('./db/users/posts/1234.json', 'UTF-8'));

    expect(data.likes).toEqual(result);
  });

  test('Error handling', async () => {
    expect(() => {
      db.get('users.posts.1234.title').dec();
    }).toThrow('You can only decrement numbers.');
  });
});

describe('[ADD]', () => {});

describe('[SUB]', () => {});

describe('[RANDOM]', () => {});

describe('[ADD_RANDOM]', () => {});

describe('[SUB_RANDOM]', () => {});
