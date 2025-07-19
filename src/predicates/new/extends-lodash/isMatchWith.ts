import { isMatchWith as _isMatchWith, isMatchWithCustomizer } from "lodash";

/** ----------------------------------------------------
 * * ***This method is like `isMatch` except that it accepts `customizer` which
 * is invoked to compare values. If `customizer` returns `undefined` comparisons
 * are handled by the method instead. The `customizer` is invoked with three
 * arguments: (objValue, srcValue, index|key, object, source).***
 * ----------------------------------------------------
 *
 *
 * @category Lang
 * @param object The object to inspect.
 * @param source The object of property values to match.
 * @param [customizer] The function to customize comparisons.
 * @returns Returns `true` if `object` is a match, else `false`.
 * @example
 *
 * function isGreeting(value) {
 *   return /^h(?:i|ello)$/.test(value);
 * }
 *
 * function customizer(objValue, srcValue) {
 *   if (isGreeting(objValue) && isGreeting(srcValue)) {
 *     return true;
 *   }
 * }
 *
 * var object = { 'greeting': 'hello' };
 * var source = { 'greeting': 'hi' };
 *
 * isMatchWith(object, source, customizer);
 * // => true
 */
export function isMatchWith(
  value: object,
  other: object,
  customizer: isMatchWithCustomizer
): boolean {
  return _isMatchWith(value, other, customizer);
}
