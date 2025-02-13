# Read Methods

- [.get(value)](#getvalue)
- [.getTree(value)](#gettreevalue)
- [.back(steps = 1)](#backsteps--1)

---
### .get(value)
This is how you navigate the database aka select property.
You will use this a lot.

| Parameter  | Type   |
| ---------- | ------ |
| value      | string |

**Examples:**  
*Getting the value from "name":*
```js
//DB: {"name": "Gam", "age": 19, "hobby": "Video games"}
DB.get("name").data
//returns "Gam"
```
*Get the second element of an array:*
```js
//DB: {"cake": ["Milk Bucket", "Sugar", "Egg", "Wheat"]}
DB.get("cake").get(2).data
//returns "Egg"
```
*Short syntax:*
```js
//DB: {"name": "Gam", "details": {"age": 19, "hobby": "Video games"}}
DB.get("details.age").data
//returns "19"
```

#### Range selector:
> Syntax [X:Y] where X is the start and Y is the end (inclusive)  
> Having a . in front is important


*Basic usage:*
```js
//DB: {"posts": ['First', "Second", "Third", "Forth"]}
DB.get("posts.[0:3]").data
//returns ["First", "Second", "Third"]
```

*Partial select:*
> [2:] everything but the first two  
> [-2:] selects the last two  
> [:2] selects the first two  
> [:-2] everything but the last two  
```js
//DB: {"posts": ['First', "Second", "Third", "Forth"]}
DB.get("posts.[:3]").data
//returns ["First", "Second", "Third"]
```


*Get nested values:*
```js
//DB: {"posts": [
// {"title": "First"},
// {"title": "Second"},
// {"title": "Third"},
// {"title": "Forth"}
//]}

DB.get("posts.[0:3].title").data

//returns ["First", "Second", "Third"]
```

---
### .getTree(value)
Recursively navigates through a directory and builds a tree structure.

| Parameter  | Type   |
| ---------- | ------ |
| value      | string |

**Example:**
```js
let tree = DB.getTree("users.posts").data;
// Returns: {
//   "posts": {
//     "first": {...},
//     "second": {...}
//   }
// }
```

---
### .back(steps = 1)
Omits specific fields from the current object.

| Parameter  | Type   | Default |
| ---------- | ------ | ------- |
| steps      | number | 1       |

**Example:**
```js
//DB: {"name": "Gam", "details": {"age": 19, "hobby": "Video games"}}
const db = DB.get("details.age")
console.log(db.data);
//returns "19"

db.back();
console.log(db.data);
//returns {"age": 19, "hobby": "Video games"}
```

---
### .fileExists(value)
Check if file exists

| Parameter  | Type   |
| ---------- | ------ |
| value      | string |

**Example:**
```js
const db = DB.get("user.comments").fileExists('comment_id')
//returns true or false
```

---
### .metadata(value)
Check file metadata (path, type, size, timestamps)

| Parameter  | Type   |
| ---------- | ------ |
| value      | string |

**Example:**
```js
const db = DB.get("user.comments").metadata('comment_id')
//returns t
{
  path: '~/project/db/user/comments/comment_id',
  type: 'file',
  size: '593',
  createdAt: 'Mon, 10 Feb 2025 23:24:11 GMT',
  modifiedAt: 'Tue, 11 Feb 2025 09:43:57 GMT',
}
```