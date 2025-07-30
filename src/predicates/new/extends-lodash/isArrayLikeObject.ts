import type { AnyFunction } from "@/types";
import _isArrayLikeObject from "lodash/isArrayLikeObject";

/** ----------------------------------------------------
 * * ***This method is like `isArrayLike` except that it also checks if `value` is an object.***
 * ----------------------------------------------------
 *
 * @param {*} value The value to check.
 *
 * @returns Returns `true` if `value` is array-like object, else `false`.
 *
 * @example
 * isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * isArrayLikeObject(document.body.children);
 * // => true
 *
 * isArrayLikeObject('abc');
 * // => true
 *
 * isArrayLikeObject(noop);
 * // => false
 */
export function isArrayLikeObject<T extends { __anyHack: unknown }>(
  value: T
): boolean;
export function isArrayLikeObject(
  value: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ((...args: any[]) => any)
    | AnyFunction
    | string
    | boolean
    | number
    | null
    | undefined
): value is never;
export function isArrayLikeObject(
  value: unknown
): value is object & { length: number };
export function isArrayLikeObject(value?: unknown) {
  return _isArrayLikeObject(value);
}
