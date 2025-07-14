/** ---------------------------------
 * * ***Checks if two URLs are exactly the same, including protocol, host, pathname, and query parameters.***
 * ---------------------------------
 *
 * @param {URL} urlA - The first URL to compare.
 * @param {URL} urlB - The second URL to compare.
 * @returns {boolean} Returns `true` if both URLs are identical, otherwise `false`.
 */
export const areURLsIdentical = (urlA: URL, urlB: URL): boolean => {
  if (!(urlA instanceof URL) || !(urlB instanceof URL)) {
    throw new TypeError(
      "Both arguments to 'areURLsIdentical' must be instances of URL."
    );
  }

  return (
    urlA.protocol + "//" + urlA.host + urlA.pathname + urlA.search ===
    urlB.protocol + "//" + urlB.host + urlB.pathname + urlB.search
  );
};

/** ---------------------------------
 * * ***Checks if two URLs are the same, ignoring query parameters.***
 * ---------------------------------
 *
 * This function compares only the protocol, host, and pathname.
 *
 * @param {URL} urlA - The first URL to compare.
 * @param {URL} urlB - The second URL to compare.
 * @returns {boolean} Returns `true` if both URLs are the same (ignoring search parameters), otherwise `false`.
 */
export const areURLsEqualIgnoringQuery = (urlA: URL, urlB: URL): boolean => {
  if (!(urlA instanceof URL) || !(urlB instanceof URL)) {
    throw new TypeError(
      "Both arguments to 'areURLsEqualIgnoringQuery' must be instances of URL."
    );
  }

  return (
    urlA.protocol + "//" + urlA.host + urlA.pathname ===
    urlB.protocol + "//" + urlB.host + urlB.pathname
  );
};

/** ---------------------------------
 * * ***Validates whether a given string is a properly formatted URL.***
 * ---------------------------------
 *
 * This function checks if the input string follows a valid URL format,
 * including `http` or `https` protocols.
 *
 * @param {string} [url] - The URL string to validate.
 * @returns {boolean} `true` if the URL is valid, otherwise `false`.
 */
export const isValidURL = (url?: string | null): boolean => {
  if (typeof url !== "string" || !url.trim().length) return false;

  // Regular expression to validate the structure of the URL (after decoding),
  // and it now supports subdomains as well.
  // const urlPattern = new RegExp(
  //   /^(https?:\/\/(?:[a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z0-9]{2,6})(?:\/[^\s]*)?(?:\?[^\s]*)?(?:#[^\s]*)?$/i
  // );

  // Attempt to decode the entire URL, including domain and query parameters
  let decodedUrl: string;

  try {
    // Decode the URL (to handle cases like https%3A%2F%2F becoming https://)
    decodedUrl = decodeURIComponent(url);
  } catch {
    // If decoding fails, return false as it indicates an invalid encoded URL
    return false;
  }

  // Check if the decoded URL starts with http:// or https://
  if (!decodedUrl.startsWith("http://") && !decodedUrl.startsWith("https://")) {
    return false;
  }

  // the original more extra
  const urlPattern = new RegExp(
    // /^https?:\/\/(?:localhost(?::\d+)?(?:[/?#][^\s]*)?|(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6})(?:[/?#][^\s]*)?$/
    // eslint-disable-next-line no-useless-escape
    /^https?:\/\/(?:localhost(?::\d+)?(?:[\/?#][^\s]*)?|(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}(?::\d+)?(?:[\/?#][^\s]*)?)$/
    // /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/
  );

  // Test the decoded URL against the regex pattern
  return urlPattern.test(decodedUrl);
};

/** ---------------------------------
 * * ***Extracts all valid URLs from a given string.***
 * ---------------------------------
 *
 * This function scans the input url and returns an array of URLs
 * that match a valid `http` or `https` format.
 *
 * @param {string} [url] - The input string containing potential URLs.
 * @returns {string[] | null} An array of extracted URLs or `null` if no URLs are found.
 */
export const extractURLs = (url: string): string[] | null => {
  if (typeof url !== "string" || !isValidURL(url)) {
    return null;
  }

  const urlPattern =
    /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)/g;

  // Attempt to decode the entire URL, including domain and query parameters
  let decodedUrl: string;

  try {
    // Decode the URL (to handle cases like https%3A%2F%2F becoming https://)
    decodedUrl = decodeURIComponent(url);
  } catch {
    // If decoding fails, return false as it indicates an invalid encoded URL
    return null;
  }

  const matches = decodedUrl.match(urlPattern);
  return matches && matches.length > 0 ? matches : null;
};
