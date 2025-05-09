import { describe, expect, test, beforeAll, mock } from 'bun:test';
import * as fs from 'fs';

import { CaseFormat } from '../src/utils/enums.js';
import FolderDB from '../src/index.js';

const db = new FolderDB({ dbPath: './test-db', mergeInstances: true });
const users = db.get('users').schema(
  {
    name: { type: String, required: true, minLength: 3, maxLength: 50, trim: true },
    email: { type: String, required: true, immutable: true, validate: val => /.+@.+\..+/.test(val) },
    password: { type: String, omit: true },
    phone: { type: [String, Number], omit: true },
    age: { type: Number, min: 18, max: 120 },
    bio: { type: String, innerTrim: true, maxLength: 60, minLength: 10 },
    preferences: { type: String, default: 'none', enum: ['none', 'basic', 'advanced'] },
    status: { type: String, toCase: CaseFormat.UPPER },
    isActive: { type: String, transform: v => v == 'yes' },
    settings: { type: Object, theme: { type: String, default: 'dark' }, language: { type: String, required: true}}
  },
  { timestamps: true }
);

const populateUser = db.get('users').schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  items: { type: Array, populate: true },
});

const idUser = db.get('users').schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number },
  },
  { idLength: 50, inlineId: true, namePrefix: 'usr-' }
);

beforeAll(() => {
  users.create('TestUser', {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'secret-hash',
    age: 21,
    bio: 'Cool guy alert!',
  });
});

describe('[CREATE]', () => {
  test('Creating a valid document', () => {
    const [name, user] = users.create('User1', { name: 'John Doe', email: 'john.doe@example.com', age: 30 });

    expect(name).toBe('User1');
    expect(user).toMatchObject({ name: 'John Doe', email: 'john.doe@example.com', age: 30 });

    const data = JSON.parse(fs.readFileSync('./test-db/users/User1.json', 'UTF-8'));
    expect(data).toMatchObject(user);
  });

  test('Creating a valid document and no name', () => {
    const [name, user] = users.create({ name: 'Valid User', email: 'valid@example.com', age: 30 });

    expect(name).toHaveLength(20);
    expect(user).toMatchObject({ name: 'Valid User', email: 'valid@example.com', age: 30 });
  });

  test('Creating a document with populate', () => {
    const [_, user] = populateUser.create({
      name: 'Valid User',
      email: 'valid@example.com',
      items: ['products.0', 'products.1', 'products.2'],
    });
    const data = JSON.parse(fs.readFileSync('./test-db/products.json', 'UTF-8'));

    expect(user.items).toMatchObject(data.slice(0, 3));
  });

  test('Creating a document with inline ID', () => {
    const user = idUser.create({ name: 'Valid User', email: 'valid@example.com', age: 30 });

    expect(user._id).toHaveLength(50);
    expect(user._id).toMatch(/^usr-/);
    expect(user).toMatchObject({ name: 'Valid User', email: 'valid@example.com', age: 30 });
  });

  test('Creating a document and before hook', () => {
    const callback = mock();
    users.hook('pre-create', callback);
    users.create({ name: 'Valid User', email: 'valid@example.com', age: 30 });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({
      name: 'Valid User',
      email: 'valid@example.com',
      age: 30,
      preferences: 'none',
    });
  });

  test('Creating a document and after hook', () => {
    const callback = mock();
    users.hook('post-create', callback);
    users.create({ name: 'Valid User', email: 'valid@example.com', age: 30 });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Valid User',
          email: 'valid@example.com',
          age: 30,
          preferences: 'none',
        }),
      ])
    );
  });

  test('Creating a document and two hooks', () => {
    const callback = mock();
    users.hook(['pre-create', 'post-create'], callback);
    users.create({ name: 'Valid User', email: 'valid@example.com', age: 30 });

    expect(callback).toHaveBeenCalledTimes(2);
  });
});

