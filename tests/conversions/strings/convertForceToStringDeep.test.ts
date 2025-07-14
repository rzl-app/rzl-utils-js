import { describe, it, expect } from "vitest";
import { convertForceToStringDeep } from "@/conversions/strings/convertForceToStringDeep";

describe("convertForceToStringDeep", () => {
  it("should convert string and number to string with 'stringOrNumber'", () => {
    expect(convertForceToStringDeep(42, "stringOrNumber")).toBe("42");
    expect(convertForceToStringDeep("hello", "stringOrNumber")).toBe("hello");
    expect(convertForceToStringDeep(true, "stringOrNumber")).toBe(true);
  });

  it("should convert all primitives to string with 'primitives'", () => {
    expect(convertForceToStringDeep(42, "primitives")).toBe("42");
    expect(convertForceToStringDeep("hello", "primitives")).toBe("hello");
    expect(convertForceToStringDeep(true, "primitives")).toBe("true");
    expect(convertForceToStringDeep(undefined, "primitives")).toBe("undefined");
    expect(convertForceToStringDeep(BigInt(10), "primitives")).toBe("10");
    expect(convertForceToStringDeep(NaN, "primitives")).toBe("NaN");
  });

  it("should convert everything to string with 'all'", () => {
    const sym = Symbol("x");
    const fn = () => 1;
    const date = new Date("2025-01-01");
    const regex = /abc/;
    const map = new Map();
    const set = new Set();
    const err = new Error("err");
    const promise = Promise.resolve(1);

    expect(convertForceToStringDeep(sym, "all")).toBe("Symbol(x)");
    expect(convertForceToStringDeep(fn, "all")).toContain("=> 1");
    expect(convertForceToStringDeep(date, "all")).toBe(date.toISOString());
    expect(convertForceToStringDeep(regex, "all")).toBe("/abc/");
    expect(convertForceToStringDeep(map, "all")).toBe("[object Map]");
    expect(convertForceToStringDeep(set, "all")).toBe("[object Set]");
    expect(convertForceToStringDeep(err, "all")).toBe("Error: err");
    expect(convertForceToStringDeep(promise, "all")).toBe("[object Promise]");
  });

  it("should deeply convert objects and arrays", () => {
    const input = { a: 1, b: [true, { c: NaN }] };
    const output = convertForceToStringDeep(input, "primitives");
    expect(output).toEqual({ a: "1", b: ["true", { c: "NaN" }] });

    const all = convertForceToStringDeep(input, "all");
    expect(all).toEqual({ a: "1", b: ["true", { c: "NaN" }] });
  });

  it("should not convert anything if forceToString is false", () => {
    const sym = Symbol("x");
    const fn = () => 1;
    const date = new Date("2025-01-01");
    const regex = /abc/;

    expect(convertForceToStringDeep(42, false)).toBe(42);
    expect(convertForceToStringDeep("hello", false)).toBe("hello");
    expect(convertForceToStringDeep(true, false)).toBe(true);
    expect(convertForceToStringDeep(undefined, false)).toBeUndefined();
    expect(convertForceToStringDeep(NaN, false)).toBeNaN();
    expect(convertForceToStringDeep(sym, false)).toBe(sym);
    expect(convertForceToStringDeep(fn, false)).toBe(fn);
    expect(convertForceToStringDeep(date, false)).toBe(date);
    expect(convertForceToStringDeep(regex, false)).toBe(regex);
  });

  it("should handle nested complex structures with 'all'", () => {
    const complex = {
      x: [1, { y: new Date("2025-01-01"), z: Symbol("z") }],
      w: () => "hi",
    };
    const result = convertForceToStringDeep(complex, "all");
    expect(result).toEqual({
      x: ["1", { y: "2025-01-01T00:00:00.000Z", z: "Symbol(z)" }],
      w: expect.stringContaining("=>"),
    });
  });
});
