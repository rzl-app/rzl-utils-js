import { isEqual } from "lodash";
import { parseCurrencyString } from "@/conversions/currency/parsing";
import { safeStableStringify } from "@/conversions/stringify";

/** ---------------------------------
 * * ***Compares two objects for deep equality.***
 * ---------------------------------
 *  * This Function using `lodash` library.
 *
 * @template T1 The type of the first object.
 * @template T2 The type of the second object.
 * @param {T1} object1 - The first object to compare.
 * @param {T2} object2 - The second object to compare.
 * @returns {boolean} `true` if both objects are deeply equal, otherwise `false`.
 *
 * @example
 * areObjectsEqual({ a: 1, b: 2 }, { a: 1, b: 2 }); // Returns true
 * areObjectsEqual({ a: 1 }, { a: 1, b: undefined }); // Returns false
 * areObjectsEqual([1, 2, 3], [1, 2, 3]); // Returns true
 */
export const areObjectsEqual = (
  object1: unknown,
  object2: unknown
): boolean => {
  return isEqual(object1, object2);
};

/** ----------------------------------------------------------
 * * ***Compares two arrays deeply to check if they are equal.***
 * ----------------------------------------------------------
 *
 * Supports deep comparison of arrays containing nested arrays or objects.
 * Can also ignore the order of elements at all levels by recursively sorting.
 *
 * ----------------------------------------------------------
 *
 * @param {unknown[]} arr1
 *    The first array to compare. Can contain nested arrays or objects.
 *
 * @param {unknown[]} arr2
 *    The second array to compare against. Should match structure of `arr1`.
 *
 * @param {boolean} [ignoreOrder=false]
 *    Whether to ignore the order of elements when comparing.
 *    If `true`, will sort both arrays recursively before comparing.
 *    Default is `false`.
 *
 * @returns {boolean}
 *    Returns `true` if both arrays are deeply equal, otherwise `false`.
 *
 * @throws {TypeError}
 *    Throws if `arr1` or `arr2` are not arrays, or if `ignoreOrder` is not a boolean.
 *
 * @example
 * areArraysEqual([1, 2, 3], [1, 2, 3]);
 * // → true
 *
 * @example
 * areArraysEqual([1, 2, 3], [3, 2, 1]);
 * // → false
 *
 * @example
 * areArraysEqual([1, 2, 3], [3, 2, 1], true);
 * // → true (order ignored)
 *
 * @example
 * areArraysEqual([{ x: 1 }, { y: 2 }], [{ y: 2 }, { x: 1 }], true);
 * // → true
 *
 * ----------------------------------------------------------
 *
 * @internal
 * @function deepIgnoreOrder
 * Recursively sorts an array and its nested arrays so deep comparison
 * can ignore element order at all levels.
 *
 * @param {unknown[]} arr
 *    The array to deep sort.
 *
 * @returns {unknown[]}
 *    A new deeply sorted array.
 */
export const areArraysEqual = (
  arr1: unknown[],
  arr2: unknown[],
  ignoreOrder: boolean = false
): boolean => {
  if (!(isArray(arr1) && isArray(arr2))) {
    throw new TypeError(`props 'arr1' and 'arr2' must be \`array\` type!`);
  }
  if (!(typeof ignoreOrder === "boolean")) {
    throw new TypeError(`props 'ignoreOrder' must be \`boolean\` type!`);
  }

  if (arr1.length !== arr2.length) return false;

  /**
   * Recursively sorts an array (and nested arrays) so that
   * deep equality checks can ignore order at all levels.
   *
   * @param {unknown[]} arr - The array to deep sort.
   * @returns {unknown[]} A new deeply sorted array.
   */
  const deepIgnoreOrder = (arr: unknown[]): unknown[] => {
    if (!isArray(arr)) return arr;

    // Recursively sort nested arrays
    const sorted = arr.map((item) => {
      if (isArray(item)) {
        return deepIgnoreOrder(item);
      }
      return item;
    });

    // Sort current array level
    return sorted.sort((a, b) => {
      const sa = safeStableStringify(a);
      const sb = safeStableStringify(b);
      return sa < sb ? -1 : sa > sb ? 1 : 0;
    });
  };

  const normalizedArr1 = ignoreOrder ? deepIgnoreOrder(arr1) : arr1;
  const normalizedArr2 = ignoreOrder ? deepIgnoreOrder(arr2) : arr2;

  if (normalizedArr1.length !== normalizedArr2.length) return false;

  return normalizedArr1.every(
    (item, index) =>
      safeStableStringify(item) === safeStableStringify(normalizedArr2[index])
  );
};

