# Number Operations

- [.inc()](#inc)
- [.dec()](#dec)
- [.add(number)](#addnumber)
- [.sub(number)](#subnumber)
- [.dec()](#dec-1)
- [.addPercentage(percentage)](#addpercentagepercentage)
- [.subPercentage(percentage)](#subpercentagepercentage)
- [.random(max, min = 0)](#randommax-min--0)
- [.addRandom(max, min = 0)](#addrandommax-min--0)
- [.subRandom(max, min = 0)](#subrandommax-min--0)
- [.clamp(min, max)](#clampmin-max)
- [.roundFloat(digits)](#roundfloatdigits)


---
### .inc()
Increases the target property by one.

**Example:**
```js
//before: {"name": "Gam", "age": 19}
DB.get("age").inc()
//after: {"name": "Gam", "age": 20}
```

---
### .dec()
Decreases the target property by one.  

**Example:**
```js
//before: {"name": "Gam", "age": 19}
DB.get("age").dec()
//after: {"name": "Gam", "age": 18}
```

---
### .add(number)
Adds a given number to the target property.

**Example:**
```js
// before: {"name": "Gam", "age": 19}
DB.get("age").add(5)
// after: {"name": "Gam", "age": 24}
```

---
### .sub(number)
Subtracts a given number from the target property.

**Example:**
```js
// before: {"name": "Gam", "age": 19}
DB.get("age").sub(5)
// after: {"name": "Gam", "age": 14}
```

---
### .dec()
Decreases the target property by one.  

**Example:**
```js
//before: {"name": "Gam", "age": 19}
DB.get("age").dec()
//after: {"name": "Gam", "age": 18}
```

---
### .addPercentage(percentage)
Increases the target property by a given percentage.

| Parameter  | Type |
| ---------- | ---- |
| percentage | number |

**Example:**
```js
// before: {"name": "Gam", "age": 100}
DB.get("age").addPercentage(10)
// after: {"name": "Gam", "age": 110}
```

---
### .subPercentage(percentage)
Decreases the target property by a given percentage. 

| Parameter  | Type |
| ---------- | ---- |
| percentage | number |

**Example:**
```js
// before: {"name": "Gam", "age": 100}
DB.get("age").subPercentage(10)
// after: {"name": "Gam", "age": 90}
```

---
### .random(max, min = 0)
Sets the target property to a random number between the given minimum and maximum values.

| Parameter  | Type | Default |
| ---------- | ---- | ------- |
| max | number | undefined |
| min | number | 0 |

**Example:**
```js
// before: {"name": "Gam", "luck": 0}
DB.get("luck").random(10, 1)
// after: {"name": "Gam", "luck": 7}
```

---
### .addRandom(max, min = 0)
Adds a random amount in (inclusive) range to target property.

| Parameter  | Type |  Default |
| ---------- | ---- | -------- |
| max | number | undefined |
| min | number | 0 |


**Example:**
```js
//before: {"inventory" : {"coins" : 500, "sword" : "Legendary Blade"}}
DB.get("inventory").get("coins").addRandom(100, 200)
//after: {"inventory" : {"coins" : 673, "sword" : "Legendary Blade"}}
```

---
### .subRandom(max, min = 0)
Subtracts a random amount in (inclusive) range from target property.

| Parameter  | Type | Default |
| ---------- | ---- | ------- |
| max | number | undefined |
| min | number | 0 |


**Example:**
```js
//before: {"inventory" : {"coins" : 500, "sword" : "Legendary Blade"}}
let randomSub = DB.get("inventory").get("coins").subRandom(100, 200)
//after: {"inventory" : {"coins" : 379, "sword" : "Legendary Blade"}}
```

---
### .clamp(min, max)
Clamps the target property value between a minimum and maximum range.

| Parameter  | Type |
| ---------- | ---- |
| max | number |
| min | number |

**Example:**
```js
// before: {"name": "Gam", "age": 25}
DB.get("age").clamp(18, 20)
// after: {"name": "Gam", "age": 20}
```

---
### .roundFloat(digits)
Rounds the target property's floating-point number to a specified number of digits.

| Parameter  | Type |
| ---------- | ---- |
| digits | number |

**Example:**
```js
// before: {"name": "Gam", "balance": 19.87654}
DB.get("balance").roundFloat(2)
// after: {"name": "Gam", "balance": 19.88}
```
