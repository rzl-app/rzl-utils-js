/**
 * Retrieves and formats an environment variable (e.g. a port or endpoint suffix).
 *
 * This function checks if the specified environment variable exists and is not empty after trimming.
 * - If the value is empty or undefined, it returns an empty string.
 * - If the value starts with one or more colons (`:`), it ensures that it starts with **exactly one colon**.
 *   - For example: `"::8080"` becomes `":8080"`, `"8080"` becomes `":8080"`, and `":8080"` stays as `":8080"`.
 * - If the value does not start with a colon, one will be prepended.
 *
 * @param envVar The environment variable value (usually from process.env).
 * @returns A formatted string that starts with a single colon, or an empty string if the input is falsy.
 *
 * @example
 * ```ts
 * formatEnvPort(process.env.PORT_BE); // ":8080" or ""
 * ```
 */
export function formatEnvPort(envVar?: string): string {
  const trimmed = envVar?.trim();
  if (!trimmed) return "";

  // Remove all leading colons, then prepend one
  const normalized = trimmed.replace(/^:+/, "");
  return `:${normalized}`;
}
