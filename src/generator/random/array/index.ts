import { isArray } from "@/checkers";

/** ---------------------------------
 * * ***Returns a random element from a given array.***
 * ---------------------------------
 *
 * @template T The type of elements in the array (string | number).
 * @param {T[]} array - The input array.
 * @returns {T | undefined} A random element from the array, or `undefined` if the array is empty or invalid.
 *
 * @example
 * getRandomFromArray([1, 2, 3, 4]); // Returns a random number from the array
 * getRandomFromArray(["apple", "banana", "cherry"]); // Returns a random string from the array
 * getRandomFromArray([]); // Returns `undefined`
 */
export const getRandomFromArray = <T extends string | number>(
  array?: T[]
): T | undefined => {
  if (!isArray(array) || array.length === 0) return undefined;

  const randomIndex = Math.floor(Math.random() * (array?.length || 0));
  return array[randomIndex];
};
