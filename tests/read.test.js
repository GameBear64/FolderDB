import { describe, expect, test } from 'bun:test';
import * as fs from 'fs/promises';

import FolderDB from '../FolderDB/index.js';

const db = new FolderDB({ dbPath: './db' });

describe('[FOLDERS]', () => {
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
  test('Reading file get', async () => {
    const result = await db.get('users.posts.1234');
    const data = await fs.readFile('./db/users/posts/1234.json', 'UTF-8');

    expect(result.data).toEqual(JSON.parse(data));
  });
});