/** ----------------------------------------------------------
 * * ***Checks if at least one element from `targetArray` exists in `sourceArray`.***
 * ----------------------------------------------------------
 *
 * - ✅ Uses `Set` for **faster lookup** compared to `Array.prototype.includes()`.
 * - ✅ Supports **any data type** (`number`, `string`, `boolean`, `object`, `array`, `function`, etc.).
 * - ✅ Uses **reference equality** for non-primitive values (object, array, function).
 * - ✅ Returns `false` if either array is missing, empty, or not an array.
 *
 * @template T - The expected type of array elements.
 *
 * @param {T[]} [sourceArray] - The array to search within.
 * @param {T[]} [targetArray] - The array containing elements to match.
 *
 * @returns {boolean}
 *    - `true` if **at least one element from `targetArray` is strictly found in `sourceArray`**.
 *    - Comparison uses:
 *       - **Value equality** for primitives (`number`, `string`, `boolean`, `null`, `undefined`).
 *       - **Reference equality** for objects, arrays, and functions.
 *    - `false` if:
 *       - No matching elements exist,
 *       - Either array is not provided, not an actual array, or is empty.
 *
 * @example
 * arrayHasAnyMatch(["apple", "banana", "cherry"], ["banana", "grape"]); // → true
 * arrayHasAnyMatch(["red", "blue"], ["green", "yellow"]); // → false
 * arrayHasAnyMatch([1, 2, 3], [3, 4, 5]); // → true
 * arrayHasAnyMatch([], ["test"]); // → false
 * arrayHasAnyMatch(["A", "B", "C"], []); // → false
 *
 * @example
 * const obj = { x: 1 };
 * arrayHasAnyMatch([obj], [obj]); // → true (same reference)
 * arrayHasAnyMatch([{ x: 1 }], [{ x: 1 }]); // → false (different reference)
 *
 * @example
 * const fn = () => "hello";
 * arrayHasAnyMatch([fn], [fn]); // → true
 * arrayHasAnyMatch([() => "hello"], [() => "hello"]); // → false (different function reference)
 *
 * @example
 * const arr = [1, 2];
 * arrayHasAnyMatch([arr], [arr]); // → true
 * arrayHasAnyMatch([[1, 2]], [[1, 2]]); // → false (different array object)
 */
export const arrayHasAnyMatch = <T>(
  sourceArray?: T[],
  targetArray?: T[]
): boolean => {
  if (
    !isArray(sourceArray) ||
    !isArray(targetArray) ||
    sourceArray.length === 0 ||
    targetArray.length === 0
  ) {
    return false;
  }

  // 🔥 use Set for lookup more faster.
  const sourceSet = new Set(sourceArray);
  return targetArray.some((item) => sourceSet.has(item));
};

