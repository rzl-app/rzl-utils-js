import { isObject as _isObject } from "lodash";

/** --------------------------------------------------
 * * ***Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)***
 * --------------------------------------------------
 *
 * @note
 * ⚠ **For More Strict Object Use `isObject` instead.**
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * isObject({});
 * // => true
 *
 * isObject([1, 2, 3]);
 * // => true
 *
 * isObject(noop);
 * // => true
 *
 * isObject(null);
 * // => false
 */
export function isObjectLoose(value: unknown): value is object {
  return _isObject(value);
}
