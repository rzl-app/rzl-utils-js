import { isString } from "lodash";

/**
 * -------------------------------------------------------
 * * ***Asserts that a value is of type `string`.***
 * -------------------------------------------------------
 *
 * Throws a `TypeError` if the value is not a string.
 *
 * @param {unknown} val - The value to check.
 * @param {string | ((actualType: string) => string)} [message]
 *        Optional custom error message. If a function is provided,
 *        it receives the actual type (e.g. "number") and should return a string message.
 * @returns {asserts val is string} Ensures `val` is `string` after this call.
 *
 * @throws {TypeError} If the value is not a string.
 *
 * @example
 * assertIsString("hello"); // ✅ ok
 *
 * @example
 * assertIsString(42); // ❌ throws TypeError: Expected value to be 'string', but got 'number'
 *
 * @example
 * assertIsString(42, "Must be a string!"); // ❌ throws: Must be a string!
 *
 * @example
 * assertIsString(42, (type) => `Expected string but got ${type}`); // ❌ throws: Expected string but got number
 */
export function assertIsString(
  val: unknown,
  message?: string | ((typeVal: string) => string)
): asserts val is string {
  if (!isString(val)) {
    const actualType = typeof val;
    throw new TypeError(
      typeof message === "function"
        ? message(actualType)
        : message?.trim() ||
          `Expected value to be 'string', but got '${actualType}'`
    );
  }
}
