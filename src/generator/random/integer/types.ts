import type { Range_1_to_999_AsExport } from "@/types/number/numbAsExports";

export type RandomINTProps = {
  /** * Minimal `1` maximal `16` as number
   *
   *  @default 16 */
  length?: Range_1_to_999_AsExport<1, 16>;
  /** * Set `true` will avoiding (zero / 0) result of generating
   * @default false
   * */
  avoidZero?: true;
};
