/**
 * --------------------------------------------------
 * * ***Safely converts a JavaScript value into a stable, JSON-compatible string.***
 * --------------------------------------------------
 *
 * Features:
 * - **Sort object keys (optional)** → Ensures consistent output for deep comparison.
 * - **Sort array values (optional)** → Useful when array order doesn't matter.
 * - **Removes functions & symbols**.
 * - **Converts undefined → null** (so it's visible in JSON).
 * - **Handles BigInt → string** (since JSON.stringify doesn't support it).
 * - **Handles circular references** (`"[Circular]"`).
 * - **Supports Map, Set, and Date**.
 *
 * @param {unknown} value - The value to stringify.
 * @param {boolean} [sortKeys=true] - Whether to sort object keys, defaultValue is `true`.
 * @param {boolean} [ignoreOrder=false] - Whether to sort array values, defaultValue is `false`.
 * @returns {string} A stable JSON string representation.
 */
export const safeStableStringify = (
  value: unknown,
  sortKeys: boolean = true,
  ignoreOrder: boolean = false
): string => {
  if (!(typeof sortKeys === "boolean" || typeof ignoreOrder === "boolean")) {
    throw new TypeError(
      "Expected 'sortKeys' and 'ignoreOrder' to be a 'boolean' type"
    );
  }

  try {
    if (typeof value !== "object" || value === null)
      return JSON.stringify(value);

    const seen = new WeakSet(); // Detect circular references

    return JSON.stringify(
      value,
      (key, val) => {
        if (typeof val === "function" || typeof val === "symbol")
          return undefined;
        if (typeof val === "bigint") return val.toString();
        if (val === undefined) return null;

        if (typeof val === "object" && val !== null) {
          if (seen.has(val)) return "[Circular]";
          seen.add(val);

          if (val instanceof Map) return { map: Array.from(val.entries()) };
          if (val instanceof Set) return { set: Array.from(val.values()) };
          if (val instanceof Date) return val.toISOString();

          if (Array.isArray(val) && ignoreOrder) {
            return [...val].sort();
          }

          if (sortKeys) {
            return Object.keys(val)
              .sort()
              .reduce((acc, key) => {
                acc[key] = val[key];
                return acc;
              }, {} as Record<string, unknown>);
          }

          return val;
        }

        return val;
      },
      2
    );
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      console.warn("Error from function `safeStableStringify`.");
    } else {
      console.warn(
        "Error stringifying object from function `safeStableStringify`:",
        error
      );
    }
    return "{}";
  }
};
