/** --------------------------------------------------
 * * ***Type utility to define the output type while maintaining structure.***
 * --------------------------------------------------
 * - Converts strings and numbers to `number`.
 * - Removes `null`, `undefined`, and non-numeric values.
 * - Supports deeply nested structures.
 * - Keeps empty arrays and objects unless `removeEmptyObjects` or `removeEmptyArrays` is enabled.
 */
type ConvertedNumberType<
  T,
  RemoveEmptyObjects extends boolean,
  RemoveEmptyArrays extends boolean
> = T extends null | undefined
  ? never // Removes null & undefined
  : T extends number | `${number}`
  ? number // Convert valid numbers
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends any[]
  ? ConvertedNumberType<T[number], RemoveEmptyObjects, RemoveEmptyArrays>[] // Maintain array structure
  : T extends Record<string, unknown>
  ? {
      [K in keyof T]: ConvertedNumberType<
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
 * * ***Converts an array or object of values into numbers (including decimals) while maintaining structure.***
 * --------------------------------------------------
 *
 * - ✅ Removes `null`, `undefined`, and non-numeric values.
 * - ✅ Recursively processes nested objects and arrays.
 * - ✅ Supports valid numbers, including decimals (`"3.5"` → `3.5`).
 * - ✅ If an object or array is empty, it can be removed based on the provided options.
 *
 * @template T - The input data type (Array or Object).
 * @template RemoveEmptyObjects - Whether to remove empty objects `{}`.
 * @template RemoveEmptyArrays - Whether to remove empty arrays `[]`.
 *
 * @param {T} input - The data to be converted.
 * @param {boolean} [removeEmptyObjects=false] - Whether to remove empty objects `{}`.
 * @param {boolean} [removeEmptyArrays=false] - Whether to remove empty arrays `[]`.
 *
 * @returns {ConvertedNumberType<T, RemoveEmptyObjects, RemoveEmptyArrays> | undefined}
 *          The converted data with numbers or `undefined` if empty.
 *
 * @example
 * // Convert an array with numbers and decimals
 * console.log(convertArrayValuesToNumbers(["1", "2.5", "hello", "3.5", 4, null]));
 * // Output: [1, 2.5, 3.5, 4]
 *
 * @example
 * // Convert a nested array
 * console.log(convertArrayValuesToNumbers(["1", ["2.5", "invalid", "3.5"], 4]));
 * // Output: [1, [2.5, 3.5], 4]
 *
 * @example
 * // Convert an object with number strings and remove invalid values
 * console.log(convertArrayValuesToNumbers({ a: "5", b: "10.2", c: "xyz" }));
 * // Output: { a: 5, b: 10.2 }
 *
 * @example
 * // Convert a nested object with arrays and numbers
 * console.log(convertArrayValuesToNumbers({ a: "5", b: ["6.5", { c: "7.2", d: null }] }));
 * // Output: { a: 5, b: [6.5, { c: 7.2 }] }
 *
 * @example
 * // Removing empty objects and arrays
 * console.log(convertArrayValuesToNumbers({ a: {}, b: [], c: { d: null } }, true, true));
 * // Output: {}
 */
export function convertArrayValuesToNumbers<
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  T extends unknown,
  RemoveEmptyObjects extends boolean = false,
  RemoveEmptyArrays extends boolean = false
>(
  input: T,
  removeEmptyObjects: RemoveEmptyObjects = false as RemoveEmptyObjects,
  removeEmptyArrays: RemoveEmptyArrays = false as RemoveEmptyArrays
): ConvertedNumberType<T, RemoveEmptyObjects, RemoveEmptyArrays> | undefined {
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
    return Number(input) as ConvertedNumberType<
      T,
      RemoveEmptyObjects,
      RemoveEmptyArrays
    >;
  }

  if (Array.isArray(input)) {
    const newArray = input
      .map((item) =>
        convertArrayValuesToNumbers(item, removeEmptyObjects, removeEmptyArrays)
      )
      .filter((item) => item !== undefined);

    if (removeEmptyArrays && newArray.length === 0) return undefined;

    return newArray as ConvertedNumberType<
      T,
      RemoveEmptyObjects,
      RemoveEmptyArrays
    >;
  }

  if (typeof input === "object") {
    const newObject: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(input)) {
      const convertedValue = convertArrayValuesToNumbers(
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

    return newObject as ConvertedNumberType<
      T,
      RemoveEmptyObjects,
      RemoveEmptyArrays
    >;
  }

  return undefined;
}
