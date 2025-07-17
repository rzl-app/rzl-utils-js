import { isBoolean, isNull, isNumber, isString, isUndefined } from "@/index";

/** ---------------------------------
 * * ***Converts a value into a strict boolean.***
 * ---------------------------------
 *
 * This function checks if the input is a valid representation of `true`
 * (e.g., `"true"`, `"on"`, `"yes"`, `"1"`, `1`, `true`, `"indeterminate"`).
 * Any other value, including `undefined` and `null`, will return `false`.
 *
 * Supports optional `caseInsensitive` and `trimString` to customize string normalization.
 *
 * @param {unknown} [value] - The value to convert.
 * @param {Object} [options] - Options for conversion behavior.
 * @param {boolean} [options.caseInsensitive=true] - Whether string comparison ignores case. Default: `true`.
 * @param {boolean} [options.trimString=true] - Whether to trim whitespace before comparison. Default: `true`.
 * @returns {boolean} `true` if the value matches a truthy representation, otherwise `false`.
 *
 * @example
 * toBooleanExplicit("Yes") // true
 * toBooleanExplicit(" YES ", { trimString: false }) // false
 * toBooleanExplicit(" YES ", { trimString: true, caseInsensitive: false }) // false
 * toBooleanExplicit("yes", { caseInsensitive: false }) // false
 * toBooleanExplicit("1") // true
 * toBooleanExplicit(1) // true
 * toBooleanExplicit(true) // true
 * toBooleanExplicit("off") // false
 */
export const toBooleanExplicit = (
  value?: unknown,
  options?: { caseInsensitive?: boolean; trimString?: boolean }
): boolean => {
  if (isNull(value) || isUndefined(value)) return false;

  const ci =
    options && "caseInsensitive" in options ? options.caseInsensitive : true;
  const ts = options && "trimString" in options ? options.trimString : true;

  if (!isBoolean(ci)) {
    throw new TypeError(`props 'caseInsensitive' must be \`boolean\` type!`);
  }
  if (!isBoolean(ts)) {
    throw new TypeError(`props 'trimString' must be \`boolean\` type!`);
  }

  if (isString(value)) {
    let normalized = value;
    if (ts) normalized = normalized.trim();
    if (ci) normalized = normalized.toLowerCase();
    return ["true", "on", "yes", "1", "indeterminate"].includes(normalized);
  }

  if (isNumber(value)) return value === 1;
  if (isBoolean(value)) return value;

  return false;
};
