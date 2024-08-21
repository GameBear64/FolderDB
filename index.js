import FolderDB from './FolderDB/index.js';

const db = new FolderDB({ dbPath: './db' });

console.log('==============================================');

const result = db.get('users.posts.1234.test').set('aa', 'new value5');
console.log('this is ', result);

// db.get('users.posts.1234.title').set('aaaa');

// const result2 = await db.get('users.posts');
// console.log('this is ', result2);

// console.log(result.queue === result2.queue);

console.log('==============================================');
