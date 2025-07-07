/** ----------------------------------------------------------
 * * ***Formats a number or numeric string by adding a custom separator every three digits.***
 * ----------------------------------------------------------
 *
 * - Converts `number` to a `string` before formatting.
 * - Defaults to using `,` as the separator but allows customization.
 * - Handles both integer and decimal numbers correctly.
 *
 * @param {string | number} value - The numeric value to format.
 * @param {string} [separator=","] - The separator to use (default is `,`).
 * @returns {string} - The formatted number with separators.
 *
 * @example
 * formatNumberWithSeparator(1000000);      // "1,000,000"
 * formatNumberWithSeparator(1234567.89);   // "1,234,567.89"
 * formatNumberWithSeparator("987654321", " "); // "987 654 321"
 */
export function formatNumberWithSeparator(
  value: string | number,
  separator: string = ","
): string {
  separator =
    typeof separator === "string" && separator.trim().length ? separator : ",";

  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}
