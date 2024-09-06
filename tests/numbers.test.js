import { describe, expect, test } from 'bun:test';
import * as fs from 'fs';

import FolderDB from '../src/index.js';

const db = new FolderDB({ dbPath: './test-db', mergeInstances: true });

describe('[INC]', () => {
  test('Incrementing', () => {
    const result = db.get('users.posts.first.likes').inc();
    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.likes).toEqual(result.data);
  });

  test('Error handling', () => {
    expect(() => {
      db.get('users.posts.first.title').inc();
    }).toThrow('You can only increment numbers.');
  });
});

describe('[DEC]', () => {
  test('Decrementing', () => {
    const result = db.get('users.posts.first.likes').dec();
    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.likes).toEqual(result.data);
  });

  test('Error handling', () => {
    expect(() => {
      db.get('users.posts.first.title').dec();
    }).toThrow('You can only decrement numbers.');
  });
});

describe('[ADD]', () => {});

describe('[SUB]', () => {});

describe('[RANDOM]', () => {});

describe('[ADD_RANDOM]', () => {});

describe('[SUB_RANDOM]', () => {});
