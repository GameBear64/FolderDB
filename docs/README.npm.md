# FolderDB

> Filesystem based database focused on lightweight data storage and easy data preview

![Coverage](https://img.shields.io/badge/coverage-%3E95%25-green)
![Issues](https://img.shields.io/github/issues/GameBear64/FolderDB)
![Stars](https://img.shields.io/github/stars/GameBear64/FolderDB?style=flat)

![Made With Love](https://img.shields.io/badge/Made%20With-Love-red)

**Build using [Bun](https://bun.sh/) on [Debian](https://www.debian.org/), published to [NPM](https://www.npmjs.com/package/@gambar/folder-db).**  
*(should work on windows and node too)*

<br>

# Table of contents

- [Installation](#installation)
- [Documentation](#documentation)
- [Basic usage](#basic-usage)

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

<br>

# Documentation

> Detailed documentation can be found on [GitHub](https://github.com/GameBear64/FolderDB).

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
