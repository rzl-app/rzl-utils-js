import {
  isArray,
  isBoolean,
  isString,
  isNumber,
  isObject,
  isEmptyValue,
} from "@/predicates";

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
 * @param {unknown} [val] - The value to convert.
 * @param {Object} [options] - Options for conversion behavior.
 * @param {boolean} [options.caseInsensitive=true] - Whether string comparison ignores case. Default: `true`.
 * @param {boolean} [options.trimString=true] - Whether to trim whitespace before comparison. Default: `true`.
 * @returns {boolean} `true` if the value matches a truthy representation, otherwise `false`.
 *
 * @example
 * toStrictBoolean("Yes") // true
 * toStrictBoolean(" YES ", { trimString: false }) // false
 * toStrictBoolean(" YES ", { trimString: true, caseInsensitive: false }) // false
 * toStrictBoolean("yes", { caseInsensitive: false }) // false
 * toStrictBoolean("1") // true
 * toStrictBoolean(1) // true
 * toStrictBoolean(true) // true
 * toStrictBoolean("off") // false
 */
export const toStrictBoolean = (
  val?: unknown,
  options?: { caseInsensitive?: boolean; trimString?: boolean }
): boolean => {
  if (val == null) return false;

  const ci =
    options && "caseInsensitive" in options ? options.caseInsensitive : true;
  const ts = options && "trimString" in options ? options.trimString : true;

  if (!isBoolean(ci)) {
    throw new TypeError(`props 'caseInsensitive' must be \`boolean\` type!`);
  }
  if (!isBoolean(ts)) {
    throw new TypeError(`props 'trimString' must be \`boolean\` type!`);
  }

  if (isString(val)) {
    let normalized = val;
    if (ts) normalized = normalized.trim();
    if (ci) normalized = normalized.toLowerCase();
    return ["true", "on", "yes", "1", "indeterminate"].includes(normalized);
  }

  if (isNumber(val)) return val === 1;
  if (isBoolean(val)) return val;

  return false;
};

/** ---------------------------------
 * * ***Converts a given value into a boolean (loose).***
 * ---------------------------------
 *
 * This follows JavaScript's typical truthy/falsy rules with some tweaks:
 * - `null` and `undefined` return `false`.
 * - Empty strings return `false`, non-empty strings return `true`.
 * - Numbers: `0` is `false`, others `true`.
 * - Booleans returned as-is.
 * - Arrays: `[]` is `false`, non-empty is `true`.
 * - Other objects: uses `Boolean(value)`, so `{}` is `true`.
 *
 * @param {unknown} [value] - The value to be converted.
 * @returns {boolean} `true` if the value is truthy, otherwise `false`.
 *
 * @example
 * convertToBoolean(null);      // false
 * convertToBoolean("");        // false
 * convertToBoolean("abc");     // true
 * convertToBoolean(0);         // false
 * convertToBoolean(42);        // true
 * convertToBoolean([]);        // false
 * convertToBoolean([1]);       // true
 * convertToBoolean({});        // true
 * convertToBoolean({ a: 1 });  // true
 */
export const convertToBoolean = (value?: unknown): boolean => {
  if (value == null) return false;
  if (isString(value)) return value.trim().length > 0;
  if (isBoolean(value)) return value;
  if (isNumber(value)) return value !== 0;
  if (isArray(value)) return value.length > 0;
  return Boolean(value);
};

/** ---------------------------------
 * * ***Converts a given value into a boolean (strict).***
 * ---------------------------------
 *
 * This is stricter than normal JS coercion:
 * - `null` and `undefined` return `false`.
 * - Empty strings return `false`, non-empty strings return `true`.
 * - Numbers: `0` is `false`, others `true`.
 * - Booleans returned as-is.
 * - Arrays: `[]` is `false`, non-empty is `true`.
 * - Objects: `{}` is `false`, object with keys is `true`.
 *
 * @param {unknown} [value] - The value to be converted.
 * @returns {boolean} `true` if the value is considered non-empty, otherwise `false`.
 *
 * @example
 * convertToBooleanStrict(null);      // false
 * convertToBooleanStrict("");        // false
 * convertToBooleanStrict("  ");        // false
 * convertToBooleanStrict(" asd ");        // true
 * convertToBooleanStrict("abc");     // true
 * convertToBooleanStrict(0);         // false
 * convertToBooleanStrict(42);        // true
 * convertToBooleanStrict([]);        // false
 * convertToBooleanStrict([1]);       // true
 * convertToBooleanStrict({});        // false
 * convertToBooleanStrict({ a: 1 });  // true
 */
export const convertToBooleanStrict = (value?: unknown): boolean => {
  if (value == null) return false;
  if (isString(value)) return value.trim().length > 0;
  if (isBoolean(value)) return value;
  if (isNumber(value)) return value !== 0;
  if (isArray(value) || isObject(value)) {
    return !isEmptyValue(value);
  }
  return Boolean(value);
};

/** -------------------------------------------------
 * * ***Recursively checks if value is "non-empty".***
 * -------------------------------------------------
 *
 * This function does a deep inspection to determine if the input
 * contains any meaningful / non-empty value. It is stricter than
 * JavaScript's normal truthy checks because it looks *inside*
 * nested arrays & objects.
 *
 * Rules:
 * - `null` and `undefined` return `false`
 * - Empty strings `""` return `false`
 * - `0` returns `false`
 * - Empty arrays `[]` or empty objects `{}` return `false`
 * - Checks deeply nested arrays/objects — if any value inside is "non-empty", returns `true`
 *
 * @param {unknown} [value] - The value to check.
 * @returns {boolean} `true` if the value or anything nested inside is non-empty, otherwise `false`.
 *
 * @example
 * convertToBooleanStrictDeep(null);          // false
 * convertToBooleanStrictDeep("");            // false
 * convertToBooleanStrictDeep(0);             // false
 * convertToBooleanStrictDeep([]);            // false
 * convertToBooleanStrictDeep({});            // false
 * convertToBooleanStrictDeep([[], {}]);      // false
 *
 * convertToBooleanStrictDeep("abc");         // true
 * convertToBooleanStrictDeep(42);            // true
 * convertToBooleanStrictDeep([0, "", null]); // false
 * convertToBooleanStrictDeep([0, "", 5]);    // true
 * convertToBooleanStrictDeep({ a: 0 });      // false
 * convertToBooleanStrictDeep({ a: 1 });      // true
 * convertToBooleanStrictDeep({ a: { b: [] }}); // false
 * convertToBooleanStrictDeep({ a: { b: "x" }}); // true
 */
export const convertToBooleanStrictDeep = (value?: unknown): boolean => {
  if (value == null) return false;

  if (isString(value)) return value.trim().length > 0;
  if (isBoolean(value)) return value;
  if (isNumber(value)) return value !== 0;

  if (isArray(value)) {
    return value.some((item) => convertToBooleanStrictDeep(item));
  }

  if (isObject(value)) {
    return Object.values(value).some((val) => convertToBooleanStrictDeep(val));
  }

  return false;
};