describe('[CREATE - BPs]', () => {
  test('Creating a document with missing required fields', () => {
    expect(() => {
      users.create({ email: 'missing.name@example.com' });
    }).toThrow();
  });

  test('Creating a document with wrong type', () => {
    expect(() => {
      users.create({ name: 'John Doe', email: 'john.doe@example.com', age: 'big' });
    }).toThrow();
  });

  test('Creating a document with age below minimum value', () => {
    expect(() => {
      users.create({ name: 'Too Young', email: 'tooyoung@example.com', age: 16 });
    }).toThrow();
  });

  test('Creating a document with age above maximum value', () => {
    expect(() => {
      users.create({ name: 'Too Young', email: 'tooyoung@example.com', age: 200 });
    }).toThrow();
  });

  test('Creating a document with bigger than required maxLength', () => {
    expect(() => {
      users.create({
        name: 'Default Prefs',
        email: 'default@example.com',
        bio: 'Very long sentence, too long for this bio which is weird because most bios are longer.....',
      });
    }).toThrow();
  });

  test('Creating a document with smaller than required minLength', () => {
    expect(() => {
      users.create({
        name: 'Default Prefs',
        email: 'default@example.com',
        bio: 'short',
      });
    }).toThrow();
  });

  test('Creating a document with default preferences', () => {
    const [, user] = users.create({ name: 'Default Prefs', email: 'default@example.com', age: 35 });
    expect(user.preferences).toBe('none');
  });

  test('Overriding default preferences', () => {
    const [, user] = users.create({
      name: 'Custom Prefs',
      email: 'custom@example.com',
      age: 35,
      preferences: 'basic',
    });
    expect(user.preferences).toBe('basic');
  });

  test('Validating email format', () => {
    expect(() => {
      users.create({ name: 'Invalid Email', email: 'invalid-email', age: 30 });
    }).toThrow();
  });

  test('Enforcing enum values on preferences', () => {
    expect(() => {
      users.create({ name: 'Invalid Pref', email: 'invalidpref@example.com', age: 30, preferences: 'premium' });
    }).toThrow();
  });

  test('Applying case to status field', () => {
    const [, user] = users.create({ name: 'Case Test', email: 'case@example.com', age: 30, status: 'active' });
    expect(user.status).toBe('ACTIVE');
  });

  test('Applying transformation to active field', () => {
    const [, user] = users.create({ name: 'Transform Test', email: 'transform@example.com', age: 30, isActive: 'yes' });
    expect(user.isActive).toBe(true);
  });

  test('Creating a document with nested property', () => {
    const [, user] = users.create({
      name: 'Nested Doc',
      email: 'default@example.com',
      settings: {
        language: 'en'
    }});

    expect(user.settings).toMatchObject({
      theme: 'dark',
      language: 'en'
    });
  });

  test('Validating nested property', () => {
    expect(() => {
      users.create({
        name: 'Nested Doc',
        email: 'default@example.com',
        settings: {
          language: 1
        }
      });
    }).toThrow('Schema: language must be of type String.');
  });
});

describe('[READ]', () => {
  test('Reading an existing document and omitted fields', () => {
    const [, result] = users.read('TestUser');
    expect(result.name).toBe('John Doe');
    expect(result).not.toHaveProperty('password');

    const data = JSON.parse(fs.readFileSync('./test-db/users/TestUser.json', 'UTF-8'));
    expect(data).toMatchObject(result);
  });

  test('Reading a document with populate', () => {
    populateUser.create('populatedUser', {
      name: 'Valid User',
      email: 'valid@example.com',
      items: ['products.0', 'products.1', 'products.2'],
    });
    const [, result] = populateUser.read('populatedUser');
    const data = JSON.parse(fs.readFileSync('./test-db/products.json', 'UTF-8'));

    expect(result.items).toMatchObject(data.slice(0, 3));
  });

  test('Reading document and before hook', () => {
    const callback = mock();
    users.hook('pre-read', callback);
    users.read('TestUser');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('TestUser');
  });

  test('Reading document and after hook', () => {
    const callback = mock();
    users.hook('post-read', callback);
    users.read('TestUser');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'John Doe',
          email: 'john.doe@example.com',
          age: 21,
          bio: 'Cool guy alert!',
        }),
      ])
    );
  });

  test('Reading a non-existent document', () => {
    expect(users.read('NonExistentUser')).toBe(null);
  });
});

describe('[FIND]', () => {
  test('Finding documents by query', () => {
    const results = users.find({ age: 21 });

    const entries = Object.entries(results);

    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0][1].age).toBe(21);
  });

  test('Finding documents by function', () => {
    const results = users.find(u => u.age == 21);

    const entries = Object.entries(results);

    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0][1].age).toBe(21);
  });

  test('Not finding a document', () => {
    const results = users.find(u => u.age == 9999999);

    expect(Object.entries(results).length).toBe(0);
  });

  test('Finding a single document', () => {
    const [, result] = users.find({ name: 'John Doe' }, { first: true });
    expect(result.name).toBe('John Doe');
  });

  test('Not finding a single document', () => {
    const result = users.find({ age: 9999999 }, { first: true });

    expect(Object.entries(result).length).toBe(0);
  });

  test('Finding document and before hook', () => {
    const callback = mock();
    users.hook('pre-find', callback);
    users.find({ age: 21 });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ age: 21 });
  });

  test('Finding document and after hook', () => {
    const callback = mock();
    users.hook('post-find', callback);
    users.find({ age: 21 }, { first: true });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      expect.arrayContaining([
        'TestUser',
        expect.objectContaining({
          name: 'John Doe',
          email: 'john.doe@example.com',
          age: 21,
          bio: 'Cool guy alert!',
        }),
      ])
    );
  });
});

