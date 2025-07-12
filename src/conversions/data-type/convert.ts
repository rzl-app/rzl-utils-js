/* eslint-disable @typescript-eslint/no-explicit-any */

/** ----------------------------------------------------------
 * * ***Converts a value from a string to its natural JavaScript type.***
 * ----------------------------------------------------------
 *
 * ✅ Supported conversions:
 * - `"true"`      → `true`
 * - `"false"`     → `false`
 * - `"null"`      → `null`
 * - `"undefined"` → `undefined`
 * - `"42"`        → `42` (number)
 * - `"3.14"`      → `3.14` (number)
 * - `"   "`       → `""` (trimmed)
 * - Other strings are returned trimmed & lowercased.
 * - Non-string inputs are returned unchanged.
 *
 * @example
 * convertType("true")       // → true
 * convertType(" 42 ")       // → 42
 * convertType("FALSE")      // → false
 * convertType(" null ")     // → null
 * convertType("   ")        // → ""
 * convertType(100)          // → 100
 * convertType({})           // → {}
 *
 * @param {any} value - The value to convert (usually string or unknown type).
 * @returns {any} The converted JavaScript type (boolean, number, null, undefined, or original).
 */
export const convertType = (value: any): any => {
  const predefinedValues: Record<string, any> = {
    undefined: undefined,
    null: null,
    true: true,
    false: false,
    yes: true,
    no: false,
  };

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (Object.prototype.hasOwnProperty.call(predefinedValues, normalized)) {
      return predefinedValues[normalized];
    }

    if (!isNaN(Number(normalized)) && normalized !== "") {
      return Number(normalized);
    }

    return normalized;
  }

  return value;
};
