import _isBuffer from "lodash/isBuffer";

/** ----------------------------------------------------
 * * ***Checks if value is a buffer.***
 * ----------------------------------------------------
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * isBuffer(new Buffer(2));
 * // => true
 *
 * isBuffer(new Uint8Array(2));
 * // => false
 */
export function isBuffer(value?: unknown): value is Buffer {
  return _isBuffer(value);
}
