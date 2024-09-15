# Array Methods

- [.push(...value)](#pushvalue)
- [.pushSet(...value)](#pushsetvalue)
- [.pull({ result = false })](#pull-result--false-)
- [.shift({ result = false })](#shift-result--false-)
- [.unshift(...value)](#unshiftvalue)
- [.splice(start, deleteCount, ...items)](#splicestart-deletecount-items)
- [.map(func)](#mapfunc)
- [.sort(func)](#sortfunc)
- [.filter(func)](#filterfunc)
- [.reduce(func)](#reducefunc)
- [.concat(...arrays)](#concatarrays)
- [.unique()](#unique)
- [.chunk(size)](#chunksize)
- [.flattenMatrix()](#flattenmatrix)
- [.shuffleArray()](#shufflearray)
- [.intersection(input)](#intersectioninput)
- [.XOR(input)](#xorinput)
- [.difference(input)](#differenceinput)
- [.differenceInsert(input)](#differenceinsertinput)


---
### .push(...value)
Adds one or more values to the end of the target array.

| Parameter  | Type  |
| ---------- | ----- |
| value      | array |

**Example:**
```js
//before: {"items": [1, 2, 3]}
DB.get("items").push(4, 5)
//after: {"items": [1, 2, 3, 4, 5]}
```

---
### .pushSet(...value)
Adds one or more values to the target array, ensuring no duplicates are added.

| Parameter  | Type  |
| ---------- | ----- |
| value      | array |

**Example:**
```js
//before: {"items": [1, 2, 3]}
DB.get("items").pushSet(2, 4)
//after: {"items": [1, 2, 3, 4]}
```

---
### .pull({ result = false })
Removes and returns the last element of the target array.

**Example:**
```js
//before: {"items": [1, 2, 3]}
DB.get("items").pull()
//after: {"items": [1, 2]}

//with result option:
const last = DB.get("items").pull({ result: true });
console.log(last) // 3
```

---
### .shift({ result = false })
Removes and returns the first element of the target array.

**Example:**
```js
//before: {"items": [1, 2, 3]}
DB.get("items").shift()
//after: {"items": [2, 3]}

//with result option:
const first = DB.get("items").shift({ result: true });
console.log(first) // 1
```

---
### .unshift(...value)
Adds one or more values to the beginning of the target array.

| Parameter  | Type  |
| ---------- | ----- |
| value      | array |

**Example:**
```js
//before: {"items": [2, 3]}
DB.get("items").unshift(1)
//after: {"items": [1, 2, 3]}
```

---
### .splice(start, deleteCount, ...items)
Modifies the target array by removing or replacing existing elements and/or adding new elements.

| Parameter  | Type   |
| ---------- | ------ |
| start      | number |
| deleteCount| number |
| ...items   | array  |

**Example:**
```js
//before: {"items": [1, 2, 3, 4]}
DB.get("items").splice(1, 2, 5, 6)
//after: {"items": [1, 5, 6, 4]}
```

---
### .map(func)
Applies the provided function to every element in the target array and updates the array.

| Parameter | Type     |
| --------- | -------- |
| func      | function |

**Example:**
```js
//before: {"items": [1, 2, 3]}
DB.get("items").map(x => x * 2)
//after: {"items": [2, 4, 6]}
```

---
### .sort(func)
Sorts the target array in place, optionally using the provided function. \\

| Parameter | Type     |
| --------- | -------- |
| func      | function |

**Example:**
```js
//before: {"items": [3, 1, 2]}
DB.get("items").sort()
//after: {"items": [1, 2, 3]}
```

---
### .filter(func)
Filters the target array, keeping elements that satisfy the provided function.

| Parameter | Type     |
| --------- | -------- |
| func      | function |

**Example:**
```js
//before: {"items": [1, 2, 3, 4]}
DB.get("items").filter(x => x % 2 === 0)
//after: {"items": [2, 4]}
```

---
### .reduce(func)
Applies the provided function to reduce the array to a single value and sets the result as the new value.

| Parameter | Type     |
| --------- | -------- |
| func      | function |

**Example:**
```js
//before: {"items": [1, 2, 3]}
DB.get("items").reduce((acc, val) => acc + val)
//after: {"items": 6}
```

---
### .concat(...arrays)
Concatenates the target array with other arrays.

| Parameter   | Type  |
| ----------- | ----- |
| arrays      | array |

**Example:**
```js
//before: {"items": [1, 2]}
DB.get("items").concat([3, 4])
//after: {"items": [1, 2, 3, 4]}
```

---
### .unique()
Removes duplicate values from the target array.

**Example:**
```js
//before: {"items": [1, 1, 2, 2, 3]}
DB.get("items").unique()
//after: {"items": [1, 2, 3]}
```

---
### .chunk(size)
Breaks the target array into smaller arrays of the specified size.

| Parameter | Type   |
| --------- | ------ |
| size      | number |

**Example:**
```js
//before: {"items": [1, 2, 3, 4, 5]}
DB.get("items").chunk(2)
//after: {"items": [[1, 2], [3, 4], [5]]}
```

---
### .flattenMatrix()
Flattens a matrix (an array of arrays) into a single array.

**Example:**
```js
//before: {"items": [[1, 2], [3, 4]]}
DB.get("items").flattenMatrix()
//after: {"items": [1, 2, 3, 4]}
```

---
### .shuffleArray()
Shuffles the elements in the target array randomly.

**Example:**
```js
//before: {"items": [1, 2, 3]}
DB.get("items").shuffleArray()
//after: {"items": [2, 3, 1]} // random order
```

---
### .intersection(input)
Returns the intersection of the target array or object and the input.

| Parameter  | Type  |
| ---------- | ----- |
| input      | array |

**Example:**
```js
//before: {"items": [1, 2, 3]}
DB.get("items").intersection([2, 3, 4])
//after: {"items": [2, 3]}
```

---
### .XOR(input)
Returns the symmetric difference of the target array or object and the input.

| Parameter  | Type  |
| ---------- | ----- |
| input      | array |

**Example:**
```js
//before: {"items": [1, 2, 3]}
DB.get("items").XOR([3, 4])
//after: {"items": [1, 2, 4]}
```

---
### .difference(input)
Returns the difference between the target array or object and the input.

| Parameter  | Type  |
| ---------- | ----- |
| input      | array |

**Example:**
```js
//before: {"items": [1, 2, 3]}
DB.get("items").difference([2])
//after: {"items": [1, 3]}
```

---
### .differenceInsert(input)
Returns the elements from the input that do not exist in the target array or object and sets them as the new value.

| Parameter  | Type  |
| ---------- | ----- |
| input      | array |

**Example:**
```js
//before: {"items": [1, 2, 3]}
DB.get("items").differenceInsert([2, 3, 4])
//after: {"items": [4]}
```