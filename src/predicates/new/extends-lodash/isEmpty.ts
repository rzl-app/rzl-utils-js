/* eslint-disable @typescript-eslint/no-explicit-any */
import _isEmpty from "lodash/isEmpty";
import type { List, EmptyObjectOf } from "lodash";

/** ----------------------------------------------------
 * * ***Checks if `value` is an empty object, collection, map, or set.***
 * ----------------------------------------------------
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * isEmpty(null);
 * // => true
 *
 * isEmpty(true);
 * // => true
 *
 * isEmpty(1);
 * // => true
 *
 * isEmpty([1, 2, 3]);
 * // => false
 *
 * isEmpty({ 'a': 1 });
 * // => false
 */
export function isEmpty<T extends { __trapAny: any }>(value?: T): boolean;
export function isEmpty(value: string): value is "";
export function isEmpty(
  value: Map<any, any> | Set<any> | List<any> | null | undefined
): boolean;
export function isEmpty(value: object): boolean;
export function isEmpty<T extends object>(
  value: T | null | undefined
): value is EmptyObjectOf<T> | null | undefined;
export function isEmpty(value?: any): boolean;
export function isEmpty(value?: unknown) {
  return _isEmpty(value);
}
