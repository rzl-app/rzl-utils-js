/* eslint-disable @typescript-eslint/no-explicit-any */

/** ----------------------------------------------------------
 * * ***Capitalizes the first letter of a string and optionally lowercases the rest of the string.*** ✅
 * ----------------------------------------------------------
 *
 * @param string - The string to be processed.
 * @param options - The options object.
 * @returns The string with the first letter capitalized, and the rest lowercased or unchanged based on the option, if string is null or undefined will return "" as empty string.
 */
export const capitalizeFirstLetter = (
  string?: string | null,
  options = {
    /**
     * @description If true, the rest of the string will be converted to lowercase after capitalizing the first letter.
     *  @default true */
    lowerCaseNextOtherFirstLetter: true,
  }
) => {
  if (typeof string === "string" && string.trim().length > 0) {
    if (typeof options !== "object" || options === null) {
      options = {
        lowerCaseNextOtherFirstLetter: true,
      }; // fallback to default
    }

    string = string[0].toUpperCase() + string.slice(1);

    if (options.lowerCaseNextOtherFirstLetter) {
      return string.toLowerCase();
    }
    return string;
  }

  return "";
};

/** ----------------------------------------------------------
 * * ***Capitalizes the first letter of each word in a string while converting the rest to lowercase.*** ✅
 * ----------------------------------------------------------
 *
 * @param str - The string to be processed.
 * @returns The string with the first letter of each word capitalized and the rest in lowercase, if string is null or undefined will return "" as empty string.
 */
export const capitalizeString = (str?: string | null): string => {
  // Check if the input is a non-empty string
  if (!str || typeof str !== "string" || !str.trim().length) return "";

  return str
    .toLowerCase() // Convert the entire string to lowercase to normalize casing
    .split(" ") // Split the string into an array of words based on spaces
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1) // Capitalize the first letter & append the rest
    )
    .join(" "); // Join the modified words back into a single string
};

/** ----------------------------------------------------------
 * * ***Converts a given value to its appropriate JavaScript type.*** ✅
 * ----------------------------------------------------------
 *
 * - `"true"` → `true`
 * - `"false"` → `false`
 * - `"null"` → `null`
 * - `"undefined"` → `undefined`
 * - `"42"` → `42`
 * - `"3.14"` → `3.14`
 * - Other values remain unchanged.
 *
 * @param {any} value - The value to convert.
 * @returns {any} - The converted value in its appropriate type.
 */
export const convertType = (value: any): any => {
  const predefinedValues: Record<string, any> = {
    undefined: undefined,
    null: null,
    true: true,
    false: false,
  };

  // Attempt to convert value to a number (excluding empty strings and null)
  if (!isNaN(Number(value)) && value !== "" && value !== null) {
    return Number(value);
  }

  // Safely check if value exists in predefinedValues
  return Object.prototype.hasOwnProperty.call(predefinedValues, value)
    ? predefinedValues[value]
    : value;
};

/** ----------------------------------------------------------
 * * ***Replaces a substring at a specified index within a string.*** ✅
 * ----------------------------------------------------------
 *
 * @param {number} index - The starting index where the replacement should occur.
 * @param {string} originalString - The original string to modify.
 * @param {string} replaceTo - The string to insert at the specified index.
 * @returns {string} - The modified string with the replacement applied.
 *
 * @example
 * replaceAt(3, "hello", "X") // "helXo"
 * replaceAt(1, "world", "AB") // "wABrld"
 */
