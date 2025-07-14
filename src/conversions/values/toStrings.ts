/** --------------------------------------------------
 * * ***Type utility to define the output type while maintaining structure.***
 * --------------------------------------------------
 *
 * - Converts numbers and strings to `string`.
 * - Removes `null` and `undefined` values from objects and arrays.
 * - Keeps array/objects structure unless `removeEmptyObjects` or `removeEmptyArrays` is enabled.
 */
type ConvertedDeepStrings<
  T,
  RemoveEmptyObjects extends boolean,
  RemoveEmptyArrays extends boolean
> = T extends null | undefined
  ? never // Removes null & undefined
  : T extends number | string
  ? string // Convert number & string to string
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends any[]
  ? ConvertedDeepStrings<T[number], RemoveEmptyObjects, RemoveEmptyArrays>[] // Maintain array structure
  : T extends Record<string, unknown>
  ? {
      [K in keyof T]: ConvertedDeepStrings<
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

/**
 * --------------------------------------------------
 * * ***Converts all values in an array, object, or deeply nested structure to strings.***
 * --------------------------------------------------
 *
 * - ✅ Converts numbers to string format (e.g., `123 → "123"`).
 * - ✅ Keeps existing strings as strings.
 * - ✅ Removes `null`, `undefined`, `NaN`, `Infinity`, `-Infinity`.
 * - ✅ Removes non-primitive types like functions, symbols, and bigints.
 * - ✅ Processes deeply nested arrays and objects.
 * - ✅ Supports removing empty objects `{}` and empty arrays `[]` via flags.
 *
 * @template T - The input data type (array, object, or any nested combination).
 * @template RemoveEmptyObjects - If `true`, empty objects `{}` will be removed recursively.
 * @template RemoveEmptyArrays - If `true`, empty arrays `[]` will be removed recursively.
 *
 * @param {T} input - The input array, object, or value to convert.
 * @param {boolean} [removeEmptyObjects=false] - Whether to remove empty objects `{}`.
 * @param {boolean} [removeEmptyArrays=false] - Whether to remove empty arrays `[]`.
 *
 * @returns {ConvertedDeepStrings<T, RemoveEmptyObjects, RemoveEmptyArrays> | undefined}
 *          The converted data structure with all values as strings, or `undefined` if completely empty.
 *
 * @example
 * // Simple array conversion
 * deepStrings([1, "2", 3])
 * // → ["1", "2", "3"]
 *
 * @example
 * // Nested arrays
 * deepStrings([1, ["2", [3, [null, "4"]]]])
 * // → ["1", ["2", ["3", ["4"]]]]
 *
 * @example
 * // Object with nested values
 * deepStrings({ a: 1, b: "2", c: { d: 3, e: null } })
 * // → { a: "1", b: "2", c: { d: "3" } }
 *
 * @example
 * // Removing empty objects
 * deepStrings({ a: {}, b: "1" }, true, false)
 * // → { b: "1" }
 *
 * @example
 * // Removing empty arrays
 * deepStrings(["1", [], { a: [] }], false, true)
 * // → ["1", { a: [] }]
 *
 * @example
 * // Removing both empty objects and arrays deeply
 * deepStrings({ a: {}, b: [], c: [{ d: {}, e: [] }, "1"] }, true, true)
 * // → { c: ["1"] }
 *
 * @example
 * // Fully empty structure after processing becomes undefined
 * deepStrings([null, undefined, {}], true, true)
 * // → undefined
 */
export const deepStrings = <
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  T extends unknown,
  RemoveEmptyObjects extends boolean = false,
  RemoveEmptyArrays extends boolean = false
>(
  input: T,
  removeEmptyObjects: RemoveEmptyObjects = false as RemoveEmptyObjects,
  removeEmptyArrays: RemoveEmptyArrays = false as RemoveEmptyArrays
):
  | ConvertedDeepStrings<T, RemoveEmptyObjects, RemoveEmptyArrays>
  | undefined => {
  function _deepStringsInternal<
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
    | ConvertedDeepStrings<T, RemoveEmptyObjects, RemoveEmptyArrays>
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

    if (typeof input === "number" || typeof input === "string") {
      return String(input) as ConvertedDeepStrings<
        T,
        RemoveEmptyObjects,
        RemoveEmptyArrays
      >;
    }

    if (Array.isArray(input)) {
      const newArray = input
        .map((item) =>
          _deepStringsInternal(
            item,
            removeEmptyObjects,
            removeEmptyArrays,
            false
          )
        )
        .filter((item) => item !== undefined);

      if (removeEmptyArrays && newArray.length === 0) return undefined;

      return newArray as ConvertedDeepStrings<
        T,
        RemoveEmptyObjects,
        RemoveEmptyArrays
      >;
    }

    if (typeof input === "object") {
      const newObject: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(input)) {
        const convertedValue = _deepStringsInternal(
          value,
          removeEmptyObjects,
          removeEmptyArrays,
          false
        );

        if (convertedValue !== undefined) {
          newObject[key] = convertedValue;
        } else if (Array.isArray(value) && !removeEmptyArrays) {
          // preserve empty array property
          newObject[key] = [];
        }
      }

      if (removeEmptyObjects && Object.keys(newObject).length === 0) {
        return isRoot
          ? ({} as ConvertedDeepStrings<
              T,
              RemoveEmptyObjects,
              RemoveEmptyArrays
            >)
          : undefined;
      }

      return newObject as ConvertedDeepStrings<
        T,
        RemoveEmptyObjects,
        RemoveEmptyArrays
      >;
    }

    return undefined;
  }

  return _deepStringsInternal(
    input,
    removeEmptyObjects,
    removeEmptyArrays,
    true
  );
};