/** ----------------------------------------------------------
 * * ***Recursively checks if a given key exists in an object or array.***
 * ----------------------------------------------------------
 *
 * - ✅ **Supports deeply nested objects and arrays**, searching recursively.
 * - ✅ Uses `Object.prototype.hasOwnProperty.call()` to safely check if the key exists at each level,
 *      even if its value is `null` or `undefined`.
 * - ✅ Optimized to return `true` immediately when the key is found (short-circuits).
 * - ✅ Handles edge cases gracefully:
 *      - Returns `false` for `null`, `undefined`, or non-object inputs.
 *      - Returns `false` if key is not found anywhere, even in deeply nested structures.
 *
 * ⚠️ Note: This function only checks for **the existence of the key itself**,
 * not whether its value is non-null or non-undefined.
 * If you need to check for both existence and meaningful value, write a stricter function.
 *
 * @template T - The type of the input object or array.
 * @param {T | Record<string, unknown> | unknown[]} object - The object or array to search.
 * @param {PropertyKey} key - The key to look for (string, number, or symbol).
 * @returns {boolean} Returns `true` if the key exists anywhere in the object or array (even with `null` / `undefined` value), otherwise `false`.
 *
 * @example
 * doesKeyExist({ name: "John", age: 30 }, "age"); // true
 * doesKeyExist({ user: { profile: { email: "test@example.com" } } }, "email"); // true
 * doesKeyExist([{ id: 1 }, { id: 2 }], "id"); // true
 * doesKeyExist({ a: { b: { c: 10 } } }, "d"); // false
 * doesKeyExist(null, "name"); // false
 * doesKeyExist(undefined, "test"); // false
 *
 * @example
 * // Key exists even if value is null or undefined:
 * doesKeyExist({ a: null, b: undefined, c: { d: null } }, "a"); // true
 * doesKeyExist({ a: null, b: undefined, c: { d: null } }, "b"); // true
 * doesKeyExist({ a: null, b: undefined, c: { d: null } }, "d"); // true
 *
 * @example
 * doesKeyExist({ a: 1 }, true); // ❌ Throws TypeError
 * doesKeyExist({ a: 1 }, ["not", "valid"]); // ❌ Throws TypeError
 */
export const doesKeyExist = <T>(
  object: T | Record<string, unknown> | unknown[],
  key: PropertyKey
): boolean => {
  if (!object || typeof object !== "object") return false; // Handle null, undefined, and non-objects

  if (
    !(
      typeof key === "string" ||
      typeof key === "number" ||
      typeof key === "symbol"
    )
  ) {
    throw new TypeError(
      `props 'key' must be \`string\`, \`number\` or \`symbol\` type!`
    );
  }

  // Direct match found
  if (Object.prototype.hasOwnProperty.call(object, key)) return true;

  if (isArray(object)) {
    // Check each array item recursively
    return object.some((item) => doesKeyExist(item, key));
  }

  return Object.values(object).some(
    (value) => typeof value === "object" && doesKeyExist(value, key)
  );
};

/** ----------------------------------------------------------
 * * ***Type guard: Checks if a value is an array.***
 * ----------------------------------------------------------
 *
 * - ✅ Uses `Array.isArray()` for reliable and safe type checking.
 * - ✅ Supports TypeScript **type narrowing** using `value is T[]`.
 * - ✅ Handles edge cases like `null`, `undefined`, and non-array objects.
 *
 * @template T - The expected type of array elements.
 * @param {unknown} value - The value to check.
 * @returns {value is T[]} Returns `true` if the value is an array, otherwise `false`.
 *
 * @example
 * isArray([1, 2, 3]); // true
 * isArray([]); // true
 * isArray("hello"); // false
 * isArray({ key: "value" }); // false
 * isArray(null); // false
 * isArray(undefined); // false
 */
export const isArray = <T>(value: unknown): value is T[] => {
  return Array.isArray(value);
};

/** ---------------------------------------------------------
 * * ***Type guard: Checks if a value is of type `boolean`.***
 * ---------------------------------------------------------
 *
 * @param {unknown} val - The value to check.
 * @returns {val is boolean} Returns `true` if the value is a boolean, otherwise `false`.
 *
 * @example
 * isBoolean(true);   // true
 * isBoolean(false);  // true
 * isBoolean("true"); // false
 */
export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === "boolean";
};

