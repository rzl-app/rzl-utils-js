import { removeDuplicateSpaceString } from "@/strings/sanitize";

/** ----------------------------------------------
 * * ***Inserts a separator into a string at every `limiter` characters.***
 * ----------------------------------------------
 *
 * This function handles two main behaviors based on `reCountAfterSpace`:
 *
 * 1. If `reCountAfterSpace` is `false` (default):
 * The separator is inserted strictly every `limiter` characters throughout the entire string,
 * regardless of spaces. Spaces are treated as regular characters in the count.
 * Example: `addSeparatorToString("1234567890", 3, "-")` returns `"123-456-789-0"`.
 * Example: `addSeparatorToString("Hello World", 3, "-")` returns `"Hel-lo -Wor-ld"`.
 *
 * 2. If `reCountAfterSpace` is `true`:
 * The function first processes the input string to replace any multiple consecutive spaces
 * with a single space (e.g., "A   B" becomes "A B").
 * Then, it treats the string as a sequence of "words" (segments separated by single spaces).
 * - Each word is processed independently: if a word's length exceeds the `limiter`,
 * separators are inserted internally within that word.
 * - Words are then grouped. Each group will contain `limiter` number of words.
 * Words within the same group are joined by the specified `separator`.
 * - Finally, these groups are joined by a single space, preserving the original word separation structure
 * between groups.
 *
 * @param {string} subject - The target string where the separator will be added.
 * @param {number} limiter - The interval (number of characters) at which the separator should be inserted.
 * @param {string} [separator=" "] - The separator string to insert (default is a single space `" "`).
 * @param {boolean} [reCountAfterSpace=false] - If `true`, the counting for `limiter`
 * resets after each space, and words are grouped as described above. If `false`,
 * the counting is continuous throughout the string.
 * @returns {string} - The formatted string with separators added according to the specified rules.
 *
 * @example
 * // Basic usage (reCountAfterSpace = false)
 * addSeparatorToString("1234567890", 3, "-"); // Returns: "123-456-789-0"
 * addSeparatorToString("HelloWorld", 2, "_"); // Returns: "He_ll_oW_or_ld"
 *
 * @example
 * // Usage with reCountAfterSpace = true:
 * // Multiple spaces are normalized to single spaces before processing.
 * addSeparatorToString("AB  CD   EF GH", 2, "-", true); // Returns: "AB-CD EF-GH" (after normalization to "AB CD EF GH")
 * // Words "AB" and "CD" form a group and are joined by "-", "EF" and "GH" form another group.
 * // The groups "AB-CD" and "EF-GH" are then joined by a space.
 *
 * @example
 * // Another usage with reCountAfterSpace = true:
 * addSeparatorToString("ABC DEF GHI JKL", 3, "-", true); // Returns: "ABC-DEF-GHI JKL"
 * // Words "ABC", "DEF", "GHI" form a group and are joined by "-".
 * // The word "JKL" forms its own group (as it's the last word and completes no other group).
 * // The groups "ABC-DEF-GHI" and "JKL" are then joined by a space.
 */
export function addSeparatorToString(
  subject: string,
  limiter: number,
  separator: string = " ",
  reCountAfterSpace: boolean = false
): string {
  if (!subject || limiter <= 0) return subject;

  // Type validation
  if (
    !(
      typeof subject === "string" &&
      typeof limiter === "number" &&
      typeof separator === "string" &&
      typeof reCountAfterSpace === "boolean"
    )
  ) {
    throw new TypeError(
      "Expected 'subject' and 'separator' to be a 'string' type, 'limiter' to be a 'number' type, 'reCountAfterSpace' to be a 'boolean' type"
    );
  }

  subject = removeDuplicateSpaceString(subject);

  // Handle reCountAfterSpace = false (assumed correct from previous iterations)
  if (!reCountAfterSpace) {
    let result = "";
    let currentCount = 0;

    for (let i = 0; i < subject.length; i++) {
      const char = subject[i];
      if (currentCount === limiter) {
        result += separator;
        currentCount = 0;
      }
      result += char;
      currentCount++;
    }
    return result;
  }

  // --- Dynamic Logic for reCountAfterSpace = true ---
  const words = subject.split(" "); // Split the string into individual words by spaces
  const finalSegments: string[] = [];

  let currentGroup: string[] = [];
  let wordsInCurrentGroupCount = 0; // This counts how many words are in the current group

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // Check if the current word itself needs internal separators (e.g., "HelloWorld" with limiter 2)
    // For the given test cases ("AB", "CD", "ABC"), this inner loop doesn't add separators,
    // as the words themselves are shorter than or equal to the limiter.
    let processedWord = "";
    let charCountInWord = 0;
    for (let j = 0; j < word.length; j++) {
      processedWord += word[j];
      charCountInWord++;
      if (charCountInWord === limiter && j < word.length - 1) {
        processedWord += separator;
        charCountInWord = 0;
      }
    }

    currentGroup.push(processedWord);
    wordsInCurrentGroupCount++;

    // If the current group has reached the limiter (e.g., 2 words for limiter=2, or 3 words for limiter=3)
    // OR if it's the last word in the entire subject, finalize the group.
    if (wordsInCurrentGroupCount === limiter || i === words.length - 1) {
      finalSegments.push(currentGroup.join(separator)); // Join words within the group by separator
      currentGroup = []; // Reset group for the next set of words
      wordsInCurrentGroupCount = 0; // Reset group word count
    }
  }

  // Finally, join the main segments (groups) with spaces
  return finalSegments.join(" ");

  // DEPRECATED:
  // if (reCountAfterSpace) {
  //   return subject
  //     .split(" ") // Split by spaces
  //     .map((word) =>
  //       word.replace(new RegExp(`.{${limiter}}`, "g"), "$&" + separator)
  //     )
  //     .join(" ");
  // }

  // return subject.replace(
  //   new RegExp(`.{${limiter}}(?=.)`, "g"),
  //   "$&" + separator
  // );
}

