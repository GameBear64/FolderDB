import assert from 'node:assert';
import * as fs from 'fs/promises';

async function dirNavigator(value, directory = this.dbPath) {
  // trim dots
  assert(Array.isArray(value), 'dirNav path not array');

  const dir = await fs.readdir(directory);

  if (value.length == 0) return Promise.reject({ data: dir });

  if (dir.includes(value[0])) {
    return await this.dirNavigator(value.slice(1), `${directory}/${value[0]}`);
  }

  return { file: directory, remainingPath: value };
}

async function getFile({ file, remainingPath }) {
  this.targetFile = `${file}/${remainingPath[0]}.json`;

  let data = await fs.readFile(this.targetFile, 'UTF-8');
  data = JSON.parse(data);

  return { file, data, remainingPath: remainingPath.slice(1) };
}

async function fileNavigator({ remainingPath, data }) {
  assert(Array.isArray(remainingPath), 'fileNav path not array');

  if (data.hasOwnProperty(remainingPath[0])) {
    return await this.fileNavigator({ remainingPath: remainingPath.slice(1), data: data[remainingPath[0]] });
  }

  return { data, remainingPath };
}

export { dirNavigator, getFile, fileNavigator };
