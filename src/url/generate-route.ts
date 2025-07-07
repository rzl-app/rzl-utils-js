/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable no-unused-vars */
/**
 * Extracts dynamic route parameters from a given route string.
 *
 * This utility type recursively searches for dynamic segments within a route,
 * extracting each parameter and constructing an object where each key represents
 * a dynamic segment and its value is of type `string`.
 *
 * @template T - The route string containing potential dynamic segments.
 *
 * @example
 * ```ts
 * type Params1 = ExtractRouteParams<"/user/[id]">;
 * // Result: { id: string }
 *
 * type Params2 = ExtractRouteParams<"/post/[slug]/comment/[commentId]">;
 * // Result: { slug: string; commentId: string }
 *
 * type Params3 = ExtractRouteParams<"/dashboard">;
 * // Result: {} (no dynamic parameters)
 * ```
 */
export type ExtractRouteParams<T extends string> =
  T extends `${infer _Start}[${infer Param}]${infer Rest}`
    ? { [K in Param]: string } & ExtractRouteParams<Rest>
    : {}; // Ensures an empty object if no dynamic segments are found.

/**
 * Determines whether a given route contains dynamic segments.
 *
 * This type checks if the route includes at least one `[param]` pattern.
 * If it does, the result is `true`, otherwise `false`.
 *
 * @template T - The route string to be evaluated.
 *
 * @example
 * ```ts
 * type HasParams1 = HasDynamicSegments<"/user/[id]">;
 * // Result: true
 *
 * type HasParams2 = HasDynamicSegments<"/settings/profile">;
 * // Result: false
 *
 * type HasParams3 = HasDynamicSegments<"/blog/[category]/[slug]">;
 * // Result: true
 * ```
 */
export type HasDynamicSegments<T extends string> =
  T extends `${string}[${string}]${string}` ? true : false;

/**
 * Generates a URL by replacing dynamic route parameters with provided values.
 *
 * @template T - The route string containing dynamic segments in the format `[param]`.
 *
 * @param {T} route - The route string containing dynamic segments.
 * @param {ExtractRouteParams<T>} [params] - An object containing key-value pairs that match the dynamic segments in the route.
 *
 * @returns {string} The formatted URL with all dynamic segments replaced.
 *
 * @throws {Error} If the route contains dynamic segments but no parameters object is provided.
 * @throws {Error} If a required parameter is missing from the `params` object.
 * @throws {Error} If a parameter value is an empty string.
 * @throws {Error} If any parameter contains invalid characters like `?`, `&`, `=`, `#`, `/`, spaces, `'`, `"`, `(`, `)`, `+`, `;`, `%`, `@`, or `:`, which can cause URL issues.
 *
 * @example
 * // Basic usage
 * generateRoute("/user/[id]", { id: "123" });
 * // Returns: "/user/123"
 *
 * @example
 * // No dynamic segments, returns as-is
 * generateRoute("/dashboard");
 * // Returns: "/dashboard"
 *
 * @example
 * // Throws an error due to missing parameters object
 * generateRoute("/profile/[username]");
 * // ❌ Error: 🚨 Missing parameters object for route: "/profile/[username]"
 *
 * @example
 * // Throws an error due to an empty parameter value
 * generateRoute("/post/[category]/[slug]", { category: "tech", slug: "" });
 * // ❌ Error: 🚨 Parameter "slug" cannot be empty in route: "/post/[category]/[slug]"
 *
 * @example
 * // Throws an error due to parameter containing invalid characters
 * generateRoute("/search/[query]", { query: "how to?learn" });
 * // ❌ Error: 🚨 Parameter "query" contains invalid character "?" in route: "/search/[query]"
 *
 * @example
 * // Handles leading/trailing slashes correctly
 * generateRoute("/blog/[category]/[slug]", { category: "/news/", slug: "/latest-update/" });
 * // Returns: "/blog/news/latest-update"
 */
export function generateRoute<T extends string>(
  route: T,
  ...params: HasDynamicSegments<T> extends true ? [ExtractRouteParams<T>] : []
): string;

export function generateRoute<T extends string>(
  route: T,
  params?: ExtractRouteParams<T>
): string {
  // If no dynamic segments exist, return the route as-is.
  if (!route.includes("[")) return route;

  // Ensure parameters are provided for dynamic routes.
  if (!params) {
    throw new Error(`🚨 Missing parameters object for route: "${route}"`);
  }

  return route
    .replace(/\[(\w+)\]/g, (_, key) => {
      // Check if parameter is missing
      if (!(key in params)) {
        throw new Error(
          `🚨 'generateRoute' Failed cause: Missing parameter: "${key}" for route: "${route}"`
        );
      }

      const value = (params[key as keyof typeof params] as string).trim();

      // Ensure parameter is not empty
      if (!value) {
        throw new Error(
          `🚨 'generateRoute' Failed cause: Parameter "${key}" cannot be empty in route: "${route}"`
        );
      }

      // Check for invalid characters that can break the URL format
      const invalidChars = [
        "?",
        "&",
        "#",
        "=",
        "/",
        " ",
        // ".",
        "'",
        // eslint-disable-next-line quotes
        '"',
        "(",
        ")",
        "+",
        ";",
        "%",
        "@",
        ":"
      ];

      // Filter out invalid characters from the value
      const foundInvalidChars = invalidChars.filter((char) => value.includes(char));

      if (foundInvalidChars.length > 0) {
        throw new Error(
          `🚨 'generateRoute' Failed cause: Parameter "${key}" contains invalid characters (${foundInvalidChars.join(", ")}) in route: "${route}". These characters are not allowed because they could cause issues in URL structure. The following characters are forbidden in route parameters: (${invalidChars.join(", ")}).`
        );
      }

      // Clean up leading/trailing slashes and avoid multiple slashes in the route
      return value.replace(/^\/+|\/+$/g, "");
    })
    .replace(/\/+/g, "/"); // Remove duplicate slashes to avoid `//`
}
