import { findDuplicates, isArray } from "@/index";

/** --------------------------------
 * * ***Creates a new object excluding specified keys.***
 * --------------------------------
 * This function creates a shallow copy of the given object
 * omitting the specified keys. It will return a new object
 * without mutating the original.
 *
 * It also validates that `keysToOmit` does not contain duplicate keys.
 *
 * Internally, it uses `isEqual` to check for duplicates in the `keysToOmit` array.
 *
 * @template I The type of the input object.
 * @template K The keys to omit from the object.
 * @param {I} object - The source object to omit keys from.
 * @param {K[]} keysToOmit - An array of keys to exclude from the returned object.
 * @returns {Omit<I, K>} A new object without the specified keys.
 *
 * @throws {TypeError} If `keysToOmit` is not an array.
 * @throws {Error} If duplicate keys are found in `keysToOmit`.
 *
 * @example
 * omitKeys({ a: 1, b: 2, c: 3 }, ["b", "c"]);
 * // => { a: 1 }
 *
 * @example
 * omitKeys({ name: "John", age: 30 }, ["age"]);
 * // => { name: "John" }
 *
 * @example
 * omitKeys({ a: 1, b: 2 }, []);
 * // => { a: 1, b: 2 } (no changes)
 */
export const omitKeys = <I extends Record<string, unknown>, K extends keyof I>(
  object: I,
  keysToOmit: K[]
): Omit<I, K> => {
  if (!object || typeof object !== "object") return {} as Omit<I, K>;

  if (!isArray(keysToOmit)) {
    throw new TypeError("Expected 'keysToOmit' to be a 'array' type");
  }

  // Check for duplicate keys
  const duplicates = findDuplicates(keysToOmit);
  if (duplicates.length > 0) {
    throw new Error(
      `Function "omitKeys" Error: Duplicate keys detected - ${duplicates}`
    );
  }

  // Remove specified keys
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !keysToOmit.includes(key as K))
  ) as Omit<I, K>;
};