/** -----------------------------------------------------------
 * * Checks whether an input looks like a currency or number string,
 * * using the same smart multi-locale parsing logic as `parseCurrencyString`.
 * -----------------------------------------------------------
 *
 * ✅ Highlights:
 * - Supports strings or numbers like:
 *   - "15.000,10"  (European)
 *   - "15,000.10"  (US)
 *   - "15'000.10"  (Swiss)
 *   - "15 000,10"  (French)
 *   - "Rp 15.000,10" or "$15,000.10"
 * - Also accepts simple numbers (15300.95).
 *
 * 🚀 Uses the same core logic as `parseCurrencyString` but
 * just checks if a final parsed float is sensible.
 *
 * @param {string|number} input
 *   The input value to check.
 *
 * @returns {boolean}
 *   `true` if it can be reasonably parsed into a currency-like number,
 *   `false` otherwise.
 *
 * @example
 * isCurrencyLike("Rp 15.000,10");
 * // ➔ true
 *
 * isCurrencyLike("$15,000.10");
 * // ➔ true
 *
 * isCurrencyLike("(15'000.10)");
 * // ➔ true
 *
 * isCurrencyLike("abc");
 * // ➔ false
 *
 * isCurrencyLike(15300.95);
 * // ➔ true
 *
 * isCurrencyLike("");
 * // ➔ false
 */
export const isCurrencyLike = (input: string | number): boolean => {
  if (!(typeof input === "string" || typeof input === "number")) return false;

  const parsed = parseCurrencyString(input.toString());
  // If parseCurrencyString returns a meaningful number (not just fallback zero for empty/invalid input)
  if (parsed !== 0) return true;

  // Special case: if input was exactly "0", still valid
  return input.toString().trim() === "0";
};

/** ----------------------------------------------------------
 * * ***Determines if a value is an empty object (`{}`), empty array (`[]`), or generally falsy.***
 * ----------------------------------------------------------
 *
 * - Returns `true` for `{}`, `[]`, `null`, `undefined`, `""`, `false`, and `NaN`.
 * - Returns `false` for objects with properties, non-empty arrays, numbers, functions, and other non-empty values.
 * - Safely handles `null`, `undefined`, and non-object types without throwing.
 *
 * @param {unknown} value - The value to evaluate.
 * @returns {boolean} `true` if the value is considered empty, otherwise `false`.
 *
 * @example
 * isEmptyValue({}); // true
 * isEmptyValue([]); // true
 * isEmptyValue({ key: "value" }); // false
 * isEmptyValue([1, 2, 3]); // false
 * isEmptyValue(null); // true
 * isEmptyValue(undefined); // true
 * isEmptyValue(""); // true
 * isEmptyValue("   "); // true
 * isEmptyValue(0); // false
 * isEmptyValue(-1); // false
 * isEmptyValue(2); // false
 * isEmptyValue(() => {}); // false
 */
export const isEmptyValue = (value: unknown): boolean => {
  if (value === null || value === undefined || value === false) return true;
  if (typeof value === "number" && Number.isNaN(value)) return true;
  if (isString(value)) return value.trim() === "";
  if (isArray(value)) return value.length === 0;

  if (typeof value === "object") {
    return (
      Object.keys(value).length === 0 &&
      Object.getOwnPropertySymbols(value).length === 0
    );
  }

  return false;
};

/** ----------------------------------------------------------
 * * ***Recursively checks if a value is "deeply empty".***
 * ----------------------------------------------------------
 *
 * - Returns `true` for:
 *   - Empty objects: `{}`
 *   - Empty arrays: `[]`
 *   - Nested empty structures: `{ a: [], b: {} }`
 *   - Falsy values (except numbers): `null`, `undefined`, `false`, `""`, `NaN`
 *
 * - Returns `false` for:
 *   - Non-zero numbers
 *   - Objects or arrays containing non-empty values
 *   - Non-empty strings, `true`, functions, symbols, etc.
 *
 * @param {unknown} value - The value to deeply check.
 * @returns {boolean} `true` if the value is deeply empty, otherwise `false`.
 *
 * @example
 * isEmptyDeep({}); // true
 * isEmptyDeep([]); // true
 * isEmptyDeep({ a: {} }); // true
 * isEmptyDeep([[], {}]); // true
 * isEmptyDeep({ a: [1] }); // false
 * isEmptyDeep([0]); // false
 * isEmptyDeep("test"); // false
 * isEmptyDeep(""); // true
 * isEmptyDeep(0); // false
 * isEmptyDeep(NaN); // true
 */
