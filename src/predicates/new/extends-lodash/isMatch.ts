import _isMatch from "lodash/isMatch";

/** ----------------------------------------------------
 * * ***Performs a partial deep comparison between `object` and `source` to determine if `object` contains equivalent property values.***
 * ----------------------------------------------------
 *
 * **Note:** This method is equivalent to `matches` when `source` is
 * partially applied.
 *
 * Partial comparisons will match empty array and empty object `source`
 * values against any array or object value, respectively. See `isEqual`
 * for a list of supported value comparisons.
 *
 *
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 *
 * isMatch(object, { 'b': 2 });
 * // => true
 *
 * isMatch(object, { 'b': 1 });
 * // => false
 */
export function isMatch(object: object, source: object): boolean {
  return _isMatch(object, source);
}
