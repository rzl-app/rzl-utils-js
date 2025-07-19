import { isArguments as _isArguments } from "lodash";

/** -------------------
 * * ***Checks if `value` is likely an `arguments` object.***
 * -------------------
 *
 * @param {*} value The value to check.
 *
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 *
 * @example
 *
 * isArguments(function() { return arguments; }());
 * // => true
 *
 * isArguments([1, 2, 3]);
 * // => false
 */
export const isArguments = (value?: unknown): value is IArguments => {
  return _isArguments(value);
};
