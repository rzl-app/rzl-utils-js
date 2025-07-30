import _isSet from "lodash/isSet";

/** --------------------------------------------------
 * * ***Checks if `value` is classified as a `Set` object.***
 * --------------------------------------------------
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * isSet(new Set);
 * // => true
 *
 * isSet(new WeakSet);
 * // => false
 */
export function isSet(value: unknown): value is object {
  return _isSet(value);
}