export const isEmptyDeep = (value: unknown): boolean => {
  if (isString(value)) return value.trim() === "";
  if (isNumber(value)) return false;
  if (!value) return true;

  if (isArray(value)) {
    return value.length === 0 || value.every(isEmptyDeep);
  }

  if (typeof value === "object") {
    const keys = Object.keys(value);
    const symbols = Object.getOwnPropertySymbols(value);
    return (
      [...keys, ...symbols].length === 0 ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [...keys, ...symbols].every((key) => isEmptyDeep((value as any)[key]))
    );
  }

  return false;
};

/** ----------------------------------------------------------
 * * ***Checks if a given value is an instance of the `Error` object.***
 * ----------------------------------------------------------
 *
 * - ✅ This function helps ensure that the provided value is a valid JavaScript error.
 * - ✅ Useful for error handling in TypeScript.
 *
 * @param {unknown} error - The value to check.
 * @returns {boolean} - Returns `true` if the value is an `Error`, otherwise `false`.
 *
 * @example
 * isError(new Error("Something went wrong")); // true
 * isError("Error message"); // false
 * isError(null); // false
 */
export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

/** ---------------------------------------------------------
 * * ***Type guard: Checks if a value is `null`.***
 * ---------------------------------------------------------
 *
 * @param {unknown} val - The value to check.
 * @returns {val is null} Returns `true` if the value is `null`, otherwise `false`.
 *
 * @example
 * isNull(null); // true
 * isNull(0);    // false
 */
export const isNull = (val: unknown): val is null => val === null;

/** ---------------------------------------------------------
 * * ***Type guard: Checks if a value is of type `number`.***
 * ---------------------------------------------------------
 *
 * Excludes `NaN` from being considered a valid number.
 *
 * @param {unknown} val - The value to check.
 * @returns {val is number} Returns `true` if the value is a number (excluding NaN), otherwise `false`.
 *
 * @example
 * isNumber(42);    // true
 * isNumber(NaN);   // false
 * isNumber("42");  // false
 */
export const isNumber = (val: unknown): val is number => {
  return typeof val === "number" && !isNaN(val);
};

/** ---------------------------------------------------------
 * * ***Type guard: Checks if a value is a plain object.***
 * ---------------------------------------------------------
 *
 * Will return `false` for arrays, undefined and `null`.
 *
 * @param {unknown} val - The value to check.
 * @returns {val is Record<string, unknown>} Returns `true` if the value is a plain object, otherwise `false`.
 *
 * @example
 * isObject({ name: "Alice" }); // true
 * isObject([1,2,3]);           // false
 * isObject(null);              // false
 * isObject(undefined);         // false
 */
export const isObject = (val: unknown): val is Record<string, unknown> => {
  return typeof val === "object" && val !== null && !isArray(val);
};

/** ---------------------------------------------------------
 * * ***Type guard: Checks if a value is of type `string`.***
 * ---------------------------------------------------------
 *
 * This function is a type guard that determines if the provided value
 * is a `string`. It can be used to narrow types in TypeScript.
 *
 * @param {unknown} val - The value to check.
 * @returns {val is string} `true` if the value is a string, otherwise `false`.
 *
 * @example
 * isString("hello"); // true
 * isString(123);     // false
 *
 * // Usage in type narrowing
 * const value: unknown = getValue();
 * if (isString(value)) {
 *   // TypeScript now knows `value` is a string
 *   console.log(value.toUpperCase());
 * }
 */
export const isString = (val: unknown): val is string => {
  return typeof val === "string";
};

/** ---------------------------------------------------------
 * * ***Type guard: Checks if a value is `undefined`.***
 * ---------------------------------------------------------
 *
 * @param {unknown} val - The value to check.
 * @returns {val is undefined} Returns `true` if the value is `undefined`, otherwise `false`.
 *
 * @example
 * isUndefined(undefined); // true
 * isUndefined(null);      // false
 */
export const isUndefined = (val: unknown): val is undefined => {
  return typeof val === "undefined";
};

