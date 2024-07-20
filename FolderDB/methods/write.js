import assert from 'node:assert';
import * as fs from 'fs/promises';

async function createFile(value) {
  // trim dots
  assert(Array.isArray(value), 'dirNav path not array');
}

export { createFile };
