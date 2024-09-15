# Time Methods

- [.createFolder(name)](#createfoldername)
- [.createFile(name, buffer)](#createfilename-buffer)
- [.set(\_key, \_value)](#set_key-_value)
- [.rename(newName)](#renamenewname)
- [.remove()](#remove)

---
### .createFolder(name)
Creates a folder with the specified name at the target location.

| Parameter | Type   |
| --------- | ------ |
| name      | string |

**Example:**
```js
//before: [1.json, 2.json, 3.json]
DB.get('posts').createFolder('newFolder')
//after: [1.json, 2.json, 3.json, newFolder]
```

---
### .createFile(name, buffer)
Creates a file with the specified name and writes the provided buffer to it. If no buffer is provided, a default empty JSON object is written.

| Parameter | Type        |
| --------- | ----------- |
| name      | string      |
| buffer    | ArrayBuffer |

**Example:**
```js
//before: [1.json, 2.json, 3.json]
DB.get('posts').createFile('newPost')
//after: [1.json, 2.json, 3.json, newPost.json]

DB.get('posts').createFile('image.png', \<Array Buffer\>)
//after: [1.json, 2.json, 3.json, newPost.json, image.png]

DB.get('posts').createFile('folder/another/newPost')
//after: [1.json, 2.json, 3.json, newPost.json, image.png, folder]
```

---
### .set(_key, _value)
Sets a value at the specified key path in the target file. If no key is provided, sets the entire file content to the value.

| Parameter | Type   |
| --------- | ------ |
| _key      | number |
| _value    | any    |

**Example:**
```js
//before: {"user": {"name": "John"}}
DB.get('user').set('age', 25)
//after: {"user": {"name": "John", "age": 25}}

DB.get('user.age').set(30)
//after: {"user": {"name": "John", "age": 30}}
```

---
### .rename(newName)
Renames a file, directory, or a value inside an object.

| Parameter | Type   |
| --------- | ------ |
| newName   | string |

**Example:**
```js
//before: [1.json, 2.json, 3.json]
DB.get('posts.1').rename('new-1')
//after: [new-1.json, 2.json, 3.json]
```

```js
//before: {"user": {"name": "John"}}
DB.get('user.name').rename('fullName')
//after: {"user": {"fullName": "John"}}
```

---
### .remove()
Removes a directory, file, or a value inside a file.

**Example:**
```js
//before: [1.json, 2.json, 3.json]
DB.get('posts.1').rename()
//after: [2.json, 3.json]
```

```js
//before: {"user": {"name": "John", "age": 30}}
DB.get('user.age').remove()
//after: {"user": {"name": "John"}}
```