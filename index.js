import FolderDB from './FolderDB/index.js';

const db = new FolderDB({ dbPath: './db' });

console.log('==============================================');

const result = await db.get('users.posts.1234.title');
console.log('this is ', result);

// const result2 = await db.get('users.posts');
// console.log('this is ', result2);

// console.log(result.queue === result2.queue);

console.log('==============================================');
