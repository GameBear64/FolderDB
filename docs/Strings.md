# String Methods

- [.changeCase(format)](#changecaseformat)
- [.normalizeCase()](#normalizecase)

---
### .changeCase(format)
Changes the case format of the target string property.

| Parameter  | Type |
| ---------- | ---- |
| format | [enum](Enums.md#caseformat) |

**Example:**
```js
// before: {"title": "Hello World"}
DB.get("title").changeCase(CaseFormat.SNAKE)
// after: {"title": "hello_world"}
```

---
### .normalizeCase()
Normalizes the case of the target string by converting it to a sentence case format. It handles camelCase, PascalCase, underscores, hyphens, and multiple spaces.

**Example:**
```js
// before: {"description": "thisIs_anExample-of   TEXT"}
DB.get("description").normalizeCase()
// after: {"description": "This is an example of text"}
```