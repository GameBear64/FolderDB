import { describe, expect, test } from "bun:test";
import * as fs from "fs";

import FolderDB from "../src/index.js";

const db = new FolderDB({ dbPath: "./test-db", mergeInstances: true });

describe("[SET]", () => {
  test("Writing with key and value", () => {
    const reference = db
      .get("users.posts.first.author")
      .set("id", "some_random_id");
    const data = JSON.parse(
      fs.readFileSync("./test-db/users/posts/first.json", "UTF-8")
    );

    expect(data.author.id).toEqual("some_random_id");
    expect(reference.data.id).toEqual("some_random_id");
  });

  test("Writing without key", () => {
    const reference = db
      .get("users.posts.first.author.id")
      .set("other_random_id");
    const data = JSON.parse(
      fs.readFileSync("./test-db/users/posts/first.json", "UTF-8")
    );

    expect(data.author.id).toEqual("other_random_id");
    expect(reference.data).toEqual("other_random_id");
  });

  test("Creating a matrix", () => {
    const reference = db.get("users.posts.first").set("matrix", [0, 1, [2, 3]]);

    const data = JSON.parse(
      fs.readFileSync("./test-db/users/posts/first.json", "UTF-8")
    );
    expect(data.matrix).toEqual([0, 1, [2, 3]]);
    expect(reference.data.matrix).toEqual([0, 1, [2, 3]]);
  });

  test("Ensures correct update of indices in a matrix", () => {
    const reference = db.get("users.posts.first.matrix").set("2.1", 5);
    const data = JSON.parse(
      fs.readFileSync("./test-db/users/posts/first.json", "UTF-8")
    );

    expect(data.matrix[2][1]).toEqual(5);
    expect(reference.data[2][1]).toEqual(5);
  });

  test("Updates the value when setting an object", () => {
    const reference = db.get("users.posts.first").set("obj", {});

    const data = JSON.parse(
      fs.readFileSync("./test-db/users/posts/first.json", "UTF-8")
    );
    expect(data.obj).toEqual({});
    expect(reference.data.obj).toEqual({});
  });

  test("Writing with many keys", () => {
    const reference = db
      .get("users.posts.first")
      .set("test2.deep.nest", "nested new value");
    const data = JSON.parse(
      fs.readFileSync("./test-db/users/posts/first.json", "UTF-8")
    );

    expect(data.test2.deep.nest).toEqual("nested new value");
    expect(reference.data.test2.deep.nest).toEqual("nested new value");
  });

  test("Writing to a range", () => {
    const result = db
      .get("users.posts.first.moreLinks.[1:3].name")
      .set("website");
    const data = JSON.parse(
      fs.readFileSync("./test-db/users/posts/first.json", "UTF-8")
    );

    expect(result.data).toEqual(["website", "website"]);
    expect(result.data).toEqual([
      data.moreLinks[1].name,
      data.moreLinks[2].name,
    ]);
  });

  test("Overriding and instances", () => {
    let instance = db.get("users.posts.first").set("testKey", "some value");
    let data = JSON.parse(
      fs.readFileSync("./test-db/users/posts/first.json", "UTF-8")
    );

    expect(data.testKey).toEqual("some value");
    expect(instance.data.testKey).toEqual("some value");

    instance.set("testKey", "some other value");
    data = JSON.parse(
      fs.readFileSync("./test-db/users/posts/first.json", "UTF-8")
    );

    expect(data.testKey).toEqual("some other value");
    expect(instance.data.testKey).toEqual("some other value");
  });

  test("Overwriting a whole file", () => {
    const initialData = { id: 1, title: "Original Post" };
    const newData = {
      id: 2,
      title: "Updated Post",
      content: "This is new content.",
    };

    db.get("users.posts.overwrite").createFile("post", initialData);
    db.get("users.posts.overwrite.post").set(newData);

    const data = JSON.parse(
      fs.readFileSync("./test-db/users/posts/overwrite/post.json", "UTF-8")
    );
    expect(data).toEqual(newData);
  });

  test("Write after multiple gets", () => {
    let instance = db
      .get("users.posts.first")
      .set("testKey", { a: { b: { c: "nest" } } });

    instance.get("testKey.a.b.c").set("deep nest");
    const data = JSON.parse(
      fs.readFileSync("./test-db/users/posts/first.json", "UTF-8")
    );

    let final = db.get("users.posts.first.testKey.a.b.c").data;
    expect(final).toEqual("deep nest");
    expect(data.testKey.a.b.c).toEqual(final);
  });

  test("Error - setting a variable not in file", () => {
    expect(() => {
      db.get("users.posts").set("obj", {});
    }).toThrow("Not a file");
  });
});

