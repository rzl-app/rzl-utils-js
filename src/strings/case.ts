/** ----------------------------------------------------------
 * * Capitalizes the first letter of a string.
 * * Optionally lowercases the rest and trims whitespace.
 * ----------------------------------------------------------
 *
 * @param string - The string to be processed.
 * @param options - Options to control behavior.
 * @param options.lowerCaseNextRest - If true, lowercases the rest (next first letter) (default: true).
 * @param options.trim - If true, trims the string before processing (default: false).
 * @returns The processed string. Returns "" if input is null, undefined, or not a valid string.
 *
 * @example
 * capitalizeFirstLetter(" hello WORLD ") // " Hello world"
 * capitalizeFirstLetter(" hello WORLD ", { trim: true }) // "Hello world"
 * capitalizeFirstLetter("FOO", { lowerCaseNextRest: false }) // "FOO"
 * capitalizeFirstLetter("   foo BAR   ", { trim: true, lowerCaseNextRest: false }) // "Foo BAR"
 */
export const capitalizeFirstLetter = (
  string?: string | null,
  options: {
    /**
     * @description If true, the rest of the string will be converted to lowercase after capitalizing the first letter.
     *  @default true
     */
    lowerCaseNextRest?: boolean;
    /**
     * @description If true, the string will trimmed.
     *  @default false
     */
    trim?: boolean;
  } = {
    lowerCaseNextRest: true,
    trim: false,
  }
) => {
  if (typeof string !== "string" || string.trim().length === 0) {
    return "";
  }

  if (typeof options !== "object" || options === null) {
    options = {};
  }

  const lowerCaseNextRest = options.lowerCaseNextRest !== false;
  const trim = options.trim === true;

  if (trim) string = string.trim();

  return (
    string[0].toUpperCase() +
    (lowerCaseNextRest ? string.slice(1).toLowerCase() : string.slice(1))
  );
};

/** ----------------------------------------------------------
 * * ***Capitalizes the first letter of each word in a string
 * while converting the rest to lowercase.***
 * ----------------------------------------------------------
 *
 * @param str - The input string to be processed. If `null` or `undefined`, returns an empty string.
 * @param options - Optional settings to control the output:
 *   - `trim`: If `true`, removes leading and trailing spaces.
 *   - `collapseSpaces`: If `true`, collapses multiple spaces **between words** into a single space (while preserving leading/trailing spaces).
 *
 * @returns A new string where each word starts with an uppercase letter
 * and the remaining letters are lowercase. If `str` is empty, `null`, or `undefined`,
 * returns an empty string.
 *
 * @example
 * capitalizeString("  hello   world  ");
 * // => "  Hello   World  "
 *
 * capitalizeString("  hello   world  ", { trim: true });
 * // => "Hello   World"
 *
 * capitalizeString("  hello   world  ", { collapseSpaces: true });
 * // => "  Hello World  "
 *
 * capitalizeString("  hello   world  ", { trim: true, collapseSpaces: true });
 * // => "Hello World"
 */
