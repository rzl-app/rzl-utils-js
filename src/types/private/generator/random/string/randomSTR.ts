export type RandomStringOptions = {
  /** Ensures no whitespace characters in the generated string. Default: `true`. */
  avoidWhiteSpace?: boolean;
  /** Custom characters to replace the default number set if `type` is "number". */
  replaceGenInt?: string;
  /** Custom characters to replace the default string set if `type` is "string". */
  replaceGenStr?: string;
  /** Additional characters to include in the generated string. */
  addChar?: string;
  /** Minimum length of the generated string (1 to 5000). Default: `40`. */
  minLength?: number;
  /** Maximum length of the generated string (1 to 5000). Default: `40`. */
  maxLength?: number;
  /** Type of output: "string" (default) or "number". */
  type?: "string" | "number";
};

export type RandomSTRProps = {
  /** * Forcing un-replacing whitespace
   *
   *  @default true */
  forceNoWhiteSpace?: false;
  /** * Replacing default randomly generated number if type is "number"
   *
   *  @default undefined */
  replaceGenInt?: string;
  /** * Replacing default randomly generated string if type is "string"
   *
   *  @default undefined */
  replaceGenStr?: string;
  /** * Add new push randomly generated characters
   *
   *  @default undefined */
  addChar?: string;
  /** * Minimal `1` maximal `5000` as number
   *
   *  @default 40 */
  length?: number;
  /** * Represents of result generating as string or number
   * @default "string"
   * */
  type?: "string" | "number";
};
