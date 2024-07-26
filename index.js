import FolderDB from './FolderDB/index.js';

const db = new FolderDB();

console.log('==============================================');

const a = await db.get('');
// console.log('this is ', await a.then(a => a));
console.log('this is ', a);
// db.get('users');
// db.get('users.posts.1234.author');
