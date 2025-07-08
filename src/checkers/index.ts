import { safeStableStringify } from "../converts/stringify";

/** ----------------------------------------------------------
 * * ***Checks if the given `text` contains all of the specified `searchWords`.***
 * ----------------------------------------------------------
 *
 * - Uses **regular expressions** for flexible pattern matching.
 * - **Escapes special characters** to prevent regex injection attacks.
 * - **Trims input** to avoid false positives with empty spaces.
 * - **Supports exact word matching** (optional).
 *
 * @param {string} text - The text to search within.
 * @param {string[]} searchWords - An array of words/phrases to match against the text.
 * @param {boolean} [exactMatch=false] - If `true`, matches whole words only, defaultValue is `false`.
 * @param {string} [flags="i"] - Optional regex flags (default: `"i"` for case-insensitive).
 * @returns {boolean} - `true` if all `searchWords` are found in `text`, otherwise `false`.
 *
 * @example
 * textMatchesAllPatterns("Hello world, WithAI APP", ["Hello", "world"]); // true
 * textMatchesAllPatterns("JavaScript and TypeScript", ["Java", "Script"]); // true
 * textMatchesAllPatterns("Machine Learning", ["AI", "Learning"]); // false
 * textMatchesAllPatterns("open-source", ["open"], true); // false (because exactMatch=true)
 */
export const textMatchesAllPatterns = <T extends string>(
  text: T,
  searchWords: T[] | string[],
  exactMatch: boolean = false,
  flags: string = "i"
): boolean => {
  if (typeof text !== "string" || !text.trim() || !Array.isArray(searchWords)) {
    return false;
  }

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
 * - Uses **regular expressions** for flexible pattern matching.
 * - **Escapes special characters** to prevent regex injection attacks.
 * - **Trims input** to avoid false positives with empty spaces.
 * - **Supports exact word matching** (optional).
 *
 * @param {string} text - The text to search within.
 * @param {string[]} searchWords - An array of words/phrases to match against the text.
 * @param {boolean} [exactMatch=false] - If `true`, matches whole words only, defaultValue is `false`.
 * @param {string} [flags="i"] - Optional regex flags (default: `"i"` for case-insensitive).
 * @returns {boolean} - `true` if at least one `searchWord` is found in `text`, otherwise `false`.
 *
 * @example
 * textMatchesAnyPattern("Hello world", ["hello", "test"]); // true
 * textMatchesAnyPattern("withAI APP", ["chat", "ai"]); // false
 * textMatchesAnyPattern("TypeScript is great!", ["script", "java"]); // true
 * textMatchesAnyPattern("open-source", ["open"], true); // false (because `exactMatch=true`)
 */
export const textMatchesAnyPattern = <T extends string>(
  text: T,
  searchWords: T[] | string[],
  exactMatch: boolean = false,
  flags: string = "i"
): boolean => {
  if (typeof text !== "string" || !text.trim() || !Array.isArray(searchWords)) {
    return false;
  }

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

/** ----------------------------------------------------------
 * * ***Checks if a given value is an empty object (`{}`), empty array (`[]`), or falsy.***
 * ----------------------------------------------------------
 *
 * - Returns `true` for `{}`, `[]`, `null`, `undefined`, and other falsy values.
 * - Returns `false` for objects with properties, non-empty arrays, and other non-empty values.
 * - Ensures safe handling of `null`, `undefined`, and unexpected types.
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} - `true` if the value is an empty object, empty array, or falsy, otherwise `false`.
 *
 * @example
 * isEmptyObject({}); // true
 * isEmptyObject([]); // true
 * isEmptyObject({ key: "value" }); // false
 * isEmptyObject([1, 2, 3]); // false
 * isEmptyObject(null); // true
 * isEmptyObject(undefined); // true
 * isEmptyObject(0); // false (because 0 is not an object)
 */
export const isEmptyObject = (value: unknown): boolean => {
  if (!value) return true; // Handle null, undefined, false, "", 0, NaN

  if (Array.isArray(value)) return value.length === 0; // Check if array is empty

  if (typeof value === "object") {
    return (
      Object.keys(value).length === 0 &&
      Object.getOwnPropertySymbols(value).length === 0
    );
  }

  return false; // Numbers, booleans, functions, etc. are not "objects"
};

/**
 * ----------------------------------------------------------
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

/**
 * ----------------------------------------------------------
 * * ***Checks if the given value is an array.***
 * ----------------------------------------------------------
 *
 * - ✅ Uses `Array.isArray()` for reliable and safe type checking.
 * - ✅ Supports TypeScript **type narrowing** using `value is Array<T>`.
 * - ✅ Handles edge cases like `null`, `undefined`, and non-array objects.
 *
 * @template T - The expected type of array elements.
 * @param {unknown} value - The value to check.
 * @returns {value is Array<T>} Returns `true` if the value is an array, otherwise `false`.
 *
 * @example
 * isArray([1, 2, 3]); // true
 * isArray([]); // true
 * isArray("hello"); // false
 * isArray({ key: "value" }); // false
 * isArray(null); // false
 * isArray(undefined); // false
 */
export function isArray<T>(value: unknown): value is Array<T> {
  return Array.isArray(value);
}

/**
 * ----------------------------------------------------------
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

  if (Array.isArray(obj)) {
    return obj.some((item) => doesKeyExist(item, key)); // Check each array item recursively
  }

  return Object.values(obj).some(
    (value) => typeof value === "object" && doesKeyExist(value, key)
  );
};

/** ----------------------------------------------------------
 * * ***Checks if a given value is an instance of the `Error` object.***
 * ----------------------------------------------------------
 *
 * - This function helps ensure that the provided value is a valid JavaScript error.
 * - Useful for error handling in TypeScript.
 *
 * @param {unknown} error - The value to check.
 * @returns {boolean} - Returns `true` if the value is an `Error`, otherwise `false`.
 *
 * @example
 * isInstanceOfError(new Error("Something went wrong")); // true
 * isInstanceOfError("Error message"); // false
 * isInstanceOfError(null); // false
 */
export const isInstanceOfError = (error: unknown): error is Error => {
  return error instanceof Error;
};

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
