/** --------------------------------------------------
 * * ***Type utility to define the output type while maintaining structure.***
 * --------------------------------------------------
 * - Converts strings and numbers to `number`.
 * - Removes `null`, `undefined`, and non-numeric values.
 * - Supports deeply nested structures.
 * - Keeps empty arrays and objects unless `removeEmptyObjects` or `removeEmptyArrays` is enabled.
 */
type ConvertedDeepNumbers<
  T,
  RemoveEmptyObjects extends boolean,
  RemoveEmptyArrays extends boolean
> = T extends null | undefined
  ? never // Removes null & undefined
  : T extends number | `${number}`
  ? number // Convert valid numbers
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends any[]
  ? ConvertedDeepNumbers<T[number], RemoveEmptyObjects, RemoveEmptyArrays>[] // Maintain array structure
  : T extends Record<string, unknown>
  ? {
      [K in keyof T]: ConvertedDeepNumbers<
        T[K],
        RemoveEmptyObjects,
        RemoveEmptyArrays
      >;
    } extends infer O
    ? RemoveEmptyObjects extends true
      ? keyof O extends never
        ? never // Remove empty object if flag is enabled
        : O
      : O
    : never
  : never; // Remove unsupported types

/** --------------------------------------------------
 * * ***Converts deeply nested arrays or objects into numbers while preserving structure.***
 * --------------------------------------------------
 *
 * Features:
 * - ✅ Removes `null`, `undefined`, NaN, Infinity, and non-numeric values.
 * - 🔄 Recursively processes nested objects and arrays.
 * - 🔢 Converts valid numbers, including decimals (e.g. `"3.5"` → `3.5`).
 * - 🧹 Can remove empty objects `{}` or arrays `[]` based on flags.
 *
 * @template T - The input data type (Array, Object, etc)
 * @template RemoveEmptyObjects - Whether to remove empty objects
 * @template RemoveEmptyArrays - Whether to remove empty arrays
 *
 * @param {T} input - The data to convert
 * @param {boolean} [removeEmptyObjects=false] - Remove empty objects `{}` if `true`
 * @param {boolean} [removeEmptyArrays=false] - Remove empty arrays `[]` if `true`
 *
 * @returns {ConvertedDeepNumbers<T, RemoveEmptyObjects, RemoveEmptyArrays> | undefined}
 *          The transformed data, or `undefined` if entirely empty after processing.
 *
 * @example
 * deepNumbers("123") // → 123
 * deepNumbers("12.34") // → 12.34
 * deepNumbers("not number") // → undefined
 *
 * @example
 * deepNumbers([NaN, Infinity, -Infinity, "10"])
 * // → [10]
 *
 * @example
 * deepNumbers({ a: {}, b: [] }, false, false)
 * // → { a: {}, b: [] }
 *
 * @example
 * deepNumbers({ a: {}, b: [] }, true, false)
 * // → { b: [] }
 *
 * @example
 * deepNumbers({ a: {}, b: [] }, false, true)
 * // → { a: {} }
 *
 * @example
 * deepNumbers({ a: {}, b: [], c: { d: null } }, true, true)
 * // → {}
 *
 * @example
 * deepNumbers({
 *   a: "1",
 *   b: {
 *     c: "not num",
 *     d: ["2", "3.5", null, { e: "4.4", f: "invalid" }],
 *   },
 *   g: [],
 * })
 * // → { a: 1, b: { d: [2, 3.5, { e: 4.4 }] }, g: [] }
 *
 * @example
 * deepNumbers({ x: {}, y: [], z: [{ a: {}, b: [] }] }, false, true)
 * // → { x: {}, z: [{ a: {} }] }
 *
 * @example
 * deepNumbers({ x: {}, y: [], z: [{ a: {}, b: [] }] }, true, false)
 * // → { y: [], z: [{ b: [] }] }
 *
 * @example
 * deepNumbers({
 *   x: {},
 *   y: [],
 *   z: [{ a: {}, b: [], c: "3" }, { d: "4.5" }]
 * }, true, true)
 * // → { z: [{ c: 3 }, { d: 4.5 }] }
 *
 * @example
 * deepNumbers([[[[[["1"]]], null]], "2", "abc"], false, true)
 * // → [[[[[[1]]]]], 2]
 *
 * @example
 * deepNumbers(["1", {}, [], ["2", {}, []]], true, true)
 * // → [1, [2]]
 *
 * @example
 * deepNumbers(["1", () => {}, Symbol("wow"), "2"])
 * // → [1, 2]
 *
 * @example
 * deepNumbers({ a: { b: {} } }, false, true)
 * // → { a: { b: {} } }
 *
 * @example
 * deepNumbers(["1", { a: {} }], true)
 * // → [1]
 *
 * @example
 * deepNumbers(["1", { a: {} }], false)
 * // → [1, { a: {} }]
 *
 * @example
 * deepNumbers(["1", [], { a: [] }], false, false)
 * // → [1, [], { a: [] }]
 */
