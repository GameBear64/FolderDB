import { describe, expect, test } from 'bun:test';
import * as fs from 'fs';

import FolderDB from '../src/index.js';

const db = new FolderDB({ dbPath: './test-db', mergeInstances: true });

describe('[PUSH]', () => {
  test('Pushing to an array', () => {
    db.get('users.posts.first').set('comments', ['comment1', 'comment2']);

    db.get('users.posts.first.comments').push('comment3');

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.comments).toEqual(['comment1', 'comment2', 'comment3']);
  });

  test('Pushing multiple values to an array', () => {
    db.get('users.posts.first').set('tags', ['tag1']);

    db.get('users.posts.first.tags').push('tag2', 'tag3');

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual(['tag1', 'tag2', 'tag3']);
  });

  test('Error handling when pushing to non-array', () => {
    db.get('users.posts.first').set('title', 'My First Post');

    expect(() => {
      db.get('users.posts.first.title').push('New Title');
    }).toThrow('You can only push to arrays.');
  });
});

describe('[PUSH_SET]', () => {
  test('Pushing unique values to an array', () => {
    db.get('users.posts.first').set('tags', ['tag1']);

    db.get('users.posts.first.tags').pushSet('tag2', 'tag3');

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual(['tag1', 'tag2', 'tag3']);
  });

  test('Pushing duplicate values to an array', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2']);

    db.get('users.posts.first.tags').pushSet('tag2', 'tag3', 'tag4');

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual(['tag1', 'tag2', 'tag3', 'tag4']);
  });

  test('Pushing all duplicate values', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2']);

    db.get('users.posts.first.tags').pushSet('tag1', 'tag2');

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual(['tag1', 'tag2']);
  });

  test('Error handling when pushing to non-array', () => {
    db.get('users.posts.first').set('title', 'My First Post');

    expect(() => {
      db.get('users.posts.first.title').pushSet('New Title');
    }).toThrow('You can only push to arrays.');
  });
});

describe('[PULL]', () => {
  test('Pulling the last element from an array', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag3']);

    db.get('users.posts.first.tags').pull();

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual(['tag1', 'tag2']);
  });

  test('Pulling the last element and returning it', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag3']);

    let pulled = db.get('users.posts.first.tags').pull({ result: true });

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(pulled).toEqual('tag3');
    expect(data.tags).toEqual(['tag1', 'tag2']);
  });

  test('Error handling when pulling from a non-array', () => {
    db.get('users.posts.first').set('title', 'My First Post');

    expect(() => {
      db.get('users.posts.first.title').pull();
    }).toThrow('You can only pull from arrays.');
  });
});

describe('[SHIFT]', () => {
  test('Shifting the first element from an array', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag3']);

    db.get('users.posts.first.tags').shift();

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual(['tag2', 'tag3']);
  });

  test('Shifting the first element and returning it', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag3']);

    let shifted = db.get('users.posts.first.tags').shift({ result: true });

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(shifted).toEqual('tag1');
    expect(data.tags).toEqual(['tag2', 'tag3']);
  });

  test('Shifting the last element from a single-element array', () => {
    db.get('users.posts.first').set('tags', ['tag1']);

    db.get('users.posts.first.tags').shift();

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual([]);
  });

  test('Error handling when shifting from a non-array', () => {
    db.get('users.posts.first').set('title', 'My First Post');

    expect(() => {
      db.get('users.posts.first.title').shift();
    }).toThrow('You can only shift arrays.');
  });
});

describe('[UNSHIFT]', () => {
  test('Unshifting elements to an array', () => {
    db.get('users.posts.first').set('tags', ['tag3']);

    db.get('users.posts.first.tags').unshift('tag1', 'tag2');

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual(['tag1', 'tag2', 'tag3']);
  });

  test('Unshifting a single element to an array', () => {
    db.get('users.posts.first').set('tags', ['tag2', 'tag3']);

    db.get('users.posts.first.tags').unshift('tag1');

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual(['tag1', 'tag2', 'tag3']);
  });

  test('Error handling when unshifting to a non-array', () => {
    db.get('users.posts.first').set('title', 'My First Post');

    expect(() => {
      db.get('users.posts.first.title').unshift('New Title');
    }).toThrow('You can only unshift arrays.');
  });
});

