import {
  isArray,
  isDeepEqual,
  isEmptyArray,
  isNull,
  isObject,
  isUndefined,
  toStringDeepForce,
} from "@/index";

import type { DedupeResult } from "./transforms.types";

/** ----------------------------------------------------------
 * * ***Removes `null` and `undefined` values from an array, including nested arrays.***
 * ----------------------------------------------------------
 *
 * - ✅ Returns `undefined` if the input is explicitly `undefined` or `null`.
 * - ✅ Returns `[]` if input is empty or all elements are removed after filtering.
 * - ✅ Recursively filters nested arrays while preserving structure.
 * - ✅ Ensures proper type inference for safer downstream operations.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} [input] - The array to be filtered.
 * @returns {T[] | undefined} A new array with `null` and `undefined` values removed,
 * or `undefined` if the input is explicitly `undefined` or `null`.
 *
 * @example
 * filterNullArray([1, null, 2, undefined, 3]);
 * // => [1, 2, 3]
 *
 * @example
 * filterNullArray([null, undefined]);
 * // => []
 *
 * @example
 * filterNullArray(undefined);
 * // => undefined
 * @example
 * filterNullArray(null);
 * // => undefined
 *
 * @example
 * filterNullArray([1, [null, 2, [undefined, 3]]]);
 * // => [1, [2, [3]]]
 */
export const filterNullArray = <T>(input?: T[] | null): T[] | undefined => {
  // explicit undefined|null input
  if (isUndefined(input) || isNull(input)) return undefined;

  if (!isArray(input)) return [];

  const filtered = input.reduce<T[]>((output, element) => {
    if (!isNull(element) && !isUndefined(element)) {
      if (isArray(element)) {
        const cleanedNested = filterNullArray(element);
        if (cleanedNested && !isEmptyArray(cleanedNested)) {
          output.push(cleanedNested as unknown as T);
        }
      } else {
        output.push(element);
      }
    }
    return output;
  }, []);

  return filtered;
};

/** ----------------------------------------------------------
 * * ***Flattens a nested array and removes duplicate values while maintaining the original order.***
 * ----------------------------------------------------------
 *
 * Supports options to force values into string representation at various levels:
 * - `"stringOrNumber"`: Converts all numbers and strings to strings.
 * - `"primitives"`: Converts all primitive types (number, string, boolean, bigint, undefined, NaN) to strings.
 * - `"all"`: Converts everything (including functions, Dates, RegExp, Symbols, Maps, Sets, Errors, Promises) to strings,
 *   and deeply converts object property values to strings.
 *
 * @param {unknown[]} inputArray - The array to deduplicate. Can be deeply nested and contain any mix of types.
 * @param {{ forceToString?: false | "stringOrNumber" | "primitives" | "all" }} [options] - Options to control string conversion.
 * @returns {unknown[]} A new deduplicated array with the structure preserved, and values possibly stringified depending on `forceToString`.
 *
 * @throws {TypeError} If the input is not an array, or options is not an object, or if `forceToString` is invalid.
 *
 * @example
 * dedupeArray(["apple", "banana", "apple"]);
 * // => ["apple", "banana"]
 *
 * @example
 * dedupeArray([1, "1", 2, "2"], { forceToString: "stringOrNumber" });
 * // => ["1", "2"]
 *
 * @example
 * dedupeArray([true, "true", false, undefined], { forceToString: "primitives" });
 * // => ["true", "false", "undefined"]
 *
 * @example
 * dedupeArray([1, "1", { a: 1 }], { forceToString: "all" });
 * // => ["1", { a: "1" }]
 *
 * @example
 * dedupeArray([1, 1, [2, 2, [3, 3]]]);
 * // => [1, [2, [3]]]
 *
 * @example
 * dedupeArray([null, undefined, null]);
 * // => [null, undefined]
 *
 * @example
 * dedupeArray([[], [[]], [[[]]], [[]], [[[]]]]);
 * // => [[], [[]], [[[]]]]
 *
 * @example
 * const fn = () => 1;
 * dedupeArray([fn, fn, () => 1]);
 * // => [fn, () => 1] cause: ref () => 1 and fn is different but ref const `fn` and `fn` is same ref.
 *
 * @example
 * dedupeArray([Symbol("x"), Symbol("x")]);
 * // => [Symbol("x")] (symbols are same by identity, so dedupe
 *
 * @example
 * dedupeArray([NaN, NaN, 1, "1"]);
 * // => [NaN, 1, "1"]
 *
 * @example
 * dedupeArray([NaN, NaN, 1, "1"], { forceToString: "primitives" });
 * // => ["NaN", "1"]
 *
 * @example
 * dedupeArray([new Date("2025-01-01"), new Date("2025-01-01")]);
 * // => [Date("2025-01-01")] (same time, deduped)
 *
 * @example
 * dedupeArray([new Date("2025-01-01"), new Date("2025-01-01")], { forceToString: "all" });
 * // => ["2025-01-01T00:00:00.000Z"]
 *
 * @example
 * dedupeArray([/abc/, /abc/], { forceToString: "all" });
 * // => ["/abc/"]
 *
 * @example
 * dedupeArray([new Map(), new Set(), new Error("err")], { forceToString: "all" });
 * // => ["[object Map]", "[object Set]", "Error: err"]
 *
 * @example
 * dedupeArray([Promise.resolve(1), Promise.resolve(1)], { forceToString: "all" });
 * // => ["[object Promise]"]
 *
 * @example
 * dedupeArray([{ a: 1 }, { a: 1 }, { a: 2 }], { forceToString: "primitives" });
 * // => [{ a: "1" }, { a: "2" }]
 *
 * @example
 * dedupeArray([{ a: { b: 1 } }, { a: { b: 1 } }], { forceToString: "all" });
 * // => [{ a: { b: "1" } }]
 *
 * @example
 * dedupeArray("not an array");
 * // Throws TypeError
 *
 * @example
 * dedupeArray([1, 2, 3], { forceToString: "invalid" });
 * // Throws TypeError
 */
export const dedupeArray = <
  F extends false | "stringOrNumber" | "primitives" | "all" = false
>(
  inputArray: unknown[],
  options?: { forceToString?: F }
): DedupeResult<F> => {
  if (!isArray(inputArray)) {
    throw new TypeError(`'inputArray' must be an array`);
  }
  if (!isObject(options)) {
    throw new TypeError(`'options' must be an object`);
  }

  const { forceToString = false } = options ?? {};
  if (
    !(
      forceToString === false ||
      forceToString === "stringOrNumber" ||
      forceToString === "primitives" ||
      forceToString === "all"
    )
  ) {
    throw new TypeError(
      `'forceToString' must be false | "stringOrNumber" | "primitives" | "all"`
    );
  }

  const process = (arr: unknown[]): unknown[] => {
    const seen: unknown[] = [];
    return arr.reduce<unknown[]>((acc, item) => {
      const value = isArray(item)
        ? process(item)
        : toStringDeepForce(item, forceToString);

      if (!seen.some((s) => isDeepEqual(s, value))) {
        seen.push(value);
        acc.push(value);
      }
      return acc;
    }, []);
  };

  return process(inputArray) as DedupeResult<F>;
};
