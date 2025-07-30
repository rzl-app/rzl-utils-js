import _isElement from "lodash/isElement";

/** ----------------------------------------------------
 * * ***Checks if `value` is likely a DOM element.***
 * ----------------------------------------------------
 *
 * @param {*} value The value to check.
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
 * @example
 *
 * isElement(document.body);
 * // => true
 *
 * isElement('<body>');
 * // => false
 */
export function isElement(value?: unknown): boolean {
  return _isElement(value);
}
