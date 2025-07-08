/** ----------------------------------------
 * * ***Creates a delay for a specified duration.***
 * ----------------------------------------
 *
 * @param {number} [milliSeconds=1000] - The duration of the delay in milliSeconds (default: 1000ms).
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
export const delay = (milliSeconds: number = 1000): Promise<void> => {
  // Validate `milliSeconds`
  if (typeof milliSeconds !== "number") {
    throw new Error("Invalid parameter: `milliSeconds` must be 'number'.");
  }

  return new Promise((resolve) => setTimeout(resolve, milliSeconds));
};
