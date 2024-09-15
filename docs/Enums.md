# Enums

- [ValueType](#valuetype)
- [TimeFormat](#timeformat)
- [CaseFormat](#caseformat)

---

### ValueType

| Key        | Description                                     |
|------------|-------------------------------------------------|
| DIRECTORY  | Indicates that the current data is a Directory  |
| FILE       | Indicates that the current data is a File       |
| VALUE      | Indicates that the current data is a JSON Value |


### TimeFormat

| Key        | Description                         | Example             |
|------------|-------------------------------------|---------------------|
| SHORT      | Represents a short time format.     | `9/13/24`           |
| MEDIUM     | Represents a medium time format.    | `Sep 13, 2024`      |
| LONG       | Represents a long time format.      | `September 13, 2024`|



### CaseFormat

| Key        | Description                                                      | Example         |
|------------|------------------------------------------------------------------|-----------------|
| LOWER      | Converts the string to lowercase.                                | `helloworld`    |
| UPPER      | Converts the string to uppercase.                                | `HELLOWORLD`    |
| PASCAL     | Converts the string to PascalCase (e.g., HelloWorld).            | `HelloWorld`    |
| SNAKE      | Converts the string to snake_case (e.g., hello_world).           | `hello_world`   |
| CAMEL      | Converts the string to camelCase (e.g., helloWorld).             | `helloWorld`    |
| KEBAB      | Converts the string to kebab-case (e.g., hello-world).           | `hello-world`   |
| FLAT       | Converts the string to flatcase (e.g., helloworld).              | `helloworld`    |
| TRAIN      | Converts the string to Train-Case (e.g., Hello-World).            | `Hello-World`   |
| SLUG       | Converts the string to a URL slug format (e.g., hello-world).    | `hello-world`   |
| REVERSE    | Reverses the string (e.g., dlroWolleH).                          | `dlroWolleH`    |