export const replaceAt = (
  index: number,
  originalString: string,
  replaceTo: string
): string => {
  if (
    !(
      typeof index === "number" ||
      typeof replaceTo === "string" ||
      typeof originalString === "string"
    )
  ) {
    throw new TypeError(
      "Expected 'index' to be a 'number' type, 'replaceTo' and 'originalString' to be a 'string' type"
    );
  }

  // Handle edge cases
  if (index < 0 || index >= originalString.length) {
    throw new Error("Index parameter is out of range at function `replaceAt`");
  }

  return (
    originalString.slice(0, index) + // Extract before the index
    replaceTo + // Insert replacement
    originalString.slice(index + replaceTo.length) // Extract after replacement
  );
};

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
 * * ***Extracts initials from a given name.*** ✅
 * ----------------------------------------------------------
 *
 * @param {string} [name=""] - The name to extract initials from.
 * @returns {string} - The extracted initials (e.g., "JD" for "John Doe").
 *
 * @example
 * getUserInitials("John Doe");      // "JD"
 * getUserInitials("Alice");         // "Al"
 * getUserInitials(" Bob Marley ");  // "BM"
 * getUserInitials("X");             // "X"
 * getUserInitials("  ");            // "" (empty string)
 */
export const getUserInitials = (name: string | null = ""): string => {
  if (!name || typeof name !== "string") return ""; // Handle empty string case

  // Trim spaces and remove duplicate spaces
  name = name.replace(/\s+/g, " ").trim();

  const nameParts = name.split(" ");

  if (nameParts.length > 1) {
    return nameParts[0][0] + nameParts[1][0]; // First letter of first and second words
  }

  return name.length > 1 ? name.substring(0, 2) : name[0]; // First two letters for single-word names
};

/** ----------------------------------------------------------
 * * ***Removes all HTML tags from a given string.*** ✅
 * ----------------------------------------------------------
 *
 * This function ensures that the input is a valid string before proceeding.
 * If the input is empty or not a string, it returns the original input.
 *
 * @param {string} [input] - The string that may contain HTML tags.
 * @returns {string | undefined | null} The cleaned string without HTML tags, or the original input if invalid.
 */
export const stripHtmlTags = <T extends string | null | undefined = undefined>(
  input?: T
): T => {
  if (!input || typeof input !== "string" || !input.trim().length) {
    return undefined as T;
  }

  return input.replace(/<[^>]*>/g, "") as T;
};

/** ----------------------------------------------------------
 * * ***Removes all spaces from a string and trimmed or trimmed only the string based on the options provided.*** ✅
 * ----------------------------------------------------------
 *
 * @param string - The string to be processed.
 * @param options - The options object.
 * @returns A string with spaces removed and trimmed or trimmed only, depending on the option, if string is null or undefined will return "" as empty string.
 */
export const removeAllSpaceString = (
  string?: string | null,
  options: {
    /**
     * @description If true, only trims the string.
     *
     * @default false */
    trimOnly?: boolean;
  } = {
    trimOnly: false,
  }
): string => {
  if (typeof string === "string") {
    // Ensure options is an object and Defensive options check
    if (typeof options !== "object" || options === null) {
      options = {};
    }

    const { trimOnly = false } = options;

    // If trimOnly is true, trim the string and return
    if (trimOnly) return string.trim();

    // Remove all spaces (including tabs, newlines, etc.)
    return string.replace(/\s+/g, "");
  }
  return "";
};

/** ----------------------------------------------------------
 * * ***Normalizes a string by ensuring it is a valid string and trimming whitespace.*** ✅
 * ----------------------------------------------------------
 *
 * @description If the input is `undefined`, `null`, or an `empty string` after trimming,
 * it returns an empty string `("")`.
 *
 * @param {string | undefined} input - The string to normalize.
 * @returns {string} A trimmed string or an empty string if the input is invalid.
 */
export const normalizeString = (input?: string | null): string => {
  return typeof input === "string" && input.trim().length ? input.trim() : "";
};

/** ----------------------------------------------------------
 * * ***Removes all duplicates spaces from a string (to 1x space only each duplicate space) and trimmed or trimmed only the string based on the options provided.*** ✅
 * ----------------------------------------------------------
 *
 * @param string - The string to be processed.
 * @param options - The options object.
 * @returns A string with spaces removed and trimmed or trimmed only, depending on the option, if string is null or undefined will return "" as empty string.
 */
