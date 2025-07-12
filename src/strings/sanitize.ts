/** ----------------------------------------------------------
 * * ***Normalizes a string by ensuring it is a valid string and trimming whitespace.*** ✅
 * ----------------------------------------------------------
 *
 * @description If the input is `undefined`, `null`, or an `empty string` after trimming,
 * it returns an empty string `("")`.
 *
 * @param {string | undefined} input - The string to normalize.
 * @returns {string} A trimmed string or an empty string if the input is invalid.
 */
export const normalizeString = (input?: string | null): string => {
  return typeof input === "string" && input.trim().length ? input.trim() : "";
};

/** ----------------------------------------------------------
 * * ***Removes all spaces from a string and trimmed or trimmed only the string based on the options provided.*** ✅
 * ----------------------------------------------------------
 *
 * @param string - The string to be processed.
 * @param options - The options object.
 * @returns A string with spaces removed and trimmed or trimmed only, depending on the option, if string is null or undefined will return "" as empty string.
 */
export const removeAllSpaceString = (
  string?: string | null,
  options: {
    /**
     * @description If true, only trims the string.
     *
     * @default false */
    trimOnly?: boolean;
  } = {
    trimOnly: false,
  }
): string => {
  if (typeof string === "string") {
    // Ensure options is an object and Defensive options check
    if (typeof options !== "object" || options === null) {
      options = {};
    }

    const { trimOnly = false } = options;

    // If trimOnly is true, trim the string and return
    if (trimOnly) return string.trim();

    // Remove all spaces (including tabs, newlines, etc.)
    return string.replace(/\s+/g, "");
  }
  return "";
};

/** ----------------------------------------------------------
 * * ***Removes all duplicates spaces from a string (to 1x space only each duplicate space) and trimmed or trimmed only the string based on the options provided.*** ✅
 * ----------------------------------------------------------
 *
 * @param string - The string to be processed.
 * @param options - The options object.
 * @returns A string with spaces removed and trimmed or trimmed only, depending on the option, if string is null or undefined will return "" as empty string.
 */
export const removeDuplicateSpaceString = (
  string?: string | null,
  options: {
    /**
     * @description If true, only trims the string.
     *
     * @default false */
    trimOnly?: boolean;
  } = {
    trimOnly: false,
  }
): string => {
  if (typeof string == "string") {
    // Ensure options is an object and Defensive options check
    if (typeof options !== "object" || options === null) {
      options = {};
    }

    const { trimOnly = false } = options;

    // If trimOnly is true, trim the string and return
    if (trimOnly) return string.trim();

    // Remove all duplicate spaces (including tabs, newlines, etc.)
    return string.replace(/\s+/g, " ");
  }
  return "";
};

/** ----------------------------------------------------------
 * * ***Removes all HTML tags from a given string.*** ✅
 * ----------------------------------------------------------
 *
 * This function ensures that the input is a valid string before proceeding.
 * If the input is empty or not a string, it returns the original input.
 *
 * @param {string} [input] - The string that may contain HTML tags.
 * @returns {string | undefined | null} The cleaned string without HTML tags, or the original input if invalid.
 */
export const stripHtmlTags = <T extends string | null | undefined = undefined>(
  input?: T
): T => {
  if (!input || typeof input !== "string" || !input.trim().length) {
    return undefined as T;
  }

  return input.replace(/<[^>]*>/g, "") as T;
};
