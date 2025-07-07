/** --------------------------------------------------
 * * ***Type utility to define the output type while maintaining structure.***
 * - Converts numbers and strings to `string`.
 * - Removes `null` and `undefined` values from objects and arrays.
 * - Keeps array/objects structure unless `removeEmptyObjects` or `removeEmptyArrays` is enabled.
 * --------------------------------------------------
 */
type ConvertedStringType<
  T,
  RemoveEmptyObjects extends boolean,
  RemoveEmptyArrays extends boolean
> = T extends null | undefined
  ? never // Removes null & undefined
  : T extends number | string
  ? string // Convert number & string to string
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends any[]
  ? ConvertedStringType<T[number], RemoveEmptyObjects, RemoveEmptyArrays>[] // Maintain array structure
  : T extends Record<string, unknown>
  ? {
      [K in keyof T]: ConvertedStringType<
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
 * * ***Converts all values in an array (or nested structure) to strings while maintaining structure.***
 * --------------------------------------------------
 *
 * - ✅ Numbers and strings are converted to string format.
 * - ✅ If a value is `null` or `undefined`, it is removed.
 * - ✅ If a value is an array, it is recursively processed.
 * - ✅ If a value is an object, its properties are processed recursively.
 * - ✅ Supports options to remove empty objects `{}` and empty arrays `[]`.
 *
 * @template T - The input array or object type.
 * @template RemoveEmptyObjects - Whether to remove empty objects.
 * @template RemoveEmptyArrays - Whether to remove empty arrays.
 *
 * @param {T} input - The input array or object to be converted.
 * @param {boolean} [removeEmptyObjects=false] - Whether to remove empty objects `{}`.
 * @param {boolean} [removeEmptyArrays=false] - Whether to remove empty arrays `[]`.
 *
 * @returns {ConvertedStringType<T, RemoveEmptyObjects, RemoveEmptyArrays> | undefined}
 *          The converted array/object with all values as strings, or `undefined` if input is invalid.
 *
 * @example
 * // Simple conversion of numbers to strings
 * console.log(convertArrayValuesToStrings([1, "2", 3.5]));
 * // Output: ["1", "2", "3.5"]
 *
 * @example
 * // Nested array handling
 * console.log(convertArrayValuesToStrings(["1", ["2", "3.5"], 4]));
 * // Output: ["1", ["2", "3.5"], "4"]
 *
 * @example
 * // Object conversion
 * console.log(convertArrayValuesToStrings({ a: 1, b: "2", c: { d: 3.5, e: null } }));
 * // Output: { a: "1", b: "2", c: { d: "3.5" } }
 *
 * @example
 * // Removing empty objects and arrays
 * console.log(convertArrayValuesToStrings({ a: {}, b: [], c: { d: null } }, true, true));
 * // Output: {}
 */
export function convertArrayValuesToStrings<
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  T extends unknown,
  RemoveEmptyObjects extends boolean = false,
  RemoveEmptyArrays extends boolean = false
>(
  input: T,
  removeEmptyObjects: RemoveEmptyObjects = false as RemoveEmptyObjects,
  removeEmptyArrays: RemoveEmptyArrays = false as RemoveEmptyArrays
): ConvertedStringType<T, RemoveEmptyObjects, RemoveEmptyArrays> | undefined {
  if (input === null || input === undefined) return undefined;

  if (typeof input === "number" || typeof input === "string") {
    return String(input) as ConvertedStringType<
      T,
      RemoveEmptyObjects,
      RemoveEmptyArrays
    >;
  }

  if (Array.isArray(input)) {
    const newArray = input
      .map((item) =>
        convertArrayValuesToStrings(item, removeEmptyObjects, removeEmptyArrays)
      )
      .filter((item) => item !== undefined);

    if (removeEmptyArrays && newArray.length === 0) return undefined;

    return newArray as ConvertedStringType<
      T,
      RemoveEmptyObjects,
      RemoveEmptyArrays
    >;
  }

  if (typeof input === "object") {
    const newObject: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(input)) {
      const convertedValue = convertArrayValuesToStrings(
        value,
        removeEmptyObjects,
        removeEmptyArrays
      );

      if (convertedValue !== undefined) {
        newObject[key] = convertedValue;
      }
    }

    if (removeEmptyObjects && Object.keys(newObject).length === 0)
      return undefined;

    return newObject as ConvertedStringType<
      T,
      RemoveEmptyObjects,
      RemoveEmptyArrays
    >;
  }

  return undefined;
}
