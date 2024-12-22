import { describe, expect, test, mock, beforeAll } from 'bun:test';
import * as fs from 'fs';

import FolderDB from '../src/index.js';
import { TimeFormat } from '../src/utils/enums';

const db = new FolderDB({ dbPath: './test-db', mergeInstances: true });

describe('[POPULATE]', () => {
  test('Populate single reference', () => {
    const result = db.get('users.posts.first').populate('ref');
    const data = JSON.parse(fs.readFileSync('./test-db/products.json', 'UTF-8'));

    expect(result.data.ref).toEqual(data[0]);
  });

  test('Populate multiple references', () => {
    const result = db.get('users.posts.first').populate('manyRefs');
    const data = JSON.parse(fs.readFileSync('./test-db/products.json', 'UTF-8'));

    expect(result.data.manyRefs).toEqual(data.slice(0, 3));
  });

  test('Error handling for invalid path', () => {
    expect(() => {
      db.get('users.posts.first').populate('invalidPath');
    }).toThrow('Path not found: invalidPath');
  });

  test('Error handling for non-array references', () => {
    fs.writeFileSync('./test-db/products.json', JSON.stringify({ id: 1, name: 'Product 1' }, null, 2));

    db.get('users.posts.first').populate('ref');

    const result = db.get('users.posts.first');
    // Did not populate
    expect(result.data.ref).toEqual('products.0');
  });

  test('Error handling for value level population', () => {
    expect(() => {
      db.get('users').populate('posts');
    }).toThrow('You can only populate at the value level.');
  });
});

describe('[DUMP]', () => {
  beforeAll(() => {
    db.get('users.posts.first').set('testData', { key: 'value', number: 123 });
  });

  test('Dump data to console', () => {
    console.log = mock(); // Mock console.log
    const result = db.get('users.posts.first.testData').dump();

    expect(console.log).toHaveBeenCalledWith({ key: 'value', number: 123 });
    expect(result.data).toEqual({ key: 'value', number: 123 });
  });
});

describe('[TAP]', () => {
  beforeAll(() => {
    db.get('users.posts.first').set('testData', { key: 'value', number: 123 });
  });

  test('Tap with a valid function', () => {
    const callback = mock();
    const result = db.get('users.posts.first.testData').tap(callback);

    expect(callback).toHaveBeenCalledWith({ key: 'value', number: 123 });
    expect(result.data).toEqual({ key: 'value', number: 123 });
  });

  test('Error handling for invalid callback', () => {
    expect(() => {
      db.get('users.posts.first.testData').tap('notAFunction');
    }).toThrow('You must provide a function to tap().');
  });
});

describe('[AVERAGE]', () => {
  beforeAll(() => {
    db.get('users.posts.first').set('numbers', [1, 2, 3, 4, 5]);
  });

  test('Calculate average of numbers', () => {
    const result = db.get('users.posts.first.numbers').average();

    expect(result.data).toBe(3); // (1 + 2 + 3 + 4 + 5) / 5
  });

  test('Error handling for empty array', () => {
    expect(() => {
      db.get('users.posts.first.numbers').set([]).average();
    }).toThrow('Input must be a non-empty array of numbers.');
  });

  test('Error handling for non-array input', () => {
    expect(() => {
      db.get('users.posts.first.numbers').set('string').average();
    }).toThrow('Input must be a non-empty array of numbers.');
  });
});

describe('[SAMPLE]', () => {
  beforeAll(() => {
    db.get('users.posts.first').set('items', [1, 2, 3, 4, 5]);
  });

  test('Sample a single element', () => {
    const result = db.get('users.posts.first.items').sample();
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(data.items).toContain(result.data);
    expect(result.data).toBeOneOf([1, 2, 3, 4, 5]); // Assuming a custom matcher or implementation for `toBeOneOf`
  });

  test('Sample multiple elements', () => {
    const result = db.get('users.posts.first.items').sample(3);
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    expect(result.data.length).toBe(3);
    result.data.forEach(item => expect(data.items).toContain(item));
  });

  test('Error handling for invalid count', () => {
    expect(() => {
      db.get('users.posts.first.items').sample(-1);
    }).toThrow('Count must be a positive number.');

    expect(() => {
      db.get('users.posts.first.items').sample(0);
    }).toThrow('Count must be a positive number.');

    expect(() => {
      db.get('users.posts.first.items').sample(6);
    }).toThrow('Count cannot be greater than the length of the array.');
  });

  test('Error handling for non-array input', () => {
    expect(() => {
      db.get('users.posts.first.items').set('string').sample(1);
    }).toThrow('Input must be a non-empty array.');
  });
});

describe('[SELECT PICK]', () => {
  beforeAll(() => {
    db.get('users.posts.first').set('sidePost', {
      title: 'Hello World',
      content: 'This is a test post.',
      author: 'John Doe',
      password: 'secret',
    });
  });

  test('Selecting desired fields', () => {
    const result = db.get('users.posts.first.sidePost').selectPick(['title', 'author']);
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(result.data).toEqual({
      title: data.sidePost.title,
      author: data.sidePost.author,
    });
  });

  test('Error handling for non-array argument', () => {
    expect(() => {
      db.get('users.posts.first.sidePost').selectPick('title');
    }).toThrow('selectPick() needs an array with the desired fields');
  });

  test('Error handling for non-objects', () => {
    expect(() => {
      db.get('users.posts.first.sidePost.title').selectPick(['title']);
    }).toThrow('selectPick() can only be used on objects.');
  });
});

