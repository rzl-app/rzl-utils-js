/** ----------------------------------------
 * * ***Creates a delay for a specified duration.***
 * ----------------------------------------
 *
 * @param {number} [milliseconds=1000] - The duration of the delay in milliseconds (default: 1000ms).
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
export const delay = (milliseconds: number = 1000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
