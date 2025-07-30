/* eslint-disable @typescript-eslint/no-explicit-any */
import _isNative from "lodash/isNative";

/** ----------------------------------------------------
 * * ***Checks if `value` is a pristine native function.***
 * ----------------------------------------------------
 *
 * **Note:** This method can't reliably detect native functions in the presence
 * of the core-js package because core-js circumvents this kind of detection.
 * Despite multiple requests, the core-js maintainer has made it clear: any
 * attempt to fix the detection will be obstructed. As a result, we're left
 * with little choice but to throw an error. Unfortunately, this also affects
 * packages, like [babel-polyfill](https://www.npmjs.com/package/babel-polyfill),
 * which rely on core-js.
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 * @example
 *
 * isNative(Array.prototype.push);
 * // => true
 *
 * import * as RzlUtilsJs from "rzl-utils-js";
 * isNative(RzlUtilsJs);
 * // => false
 */
export function isNative(value?: unknown): value is (...args: any[]) => any {
  return _isNative(value);
}
