import FolderDB from './FolderDB/index.js';

const db = new FolderDB({ dbPath: './db' });

console.log('==============================================');

const result = db.get('users.posts.1234').set('test.aa', 'new value2');
console.log('this is ', result);

// const result2 = await db.get('users.posts');
// console.log('this is ', result2);

// console.log(result.queue === result2.queue);

console.log('==============================================');
