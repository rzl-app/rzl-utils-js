import { RangeNumberTo999 } from "@/types";

type Prev = [never, RangeNumberTo999<1, 40>];
type DotPath<
  T,
  Prefix extends string = "",
  Depth extends number = RangeNumberTo999<1, 40>
> = Depth extends never
  ? never
  : T extends (infer U)[]
  ? U extends object
    ? DotPath<U, `${Prefix}`, Prev[Depth]>
    : never
  : T extends object
  ? {
      [K in Extract<keyof T, string>]: T[K] extends object
        ? DotPath<T[K], `${Prefix}${K}.`, Prev[Depth]> | `${Prefix}${K}`
        : `${Prefix}${K}`;
    }[Extract<keyof T, string>]
  : never;
type DeleteKeyConfig<T> = {
  key: DotPath<T>;
  deep?: boolean;
};

const deepCloneSafe = <U>(obj: U): U => {
  try {
    if (typeof structuredClone === "function") {
      return structuredClone(obj);
    }
    // eslint-disable-next-line no-empty, @typescript-eslint/no-unused-vars
  } catch (_) {}
  return JSON.parse(JSON.stringify(obj));
};

const deleteShallowKey = <T extends Record<string, unknown>>(
  obj: T,
  key: string
) => {
  if (typeof obj === "object" && obj !== null && key in obj) {
    delete obj[key];
  }
  return obj;
};

const deleteNestedKey = <T extends Record<string, unknown>>(
  obj: T,
  path: string[]
): T => {
  if (!obj || typeof obj !== "object") return obj;

  const [currentKey, ...rest] = path;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (typeof item === "object" && item !== null) {
        deleteNestedKey(item, path); // 💥 recursive pass same path
      }
    }
  } else if (rest.length === 0) {
    delete obj[currentKey];
  } else if (
    obj[currentKey] !== undefined &&
    typeof obj[currentKey] === "object"
  ) {
    deleteNestedKey(obj[currentKey] as T, rest);
  }

  return obj;
};

/** ------------------------------------------------------------------------
 * * ***Deletes multiple keys (shallow or deeply nested) from an object.***
 * ------------------------------------------------------------------------
 *
 * ✅ Features:
 * - Removes one or more keys from an object based on their paths (supports dot notation for nested).
 * - Can delete deeply from all matching nested levels (even inside arrays) when `deep: true`.
 * - By default does **not mutate** the original object. Clones it first.
 *   Set `deepClone = false` to mutate in place (useful for performance on large data).
 * - Ensures type safety on `key` paths via `DotPath<T>`, reducing accidental invalid paths.
 *
 * 🔍 Behavior:
 * - When `deep: false` (default), only deletes the direct property at the specified path.
 * - When `deep: true`, searches deeply and recursively deletes the key from all levels,
 *   including inside arrays of objects (applies the *same* path repeatedly).
 * - Can delete nested properties safely without throwing even if intermediate objects are missing.
 *
 * 🚀 Edge Handling:
 * - Ignores invalid intermediate objects (will just skip that branch).
 * - If `object` is `null` or not an object, returns an empty object.
 * - Throws if `keysToDelete` is not a proper array of `{ key, deep? }` objects.
 *
 * @template T - The shape of the input object, used for type-safe dot paths.
 *
 * @param {T} object - The object to remove keys from. Must be an object or will return `{}`.
 * @param {Array<{ key: DotPath<T>, deep?: boolean }>} keysToDelete -
 *   An array of instructions:
 *   - `key`: A string path using dot notation (e.g. `"user.profile.name"`).
 *   - `deep`: If `true`, will recursively remove all instances of the key path at any depth.
 * @param {boolean} [deepClone=true] -
 *   Whether to deep clone the original object before modifying.
 *   - `true` (default): returns a *new object* with the specified keys removed.
 *   - `false`: modifies the original object in place and returns it.
 *
 * @returns {Partial<T>}
 *   - A new object with specified keys removed if `deepClone` is `true`.
 *   - The *same mutated object* if `deepClone` is `false`.
 *
 * @throws {TypeError}
 *   - If `object` is not an object.
 *   - If `keysToDelete` is not an array of `{ key, deep? }` objects.
 *
 * @example
 * // 🟢 Shallow deletion
 * deleteObjMultipleDynamic(
 *   { a: 1, b: 2, c: { d: 3 } },
 *   [{ key: "b" }]
 * );
 * // => { a: 1, c: { d: 3 } }
 *
 * @example
 * // 🟢 Nested deletion (shallow, removes only exact path)
 * deleteObjMultipleDynamic(
 *   { user: { profile: { name: "Alice", age: 30 } } },
 *   [{ key: "user.profile.age" }]
 * );
 * // => { user: { profile: { name: "Alice" } } }
 *
 * @example
 * // 🔥 Deep deletion (recursively removes key from all levels and arrays)
 * deleteObjMultipleDynamic(
 *   { items: [{ price: 10 }, { price: 20, details: { price: 30 } }] },
 *   [{ key: "price", deep: true }]
 * );
 * // => { items: [{}, { details: {} }] }
 *
 * @example
 * // 📝 Without cloning: mutates original object
 * const obj = { x: 1, y: 2 };
 * deleteObjMultipleDynamic(obj, [{ key: "y" }], false);
 * console.log(obj); // => { x: 1 }
 *
 * @example
 * // 🚫 Invalid usage throws
 * deleteObjMultipleDynamic(42, [{ key: "a" }]);
 * // => throws TypeError
 */
export const deleteObjMultipleDynamic = <T extends Record<string, unknown>>(
  object: T,
  keysToDelete: DeleteKeyConfig<T>[],
  deepClone: boolean = true
): Partial<T> => {
  if (typeof object !== "object" || object === null) return {} as Partial<T>;
  if (
    !Array.isArray(keysToDelete) ||
    !keysToDelete.every((k) => typeof k === "object" && "key" in k)
  ) {
    throw new TypeError(
      "Expected keysToDelete to be an array of { key, deep? } objects"
    );
  }

  let result: Partial<T> = deepClone ? deepCloneSafe(object) : object;

  for (const { key, deep } of keysToDelete) {
    const path = key.split(".");
    result = deep
      ? (deleteNestedKey(result, path) as Partial<T>)
      : (deleteShallowKey(result, path[0]) as Partial<T>);
  }

  return result;
};
