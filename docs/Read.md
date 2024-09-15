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