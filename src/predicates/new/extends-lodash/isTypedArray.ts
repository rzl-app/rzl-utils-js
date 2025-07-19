import { isTypedArray as _isTypedArray } from "lodash";

type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

/** --------------------------------------------------
 * * ***Checks if `value` is classified as a typed array.***
 * --------------------------------------------------
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 *
 * isTypedArray(new Uint8Array);          // => true
 * isTypedArray(new Uint8Array());        // => true
 * isTypedArray(new Float32Array());      // => true
 * isTypedArray(new Uint8ClampedArray()); // => true
 * isTypedArray([]);                      // => false
 * isTypedArray(Buffer.from("hi"));       // => false
 */
export function isTypedArray(value: unknown): value is TypedArray {
  return _isTypedArray(value);
}
