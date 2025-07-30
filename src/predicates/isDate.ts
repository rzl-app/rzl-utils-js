import _isDate from "lodash/isDate";

/** ----------------------------------------------------------
 * * ***Type guard: Checks if a value is a valid `Date` object.***
 * ----------------------------------------------------------
 *
 * - ✅ Checks if value is an instance of `Date`
 * - ✅ Ensures the date is valid (`!isNaN(date.getTime())`)
 * - ❗ Returns false for strings or invalid date objects
 *
 * @param value - The value to check.
 * @returns {value is Date} - `true` if value is a valid Date object.
 *
 * @example
 * isDate(new Date()); // true
 * isDate(new Date("invalid")); // false
 * isDate("2024-01-01"); // false
 */
export const isDate = (value: unknown): value is Date => {
  return _isDate(value) && !isNaN(value.getTime());
};