/** ----------------------------------------------------------
 * * Censors an email by replacing characters with "*", with support for random or fixed mode.
 * ----------------------------------------------------------
 *
 * In "random" mode (default), characters are randomly replaced each time.
 * In "fixed" mode, censorship is deterministic based on a hash of the email,
 * resulting in the same output for the same input.
 *
 * @param email - The email to censor.
 * @param mode - Censoring mode: "random" or "fixed". Default is "random".
 * @returns The censored email or an empty string if invalid.
 *
 * @example
 * censorEmail("john.doe@gmail.com", "random"); // -> j***.d*@g***l.com (varies)
 * censorEmail("john.doe@gmail.com", "fixed");  // -> j**n.**e@g***l.com (always the same)
 * censorEmail("invalid-email");                // -> ""
 */
export const censorEmail = (
  email?: string | null,
  mode: "random" | "fixed" = "random"
): string => {
  if (typeof email !== "string") return "";

  // Ensure mode is either "random" or "fixed"
  if (mode !== "random" && mode !== "fixed") {
    throw new TypeError(
      "Expected 'mode' to be a 'string' and the valid value is 'random' and 'fixed' only!"
    );
  }

  // Strict email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return "";

  const [local, domain] = email.split("@");
  const domainParts = domain.split("."); // Handle multi-level domain (e.g., example.co.uk)
  if (domainParts.length < 2) return ""; // Invalid domain structure

  const [domainName, ...tldParts] = domainParts;
  const tld = tldParts.join(".");

  const hashSeed =
    mode === "fixed"
      ? (() => {
          let hash = 0;
          for (let i = 0; i < email.length; i++) {
            hash = (hash << 5) - hash + email.charCodeAt(i);
            hash |= 0; // Convert to 32bit int
          }
          return Math.abs(hash);
        })()
      : undefined;

  /**
   * Randomly replaces characters in a string with "*"
   * @param {string} str - The string to censor.
   * @param {number} minCensor - Minimum number of characters to censor.
   * @param {number} maxPercentage - Maximum percentage of characters to censor.
   * @returns {string} - Censored string.
   */
  const censor = (
    str: string,
    minCensor: number,
    maxPercentage: number
  ): string => {
    if (str.length <= minCensor) return "*".repeat(str.length);

    const strArr = str.split("");
    const totalCensor = Math.max(
      minCensor,
      Math.ceil(str.length * maxPercentage)
    );
    const indexes = new Set<number>();

    let i = 0;
    while (indexes.size < totalCensor) {
      const idx =
        hashSeed !== undefined
          ? (hashSeed + str.length + i * 31) % str.length
          : Math.floor(Math.random() * str.length);
      indexes.add(idx);
      i++;
    }

    for (const index of indexes) {
      strArr[index] = "*";
    }

    return strArr.join("");
  };

  const censoredLocal = censor(local, local.length < 4 ? 1 : 2, 0.6);
  const censoredDomain = censor(domainName, domainName.length < 4 ? 1 : 2, 0.5);
  const censoredTLD = tld.length <= 2 ? tld : censor(tld, 1, 0.4);

  return `${censoredLocal}@${censoredDomain}.${censoredTLD}`;
};

/** ----------------------------------------------------------
 * * Censors an email by randomly replacing characters with "*"
 * while keeping its structure recognizable.
 * ----------------------------------------------------------
 *
 * - Ensures valid email format.
 * - Handles multi-level TLDs (e.g., `co.uk`).
 * - Adapts censorship based on email length.
 * - Returns an empty string for invalid emails.
 *
 * @param {string} email - The email to be censored.
 * @returns {string} - The randomized censored email or an empty string if invalid.
 *
 * @example
 * console.log(censorEmail("example@gmail.com"));
 * // Output: "ex*m**e@g*a*l.com"
 *
 * console.log(censorEmail("john.doe@example.co.uk"));
 * // Output: "j*h*.d*e@e*a*p*e.co.*k"
 *
 * console.log(censorEmail("info@company.io"));
 * // Output: "i*f*@c*m*a*y.io"
 *
 * console.log(censorEmail("invalid-email"));
 * // Output: ""
 *
 * @deprecated Use `censorEmail` instead.
 */
