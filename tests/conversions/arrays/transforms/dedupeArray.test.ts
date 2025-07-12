import { dedupeArray } from "@/index";
import { describe, it, expect } from "vitest";

describe("dedupeArray", () => {
  it("should remove duplicates from a flat string array", () => {
    expect(dedupeArray(["apple", "banana", "apple", "orange"])).toEqual([
      "apple",
      "banana",
      "orange",
    ]);
  });

  it("should remove duplicates from a flat number array", () => {
    expect(dedupeArray([1, 2, 2, 3, 4, 1])).toEqual([1, 2, 3, 4]);
  });

  it("should remove duplicates from a mixed nested array", () => {
    expect(dedupeArray(["apple", [1, 2, "apple"], 2, 1])).toEqual([
      "apple",
      1,
      2,
    ]);
  });

  it("should remove duplicates with deeply nested arrays", () => {
    expect(
      dedupeArray([["apple", "banana"], ["apple", "orange"], "banana"])
    ).toEqual(["apple", "banana", "orange"]);
  });

  it("should return empty array for empty input", () => {
    expect(dedupeArray([])).toEqual([]);
  });

  it("should remove duplicates and force elements to strings when forceToString=true", () => {
    expect(dedupeArray(["apple", [1, 2, "apple"], 2, 1], true)).toEqual([
      "apple",
      "1",
      "2",
    ]);
    expect(dedupeArray([1, 2, 2, 3, 1], true)).toEqual(["1", "2", "3"]);
  });

  it("should handle nested numbers with forceToString=true", () => {
    expect(dedupeArray([[1, 2], [2, 3], 1], true)).toEqual(["1", "2", "3"]);
  });

  it("should throw if input is not an array", () => {
    expect(() => dedupeArray("not an array" as any)).toThrow(TypeError);
    expect(() => dedupeArray(123 as any)).toThrow(TypeError);
    expect(() => dedupeArray({} as any)).toThrow(TypeError);
  });

  it("should throw if forceToString is not boolean", () => {
    expect(() => dedupeArray([1, 2, 3], "true" as any)).toThrow(TypeError);
    expect(() => dedupeArray([1, 2, 3], 1 as any)).toThrow(TypeError);
  });

  it("should throw if array contains unsupported types", () => {
    expect(() => dedupeArray([1, 2, {} as any])).toThrow(TypeError);
    expect(() => dedupeArray([1, [2, Symbol("x")] as any])).toThrow(TypeError);
    expect(() => dedupeArray([1, [2, () => {}] as any])).toThrow(TypeError);
  });

  it("should preserve original order of first occurrences", () => {
    expect(dedupeArray([3, 1, 2, 3, 1, 2])).toEqual([3, 1, 2]);
    expect(dedupeArray(["b", "a", "b", "c", "a"])).toEqual(["b", "a", "c"]);
  });
});
