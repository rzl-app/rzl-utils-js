import { parseCurrencyString } from "@/conversions/currency/parsing";
import { safeStableStringify } from "@/conversions/stringify";

/** ----------------------------------------------------------
 * * ***Compares two arrays deeply to check if they are equal.***
 * ----------------------------------------------------------
 *
 * @param {unknown[]} arr1 - First array.
 * @param {unknown[]} arr2 - Second array.
 * @param {boolean} [ignoreOrder=false] - Whether to ignore order when comparing, defaultValue is `false`.
 * @returns {boolean} True if both arrays are equal, otherwise false.
 */
export const areArraysEqual = (
  arr1: unknown[],
  arr2: unknown[],
  ignoreOrder: boolean = false
): boolean => {
  if (!(isArray(arr1) || isArray(arr2))) {
    throw new TypeError(`props 'arr1' and 'arr2' must be \`array\` type!`);
  }
  if (!(typeof ignoreOrder === "boolean")) {
    throw new TypeError(`props 'ignoreOrder' must be \`boolean\` type!`);
  }

  if (arr1.length !== arr2.length) return false;

  const sortedArr1 = ignoreOrder ? [...arr1].sort() : arr1;
  const sortedArr2 = ignoreOrder ? [...arr2].sort() : arr2;

  return sortedArr1.every(
    (item, index) =>
      safeStableStringify(item) === safeStableStringify(sortedArr2[index])
  );
};

/** ----------------------------------------------------------
 * * ***Checks if at least one element from `targetArray` exists in `sourceArray`.***
 * ----------------------------------------------------------
 *
 * - ✅ Uses `Set` for **faster lookup** compared to `Array.prototype.includes()`.
 * - ✅ Supports **any data type**, not just `string[]` (generic type support).
 * - ✅ Returns `false` if either array is missing, empty, or not an array.
 *
 * @template T - The expected type of array elements.
 * @param {T[]} sourceArray - The array to search within.
 * @param {T[]} targetArray - The array containing elements to match.
 * @returns {boolean} `true` if at least one element from `targetArray` exists in `sourceArray`, otherwise `false`.
 *
 * @example
 * arrayHasAnyMatch(["apple", "banana", "cherry"], ["banana", "grape"]); // true
 * arrayHasAnyMatch(["red", "blue"], ["green", "yellow"]); // false
 * arrayHasAnyMatch([1, 2, 3], [3, 4, 5]); // true
 * arrayHasAnyMatch([], ["test"]); // false
 * arrayHasAnyMatch(["A", "B", "C"], []); // false
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
 * - ✅ **Supports both objects and arrays**, searching deeply through nested structures.
 * - ✅ **Uses `Object.prototype.hasOwnProperty.call()`** to safely check properties.
 * - ✅ **Optimized for performance** by immediately returning `true` when a match is found.
 * - ✅ **Handles edge cases** (e.g., `null`, `undefined`, non-object inputs).
 *
 * @template T - The type of the input object or array.
 * @param {T | Record<string, unknown> | unknown[]} obj - The object or array to search.
 * @param {PropertyKey} key - The key to check for existence.
 * @returns {boolean} Returns `true` if the key exists, otherwise `false`.
 *
 * @example
 * doesKeyExist({ name: "John", age: 30 }, "age"); // true
 * doesKeyExist({ user: { profile: { email: "test@example.com" } } }, "email"); // true
 * doesKeyExist([{ id: 1 }, { id: 2 }], "id"); // true
 * doesKeyExist({ a: { b: { c: 10 } } }, "d"); // false
 * doesKeyExist(null, "name"); // false
 * doesKeyExist(undefined, "test"); // false
 */
export const doesKeyExist = <T>(
  obj: T | Record<string, unknown> | unknown[],
  key: PropertyKey
): boolean => {
  if (!obj || typeof obj !== "object") return false; // Handle null, undefined, and non-objects

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

  if (Object.prototype.hasOwnProperty.call(obj, key)) return true; // Direct match found

  if (isArray(obj)) {
    return obj.some((item) => doesKeyExist(item, key)); // Check each array item recursively
  }

  return Object.values(obj).some(
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
export const isBoolean = (val: unknown): val is boolean => {
  return typeof val === "boolean";
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
 * isEmptyValue(() => {}); // false
 */
export const isEmptyValue = (value: unknown): boolean => {
  if (isString(value)) return value.trim() === "";
  if (!value) return true; // handles null, undefined, false, "", 0, NaN
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

  if (Array.isArray(value)) {
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
 * Will return `false` for arrays and `null`.
 *
 * @param {unknown} val - The value to check.
 * @returns {val is Record<string, unknown>} Returns `true` if the value is a plain object, otherwise `false`.
 *
 * @example
 * isObject({ name: "Alice" }); // true
 * isObject([1,2,3]);           // false
 * isObject(null);              // false
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
  return validSearchWords.every((word) => {
    const pattern = exactMatch ? `\\b${word}\\b` : word;
    return new RegExp(pattern, flags).test(text);
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
 * textMatchesAnyPattern("Hello world", ["hello", "test"]); // true
 * textMatchesAnyPattern("withAI APP", ["chat", "ai"]); // false
 * textMatchesAnyPattern("TypeScript is great!", ["script", "java"]); // true
 * textMatchesAnyPattern("open-source", ["open"], { exactMatch: true }); // false (because options `exactMatch=true`)
 */
export const textMatchesAnyPattern = <T extends string>(
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
  const pattern = exactMatch
    ? `\\b(${validSearchWords.join("|")})\\b`
    : `(${validSearchWords.join("|")})`;

  return new RegExp(pattern, flags).test(text);
};
