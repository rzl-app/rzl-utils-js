import { isNumber as _isNumber } from "lodash";
import { isNaN } from "./new";

/** ---------------------------------------------------------
 * * ***Type guard: Checks if a value is of type `number`.***
 * ---------------------------------------------------------
 *
 * Excludes `NaN` from being considered a valid number.
 *
 * @param {unknown} val - The value to check.
 * @returns {val is number} Returns `true` if the value is a number (excluding NaN), otherwise `false`.
 *
 * @example
 * isNumber(42);    // true
 * isNumber(NaN);   // false
 * isNumber("42");  // false
 */
export const isNumber = (val: unknown): val is number => {
  return _isNumber(val) && !isNaN(val);
};