export const capitalizeString = (
  str?: string | null,
  options: {
    /** If `true`, removes leading and trailing spaces, default `false`. */
    trim?: boolean;
    /** If `true`, collapses multiple spaces **between words** into a single space (while preserving leading/trailing spaces), default `false`. */
    collapseSpaces?: boolean;
  } = {
    collapseSpaces: false,
    trim: false,
  }
): string => {
  if (!str || typeof str !== "string" || !str.trim().length) return "";

  let result = str;

  if (typeof options !== "object" || options === null) {
    options = {};
  }

  const collapseSpaces = options.collapseSpaces === true;
  const trim = options.trim === true;

  if (trim) {
    result = result.trim();
  }

  if (collapseSpaces) {
    const leadingSpaces = result.match(/^\s*/)?.[0] ?? "";
    const trailingSpaces = result.match(/\s*$/)?.[0] ?? "";
    result = result.trim().replace(/\s+/g, " ");
    result = `${leadingSpaces}${result}${trailingSpaces}`;
  }

  return result
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/** ----------------------------------------------------------
 * * ***Converts a string to `camelCase`.***
 * ----------------------------------------------------------
 *
 * @description
 * - Splits the string by any sequence of non-alphanumeric characters
 *   (including spaces, punctuation, symbols, hyphens, underscores, emojis, etc).
 * - The first word is fully lowercase.
 * - Each subsequent word starts with an uppercase letter and the rest is lowercase.
 * - Joins all words without separators to form camelCase.
 * - If input is `null` or `undefined`, returns an empty string.
 * - Ignores empty segments (multiple delimiters are collapsed).
 *
 * @param {string | null | undefined} str - The input string to convert.
 * @returns {string} The camelCase formatted string.
 *
 * @example
 * toCamelCase("hello world");                  // "helloWorld"
 * toCamelCase("convert_to-camel case");        // "convertToCamelCase"
 * toCamelCase("___hello--world__ again!!");    // "helloWorldAgain"
 * toCamelCase("🔥fire_and-ice❄️");             // "fireAndIce"
 * toCamelCase(null);                           // ""
 */
export const toCamelCase = (str?: string | null): string => {
  return str && typeof str === "string"
    ? str
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
        .map((word, index) =>
          index === 0
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join("")
    : "";
};

/** ----------------------------------------------------------
 * * ***Converts a string to `PascalCase`.***
 * ----------------------------------------------------------
 *
 * @description
 * - Splits the string by any sequence of non-alphanumeric characters
 *   (including spaces, punctuation, symbols, hyphens, underscores, emojis, etc).
 * - Each resulting word starts with an uppercase letter, followed by lowercase.
 * - Joins all words without separators (PascalCase).
 * - If input is `null` or `undefined`, returns an empty string.
 * - Ignores empty segments (multiple delimiters are collapsed).
 *
 * @param {string | null | undefined} str - The input string to convert.
 * @returns {string} The PascalCase formatted string.
 *
 * @example
 * toPascalCase("hello world");                  // "HelloWorld"
 * toPascalCase("convert_to-pascal case");       // "ConvertToPascalCase"
 * toPascalCase("___hello--world__ again!!");    // "HelloWorldAgain"
 * toPascalCase("🔥fire_and-ice❄️");             // "FireAndIce"
 * toPascalCase(null);                           // ""
 */
export const toPascalCase = (str?: string | null): string => {
  return str && typeof str === "string"
    ? str
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join("")
    : "";
};

/** ----------------------------------------------------------
 * * ***Converts a string to `kebab-case`.***
 * ----------------------------------------------------------
 *
 * @description
 * - Splits the string by any sequence of non-alphanumeric characters
 *   (spaces, hyphens, underscores, symbols, emojis, etc).
 * - Joins all words with hyphens (-).
 * - Converts entire string to lowercase.
 * - If input is `null` or `undefined`, returns an empty string.
 * - Ignores empty segments (multiple delimiters are collapsed).
 *
 * @param {string | null | undefined} str - The input string to convert.
 * @returns {string} The kebab-case formatted string.
 *
 * @example
 * toKebabCase("Hello World");                 // "hello-world"
 * toKebabCase("convert_to-kebab case");       // "convert-to-kebab-case"
 * toKebabCase("🔥fire___and--ice❄️");         // "fire-and-ice"
 * toKebabCase(null);                          // ""
 */
export const toKebabCase = (str?: string | null): string => {
  return str && typeof str === "string"
    ? str
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
        .map((word) => word.toLowerCase())
        .join("-")
    : "";
};

/** ----------------------------------------------------------
 * * ***Converts a string to `snake_case`.***
 * ----------------------------------------------------------
 *
 * @description
 * - Lowercases all letters.
 * - Joins words with `_`.
 * - Removes special characters, treating them as word separators.
 * - If input is `null` or `undefined`, returns "".
 *
 * @param {string | null | undefined} str
 * @returns {string} snake_case string
 *
 * @example
 * toSnakeCase("Hello World") => "hello_world"
 * toSnakeCase("convert-to_snake case") => "convert_to_snake_case"
 */
export const toSnakeCase = (str?: string | null): string => {
  return str && typeof str === "string"
    ? str
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
        .map((w) => w.toLowerCase())
        .join("_")
    : "";
};

/** ----------------------------------------------------------
 * * ***Converts a string to `dot.case`.***
 * ----------------------------------------------------------
 *
 * @description
 * - Lowercases all letters.
 * - Joins words with `.`.
 * - Removes special characters, treating them as word separators.
 * - If input is `null` or `undefined`, returns "".
 *
 * @param {string | null | undefined} str
 * @returns {string} dot.case string
 *
 * @example
 * toDotCase("Hello World") => "hello.world"
 * toDotCase("convert-to_dot case") => "convert.to.dot.case"
 */
export const toDotCase = (str?: string | null): string => {
  return str && typeof str === "string"
    ? str
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
        .map((w) => w.toLowerCase())
        .join(".")
    : "";
};

/** ----------------------------------------------------------
 * * ***Slugifies a string for use in URLs.***
 * ----------------------------------------------------------
 *
 * @description
 * - Lowercases all letters.
 * - Joins words with `-`.
 * - Removes special characters and trims leading/trailing dashes.
 * - If input is `null` or `undefined`, returns "".
 *
 * @param {string | null | undefined} str
 * @returns {string} slug string
 *
 * @example
 * slugify("Hello World!") => "hello-world"
 * slugify(" --- Convert to Slug? --- ") => "convert-to-slug"
 */
export const slugify = (str?: string | null): string => {
  return str && typeof str === "string"
    ? str
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
        .map((w) => w.toLowerCase())
        .join("-")
        .replace(/^-+|-+$/g, "") // trim leading/trailing dashes
    : "";
};
