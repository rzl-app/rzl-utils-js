/* eslint-disable @typescript-eslint/no-explicit-any */
// import type { OmitStrict } from "@/libs/types/Global";
import type { OmitStrict } from "@/types";
import { filter, includes, isEqual } from "lodash";

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
export const areObjectsEqual = <
  T1 = Record<string, any>,
  T2 = Record<string, any>
>(
  object1: T1,
  object2: T2
): boolean => {
  return isEqual(object1, object2);
};

/** ---------------------------------
 * * ***Finds duplicate values in an array.***
 * ---------------------------------
 * * This Function using `lodash` library.
 *
 * @template T The type of elements in the array.
 * @param {T[]} values - The array to check for duplicates.
 * @returns {string} A JSON-formatted string of the duplicate values.
 *
 * @example
 * findDuplicates([1, 2, 2, 3, 4, 4]); // Returns "[2,4]"
 * findDuplicates(["apple", "banana", "apple", "orange"]); // Returns "["apple"]"
 * findDuplicates([true, false, true]); // Returns "[true]"
 */
export const findDuplicates = <T>(values: T[]): string => {
  // Find duplicates
  const duplicates = filter(values, (value, index, iteratee) =>
    includes(iteratee, value, index + 1)
  );

  // Convert to JSON string for consistency
  return JSON.stringify([...new Set(duplicates)]);
};

/** --------------------------------
 * * ***Creates a new object excluding specified keys.***
 * --------------------------------
 * * This Function using `lodash` library.
 *
 * @template I The type of the input object.
 * @template K The keys to omit from the object.
 * @param {I} object - The original object.
 * @param {K[]} keysToOmit - Array of keys to be omitted.
 * @returns {Omit<I, K>} A new object without the specified keys.
 *
 * @throws {Error} If duplicate keys are found in `keysToOmit`.
 *
 * @example
 * omitKeys({ a: 1, b: 2, c: 3 }, ["b", "c"]); // Returns { a: 1 }
 * omitKeys({ name: "John", age: 30 }, ["age"]); // Returns { name: "John" }
 */
export const omitKeys = <I extends Record<string, any>, K extends keyof I>(
  object: I,
  keysToOmit: K[]
): Omit<I, K> => {
  if (!object || typeof object !== "object") return {} as Omit<I, K>;

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

/**
 * * Removes Property from PROPS Collection
 * --------------------------------
 * @description Becarefull put array in arrayException, If array is duplicated it will be throw an exception error
 * @param object is Record as object (string,any)
 * @param arrayExcept is Array exception []
 * @returns
 *
 * @deprecated - Use `omitKeys` instead.
 */
export const omitProps = <I extends Record<string, any>, S extends (keyof I)[]>(
  object: I,
  arrayExcept: S
) => {
  if (
    findDuplicates(arrayExcept) &&
    findDuplicates(arrayExcept).slice(1, -1).length > 0
  ) {
    throw new Error(
      `Function omitProps Error, cause Duplicate of arrayExcept: ${String(
        findDuplicates(arrayExcept)
      )}`
    );
  }

  if (object) {
    const filteredEntries = Object.entries(object).filter(
      ([key]) => !arrayExcept.includes(key)
    );
    return Object.fromEntries(filteredEntries) as OmitStrict<I, S[number]>;
  }

  return;
};
