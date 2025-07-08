import type { FormatCurrencyOptions, PropsReplaceNonNumeric } from "./types";

/** ----------------------------------------------------------
 * * ***Formats a number or string into a currency with customizable separators and decimal options.***
 * ----------------------------------------------------------
 *
 * - Converts input into a formatted currency string.
 * - Allows customization of thousands separator, decimal separator, and decimal handling.
 * - Supports optional end decimal tag for currency display conventions.
 *
 * @param {PriceTagOptions} options - The formatting options.
 * @returns {string} - The formatted currency string.
 *
 * @example
 * formatCurrency({ value: 1000000 });                // "1.000.000"
 * formatCurrency({ value: 2500.5, decimal: true });  // "2.500,50"
 * formatCurrency({ value: "98765", separator: " " }); // "98 765"
 * formatCurrency({ value: 1999.99, endDecimal: true, suffixDecimal: ".-" }); // "1.999,99.-"
 */
export const formatCurrency = ({
  value,
  separator = ".",
  decimal = false,
  totalDecimal = 2,
  endDecimal = true,
  suffixDecimal = ".-",
  separatorDecimals = ",",
}: FormatCurrencyOptions): string => {
  if (!(typeof value === "string" || typeof value === "number")) {
    throw new TypeError(`props 'value' must be \`string\` or \`number\` type!`);
  }

  // Ensure value is a valid number by stripping non-numeric characters
  const numericValue = removeNonNumericCharacters({ value }).toString();

  if (typeof decimal !== "boolean" || typeof endDecimal !== "boolean") {
    throw new TypeError(
      `props 'decimal' and 'endDecimal' must be \`boolean\` or empty as \`undefined\` type!`
    );
  }

  if (
    typeof separator !== "string" ||
    typeof suffixDecimal !== "string" ||
    typeof separatorDecimals !== "string"
  ) {
    throw new TypeError(
      `props 'separator', 'suffixDecimal' and 'separatorDecimals' must be \`string\` or empty as \`undefined\` type!`
    );
  }

  // Apply thousands separator
  const formattedNumber = numericValue.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    separator
  );

  // Generate decimal part if required
  let decimalPart = "";
  if (decimal) {
    const decimals = "0".repeat(totalDecimal);
    decimalPart =
      separatorDecimals + decimals + (endDecimal ? suffixDecimal : "");
  }

  return formattedNumber + decimalPart;
};

/** ----------------------------------------------------------
 * * ***Removes all non-numeric characters from a string or number input.***
 * ----------------------------------------------------------
 *
 * - Converts input to a string and removes any characters that are not digits (`0-9`).
 * - Returns a numeric value (`number`).
 * - If input is `null` or `undefined`, returns `0`.
 *
 * @param {PropsReplaceNonNumeric} options - The input object containing the value to process.
 * @returns {number} - The cleaned numeric value.
 *
 * @example
 * removeNonNumericCharacters({ value: "123abc456" }); // 123456
 * removeNonNumericCharacters({ value: "$1,234.56" }); // 123456
 * removeNonNumericCharacters({ value: "9A8B7C6" });   // 9876
 * removeNonNumericCharacters({ value: undefined });   // 0
 */
export const removeNonNumericCharacters = ({
  value,
}: PropsReplaceNonNumeric): number => {
  if (
    typeof value === "undefined" ||
    value === null ||
    !(typeof value === "string" || typeof value === "number")
  )
    return 0;

  return Number(String(value).replace(/[^0-9]/g, "")) || 0;
};
