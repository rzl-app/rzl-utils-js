/** -----------------------------------------------
 * * ***Retrieves and formats an environment port variable.***
 * -----------------------------------------------
 *
 * - Extracts only digits from the input.
 * - If no digits found, returns an empty string.
 * - By default does NOT prefix with a colon.
 *   Use `{ prefixColon: true }` to prefix with a colon.
 *
 * @param envVar The environment variable string.
 * @param options Optional object: `{ prefixColon?: boolean }`.
 * @returns A string like ":8080" or "8080", or "" if no digits.
 *
 * @throws TypeError if `options` is not an object or `prefixColon` is not boolean.
 *
 * @example
 * formatEnvPort("port:8080");           // "8080"
 * formatEnvPort("port:8080", { prefixColon: true }); // ":8080"
 */
export const formatEnvPort = (
  envVar?: string,
  options?: { prefixColon?: boolean }
): string => {
  if (typeof envVar !== "string" || !envVar.trim()) return "";

  if (options !== undefined) {
    if (
      typeof options !== "object" ||
      options === null ||
      Array.isArray(options)
    ) {
      throw new TypeError("Options must be an object.");
    }
    if ("prefixColon" in options && typeof options.prefixColon !== "boolean") {
      throw new TypeError("Option `prefixColon` must be a boolean.");
    }
  }

  const digitsOnly = envVar.replace(/\D+/g, "");
  if (!digitsOnly) return "";

  const prefixColon = options?.prefixColon ?? false;

  return prefixColon ? `:${digitsOnly}` : digitsOnly;
};