describe('[SPLICE]', () => {
  test('Splicing an array with start and deleteCount', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag3', 'tag4']);

    const removed = db.get('users.posts.first.tags').splice(1, 2);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(removed).toEqual(['tag2', 'tag3']);
    expect(data.tags).toEqual(['tag1', 'tag4']);
  });

  test('Splicing an array with start, deleteCount, and items', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag3']);

    const removed = db.get('users.posts.first.tags').splice(1, 0, 'tag2', 'tag4');

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(removed).toEqual([]);
    expect(data.tags).toEqual(['tag1', 'tag2', 'tag4', 'tag3']);
  });

  test('Splicing an array with negative start', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag3']);

    const removed = db.get('users.posts.first.tags').splice(-1, 1);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(removed).toEqual(['tag3']);
    expect(data.tags).toEqual(['tag1', 'tag2']);
  });

  test('Error handling when splicing a non-array', () => {
    db.get('users.posts.first').set('title', 'My First Post');

    expect(() => {
      db.get('users.posts.first.title').splice(0, 1);
    }).toThrow('You can only use .splice() on arrays.');
  });
});

describe('[MAP]', () => {
  test('Mapping a function over an array', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag3']);

    db.get('users.posts.first.tags').map(tag => tag.toUpperCase());

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual(['TAG1', 'TAG2', 'TAG3']);
  });

  test('Mapping a function over an array and returning the result', () => {
    db.get('users.posts.first').set('numbers', [1, 2, 3]);

    let mapped = db.get('users.posts.first.numbers').map(num => num * 2, true);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(mapped).toEqual([2, 4, 6]);
    expect(data.numbers).toEqual([2, 4, 6]);
  });

  test('Error handling when mapping a non-function', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag3']);

    expect(() => {
      db.get('users.posts.first.tags').map('not a function');
    }).toThrow('You can only pass functions to .map().');
  });

  test('Error handling when mapping over a non-array', () => {
    db.get('users.posts.first').set('title', 'My First Post');

    expect(() => {
      db.get('users.posts.first.title').map(tag => tag.toUpperCase());
    }).toThrow('You can only map arrays.');
  });
});

describe('[SORT]', () => {
  test('Sorting an array in ascending order without a function', () => {
    db.get('users.posts.first').set('numbers', [3, 1, 2]);

    db.get('users.posts.first.numbers').sort();

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.numbers).toEqual([1, 2, 3]);
  });

  test('Sorting an array with a custom compare function', () => {
    db.get('users.posts.first').set('numbers', [3, 1, 2]);

    db.get('users.posts.first.numbers').sort((a, b) => b - a);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.numbers).toEqual([3, 2, 1]);
  });

  test('Sorting an array and returning the result', () => {
    db.get('users.posts.first').set('tags', ['tag2', 'tag1', 'tag3']);

    let sorted = db.get('users.posts.first.tags').sort(undefined, true);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(sorted).toEqual(['tag1', 'tag2', 'tag3']);
    expect(data.tags).toEqual(['tag1', 'tag2', 'tag3']);
  });

  test('Error handling when passing a non-function as a sort parameter', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag3']);

    expect(() => {
      db.get('users.posts.first.tags').sort('not a function');
    }).toThrow('You can only pass functions or nothing to .sort().');
  });

  test('Error handling when sorting a non-array', () => {
    db.get('users.posts.first').set('title', 'My First Post');

    expect(() => {
      db.get('users.posts.first.title').sort();
    }).toThrow('You can only sort arrays.');
  });
});

describe('[FILTER]', () => {
  test('Filtering an array with a function', () => {
    db.get('users.posts.first').set('numbers', [1, 2, 3, 4, 5]);

    db.get('users.posts.first.numbers').filter(num => num > 2);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.numbers).toEqual([3, 4, 5]);
  });

  test('Filtering an array with a function and returning the result', () => {
    db.get('users.posts.first').set('numbers', [1, 2, 3, 4, 5]);

    let filtered = db.get('users.posts.first.numbers').filter(num => num % 2 === 0, true);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(filtered).toEqual([2, 4]);
    expect(data.numbers).toEqual([2, 4]);
  });

  test('Error handling when passing a non-function as a filter parameter', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag3']);

    expect(() => {
      db.get('users.posts.first.tags').filter('not a function');
    }).toThrow('You can only pass functions to .filter().');
  });

  test('Error handling when filtering a non-array', () => {
    db.get('users.posts.first').set('title', 'My First Post');

    expect(() => {
      db.get('users.posts.first.title').filter(tag => tag.includes('tag'));
    }).toThrow('You can only filter arrays.');
  });
});

