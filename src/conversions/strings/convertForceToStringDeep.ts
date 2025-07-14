/** ----------------------------------------------------------
 * * ***Recursively converts a value to a string based on the `forceToString` option.***
 * ----------------------------------------------------------
 *
 * - `"stringOrNumber"`: Converts strings and numbers to strings.
 * - `"primitives"`: Converts all primitives (number, string, boolean, bigint, undefined, NaN) to strings.
 * - `"all"`: Converts everything, including symbols, functions, Dates, RegExp, Maps, Sets, Errors, Promises,
 *   and deeply all object properties, to strings.
 * - `false` (default): Leaves everything unchanged.
 *
 * Special behaviors:
 * - `NaN` becomes `"NaN"` only with `"primitives"` or `"all"`.
 * - `Date` becomes ISO string only with `"all"`.
 * - `RegExp` becomes regex literal string only with `"all"`.
 * - `Symbol` becomes `Symbol(...)` string only with `"all"`.
 * - `Map`, `Set`, `Error`, `Promise` become `"[object ...]"` only with `"all"`.
 * - Functions become their source `toString()` only with `"all"`.
 *
 * @param {unknown} value - The value to process. Can be anything: primitive, array, object, function, etc.
 * @param {false | "stringOrNumber" | "primitives" | "all"} forceToString - The mode of string conversion.
 * @returns {unknown} A new value with the conversion applied based on `forceToString`.
 *
 * @example
 * convertForceToStringDeep(42, "stringOrNumber");
 * // => "42"
 *
 * @example
 * convertForceToStringDeep(true, "primitives");
 * // => "true"
 *
 * @example
 * convertForceToStringDeep(Symbol("x"), "all");
 * // => "Symbol(x)"
 *
 * @example
 * convertForceToStringDeep({ a: 1, b: [2, NaN] }, "primitives");
 * // => { a: "1", b: ["2", "NaN"] }
 *
 * @example
 * convertForceToStringDeep(new Date("2025-01-01"), "all");
 * // => "2025-01-01T00:00:00.000Z"
 *
 * @example
 * convertForceToStringDeep(() => 1, "all");
 * // => "() => 1"
 *
 * @example
 * convertForceToStringDeep([1, "a", { b: 2 }], false);
 * // => [1, "a", { b: 2 }]
 */
export const convertForceToStringDeep = (
  value: unknown,
  forceToString: false | "stringOrNumber" | "primitives" | "all"
): unknown => {
  // NaN special
  if (typeof value === "number" && Number.isNaN(value)) {
    return forceToString === "primitives" || forceToString === "all"
      ? "NaN"
      : NaN;
  }

  // string or number
  if (typeof value === "string" || typeof value === "number") {
    return forceToString === "stringOrNumber" ||
      forceToString === "primitives" ||
      forceToString === "all"
      ? String(value)
      : value;
  }

  // other primitives
  if (
    typeof value === "boolean" ||
    typeof value === "bigint" ||
    typeof value === "undefined"
  ) {
    return forceToString === "primitives" || forceToString === "all"
      ? String(value)
      : value;
  }

  // symbol
  if (typeof value === "symbol") {
    return forceToString === "all" ? value.toString() : value;
  }

  // function: only convert on "all"
  if (typeof value === "function") {
    return forceToString === "all" ? value.toString() : value;
  }

  // array
  if (Array.isArray(value)) {
    return value.map((v) => convertForceToStringDeep(v, forceToString));
  }

  // objects
  if (typeof value === "object" && value !== null) {
    if (value instanceof Date) {
      return forceToString === "all" ? value.toISOString() : value;
    }
    if (value instanceof RegExp) {
      return forceToString === "all" ? value.toString() : value;
    }
    if (
      value instanceof Map ||
      value instanceof Set ||
      value instanceof Error ||
      value instanceof Promise
    ) {
      return forceToString === "all" ? String(value) : value;
    }
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value)) {
      result[key] = convertForceToStringDeep(
        (value as Record<string, unknown>)[key],
        forceToString
      );
    }
    return result;
  }

  return value;
};
