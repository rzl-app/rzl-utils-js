import type { RandomINTProps } from "./types";

/** ----------------------------------------------------------
 * * ***Generates a random integer within a specified range of digit lengths.***
 * ----------------------------------------------------------
 *
 * @param {object} options - Configuration options.
 * @param {number} [options.minLength=1] - Minimum length of the random number, the allowed minimal value integer is 1 and not bigger than value of maxLength.
 * @param {number} [options.maxLength=16] - Maximum length of the random number, the allowed maximal value integer is 16.
 * @param {boolean} [options.avoidZero=false] - If true, prevents the result from being zero.
 * @returns {number} A randomly generated integer within the specified constraints.
 * @throws {Error} If the provided parameters are invalid.
 */
export const generateRandomInteger = (
  options: {
    /** * Minimum length of the random number, the `allowed` `minimal` `value` `integer` is `1` `and` `not` `bigger` `than` `value` `of` `maxLength`.
     * @default 1
     */
    minLength?: number;
    /** * Maximum length of the random number, the `allowed` `maximal` `value` `integer` is `16`.
     *
     * @default 16
     */
    maxLength?: number;
    /** * If true, prevents the result from being zero.
     * @default false
     */
    avoidZero?: boolean;
  } = {}
): number => {
  let { minLength = 1, maxLength = 16, avoidZero = false } = options;

  // Validate minLength and maxLength
  if (
    !Number.isInteger(minLength) ||
    !Number.isInteger(maxLength) ||
    minLength < 1 ||
    maxLength > 16 ||
    minLength > maxLength
  ) {
    throw new Error(
      "Invalid parameters: minLength must be ≥ 1, maxLength must be ≤ 16, and minLength ≤ maxLength."
    );
  }

  // Generate a random length between minLength and maxLength
  const randomLength =
    minLength === maxLength
      ? minLength
      : Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  // Define min and max value based on the selected length
  const minValue = 10 ** (randomLength - 1); // Example: minLength=3 → minValue=100
  const maxValue = 10 ** randomLength - 1; // Example: maxLength=4 → maxValue=9999

  // Generate a random number within the valid range
  let result = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;

  // Ensure the number is not zero if `avoidZero` is true
  if (avoidZero && result === 0) {
    result = minValue; // Assign the smallest valid number instead of looping
  }

  return result;
};

/** ----------------------------
 * * ***Generates a random integer within a specified range (inclusive).***
 * ----------------------------
 *
 * @param {number} min - The minimum value (inclusive, must be ≥ 1).
 * @param {number} max - The maximum value (inclusive, must be ≤ Number.MAX_SAFE_INTEGER).
 * @returns {number} A random integer between `min` and `max` (inclusive).
 * @throws {Error} If `min` or `max` is not a valid integer, or if `min` is greater than `max`.
 *
 * @example
 * getRandomIntInRange(1, 10); // Returns a random number between 1 and 10
 * getRandomIntInRange(50, 100); // Returns a random number between 50 and 100
 * getRandomIntInRange(5, 5); // Always returns 5
 */
export const getRandomIntInRange = (min: number, max: number): number => {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error(
      "Error function of `getRandomIntInRange` both parameter `min` and `max` must be integers."
    );
  }
  if (min > max) {
    throw new Error(
      "Error function of `getRandomIntInRange` parameter `min` must be less than or equal to `max`."
    );
  }

  // Ensure `min` is at least 1
  min = Math.max(1, min);

  // Ensure `max` does not exceed Number.MAX_SAFE_INTEGER
  max = Math.min(Number.MAX_SAFE_INTEGER, max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};
