import { isArray } from "@/predicates";

/** * ----------------------------------------------------------
 * * ***Checks whether a given value is an empty array.***
 * ----------------------------------------------------------
 *
 * This utility checks if a value is an array and whether it's empty.
 * Non-array inputs are considered "empty" by default (defensive strategy).
 *
 * @param {unknown} [value] - The value to check.
 * @returns {boolean} - Returns `true` if it's not an array or an empty array.
 *
 * @example
 * isEmptyArray([]);             // true
 * isEmptyArray([1, 2, 3]);      // false
 * isEmptyArray("not an array"); // true
 * isEmptyArray(null);           // true
 * isEmptyArray(undefined);      // true
 *
 * @example
 * if (isEmptyArray(data.items)) {
 *   console.log("No items to display.");
 * }
 */
export const isEmptyArray = (value?: unknown): boolean => {
  if (!isArray(value)) return true;

  return value.length === 0;
};
