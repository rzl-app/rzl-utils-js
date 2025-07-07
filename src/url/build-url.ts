import { NextRequest } from "next/server";

import { formatEnvPort } from "./utils";
import { normalizePathname } from "./pathname";
import { removeAllSpaceString } from "@/converts/strings";
import { arrayNumbValToStringVal } from "@/converts/arrays/non-support-recursive";
import { isEmptyObject } from "@/checkers";

/** ---------------------------------
 * * ***Retrieves the real client IP address and constructs the full URL using headers like***
 * ***`x-forwarded-for`, `x-forwarded-proto`, and `x-forwarded-port`.***
 * ---------------------------------
 *
 * * ***Notes: This Function only support when using `NextJS`***
 *
 * @returns {string} The extracted client IP address or the full constructed URL.
 */
export const getClientIpOrUrl = (
  /** * The incoming Next.js request object. */
  request: NextRequest,
  /** * Whether to return the full URL (protocol, IP, and port) or just the IP address.
   *
   * @default true
   */
  includeFullUrl: boolean = true
): string => {
  let forwardedIps = (request.headers.get("x-forwarded-for") ?? "127.0.0.1")
    .trim()
    .split(",");

  // Normalize IPv6 loopback addresses
  if (forwardedIps[0] === "::ffff:127.0.0.1" || forwardedIps[0] === "::1") {
    forwardedIps[0] = "127.0.0.1";
  }

  // Get the last non-empty IP from the list (more reliable for real client IP)
  const clientIp =
    forwardedIps.length > 1
      ? forwardedIps[forwardedIps.length - 1].trim()
      : forwardedIps[0];

  if (!includeFullUrl) {
    return clientIp;
  }

  // Construct full URL using protocol, IP, and port
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  // const protocol = "http";
  const port = request.headers.get("x-forwarded-port") || "3000";

  return `${
    process.env.NODE_ENV == "production" ? protocol : "http"
  }://${clientIp}:${port}`;
};

/** ---------------------------------
 * * ***Constructs a valid URL with optional query parameters and allows selective removal of duplicate parameters.***
 * ---------------------------------
 *
 * @param {string | URL} baseUrl - The base URL (must include protocol, domain, and optional port).
 * @param {URLSearchParamsIterator<[string, string]>} [queryParams] - Query parameters to be appended to the URL.
 * @param {string[]} [removeParams] - List of query parameter keys to be removed if they exist.
 * @returns {URL} A new URL object with the applied modifications.
 * @throws {Error} If the provided URL is invalid or cannot be processed.
 */
export const constructURL = (
  baseUrl: string | URL,
  queryParams?: URLSearchParamsIterator<[string, string]>,
  removeParams?: string[]
): URL => {
  try {
    // Normalize the input URL
    if (typeof baseUrl === "string") {
      baseUrl = baseUrl.trim().length
        ? removeAllSpaceString(baseUrl, { trimOnly: true })
        : "";
    }

    const urlInstance = new URL(baseUrl);

    // Add query parameters if provided
    if (queryParams) {
      const paramObject = Object.fromEntries(queryParams);

      if (!isEmptyObject(paramObject)) {
        const urlSearchParams = new URLSearchParams(paramObject);

        // Remove specific query parameters if needed
        if (removeParams?.length) {
          arrayNumbValToStringVal(removeParams)?.map((paramKey) => {
            urlSearchParams.delete(paramKey);
          });
        }

        urlInstance.search = urlSearchParams.toString();
      }
    }

    // Remove query parameters directly from URL if needed
    removeParams?.forEach((param) => urlInstance.searchParams.delete(param));

    return urlInstance;
  } catch (error) {
    throw new Error("Failed to construct a valid URL in `constructURL()`", {
      cause: error,
    });
  }
};

/** ---------------------------------
 * * ***Retrieves the base URL of the application.***
 * ---------------------------------
 *
 * This function determines the base URL from the `NEXT_PUBLIC_BASE_URL` environment variable.
 * If the variable is not set, it defaults to `"http://localhost:3000"`.
 *
 * * ***Notes: This Function only support when using `NextJS`***
 *
 * @returns {string} The base URL of the application.
 * @throws {Error} If the provided `NEXT_PUBLIC_BASE_URL` is invalid.
 */
export const getBaseUrl = (): string => {
  try {
    // Get the base URL from environment variables or default to localhost
    let baseUrl = removeAllSpaceString(
      process.env.NEXT_PUBLIC_BASE_URL?.trim() +
        formatEnvPort(process.env.PORT_FE) || "http://localhost:3000/"
    );

    // Ensure the URL is valid and normalize it
    return new URL(baseUrl.replace(/\/+$/, "/")).origin;
  } catch (error) {
    throw new Error(
      "Invalid `NEXT_PUBLIC_BASE_URL`, failed to generate from `getBaseUrl()`",
      {
        cause: error,
      }
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
 * * ***Notes: This Function only support when using `NextJS`***
 *
 * @param {Object} options - Configuration options.
 * @param {string} [options.suffix="/"] - The suffix to append to the base API URL.
 * @returns {string} The formatted backend API base URL.
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
  try {
    // Retrieve the API base URL from environment variables or use the default value
    let baseUrl = removeAllSpaceString(
      (
        process.env.NEXT_PUBLIC_BACKEND_API_URL +
        formatEnvPort(process.env.PORT_BE)
      )?.trim() || "http://localhost:8000/"
    );

    // Normalize the suffix
    suffix = removeAllSpaceString(suffix).length
      ? removeAllSpaceString(suffix)
      : "/";

    // Ensure the base URL is valid
    const baseApiUrl = new URL(baseUrl.replace(/\/+$/, "")).origin;

    // Append the suffix correctly
    return `${baseApiUrl}${suffix.startsWith("/") ? "" : "/"}${suffix.replace(
      /\/+$/,
      ""
    )}`;
  } catch (error) {
    throw new Error(
      "Invalid `NEXT_PUBLIC_BACKEND_API_URL`, failed to generate from `getBackendApiUrl()`",
      {
        cause: error,
      }
    );
  }
};

/** ---------------------------------
 * * ***Constructs a backend API URL by appending a given pathname to the base API URL.***
 * ---------------------------------
 *
 * This function allows you to customize the API URL structure with an optional prefix
 * and the choice to include or exclude the origin.
 *
 *
 * * ***Notes: This Function only support when using `NextJS`***
 *
 * @param {string} pathname - The API endpoint path (e.g., `/users` or `/v1/posts`).
 * @param {Object} options - Configuration options.
 * @param {string} [options.prefix="/api"] - The prefix for the API path (default is `"/api"`).
 * @param {boolean} [options.withOrigin=true] - Whether to include the full base URL or return only the API path.
 * @returns {string} The formatted API URL.
 * @throws {Error} If there is an issue constructing the API URL.
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
    const removeAllTrailingSlashes = (url: string) => url.replace(/\/+$/, "");

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

    return removeAllTrailingSlashes(fullPath);
  } catch (error) {
    throw new Error(
      "Failed to generate backend API URL in `getBackendApiEndpoint()`",
      {
        cause: error,
      }
    );
  }
};
