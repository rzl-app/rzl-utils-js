import _isLength from "lodash/isLength";

/** ----------------------------------------
 * * ***Checks if `value` is a valid array-like length.***
 * ----------------------------------------
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * isLength(3);
 * // => true
 *
 * isLength(Number.MIN_VALUE);
 * // => false
 *
 * isLength(Infinity);
 * // => false
 *
 * isLength('3');
 * // => false
 */
export function isLength(value: unknown): boolean {
  return _isLength(value);
}