describe("[FOLDER]", () => {
  test("Creating a folder", () => {
    db.get("users").createFolder("testFolder");
    expect(!!db.get("users.testFolder")).toEqual(true);
    expect(!!fs.existsSync("./test-db/users/testFolder")).toEqual(true);
  });

  test("Error - create folder in variable", () => {
    expect(() => {
      db.get("users.posts.first.author").createFolder("testFolder");
    }).toThrow();
  });
});

describe("[FILE]", () => {
  test("Creating a file", () => {
    db.get("users").createFile("newFile");
    db.get("users").createFile("folder/subFolder/new");
    db.get("users").get("moreUser").get("details").createFile("newest");

    const newFile = JSON.parse(
      fs.readFileSync("./test-db/users/newFile.json", "UTF-8")
    );
    const newInFolder = JSON.parse(
      fs.readFileSync("./test-db/users/folder/subFolder/new.json", "UTF-8")
    );
    const newInFolderPointers = JSON.parse(
      fs.readFileSync("./test-db/users/moreUser/details/newest.json", "UTF-8")
    );

    expect(newFile).toEqual({});
    expect(newInFolder).toEqual({});
    expect(newInFolderPointers).toEqual({});

    expect(db.get("users.newFile").data).toEqual(newFile);
    expect(db.get("users.folder.subFolder.new").data).toEqual(newInFolder);
    expect(db.get("users.moreUser.details.newest").data).toEqual(
      newInFolderPointers
    );
  });

  test("Creating a file with contents", () => {
    const user = { id: 1, name: "gambar", password: "secret" };
    db.get("users").createFile("newContentFile", user);

    const newFile = JSON.parse(
      fs.readFileSync("./test-db/users/newContentFile.json", "UTF-8")
    );
    expect(newFile).toEqual(user);
  });

  test("Error - create file in variable", () => {
    expect(() => {
      db.get("users.posts.first.author").createFile("testFolder");
    }).toThrow();
  });
});

describe("[RENAME]", () => {
  test("Renaming a file", () => {
    db.get("users").createFile("renameFile");
    db.get("users.renameFile").rename("renamedFile");

    expect(!!fs.existsSync("./test-db/users/renamedFile.json")).toEqual(true);
  });

  test("Renaming a folder", () => {
    db.get("users").createFolder("renameFolder");
    db.get("users.renameFolder").rename("renamedFolder");

    expect(!!fs.existsSync("./test-db/users/renamedFolder")).toEqual(true);
  });

  test("Renaming a key in an object", () => {
    let reference = db
      .get("users.posts.first.author")
      .set("something_nice", "some_random_id");
    reference = reference.get("something_nice").rename("something");

    const data = JSON.parse(
      fs.readFileSync("./test-db/users/posts/first.json", "UTF-8")
    );

    expect(data.author.something).toEqual("some_random_id");
    expect(reference.data.something).toEqual("some_random_id");
  });
});

describe("[REMOVE]", () => {
  test("Removing a file", () => {
    db.get("users").createFile("testRemove");
    db.get("users.testRemove").remove();

    expect(!!fs.existsSync("./test-db/users/testRemove")).toEqual(false);
  });

  test("Removing a folder", () => {
    db.get("users").createFolder("new1");
    expect(!!fs.existsSync("./test-db/users/new1")).toEqual(true);

    db.get("users.new1").remove();
    expect(!!fs.existsSync("./test-db/users/new1")).toEqual(false);
  });

  test("Removing a key in an object", () => {
    let reference = db
      .get("users.posts.first")
      .set("veryNested", { a: { b: "im nested" } });
    const data = JSON.parse(
      fs.readFileSync("./test-db/users/posts/first.json", "UTF-8")
    );

    expect(reference.data.veryNested.a.b).toEqual("im nested");
    expect(reference.data.veryNested.a.b).toEqual(data.veryNested.a.b);

    reference = reference.get("veryNested.a").remove();

    expect(reference.data).toEqual({});
  });
});
