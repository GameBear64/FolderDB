import { describe, expect, test, beforeAll } from 'bun:test';
import * as fs from 'fs';

import FolderDB from '../src/index.js';

const db = new FolderDB({ dbPath: './test-db', mergeInstances: true });

describe('[MERGE]', () => {
  beforeAll(() => {
    db.get('users.posts.first').set('sidePost', {
      title: 'Hello World',
      content: 'This is a test post.',
      author: 'John Doe',
      password: 'secret',
    });
  });

  test('Merging objects', () => {
    const result = db.get('users.posts.first.sidePost').merge({ likes: 100 });
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.sidePost.likes).toEqual(result.data.likes);
    expect(data.sidePost).toEqual(result.data);
  });

  test('Error handling for non-objects', () => {
    expect(() => {
      db.get('users.posts.first.sidePost.title').merge('notAnObject');
    }).toThrow('merge() can only be used on objects.');
  });
});

describe('[PICK]', () => {
  beforeAll(() => {
    db.get('users.posts.first').set('sidePost', {
      title: 'Hello World',
      content: 'This is a test post.',
      author: 'John Doe',
      password: 'secret',
    });
  });

  test('Picking desired fields', () => {
    const result = db.get('users.posts.first.sidePost').pick(['title', 'author']);
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(Object.keys(result.data)).toEqual(['title', 'author']);
    expect(result.data.title).toEqual(data.sidePost.title);
    expect(result.data.author).toEqual(data.sidePost.author);
  });

  test('Error handling for non-array argument', () => {
    expect(() => {
      db.get('users.posts.first.sidePost').pick('title');
    }).toThrow('pick() needs an array with the desired fields');
  });

  test('Error handling for non-objects', () => {
    expect(() => {
      db.get('users.posts.first.sidePost.title').pick(['title']);
    }).toThrow('pick() can only be used on objects.');
  });
});

describe('[OMIT]', () => {
  beforeAll(() => {
    db.get('users.posts.first').set('sidePost', {
      title: 'Hello World',
      content: 'This is a test post.',
      author: 'John Doe',
      password: 'secret',
    });
  });

  test('Omitting specified fields', () => {
    const result = db.get('users.posts.first.sidePost').omit(['password']);
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(result.data.password).toBeUndefined();
    expect(result.data.title).toEqual(data.sidePost.title);
    expect(result.data.content).toEqual(data.sidePost.content);
  });

  test('Error handling for non-array argument', () => {
    expect(() => {
      db.get('users.posts.first.sidePost').omit('password');
    }).toThrow('omit() needs an array with the fields to omit');
  });

  test('Error handling for non-objects', () => {
    expect(() => {
      db.get('users.posts.first.sidePost.title').omit(['password']);
    }).toThrow('omit() can only be used on objects.');
  });
});
