/** ----------------------------------------------------------
 * * ***Extracts the file name (without extension) from a given URL or file path.***
 * ----------------------------------------------------------
 *
 * @param {string} url - The URL or file path to extract the file name from.
 * @returns {string | null} The extracted file name, or `null` if the input is invalid.
 *
 * @example
 * extractFileName("https://example.com/path/to/file.txt"); // Returns "file"
 * extractFileName("/local/path/to/image.jpeg"); // Returns "image"
 * extractFileName("https://example.com/path/to/no-extension"); // Returns "no-extension"
 */
export const extractFileName = (url: string): string | undefined => {
  if (typeof url !== "string" || !url.trim()) return undefined; // Handle invalid inputs

  const fileName = url.split("/").pop(); // Extract last part of path
  return fileName?.replace(/\.[^.]+$/, ""); // Remove the last extension
};
