import { isNonEmptyString } from "@/predicates";

/** -------------------------------------------------------------
 * * Parses a human-friendly currency string into a JavaScript number.
 * -------------------------------------------------------------
 *
 * 🚀 Supports multi-locale formats:
 *
 *   - European:     "15.000,10"       ➔ 15300.10
 *   - US:           "15,000.10"       ➔ 15300.10
 *   - Swiss:        "15'000.10"       ➔ 15300.10
 *   - French:       "15 000,10"       ➔ 15300.10
 *   - Indian:       "1,23,456.78"     ➔ 123456.78
 *   - Compact:      "15300000,10"     ➔ 15300000.10
 *
 * ✅ Features:
 *   - Strips symbols automatically: "Rp", "$", "EUR", etc.
 *   - Handles bracket negatives:    "(15.000,10)" ➔ -15300.10
 *   - Normalizes decimal separator (last dot or comma).
 *   - Detects non-breaking spaces (\u00A0, \u202F) often in European data.
 *   - Fallback to 0 for empty, invalid, or non-numeric strings.
 *
 * 🔍 How it parses internally:
 *   1. Removes all characters except digits, ., ,, ', spaces.
 *   2. Detects bracket (...) as negative.
 *   3. If Indian style (1,23,456) detected by multiple ,\d{2}, removes all commas.
 *   4. Otherwise:
 *      - If multiple dots & no commas ➔ thousands: removes all .
 *      - If multiple commas & no dots ➔ thousands: removes all ,
 *      - If mixed, treats last , or . as decimal
 *   5. Converts final decimal to . for JS float.
 *
 * 🛠 Gotchas:
 *   - If both . and , are present, last occurrence is used as decimal.
 *   - For strings like "1.121.234,56" ➔ decimal is ,.
 *   - For "1,121,234.56" ➔ decimal is ..
 *   - For "15300000,2121" ➔ decimal becomes . internally.
 *
 * @param {string} input
 *   Any messy currency string. May contain:
 *     - currency symbols (Rp, $, CHF, EUR)
 *     - thousands separators (.,', space, \u00A0, \u202F)
 *     - various decimal formats (, or .)
 *     - bracket negative: "(15.000,10)"
 *
 * @returns {number}
 *   JavaScript float representation.
 *   Will return 0 for invalid, empty, or non-string input.
 *
 * 📦 Examples of input ➔ output:
 * @example
 * parseCurrencyString("Rp 15.300.000,21");
 * // ➔ 15300000.21
 *
 * parseCurrencyString("15 300 000,21");
 * // ➔ 15300000.21
 *
 * parseCurrencyString("CHF 15'300'000.21");
 * // ➔ 15300000.21
 *
 * parseCurrencyString("$15,300,000.21");
 * // ➔ 15300000.21
 *
 * parseCurrencyString("(15.000,10)");
 * // ➔ -15000.10
 *
 * parseCurrencyString("1,23,456.78");
 * // ➔ 123456.78
 *
 * parseCurrencyString("15300000,2121");
 * // ➔ 15300000.2121
 *
 * parseCurrencyString("USD 15 300 000.21");
 * // ➔ 15300000.21
 *
 * parseCurrencyString("");
 * // ➔ 0
 *
 * parseCurrencyString("abc");
 * // ➔ 0
 *
 * @description
 * * Notes:
 *   - Use this function as a first step to **sanitize currency inputs**
 *     before storing into database or doing math.
 *   - Always pair this with your formatter for consistent output display.
 */
export const parseCurrencyString = (input?: string | null): number => {
  if (!isNonEmptyString(input)) return 0;

  let trimmed = input
    .trim()
    .replace(/\u00A0/g, "")
    .replace(/\u202F/g, "");

  // detect brackets (accounting style)
  let isNegative = false;
  if (/^\(.*\)$/.test(trimmed)) {
    isNegative = true;
    trimmed = trimmed.slice(1, -1).trim();
  }

  trimmed = trimmed
    .replace(/^[-\s]+/, (match) => (match.includes("-") ? "-" : ""))
    .replace(/[\s.,-]+$/, "");

  isNegative = isNegative || /^-/.test(trimmed) || /^[^\d]*-/.test(trimmed);
  const cleaned = trimmed.replace(/[^0-9.,'\s]/g, "");
  let cleanedNoSpace = cleaned.replace(/[\s']/g, "");

  // detect Indian style (like 1,23,456)
  const indianMatches = cleanedNoSpace.match(/,\d{2}/g);
  const isIndianStyle = indianMatches && indianMatches.length > 1;
  if (isIndianStyle) {
    cleanedNoSpace = cleanedNoSpace.replace(/,/g, "");
  } else {
    const dotCount = (cleanedNoSpace.match(/\./g) || []).length;
    const commaCount = (cleanedNoSpace.match(/,/g) || []).length;

    if (dotCount > 1 && commaCount === 0) {
      // e.g. "1.121.234"
      cleanedNoSpace = cleanedNoSpace.replace(/\./g, "");
    } else if (commaCount > 1 && dotCount === 0) {
      // e.g. "1,121,234"
      cleanedNoSpace = cleanedNoSpace.replace(/,/g, "");
    } else {
      // mixed, or single
      const lastComma = cleanedNoSpace.lastIndexOf(",");
      const lastDot = cleanedNoSpace.lastIndexOf(".");

      if (lastComma > lastDot) {
        // comma likely decimal
        cleanedNoSpace = cleanedNoSpace.replace(/\./g, "").replace(",", ".");
      } else if (lastDot > lastComma) {
        // dot likely decimal
        cleanedNoSpace = cleanedNoSpace.replace(/,/g, "");
      } else {
        if (lastComma > lastDot) {
          // comma is likely decimal
          const beforeDecimal = cleanedNoSpace
            .slice(0, lastComma)
            .replace(/,/g, "")
            .replace(/\./g, "");
          const afterDecimal = cleanedNoSpace.slice(lastComma + 1);
          cleanedNoSpace = beforeDecimal + "." + afterDecimal;
        } else if (lastDot > lastComma) {
          // dot is likely decimal
          const beforeDecimal = cleanedNoSpace
            .slice(0, lastDot)
            .replace(/\./g, "")
            .replace(/,/g, "");
          const afterDecimal = cleanedNoSpace.slice(lastDot + 1);
          cleanedNoSpace = beforeDecimal + "." + afterDecimal;
        } else if (lastComma !== -1) {
          cleanedNoSpace = cleanedNoSpace.replace(/,/g, "");
        } else if (lastDot !== -1) {
          cleanedNoSpace = cleanedNoSpace.replace(/\./g, "");
        }
      }
    }
  }

  const num = parseFloat(cleanedNoSpace) || 0;
  return isNegative ? -num : num;
};
