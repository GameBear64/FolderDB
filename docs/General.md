# General Methods

- [Utility methods](#utility-methods)
  - [.populate(location)](#populatelocation)
  - [.dump()](#dump)
  - [.tap(callback)](#tapcallback)
- [Array Methods](#array-methods)
  - [.average()](#average)
  - [.sample(count)](#samplecount)
- [Objects Methods](#objects-methods)
  - [.selectPick(desiredFields)](#selectpickdesiredfields)
  - [.selectOmit(fieldsToOmit)](#selectomitfieldstoomit)
- [Time Methods](#time-methods)
  - [.isPast()](#ispast)
  - [.formatTimestamp(format)](#formattimestampformat)
  - [.formatRelativeTime()](#formatrelativetime)

---

## Utility methods

### .populate(location)
Populates a value from a specified location in the data tree.

| Parameter  | Type |
| ---------- | ---- |
| location | string |

**Example:**
```js
//before: { post: { 
//   author : 'af7c1fe6-d669-414e-b066-e9733f0de7a8', 
//   body: 'Have a good day!'} 
// }
DB.get("post").populate("author");
//after: { post: { 
//  author : { name: 'Gam', id: 'af7c1fe6-d669-414e-b066-e9733f0de7a8' }, 
//  body: 'Have a good day!'}
//}
```

---
### .dump()
Dumps the current data to the console. 

**Example:**
```js
//DB: { "user": { "name": "Gam", "age": 30 } }
DB.get("user.name").dump().get(...)...;
//Returns: "Gam"
```

---
### .tap(callback)
Applies a callback function to the current data without modifying it.

| Parameter  | Type |
| ---------- | ---- |
| callback | function |

**Example:**
```js
//DB: { "user": { "name": "Gam", "age": 30 } }
DB.get("user.name").tap(data => console.log(data));
//Output to console: "Gam"
```
---
## Array Methods

### .average()
Subtracts a given number from the target property.

**Example:**
```js
//before: { "scores": [10, 20, 30] }
DB.get("scores").average();
//Returns: 20

```

---
### .sample(count)
Selects random elements from an array. 

| Parameter  | Type |
| ---------- | ---- |
| count | number |

**Example:**
```js
//before: {"items": ['sword', 'shield', 'health potion', 'damage potion']}
DB.get("items").sample(2)
//Returns: ['sword', 'damage potion'];
```

---
## Objects Methods

### .selectPick(desiredFields)
Picks specific fields from an object.

| Parameter  | Type |
| ---------- | ---- |
| desiredFields | array |

**Example:**
```js
// before: {"name": "Gam", "age": 19, "location": "NY"}
DB.selectPick(["name", "location"])
// returns: {"name": "Gam", "location": "NY"}
```

---
### .selectOmit(fieldsToOmit)
Omits specific fields from an object.

| Parameter  | Type |
| ---------- | ---- |
| fieldsToOmit | array |

**Example:**
```js
// before: {"name": "Gam", "age": 19, "location": "NY"}
DB.selectOmit(["age"])
// returns: {"name": "Gam", "location": "NY"}
```

---
## Time Methods

### .isPast()
Checks if the current timestamp is in the past.

**Example:**
```js
// before: {post: { author: 'id_b6jm5d', body: 'Have a great day!', created_at: 1672531199000}}
DB.get('post.created_at').isPast()
// returns: true
```

---
### .formatTimestamp(format)
Formats a timestamp into a specified format.

| Parameter  | Type | Default |
| ---------- | ---- | -------- |
| fieldsToOmit | [enum](Enums.md#timeformat) | TimeFormat.MEDIUM |



**Example:**
```js
// before: {"name": "Gam", "age": 19}
DB.get("age").addRandom(10, 1)
// after: {"name": "Gam", "age": 26}
```

---
### .formatRelativeTime()
Formats a timestamp into a relative time string.

**Example:**
```js
// before: {post: { author: 'id_b6jm5d', body: 'Have a great day!', created_at: 1672531199000}}
DB.get('post.created_at').formatRelativeTime()
// returns: '3 days ago'
```