export const removeDuplicateSpaceString = (
  string?: string | null,
  options: {
    /**
     * @description If true, only trims the string.
     *
     * @default false */
    trimOnly?: boolean;
  } = {
    trimOnly: false,
  }
): string => {
  if (typeof string == "string") {
    // Ensure options is an object and Defensive options check
    if (typeof options !== "object" || options === null) {
      options = {};
    }

    const { trimOnly = false } = options;

    // If trimOnly is true, trim the string and return
    if (trimOnly) return string.trim();

    // Remove all duplicate spaces (including tabs, newlines, etc.)
    return string.replace(/\s+/g, " ");
  }
  return "";
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

/**
 * Censors an email by replacing characters with "*", with support for random or fixed mode.
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
 * * Capitalizes each word in a name string while preserving punctuation and handling honorifics/titles correctly.
 * * Also ensures proper spacing if punctuation is stuck to words and automatically adds missing dots in known abbreviations.
 * ----------------------------------------------------------
 *
 * @param {string} name - The input name string.
 * @returns {string} - The formatted name with correct capitalization.
 *
 * @example
 * console.log(capitalizeName("drs agus haryanto mpd"));       // "Drs. Agus Haryanto, M.Pd."
 * console.log(capitalizeName("mr smith jr"));                // "Mr. Smith, Jr."
 * console.log(capitalizeName("josé o'neill"));               // "José O'Neill"
 * console.log(capitalizeName("  prof emile zola "));         // "Prof. Émile Zola"
 * console.log(capitalizeName("sir isaac newton"));          // "Sir Isaac Newton"
 */
export const capitalizeName = (name?: string | null): string => {
  if (typeof name !== "string" || !name.trim()) return "";

  const titles = new Map([
    // **🔹 Indonesian Academic Titles**
    ["dr", "Dr."],
    ["drs", "Drs."],
    ["dra", "Dra."],
    ["ir", "Ir."],
    ["sked", "S.Ked."],
    ["skom", "S.Kom."],
    ["st", "S.T."],
    ["se", "S.E."],
    ["sp", "S.Pd."],
    ["sh", "S.H."],
    ["ssi", "S.Si."],
    ["sip", "S.IP."],
    ["sag", "S.Ag."],
    ["mked", "M.Ked."],
    ["mkom", "M.Kom."],
    ["mt", "M.T."],
    ["mm", "M.M."],
    ["me", "M.E."],
    ["mpd", "M.Pd."],
    ["mh", "M.H."],
    ["msi", "M.Si."],
    ["mip", "M.IP."],
    ["phd", "Ph.D."],
    ["md", "M.D."],

    // **🔹 Indonesian Professional Titles**
    ["ak", "Ak."],
    ["cma", "CMA."],
    ["cpa", "CPA."],
    ["cfe", "CFE."],
    ["cfp", "CFP."],
    ["cissp", "CISSP."],
    ["spa", "Sp.A."],
    ["spb", "Sp.B."],
    ["sppd", "Sp.PD."],
    ["spkk", "Sp.KK."],
    ["spm", "Sp.M."],
    ["spog", "Sp.OG."],

    // **🔹 Indonesian Military Titles**
    ["jenderal", "Jenderal"],
    ["letjen", "Letjen."],
    ["mayjen", "Mayjen."],
    ["brigjen", "Brigjen."],
    ["kolonel", "Kolonel"],
    ["letkol", "Letkol."],
    ["mayor", "Mayor"],
    ["kapten", "Kapten"],
    ["lettu", "Lettu."],
    ["letda", "Letda."],
    ["serma", "Serma."],
    ["serka", "Serka."],
    ["sertu", "Sertu."],
    ["kopda", "Kopda."],
    ["praka", "Praka."],
    ["pratu", "Pratu."],

    // **🔹 Indonesian Honorific Titles**
    ["h", "H."],
    ["hj", "Hj."],
    ["kh", "K.H."],
    ["habib", "Habib"],
    ["ust", "Ust."],
    ["ustadz", "Ustadz"],
    ["ustadzah", "Ustadzah"],
    ["syekh", "Syekh"],
    ["raden", "Raden"],
    ["raden mas", "Raden Mas"],
    ["raden ajeng", "Raden Ajeng"],
    ["ki", "Ki."],
    ["nyi", "Nyi."],
    ["pdt", "Pdt."],
    ["bp", "Bp."],
    ["ibu", "Ibu."],
    ["gus", "Gus."],
    ["buya", "Buya."],

    // **🔹 International Titles**
    ["mr", "Mr."],
    ["ms", "Ms."],
    ["mrs", "Mrs."],
    ["prof", "Prof."],
    ["sir", "Sir"],
    ["madam", "Madam"],
    ["lord", "Lord"],
    ["monsieur", "Monsieur"],
    ["madame", "Madame"],
    ["herr", "Herr"],
    ["frau", "Frau"],
    ["señor", "Señor"],
    ["señora", "Señora"],
    ["señorita", "Señorita"],
    ["rev", "Rev."],
    ["rabbi", "Rabbi"],
    ["imam", "Imam"],
    ["sheikh", "Sheikh"],
    ["gen", "Gen."],
    ["col", "Col."],
    ["lt", "Lt."],
    ["maj", "Maj."],
    ["sgt", "Sgt."],
    ["cpt", "Cpt."],

    // **🔹 Common Name Suffixes**
    ["jr", "Jr."],
    ["sr", "Sr."],
    ["ii", "II"],
    ["iii", "III"],
  ]);

  return name
    .trim()
    .replace(/(\w)([.,])(?!\s)/g, "$1$2 ") // Ensure spacing only if missing
    .split(/\s+/)
    .map((word, index, words) => {
      const lowerWord = word.toLowerCase();
      if (titles.has(lowerWord)) {
        return titles.get(lowerWord)!;
      }
      if (index > 0 && words[index - 1].endsWith(".")) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ")
    .replace(/\s+([.,])/g, "$1") // Remove unnecessary spaces before punctuation
    .replace(/(\bS\.)\s+(?=[A-Z])/, "$1"); // Ensure no space inside abbreviations like S.Pd.
};

/** ----------------------------------------------------------
 * * ***Converts a string to PascalCase.***
 * ----------------------------------------------------------
 *
 * @description
 * - Each word starts with an uppercase letter.
 * - Removes spaces, hyphens (-), and underscores (_).
 * - If input is `null` or `undefined`, returns an empty string.
 *
 * @param {string | null | undefined} str - The input string.
 * @returns {string} The formatted PascalCase string.
 *
 * @example
 * toPascalCase("hello world"); // "HelloWorld"
 * toPascalCase("convert_to-pascal case"); // "ConvertToPascalCase"
 * toPascalCase(null); // ""
 */
export const toPascalCase = (str?: string | null): string => {
  return str && typeof str === "string"
    ? str
        .replace(/[^a-zA-Z0-9\s-_]/g, "") // Remove unwanted characters
        .split(/[\s-_]+/) // Split by space, hyphen, or underscore
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ) // Capitalize words
        .join("") // Join without spaces
    : "";
};

/** ----------------------------------------------------------
 * * ***Converts a string to camelCase.***
 * ----------------------------------------------------------
 *
 * @description
 * - The first word starts with a lowercase letter.
 * - Subsequent words start with an uppercase letter.
 * - Removes spaces, hyphens (-), and underscores (_).
 * - If input is `null` or `undefined`, returns an empty string.
 *
 * @param {string | null | undefined} str - The input string.
 * @returns {string} The formatted camelCase string.
 *
 * @example
 * toCamelCase("hello world"); // "helloWorld"
 * toCamelCase("convert_to-camel case"); // "convertToCamelCase"
 * toCamelCase(null); // ""
 */
export const toCamelCase = (str?: string | null): string => {
  return str && typeof str === "string"
    ? str
        .replace(/[^a-zA-Z0-9\s-_]/g, "") // Remove unwanted characters
        .split(/[\s-_]+/) // Split by space, hyphen, or underscore
        .map(
          (word, index) =>
            index === 0
              ? word.toLowerCase() // First word stays lowercase
              : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize subsequent words
        )
        .join("") // Join without spaces
    : "";
};