export const deepNumbers = <
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  T extends unknown,
  RemoveEmptyObjects extends boolean = false,
  RemoveEmptyArrays extends boolean = false
>(
  input: T,
  removeEmptyObjects: RemoveEmptyObjects = false as RemoveEmptyObjects,
  removeEmptyArrays: RemoveEmptyArrays = false as RemoveEmptyArrays
):
  | ConvertedDeepNumbers<T, RemoveEmptyObjects, RemoveEmptyArrays>
  | undefined => {
  function _deepNumbersInternal<
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
    T extends unknown,
    RemoveEmptyObjects extends boolean,
    RemoveEmptyArrays extends boolean
  >(
    input: T,
    removeEmptyObjects: RemoveEmptyObjects,
    removeEmptyArrays: RemoveEmptyArrays,
    isRoot: boolean
  ):
    | ConvertedDeepNumbers<T, RemoveEmptyObjects, RemoveEmptyArrays>
    | undefined {
    if (input === null || input === undefined) return undefined;

    if (
      typeof removeEmptyObjects !== "boolean" ||
      typeof removeEmptyArrays !== "boolean"
    ) {
      throw new TypeError(
        `props 'removeEmptyObjects' and 'removeEmptyArrays' must be \`boolean\` type!`
      );
    }

    if (
      typeof input === "number" ||
      (typeof input === "string" && !isNaN(Number(input)))
    ) {
      const num = Number(input);
      return (Number.isFinite(num) ? num : undefined) as ConvertedDeepNumbers<
        T,
        RemoveEmptyObjects,
        RemoveEmptyArrays
      >;
    }

    if (Array.isArray(input)) {
      const newArray = input
        .map((item) =>
          _deepNumbersInternal(
            item,
            removeEmptyObjects,
            removeEmptyArrays,
            false
          )
        )
        .filter((item) => item !== undefined);

      if (removeEmptyArrays && newArray.length === 0) return undefined;

      return newArray as ConvertedDeepNumbers<
        T,
        RemoveEmptyObjects,
        RemoveEmptyArrays
      >;
    }

    if (typeof input === "object") {
      const newObject: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(input)) {
        const convertedValue = _deepNumbersInternal(
          value,
          removeEmptyObjects,
          removeEmptyArrays,
          false
        );
        if (convertedValue !== undefined) {
          newObject[key] = convertedValue;
        }
      }

      if (removeEmptyObjects && Object.keys(newObject).length === 0) {
        return isRoot
          ? ({} as ConvertedDeepNumbers<
              T,
              RemoveEmptyObjects,
              RemoveEmptyArrays
            >)
          : undefined;
      }

      return newObject as ConvertedDeepNumbers<
        T,
        RemoveEmptyObjects,
        RemoveEmptyArrays
      >;
    }

    return undefined;
  }

  return _deepNumbersInternal(
    input,
    removeEmptyObjects,
    removeEmptyArrays,
    true
  );
};
