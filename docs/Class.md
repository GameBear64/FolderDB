# Initial class

### new FolderDB(options)
Initialize new FolderDB instance.
> There can be only one instance for a DB. This is to prevent overrating from other places.

> If dbPath does not exist, it will be created.

| Parameter             | Type    | Purpose        |
| --------------------- | ------- | -------------- |
| option.dbPath         | string  | Define DB path |
| option.mergeInstances | boolean | False by default. Determine if an error is thrown on new instances|

**Example:**
```js
const DB = new FolderDB({ dbPath: './db' });
```

### Internal properties
> Some might be essential like the data property  
> Some might be useful like the valueType  
> But most you will be better off never touching

| Properties  | Type     | Purpose                                                           |
| ----------- | -------- | ----------------------------------------------------------------  |
| dbPath      | string   | The defined DB path                                               |
| queue       | Class    | Queue class ensuring the correct order of execution               |     
| pointers    | string[] | Pointers set by the [get method](./Read.md#getvalue)              |
| targetFile  | string?  | Target file found by the [get method](./Read.md#getvalue)         |
| data        | any      | Data result of the [get method](./Read.md#getvalue)               |
| valueType   | [Enum](./Enums.md#valuetype) | Enum indicating the type of the data property |
| methods     | function | Methods of the FolderDB class                                     |
| _methods    | function | Private or helper functions                                       |
| __methods   | function | Functions to never touch                                          |

---