describe('[SELECT OMIT]', () => {
  beforeAll(() => {
    db.get('users.posts.first').set('sidePost', {
      title: 'Hello World',
      content: 'This is a test post.',
      author: 'John Doe',
      password: 'secret',
    });
  });

  test('Omitting specified fields', () => {
    const result = db.get('users.posts.first.sidePost').selectOmit(['password']);
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(result.data).toEqual({
      title: data.sidePost.title,
      content: data.sidePost.content,
      author: data.sidePost.author,
    });
  });

  test('Error handling for non-array argument', () => {
    expect(() => {
      db.get('users.posts.first.sidePost').selectOmit('password');
    }).toThrow('selectOmit() needs an array with the fields to omit');
  });

  test('Error handling for non-objects', () => {
    expect(() => {
      db.get('users.posts.first.sidePost.title').selectOmit(['password']);
    }).toThrow('selectOmit() can only be used on objects.');
  });
});

describe('[CHECK]', () => {
  beforeAll(() => {
    db.get('users.posts.first').setTimestamp('will_update_at');
  });

  test('Checking if timestamp has passed', () => {
    db.get('users.posts.first.will_update_at').setTimestamp().rewindTime(5000);
    expect(db.get('users.posts.first.will_update_at').isPast()).toEqual(true);

    db.get('users.posts.first.will_update_at').setTimestamp().advanceTime(10000);
    expect(db.get('users.posts.first.will_update_at').isPast()).toEqual(false);
  });

  test('Error handling for invalid number', () => {
    expect(() => {
      db.get('users.posts.first.title').isPast();
    }).toThrow('This method can only be used on numbers representing timestamps');
  });
});

describe('[FORMAT TIMESTAMP]', () => {
  db.get('users.posts.first').set('timestamp', new Date().getTime());

  test('Short format', () => {
    const result = db.get('users.posts.first.timestamp').formatTimestamp(TimeFormat.SHORT);
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    const expectedDate = new Date(data.timestamp).toLocaleDateString('en-US'); // MM/DD/YYYY
    expect(result).toEqual(expectedDate);
  });

  test('Medium format', () => {
    const result = db.get('users.posts.first.timestamp').formatTimestamp(TimeFormat.MEDIUM);
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    const expectedDate = new Date(data.timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    expect(result).toEqual(expectedDate);
  });

  test('Long format', () => {
    const result = db.get('users.posts.first.timestamp').formatTimestamp(TimeFormat.LONG);
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    const expectedDate = new Date(data.timestamp).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    expect(result).toEqual(expectedDate);
  });

  test('Error handling for invalid format', () => {
    expect(() => {
      db.get('users.posts.first.timestamp').formatTimestamp('invalid');
    }).toThrow('Invalid format option. Use the TimeFormat enum.');
  });

  test('Error handling for invalid timestamp', () => {
    db.get('users.posts.first').set('timestamp', 'invalid');
    expect(() => {
      db.get('users.posts.first.timestamp').formatTimestamp('medium');
    }).toThrow('Value must be a valid timestamp.');
  });
});

describe('[FORMAT RELATIVE TIME]', () => {
  db.get('users.posts.first').set('pastTimestamp', Date.now() - 3600000); // 1 hour ago
  db.get('users.posts.first').set('futureTimestamp', Date.now() + 3600000); // 1 hour from now

  test('Relative time (hour, past)', () => {
    const result = db.get('users.posts.first.pastTimestamp').formatRelativeTime();
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    const expectedTime = rtf.format(-1, 'hour');
    expect(result).toEqual(expectedTime);
  });

  test('Relative time (minute, past)', () => {
    db.get('users.posts.first').set('pastTimestamp', Date.now() - 60000); // 1 minute ago
    const result = db.get('users.posts.first.pastTimestamp').formatRelativeTime();
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    const expectedTime = rtf.format(-1, 'minute');
    expect(result).toEqual(expectedTime);
  });

  test('Relative time (hour, future)', () => {
    const result = db.get('users.posts.first.futureTimestamp').formatRelativeTime();
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    const expectedTime = rtf.format(1, 'hour');
    expect(result).toEqual(expectedTime);
  });

  test('Relative time (minute, future)', () => {
    db.get('users.posts.first').set('futureTimestamp', Date.now() + 60000); // 1 minute from now
    const result = db.get('users.posts.first.futureTimestamp').formatRelativeTime();
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    const expectedTime = rtf.format(1, 'minute');
    expect(result).toEqual(expectedTime);
  });

  test('Error handling for invalid timestamp', () => {
    db.get('users.posts.first').set('pastTimestamp', 'invalid');
    expect(() => {
      db.get('users.posts.first.pastTimestamp').formatRelativeTime();
    }).toThrow('Value must be a valid timestamp.');
  });
});
