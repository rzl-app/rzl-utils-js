import { isEmptyString } from "./isEmptyString";

/** ---------------------------------
 * * ***Extracts all valid URLs from a given string.***
 * ---------------------------------
 *
 * This function scans the input url and returns an array of URLs
 * that match a valid `http` or `https` format.
 *
 * Supports:
 * - Internationalized domain names (IDN), e.g. `https://münich.de`
 * - Unicode & emoji paths, e.g. `https://example.com/🎉/page`
 * - Long URLs with multiple queries & fragments, e.g. `https://example.com/path?foo=1#hash`
 *
 * Ignores:
 * - Non-string inputs
 * - Empty or whitespace-only strings
 * - Non-HTTP(S) protocols (ftp, mailto, etc)
 *
 * @example
 * extractURLs("Visit https://example.com and https://例子.公司");
 * // => ["https://example.com", "https://例子.公司"]
 *
 * @example
 * extractURLs("Here: https://example.com/🎉/page");
 * // => ["https://example.com/🎉/page"]
 *
 * @example
 * extractURLs("ftp://example.com http://example.com");
 * // => ["http://example.com"]
 *
 *
 * @param {string} [url] - The input string containing potential URLs.
 * @returns {string[] | null} An array of extracted URLs or `null` if no URLs are found.
 */
export const extractURLs = (url: string): string[] | null => {
  if (isEmptyString(url)) return null;

  let decoded;
  try {
    decoded = decodeURIComponent(url);
  } catch {
    return null;
  }

  // Core regex dengan lookahead
  const urlPattern = /https?:\/\/.*?(?=https?:\/\/|\s|$)/g;
  const matches = decoded.match(urlPattern);
  if (!matches) return null;

  // Cleanup trailing punctuation dan validasi protokol
  const cleaned = matches
    .map((url) => url.replace(/[.,;:!?)]*$/, ""))
    .filter((url) => {
      try {
        const u = new URL(url);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    });

  return cleaned.length ? cleaned : null;

  // if (typeof url !== "string" || !isValidURL(url)) {
  //   return null;
  // }

  // const urlPattern =
  //   /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)/g;

  // // Attempt to decode the entire URL, including domain and query parameters
  // let decodedUrl: string;

  // try {
  //   // Decode the URL (to handle cases like https%3A%2F%2F becoming https://)
  //   decodedUrl = decodeURIComponent(url);
  // } catch {
  //   // If decoding fails, return false as it indicates an invalid encoded URL
  //   return null;
  // }

  // const matches = decodedUrl.match(urlPattern);
  // return matches && matches.length > 0 ? matches : null;
};
