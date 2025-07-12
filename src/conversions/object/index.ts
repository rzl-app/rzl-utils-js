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

export type DeleteKeyConfig<T> = {
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
