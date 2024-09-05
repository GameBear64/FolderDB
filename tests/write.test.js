import { describe, expect, test } from 'bun:test';
import * as fs from 'fs';

import FolderDB from '../src/index.js';

const db = new FolderDB({ dbPath: './test-db', mergeInstances: true });

describe('[SET]', () => {
  test('Writing with key and value', () => {
    const reference = db.get('users.posts.first.author');
    reference.set('id', 'some_random_id');
    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.author.id).toEqual('some_random_id');
    expect(reference.data.id).toEqual('some_random_id');
  });

  test('Writing without key', () => {
    const reference = db.get('users.posts.first.author.id');
    reference.set('other_random_id');

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.author.id).toEqual('other_random_id');
    expect(reference.data).toEqual('other_random_id');
  });

  test('Creating a matrix', () => {
    const reference = db.get('users.posts.first');
    reference.set('matrix', [0, 1, [2, 3]]);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.matrix).toEqual([0, 1, [2, 3]]);
    expect(reference.data.matrix).toEqual([0, 1, [2, 3]]);
  });

  test('Ensures correct update of indices in a matrix', () => {
    const reference = db.get('users.posts.first.matrix');
    reference.set('2.1', 5);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.matrix[2][1]).toEqual(5);
    expect(reference.data[2][1]).toEqual(5);
  });

  test('Updates the value when setting an object', () => {
    const reference = db.get('users.posts.first');
    reference.set('obj', {});

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.obj).toEqual({});
    expect(reference.data.obj).toEqual({});
  });

  test('Writing with many keys', () => {
    const reference = db.get('users.posts.first');
    reference.set('test2.deep.nest', 'nested new value');

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.test2.deep.nest).toEqual('nested new value');
    expect(reference.data.test2.deep.nest).toEqual('nested new value');
  });

  test('Overriding and instances', () => {
    let instance = db.get('users.posts.first').set('testKey', 'some value');

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.testKey).toEqual('some value');
    expect(instance.data.testKey).toEqual('some value');

    instance.set('testKey', 'some other value');
    data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.testKey).toEqual('some other value');
    expect(instance.data.testKey).toEqual('some other value');
  });
});

describe('[FOLDER]', () => {
  test('Creating a folder', () => {
    db.get('users').createFolder('testFolder');

    expect(!!db.get('users.testFolder')).toEqual(true);
    expect(!!fs.existsSync('./test-db/users/testFolder')).toEqual(true);
  });
});

describe('[FILE]', () => {
  test('Creating a file', () => {
    db.get('users').createFile('newFile');
    db.get('users').createFile('folder/subFolder/new');

    const newFile = JSON.parse(fs.readFileSync('./test-db/users/newFile.json', 'UTF-8'));
    const newInFolder = JSON.parse(fs.readFileSync('./test-db/users/folder/subFolder/new.json', 'UTF-8'));

    expect(newFile).toEqual({});
    expect(newInFolder).toEqual({});

    expect(db.get('users.newFile').data).toEqual(newFile);
    expect(db.get('users.folder.subFolder.new').data).toEqual(newInFolder);
  });
});

describe('[RENAME]', () => {
  test('Renaming a file', () => {
    db.get('users').createFile('renameFile');
    db.get('users.renameFile').rename('renamedFile');

    expect(!!fs.existsSync('./test-db/users/renamedFile')).toEqual(true);
  });
});

describe('[REMOVE]', () => {
  test('Removing a file', () => {
    db.get('users').createFile('testRemove');
    db.get('users.testRemove').remove();

    expect(!!fs.existsSync('./test-db/users/testRemove')).toEqual(false);
  });

  test('Removing a folder', () => {
    db.get('users').createFolder('new1');
    expect(!!fs.existsSync('./test-db/users/new1')).toEqual(true);

    db.get('users.new1').remove();
    expect(!!fs.existsSync('./test-db/users/new1')).toEqual(false);
  });
});
