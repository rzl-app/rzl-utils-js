/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ----------------------------------------------------------
 * * ***Type guard: Checks if a value is a function.***
 * ----------------------------------------------------------
 *
 * - ✅ Uses `typeof value === "function"` for strict type checking.
 * - ✅ Supports TypeScript type narrowing with `value is (...args: any[]) => any`.
 * - ✅ Safe alternative to `Function` type (doesn't trigger ESLint warning).
 *
 * @param value - The value to check.
 * @returns {value is (...args: any[]) => any} - `true` if the value is a function.
 *
 * @example
 * isFunction(() => {}); // true
 * isFunction(async () => {}); // true
 * isFunction(null); // false
 * isFunction({}); // false
 */
export const isFunction = (
  value: unknown
): value is (...args: any[]) => any => {
  return typeof value === "function";
};