describe('[UPDATE]', () => {
  test('Updating an existing document', () => {
    const [, result] = users.update('TestUser', { password: 'new-password-hash' }, { omit: [] });

    expect(result.password).toBe('new-password-hash');
    expect(result).toHaveProperty('updated_at');
    expect(result.updated_at).toBeGreaterThan(result.created_at);

    const data = JSON.parse(fs.readFileSync('./test-db/users/TestUser.json', 'UTF-8'));
    expect(data).toMatchObject(result);
  });

  test('Updating a document with an immutable field', () => {
    const [, result] = users.update('TestUser', { age: 23, created_at: 1234567891234 });

    expect(result).toMatchObject({
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: 23,
    });

    expect(result.created_at).not.toBe(1234567891234);
  });

  test('Updating a document with a multi type value', () => {
    let [, result] = users.update('TestUser', { phone: 123456789 }, { omit: [] });
    expect(typeof result.phone).toBe('number');

    [, result] = users.update('TestUser', { phone: '+359899696969' }, { omit: [] });
    expect(typeof result.phone).toBe('string');

    expect(() => users.update('TestUser', { phone: true })).toThrow();
  });

  test('Updating document and before hook', () => {
    const callback = mock();
    users.hook('pre-update', callback);
    users.update('TestUser', { password: 'newer-password-hash' });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ password: 'newer-password-hash' });
  });

  test('Updating document and after hook', () => {
    const callback = mock();
    users.hook('post-update', callback);
    users.update('TestUser', { password: 'newer-er-password-hash' }, { omit: [] });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'John Doe',
          email: 'john.doe@example.com',
          age: 23,
          password: 'newer-er-password-hash',
          bio: 'Cool guy alert!',
        }),
      ])
    );
  });

  test('Updating a document with nested values', () => {
    const [, result] = users.update('TestUser', { settings: {language: 'bg'} });

    expect(result).toMatchObject({
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: 23,
      settings: {
        language: 'bg'
      }
    });
  });

  test('Updating a document with nested nested values', () => {
    const [, result] = users.update('TestUser', { settings: { language: 'en', spaghetti: {meatballs: [1,2,3]} } });

    expect(result).toMatchObject({
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: 23,
      settings: {
        spaghetti: {
          meatballs: [1, 2, 3]
        }
      }
    });
  });
});

describe('[RENAME]', () => {
  test('Renaming document', () => {
    const userObject = { name: 'John Doe', email: 'john.doe@example.com', age: 30 };

    users.create('oldName', userObject);
    const oldFile = JSON.parse(fs.readFileSync('./test-db/users/oldName.json', 'UTF-8'));
    expect(oldFile).toMatchObject(userObject);

    users.rename('oldName', 'newName');
    expect(() => fs.readFileSync('./test-db/users/oldName.json', 'UTF-8')).toThrow();

    const newFile = JSON.parse(fs.readFileSync('./test-db/users/newName.json', 'UTF-8'));
    expect(newFile).toMatchObject(userObject);
  });

  test('Renaming with missing parameters throws error', () => {
    expect(() => users.rename(null, 'newName')).toThrow('Old name and new name required');
    expect(() => users.rename('oldName', null)).toThrow('Old name and new name required');
  });

  test('Renaming entity and before hook', () => {
    users.create('oldName', { name: 'John Doe', email: 'john.doe@example.com', age: 30 });

    const callback = mock();
    users.hook('pre-rename', callback);
    users.rename('oldName', 'newName');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('oldName');
  });

  test('Renaming entity and after hook', () => {
    users.create('oldName', { name: 'John Doe', email: 'john.doe@example.com', age: 30 });

    const callback = mock();
    users.hook('post-rename', callback);
    users.rename('oldName', 'newName');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('newName');
  });
});

describe('[DESTROY]', () => {
  test('Destroying an existing document', () => {
    users.create('User1', { name: 'John Doe', email: 'john.doe@example.com', age: 30 });
    users.destroy('User1');
    expect(users.read('User1')).toBe(null);

    expect(() => fs.readFileSync('./test-db/users/User1.json', 'UTF-8')).toThrow();
  });

  test('Destroying document and before hook', () => {
    users.create('final-user-before', { name: 'John Doe', email: 'john.doe@example.com', age: 30 });

    const callback = mock();
    users.hook('pre-destroy', callback);
    users.destroy('final-user-before');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('final-user-before');
  });

  test('Destroying document and after hook', () => {
    users.create('final-user-after', { name: 'John Doe', email: 'john.doe@example.com', age: 30 });

    const callback = mock();
    users.hook('post-destroy', callback);
    users.destroy('final-user-after');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'John Doe', email: 'john.doe@example.com', age: 30 })
    );
  });
});
