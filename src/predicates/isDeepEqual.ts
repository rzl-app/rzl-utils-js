import { isObjectOrArray } from "..";
import { isArray } from "./isArray";
import { isDate } from "./isDate";
import { isRegExp } from "./isRegExp";
import { isSymbol } from "./isSymbol";

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
  if (isDate(a) && isDate(b)) {
    return a.getTime() === b.getTime();
  }
  if (isRegExp(a) && isRegExp(b)) {
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

  if (isSymbol(a) && isSymbol(b)) {
    return a.toString() === b.toString();
  }

  if (a === b) return true;
  if (typeof a !== typeof b) return false;

  if (isArray(a) && isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => isDeepEqual(v, b[i]));
  }

  if (isObjectOrArray(a) && isObjectOrArray(b) && a && b) {
    if (isArray(a) !== isArray(b)) {
      return false;
    }
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
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
