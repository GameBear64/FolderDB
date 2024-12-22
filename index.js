// This is a playground for me to test stuff, ignore pls
// -----------------------------------------------------

const FolderDB = require('./src/index').default;
// const FolderDB = require('./dist/index.cjs').default;

const db = new FolderDB({ dbPath: './db', mergeInstances: true });

// console.log(db);
// console.log(db.get('users'));

// db.get('users').createFile('gambar');

// console.log(db.get('users.gambar.posts.[0:3].title').data);

console.log(db.get('users.gambar.posts.[0:3].title').set('New title').data);