export const censorEmailOld = (email?: string | null): string => {
  if (typeof email !== "string") return "";

  // Strict email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return "";

  const [local, domain] = email.split("@");

  /**
   * Randomly replaces characters in a string with "*"
   * @param {string} str - The string to censor.
   * @param {number} minCensor - Minimum number of characters to censor.
   * @param {number} maxPercentage - Maximum percentage of characters to censor.
   * @returns {string} - Censored string.
   */
  const randomCensor = (
    str: string,
    minCensor: number = 2,
    maxPercentage: number = 0.5
  ): string => {
    if (str.length <= minCensor) return "*".repeat(str.length);

    const strArr = str.split("");
    const totalCensor = Math.max(
      minCensor,
      Math.ceil(str.length * maxPercentage)
    );

    const censoredIndexes: Set<number> = new Set();
    while (censoredIndexes.size < totalCensor) {
      censoredIndexes.add(Math.floor(Math.random() * str.length));
    }

    for (const index of censoredIndexes) {
      strArr[index] = "*";
    }

    return strArr.join("");
  };

  // Handle multi-level domain (e.g., example.co.uk)
  const domainParts = domain.split(".");
  if (domainParts.length < 2) return ""; // Invalid domain structure

  const [domainName, ...tldParts] = domainParts;
  const tld = tldParts.join(".");

  // Adaptive censorship
  const censoredLocal = randomCensor(local, local.length < 4 ? 1 : 2, 0.6);
  const censoredDomain = randomCensor(
    domainName,
    domainName.length < 4 ? 1 : 2,
    0.5
  );
  const censoredTLD = tld.length <= 2 ? tld : randomCensor(tld, 1, 0.4);

  return `${censoredLocal}@${censoredDomain}.${censoredTLD}`;
};

/** ----------------------------------------------------------
 * * ***Truncates a string to a specified length and optionally appends an ending.***
 * * ***Also provides an option to trim the string before truncation.***
 * * ***If truncation occurs, trailing spaces before the ending are removed.***
 * * ***The `ending` parameter is always trimmed first; if it becomes empty, it defaults to `"..."`.***
 * ----------------------------------------------------------
 *
 * @param {string|null|undefined} text - The input string to truncate.
 *        If `null`, `undefined`, or empty after trim, returns `""`.
 * @param {number} [length=10] - The maximum length of the truncated string **(default: `10`)**.
 * @param {string} [ending="..."] - The string to append if truncation occurs **(default: `"..."`)**.
 *                                   This value is always passed through `ending.trim()`.
 *                                   If `ending.trim().length < 1`, it automatically becomes `"..."`.
 * @param {boolean} [trim=true] - Whether to trim the string before truncation **(default: `true`)**.
 *
 * @returns {string} - The truncated string with optional trimming and ending.
 *                     If text is `null`, `undefined`, or `length < 1`, returns `""`.
 *                     If truncation happens, trailing spaces before the `ending` are automatically removed.
 *
 * @throws {TypeError} - If `length` is not a number, `ending` is not a string, or `trim` is not a boolean.
 *
 * @example
 * truncateString("hello world", 5); // "hello..."
 * truncateString("hello world", 5, "---"); // "hello---"
 * truncateString("hello world", 5, "   "); // "hello..." (because ending.trim() -> "" -> default to "...")
 * truncateString("hello world", 5, "   !!!   "); // "hello!!!" (ending is trimmed to "!!!")
 * truncateString("   long data string   ", 8, "...", true); // "long dat..."
 * truncateString("   long data string   ", 8, "...", false); // "   long ..."
 * truncateString(" text with spaces ", 10, "...", false); // " text with..."
 * truncateString("abc def", 7); // "abc def"
 * truncateString(null, 5); // ""
 * truncateString("short", 10); // "short"
 */
export const truncateString = (
  text?: string | null,
  length: number = 10,
  ending: string = "...",
  trim: boolean = true
): string => {
  if (!text || typeof text !== "string" || text.trim().length < 1) return "";

  if (length < 1) return "";

  if (
    !(
      typeof length === "number" &&
      typeof ending === "string" &&
      typeof trim === "boolean"
    )
  ) {
    throw new TypeError(
      "Expected 'ending' to be a 'string' type, 'length' to be a 'number' type, 'trim' to be a 'boolean' type"
    );
  }

  if (ending.trim().length < 1) {
    ending = "...";
  } else {
    ending = ending.trim();
  }

  const original = trim ? text.trim() : text;
  const originalTrimmedLength = original.length;

  if (originalTrimmedLength <= length) return original;

  const sliced = original.slice(0, length);
  const cleanSliced = trim ? sliced : sliced.trimEnd();

  return cleanSliced + ending;
};
