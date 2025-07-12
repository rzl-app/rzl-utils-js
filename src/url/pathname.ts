import { removeAllSpaceString } from "@/strings/sanitize";
import { NormalizePathnameError } from "./exceptions";

/**
 * 📌 **Get Prefix from URL with Optional Base or Auto-detection (Supports String or Array of URLs)**
 *
 * @description
 * This function extracts the prefix from one or more URLs. It can either:
 * - Use a provided `base` string or an array of strings to check and return the matching prefix.
 * - Automatically detect the prefix if no `base` is provided by analyzing the first part of the URL.
 *
 * The function is flexible and can handle both scenarios:
 * 1. **When the base is provided as a single string or an array of strings**: The function will check if the URL starts with one of the provided base(s) and return the matching base.
 * 2. **When the base is not provided**: The function will automatically detect the prefix by splitting the URL or using a regex.
 *
 * **Important Notes**:
 * - If a base (or an array of bases) is provided, the URL must start with one of the given base(s).
 * - If no base is provided, the function will attempt to detect the prefix automatically.
 * - The `url` parameter can be either a string or an array of strings.
 *
 * @param {string|string[]} url The full URL(s) from which the prefix should be extracted. Can be a string or an array of strings.
 * @param {string|string[]|null} [base=null] The base URL(s) (e.g., "/settings"). It can be a string or an array of strings. If provided, it will be used to check the URL(s). If not provided, the prefix will be auto-detected.
 * @param {number} [levels=1] The number of levels to include in the prefix (default is 1). For example, with `levels = 2`, the function will return the first two parts of the URL.
 * @param {boolean} [removeDuplicates=true] Whether to remove duplicates from the result if multiple URLs are passed (default is `true`).
 * @returns {string|string[]|null} The detected prefix or the matching base if the URL starts with one of the bases. Returns `null` if no matching base or prefix is found. If multiple URLs are provided, returns an array of results, optionally deduplicated.
 *
 * ---
 *
 * ## **🔹 Usage Examples**
 *
 * ### ✅ **Correct Usage (With Single URL and Single Base)**
 * ```ts
 * const result = getPrefixPathname("/settings/profile", "/settings");
 * console.log(result); // Output: "/settings"
 * ```
 *
 * ### ✅ **Correct Usage (With Multiple URLs and Single Base)**
 * ```ts
 * const result = getPrefixPathname(["/settings/profile", "/settings/password"], "/settings");
 * console.log(result); // Output: ["/settings", "/settings"]
 * ```
 *
 * ### ✅ **Correct Usage (With Multiple URLs and Multiple Bases)**
 * ```ts
 * const result = getPrefixPathname(["/settings/profile", "/admin/password"], ["/settings", "/admin"]);
 * console.log(result); // Output: ["/settings", "/admin"]
 * ```
 *
 * ### ✅ **Correct Usage (Auto-detection of Base)**
 * ```ts
 * const result = getPrefixPathname("/settings/profile");
 * console.log(result); // Output: "/settings"
 * ```
 *
 * ### ✅ **Correct Usage (Auto-detection with Multiple URLs)**
 * ```ts
 * const result = getPrefixPathname(["/amin/profile", "/settings/password"]);
 * console.log(result); // Output: ["/amin", "/settings"]
 * ```
 *
 * ### ✅ **Correct Usage (With an Array of URLs and Base)**
 * ```ts
 * const routes = [
 *   "/settings/profile",
 *   "/settings/password",
 *   "/settings/other-path",
 *   "/other-path/xyz",
 * ];
 *
 * // With base provided as a string
 * routes.forEach(route => {
 *   console.log(getPrefixPathname(route, '/settings')); // Output: /settings
 * });
 *
 * // With base provided as an array
 * routes.forEach(route => {
 *   console.log(getPrefixPathname(route, ['/settings', '/admin'])); // Output: /settings or /admin depending on the URL
 * });
 *
 * // With multiple URLs and base
 * const multipleUrls = ["/settings/profile", "/admin/settings", "/settings/password"];
 * console.log(getPrefixPathname(multipleUrls, ["/settings", "/admin"]));
 * // Output: ["/settings", "/admin", "/settings"]
 *
 * // Without base (auto-detection)
 * routes.forEach(route => {
 *   console.log(getPrefixPathname(route)); // Output: /settings, /other-path, etc.
 * });
 * ```
 *
 * ### ✅ **Correct Usage (With Duplicates Removed)**
 * ```ts
 * const result = getPrefixPathname(["/settings/profile", "/settings/profile", "/admin/settings"], ["/settings", "/admin"], 1, true);
 * console.log(result); // Output: ["/settings", "/admin"]
 * ```
 *
 * ### ✅ **Correct Usage (With Duplicates Not Removed)**
 * ```ts
 * const result = getPrefixPathname(["/settings/profile", "/settings/profile", "/admin/settings"], ["/settings", "/admin"], 1, false);
 * console.log(result); // Output: ["/settings", "/settings", "/admin"]
 * ```
 *
 * ### ❌ **Incorrect Usage (URL Does Not Match Base)**
 * ```ts
 * const result = getPrefixPathname("/other-path/profile", "/settings");
 * console.log(result); // Output: null
 * ```
 *
 * ---
 *
 * @function
 */
