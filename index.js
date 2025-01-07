// This is a playground for me to test stuff, ignore pls
// -----------------------------------------------------

const FolderDB = require('./src/index').default;
const db = new FolderDB({ dbPath: './db', mergeInstances: true });

// console.log(db);

// ====== FriendSchema.js file ======
const a = db.get('users').schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  sirName: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    omit: true,
  },
  passport: {
    type: String,
    immutable: true,
  },
});

// hooks must be before the events themselves
// a.hook('pre-create', object => {
//   object.sirName = 'Bardon';
//   return object;
// });
// a.hook(['post-create', 'post-update'], o => console.log('create/update - ', o.name));

// return schema;

// ==== End of file =====

// console.log(a);

const b = a.create('friend2', { name: 'GamBar  ' });

const [, contents] = b;

console.log('=>', contents);

// a.read('friend');
// console.log(a.find(o => o.name.toLowerCase() == 'gambar'));
// console.log(a.find({ name: 'gambar' }));

// a.update('friend2', { password: 'hello mom' });

// a.update('friend2', { password: 'hello mom!!!!' });

// console.log(a.read('friend2', { omit: [] }));

// console.log(db.get('friend').data);

// TODO: test population
