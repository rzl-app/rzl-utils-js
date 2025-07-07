import type { UnionToTuple } from "./types";

/** ----------------------------------------
 * * ***Creates a helper function for `shouldForwardProp` in styled-components.***
 * * ***This function filters out specified props from being passed to the DOM.***
 * ----------------------------------------
 *
 * @template CustomProps - The type of custom component props.
 * @param {Array<keyof CustomProps>} props - List of prop keys to be excluded.
 * @returns A function that determines whether a prop should be forwarded.
 * @throws {Error} If the provided `props` is not an array.
 */
export const shouldForwardProp = <CustomProps>(
  props: UnionToTuple<keyof CustomProps>
) => {
  if (!Array.isArray(props)) {
    throw new Error(
      "Invalid argument: `props` must be an array from function `shouldForwardProp`."
    );
  }

  return (propName: PropertyKey): boolean => {
    return !(props as (keyof CustomProps)[])
      .map((p) => p.toString())
      .includes(propName.toString());
  };
};