/** ----------------------------------------------------------
 * * ***Checks if the given `text` contains all of the specified `searchWords`.***
 * ----------------------------------------------------------
 *
 * - ✅ Uses **regular expressions** for flexible pattern matching.
 * - ✅ **Escapes special characters** to prevent regex injection attacks.
 * - ✅ **Trims input** to avoid false positives with empty spaces.
 * - ✅ **Supports exact word matching** (optional).
 *
 * @param {string} text - The text to search within.
 * @param {string[]} searchWords - An array of words/phrases to match against the text.
 * @param {boolean} [options.exactMatch=false] - If `true`, matches whole words only, defaultValue is `false`.
 * @param {string} [options.flags="i"] - Optional regex flags (default: `"i"` for case-insensitive).
 * @returns {boolean} - `true` if all `searchWords` are found in `text`, otherwise `false`.
 *
 * @example
 * textMatchesAllPatterns("Hello world, WithAI APP", ["Hello", "world"]); // true
 * textMatchesAllPatterns("JavaScript and TypeScript", ["Java", "Script"]); // true
 * textMatchesAllPatterns("Machine Learning", ["AI", "Learning"]); // false
 * textMatchesAllPatterns("open-source", ["open"], { exactMatch: true }); // false (because options `exactMatch=true`)
 */
export const textMatchesAllPatterns = <T extends string>(
  text: T,
  searchWords: T[] | string[],
  options?: {
    /** If `true`, matches whole words only, defaultValue is `false`. */
    exactMatch?: boolean;
    /** Optional regex flags (default: `"i"` for case-insensitive). */
    flags?: string;
  }
): boolean => {
  if (typeof text !== "string" || !text.trim() || !isArray(searchWords)) {
    return false;
  }

  if (options == null || typeof options !== "object") {
    throw new TypeError(`props 'options' must be \`object\` type!`);
  }

  // fallback to default
  const { exactMatch = false, flags = "i" } = options;

  if (typeof exactMatch !== "boolean") {
    throw new TypeError(`props 'exactMatch' must be \`boolean\` type!`);
  }
  if (typeof flags !== "string") {
    throw new TypeError(`props 'flags' must be \`string\` type!`);
  }

  // Escape special regex characters to prevent unintended behavior
  const escapeRegex = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Filter out empty search words
  const validSearchWords = searchWords
    .filter((word) => typeof word === "string" && word.trim().length > 0)
    .map(escapeRegex);

  if (validSearchWords.length === 0) return false;

  // Create regex pattern: Whole word match (`\bword\b`) <- is deprecated. if `exactMatch` is true
  return validSearchWords.every((word) => {
    const pattern = exactMatch ? `(?<!\\S)${word}(?!\\S)` : word;
    return new RegExp(pattern, flags.includes("u") ? flags : flags + "u").test(
      text
    );
  });
};

/** ----------------------------------------------------------
 * * ***Checks if the given `text` contains at least one of the specified `searchWords`.***
 * ----------------------------------------------------------
 *
 * - ✅ Uses **regular expressions** for flexible pattern matching.
 * - ✅ **Escapes special characters** to prevent regex injection attacks.
 * - ✅ **Trims input** to avoid false positives with empty spaces.
 * - ✅ **Supports exact word matching** (optional).
 *
 * @param {string} text - The text to search within.
 * @param {string[]} searchWords - An array of words/phrases to match against the text.
 * @param {boolean} [options.exactMatch=false] - If `true`, matches whole words only, defaultValue is `false`.
 * @param {string} [options.flags="i"] - Optional regex flags (default: `"i"` for case-insensitive).
 * @returns {boolean} - `true` if at least one `searchWord` is found in `text`, otherwise `false`.
 *
 * @example
 * textMatchesAnyPatterns("Hello world", ["hello", "test"]); // true
 * textMatchesAnyPatterns("withAI APP", ["chat", "ai"]); // false
 * textMatchesAnyPatterns("TypeScript is great!", ["script", "java"]); // true
 * textMatchesAnyPatterns("open-source", ["open"], { exactMatch: true }); // false (because options `exactMatch=true`)
 */
