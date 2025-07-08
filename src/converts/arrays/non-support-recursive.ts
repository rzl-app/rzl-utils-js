import { isArray } from "@/checkers";
import { filterNullValuesArray } from ".";

//  ** ---- array number to array string ----

/** ---------------------------------------------
 * * ***Converts all values in an array from numbers or other types to strings.***
 * * ***The function can also remove invalid values (null, undefined) based on the options provided.***
 * ---------------------------------------------
 *
 * @param {Array<string | number | null | undefined>} [array] - The array to be transformed.
 * @param {Object} [options] - The options object that controls the transformation behavior.
 * @param {boolean} [options.removeInvalidValue=true] - If true, removes invalid values (null, undefined) from the result. Default is true.
 * @returns {Array<string | null | undefined>} - A new array with string representations of the values or an array with invalid values removed if specified.
 */
export function arrayNumbValToStringVal(
  // eslint-disable-next-line no-unused-vars
  array?: undefined,
  // eslint-disable-next-line no-unused-vars
  options?: {
    /** @default true */
    removeInvalidValue: boolean;
  }
): undefined;
export function arrayNumbValToStringVal(
  // eslint-disable-next-line no-unused-vars
  array?: Array<never>,
  // eslint-disable-next-line no-unused-vars
  options?: {
    /** @default true */
    removeInvalidValue: boolean;
  }
): Array<never>;
export function arrayNumbValToStringVal(
  // eslint-disable-next-line no-unused-vars
  array?: Array<undefined | null> | Array<null | undefined>,
  // eslint-disable-next-line no-unused-vars
  options?: {
    /** @default true */
    removeInvalidValue: boolean;
  }
): Array<undefined>;
export function arrayNumbValToStringVal<T>(
  // eslint-disable-next-line no-unused-vars
  array?: Array<T>,
  // eslint-disable-next-line no-unused-vars
  options?: {
    /** @default true */
    removeInvalidValue: true;
  }
): Array<string> | undefined;
export function arrayNumbValToStringVal<T>(
  // eslint-disable-next-line no-unused-vars
  array?: Array<T>,
  // eslint-disable-next-line no-unused-vars
  options?: {
    /** @default true */
    removeInvalidValue: false;
  }
): Array<string | null | undefined> | undefined;
export function arrayNumbValToStringVal<T extends string | number>(
  array?: Array<T>,
  options: {
    /** @default true */
    removeInvalidValue?: boolean;
  } = {
    removeInvalidValue: true,
  }
): Array<string | null | undefined> | undefined {
  if (!(typeof options === "object")) {
    throw new TypeError(`props 'options' must be \`object\` type!`);
  }

  if (array && isArray(array)) {
    // Convert each item in the array to a string, or null/undefined if it's not a valid value.
    const result = Array.from(array, (x) => {
      if (typeof x === "string" || typeof x === "number") {
        return String(x); // Convert number or string to string
      }

      return x === null ? null : undefined; // Handle null or undefined values
    });

    // Remove invalid values (null, undefined) if specified in options
    if (options.removeInvalidValue) {
      return filterNullValuesArray(result);
    }

    return result;
  }

  return undefined; // Return undefined if no array is provided
}

//  ** ---- array string to array number ----

/** ---------------------------------
 * * ***Converts an array of string values (or values that can be cast to string) to an array of numbers.***
 * * ***Optionally removes invalid values (non-numeric values) based on the provided options.***
 * ---------------------------------
 *
 * @param {Array<string | null | undefined>} [array] - The array of string values (or values convertible to strings) to be transformed into numbers.
 * @param {Object} [options] - Options that affect the conversion behavior.
 * @param {boolean} [options.removeInvalidValueNumber=true] - If true, removes invalid number values (e.g., NaN, undefined) from the result. Default is true.
 * @returns {Array<number | undefined>} - An array of numbers converted from the string values, or an array with invalid values removed if specified.
 */
export function arrayStringValToNumberVal(
  // eslint-disable-next-line no-unused-vars
  array?: undefined,
  // eslint-disable-next-line no-unused-vars
  options?: {
    /** @default true */
    removeInvalidValueNumber?: boolean;
  }
): undefined;
export function arrayStringValToNumberVal(
  // eslint-disable-next-line no-unused-vars
  array?: Array<never>,
  // eslint-disable-next-line no-unused-vars
  options?: {
    /** @default true */
    removeInvalidValueNumber?: boolean;
  }
): Array<never>;
export function arrayStringValToNumberVal(
  // eslint-disable-next-line no-unused-vars
  array?: Array<undefined | null> | Array<null | undefined>,
  // eslint-disable-next-line no-unused-vars
  options?: {
    /** @default true */
    removeInvalidValueNumber?: boolean;
  }
): Array<undefined>;
export function arrayStringValToNumberVal<T>(
  // eslint-disable-next-line no-unused-vars
  array?: Array<T>,
  // eslint-disable-next-line no-unused-vars
  options?: {
    /** @default true */
    removeInvalidValueNumber?: true;
  }
): Array<number> | undefined;
export function arrayStringValToNumberVal<T>(
  // eslint-disable-next-line no-unused-vars
  array?: Array<T>,
  // eslint-disable-next-line no-unused-vars
  options?: {
    /** @default true */
    removeInvalidValueNumber: false;
  }
): Array<number | undefined> | undefined;
export function arrayStringValToNumberVal<T>(
  array?: Array<T>,
  options: {
    /** @default true */
    removeInvalidValueNumber?: boolean;
  } = {
    removeInvalidValueNumber: true,
  }
) {
  if (!(typeof options === "object")) {
    throw new TypeError(`props 'options' must be \`object\` type!`);
  }

  if (array && isArray(array)) {
    // Convert each item in the array to a number, or undefined if it's not a valid number
    const result = Array.from(array, (x) => {
      const numberValue = parseInt(String(x)); // Try converting value to a number
      return isNaN(numberValue) ? undefined : numberValue; // Return undefined if NaN
    });

    // If `removeInvalidValueNumber` is false, return the result as-is, including invalid numbers (undefined)
    if (!options.removeInvalidValueNumber) {
      return result;
    }

    // Filter out undefined (invalid) values if `removeInvalidValueNumber` is true
    return filterNullValuesArray(result);
  }

  return undefined; // Return undefined if no array is provided
}
