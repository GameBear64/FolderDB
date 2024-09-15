# Time Methods

- [.setTimestamp(name)](#settimestampname)
- [.setFutureTimestamp(name, ms)](#setfuturetimestampname-ms)
- [.advanceTime(milliseconds)](#advancetimemilliseconds)
- [.rewindTime(milliseconds)](#rewindtimemilliseconds)

---
### .setTimestamp(name)
Sets the current timestamp. Optionally assigns the timestamp to the provided name if specified.

| Parameter | Type   |
| --------- | ------ |
| name      | string |

**Example:**
```js
//before: { "time": 0 }
DB.get('time').setTimestamp()
//after: { "time": 1631510400000 }

//before: { "time": 0 }
DB.get('time').setTimestamp('createdAt')
//after: {"time": { "createdAt": 1631510400000 } }
```

---
### .setFutureTimestamp(name, ms)
Sets a future timestamp based on the current time, either by adding milliseconds or setting it directly.

| Parameter | Type   |
| --------- | ------ |
| name      | string |
| ms        | number |

**Example:**
```js
//before: {}
DB.get().setFutureTimestamp('expiresAt', 3600000)
//after: { "expiresAt": 1631514000000 }

//before: { "time": 0 }
DB.get('time').setFutureTimestamp(3600000)
//after: { "time": 1631514000000 }
```

---
### .advanceTime(milliseconds)
Advances the current timestamp by the specified number of milliseconds.

| Parameter    | Type   |
| ------------ | ------ |
| milliseconds | number |

**Example:**
```js
//before: { "time": 1631510400000 }
DB.get('time').advanceTime(60000)
//after: { "time": 1631510460000 }
```

---
### .rewindTime(milliseconds)
Rewinds the current timestamp by the specified number of milliseconds.

| Parameter    | Type   |
| ------------ | ------ |
| milliseconds | number |

**Example:**
```js
//before: { "data": 1631510400000 }
DB.get().rewindTime(60000)
//after: { "data": 1631510340000 }
```