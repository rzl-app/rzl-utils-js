<div align="center">
  <h1><strong>⚡️ Packages <code>rzl-utils-js</code> 🚀</strong></h1>
</div>

<p align="center">
🚀 <strong>Rzl Utility JavaScript</strong> 🚀<br/>
A lightweight, modern TypeScript utility library for Node.js & browser.<br/>
Provides reusable helpers to simplify your JavaScript / TypeScript projects.<br/>
<strong>Built with ❤️ by <a href="https://github.com/rzl-app">@rzl-app</a>.</strong>
</p>

<div align="center">

[![Latest Version on NPM](https://img.shields.io/npm/v/rzl-utils-js?color=blue&style=flat-rounded)](https://npmjs.com/package/rzl-utils-js)
[![downloads](https://img.shields.io/npm/dt/rzl-utils-js?style=flat-rounded)](https://npmjs.com/package/rzl-utils-js)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.17.0-blue.svg?logo=node.js&style=flat-square)](https://nodejs.org/en/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/rzl-app/rzl-utils-js/blob/main/CONTRIBUTING.md)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/rzl-app/rzl-utils-js/blob/main/LICENSE.md)
[![GitHub](https://img.shields.io/badge/GitHub-rzl--app%2Frzl--utils--js-181717?logo=github)](https://github.com/rzl-app/rzl-utils-js)
[![Repo on GitHub](https://img.shields.io/badge/Repo-on%20GitHub-181717?logo=github&style=flat-rounded)](https://github.com/rzl-app)

</div>

---

## 📚 Table of Contents

- 💻 [Requirements](#requirements)
- ⚙️ [Installation](#installation)
- ✨ [Features](#features)
- 🧬 [NextJS Support](#nextjs-support)
- 💎 [Detailed Features](#detailed-features)
  - [Checker](#detailed-features--checker)
  - [Conversion](#detailed-features--conversion)
    - [Conversion Array](#detailed-features--conversion-array)
    - [Currency](#detailed-features--conversion-currency)
    - [Json](#detailed-features--conversion-json)
    - [Number](#detailed-features--conversion-number)
    - [Object](#detailed-features--conversion-object)
    - [Stringify](#detailed-features--conversion-stringify)
    - [Strings](#detailed-features--conversion-strings)
    - [Boolean](#detailed-features--conversion-boolean)
- 🔥 [Usage](#usage)
- ❤️ [Sponsor](#sponsor-this-package)
- 📜 [Changelog](#changelog)
- 🤝 [Contributing](#contributing)
- 🛡 [Security](#security)
- 🙌 [Credits](#credits)
- 📄 [License](#license)

---

<h2 id="requirements">💻 Requirements</h2>

- **Node.js >=18.17.0**  
  This package leverages modern JavaScript & TypeScript features that require Node.js version 18.17.0 or higher.

- Works with:
  - ✅ Node.js (18.17.0+)
  - ✅ Modern browsers (via bundlers like Webpack / Vite)

---

<h2 id="installation">⚙️ Installation</h2>

#### With NPM

```bash
  npm install rzl-utils-js
```

#### With Yarn

```bash
  yarn add rzl-utils-js
```

#### With PNPM

```bash
  pnpm add rzl-utils-js
```

---

<h2 id="features">✨ Features</h2>

- 🚀 Written in **TypeScript** — fully typed & safe
- ⚡ Small, tree-shakable & fast
- 📦 Works in **Node.js** & modern browsers
- ❤️ Simple API, easy to extend
- 🧬 **Next.js support**: helpers for dynamic routes, building URLs, reading env, extracting client IP
- 🛠 Additional TypeScript types: `OmitStrict`, `PartialByKeys`, etc.

---

<h2 id="nextjs-support">🧬 Next.js Support</h2>

This package also provides utilities specially built for Next.js environments, neatly separated into their own entry points:

- `rzl-utils-js/next`  
   Helpers for building URLs, generating dynamic routes, reading environment variables, etc.  
   ✅ Safe to use in both Next.js pages & API routes.

  #### 🚀 Next.js Helper Summary

  | <small>Function / Type </small>          | <small>What it does</small>                                                                                                                                        | <small>Reads / Validates</small>                                                                | <small>Example Output</small>                                           |
  | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
  | <small>getBaseUrl()</small>              | <small>Get frontend base URL from `NEXT_PUBLIC_BASE_URL` (defaults to `http://localhost:3000`), appends FE port if needed, normalizes URL.</small>                 | <small>✅ `NEXT_PUBLIC_BASE_URL`<br>✅ `NEXT_PUBLIC_PORT_FE`</small>                            | <small>`"http://localhost:3000"`</small>                                |
  | <small>getBackendApiUrl(options)</small> | <small>Get backend API base URL from `NEXT_PUBLIC_BACKEND_API_URL` (defaults to `http://localhost:8000`), appends BE port, plus optional `options.suffix`.</small> | <small>✅ `NEXT_PUBLIC_BACKEND_API_URL`<br>✅ `NEXT_PUBLIC_PORT_BE`</small>                     | <small>`"http://localhost:8000/api"`</small>                            |
  | <small>getBackendApiEndpoint()</small>   | <small>Build full endpoint URL combining `getBackendApiUrl` + prefix (`/api` by default) + pathname, can exclude origin.</small>                                   | <small>✅ Prefix (`/api`)<br>✅ Normalizes duplicate slashes<br>✅ Boolean `withOrigin`</small> | <small>`"http://localhost:8000/api/users"`<br>or `"/api/users"`</small> |
  | <small>generateRoute()</small>           | <small>Generates URL from dynamic Next.js route (`/post/[id]`) with params object. Validates missing, empty & invalid chars.</small>                               | <small>✅ Params cleaned strings<br>❌ Invalid: `? & # = / space ' " ( ) + ; % @ :`</small>     | <small>`"/post/123"`</small>                                            |
  | <small>ExtractRouteParams<T></small>     | <small>Type helper: extracts `[param]` from string into `{ param: string }`. Recursive.</small>                                                                    | <small>⚡️ Pure TS type — compile time only</small>                                             | <small>`{ id: string }`</small>                                         |
  | <small>HasDynamicSegments<T></small>     | <small>Type helper: checks if string contains `[param]`.</small>                                                                                                   | <small>⚡️ Pure TS type — compile time only</small>                                             | <small>`true` / `false`</small>                                         |

  #### ✨ Example for `"rzl-utils-js/next"`: Dynamic route & URL helpers (Next.js)

  ```ts
  import {
    getBaseUrl,
    getBackendApiUrl,
    getBackendApiEndpoint,
    generateRoute,
  } from "rzl-utils-js/next";

  console.log(getBaseUrl());
  // -> "http://localhost:3000"

  console.log(getBackendApiUrl({ suffix: "/v1" }));
  // -> "http://localhost:8000/v1"

  console.log(getBackendApiEndpoint("/users"));
  // -> "http://localhost:8000/api/users"

  console.log(generateRoute("/post/[id]", { id: "123" }));
  // -> "/post/123"
  ```

  ***

- `rzl-utils-js/next/server`  
  Utilities meant to run in Next.js server-only contexts (like middleware or server actions) for tasks such as extracting real client IPs.  
  ⚠️ Will throw if used outside a Next.js server environment.

  #### 🚀 Server-only Helpers (Next.js)

  | <small>Function / Type </small>                            | <small>What it does</small>                                                                                                                                                                                               | <small>Reads / Validates</small>                                                                                                                                     | <small>Example Output</small>                                |
  | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
  | <small>`getClientIpOrUrl(request, includeFullUrl)`</small> | <small>Extracts the real client IP from `x-forwarded-for`, normalizes IPv6, optionally builds full URL using `x-forwarded-proto` & `x-forwarded-port`. Designed for **Next.js middleware / server actions** only.</small> | <small>✅ Checks `NextRequest` instance<br>✅ Reads `x-forwarded-for`, `x-forwarded-proto`, `x-forwarded-port`<br>✅ Validates `boolean` on `includeFullUrl`</small> | <small>`"127.0.0.1"`<br>or `"http://127.0.0.1:3000"`</small> |

  #### ⚡ Example for `"rzl-utils-js/next/server"`: Server-only helpers (middleware/server-action)

  ```ts
  import { NextRequest } from "next/server";
  import { getClientIpOrUrl } from "rzl-utils-js/next/server";

  export function middleware(request: NextRequest) {
    console.log(getClientIpOrUrl(request)); // full URL
    console.log(getClientIpOrUrl(request, false)); // IP only
    return new Response("OK");
  }
  ```

  #### ⚠️ Important:

  If you run this outside of a Next.js environment (like plain Node.js or in non-Next projects), you might see errors such as:

  ```js
    Error: Cannot find module 'next/server'
    // or:
    Could not resolve "next/server"
  ```

---

<h2 id="detailed-features">💎 Detailed Features</h2>

  - <h3 id="detailed-features--checker">Checker</h3>

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

    ### ⚡ Quick Example (Checker Helpers)

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

    ***

  - <h3 id="detailed-features--conversion">Conversion</h3>  

    - <h4 id="detailed-features--conversion-array">Array</h4>

      <table>
        <thead>
          <tr>
            <th><small>Function</small></th>
            <th><small>Input Type / Example</small></th>
            <th><small>Output Type / Example</small></th>
            <th><small>Description</small></th>
            <th><small>Highlights</small></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><small><code>filterNullValuesArray</code></small></td>
            <td><small><code>[1, null, [2, undefined]]</code></small></td>
            <td><small><code>[1, [2]]</code> or <code>undefined</code> if empty</small></td>
            <td><small>Recursively removes <code>null</code> & <code>undefined</code> values</small></td>
            <td><small>✅ Recursive<br>✅ Type-safe</small></td>
          </tr>
          <tr>
            <td><small><code>removeDuplicatesArrayValues</code></small></td>
            <td><small><code>["apple", [1, 2, "apple"], 2, 1]</code></small></td>
            <td><small><code>["apple", 1, 2]</code> or <code>["apple", "1", "2"]</code></small></td>
            <td><small>Flattens array & removes duplicates while preserving order</small></td>
            <td><small>✅ Flatten<br>✅ Optional force to string</small></td>
          </tr>
          <tr>
            <td><small><code>arrayNumbValToStringVal</code></small></td>
            <td><small><code>[1, "2", null, undefined]</code></small></td>
            <td><small><code>["1", "2"]</code> if <code>removeInvalidValue=true</code></small></td>
            <td><small>Converts values to strings & optionally removes invalid entries</small></td>
            <td><small>✅ Remove invalid values</small></td>
          </tr>
          <tr>
            <td><small><code>arrayStringValToNumberVal</code></small></td>
            <td><small><code>["1", "2.5", "hello"]</code></small></td>
            <td><small><code>[1, 2]</code> if <code>removeInvalidValueNumber=true</code></small></td>
            <td><small>Converts valid strings to numbers, ignores invalid values</small></td>
            <td><small>✅ Remove invalid numbers</small></td>
          </tr>
          <tr>
            <td><small><code>convertArrayValuesToNumbers</code></small></td>
            <td><small><code>["1", ["2.5", "x"], { a: "3" }]</code></small></td>
            <td><small><code>[1, [2.5], { a: 3 }]</code> or <code>undefined</code></small></td>
            <td><small>Recursively converts values to numbers & maintains structure</small></td>
            <td><small>✅ Deep conversion<br>✅ Can remove empty obj/array</small></td>
          </tr> 
          <tr>
            <td><small><code>convertArrayValuesToStrings</code></small></td>
            <td><small><code>[1, ["2", { a: 3 }], null]</code></small></td>
            <td><small><code>["1", ["2", { a: "3" }]]</code></small></td>
            <td><small>Recursively converts values to strings & maintains structure</small></td>
            <td><small>✅ Deep conversion<br>✅ Can remove empty obj/array</small></td>
          </tr> 
        </tbody>
      </table>

      ### ⚡ Quick Example (Conversion Helpers - Array)

      ```ts
      import {
        filterNullValuesArray,
        removeDuplicatesArrayValues,
        arrayNumbValToStringVal,
        arrayStringValToNumberVal,
        convertArrayValuesToNumbers,
        convertArrayValuesToStrings
      } from "rzl-utils-js";

      // ✅ Example: filterNullValuesArray
      const cleanedArray = filterNullValuesArray([1, null, undefined, [2, null]]);
      // => [1, [2]]

      // ✅ Example: removeDuplicatesArrayValues
      const uniqueArray = removeDuplicatesArrayValues(["apple", [1, 2, "apple"], 2, 1]);
      // => ["apple", 1, 2]

      const uniqueArrayForceString = removeDuplicatesArrayValues(["apple", [1, 2, "apple"], 2, 1], true);
      // => ["apple", "1", "2"]

      // ✅ Example: arrayNumbValToStringVal
      const strArray = arrayNumbValToStringVal([1, "2", null, undefined], { removeInvalidValue: true });
      // => ["1", "2"]

      const strArrayKeepInvalid = arrayNumbValToStringVal([1, "2", null, undefined], { removeInvalidValue: false });
      // => ["1", "2", null, undefined]

      // ✅ Example: arrayStringValToNumberVal
      const numArray = arrayStringValToNumberVal(["1", "2.5", "hello"], { removeInvalidValueNumber: true });
      // => [1, 2]

      const numArrayKeepInvalid = arrayStringValToNumberVal(["1", "2.5", "hello"], { removeInvalidValueNumber: false });
      // => [1, 2, undefined]

      // ✅ Example: convertArrayValuesToNumbers
      const deepNum = convertArrayValuesToNumbers(["1", ["2.5", "invalid"], { a: "3.5" }]);
      // => [1, [2.5], { a: 3.5 }]

      const deepNumClean = convertArrayValuesToNumbers(
        { a: {}, b: [], c: { d: null } },
        true, // removeEmptyObjects
        true  // removeEmptyArrays
      );
      // => undefined or {}

      // ✅ Example: convertArrayValuesToStrings
      const deepStr = convertArrayValuesToStrings([1, ["2", { a: 3 }], null]);
      // => ["1", ["2", { a: "3" }]]

      const deepStrClean = convertArrayValuesToStrings(
        { a: {}, b: [], c: { d: null } },
        true, // removeEmptyObjects
        true  // removeEmptyArrays
      );
      // => undefined or {}

      // ✅ Example: ConvertedNumberType & ConvertedStringType (type only)
      type MyInput = { a: string, b: Array<string | null>, c: number };
      type AsNumber = ConvertedNumberType<MyInput, true, false>;
      // => { a: number; b: number[]; c: number }

      type AsString = ConvertedStringType<MyInput, false, true>;
      // => { a: string; b: string[]; c: string }
      ```

      ***

    - <h4 id="detailed-features--conversion-currency">Currency</h4>

      <table>
        <thead>
          <tr>
            <th><small>Function / Type</small></th>
            <th><small>What it does</small></th>
            <th><small>Highlights</small></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><small><code>formatCurrency</code></small></td>
            <td><small>Formats a number or string into a currency string with customizable separators, decimals, and suffixes.</small></td>
            <td><small>✅ Custom thousands & decimal separators<br>✅ Supports suffix decimals (e.g., ".-")<br>✅ Safe type validation</small></td>
          </tr>
          <tr>
            <td><small><code>removeNonNumericCharacters</code></small></td>
            <td><small>Strips out all non-numeric characters from a string or number input, returning a cleaned number.</small></td>
            <td><small>✅ Handles <code>null</code> & <code>undefined</code><br>✅ Ensures numeric result<br>✅ Simple fallback to <code>0</code></small></td>
          </tr>
        </tbody>
      </table>

      ### ⚡ Quick Example (Conversion Helpers - Currency)

      ```ts
      import { formatCurrency, removeNonNumericCharacters } from "rzl-utils-js";

      // Example: formatCurrency
      console.log(formatCurrency({ value: 1000000 }));
      // → "1.000.000"

      console.log(formatCurrency({ value: 2500.5, decimal: true }));
      // → "2.500,00" (because totalDecimal default is 2)

      console.log(formatCurrency({ value: "98765", separator: " " }));
      // → "98 765"

      console.log(
        formatCurrency({
          value: 1999.99,
          endDecimal: true,
          suffixDecimal: ".-",
          decimal: true,
          separatorDecimals: ",",
        })
      );
      // → "1.999,00.-"

      // Example: removeNonNumericCharacters
      console.log(removeNonNumericCharacters({ value: "123abc456" }));
      // → 123456

      console.log(removeNonNumericCharacters({ value: "$1,234.56" }));
      // → 123456

      console.log(removeNonNumericCharacters({ value: "9A8B7C6" }));
      // → 9876

      console.log(removeNonNumericCharacters({ value: undefined }));
      // → 0

      console.log(removeNonNumericCharacters({ value: null }));
      // → 0
      ```
      ***
    - <h4 id="detailed-features--conversion-json">Json</h4>

      <table>
        <thead>
          <tr>
            <th style="text-align:left;"><small>Function</small></th>
            <th style="text-align:left;"><small>Description</small></th>
            <th style="text-align:left;"><small>Parameters</small></th>
            <th style="text-align:left;"><small>Returns</small></th>
            <th style="text-align:left;"><small>Highlights</small></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><small><code>safeJsonParse</code></small></td>
            <td>
              <small>
                Safely parses a JSON string while cleaning and transforming data based on flexible options.<br>
                Handles automatic type conversions, removes empty/unwanted values, and supports custom date parsing.
              </small>
            </td>
            <td>
              <small>
                <strong>value:</strong> <code>string | null | undefined</code><br>
                JSON string to parse.<br><br>
                <strong>options:</strong> <code>CleanParsedDataOptions</code> (optional)<br>
                <ul>
                  <li><code>convertNumbers</code>: Convert numeric strings to numbers</li>
                  <li><code>convertBooleans</code>: Convert "true"/"false" to booleans</li>
                  <li><code>convertDates</code>: Parse ISO or custom date formats</li>
                  <li><code>customDateFormats</code>: e.g. ["DD/MM/YYYY"]</li>
                  <li><code>removeNulls</code>, <code>removeUndefined</code>, <code>removeEmptyObjects</code>, <code>removeEmptyArrays</code></li>
                  <li><code>strictMode</code>: Clean aggressively</li>
                  <li><code>loggingOnFail</code>: Log parse failures</li>
                  <li><code>onError</code>: Custom error callback</li>
                </ul>
              </small>
            </td>
            <td>
              <small>
                <code>T | undefined | null</code><br>
                Returns cleaned data or <code>undefined</code> if parsing fails.<br>
                If input is <code>null</code>, returns <code>null</code>.
              </small>
            </td>
            <td>
              <small>
                ✅ Converts numeric & boolean strings<br>
                ✅ Parses ISO & custom dates<br>
                ✅ Removes <code>null</code>, <code>undefined</code>, empty objects/arrays<br>
                ✅ Strict mode for aggressive cleaning<br>
                ✅ Custom error handler & logging
              </small>
            </td>
          </tr>
        </tbody>
      </table>

      ### ⚡ Quick Example (Conversion Helpers - Json)
        #### ➡️ TypeScript (with type support):
        ```ts
        import { safeJsonParse } from "rzl-utils-js";

        type User = {
          age?: number;
          isActive?: boolean;
          birthday?: Date;
          name?: string;
          nickname?: string;
        };

        // ✅ Example 1: Convert numbers and booleans automatically
        const example1 = safeJsonParse<User>(
          '{"age":"30","isActive":"true"}',
          { convertNumbers: true, convertBooleans: true }
        );
        console.log(example1);
        // Output: { age: 30, isActive: true }

        // ✅ Example 2: Parse custom date format (DD/MM/YYYY)
        const example2 = safeJsonParse<User>(
          '{"birthday":"25/12/2000"}',
          { convertDates: true, customDateFormats: ["DD/MM/YYYY"] }
        );
        console.log(example2);
        // Output: { birthday: Date("2000-12-25T00:00:00.000Z") }

        // ✅ Example 3: Remove nulls and undefined
        const example3 = safeJsonParse<User>(
          '{"name":"John","nickname":null,"status":undefined}',
          { removeNulls: true, removeUndefined: true }
        );
        console.log(example3);
        // Output: { name: "John" }

        // ✅ Example 4: Remove empty objects and arrays
        const example4 = safeJsonParse(
          '{"a":{},"b":[],"c":"non-empty"}',
          { removeEmptyObjects: true, removeEmptyArrays: true }
        );
        console.log(example4);
        // Output: { c: "non-empty" }

        // ✅ Example 5: Strict mode (removes all invalid conversions)
        const example5 = safeJsonParse(
          '{"score":"99abc","empty":"   "} ',
          { convertNumbers: true, strictMode: true }
        );
        console.log(example5);
        // Output: {} (both removed because not valid strict conversions)

        // ✅ Example 6: Logging error if JSON invalid
        const example6 = safeJsonParse(
          '{"invalid JSON...',
          { loggingOnFail: true }
        );
        console.log(example6);
        // Output: undefined, logs: JSON parsing failed from `safeJsonParse`: ...

        /**
        * Bonus: Custom onError handler
        */
        safeJsonParse('{"invalid JSON...', {
          onError: (err) => {
            console.log("Custom error handler:", (err as Error).message);
          }
        });
        // Output: Custom error handler: Unexpected end of JSON input
        ```

        #### ➡️ JavaScript (without TypeScript): 
        ```ts
          import { safeJsonParse } from "rzl-utils-js";

          // ✅ Example 1: Convert numbers and booleans automatically
          const example1 = safeJsonParse(
            '{"age":"30","isActive":"true"}',
            { convertNumbers: true, convertBooleans: true }
          );
          console.log(example1);
          // Output: { age: 30, isActive: true }


          // ✅ Example 2: Parse custom date format (DD/MM/YYYY)
          const example2 = safeJsonParse(
            '{"birthday":"25/12/2000"}',
            { convertDates: true, customDateFormats: ["DD/MM/YYYY"] }
          );
          console.log(example2);
          // Output: { birthday: Date("2000-12-25T00:00:00.000Z") }


          // ✅ Example 3: Remove nulls and undefined
          const example3 = safeJsonParse(
            '{"name":"John","nickname":null,"status":undefined}',
            { removeNulls: true, removeUndefined: true }
          );
          console.log(example3);
          // Output: { name: "John" }


          // ✅ Example 4: Remove empty objects and arrays
          const example4 = safeJsonParse(
            '{"a":{},"b":[],"c":"non-empty"}',
            { removeEmptyObjects: true, removeEmptyArrays: true }
          );
          console.log(example4);
          // Output: { c: "non-empty" }


          // ✅ Example 5: Strict mode (removes all invalid conversions)
          const example5 = safeJsonParse(
            '{"score":"99abc","empty":"   "} ',
            { convertNumbers: true, strictMode: true }
          );
          console.log(example5);
          // Output: {} (both removed because not valid strict conversions)


          // ✅ Example 6: Logging error if JSON invalid
          const example6 = safeJsonParse(
            '{"invalid JSON...',
            { loggingOnFail: true }
          );
          console.log(example6);
          // Output: undefined, logs: JSON parsing failed: ...


          /**
          * Bonus: Custom onError handler
          */
          safeJsonParse('{"invalid JSON...', {
            onError: (err) => {
              console.log("Custom error handler:", err.message);
            }
          });
          // Output: Custom error handler: Unexpected end of JSON input
        ```

    - <h4 id="detailed-features--conversion-number">Number</h4>

      <table>
        <thead>
          <tr>
            <th style="text-align: left"><small>Function</small></th>
            <th style="text-align: left"><small>Description</small></th>
            <th style="text-align: left"><small>Props / Usage</small></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code><small>formatPhoneNumber()</small></code>
            </td>
            <td>
              <small>
                Overloaded function to format, validate, or extract numbers from phone
                strings.<br />
                Returns <code>string</code> or <code>boolean</code> based on props.
              </small>
            </td>
            <td>
              <small>
                ✅ <code>takeNumberOnly: true</code> → digits<br />
                ✅ <code>checkValidOnly: true</code> → boolean<br />
                ✅ Normal → formatted phone string
              </small>
            </td>
          </tr>
          <tr>
            <td>
              <code><small>formatNumberWithSeparator()</small></code>
            </td>
            <td>
              <small>
                Adds separators every 3 digits.<br />
                Works with integers, decimals, and customizable separator chars.
              </small>
            </td>
            <td>
              <small>
                <code>formatNumberWithSeparator(1000000)</code> → <code>"1,000,000"</code><br />
                <code>formatNumberWithSeparator(1234567.89, " ")</code> →
                <code>"1 234 567.89"</code>
              </small>
            </td>
          </tr>
        </tbody>
      </table>

      ### ⚡ Quick Example (Conversion Helpers - Number)
        #### ➡️ TypeScript/JavaScript (with type support): 
        ```ts
          import { formatPhoneNumber,formatNumberWithSeparator } from "rzl-utils-js";

          // ✅ Example 1: Format phone number to string
          const ex1 = formatPhoneNumber({
            value: "+628123456789",
          });
          console.log(ex1);
          // Output: "(+62) 812 3456 789"

          // ✅ Example 2: Extract digits only
          const ex2 = formatPhoneNumber({
            value: "+62 812-3456-789",
            takeNumberOnly: true,
          });
          console.log(ex2);
          // Output: "628123456789"

          // ✅ Example 3: Validate phone format only (returns boolean)
          const ex3 = formatPhoneNumber({
            value: "+62 812 3456 789",
            checkValidOnly: true,
          });
          console.log(ex3);
          // Output: true or false

          // ✅ Example 4: Custom separator & country style
          const ex4 = formatPhoneNumber({
            value: "+62 8123456789",
            separator: "-",
            openingNumberCountry: "[",
            closingNumberCountry: "]",
          });
          console.log(ex4);
          // Output: "[+62] 812-3456-789"

          // ✅ Example 5: Format large number with custom separator
          const ex5 = formatNumberWithSeparator(987654321, " ");
          console.log(ex5);
          // Output: "987 654 321"
        ```

      

---

<h2 id="usage">🔥 Usage</h2>

#### Easy to use, just import on your code base.

##### Example Function Import:

```ts
import { isServer } from "rzl-utils-js";

console.log(isServer);
// true if running on Node.js, false if browser
```

##### Example TypeScript Helper Import:

```ts
import type { OmitStrict } from "rzl-utils-js/types";

type MyType = OmitStrict<OtherType, "omitedProps">;
// Fully strict TS omit that requires all keys to exist in target
```

---

<h2 id="sponsor-this-package">❤️ Sponsor this package</h2>

Help support development:  
[👉 Become a sponsor](https://github.com/sponsors/rzl-app)

---

<h2 id="changelog">📝 Changelog</h2>

See [CHANGELOG](CHANGELOG.md).

---

<h2 id="contributing">🤝 Contributing</h2>

See [CONTRIBUTING](CONTRIBUTING.md).

---

<h2 id="security">🛡 Security</h2>

Please report issues to [rizalvindwiky1998@gmail.com](mailto:rizalvindwiky1998@gmail.com).

---

<h2 id="credits">🙌 Credits</h2>

- [Rzl App](https://github.com/rzl-app)
- [All Contributors](../../contributors)

---

<h2 id="license">📜 License</h2>

The MIT License (MIT).  
Please see [License File](LICENSE.md) for more information.

---

✅ **Enjoy using `rzl-utils-js`?**  
Star this repo ⭐ and share it with other JavaScript developers!

---
