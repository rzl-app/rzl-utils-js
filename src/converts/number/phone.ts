import type {
  FormatPhoneNumberProps,
  FormatPhoneNumberPropsString,
  FormatPhoneNumberPropsBoolean,
  FormatPhoneNumberPropsTransform,
} from "./types";

export function formatPhoneNumber({
  value,
  separator,
  plusNumberCountry,
  closingNumberCountry,
  openingNumberCountry,
}: FormatPhoneNumberPropsString): string;

export function formatPhoneNumber({
  value,
  checkValidOnly,
}: FormatPhoneNumberPropsBoolean): boolean;

export function formatPhoneNumber({
  value,
  takeNumberOnly,
}: FormatPhoneNumberPropsTransform): string;

export function formatPhoneNumber({
  value,
  separator = " ",
  takeNumberOnly = false,
  checkValidOnly = false,
  plusNumberCountry = "+",
  openingNumberCountry = "(",
  closingNumberCountry = ")",
}: FormatPhoneNumberProps) {
  if (!value) {
    return "";
  }

  if (typeof value !== "string") {
    value = String(value);
  }

  if (takeNumberOnly) {
    const regex = /[^\d.]/g;
    return value.replace(regex, "");
  }

  if (typeof checkValidOnly == "boolean" && checkValidOnly) {
    const regex = new RegExp("/[^d.+s()]\\b" + separator + "\\b", "g");
    if (regex.test(value) || value.replace(/[^\d.]/g, "").length >= 24) {
      return false;
    } else {
      return true;
    }
  }

  value = value.replace(/\D/g, "");

  let char = {
    0: `${openingNumberCountry}${plusNumberCountry}`,
    3: `${closingNumberCountry} `,
    6: separator,
    10: separator,
    14: separator,
    18: separator,
    22: separator,
  };

  let valuePlaceHolder = "";

  for (let i = 0; i < value.length; i++) {
    valuePlaceHolder += ((char as unknown as string[])[i] || "") + value[i];
  }

  return valuePlaceHolder;
}
