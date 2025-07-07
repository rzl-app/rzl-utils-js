/** ----------------------------------------------------------
 * * ***Dynamically deletes multiple keys from an object with optional deep deletion.***
 * ----------------------------------------------------------
 *
 * - Supports both shallow and deep deletion.
 * - Works with nested objects and arrays.
 * - Does not mutate the original object unless `deepClone` is `true`.
 * - Does **not** use external libraries like Lodash.
 *
 * @template T - The type of the object.
 * @param {T} object - The source object.
 * @param {Array<{ key: keyof T; deep?: boolean }>} keysToDelete - Keys to remove, with optional `deep` flag.
 * @param {boolean} [deepClone=false] - Whether to deep clone the object before modifying.
 * @returns {Partial<T>} - A new object with the specified keys removed.
 *
 * @example
 * // Example 1: Removing multiple keys from an object
 * const obj = {
 *   name: "John",
 *   age: 30,
 *   address: {
 *     city: "New York",
 *     street: "5th Avenue"
 *   },
 *   hobbies: ["reading", { type: "sports", name: "football" }]
 * };
 *
 * const result = deleteObjMultipleDynamic(obj, [
 *   { key: "age" },
 *   { key: "address", deep: true },
 *   { key: "hobbies", deep: true }
 * ]);
 *
 * console.log(result);
 * // Output:
 * // { name: "John" }
 *
 * @example
 * // Example 2: Shallow delete (nested objects remain)
 * const obj2 = {
 *   name: "Alice",
 *   details: {
 *     age: 25,
 *     city: "London"
 *   }
 * };
 *
 * const result2 = deleteObjMultipleDynamic(obj2, [{ key: "details" }]);
 * console.log(result2);
 * // Output:
 * // { name: "Alice" }
 *
 * @example
 * // Example 3: Deep delete inside an array
 * const obj3 = {
 *   name: "Bob",
 *   skills: [{ type: "programming", language: "JavaScript" }, { type: "design", tool: "Photoshop" }]
 * };
 *
 * const result3 = deleteObjMultipleDynamic(obj3, [{ key: "skills", deep: true }]);
 * console.log(result3);
 * // Output:
 * // { name: "Bob" }
 *
 * @example
 * // Example 4: Delete a nested key inside an object
 * const obj4 = {
 *   user: {
 *     id: 1,
 *     credentials: {
 *       email: "test@example.com",
 *       password: "secret"
 *     }
 *   }
 * };
 *
 * const result4 = deleteObjMultipleDynamic(obj4, [{ key: "credentials", deep: true }]);
 * console.log(result4);
 * // Output:
 * // { user: { id: 1 } }
 *
 * @example
 * // Example 5: Delete a key inside a nested array of objects
 * const obj5 = {
 *   users: [
 *     { id: 1, name: "Alice", password: "12345" },
 *     { id: 2, name: "Bob", password: "67890" }
 *   ]
 * };
 *
 * const result5 = deleteObjMultipleDynamic(obj5, [{ key: "password", deep: true }]);
 * console.log(result5);
 * // Output:
 * // {
 * //   users: [
 * //     { id: 1, name: "Alice" },
 * //     { id: 2, name: "Bob" }
 * //   ]
 * // }
 *
 * @example
 * // Example 6: Deep delete while preserving object structure
 * const obj6 = {
 *   company: {
 *     name: "TechCorp",
 *     employees: [
 *       { id: 1, name: "Alice", salary: 5000 },
 *       { id: 2, name: "Bob", salary: 6000 }
 *     ]
 *   }
 * };
 *
 * const result6 = deleteObjMultipleDynamic(obj6, [{ key: "salary", deep: true }]);
 * console.log(result6);
 * // Output:
 * // {
 * //   company: {
 * //     name: "TechCorp",
 * //     employees: [
 * //       { id: 1, name: "Alice" },
 * //       { id: 2, name: "Bob" }
 * //     ]
 * //   }
 * // }
 *
 * @example
 * // Example 7: Delete a key that contains another object or array
 * const obj7 = {
 *   metadata: {
 *     id: "abc123",
 *     info: {
 *       createdAt: "2025-01-01",
 *       tags: ["important", "confidential"]
 *     }
 *   },
 *   data: [
 *     { id: 1, content: "Hello", extra: { views: 100, likes: 10 } },
 *     { id: 2, content: "World", extra: { views: 200, likes: 20 } }
 *   ]
 * };
 *
 * const result7 = deleteObjMultipleDynamic(obj7, [
 *   { key: "metadata", deep: true },
 *   { key: "extra", deep: true }
 * ]);
 * console.log(result7);
 * // Output:
 * // {
 * //   data: [
 * //     { id: 1, content: "Hello" },
 * //     { id: 2, content: "World" }
 * //   ]
 * // }
 */
export const deleteObjMultipleDynamic = <T extends Record<string, unknown>>(
  object: T,
  keysToDelete: Array<{ key: keyof T; deep?: boolean }>,
  deepClone: boolean = false
): Partial<T> => {
  if (typeof object !== "object" || object === null) return {} as Partial<T>;

  // Manual deep clone to avoid mutation
  const clone = <U>(obj: U): U => {
    if (Array.isArray(obj)) {
      return obj.map((item) =>
        typeof item === "object" && item !== null ? clone(item) : item
      ) as U;
    } else if (typeof obj === "object" && obj !== null) {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
          k,
          typeof v === "object" && v !== null ? clone(v) : v
        ])
      ) as U;
    }
    return obj;
  };

  const source = deepClone ? clone(object) : object;
  const keySet = new Set(keysToDelete.map(({ key }) => key));

  return Object.fromEntries(
    Reflect.ownKeys(source)
      .map((key): [PropertyKey, unknown] | null => {
        if (keySet.has(key as keyof T)) return null; // Skip keys to be deleted

        const value = source[key as keyof T];
        const keyConfig = keysToDelete.find(({ key: delKey }) => delKey === key);

        // Deep delete for nested objects & arrays
        if (keyConfig?.deep && typeof value === "object" && value !== null) {
          const newValue = Array.isArray(value)
            ? value.map((item) =>
                typeof item === "object" && item !== null
                  ? deleteObjMultipleDynamic(item, keysToDelete, false)
                  : item
              )
            : deleteObjMultipleDynamic(value as T, keysToDelete, false);

          return [key, newValue];
        }

        return [key, value];
      })
      .filter((entry): entry is [PropertyKey, unknown] => entry !== null) // Remove null values
  ) as Partial<T>;
};
