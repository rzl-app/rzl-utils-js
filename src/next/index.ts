/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { removeAllSpaceString } from "@/strings/sanitize";
import { normalizePathname } from "@/url/pathname";
import { formatEnvPort } from "@/url/utils";

/**
 * Extracts dynamic route parameters from a given route string.
 *
 * This utility type recursively searches for dynamic segments within a route,
 * extracting each parameter and constructing an object where each key represents
 * a dynamic segment and its value is of type `string`.
 *
 * * ⚠️ ***Notes: This Type only support when using `NextJS`***
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
type ExtractRouteParams<T extends string> =
  T extends `${infer _Start}[${infer Param}]${infer Rest}`
    ? { [K in Param]: string } & ExtractRouteParams<Rest>
    : Record<any, any>; // Ensures an empty object if no dynamic segments are found.

/**
 * Determines whether a given route contains dynamic segments.
 *
 * This type checks if the route includes at least one `[param]` pattern.
 * If it does, the result is `true`, otherwise `false`.
 *
 * * ⚠️ ***Notes: This Type only support when using `NextJS`***
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
type HasDynamicSegments<T extends string> =
  T extends `${string}[${string}]${string}` ? true : false;

/**
 * ---------------------------------
 * * ***Retrieves the base URL of the application.***
 * ---------------------------------
 *
 * This function is designed to be used within Next.js applications.
 * It determines the base URL from the `NEXT_PUBLIC_BASE_URL` environment variable.
 *
 * * ⚠️ ***Notes: This Function only support when using `NextJS`***
 *
 * - If `NEXT_PUBLIC_BASE_URL` is not set, it defaults to `"http://localhost:3000"`.
 * - If `NEXT_PUBLIC_BASE_URL` does **not** contain a port, it appends one from `NEXT_PUBLIC_PORT_FE` if available.
 * - Ensures the final URL is valid and normalized (no trailing slashes).
 *
 * @returns {string} The resolved base URL of the application.
 * @throws {Error} If the constructed URL is invalid or malformed.
 *
 */
export const getBaseUrl = (): string => {
  try {
    // Get the base URL from environment variables or default to localhost
    const rawBaseUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.trim() || "http://localhost:3000";

    // Check if rawBaseUrl already contains a port
    const hasPort = /:\/\/[^/]+:\d+/.test(rawBaseUrl);

    // If no port in base URL, append from NEXT_PUBLIC_PORT_FE
    const withPort = hasPort
      ? rawBaseUrl
      : rawBaseUrl + formatEnvPort(process.env.NEXT_PUBLIC_PORT_FE);

    return new URL(
      // Ensure the URL is valid and normalize it
      removeAllSpaceString(withPort).replace(/\/+$/, "/")
    ).origin;
  } catch (error) {
    throw new Error(
      "Invalid `NEXT_PUBLIC_BASE_URL`, failed to generate from `getBaseUrl()`, Error:" +
        error
    );
  }
};

/** ---------------------------------
 * * ***Retrieves the base API URL of the backend.***
 * ---------------------------------
 *
 * This function determines the backend API base URL from the `NEXT_PUBLIC_BACKEND_API_URL` environment variable.
 * If the variable is not set, it defaults to `"http://localhost:8000"`.
 * It also allows adding an optional suffix to the returned URL.
 *
 * * ⚠️ ***Notes: This Function only support when using `NextJS`***
 *
 * This function determines the backend API base URL from the `NEXT_PUBLIC_BACKEND_API_URL` environment variable.
 * - If `NEXT_PUBLIC_BACKEND_API_URL` is not set, it defaults to `"http://localhost:8000"`.
 * - If `NEXT_PUBLIC_BACKEND_API_URL` does **not** contain a port, it appends one from `NEXT_PUBLIC_PORT_BE` if available.
 * - Supports appending optional suffix (like "/api").
 *
 *
 * @param {Object} options - Configuration options.
 * @param {string} [options.suffix="/"] - The suffix to append to the base API URL.
 * @returns {string} The formatted backend API base URL.
 * @throws {TypeError} If `suffix` is not a `string`.
 * @throws {Error} If `NEXT_PUBLIC_BACKEND_API_URL` is invalid.
 */
export const getBackendApiUrl = ({
  suffix = "/",
}: {
  /** * The Suffix origin base api url, e.g:`http://localhost.com/api`.
   *
   * @default "/" */
  suffix?: string;
} = {}): string => {
  // ✅ Ensure suffix is a string
  if (typeof suffix !== "string") {
    throw new TypeError(
      `Invalid type for 'suffix'. Expected string, received: ${typeof suffix}`
    );
  }

  try {
    // Retrieve the API base URL from environment variables or use the default value
    const rawBaseUrl = removeAllSpaceString(
      process.env.NEXT_PUBLIC_BACKEND_API_URL?.trim() || "http://localhost:8000"
    );

    // Check if base URL already contains port
    const hasPort = /:\/\/[^/]+:\d+/.test(rawBaseUrl);

    // Only add formatEnvPort if base URL doesn't have port
    const withPort = hasPort
      ? rawBaseUrl
      : rawBaseUrl + formatEnvPort(process.env.NEXT_PUBLIC_PORT_BE);

    // Normalize the suffix
    suffix = removeAllSpaceString(suffix).length
      ? removeAllSpaceString(suffix)
      : "/";

    const baseApiUrl = new URL(withPort.replace(/\/+$/, "")).origin;

    // Append the suffix correctly
    return `${baseApiUrl}${suffix.startsWith("/") ? "" : "/"}${suffix.replace(
      /\/+$/,
      ""
    )}`;
  } catch (error) {
    throw new Error(
      "Invalid `NEXT_PUBLIC_BACKEND_API_URL`, failed to generate from `getBackendApiUrl()`, Error:" +
        error
    );
  }
};

