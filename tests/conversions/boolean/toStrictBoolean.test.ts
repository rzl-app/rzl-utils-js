import { toStrictBoolean } from "@/index";
import { describe, it, expect } from "vitest";

describe("toStrictBoolean", () => {
  it("should correctly detect truthy string values", () => {
    expect(toStrictBoolean("true")).toBe(true);
    expect(toStrictBoolean("on")).toBe(true);
    expect(toStrictBoolean("yes")).toBe(true);
    expect(toStrictBoolean("1")).toBe(true);
    expect(toStrictBoolean("indeterminate")).toBe(true);
  });

  it("should be case insensitive by default", () => {
    expect(toStrictBoolean("TRUE")).toBe(true);
    expect(toStrictBoolean("On")).toBe(true);
    expect(toStrictBoolean("YeS")).toBe(true);
  });

  it("should trim string by default", () => {
    expect(toStrictBoolean("   true   ")).toBe(true);
    expect(toStrictBoolean("   yes")).toBe(true);
    expect(toStrictBoolean("on   ")).toBe(true);
  });

  it("should respect caseInsensitive option", () => {
    expect(toStrictBoolean("TRUE", { caseInsensitive: false })).toBe(false);
    expect(toStrictBoolean("yes", { caseInsensitive: false })).toBe(true);
  });

  it("should respect trimString option", () => {
    expect(toStrictBoolean("   true   ", { trimString: false })).toBe(false);
    expect(toStrictBoolean("true   ", { trimString: false })).toBe(false);
    expect(toStrictBoolean("true", { trimString: false })).toBe(true);
  });

  it("should throw if caseInsensitive is not a boolean", () => {
    expect(() =>
      toStrictBoolean("yes", { caseInsensitive: null as any })
    ).toThrow(TypeError);

    expect(() =>
      toStrictBoolean("yes", { caseInsensitive: "abc" as any })
    ).toThrow(TypeError);
  });

  it("should throw if trimString is not a boolean", () => {
    expect(() => toStrictBoolean("yes", { trimString: null as any })).toThrow(
      TypeError
    );

    expect(() => toStrictBoolean("yes", { trimString: 123 as any })).toThrow(
      TypeError
    );
  });

  it("should handle number input", () => {
    expect(toStrictBoolean(1)).toBe(true);
    expect(toStrictBoolean(0)).toBe(false);
    expect(toStrictBoolean(100)).toBe(false);
  });

  it("should handle boolean input", () => {
    expect(toStrictBoolean(true)).toBe(true);
    expect(toStrictBoolean(false)).toBe(false);
  });

  it("should handle null or undefined", () => {
    expect(toStrictBoolean(null)).toBe(false);
    expect(toStrictBoolean(undefined)).toBe(false);
  });

  it("should return false for unrelated string", () => {
    expect(toStrictBoolean("foo")).toBe(false);
    expect(toStrictBoolean("0")).toBe(false);
  });
});
