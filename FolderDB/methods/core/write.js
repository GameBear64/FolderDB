import assert from "node:assert";
import { ValueType } from "../../utils/enums";

import * as fs from "fs";

async function createFolder(name) {
  fs.mkdirSync(name, { recursive: true });

  return this;
}

async function createFile(name) {
  const pointers = name.split("/");
  const fileName = pointers.splice(-1)[0];

  if (name.includes("/")) {
    this._createFolder(pointers.join("/"));
    fs.writeFileSync([...pointers, fileName].join("/") + ".json", {});
  } else {
    fs.writeFileSync("db/users/" + fileName + ".json", {});
  }
  return this;
}

function set(_key, _value) {
  if (this.valueType == ValueType.DIRECTORY) {
    throw new Error("Only values can be set");
  }

  const value = _value !== undefined ? _value : _key;
  const extraPointers =
    _value === undefined
      ? []
      : _key.includes(".")
      ? _key.split(".").filter((p) => p != "")
      : [_key];
  const pointers = [...this.pointers, ...extraPointers];

  this.data = JSON.parse(fs.readFileSync(this.targetFile, "UTF-8"));
  let current = this.data; // reference, pointer

  for (let i = 0; i < pointers.length - 1; i++) {
    const key = pointers[i];
    if (typeof current[key] !== "object" || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }

  current[pointers[pointers.length - 1]] = value;

  fs.writeFileSync(this.targetFile, JSON.stringify(this.data, null, 2));

  // Get updated value
  this._fileNavigator();

  return this;
}

async function rename(newName) {
  switch (this.valueType) {
    case ValueType.DIRECTORY:
    case ValueType.FILE:
      const foldersDir = this.targetFile.split("/").slice(0, -1);
      let newPath = [...foldersDir, newName].join("/");

      if (this.valueType === ValueType.FILE) {
        newPath += ".json";
      }

      fs.renameSync(this.targetFile, newPath);
      break;
    case ValueType.VALUE:
      let target = JSON.parse(fs.readFileSync(this.targetFile, "UTF-8"));
      const oldKey = this.pointers[this.pointers.length - 1];

      if (target[oldKey] !== undefined) {
        target[newName] = target[oldKey];
        delete target[oldKey];
        fs.writeFileSync(this.targetFile, JSON.stringify(target, null, 2));
      }
      break;
  }

  return this;
}

async function remove() {
  switch (this.valueType) {
    case ValueType.DIRECTORY:
      fs.rmdirSync(this.targetFile, { recursive: true });
      break;
    case ValueType.FILE:
      fs.unlinkSync(this.targetFile);
      break;
    case ValueType.VALUE:
      let target = JSON.parse(fs.readFileSync(this.targetFile, "UTF-8"));

      const keyToRemove = this.pointers[this.pointers.length - 1];

      if (target[keyToRemove] !== undefined) {
        delete target[keyToRemove];
        fs.writeFileSync(this.targetFile, JSON.stringify(target, null, 2));
      }
      break;
  }

  return this;
}

export { createFolder, createFile, set, rename, remove };
