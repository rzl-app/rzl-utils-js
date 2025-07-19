import { isFinite as _isFinite } from "lodash";

/** ----------------------------------------------------
 * * ***Checks if `value` is a finite primitive number.***
 * ----------------------------------------------------
 *
 * **Note:** This method is based on
 * [`Number.isFinite`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite).
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
 * @example
 *
 * isFinite(3);
 * // => true
 *
 * isFinite(Number.MIN_VALUE);
 * // => true
 *
 * isFinite(Infinity);
 * // => false
 *
 * isFinite('3');
 * // => false
 */
export function isFinite(value?: unknown): boolean {
  return _isFinite(value);
}
