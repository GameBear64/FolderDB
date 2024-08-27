import { describe, expect, test } from "bun:test";
import * as fs from "fs";
import { createFile } from "../FolderDB/methods/core/write.js";

import FolderDB from "../FolderDB/index.js";

const db = new FolderDB({ dbPath: "./db", mergeInstances: true });

describe("[SET]", () => {
  test("Writing with key and value", async () => {
    const reference = db.get("users.posts.1234.test");
    reference.set("nestedKey", "new value");
    let data = JSON.parse(
      fs.readFileSync("./db/users/posts/1234.json", "UTF-8")
    );

    expect(data.test.nestedKey).toEqual("new value");
    expect(reference.data.nestedKey).toEqual("new value");
  });

  test("Writing without key", async () => {
    const reference = db.get("users.posts.1234.test.nestedKey");
    reference.set("new value 2");

    let data = JSON.parse(
      fs.readFileSync("./db/users/posts/1234.json", "UTF-8")
    );

    expect(data.test.nestedKey).toEqual("new value 2");
    expect(reference.data).toEqual("new value 2");
  });

  test("Creating a matrix", async () => {
    const reference = db.get("users.posts.1234");
    reference.set("matrix", [0, 1, [2, 3]]);

    let data = JSON.parse(
      fs.readFileSync("./db/users/posts/1234.json", "UTF-8")
    );
    expect(data.matrix).toEqual([0, 1, [2, 3]]);
    expect(reference.data.matrix).toEqual([0, 1, [2, 3]]);
  });

  test("Ensures correct update of indices in a matrix", async () => {
    const reference = db.get("users.posts.1234.matrix");
    reference.set("2.1", 5);

    let data = JSON.parse(
      fs.readFileSync("./db/users/posts/1234.json", "UTF-8")
    );

    expect(data.matrix[2][1]).toEqual(5);
    expect(reference.data[2][1]).toEqual(5);
  });

  test("Updates the value when setting an object", async () => {
    const reference = db.get("users.posts.1234");
    reference.set("obj", {});

    let data = JSON.parse(
      fs.readFileSync("./db/users/posts/1234.json", "UTF-8")
    );
    expect(data.obj).toEqual({});
    expect(reference.data.obj).toEqual({});
  });

  test("Writing with many keys", async () => {
    const reference = db.get("users.posts.1234");
    reference.set("test2.deep.nest", "nested new value");

    let data = JSON.parse(
      fs.readFileSync("./db/users/posts/1234.json", "UTF-8")
    );

    expect(data.test2.deep.nest).toEqual("nested new value");
    expect(reference.data.test2.deep.nest).toEqual("nested new value");
  });

  test("Overriding and instances", async () => {
    let instance = db
      .get("users.posts.1234.test")
      .set("nestedKey", "some value");

    let data = JSON.parse(
      fs.readFileSync("./db/users/posts/1234.json", "UTF-8")
    );

    expect(data.test.nestedKey).toEqual("some value");
    expect(instance.data.nestedKey).toEqual("some value");

    instance.set("nestedKey", "some other value");
    data = JSON.parse(fs.readFileSync("./db/users/posts/1234.json", "UTF-8"));

    expect(data.test.nestedKey).toEqual("some other value");
    expect(instance.data.nestedKey).toEqual("some other value");
  });
});

describe("[FILE]", () => {
  db.get("users").createFile("newFile22222");
  db.get("users").createFile("folder/folder2/newFile");
});

describe("[FOLDER]", () => {});

describe("[RENAME]", () => {});

describe("[REMOVE]", () => {});

describe("[ERRORS]", () => {});
