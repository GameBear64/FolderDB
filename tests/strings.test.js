import { describe, expect, test } from 'bun:test';
import * as fs from 'fs';

import FolderDB from '../src/index.js';

import { CaseFormat } from '../src/utils/enums.js';

const db = new FolderDB({ dbPath: './test-db', mergeInstances: true });

describe('[CHANGE_CASE]', () => {
  test('Changing case to lower', () => {
    db.get('users.posts.first').set('title', 'Hello World');

    db.get('users.posts.first.title').changeCase(CaseFormat.LOWER);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.title).toEqual('hello world');
  });

  test('Changing case to upper', () => {
    db.get('users.posts.first').set('title', 'Hello World');

    db.get('users.posts.first.title').changeCase(CaseFormat.UPPER);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.title).toEqual('HELLO WORLD');
  });

  test('Changing case to Pascal', () => {
    db.get('users.posts.first').set('title', 'hello world');

    db.get('users.posts.first.title').changeCase(CaseFormat.PASCAL);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.title).toEqual('Hello World');
  });

  test('Changing case to Snake', () => {
    db.get('users.posts.first').set('title', 'Hello World');

    db.get('users.posts.first.title').changeCase(CaseFormat.SNAKE);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.title).toEqual('hello_world');
  });

  test('Changing case to Camel', () => {
    db.get('users.posts.first').set('title', 'Hello World');

    db.get('users.posts.first.title').changeCase(CaseFormat.CAMEL);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.title).toEqual('helloWorld');
  });

  test('Changing case to Kebab', () => {
    db.get('users.posts.first').set('title', 'Hello World');

    db.get('users.posts.first.title').changeCase(CaseFormat.KEBAB);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.title).toEqual('hello-world');
  });

  test('Changing case to Flat', () => {
    db.get('users.posts.first').set('title', 'Hello World');

    db.get('users.posts.first.title').changeCase(CaseFormat.FLAT);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.title).toEqual('helloworld');
  });

  test('Changing case to Train', () => {
    db.get('users.posts.first').set('title', 'Hello World');

    db.get('users.posts.first.title').changeCase(CaseFormat.TRAIN);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.title).toEqual('Hello-World');
  });

  test('Changing case to Slug', () => {
    db.get('users.posts.first').set(
      'title',
      'mIxEd CaSe TiTlE and   trailing whitespace    with - existing hyphens -- & Special™ characters'
    );

    db.get('users.posts.first.title').changeCase(CaseFormat.SLUG);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.title).toEqual('mixed-case-title-and-trailing-whitespace-with-existing-hyphens-special-characters');
  });

  test('Changing case to Reverse', () => {
    db.get('users.posts.first').set('title', 'Hello World');

    db.get('users.posts.first.title').changeCase(CaseFormat.REVERSE);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.title).toEqual('dlroW olleH');
  });

  test('Error handling when changeCase is called with a non-string', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2']);

    expect(() => {
      db.get('users.posts.first.tags').changeCase(CaseFormat.UPPER);
    }).toThrow('You can only use changeCase on strings.');
  });

  test('Error handling for unsupported case format', () => {
    db.get('users.posts.first').set('title', 'Hello World');

    expect(() => {
      db.get('users.posts.first.title').changeCase('UNSUPPORTED');
    }).toThrow('Unsupported case format.');
  });
});
