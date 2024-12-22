# FolderDB

> Filesystem based database focused on lightweight data storage and easy data preview

![NPM Version](https://img.shields.io/npm/v/%40gambar%2Ffolder-db)
![Coverage](https://img.shields.io/badge/coverage-%3E95%25-green)
![NPM Last Update](https://img.shields.io/npm/last-update/%40gambar%2Ffolder-db)
![NPM Downloads](https://img.shields.io/npm/d18m/%40gambar%2Ffolder-db)

![Made With Love](https://img.shields.io/badge/Made%20With-Love-red)


**Build using [Bun](https://bun.sh/) on [Debian](https://www.debian.org/), published to [NPM](https://www.npmjs.com/package/@gambar/folder-db).**  
*(should work on windows and node too)*

<br>

# Table of contents

- [Installation](#installation)
- [Documentation](#documentation)
- [Basic usage](#basic-usage)
- [Real world example](#real-world-example)

<br>

# Installation

```sh
npm i @gambar/folder-db
```

```js
import FolderDB, { CaseFormat } from '@gambar/folder-db';
// or
const FolderDB = require('@gambar/folder-db').default;
const { CaseFormat } = require('@gambar/folder-db').enums;
```

```js
const db = new FolderDB({ dbPath: './db' });
```

# Documentation

> Detailed documentation can be found on [GitHub](https://github.com/GameBear64/FolderDB).

- [**Read**](./docs/Read.md)
- [**Write**](./docs/Write.md)
---
- [**Numbers**](./docs/Numbers.md)
- [**Strings**](./docs/Strings.md)
- [**Arrays**](./docs/Arrays.md)
- [**Objects**](./docs/Objects.md)
---
- [**General**](./docs/General.md)
- [**Time**](./docs/Time.md)
---
- [**Enums**](./docs/Enums.md)

<br>

# Basic usage
```js
const FolderDB = require('@gambar/folder-db').default;
const db = new FolderDB({ dbPath: './db' });

//create a folder to store your users
db.createFolder("users");

//add new user
db.get("users").createFile("random_id_or_hash", { name: "GamBar" });

//update username of user
db.get("users")
  .get("random_id_or_hash")
  .get("name")
  .set("Gamriel");

//add a a new field to user
db.get("users.random_id_or_hash").set("job_title", "Software developer");

//add a timestamp
db.get('users.random_id_or_hash').setTimestamp('updated_at');

//read the user
const myUser = db.get('users.random_id_or_hash').data;
console.log(myUser);
```

<br>


# Real world example
### database.js
```js
const FolderDB = require('@gambar/folder-db').default;

module.exports = new FolderDB({ dbPath: './db', mergeInstances: true });
```

### Register
```js
const hash = shortHash(req.body.email);

const userFile = await db.get('users').get(hash).data;
if (userFile) return res.status(409).json('User with this email already exists');

db.get('users').createFile(hash, {
  ...req.body,
  password: bcrypt.hashSync(req.body.password, 10),
});

res.cookie('jwt', createJWTCookie({ id: hash }), { httpOnly: true });
res.status(201).json();
```

### Login
```js
const hash = shortHash(req.body.email);

const userFile = await db.get('users').get(hash).data;
if (!userFile) return res.status(404).json('User with this email does not exist');

const validPassword = await bcrypt.compare(req.body.password, userFile.password);
if (!validPassword) return res.status(403).json('Incorrect password');

res.cookie('jwt', createJWTCookie({ id: hash }), { httpOnly: true });
res.status(200).json();
```

### GET /User
```js
const userFile = await db.get('users').get(req.authUser.id).data;
return res.status(200).json(userFile);
```