export const getPrefixPathname = (
  url: string | string[],
  base: string | string[] | null = null,
  levels: number = 1,
  removeDuplicates: boolean = true
): string | string[] | null => {
  const errors: string[] = [];

  if (typeof url !== "string" && !Array.isArray(url)) {
    errors.push(
      `'url' must be a string or an array of strings. Received: ${typeof url}`
    );
  }
  if (typeof base !== "string" && !Array.isArray(base) && base !== null) {
    errors.push(
      `'base' must be a string, array of strings, or null. Received: ${typeof base}`
    );
  }
  if (typeof levels !== "number") {
    errors.push(`'levels' must be a number. Received: ${typeof levels}`);
  }
  if (typeof removeDuplicates !== "boolean") {
    errors.push(
      `'removeDuplicates' must be a boolean. Received: ${typeof removeDuplicates}`
    );
  }

  if (errors.length > 0) {
    throw new TypeError(
      `Invalid parameter(s) in getPrefixPathname:\n- ${errors.join("\n- ")}`
    );
  }

  // Helper function to process a single URL
  function processUrl(singleUrl: string): string | null {
    // If a base is provided, check if URL starts with one of the bases
    if (base) {
      singleUrl = normalizePathname(singleUrl);

      if (Array.isArray(base)) {
        // Check if the URL starts with any of the base values in the array
        for (const b of base) {
          if (singleUrl.startsWith(normalizePathname(b))) {
            return normalizePathname(b); // Return the matching base if URL starts with it
          }
        }
      } else if (singleUrl.startsWith(normalizePathname(base))) {
        // If base is a single string, check if URL starts with it
        return normalizePathname(base); // Return the base if URL starts with it
      }
      return null; // Return null if the URL does not match any base
    }

    // If no base is provided, detect the base automatically
    const parts = singleUrl.split("/").filter(Boolean); // Split URL into parts

    // Return the first `levels` parts as the prefix
    return `/${parts.slice(0, levels).join("/")}`;
  }

  // If url is an array, process each URL and return an array of results
  if (Array.isArray(url)) {
    const result = url.map(processUrl).filter((r): r is string => r !== null);

    // Remove duplicates if required
    const uniqueResult = removeDuplicates ? [...new Set(result)] : result;

    // If all results are the same, return just the first one
    if (uniqueResult.length === 1) {
      return uniqueResult[0];
    }

    return uniqueResult;
  }

  // If url is a single string, process it and return the result
  return processUrl(url);
};

