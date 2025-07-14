/** --------------------------------------------------
 * * ***Options for cleaning and transforming parsed JSON data.***
 * --------------------------------------------------
 */
interface CleanParsedDataOptions {
  /** Convert numeric strings to numbers (e.g., `"42"` → `42`).
   *
   * @default false
   */
  convertNumbers?: boolean;

  /** Convert `"true"` / `"false"` strings to boolean values.
   *
   * @default false
   */
  convertBooleans?: boolean;

  /** Convert valid date strings into `Date` objects.
   *
   * @default false
   */
  convertDates?: boolean;

  /** Custom date formats to be parsed (e.g., `["DD/MM/YYYY", "MM/DD/YYYY"]`).
   *
   * @default []
   */
  customDateFormats?: string[];

  /** Remove `null` values from objects and arrays.
   *
   * @default false
   */
  removeNulls?: boolean;

  /** Remove `undefined` values from objects and arrays.
   *
   * @default false
   */
  removeUndefined?: boolean;

  /** Remove empty objects `{}` from the final output.
   *
   * @default false
   */
  removeEmptyObjects?: boolean;

  /** Remove empty arrays `[]` from the final output.
   *
   * @default false
   */
  removeEmptyArrays?: boolean;

  /** Strict mode: Removes values that do not match selected conversions.
   *
   * @default false
   */
  strictMode?: boolean;

  /** Enable error logging if JSON parsing fails.
   *
   * @default false
   */
  loggingOnFail?: boolean;

  /** Custom error handler function.
   *
   * @default undefined
   */
  onError?: (error: unknown) => void;
}

/** --------------------------------------------------
 * * ***Cleans parsed JSON data based on provided options.***
 * --------------------------------------------------
 *
 * @template T - Expected output type.
 * @param {unknown} data - The parsed JSON data.
 * @param {CleanParsedDataOptions} options - Cleaning options.
 * @returns {T | undefined} - The cleaned data.
 *
 * @example
 * // Convert numbers and remove nulls
 * const result = cleanParsedData({ age: "25", name: null }, { convertNumbers: true, removeNulls: true });
 * console.log(result); // Output: { age: 25 }
 *
 * @example
 * // Convert boolean strings
 * const result = cleanParsedData({ isActive: "true" }, { convertBooleans: true });
 * console.log(result); // Output: { isActive: true }
 */
export const cleanParsedData = <T = unknown>(
  data: unknown,
  options: CleanParsedDataOptions = {}
): T | undefined | null => {
  if (typeof options !== "object") {
    throw new TypeError(
      `props 'options' must be \`object\` or empty as \`undefined\` type!`
    );
  }

  if (data === null) return options.removeNulls ? undefined : null;
  if (data === undefined)
    return options.removeUndefined ? undefined : undefined;

  if (Array.isArray(data)) {
    const cleanedArray = data
      .map((item) => cleanParsedData(item, options))
      .filter((item) => item !== undefined);

    return options.removeEmptyArrays && cleanedArray.length === 0
      ? undefined
      : (cleanedArray as T);
  }

  if (typeof data === "object" && data !== null) {
    const cleanedObject: Record<string, unknown> = {};
    const obj = data as Record<string, unknown>;

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const cleanedValue = cleanParsedData(obj[key], options);
        if (cleanedValue !== undefined) {
          cleanedObject[key] = cleanedValue;
        }
      }
    }

    return options.removeEmptyObjects && Object.keys(cleanedObject).length === 0
      ? undefined
      : (cleanedObject as T);
  }

  if (typeof data === "string") {
    const trimmed = data.trim();

    if (options.convertNumbers && !isNaN(Number(trimmed))) {
      return Number(trimmed) as T;
    }

    if (options.convertBooleans) {
      if (trimmed === "true") return true as T;
      if (trimmed === "false") return false as T;
    }

    if (options.convertDates) {
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(trimmed)) {
        return new Date(trimmed) as T;
      }

      if (options.customDateFormats?.length) {
        for (const format of options.customDateFormats) {
          const date = parseCustomDate(trimmed, format);
          if (date) return date as T;
        }
      }
    }

    return options.strictMode ? undefined : (trimmed as T);
  }

  return options.strictMode ? undefined : (data as T);
};

