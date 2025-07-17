import { isArray } from "./isArray";
import { isEmptyArray } from "./isEmptyArray";

/** ----------------------------------------------------------
 * * ***Checks if at least one element from `targetArray` exists in `sourceArray`.***
 * ----------------------------------------------------------
 *
 * - ✅ Uses `Set` for **faster lookup** compared to `Array.prototype.includes()`.
 * - ✅ Supports **any data type** (`number`, `string`, `boolean`, `object`, `array`, `function`, etc.).
 * - ✅ Uses **reference equality** for non-primitive values (object, array, function).
 * - ✅ Returns `false` if either array is missing, empty, or not an array.
 *
 * @template T - The expected type of array elements.
 *
 * @param {T[]} [sourceArray] - The array to search within.
 * @param {T[]} [targetArray] - The array containing elements to match.
 *
 * @returns {boolean}
 *    - `true` if **at least one element from `targetArray` is strictly found in `sourceArray`**.
 *    - Comparison uses:
 *       - **Value equality** for primitives (`number`, `string`, `boolean`, `null`, `undefined`).
 *       - **Reference equality** for objects, arrays, and functions.
 *    - `false` if:
 *       - No matching elements exist,
 *       - Either array is not provided, not an actual array, or is empty.
 *
 * @example
 * arrayHasAnyMatch(["apple", "banana", "cherry"], ["banana", "grape"]); // → true
 * arrayHasAnyMatch(["red", "blue"], ["green", "yellow"]); // → false
 * arrayHasAnyMatch([1, 2, 3], [3, 4, 5]); // → true
 * arrayHasAnyMatch([], ["test"]); // → false
 * arrayHasAnyMatch(["A", "B", "C"], []); // → false
 *
 * @example
 * const obj = { x: 1 };
 * arrayHasAnyMatch([obj], [obj]); // → true (same reference)
 * arrayHasAnyMatch([{ x: 1 }], [{ x: 1 }]); // → false (different reference)
 *
 * @example
 * const fn = () => "hello";
 * arrayHasAnyMatch([fn], [fn]); // → true
 * arrayHasAnyMatch([() => "hello"], [() => "hello"]); // → false (different function reference)
 *
 * @example
 * const arr = [1, 2];
 * arrayHasAnyMatch([arr], [arr]); // → true
 * arrayHasAnyMatch([[1, 2]], [[1, 2]]); // → false (different array object)
 */
export const arrayHasAnyMatch = <T>(
  sourceArray?: T[],
  targetArray?: T[]
): boolean => {
  if (
    !isArray(sourceArray) ||
    !isArray(targetArray) ||
    isEmptyArray(sourceArray) ||
    isEmptyArray(targetArray)
  ) {
    return false;
  }

  // 🔥 use Set for lookup more faster.
  const sourceSet = new Set(sourceArray);
  return targetArray.some((item) => sourceSet.has(item));
};
