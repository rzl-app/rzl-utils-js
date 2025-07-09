import { formatEnvPort } from "./utils";
import { normalizePathname } from "./pathname";
import { removeAllSpaceString } from "@/converts/strings";
import { arrayNumbValToStringVal } from "@/converts/arrays/non-support-recursive";
import { isEmptyObject } from "@/checkers";

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
  if (typeof baseUrl === "string") {
    if (!baseUrl.trim()) {
      throw new TypeError("`baseUrl` cannot be an empty string.");
    }
    baseUrl = removeAllSpaceString(baseUrl, { trimOnly: true });
  } else if (!(baseUrl instanceof URL)) {
    throw new TypeError(
      `Invalid 'baseUrl'. Expected a non-empty string or a URL instance, received: ${typeof baseUrl}`
    );
  }

  // 🔍 Check removeParams
  if (removeParams !== undefined) {
    if (!Array.isArray(removeParams)) {
      throw new TypeError("`removeParams` must be an array of strings.");
    }
    if (!removeParams.every((param) => typeof param === "string")) {
      throw new TypeError("`removeParams` must only contain strings.");
    }
  }

  try {
    // 🔍 Check queryParams
    if (queryParams !== undefined) {
      if (typeof queryParams[Symbol.iterator] !== "function") {
        throw new TypeError(
          "`queryParams` must be iterable (like URLSearchParams.entries() or an array of [string, string])"
        );
      }
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
    throw new Error(
      "Failed to construct a valid URL in `constructURL()`, Error:" + error
    );
  }
};