/** --------------------------------------------------
 * * ***Parses custom date formats like "DD/MM/YYYY" or "MM/DD/YYYY".***
 * --------------------------------------------------
 *
 * @param {string} dateString - Date string to parse.
 * @param {string} format - Date format to match.
 * @returns {Date | null} - Returns a Date object if valid, otherwise null.
 */
export const parseCustomDate = (
  dateString: string,
  format: string
): Date | null => {
  if (typeof dateString !== "string" && typeof format !== "string") {
    throw new TypeError(
      `props 'dateString' and 'format' must be \`string\` type!`
    );
  }

  const dateParts = dateString.split(/[-/]/).map(Number);
  if (dateParts.length !== 3) return null;

  const [part1, part2, part3] = dateParts;
  const isDMY = format === "DD/MM/YYYY" ? part1 > 12 : part2 > 12;
  const day = isDMY ? part1 : part2;
  const month = isDMY ? part2 - 1 : part1 - 1;
  const year = part3;

  const date = new Date(year, month, day);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * --------------------------------------------------
 * * ***Safely parses JSON while handling errors and applying transformations.***
 * --------------------------------------------------
 *
 * - Automatically converts valid JSON strings to objects, arrays, numbers, etc.
 * - Can clean and transform data (e.g. convert strings to numbers, booleans, or dates)
 *   based on the provided options.
 * - Returns `undefined` if parsing fails, `null` if input is `null`.
 *
 * @template T - Expected output type after parsing and cleaning.
 * @param {string | null | undefined} value - The JSON string to parse.
 * @param {CleanParsedDataOptions} [options] - Options for cleaning, converting values,
 *   logging on failure, strict mode, custom date parsing, and error callbacks.
 * @returns {T | undefined | null} The parsed and cleaned data.
 *
 * @throws {TypeError} If `options` is not an object.
 *
 * @example
 * // Parse and clean JSON with number & boolean conversion
 * const result = safeJsonParse('{"age": "30", "isActive": "true"}', { convertNumbers: true, convertBooleans: true });
 * console.log(result);
 * // → { age: 30, isActive: true }
 *
 * @example
 * // Parse with strict mode (removes invalid values)
 * const result = safeJsonParse('{"name": "   ", "score": "99abc"}', { convertNumbers: true, strictMode: true });
 * console.log(result);
 * // → {} (empty object because all values are invalid)
 *
 * @example
 * // Parse JSON with custom date format
 * const result = safeJsonParse('{"birthday": "25/12/2000"}', { convertDates: true, customDateFormats: ["DD/MM/YYYY"] });
 * console.log(result);
 * // → { birthday: new Date("2000-12-25T00:00:00.000Z") }
 *
 * @example
 * // Handle parsing error with onError callback
 * safeJsonParse("{not-valid-json}", {
 *   loggingOnFail: true,
 *   onError: (err) => console.log("Custom handler:", err.message)
 * });
 * // → Logs parsing error and calls custom handler
 */
export const safeJsonParse = <T = unknown>(
  value: string | null | undefined,
  options: CleanParsedDataOptions = {}
): T | undefined | null => {
  if (value === null) return null;
  if (typeof value !== "string") return undefined;

  if (typeof options !== "object") {
    throw new TypeError(
      `props 'options' must be \`object\` or empty as \`undefined\` type!`
    );
  }

  try {
    const parsed = JSON.parse(value);
    return cleanParsedData<T>(parsed, options);
  } catch (error) {
    if (options.loggingOnFail) {
      console.error("JSON parsing failed from `safeJsonParse`:", error);
    }
    if (options.onError) {
      options.onError(error);
    }
    return undefined;
  }
};
