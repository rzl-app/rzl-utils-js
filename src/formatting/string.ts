/** ----------------------------------------------------------
 * * ***Inserts a separator into a string at every `limiter` characters.
 * Optionally resets counting after spaces.*** ✅
 * ----------------------------------------------------------
 *
 * @param {string} subject - The target string where the separator will be added.
 * @param {number} limiter - The interval at which the separator should be inserted.
 * @param {string} [separator=" "] - The separator to insert (default: space `" "`).
 * @param {boolean} [reCountAfterSpace=false] - If `true`, resets counting after each space. DefaultValue is `false`.
 * @returns {string} - The formatted string with separators added.
 *
 * @example
 * addSeparatorToString("1234567890", 3, "-"); // "123-456-789-0"
 * addSeparatorToString("HelloWorld", 2, "_"); // "He_ll_oW_or_ld"
 * addSeparatorToString("AB CD EF GH", 2, "-", true); // "AB-CD EF-GH"
 */
export const addSeparatorToString = (
  subject: string,
  limiter: number,
  separator: string = " ",
  reCountAfterSpace: boolean = false
): string => {
  if (
    !(
      typeof limiter === "number" ||
      typeof subject === "string" ||
      typeof separator === "string" ||
      typeof reCountAfterSpace === "boolean"
    )
  ) {
    throw new TypeError(
      "Expected 'subject' and 'separator' to be a 'string' type, 'limiter' to be a 'number' type, 'reCountAfterSpace' to be a 'boolean' type"
    );
  }

  if (!subject || limiter <= 0) return subject; // Handle invalid inputs

  if (reCountAfterSpace) {
    return subject
      .split(" ") // Split by spaces
      .map((word) =>
        word.replace(new RegExp(`.{${limiter}}`, "g"), "$&" + separator)
      )
      .join(" ");
  }

  return subject.replace(
    new RegExp(`.{${limiter}}(?=.)`, "g"),
    "$&" + separator
  );
};

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
 * ***Also provides an option to trim the truncated string.***
 * ----------------------------------------------------------
 *
 * @param {string|null|undefined} text - The input string to truncate.
 * @param {number} length - The maximum length of the truncated string, defaultValue is `10`.
 * @param {string} [ending="..."] - The string to append if truncation occurs, defaultValue is `"..."`.
 * @param {boolean} [trim=true] - Whether to trim the truncated string, defaultValue is `true`.
 * @returns {string} - The truncated string with optional trimming and ending, if text is null, undefined or length < 1 will return "" as empty string.
 */
export const truncateString = (
  text?: string | null,
  length: number = 10,
  ending: string = "...",
  trim: boolean = true
): string => {
  if (!text || typeof text !== "string" || text.trim().length < 1) return "";

  if (
    !(
      typeof length === "number" ||
      typeof ending === "string" ||
      typeof trim === "boolean"
    )
  ) {
    throw new TypeError(
      "Expected 'ending' to be a 'string' type, 'length' to be a 'number' type, 'trim' to be a 'boolean' type"
    );
  }

  if (text.length <= length) {
    return trim ? text.trim() : text;
  }
  const truncated = text.substring(0, length);
  return (
    (trim ? truncated.trim() : truncated) +
    (text.trim().length > length ? ending : "")
  );
};