export const textMatchesAnyPatterns = <T extends string>(
  text: T,
  searchWords: T[] | string[],
  options?: {
    exactMatch?: boolean;
    flags?: string;
  }
): boolean => {
  if (typeof text !== "string" || !text.trim() || !isArray(searchWords)) {
    return false;
  }

  if (typeof options !== "object") {
    throw new TypeError(`props 'options' must be \`object\` type!`);
  }

  // fallback to default
  const { exactMatch = false, flags = "i" } = options || {};

  if (typeof exactMatch !== "boolean") {
    throw new TypeError(`props 'exactMath' must be \`boolean\` type!`);
  }
  if (typeof flags !== "string") {
    throw new TypeError(`props 'flags' must be \`string\` type!`);
  }

  // Escape special regex characters to prevent unintended behavior
  const escapeRegex = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Filter out empty search words
  const validSearchWords = searchWords
    .filter((word) => typeof word === "string" && word.trim().length > 0)
    .map(escapeRegex);

  if (validSearchWords.length === 0) return false;

  // Create regex pattern: Whole word match (`\bword\b`) if `exactMatch` is true
  // const pattern = exactMatch
  //   ? `\\b(${validSearchWords.join("|")})\\b`
  //   : `(${validSearchWords.join("|")})`;
  // return new RegExp(pattern, flags).test(text);

  const pattern = exactMatch
    ? `(?<!\\S)(${validSearchWords.join("|")})(?!\\S)`
    : `(${validSearchWords.join("|")})`;

  return new RegExp(pattern, flags.includes("u") ? flags : flags + "u").test(
    text
  );
};

/** ----------------------------------------------------------
 * * ***Performs a deep equality check between two values.***
 * ----------------------------------------------------------
 *
 * - Compares nested arrays, objects, Dates, RegExp, NaN, and primitive values.
 * - Handles special cases:
 *   - `NaN` is considered equal to `NaN`.
 *   - `Date` objects are equal if their `.getTime()` is equal.
 *   - `RegExp` objects are equal if their `.toString()` is equal.
 *   - `Symbol("x")` and `Symbol("x")` are treated equal if their `.toString()` matches,
 *     even though by JavaScript identity they are different.
 * - Does not detect circular references.
 *
 * @param {unknown} a - The first value to compare.
 * @param {unknown} b - The second value to compare.
 * @returns {boolean} `true` if both values are deeply equal, otherwise `false`.
 *
 * @example
 * deepEqual(1, 1);
 * // => true
 *
 * @example
 * deepEqual({ a: [1, 2, 3] }, { a: [1, 2, 3] });
 * // => true
 *
 * @example
 * deepEqual(new Date("2025-01-01"), new Date("2025-01-01"));
 * // => true
 *
 * @example
 * deepEqual(/abc/, /abc/);
 * // => true
 *
 * @example
 * deepEqual(NaN, NaN);
 * // => true
 *
 * @example
 * deepEqual(Symbol("x"), Symbol("x"));
 * // => true
 *
 * @example
 * deepEqual({ a: 1 }, { a: 2 });
 * // => false
 *
 * @example
 * deepEqual([1, 2], [1, 2, 3]);
 * // => false
 */
export const isDeepEqual = (a: unknown, b: unknown): boolean => {
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString();
  }

  if (
    typeof a === "number" &&
    typeof b === "number" &&
    Number.isNaN(a) &&
    Number.isNaN(b)
  ) {
    return true;
  }

  if (typeof a === "symbol" && typeof b === "symbol") {
    return a.toString() === b.toString();
  }

  if (a === b) return true;
  if (typeof a !== typeof b) return false;

  if (isArray(a) && isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => isDeepEqual(v, b[i]));
  }

  if (typeof a === "object" && typeof b === "object" && a && b) {
    if (isArray(a) !== isArray(b)) {
      return false;
    }
    const aKeys = Object.keys(a as object);
    const bKeys = Object.keys(b as object);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) =>
      isDeepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
    );
  }

  return false;
};
