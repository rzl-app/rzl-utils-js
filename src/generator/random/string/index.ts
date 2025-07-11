import type { RandomStringOptions } from "@/types/generator/random/string";

/** ----------------------------
 * * ***Generates a random alphanumeric string or number with a specified length range.***
 * ----------------------------
 *
 * @param {RandomStringOptions} options - Configuration for generating the string.
 * @returns {string} The randomly generated string or number.
 * @throws {Error} If the provided options are invalid.
 */
export const generateRandomString = (
  options: RandomStringOptions = {}
): string => {
  // Ensure options is an object and Defensive options check
  if (typeof options !== "object" || options === null) {
    options = {};
  }

  let {
    minLength = 40,
    maxLength = 40,
    type = "string",
    avoidWhiteSpace = true,
  } = options;

  // Validate `avoidWhiteSpace`
  if (typeof avoidWhiteSpace !== "boolean") {
    throw new Error("Invalid parameter: `avoidWhiteSpace` must be 'boolean'.");
  }

  // Validate `minLength` & `maxLength`
  if (
    !Number.isInteger(minLength) ||
    !Number.isInteger(maxLength) ||
    minLength < 1 ||
    maxLength > 5000 ||
    minLength > maxLength
  ) {
    throw new Error(
      "Invalid parameters: `minLength` must be ≥ 1, `maxLength` must be ≤ 5000, and `minLength` ≤ `maxLength`."
    );
  }

  // Validate `type`
  if (type !== "string" && type !== "number") {
    throw new Error(
      "Invalid parameter: `type` must be either 'string' or 'number'."
    );
  }

  // Generate a random length within the range
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  // Function to clean characters based on `avoidWhiteSpace`
  const cleanCharacters = (charSet: string) => {
    return avoidWhiteSpace ? charSet.replace(/\s|\n|\t/g, "") : charSet;
  };

  // Define character sets
  const defaultNumberSet = "0123456789";
  const defaultStringSet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Get the final character set
  const characterSet =
    cleanCharacters(
      type === "number"
        ? options.replaceGenInt?.trim() || defaultNumberSet
        : options.replaceGenStr?.trim() || defaultStringSet
    ) + (options.addChar || "");

  // Ensure characterSet is not empty
  if (!characterSet.length) {
    throw new Error(
      "Character set is empty. Ensure `replaceGenInt` or `replaceGenStr` has valid characters."
    );
  }

  // Generate random string
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characterSet.charAt(
      Math.floor(Math.random() * characterSet.length)
    );
  }

  return result;
};
