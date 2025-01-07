// This is a playground for me to test stuff, ignore pls
// -----------------------------------------------------

const FolderDB = require('./src/index').default;
const db = new FolderDB({ dbPath: './db', mergeInstances: true });

// console.log(db);

// ====== FriendSchema.js file ======
const a = db.get('users').schema(
  {
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
    items: { type: Array, populate: ['products.0', 'products.1', 'products.2'] },
    // itemsMore: { type: Array, populate: ['products.0', 'products.1', 'products.2'] },
  },
  { timestamps: true }
);

// hooks must be before the events themselves
// a.hook('pre-create', object => {
//   object.sirName = 'Bardon';
//   return object;
// });
// a.hook(['post-create', 'post-update'], o => console.log('create/update - ', o.name));

// return schema;

// ==== End of file =====

// console.log(a);

const [, contents] = a.create('friend2', { name: 'GamBar  ' });

console.log('=>', contents);

// a.read('friend');
// console.log(a.find(o => o.name.toLowerCase() == 'gambar'));
// console.log(a.find({ name: 'gambar' }));

// a.update('friend2', { password: 'hello mom' });

// a.update('friend2', { password: 'hello mom!!!!' });

// console.log(a.read('friend2', { omit: [] }));

// console.log(db.get('friend').data);