describe('[REDUCE]', () => {
  test('Reducing an array with a function', () => {
    db.get('users.posts.first').set('numbers', [1, 2, 3, 4, 5]);

    db.get('users.posts.first.numbers').reduce((acc, num) => acc + num);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.numbers).toEqual(15);
  });

  test('Reducing an array with a function and returning the result', () => {
    db.get('users.posts.first').set('numbers', [1, 2, 3, 4, 5]);

    let reduced = db.get('users.posts.first.numbers').reduce((acc, num) => acc * num, true);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(reduced).toEqual(120);
    expect(data.numbers).toEqual(120);
  });

  test('Error handling when passing a non-function as a reduce parameter', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag3']);

    expect(() => {
      db.get('users.posts.first.tags').reduce('not a function');
    }).toThrow('You can only pass functions to .reduce().');
  });

  test('Error handling when reducing a non-array', () => {
    db.get('users.posts.first').set('title', 'My First Post');

    expect(() => {
      db.get('users.posts.first.title').reduce((acc, tag) => acc + tag);
    }).toThrow('You can only reduce arrays.');
  });

  test('Reducing an empty array should throw an error', () => {
    db.get('users.posts.first').set('numbers', []);

    expect(() => {
      db.get('users.posts.first.numbers').reduce((acc, num) => acc + num);
    }).toThrow();
  });
});

describe('[CONCAT]', () => {
  test('Concatenating multiple arrays', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2']);

    db.get('users.posts.first.tags').concat(['tag3'], ['tag4']);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual(['tag1', 'tag2', 'tag3', 'tag4']);
  });

  test('Concatenating with an empty array', () => {
    db.get('users.posts.first').set('tags', ['tag1']);

    db.get('users.posts.first.tags').concat([]);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual(['tag1']);
  });

  test('Concatenating arrays with different types', () => {
    db.get('users.posts.first').set('items', [1, 'a']);

    db.get('users.posts.first.items').concat([2, 'b']);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.items).toEqual([1, 'a', 2, 'b']);
  });

  test('Error handling when concatenating a non-array', () => {
    db.get('users.posts.first').set('title', 'My First Post');

    expect(() => {
      db.get('users.posts.first.title').concat(['New Title']);
    }).toThrow('You can only use .concat() on arrays.');
  });
});

describe('[UNIQUE]', () => {
  test('Removing duplicate values from an array', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag1', 'tag3', 'tag2']);

    db.get('users.posts.first.tags').unique();

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual(['tag1', 'tag2', 'tag3']);
  });

  test('Error handling when applying unique to a non-array', () => {
    db.get('users.posts.first').set('title', 'My First Post');

    expect(() => {
      db.get('users.posts.first.title').unique();
    }).toThrow('unique() can only be used on arrays.');
  });
});

describe('[CHUNK]', () => {
  test('Chunking an array into specified sizes', () => {
    db.get('users.posts.first').set('numbers', [1, 2, 3, 4, 5, 6]);

    db.get('users.posts.first.numbers').chunk(2);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.numbers).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  test('Chunking an array with a size larger than the array', () => {
    db.get('users.posts.first').set('numbers', [1, 2, 3]);

    db.get('users.posts.first.numbers').chunk(5);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.numbers).toEqual([[1, 2, 3]]);
  });

  test('Chunking an array with a size of 1', () => {
    db.get('users.posts.first').set('numbers', [1, 2, 3, 4]);

    db.get('users.posts.first.numbers').chunk(1);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.numbers).toEqual([[1], [2], [3], [4]]);
  });

  test('Error handling when chunking a non-array', () => {
    db.get('users.posts.first').set('title', 'My First Post');

    expect(() => {
      db.get('users.posts.first.title').chunk(2);
    }).toThrow('chunk() can only be used on arrays.');
  });
});

