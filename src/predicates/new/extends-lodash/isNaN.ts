import _isNaN from "lodash/isNaN";

/** ----------------------------------------------------
 * * ***Checks if `value` is `NaN`.***
 * ----------------------------------------------------
 *
 * **Note:** This method is based on
 * [`Number.isNaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN) and is not the same as
 * global [`isNaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN) which returns `true` for
 * `undefined` and other non-number values.
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 * @example
 *
 * import * as RzlUtilsJs from "rzl-utils-js";
 *
 * RzlUtilsJs.isNaN(NaN); // => true
 *
 * RzlUtilsJs.isNaN(new Number(NaN)); // => true
 *
 * RzlUtilsJs.isNaN(undefined); // => false
 *
 * // This global isNaN:
 * isNaN(undefined); // => true
 */
export function isNaN(value?: unknown): boolean {
  return _isNaN(value);
}