/** ---------------------------------
 * * ***Constructs a backend API URL by appending a given pathname to the base API URL.***
 * ---------------------------------
 * This function builds on top of `getBackendApiUrl()`, which determines the base API URL from:
 * - `NEXT_PUBLIC_BACKEND_API_URL` environment variable (or defaults to `"http://localhost:8000"`).
 * - Automatically appends `NEXT_PUBLIC_PORT_BE` if the base URL does not already include a port.
 *
 * Features of this function:
 * - Allows customizing the API path with an optional `prefix` (defaults to `"/api"`).
 * - Can include or exclude the origin (protocol + host) via `withOrigin`.
 * - Normalizes paths to avoid duplicate slashes.
 *
 * * ⚠️ ***Notes: This Function only support when using `NextJS`***
 *
 * @param {string} pathname - The API endpoint path (e.g., `/users` or `/v1/posts`).
 * @param {Object} options - Configuration options.
 * @param {string} [options.prefix="/api"] - The prefix for the API path (default is `"/api"`).
 * @param {boolean} [options.withOrigin=true] - Whether to include the full base URL or return only the API path.
 * @returns {string} The formatted API URL.
 *
 * @throws {TypeError} If `withOrigin` is not a boolean.
 * @throws {TypeError} If `prefix` and `pathname` is not a string.
 * @throws {Error} If constructing the API URL fails due to an invalid base URL.
 *
 * @example
 * getBackendApiEndpoint("/users")
 * // -> "http://localhost:8000/api/users"
 *
 * getBackendApiEndpoint("/users", { withOrigin: false })
 * // -> "/api/users"
 */
export const getBackendApiEndpoint = (
  /** * The pathname api url, e.g:`"http://localhost.com/your-target-prefix-entri-point-api-is-here/your-target-pathname-is-here"`.
   *
   * @default "" */
  pathname: string = "",
  {
    prefix = "/api",
    withOrigin = true,
  }: {
    /** * The prefix pathname api url, e.g:`"http://localhost.com/your-target-prefix-entri-point-api-is-here"`.
     *
     * @default "/api" */
    prefix?: string;
    /** * Option to getting `prefix` and `pathname` of api url only `(removing origin base api url)`.
     *
     * @default true */
    withOrigin?: boolean;
  } = {}
): string => {
  try {
    // ✅ Type checks
    if (typeof pathname !== "string") {
      throw new TypeError(
        `Invalid type for 'pathname'. Expected 'string', received: ${typeof pathname}`
      );
    }

    if (typeof prefix !== "string") {
      throw new TypeError(
        `Invalid type for 'prefix'. Expected 'string', received: ${typeof prefix}`
      );
    }

    if (typeof withOrigin !== "boolean") {
      throw new TypeError(
        `Invalid type for 'withOrigin'. Expected 'boolean', received: ${typeof withOrigin}`
      );
    }

    // Normalize pathname
    pathname = pathname.trim().length
      ? normalizePathname(pathname.trim().replace(/\/+/g, "/"))
      : "";

    // Normalize prefix
    prefix = prefix.trim().length
      ? `/${prefix.replace(/^\/+|\/+$/g, "")}`
      : "/api";

    // Remove duplicate prefix in pathname
    if (pathname.startsWith(prefix)) {
      pathname = pathname.substring(prefix.length);
    }

    // Get the base API URL
    const baseApiUrl = getBackendApiUrl({ suffix: prefix });

    const fullPath = withOrigin
      ? `${baseApiUrl}${pathname}`
      : new URL(baseApiUrl).pathname + pathname;

    return fullPath.replace(/\/+$/, "");
  } catch (error) {
    throw new Error(
      "Failed to generate backend API URL in `getBackendApiEndpoint()`, Error:" +
        error
    );
  }
};

/** ---------------------------------
 * * ***Generates a URL by replacing dynamic route parameters with provided values.***
 * ---------------------------------
 *
 * * ⚠️ ***Notes: This Function only support when using `NextJS`***
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
  // Validate the route string
  if (typeof route !== "string" || !route.trim()) {
    throw new TypeError(
      `🚨 'generateRoute' Failed cause: Invalid 'route'. Expected non-empty string but received ${typeof route}: ${JSON.stringify(
        route
      )}`
    );
  }

  // Validate that params is a plain object
  if (!params || typeof params !== "object" || Array.isArray(params)) {
    throw new Error(
      `🚨 Missing or invalid parameters object for route: "${route}". Expected an object mapping parameters.`
    );
  }

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
        '"',
        "(",
        ")",
        "+",
        ";",
        "%",
        "@",
        ":",
      ];

      // Filter out invalid characters from the value
      const foundInvalidChars = invalidChars.filter((char) =>
        value.includes(char)
      );

      if (foundInvalidChars.length > 0) {
        throw new Error(
          `🚨 'generateRoute' Failed cause: Parameter "${key}" contains invalid characters (${foundInvalidChars.join(
            ", "
          )}) in route: "${route}". These characters are not allowed because they could cause issues in URL structure. The following characters are forbidden in route parameters: (${invalidChars.join(
            ", "
          )}).`
        );
      }

      // Clean up leading/trailing slashes and avoid multiple slashes in the route
      return value.replace(/^\/+|\/+$/g, "");
    })
    .replace(/\/+/g, "/"); // Remove duplicate slashes to avoid `//`
}
