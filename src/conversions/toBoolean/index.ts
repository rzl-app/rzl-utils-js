/** ---------------------------------
 * * ***Converts a value into a strict boolean.***
 * ---------------------------------
 *
 * This function checks if the input is a valid representation of `true`
 * (e.g., `"true"`, `"on"`, `"yes"`, `"1"`, `1`, `true`, `"indeterminate"`).
 * Any other value, including `undefined` and `null`, will return `false`.
 *
 * @template T - The input type.
 * @param {T} [val] - The value to convert.
 * @returns {boolean} `true` if the value matches a truthy representation, otherwise `false`.
 */
export const toStrictBoolean = <T>(val?: T): boolean => {
  // Handle undefined, null, and other falsy values early
  if (val === null) return false;

  if (typeof val === "string") {
    const normalized = val.toLowerCase().trim();
    return ["true", "on", "yes", "1", "indeterminate"].includes(normalized);
  }

  if (typeof val === "number") {
    return val === 1;
  }

  if (typeof val === "boolean") {
    return val;
  }

  return false;
};

/** ---------------------------------
 * * ***Converts a given value into a boolean.***
 * ---------------------------------
 *
 * - `null` and `undefined` return `false`.
 * - Empty strings return `false`, non-empty strings return `true`.
 * - Numbers follow JavaScript's truthy/falsy rules (`0` is `false`, nonzero numbers are `true`).
 * - Boolean values are returned as-is.
 * - Arrays return `true` if they contain elements, otherwise `false`.
 *
 * @template T - The input type.
 * @param {T} [value] - The value to be converted.
 * @returns {boolean} `true` if the value is truthy, otherwise `false`.
 */
export const convertToBoolean = <T>(value?: T): boolean => {
  if (value == null) return false; // handles null & undefined

  if (typeof value === "string") {
    return value.trim().length > 0; // Empty string is false
  }

  if (typeof value === "boolean") return value; // Return boolean as is

  if (typeof value === "number") return value !== 0; // 0 is false, others are true

  if (Array.isArray(value)) return value.length > 0; // Empty array is false

  return Boolean(value); // Fallback for other types (e.g., objects)
};
