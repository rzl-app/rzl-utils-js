### Docs Conversion `rzl-utils-js`   
  #### 🚀 Array Conversion Utils Helpers

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

  #### ⚡ Quick Example (Conversion Helpers - Array)

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
---

[⬅ Back](https://github.com/rzl-app/rzl-utils-js?tab=readme-ov-file#detailed-features--conversion-array)

---
