/** ----------------------------------------------------------
 * * ***Removes `null` and `undefined` values from an array, including nested arrays.***
 * ----------------------------------------------------------
 * - ✅ Returns `undefined` if the input is not a valid array.
 * - ✅ Recursively filters out `null` and `undefined` from nested arrays.
 * - ✅ Maintains the original array structure after filtering.
 * - ✅ Ensures proper type inference to avoid type mismatches.
 * - ✅ Returns `undefined` if the filtered array is empty.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} [input] - The array to be filtered.
 * @returns {T[] | undefined} A new array with `null` and `undefined` values removed,
 * or `undefined` if the input is invalid or results in an empty array.
 */
export const filterNullArray = <T>(input?: T[]): T[] | undefined => {
  if (!Array.isArray(input)) return undefined; // Ensure input is a valid array

  const filtered = input.reduce<T[]>((output, element) => {
    if (element !== null && element !== undefined) {
      if (Array.isArray(element)) {
        const cleanedNested = filterNullArray(element);
        if (cleanedNested && cleanedNested.length > 0) {
          output.push(cleanedNested as unknown as T);
        }
      } else {
        output.push(element);
      }
    }
    return output;
  }, []);

  return filtered.length > 0 ? filtered : undefined;
};

/** ----------------------------------------------------------
 * * ***Flattens a nested array and removes duplicate values while maintaining the original order.***
 * ----------------------------------------------------------
 * Supports an option to force all elements to be strings.
 *
 *
 * @param {Array<any>} inputArray - The input array, which may contain nested arrays.
 * @param {boolean} [forceToString=false] - Whether to convert all elements to strings before deduplication.
 * @returns {T extends true ? string[] : Array<string | number>} - A new flattened array with duplicates removed.
 * @throws {TypeError} If the input is not an array.
 * @throws {TypeError} If the array contains unsupported types (other than string, number, or nested arrays).
 *
 * @example
 * // Removing duplicates from a flat array
 * const result1 = dedupeArray(["apple", "banana", "apple", "orange"]);
 * console.log(result1); // ["apple", "banana", "orange"]
 *
 * @example
 * // Removing duplicates from a number array
 * const result2 = dedupeArray([1, 2, 2, 3, 4, 1]);
 * console.log(result2); // [1, 2, 3, 4]
 *
 * @example
 * // Removing duplicates from a nested array
 * const result3 = dedupeArray(["apple", [1, 2, "apple"], 2, 1]);
 * console.log(result3); // ["apple", 1, 2]
 *
 * @example
 * // Removing duplicates from a nested array with forceToString = true
 * const result4 = dedupeArray(["apple", [1, 2, "apple"], 2, 1], true);
 * console.log(result4); // ["apple", "1", "2"]
 *
 * @example
 * // Handling deeply nested arrays
 * const result5 = dedupeArray([["apple", "banana"], ["apple", "orange"], "banana"]);
 * console.log(result5); // ["apple", "banana", "orange"]
 *
 * @example
 * // Handling empty array
 * const result6 = dedupeArray([]);
 * console.log(result6); // []
 *
 * @example
 * // Handling invalid input
 * try {
 *   dedupeArray("not an array"); // Throws TypeError
 * } catch (error) {
 *   console.error(error.message);
 * }
 */
export const dedupeArray = <T extends boolean>(
  inputArray: unknown[],
  forceToString: T = false as T
): T extends true ? string[] : Array<string | number> => {
  if (!Array.isArray(inputArray)) {
    throw new TypeError(`props 'inputArray' must be \`array\` type!`);
  }

  if (!(typeof forceToString === "boolean")) {
    throw new TypeError(`props 'forceToString' must be \`boolean\` type!`);
  }

  // Recursive function to flatten nested arrays
  const flattenArray = (input: unknown[]): Array<string | number> => {
    return input.reduce<Array<string | number>>((acc, item) => {
      if (Array.isArray(item)) {
        acc.push(...flattenArray(item));
      } else if (typeof item === "string" || typeof item === "number") {
        acc.push(forceToString ? String(item) : item);
      } else {
        throw new TypeError(
          "Array must contain only strings, numbers, or nested arrays."
        );
      }
      return acc;
    }, []);
  };

  // Flatten the input array and remove duplicates while preserving order
  const flatArray = flattenArray(inputArray);
  return [
    ...new Map(flatArray.map((item) => [item, item])).values(),
  ] as T extends true ? string[] : Array<string | number>;
};