describe('[INTERSECTION]', () => {
  test('Finding intersection of two arrays', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag3']);

    db.get('users.posts.first.tags').intersection(['tag2', 'tag3', 'tag4']);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual(['tag2', 'tag3']);
  });

  test('Finding intersection with an empty array', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag3']);

    db.get('users.posts.first.tags').intersection([]);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual([]);
  });

  test('Finding intersection with no common elements', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag3']);

    db.get('users.posts.first.tags').intersection(['tag4', 'tag5']);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual([]);
  });

  test('Error handling when intersection is called with a non-array', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag3']);

    expect(() => {
      db.get('users.posts.first.tags').intersection('not an array');
    }).toThrow('intersection() can only be used on arrays.');
  });

  test('Error handling when intersection is called on a non-array', () => {
    db.get('users.posts.first').set('title', 'My First Post');

    expect(() => {
      db.get('users.posts.first.title').intersection(['tag1', 'tag2']);
    }).toThrow('intersection() can only be used on arrays.');
  });
});

describe('[XOR]', () => {
  test('Finding XOR of two arrays', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag3']);

    db.get('users.posts.first.tags').XOR(['tag2', 'tag3', 'tag4']);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual(['tag1', 'tag4']);
  });

  test('Finding XOR with an empty array', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag3']);

    db.get('users.posts.first.tags').XOR([]);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual(['tag1', 'tag2', 'tag3']);
  });

  test('Finding XOR with no common elements', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2']);

    db.get('users.posts.first.tags').XOR(['tag3', 'tag4']);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual(['tag1', 'tag2', 'tag3', 'tag4']);
  });

  test('Error handling when XOR is called with a non-array', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag3']);

    expect(() => {
      db.get('users.posts.first.tags').XOR('not an array');
    }).toThrow('XOR() can only be used on arrays.');
  });

  test('Error handling when XOR is called on a non-array', () => {
    db.get('users.posts.first').set('title', 'My First Post');

    expect(() => {
      db.get('users.posts.first.title').XOR(['tag1', 'tag2']);
    }).toThrow('XOR() can only be used on arrays.');
  });
});

describe('[DIFFERENCE]', () => {
  test('Finding difference between two arrays', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag3']);

    db.get('users.posts.first.tags').difference(['tag2', 'tag3', 'tag4']);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual(['tag1']);
  });

  test('Finding difference with an empty array', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag3']);

    db.get('users.posts.first.tags').difference([]);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual(['tag1', 'tag2', 'tag3']);
  });

  test('Finding difference when no elements match', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2']);

    db.get('users.posts.first.tags').difference(['tag3', 'tag4']);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual(['tag1', 'tag2']);
  });

  test('Error handling when difference is called with a non-array', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2', 'tag3']);

    expect(() => {
      db.get('users.posts.first.tags').difference('not an array');
    }).toThrow('difference() can only be used on arrays.');
  });

  test('Error handling when difference is called on a non-array', () => {
    db.get('users.posts.first').set('title', 'My First Post');

    expect(() => {
      db.get('users.posts.first.title').difference(['tag1', 'tag2']);
    }).toThrow('difference() can only be used on arrays.');
  });
});

describe('[DIFFERENCE_INSERT]', () => {
  test('Finding difference between arrays and inserting the result', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2']);

    db.get('users.posts.first.tags').differenceInsert(['tag2', 'tag3', 'tag4']);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual(['tag3', 'tag4']);
  });

  test('Finding difference when the second array is empty', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2']);

    db.get('users.posts.first.tags').differenceInsert([]);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual([]);
  });

  test('Finding difference when there are no unique elements in the second array', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2']);

    db.get('users.posts.first.tags').differenceInsert(['tag1', 'tag2']);

    let data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.tags).toEqual([]);
  });

  test('Error handling when differenceInsert is called with a non-array', () => {
    db.get('users.posts.first').set('tags', ['tag1', 'tag2']);

    expect(() => {
      db.get('users.posts.first.tags').differenceInsert('not an array');
    }).toThrow('differenceInsert() can only be used on arrays.');
  });

  test('Error handling when differenceInsert is called on a non-array', () => {
    db.get('users.posts.first').set('title', 'My First Post');

    expect(() => {
      db.get('users.posts.first.title').differenceInsert(['tag1', 'tag2']);
    }).toThrow('differenceInsert() can only be used on arrays.');
  });
});
