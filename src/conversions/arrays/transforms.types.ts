import type { AnyFunction } from "@/types";

export type DedupeResult<
  Force extends false | "stringOrNumber" | "primitives" | "all" = false
> = Force extends "stringOrNumber" | "primitives" | "all"
  ? Array<string | object | AnyFunction | unknown[]>
  : Array<
      | string
      | number
      | boolean
      | bigint
      | symbol
      | null
      | undefined
      | object
      | AnyFunction
      | unknown[]
    >;
