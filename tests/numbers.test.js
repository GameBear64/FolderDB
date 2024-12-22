import { describe, expect, test } from 'bun:test';
import * as fs from 'fs';

import FolderDB from '../src/index.js';

const db = new FolderDB({ dbPath: './test-db', mergeInstances: true });

describe('[INC]', () => {
  test('Incrementing', () => {
    db.get('users.posts.first').set('likes', 100);
    const result = db.get('users.posts.first.likes').inc();
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    const expectedLikes = 100 + 1; // 101
    expect(result.data).toEqual(expectedLikes);
    expect(data.likes).toEqual(expectedLikes);
  });

  test('Error handling', () => {
    expect(() => {
      db.get('users.posts.first.title').inc();
    }).toThrow('You can only increment numbers.');
  });
});

describe('[DEC]', () => {
  test('Decrementing', () => {
    db.get('users.posts.first').set('likes', 100);
    const result = db.get('users.posts.first.likes').dec();
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    const expectedLikes = 100 - 1; // 99
    expect(result.data).toEqual(expectedLikes);
    expect(data.likes).toEqual(expectedLikes);
  });

  test('Error handling', () => {
    expect(() => {
      db.get('users.posts.first.title').dec();
    }).toThrow('You can only decrement numbers.');
  });
});

describe('[ADD]', () => {
  test('Adding a number', () => {
    db.get('users.posts.first').set('likes', 100);
    const result = db.get('users.posts.first.likes').add(5);
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    const expectedLikes = 100 + 5; // 105
    expect(result.data).toEqual(expectedLikes);
    expect(data.likes).toEqual(expectedLikes);
  });

  test('Error handling', () => {
    expect(() => {
      db.get('users.posts.first.title').add('five');
    }).toThrow('Values can only be numbers.');
  });
});

describe('[SUB]', () => {
  test('Subtracting a number', () => {
    db.get('users.posts.first').set('likes', 100);
    const result = db.get('users.posts.first.likes').sub(3);
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    const expectedLikes = 100 - 3; // 97
    expect(result.data).toEqual(expectedLikes);
    expect(data.likes).toEqual(expectedLikes);
  });

  test('Error handling', () => {
    expect(() => {
      db.get('users.posts.first.title').sub(3);
    }).toThrow('You can only subtract to numbers.');
  });
});

describe('[ADD PERCENTAGE]', () => {
  test('Adding percentage', () => {
    db.get('users.posts.first').set('likes', 100);
    const result = db.get('users.posts.first.likes').addPercentage(10);
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    const expectedLikes = 100 + 100 * (10 / 100); // 110
    expect(result.data).toEqual(expectedLikes);
    expect(data.likes).toEqual(expectedLikes);
  });

  test('Error handling', () => {
    expect(() => {
      db.get('users.posts.first.title').addPercentage('ten');
    }).toThrow('Values can only be numbers.');
  });
});

describe('[SUB PERCENTAGE]', () => {
  test('Subtracting percentage', () => {
    db.get('users.posts.first').set('likes', 100);
    const result = db.get('users.posts.first.likes').subPercentage(20);
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    const expectedLikes = 100 - 100 * (20 / 100); // 80
    expect(result.data).toEqual(expectedLikes);
    expect(data.likes).toEqual(expectedLikes);
  });

  test('Error handling', () => {
    expect(() => {
      db.get('users.posts.first.title').subPercentage('twenty');
    }).toThrow('Values can only be numbers.');
  });
});

describe('[RANDOM]', () => {
  test('Generating random number between min and max', () => {
    db.get('users.posts.first.likes').random(10, 5);
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.likes).toBeGreaterThanOrEqual(5);
    expect(data.likes).toBeLessThanOrEqual(10);
  });

  test('Error handling', () => {
    expect(() => {
      db.get('users.posts.first.likes').random('ten', 5);
    }).toThrow('You can only use random() with numbers.');
  });
});

describe('[ADD RANDOM]', () => {
  test('Adding random number', () => {
    const initialData = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    const randomValue = db.get('users.posts.first.likes').addRandom(10, 5);
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.likes).toEqual(initialData.likes + randomValue);
  });

  test('Error handling', () => {
    expect(() => {
      db.get('users.posts.first.title').addRandom(10, 5);
    }).toThrow('You can only add to numbers.');
  });
});

describe('[SUB RANDOM]', () => {
  test('Subtracting random number', () => {
    const initialData = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));
    const randomValue = db.get('users.posts.first.likes').subRandom(10, 5);
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.likes).toEqual(initialData.likes - randomValue);
  });

  test('Error handling', () => {
    expect(() => {
      db.get('users.posts.first.title').subRandom(10, 5);
    }).toThrow('You can only subtract to numbers.');
  });
});

describe('[CLAMP]', () => {
  test('Clamping a number between min and max', () => {
    db.get('users.posts.first.likes').set(500).clamp(0, 100);
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.likes).toBeGreaterThanOrEqual(0);
    expect(data.likes).toBeLessThanOrEqual(100);
  });

  test('Error handling', () => {
    expect(() => {
      db.get('users.posts.first.likes').clamp(100, 0);
    }).toThrow('Min cannot be greater than max.');
  });
});

describe('[ROUND FLOAT]', () => {
  test('Rounding float to specified digits', () => {
    db.get('users.posts.first').set('floatValue', 3.14159);
    const result = db.get('users.posts.first.floatValue').roundFloat(2);
    const data = JSON.parse(fs.readFileSync('./test-db/users/posts/first.json', 'UTF-8'));

    expect(data.floatValue).toEqual(result.data);
    expect(data.floatValue).toEqual(3.14);
  });

  test('Error handling', () => {
    expect(() => {
      db.get('users.posts.first.title').roundFloat(2);
    }).toThrow('Value must be a number.');
  });
});