/**
 * 📌 **Extract First Prefix from Result or Return Default Path**
 *
 * @description
 * This function processes the result of `getPrefixPathname` and returns:
 * - The first element of the array if the result is an array.
 * - The string itself if the result is a string.
 * - A custom default value if the result is neither a string nor an array.
 *
 * @param {string|string[]|null} result The result from `getPrefixPathname`.
 * @param {string} [defaultValue="/"] The custom default value to return if the result is invalid or null. Default is `"/"`.
 * @returns {string} The first element of the array, the string itself, or the default value.
 *
 * ---
 *
 * ## **🔹 Usage Example**
 *
 * ### ✅ **Correct Usage (With Array Result)**
 * ```ts
 * const result = getPrefixPathname(["/settings/profile", "/admin/settings"], ["/settings", "/admin"]);
 * console.log(getFirstPrefix(result)); // Output: "/settings"
 * ```
 *
 * ### ✅ **Correct Usage (With Single String Result)**
 * ```ts
 * const result = getPrefixPathname("/settings/profile", "/settings");
 * console.log(getFirstPrefix(result)); // Output: "/settings"
 * ```
 *
 * ### ✅ **Correct Usage (With Null or Invalid Result and Custom Default)**
 * ```ts
 * const result = getPrefixPathname("/unknown/profile", "/settings");
 * console.log(getFirstPrefix(result, "/home")); // Output: "/home"
 * ```
 *
 * ---
 *
 * @function
 */
export const getFirstPrefixPathname = (
  result: string | string[] | null,
  defaultValue: string = "/"
): string => {
  // Validate defaultValue is a proper string
  if (typeof defaultValue !== "string" || !defaultValue.trim()) {
    throw new TypeError(
      `Invalid parameter: 'defaultValue' must be a non-empty string. Received: ${typeof defaultValue} (${defaultValue})`
    );
  }

  // Validate result is only allowed types
  if (
    result !== null &&
    !(
      typeof result === "string" ||
      (Array.isArray(result) &&
        result.every((item) => typeof item === "string"))
    )
  ) {
    throw new TypeError(
      `Invalid parameter: 'result' must be a string, an array of strings, or null. Received: ${JSON.stringify(
        result
      )}`
    );
  }

  // If result is an array, return the first element
  if (Array.isArray(result)) {
    return result?.[0] || normalizePathname(defaultValue);
  }

  // If result is a string, return the string itself
  if (typeof result === "string") {
    return normalizePathname(result);
  }

  // If result is null or any other case, return the default value
  return normalizePathname(defaultValue);
};

/** ---------------------------------
 * * ***Normalizes a given pathname by ensuring proper formatting.***
 * ---------------------------------
 *
 * @param {string} pathname - The pathname to be normalized.
 * @param {string} [defaultPath='/'] - The default value to return if the pathname is invalid or empty. Defaults to "/".
 * @returns {string} A properly formatted pathname. If string is null, undefined, or empty, it returns the default value.
 * @throws {NormalizePathnameError} If an invalid pathname is provided.
 */
export const normalizePathname = (
  pathname?: string | null,
  defaultPath: string = "/"
): string => {
  // Validate defaultPath
  if (typeof defaultPath !== "string" || !defaultPath.trim()) {
    throw new TypeError(
      `Invalid parameter: 'defaultPath' must be a non-empty string. Received: ${typeof defaultPath} (${defaultPath})`
    );
  }

  // If the pathname is invalid (null, undefined, or an empty string), return the default value
  if (typeof pathname !== "string" || pathname.trim() === "") {
    return defaultPath;
  }

  try {
    // Trim spaces from the string (only trim leading and trailing spaces)
    pathname = removeAllSpaceString(pathname, { trimOnly: true });

    // If the pathname is a full URL, extract the pathname, search parameters, and hash
    if (pathname.startsWith("http://") || pathname.startsWith("https://")) {
      const url = new URL(pathname);
      return `${url.pathname}${url.search}${url.hash}`;
    }

    // Ensure the pathname starts with "/"
    return "/" + pathname.replace(/^\/+/, "");
    // return pathname.startsWith("/") ? pathname : `/${pathname}`;
  } catch (error) {
    // Handle any errors that occur during processing
    const err =
      error instanceof Error
        ? error
        : new Error("Unknown error from function `normalizePathname()`");
    throw new NormalizePathnameError(
      `Failed to normalize pathname in function \`normalizePathname()\`: ${err.message}`,
      err
    );
  }
};
