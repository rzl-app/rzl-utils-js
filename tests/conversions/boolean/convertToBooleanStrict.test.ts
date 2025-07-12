import { convertToBooleanStrict } from "@/index";
import { describe, expect, it } from "vitest";

const stringifyForTest = (value: unknown): string => {
  if (typeof value === "symbol") return value.toString();
  if (typeof value === "function") return "[Function]";
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

describe("convertToBooleanStrict", () => {
  const cases: [unknown, boolean][] = [
    [null, false],
    [undefined, false],
    ["", false],
    ["   ", false],
    ["  asd ", true],
    ["abc", true],
    [0, false],
    [42, true],
    [[], false],
    [[1], true],
    [{}, false],
    [{ a: 1 }, true],
  ];

  cases.forEach(([input, expected]) => {
    it(`should convert ${stringifyForTest(input)} to ${expected}`, () => {
      expect(convertToBooleanStrict(input)).toBe(expected);
    });
  });

  it("should convert Symbol to true", () => {
    expect(convertToBooleanStrict(Symbol("s"))).toBe(true);
  });

  it("should convert function to true", () => {
    expect(convertToBooleanStrict(() => {})).toBe(true);
  });
});
