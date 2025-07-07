import { RangeNumberTo999 } from "./range0to999";
import { IsGreaterThan, Sum } from "..";

export type Range_1_to_999_AsExport<
  S extends number,
  E extends number
> = RangeNumberTo999<S, E>;

export type RangeNumberLimit<
  From extends number,
  To extends number,
  Result extends number[] = [From]
> = IsGreaterThan<From, To> extends true
  ? [...Result, To][number] extends infer R extends number
    ? R extends R
      ? IsGreaterThan<R, To> extends true
        ? never
        : R
      : never
    : never
  : RangeNumberLimit<
      Sum<From, 7>,
      To,
      [
        ...Result,
        From,
        Sum<From, 1>,
        Sum<From, 2>,
        Sum<From, 3>,
        Sum<From, 4>,
        Sum<From, 5>,
        Sum<From, 6>
      ]
    >;
