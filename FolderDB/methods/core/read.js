// are asserts dumb? can we use ifs?
import assert from 'node:assert';
import * as fs from 'fs/promises';

import { ValueType } from '../../utils/enums';

async function dirNavigator(value, directory = this.dbPath) {
  // trim dots
  assert(Array.isArray(value), 'dirNav path not array');

  const dir = await fs.readdir(directory);

  if (value.length == 0) return Promise.reject({ data: dir });

  if (dir.includes(value[0])) {
    return await this._dirNavigator(value.slice(1), `${directory}/${value[0]}`);
  }

  return { file: directory, remainingPath: value };
}

async function getFile({ file, remainingPath }) {
  this.targetFile = `${file}/${remainingPath[0]}.json`;

  let data = await fs.readFile(this.targetFile, 'UTF-8');
  data = JSON.parse(data);

  this.pointers = remainingPath.slice(1);

  return { file, data };
}

async function fileNavigator({ data }) {
  assert(Array.isArray(this.pointers), 'fileNav path not array');

  if (data.hasOwnProperty(this.pointers[0])) {
    return await this._fileNavigator({ remainingPath: this.pointers.slice(1), data: data[this.pointers[0]] });
  }

  return { data };
}

// async function dirNavigator(directory = this.dbPath) {
//   const dir = await fs.readdir(directory);

//   if (this.pointers.length == 0) return { data: dir };

//   console.log(dir, this.pointers);

//   if (dir.includes(this.pointers[0])) {
//     this.pointers = this.pointers.slice(1);
//     return await this._dirNavigator(`${directory}/${this.pointers[0]}`);
//   }

//   return { data: dir, doNext: true };
// }

async function get(value) {
  // TODO: trim dots
  assert(typeof value === 'string', 'value must be string');

  this.pointers = value ? value.split('.') : [];

  this.targetFile = null;
  this.filePointers = [];
  this.data = null;
  this.valueType = ValueType.DIRECTORY;

  // const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);

  // const result = await clone._dirNavigator();

  // console.log(result);

  // REVIEW: have conditions based on the state
  // get can be recursive for each "key" user.posts.date

  // if this.targetFile is empty, do dirNavigation until a file is found
  // if file is found, save and do file navigation
  // no need for a "isFileMode" boolean, we will just look at the this.targetFile

  const result = await this._dirNavigator(value ? value.split('.') : [])
    .then(this._getFile.bind(this))
    .then(this._fileNavigator.bind(this))
    .then(false, x => x);
  // NOTE: This was the only way to have early returns

  // clone.data = result.data;
  // return clone

  this.data = result.data;

  return this;
}

export { dirNavigator, getFile, fileNavigator, get };
