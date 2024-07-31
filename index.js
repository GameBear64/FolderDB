import FolderDB from "./FolderDB/index.js";

const db = new FolderDB();
console.log("==============================================");

const result = await db.get("");
console.log("this is ", result);
// db.get("users");
// db.get('users.posts.1234.author');

console.log("==============================================");
