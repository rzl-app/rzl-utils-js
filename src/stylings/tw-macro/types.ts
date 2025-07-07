/* eslint-disable no-unused-vars */

/**
 * Converts a union type into an intersection type.
 *
 * @template U - The union type to be converted.
 */
export type UnionToIntersection<U> = (
  U extends never ? never : (arg: U) => never
) extends (arg: infer I) => void
  ? I
  : never;

/**
 * Converts a union type into a tuple type.
 *
 * @template T - The union type to be converted.
 */
export type UnionToTuple<T> =
  UnionToIntersection<T extends never ? never : (t: T) => T> extends (_: never) => infer W
    ? [...UnionToTuple<Exclude<T, W>>, W]
    : [];
