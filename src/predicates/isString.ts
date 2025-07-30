import _isString from "lodash/isString";

/** ---------------------------------------------------------
 * * ***Type guard: Checks if a value is of type `string`.***
 * ---------------------------------------------------------
 *
 * This function is a type guard that determines if the provided value
 * is a `string`. It can be used to narrow types in TypeScript.
 *
 * @param {unknown} val - The value to check.
 * @returns {val is string} `true` if the value is a string, otherwise `false`.
 *
 * @example
 * isString("hello"); // true
 * isString(123);     // false
 *
 * // Usage in type narrowing
 * const value: unknown = getValue();
 * if (isString(value)) {
 *   // TypeScript now knows `value` is a string
 *   console.log(value.toUpperCase());
 * }
 */
export const isString = (val: unknown): val is string => {
  return _isString(val);
};
