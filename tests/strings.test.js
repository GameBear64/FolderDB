import { describe, expect, test } from 'bun:test';
import * as fs from 'fs';

import FolderDB from '../src/index.js';

import { CaseFormat } from '../src/utils/enums.js';

const db = new FolderDB({ dbPath: './test-db', mergeInstances: true });

describe('[CHANGE CASE]', () => {
  test('Changing case to lower', () => {
    db.get('users.posts.first').set('title', 'Hello World');

    db.get('users.posts.first.title').changeCase(CaseFormat.LOWER);

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.title).toEqual('hello world');
  });

  test('Changing case to title', () => {
    db.get('users.posts.first').set('title', 'Hello World');

    db.get('users.posts.first.title').changeCase(CaseFormat.TITLE);

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.title).toEqual('Hello World');
  });

  test('Changing case to upper', () => {
    db.get('users.posts.first').set('title', 'Hello World');

    db.get('users.posts.first.title').changeCase(CaseFormat.UPPER);

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.title).toEqual('HELLO WORLD');
  });

  test('Changing case to Pascal', () => {
    db.get('users.posts.first').set('title', 'hello world');

    db.get('users.posts.first.title').changeCase(CaseFormat.PASCAL);

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.title).toEqual('Hello World');
  });

  test('Changing case to Snake', () => {
    db.get('users.posts.first').set('title', 'Hello World');

    db.get('users.posts.first.title').changeCase(CaseFormat.SNAKE);

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.title).toEqual('hello_world');
  });

  test('Changing case to Camel', () => {
    db.get('users.posts.first').set('title', 'Hello World');

    db.get('users.posts.first.title').changeCase(CaseFormat.CAMEL);

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.title).toEqual('helloWorld');
  });

  test('Changing case to Kebab', () => {
    db.get('users.posts.first').set('title', 'Hello World');

    db.get('users.posts.first.title').changeCase(CaseFormat.KEBAB);

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.title).toEqual('Hello-World');
  });

  test('Changing case to Flat', () => {
    db.get('users.posts.first').set('title', 'Hello World');

    db.get('users.posts.first.title').changeCase(CaseFormat.FLAT);

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.title).toEqual('helloworld');
  });

  test('Changing case to Slug', () => {
    db.get('users.posts.first').set(
      'title',
      'mIxEd CaSe TiTlE and   trailing whitespace    with - existing hyphens -- & Special™ characters'
    );

    db.get('users.posts.first.title').changeCase(CaseFormat.SLUG);

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.title).toEqual('mixed-case-title-and-trailing-whitespace-with-existing-hyphens-special-characters');
  });

  test('Changing case to Reverse', () => {
    db.get('users.posts.first').set('title', 'Hello World');

    db.get('users.posts.first.title').changeCase(CaseFormat.REVERSE);

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.title).toEqual('dlroW olleH');
  });

  test('Changing case to Reverse', () => {
    db.get('users.posts.first').set('title', 'Hello World 🎉');

    db.get('users.posts.first.title').changeCase(CaseFormat.ASCII);

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.title).toEqual('Hello World');
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

  // TODO: chaining mutations like title case -> kebab case
});

describe('[NORMALIZE CASE]', () => {
  test('Normalizing snake_case string with punctuation', () => {
    db.get('users.posts.first').set('text', 'hello_world!!');

    db.get('users.posts.first.text').normalizeCase();

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.text).toEqual('Hello world!!');
  });

  test('Normalizing PascalCase string', () => {
    db.get('users.posts.first').set('text', 'HelloWorld');

    db.get('users.posts.first.text').normalizeCase();

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.text).toEqual('Hello world');
  });

  test('Normalizing camelCase string', () => {
    db.get('users.posts.first').set('text', 'helloWorld');

    db.get('users.posts.first.text').normalizeCase();

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.text).toEqual('Hello world');
  });

  test('Normalizing kebab-case string with punctuation', () => {
    db.get('users.posts.first').set('text', 'hello-world');

    db.get('users.posts.first.text').normalizeCase();

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.text).toEqual('Hello world');
  });

  test('Normalizing train-case string', () => {
    db.get('users.posts.first').set('text', 'hello-world');

    db.get('users.posts.first.text').normalizeCase();

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.text).toEqual('Hello world');
  });

  test('Normalizing slug case string', () => {
    db.get('users.posts.first').set('text', 'hello-slug');

    db.get('users.posts.first.text').normalizeCase();

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.text).toEqual('Hello slug');
  });

  test('Normalizing string with extra spaces and punctuation', () => {
    db.get('users.posts.first').set('text', '  hello    world  ');

    db.get('users.posts.first.text').normalizeCase();

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.text).toEqual('Hello world');
  });

  test('Normalizing string with multiple punctuations', () => {
    db.get('users.posts.first').set('text', 'hello_world!!! & more text...');

    db.get('users.posts.first.text').normalizeCase();

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.text).toEqual('Hello world!!! & more text...');
  });

  test('Normalizing empty string', () => {
    db.get('users.posts.first').set('text', '');

    db.get('users.posts.first.text').normalizeCase();

    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.text).toEqual('');
  });

  test('Error handling when normalizeCase is called with a non-string', () => {
    db.get('users.posts.first').set('text', ['tag1', 'tag2']);

    expect(() => {
      db.get('users.posts.first.text').normalizeCase();
    }).toThrow('You can only use normalizeCase on strings.');
  });
});
