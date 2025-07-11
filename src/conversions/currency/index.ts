import type { FormatCurrencyOptions } from "./types";

/** ----------------------------------------------------------
 * * ***Removes all non-numeric characters from a string or number input.***
 * ----------------------------------------------------------
 *
 * ✅ Converts the input to a string, trims whitespace, and strips any characters
 *    that are not digits (`0-9`).
 *
 * ✅ Returns the cleaned value as a `number`.
 *
 * 🚩 If the input is `null`, `undefined`, or cannot be converted into a number,
 *    it safely returns `0`.
 *
 * @param {string | number | null | undefined} value
 *    The value to clean. Accepts a string, number, `null`, or `undefined`.
 *
 * @returns {number}
 *    The numeric value after removing all non-numeric characters.
 *    Defaults to `0` if input is invalid.
 *
 * @example
 * extractDigits("123abc456"); // ➔ 123456
 * extractDigits("$1,234.56"); // ➔ 123456
 * extractDigits("9A8B7C6");   // ➔ 9876
 * extractDigits(undefined);   // ➔ 0
 * extractDigits(null);        // ➔ 0
 * extractDigits(12345);       // ➔ 12345
 */
export const extractDigits = (value?: string | number | null): number => {
  if (typeof value !== "string" && typeof value !== "number") return 0;

  const cleaned = String(value)
    .trim()
    .replace(/[^0-9]/g, "");
  return Number(cleaned) || 0;
};

/** -------------------------------------------------------
 * * Formats a number or messy currency string into a
 *   beautifully formatted currency string, with highly
 *   customizable separators, decimal control, rounding,
 *   currency symbols, and negative styling.
 * -------------------------------------------------------
 *
 * ✅ Highlights:
 * - Accepts:
 *   * Pure numbers: `15300.95`
 *   * Messy currency strings from **any locale**:
 *     - `"Rp 15.000,21"` (Indonesian / Euro)
 *     - `"$12,345.60"` (US)
 *     - `"CHF 12'345.60"` (Swiss)
 *     - `"1,23,456.78"` (Indian)
 * - Auto extracts numeric value with smart multi-locale parsing
 *   via `parseCurrencyString`.
 * - Handles:
 *   * Thousands separators: `.`, `,`, `'`, ` `
 *   * Decimal separators: `,`, `.`
 *   * Decimal suffix (eg. `".-"`, `" USD"`)
 *   * Currency prefix (eg. `"Rp "`, `"$ "`)
 *   * Rounding: `"round"`, `"ceil"`, `"floor"`, or truncate
 *   * Negative styling: dash `-`, brackets `( )`, absolute, or custom
 * - Strong type checks & clear errors for misconfigured options.
 *
 * ✅ How input is parsed:
 * - Removes all non-digit except `.`, `,`, `'` and spaces.
 * - Detects bracket negatives: `"(15.000,10)"` ➔ `-15000.10`
 * - Uses last `,` or `.` as decimal separator (others are thousands).
 * - Ignores currency symbols like `Rp`, `$` (must re-apply with `suffixCurrency`).
 *
 * ✅ Options:
 * @param {string|number} value
 *   The input value to format.
 *   Examples:
 *     * `"Rp 15.000,21"`
 *     * `"$12,345.60"`
 *     * `"CHF 12'345.60"`
 *     * `15300.95`
 *
 * @param {FormatCurrencyOptions} [options]
 *   Optional configuration object:
 *
 *   @property {string} separator
 *     Thousands separator (default `"."`).
 *     Example: `"."` ➔ `1.000.000`
 *
 *   @property {string} separatorDecimals
 *     Decimal separator (default `","`).
 *     Example: `","` ➔ `1.000,10`
 *
 *   @property {string} suffixCurrency
 *     Prefix currency string (default `""`).
 *     Does **not auto-keep input symbols**.
 *     Must set manually: `suffixCurrency: "Rp "`.
 *
 *   @property {boolean} decimal
 *     Show decimals? (default `false`).
 *     If `false`, rounds to integer.
 *
 *   @property {number} totalDecimal
 *     Total decimal digits (default `2`).
 *     If `decimal: true` & `roundedDecimal: false`, simply cuts.
 *
 *   @property {string} suffixDecimal
 *     Text appended after decimals
 *     (e.g. `".-"`, `" USD"`). Default `""`.
 *
 *   @property {boolean} endDecimal
 *     Actually append `suffixDecimal`? (default `true`).
 *
 *   @property {"round"|"ceil"|"floor"|false} roundedDecimal
 *     Rounding mode:
 *       - `"round"` ➔ nearest
 *       - `"ceil"` ➔ always up
 *       - `"floor"` ➔ always down
 *       - `false` ➔ truncate
 *     Default `"round"`.
 *
 *   @property {"dash"|"brackets"|"abs"|{style?, space?, custom?}} negativeFormat
 *     How to format negatives:
 *       - `"dash"` ➔ `-15.000`
 *       - `"brackets"` ➔ `(15.000)`
 *       - `"abs"` ➔ `15.000` (always positive)
 *       - or object:
 *         {
 *            style: "dash"|"brackets"|"abs",
 *            space: true|false,
 *            custom: (formatted) => string
 *         }
 *     Default `"dash"`.
 *
 *   @property {boolean} indianFormat
 *     If `true`, formats as Indian: `12,34,567`.
 *     Also forces `separator: ","`, `separatorDecimals: "."`.
 *
 * @returns {string}
 *   Nicely formatted currency string.
 *   Examples:
 *     - `"15.000,10"`
 *     - `"Rp 15.000,10.-"`
 *     - `"15'000.10 USD"`
 *     - `"12,34,567.89"`
 *
 * @throws {TypeError}
 *   If:
 *     - `value` is not string or number
 *     - cannot parse to valid number
 *     - options have invalid types
 *
 * ---
 *
 * ***✅ Notes:***
 * - Always re-apply symbols via `suffixCurrency`.
 * - `parseCurrencyString` smartly detects last decimal,
 *   so `"1.121.234,56"` and `"1,121,234.56"` both parsed correctly.
 */
