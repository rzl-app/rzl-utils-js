import { isDeepEqual } from "@/predicates";
import { describe, it, expect } from "vitest";

describe("isDeepEqual", () => {
  it("should equal primitive numbers and strings", () => {
    expect(isDeepEqual(1, 1)).toBe(true);
    expect(isDeepEqual("a", "a")).toBe(true);
    expect(isDeepEqual(1, "1")).toBe(false);
  });

  it("should handle NaN equality", () => {
    expect(isDeepEqual(NaN, NaN)).toBe(true);
    expect(isDeepEqual(NaN, 0)).toBe(false);
  });

  it("should compare Dates by time", () => {
    expect(isDeepEqual(new Date("2025-01-01"), new Date("2025-01-01"))).toBe(
      true
    );
    expect(isDeepEqual(new Date("2025-01-01"), new Date("2025-01-02"))).toBe(
      false
    );
  });

  it("should compare RegExp by string", () => {
    expect(isDeepEqual(/abc/, /abc/)).toBe(true);
    expect(isDeepEqual(/abc/i, /abc/)).toBe(false);
  });

  it("should compare Symbols by description", () => {
    expect(isDeepEqual(Symbol("x"), Symbol("x"))).toBe(true);
    expect(isDeepEqual(Symbol("x"), Symbol("y"))).toBe(false);
  });

  it("should deeply equal nested arrays", () => {
    expect(isDeepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(isDeepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
    expect(isDeepEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it("should deeply equal nested objects", () => {
    expect(isDeepEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(isDeepEqual({ a: { b: 2 } }, { a: { b: 2 } })).toBe(true);
    expect(isDeepEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(isDeepEqual({ a: 1 }, { b: 1 })).toBe(false);
  });

  it("should handle mixed structures", () => {
    const obj1 = { a: [1, { b: 2 }], c: new Date("2025-01-01") };
    const obj2 = { a: [1, { b: 2 }], c: new Date("2025-01-01") };
    expect(isDeepEqual(obj1, obj2)).toBe(true);
  });

  it("should handle different types", () => {
    expect(isDeepEqual(1, {})).toBe(false);
    expect(isDeepEqual([], {})).toBe(false);
    expect(isDeepEqual({}, [])).toBe(false);
    expect(isDeepEqual([], null)).toBe(false);
  });

  it("should treat null and undefined distinctly", () => {
    expect(isDeepEqual(null, undefined)).toBe(false);
    expect(isDeepEqual(null, null)).toBe(true);
    expect(isDeepEqual(undefined, undefined)).toBe(true);
  });
});
