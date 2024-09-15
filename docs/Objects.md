# Objects Methods

- [.merge(object)](#mergeobject)
- [.pick(desiredFields)](#pickdesiredfields)
- [.omit(fieldsToOmit)](#omitfieldstoomit)
- [.intersection(input)](#intersectioninput)
- [.XOR(input)](#xorinput)
- [.difference(input)](#differenceinput)
- [.differenceInsert(input)](#differenceinsertinput)

---
### .merge(object)
Merges the properties of the given object with the current object. If there are overlapping properties, the values from the given object will overwrite those in the current object.

| Parameter  | Type   |
| ---------- | ------ |
| object     | object |

**Example:**
```js
// before: {"user": {"name": "John", "age": 30}}
DB.get("user").merge({ age: 31, email: "john@example.com" })
// after: {"user": {"name": "John", "age": 31, "email": "john@example.com"}}
```

---
### .pick(desiredFields)
Picks specific fields from the current object and sets them as the new object.

| Parameter     | Type  |
| ------------- | ----- |
| desiredFields | array |

**Example:**
```js
// before: {"user": {"name": "John", "age": 30, "email": "john@example.com"}}
DB.get("user").pick(["name", "email"])
// after: {"user": {"name": "John", "email": "john@example.com"}}
```

---
### .omit(fieldsToOmit)
Omits specific fields from the current object.

| Parameter    | Type  |
| ------------ | ----- |
| fieldsToOmit | array |

**Example:**
```js
// before: {"user": {"name": "John", "age": 30, "email": "john@example.com"}}
DB.get("user").omit(["age"])
// after: {"user": {"name": "John", "email": "john@example.com"}}
```

---
### .intersection(input)
Returns the intersection of the target array or object and the input.

| Parameter  | Type  |
| ---------- | ----- |
| input      | array |

**Example:**
```js
//before: {"data": {"a": 1, "b": 2, "c": 3}}
DB.get("data").intersection({"b": 2, "c": 4})
//after: {"data": {"b": 2}}
```

---
### .XOR(input)
Returns the symmetric difference of the target array or object and the input.

| Parameter  | Type  |
| ---------- | ----- |
| input      | array |

**Example:**
```js
//before: {"data": {"a": 1, "b": 2, "c": 3}}
DB.get("data").XOR({"b": 2, "d": 4})
//after: {"data": {"a": 1, "c": 3, "d": 4}}
```

---
### .difference(input)
Returns the difference between the target array or object and the input.

| Parameter  | Type  |
| ---------- | ----- |
| input      | array |

**Example:**
```js
//before: {"data": {"a": 1, "b": 2, "c": 3}}
DB.get("data").difference({"b": 2})
//after: {"data": {"a": 1, "c": 3}}
```

---
### .differenceInsert(input)
Returns the elements from the input that do not exist in the target array or object and sets them as the new value.

| Parameter  | Type  |
| ---------- | ----- |
| input      | array |

**Example:**
```js
//before: {"data": {"a": 1, "b": 2}}
DB.get("data").differenceInsert({"b": 2, "c": 3})
//after: {"data": {"c": 3}}
```