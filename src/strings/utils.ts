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