export const formatCurrency = (
  value: string | number,
  options: FormatCurrencyOptions = {}
): string => {
  if (!(typeof value === "string" || typeof value === "number")) {
    throw new TypeError(`props 'value' must be \`string\` or \`number\` type!`);
  }

  if (typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError(`props 'options' must be \`object\` type!`);
  }

  const {
    decimal = false,
    totalDecimal = 2,
    endDecimal = true,
    indianFormat = false,
    suffixCurrency = "",
    suffixDecimal = "",
    roundedDecimal = "round",
    negativeFormat = "dash",
  } = options;

  let { separatorDecimals = ",", separator = "." } = options;

  // validations
  if (
    typeof separator !== "string" ||
    typeof separatorDecimals !== "string" ||
    typeof suffixCurrency !== "string" ||
    typeof suffixDecimal !== "string"
  ) {
    throw new TypeError(
      `props 'separator', 'separatorDecimals', 'suffixCurrency' and 'suffixDecimal' must be \`string\` type!`
    );
  }

  if (
    typeof decimal !== "boolean" ||
    typeof endDecimal !== "boolean" ||
    typeof indianFormat !== "boolean"
  ) {
    throw new TypeError(
      `props 'decimal', 'endDecimal' and 'indianFormat' must be \`boolean\` type!`
    );
  }

  if (typeof totalDecimal !== "number") {
    throw new TypeError(`props 'totalDecimal' must be \`number\` type!`);
  }

  if (
    !(
      roundedDecimal === false ||
      roundedDecimal === "round" ||
      roundedDecimal === "ceil" ||
      roundedDecimal === "floor"
    )
  ) {
    throw new TypeError(
      `props 'roundedDecimal' must be \`false\` or one of: 'round' | 'ceil' | 'floor'`
    );
  }

  if (
    !(
      negativeFormat === "abs" ||
      negativeFormat === "brackets" ||
      negativeFormat === "dash" ||
      typeof negativeFormat === "object"
    )
  ) {
    throw new TypeError(
      `props 'negativeFormat' must be on one of: 'abs' | 'brackets' | 'dash' or \`object\``
    );
  }

  // parse number
  const rawNum = typeof value === "string" ? parseCurrencyString(value) : value;
  if (isNaN(rawNum)) {
    throw new TypeError(`'value' could not be parsed into a valid number`);
  }

  let num = Math.abs(rawNum);
  const factor = Math.pow(10, totalDecimal);

  if (roundedDecimal) {
    const scaled = num * factor;
    switch (roundedDecimal) {
      case "round":
        num = Math.round(scaled) / factor;
        break;
      case "ceil":
        num = Math.ceil(scaled) / factor;
        break;
      case "floor":
        num = Math.floor(scaled) / factor;
        break;
    }
  }

  let integerPart = "";
  let decimalPartRaw = "";

  if (roundedDecimal) {
    const scaled = num * factor;
    switch (roundedDecimal) {
      case "round":
        num = Math.round(scaled) / factor;
        break;
      case "ceil":
        num = Math.ceil(scaled) / factor;
        break;
      case "floor":
        num = Math.floor(scaled) / factor;
        break;
    }
  }

  if (roundedDecimal) {
    [integerPart, decimalPartRaw] = num.toFixed(totalDecimal).split(".");
    decimalPartRaw = decimalPartRaw ?? "".padEnd(totalDecimal, "0");
  } else {
    // cut decimal manually
    const split = String(num).split(".");
    integerPart = split[0];
    decimalPartRaw = (split[1] || "")
      .slice(0, totalDecimal)
      .padEnd(totalDecimal, "0");
  }

  let formattedInteger: string;

  const formatIndianNumber = (numStr: string, separator: string) => {
    const lastThree = numStr.slice(-3);
    const rest = numStr.slice(0, -3);
    if (!rest) return lastThree;
    return (
      rest.replace(/\B(?=(\d{2})+(?!\d))/g, separator) + separator + lastThree
    );
  };
  if (indianFormat) {
    separator = ",";
    separatorDecimals = ".";
    formattedInteger =
      (suffixCurrency.trim().length ? suffixCurrency : "") +
      formatIndianNumber(integerPart, separator);
  } else {
    formattedInteger =
      (suffixCurrency.trim().length ? suffixCurrency : "") +
      integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  }

  if (decimal && decimalPartRaw !== undefined && totalDecimal > 0) {
    let formattedDecimal = separatorDecimals + decimalPartRaw;
    if (endDecimal) formattedDecimal += suffixDecimal;
    formattedInteger += formattedDecimal;
  }

  // negative format
  if (rawNum < 0) {
    if (negativeFormat === "dash") {
      formattedInteger = "-" + formattedInteger;
    } else if (negativeFormat === "brackets") {
      formattedInteger = "(" + formattedInteger + ")";
    } else if (negativeFormat === "abs") {
      // no sign
    } else if (typeof negativeFormat === "object") {
      if ("custom" in negativeFormat) {
        const formatCustomNegative = negativeFormat.custom;

        if (typeof formatCustomNegative !== "function") {
          throw new TypeError(
            `props 'negativeFormat.custom' must be a function: '(formatted: string) => string'`
          );
        }

        const result = formatCustomNegative(formattedInteger);

        if (typeof result !== "string") {
          throw new TypeError(
            `props 'negativeFormat.custom' must return a string`
          );
        }

        formattedInteger = result;
      } else {
        const formatStyleNegative = negativeFormat.style || "dash";
        const formatSpaceNegative =
          typeof negativeFormat.space === "boolean"
            ? negativeFormat.space
            : false;

        if (!(typeof formatSpaceNegative === "boolean")) {
          throw new TypeError(`props 'negativeFormat.space' must be boolean`);
        }
        if (
          !(
            formatStyleNegative === "abs" ||
            formatStyleNegative === "brackets" ||
            formatStyleNegative === "dash"
          )
        ) {
          throw new TypeError(
            `props 'negativeFormat.style' must be one of: 'dash' | 'brackets' | 'abs'`
          );
        }

        switch (formatStyleNegative) {
          case "dash":
            formattedInteger =
              "-" + (formatSpaceNegative ? " " : "") + formattedInteger;
            break;
          case "brackets":
            formattedInteger = formatSpaceNegative
              ? `( ${formattedInteger} )`
              : `(${formattedInteger})`;
            break;
          case "abs":
            // no sign
            break;
        }
      }
    }
  }

  return formattedInteger;
};

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
 *   - Detects non-breaking spaces (`\u00A0`, `\u202F`) often in European data.
 *   - Fallback to `0` for empty, invalid, or non-numeric strings.
 *
 * 🔍 How it parses internally:
 *   1. Removes all characters except digits, `.`, `,`, `'`, spaces.
 *   2. Detects bracket `(...)` as negative.
 *   3. If Indian style (`1,23,456`) detected by multiple `,\d{2}`, removes all commas.
 *   4. Otherwise:
 *      - If multiple dots & no commas ➔ thousands: removes all `.`
 *      - If multiple commas & no dots ➔ thousands: removes all `,`
 *      - If mixed, treats last `,` or `.` as decimal
 *   5. Converts final decimal to `.` for JS float.
 *
 * 🛠 Gotchas:
 *   - If both `.` and `,` are present, last occurrence is used as decimal.
 *   - For strings like `"1.121.234,56"` ➔ decimal is `,`.
 *   - For `"1,121,234.56"` ➔ decimal is `.`.
 *   - For `"15300000,2121"` ➔ decimal becomes `.` internally.
 *
 * @param {string} input
 *   Any messy currency string. May contain:
 *     - currency symbols (Rp, $, CHF, EUR)
 *     - thousands separators (.,', space, `\u00A0`, `\u202F`)
 *     - various decimal formats (`,` or `.`)
 *     - bracket negative: `"(15.000,10)"`
 *
 * @returns {number}
 *   JavaScript float representation.
 *   Will return `0` for invalid, empty, or non-string input.
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
export const parseCurrencyString = (input: string): number => {
  if (!input || typeof input !== "string" || input.trim() === "") return 0;

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
        // only one present
        if (lastComma !== -1) {
          const decimalCandidate = cleanedNoSpace.length - lastComma - 1;
          if (decimalCandidate === 2) {
            cleanedNoSpace = cleanedNoSpace
              .replace(/\./g, "")
              .replace(",", ".");
          } else {
            cleanedNoSpace = cleanedNoSpace.replace(/,/g, "");
          }
        } else if (lastDot !== -1) {
          const decimalCandidate = cleanedNoSpace.length - lastDot - 1;
          if (decimalCandidate === 2) {
            cleanedNoSpace = cleanedNoSpace.replace(/,/g, "").replace(".", ".");
          } else {
            cleanedNoSpace = cleanedNoSpace.replace(/\./g, "");
          }
        }
      }
    }
  }

  const num = parseFloat(cleanedNoSpace) || 0;
  return isNegative ? -num : num;
};
