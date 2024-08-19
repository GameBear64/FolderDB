import { describe, expect, test } from 'bun:test';
import * as fs from 'fs/promises';

import FolderDB from '../FolderDB/index.js';

const db = new FolderDB({ dbPath: './db' });

describe('[FOLDERS]', () => {
  test('Error handling', async () => {
    expect(db.get('nothing')).rejects.toThrow('Error reading file db/nothing.json');
  });

  test('Reading empty get', async () => {
    const result = await db.get('');
    const dir = await fs.readdir('./db');

    expect(result.data).toEqual(dir);
  });

  test('Reading folder get', async () => {
    const result = await db.get('users');
    const dir = await fs.readdir('./db/users');

    expect(result.data).toEqual(dir);
  });
});

describe('[FILES]', () => {
  test('Error handing', async () => {
    expect(db.get('users.posts.nothing')).rejects.toThrow('Error reading file db/users/posts/nothing.json');
  });

  test('Reading file get', async () => {
    const result = await db.get('users.posts.1234');
    const data = await fs.readFile('./db/users/posts/1234.json', 'UTF-8');

    expect(result.data).toEqual(JSON.parse(data));
  });
});

describe('[VALUES]', () => {
  test('Error handing', async () => {
    expect(db.get('users.posts.1234.nothing')).rejects.toThrow('Path not found: nothing');
  });

  test('Reading value', async () => {
    const result = await db.get('users.posts.1234.title');
    const data = await fs.readFile('./db/users/posts/1234.json', 'UTF-8');

    expect(result.data).toEqual(JSON.parse(data).title);
  });
});
