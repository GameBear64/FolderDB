// This is a playground for me to test stuff, ignore pls
// -----------------------------------------------------

const FolderDB = require('./src/index').default;
const db = new FolderDB({ dbPath: './db', mergeInstances: true });

// console.log(db);

// ====== FriendSchema.js file ======
const userSchema = db.get('users').schema(
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
    bookings: {
      type: String,
      populate: true,
    },
    items: { type: Array, populate: true },
    passwordChangedAt: {
      type: Number,
      default: 0,
    },
    settings: {
      theme: {
        type: String,
        default: 'dark',
      },
      language: {
        type: String,
        required: true
      },
      spaghetti: {
        meatballs: {
          type: Array,
          required: true,
        },
        sauce: {
          type: Boolean,
          default: true,
        },
        type: Object,
        required: true,
      },
      type: Object,
      required: true
    }
  },
  { timestamps: true, inlineId: true }
);

userSchema.hook(['pre-create', 'pre-update'], user => {
  if (user.hasOwnProperty('password')) {
    user.password = 'secure-' + user.password;
    user.passwordChangedAt = Date.now() - 1000;
  }

  return user;
});

// ==== End of file =====

// console.log(a);

const contents = userSchema.create('friend2', {
  name: 'GamBar  ',
  // bookings: 'products.1.name',
  bookings: 'gghj',
  password: 'secret',
  items: ['products.0', 'products.1', 'products.2'],
  settings: {
    // theme: '',
    language: 'en',
    spaghetti: {
      meatballs: [1, 2, 3],
      sauce: true,
    }
  }
});

userSchema.update('friend2', { password: 'new-password' });

// console.log('=>', contents);

// a.read('friend');

const userFile = userSchema.find(u => u.name == 'GamBar!', { first: true });

console.log(userFile);
