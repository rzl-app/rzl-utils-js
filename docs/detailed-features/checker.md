### Docs Checker `rzl-utils-js`   
  #### 🚀 Checker Utils Helpers

  | <small>Function / Type</small>          | <small>What it does</small>                                                             | <small>Highlights</small>                                   |
  | --------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
  | <small>`textMatchesAllPatterns`</small> | <small>Checks if all `searchWords` exist in `text` using regex.</small>                 | <small>✅ Escapes regex<br>✅ Exact match optional</small>  |
  | <small>`textMatchesAnyPattern`</small>  | <small>Checks if at least one `searchWord` exists in `text` using regex.</small>        | <small>✅ Escapes regex<br>✅ Exact match optional</small>  |
  | <small>`isEmptyObject`</small>          | <small>Checks if a value is an empty object `{}`, empty array `[]`, or falsy.</small>   | <small>✅ Safe on `null` & `undefined`</small>              |
  | <small>`arrayHasAnyMatch`</small>       | <small>Checks if at least one element in `targetArray` exists in `sourceArray`.</small> | <small>✅ Uses `Set` for fast lookup</small>                |
  | <small>`isArray`</small>                | <small>Checks if a value is an array with TS type narrowing.</small>                    | <small>✅ Generic safe type guard</small>                   |
  | <small>`doesKeyExist`</small>           | <small>Recursively checks if a key exists in object or array (deep).</small>            | <small>✅ Safe & deep search</small>                        |
  | <small>`isInstanceOfError`</small>      | <small>Checks if a value is an `Error` instance.</small>                                | <small>✅ Useful for error handling</small>                 |
  | <small>`areArraysEqual`</small>         | <small>Deeply compares two arrays for equality. Supports ignoring order.</small>        | <small>✅ Uses `safeStableStringify` for deep check</small> |

  #### ⚡ Quick Example (Checker Helpers)

  ```ts
  import {
    textMatchesAllPatterns,
    textMatchesAnyPattern,
    isEmptyObject,
    arrayHasAnyMatch,
    isArray,
    doesKeyExist,
    isInstanceOfError,
    areArraysEqual,
  } from "rzl-utils-js";

  console.log(textMatchesAllPatterns("Hello world", ["Hello", "world"]));
  // => true

  console.log(
    textMatchesAnyPattern("JavaScript and TypeScript", ["Java", "Python"])
  );
  // => true

  console.log(isEmptyObject({}));
  // => true
  console.log(isEmptyObject({ a: 1 }));
  // => false

  console.log(arrayHasAnyMatch([1, 2, 3], [3, 4]));
  // => true

  console.log(isArray([1, 2, 3]));
  // => true
  console.log(isArray("not array"));
  // => false

  console.log(doesKeyExist({ a: { b: 2 } }, "b"));
  // => true

  console.log(isInstanceOfError(new Error("Oops")));
  // => true
  console.log(isInstanceOfError("just a string"));
  // => false

  console.log(areArraysEqual([1, 2], [2, 1], true));
  // => true
  console.log(areArraysEqual([1, 2], [2, 1], false));
  // => false (order matters)
  ```
  
---

[⬅ Back](https://github.com/rzl-app/rzl-utils-js?tab=readme-ov-file#detailed-features--checker)

---
