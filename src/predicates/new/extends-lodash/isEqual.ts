import _isEqual from "lodash/isEqual";

/** ----------------------------------------------------
 * * ***Performs a deep comparison between two values to determine if they are equivalent.***
 * ----------------------------------------------------
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are **not** supported.
 *
 *
 * @param value The value to compare.
 * @param other The other value to compare.
 * @returns Returns `true` if the values are equivalent, else `false`.
 *
 * @example
 *
 * var object = { 'user': 'fred' };
 * var other = { 'user': 'fred' };
 *
 * isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
export function isEqual(value: unknown, other: unknown): boolean {
  return _isEqual(value, other);
}
