import { id, enUS, type Locale } from "date-fns/locale";
import { format as formatDns, type FormatOptions, parse } from "date-fns";
import type { OmitStrict } from "@/types";

/** ----------------------------------------------------------
 * * ***Formats a date into a custom string format.***
 * ----------------------------------------------------------
 *
 * - Supports only `YYYY`, `MM`, `DD`, `hh`, `mm`, and `ss` as placeholders.
 * - Returns `null` if the date is invalid or not provided.
 * - Defaults to `"YYYY-MM-DD hh:mm:ss"` format if none is specified.
 *
 * @param {string | Date | null} [date] - The date to format.
 * @param {string} [format="YYYY-MM-DD hh:mm:ss"] - The desired date format.
 * @returns {string | null} The formatted date string or `null` if invalid.
 *
 * @example
 * formatCustomDateTime(new Date());
 * // output: "2024-02-09 14:30:45"
 * formatCustomDateTime("2024-01-01", "DD/MM/YYYY");
 * // output: "01/01/2024"
 * formatCustomDateTime(null | undefined);
 * // output: null
 */
export const formatDateTimeCustoms = (
  date?: string | Date | null,
  /** @default "YYYY-MM-DD hh:mm:ss" */
  format: string = "YYYY-MM-DD hh:mm:ss"
): string | null => {
  try {
    if (
      !date ||
      !(
        date instanceof Date ||
        typeof date === "string" ||
        typeof format === "string"
      )
    ) {
      return null;
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return null; // Handle invalid dates

    const pad2 = (n: number) => n.toString().padStart(2, "0");

    const map: Record<string, string> = {
      YYYY: parsedDate.getFullYear().toString(),
      MM: pad2(parsedDate.getMonth() + 1),
      DD: pad2(parsedDate.getDate()),
      hh: pad2(parsedDate.getHours()),
      mm: pad2(parsedDate.getMinutes()),
      ss: pad2(parsedDate.getSeconds()),
    };

    const result = Object.entries(map).reduce(
      (prev, [key, value]) => prev.replace(key, value),
      format
    );

    return !result.includes("NaN") ? result : null;
  } catch {
    return null;
  }
};

/** ----------------------------------------------------------
 * * ***Formats a date using the `Intl.DateTimeFormat` API.***
 * ----------------------------------------------------------
 *
 * - Supports custom locales and formatting options.
 * - Returns `null` if the date is invalid or not provided.
 * - Defaults to `"en-US"` locale if none is specified.
 *
 * @param {string | Date | null} [date] - The date to format.
 * @param {Intl.DateTimeFormatOptions & { locale?: string }} [options] - Formatting options.
 * @returns {string | null} The formatted date string or `null` if invalid.
 *
 * @example
 * formatDateWithIntl(new Date());
 * // output: "1/1/2024"
 * formatDateWithIntl("2024-01-01", { locale: "fr-FR", dateStyle: "long" });
 * // output: "1 janvier 2024"
 * formatDateWithIntl(null | undefined);
 * // output: null
 */
export const formatDateWithIntl = (
  date?: string | Date | null,
  options?: Intl.DateTimeFormatOptions & {
    locale?: Intl.LocalesArgument;
  }
): string | null => {
  if (!date || !(date instanceof Date || typeof date === "string")) return null;

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return null; // Handle invalid dates

  // Ensure options is an object and Defensive options check
  if (typeof options !== "object" || options === null) {
    options = {};
  }

  const { locale = "en-US", ...restProps } = options;

  return new Intl.DateTimeFormat(
    locale?.toString()?.trim()?.length ? locale : "en-US",
    restProps
  ).format(parsedDate);
};

/** ----------------------------------------------------------
 * * ***Formats a date into a human-readable string using `date-fns`.***
 * ----------------------------------------------------------
 *
 * - Supports custom formats and locales (`"id"` for Indonesian, `"en"` for English).
 * - Returns `null` if the date is invalid or not provided.
 * - Default format: `"dd MMM yyyy - HH:mm:ss"` (e.g., `"01 Jan 2024 - 14:30:00"`).
 *
 * @param {string | Date | null} [date] - The date to format.
 * @param {object} [options] - Options for formatting and parsing a date using `date-fns`.
 * @param {string} [options.format="dd MMM yyyy - HH:mm:ss"] - The date format.
 * @param {"id" | "en" | string} [options.locale="en"] - The locale for formatting.
 * @returns {string | null} The formatted date string or `null` if invalid.
 *
 * @example
 * formatDate(new Date());
 * // output: "01 Jan 2024 - 14:30:00"
 * formatDate("2024-01-01T12:00:00Z", { format: "dd/MM/yyyy", locale: "id" });
 * // output: "01/01/2024"
 * formatDate(null | undefined);
 * // output: null
 */
export const formatDateWithFns = (
  date?: string | Date | null,
  /**
   * Options for formatting and parsing a date using `date-fns`.
   */
  options?: OmitStrict<FormatOptions, "locale", true, false> & {
    /**
     * Output format string using `date-fns/format`.
     * @default "dd MMM yyyy - HH:mm:ss"
     * @example "dd MMMM yyyy, HH:mm:ss"
     */
    format?: string;

    /**
     * The locale to be used for formatting.
     * If `string` Only Accepts "id" for Indonesian or "en" for English.
     * Or you can put props `Locale` from `date-fns/locale`, e.g :
     *
     * ```ts
     *    import { ar } from "date-fns/locale";
     *
     *    // then passing `ar` to this props.
     *    formatDateWithFns(
     *    // your date input...,
     *    {
     *       locale: ar,
     *       //.... other options.
     *    });
     *
     * ```
     * @default "id"
     */
    locale?: "id" | "en" | (string & {}) | Locale;

    /**
     * The Input locale to be used for parsing `inputFormat`.
     * If `string` Only Accepts "id" for Indonesian or "en" for English.
     * Required if `date` is a non-standard string like "03 Mei 2025 10:25:42").
     *
     *  Or you can put props `Locale` from `date-fns/locale`, e.g :
     *
     * ```ts
     *    import { ar } from "date-fns/locale";
     *
     *    // then passing `ar` to this props.
     *    formatDateWithFns(
     *    // your date input...,
     *    {
     *        inputLocale: ar,
     *        //.... other options.
     *    });
     *```

     * @default undefined
     */
    inputLocale?: "id" | "en" | (string & {}) | Locale;

    /**
     * Input format string for parsing non-ISO string dates
     * (e.g., localized strings like "03 Mei 2025 10:25:42").
     * Required if `date` is a non-standard string.
     * @example "dd MMMM yyyy HH:mm:ss"
     */
    inputFormat?: string;
  }
): string | null => {
  if (!date || !(date instanceof Date || typeof date === "string")) return null;

  // Ensure options is an object and Defensive options check
  if (typeof options !== "object" || options === null) {
    options = {};
  }

  const {
    format = "dd MMM yyyy - HH:mm:ss",
    inputFormat,
    locale,
    inputLocale,
    ...restOptions
  } = options;

  let parsedDate: Date;

  if (typeof date === "string" && inputFormat && inputLocale) {
    const valueOfInputLocale =
      typeof inputLocale === "string"
        ? inputLocale === "id"
          ? id
          : enUS
        : inputLocale;

    try {
      parsedDate = parse(date, inputFormat, new Date(), {
        locale: valueOfInputLocale,
      });
    } catch {
      return null;
    }
  } else {
    parsedDate = new Date(date);
  }

  if (isNaN(parsedDate.getTime())) return null;

  const valueOfLocale =
    typeof locale === "string" ? (locale === "id" ? id : enUS) : locale;

  return formatDns(parsedDate, format, {
    ...restOptions,
    locale: valueOfLocale,
  });
};

/** ----------------------------------------------------------
 * * ***Returns the formatted GMT offset (e.g., `+0700`, `-0500`) for a given date.***
 * ----------------------------------------------------------
 *
 * - If `date` is **not provided**, it defaults to the current date.
 * - If `date` is **invalid**, it returns `"0"`.
 * - The returned string follows the **GMT offset format** (`±HHMM`).
 *
 * @param {string | Date | null} [date] - The date to get the GMT offset from.
 * @returns {string} The GMT offset (e.g., `"+0700"`, `"-0500"`, or `"0"` if invalid).
 *
 * @example
 * getGMTOffset();
 * // output: Returns the current GMT offset (e.g., "+0700")
 * getGMTOffset(null);
 * // output: Returns offset for current date.
 * getGMTOffset(new Date());
 * // output: Returns the current GMT offset
 * getGMTOffset("2024-02-09");
 * // output: "+0700" (depends your system/server GMT offset)
 * getGMTOffset("2024-01-01T12:00:00Z");
 * // output: Returns "+0000"
 * getGMTOffset("invalid-date");
 * // output: "0"
 */
export const getGMTOffset = (date?: string | Date | null): string => {
  try {
    if (!date || (typeof date === "string" && !date.trim())) {
      date = new Date(); // Default to current date
    } else if (!(date instanceof Date || typeof date === "string")) {
      return "0"; // Invalid type
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "0"; // Handle invalid dates

    // const padZero = (num: number): string => (num < 10 ? "0" : "") + num;
    const padZero = (num: number) => num.toString().padStart(2, "0");

    let offset = parsedDate.getTimezoneOffset();
    const sign = offset < 0 ? "+" : "-";
    offset = Math.abs(offset);

    return `${sign}${padZero(Math.floor(offset / 60))}${padZero(offset % 60)}`;
  } catch {
    return "0";
  }
};
