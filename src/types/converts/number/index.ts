import type { OmitStrict } from "@/types";

export type FormatPhoneNumberProps = {
  /** @description If value is undefined or null will return "" */
  value?: string | null;
  /** @default " " */
  separator?: string;
  /** @default "+" */
  plusNumberCountry?: string;
  /** @default "(" */
  openingNumberCountry?: string;
  /** @default ")" */
  closingNumberCountry?: string;
  /** @default false */
  checkValidOnly?: boolean;
  /** @default false */
  takeNumberOnly?: boolean;
};

export type FormatPhoneNumberPropsString = OmitStrict<
  FormatPhoneNumberProps,
  "checkValidOnly" | "takeNumberOnly"
> & {
  /** @default false */
  checkValidOnly?: false;
  /** @default false */
  takeNumberOnly?: false;
};

export type FormatPhoneNumberPropsBoolean = OmitStrict<
  FormatPhoneNumberProps,
  | "separator"
  | "plusNumberCountry"
  | "closingNumberCountry"
  | "openingNumberCountry"
  | "takeNumberOnly"
>;

export type FormatPhoneNumberPropsTransform = OmitStrict<
  FormatPhoneNumberProps,
  | "separator"
  | "plusNumberCountry"
  | "closingNumberCountry"
  | "openingNumberCountry"
  | "checkValidOnly"
>;
