export type FormatCurrencyOptions = {
  /** `Required String | Number Props Type` */
  value: string | number;
  /** `Default: "."` */
  separator?: string;
  /** `Default: false` */
  decimal?: boolean;
  /** `Default: 2` */
  totalDecimal?: number;
  /** `Default: true` */
  endDecimal?: boolean;
  /** `Default: ".-"` */
  suffixDecimal?: string;
  /** `Default: ","` */
  separatorDecimals?: string;
};

export interface PropsReplaceNonNumeric {
  value?: string | number | null;
}
