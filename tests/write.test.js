import { describe, expect, test } from 'bun:test';
import * as fs from 'fs';

import FolderDB from '../FolderDB/index.js';
import { ValueType } from '../FolderDB/utils/enums.js';

// only one instance allowed
// const db = new FolderDB({ dbPath: './db' });

describe('[hi]', () => {
  // test('Empty pointers', async () => {
  //   const result = db.get('');
  //   const dir = fs.readdirSync('./db');
  //   expect(result.data).toEqual(dir);
  // });
});
