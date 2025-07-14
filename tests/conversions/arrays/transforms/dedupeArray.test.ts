import { dedupeArray } from "@/index";
import { describe, it, expect } from "vitest";

describe("dedupeArray with options object", () => {
  it("should dedupe globally without forceToString", () => {
    const input = [1, 1, 2, 2, 3, 3];
    const result = dedupeArray(input, {});
    expect(result).toEqual([1, 2, 3]);
  });

  it("should dedupe string/number globally with forceToString", () => {
    const input = [1, "1", 2, "2", 3, "3"];
    const result = dedupeArray(input, { forceToString: "stringOrNumber" });
    expect(result).toEqual(["1", "2", "3"]);
  });

  it("should keep non-string/number values intact when using forceToString 'stringOrNumber'", () => {
    const obj = { test: true };
    const fn = () => 123;
    const input = ["100", 100, obj, fn, "200", 200, [obj, fn, "100", 100]];
    const result = dedupeArray(input, { forceToString: "stringOrNumber" });
    expect(result).toEqual([
      "100",
      { test: true },
      fn,
      "200",
      [{ test: true }, fn, "100"],
    ]);
  });

  it("should convert booleans, bigint, undefined etc. when using forceToString 'primitives'", () => {
    const input = [true, "true", false, undefined, "undefined"];
    const result = dedupeArray(input, { forceToString: "primitives" });
    expect(result).toEqual(["true", "false", "undefined"]);
  });

  it("should dedupe separately inside each nested array", () => {
    const obj1 = { a: 1 };
    const obj2 = { b: 2 };
    const input = [1, "1", [2, "2", obj1, obj2, [3, "3", obj1, obj2]]];
    const result = dedupeArray(input, { forceToString: "stringOrNumber" });
    expect(result).toEqual([
      "1",
      ["2", { a: "1" }, { b: "2" }, ["3", { a: "1" }, { b: "2" }]],
    ]);
  });

  it("should handle deeply mixed structures with 'all'", () => {
    const obj = { a: 1 };
    const fn = () => 1;
    const input = [1, "1", obj, fn, [2, "2", obj, fn, [3, "3", obj, fn]]];
    const result = dedupeArray(input, { forceToString: "all" });
    expect(result).toEqual([
      "1",
      { a: "1" },
      "() => 1",
      ["2", { a: "1" }, "() => 1", ["3", { a: "1" }, "() => 1"]],
    ]);
  });

  it("should handle deeply nested identical numbers with forceToString 'stringOrNumber'", () => {
    const input = [1, [1, [1, [1]]]];
    const result = dedupeArray(input, { forceToString: "stringOrNumber" });
    expect(result).toEqual(["1", ["1", ["1", ["1"]]]]);
  });

  it("should handle nested empty arrays", () => {
    const input = [[], [[]], [[[]]], [[]], [[[]]]];
    const result = dedupeArray(input, { forceToString: "stringOrNumber" });
    expect(result).toEqual([[], [[]], [[[]]]]);
  });

  it("should keep different type values separate when forceToString is false", () => {
    const input = [1, "1", [1, "1", [1, "1"], [1, "1"]]];
    const result = dedupeArray(input, { forceToString: false });
    expect(result).toEqual([1, "1", [1, "1", [1, "1"]]]);
  });

  describe("type errors", () => {
    it("should throw TypeError if inputArray is not an array", () => {
      expect(() => dedupeArray("not-an-array" as any, {})).toThrow(TypeError);
      expect(() => dedupeArray(123 as any, {})).toThrow(TypeError);
      expect(() => dedupeArray(null as any, {})).toThrow(TypeError);
    });

    it("should throw TypeError if options is not an object", () => {
      expect(() => dedupeArray([1, 2, 3], null as any)).toThrow(TypeError);
      expect(() => dedupeArray([1, 2, 3], "string" as any)).toThrow(TypeError);
      expect(() => dedupeArray([1, 2, 3], 123 as any)).toThrow(TypeError);
    });

    it("should throw TypeError if forceToString is an invalid value", () => {
      expect(() =>
        dedupeArray([1, 2, 3], { forceToString: "invalid" as any })
      ).toThrow(TypeError);
      expect(() =>
        dedupeArray([1, 2, 3], { forceToString: 123 as any })
      ).toThrow(TypeError);
      expect(() =>
        dedupeArray([1, 2, 3], { forceToString: [] as any })
      ).toThrow(TypeError);
    });
  });
});
