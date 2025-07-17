import { toBooleanExplicit } from "@/index";
import { describe, it, expect } from "vitest";

describe("toBooleanExplicit", () => {
  it("should correctly detect truthy string values", () => {
    expect(toBooleanExplicit("true")).toBe(true);
    expect(toBooleanExplicit("on")).toBe(true);
    expect(toBooleanExplicit("yes")).toBe(true);
    expect(toBooleanExplicit("1")).toBe(true);
    expect(toBooleanExplicit("indeterminate")).toBe(true);
  });

  it("should be case insensitive by default", () => {
    expect(toBooleanExplicit("TRUE")).toBe(true);
    expect(toBooleanExplicit("On")).toBe(true);
    expect(toBooleanExplicit("YeS")).toBe(true);
  });

  it("should trim string by default", () => {
    expect(toBooleanExplicit("   true   ")).toBe(true);
    expect(toBooleanExplicit("   yes")).toBe(true);
    expect(toBooleanExplicit("on   ")).toBe(true);
  });

  it("should respect caseInsensitive option", () => {
    expect(toBooleanExplicit("TRUE", { caseInsensitive: false })).toBe(false);
    expect(toBooleanExplicit("yes", { caseInsensitive: false })).toBe(true);
  });

  it("should respect trimString option", () => {
    expect(toBooleanExplicit("   true   ", { trimString: false })).toBe(false);
    expect(toBooleanExplicit("true   ", { trimString: false })).toBe(false);
    expect(toBooleanExplicit("true", { trimString: false })).toBe(true);
  });

  it("should throw if caseInsensitive is not a boolean", () => {
    expect(() =>
      toBooleanExplicit("yes", { caseInsensitive: null as any })
    ).toThrow(TypeError);

    expect(() =>
      toBooleanExplicit("yes", { caseInsensitive: "abc" as any })
    ).toThrow(TypeError);
  });

  it("should throw if trimString is not a boolean", () => {
    expect(() => toBooleanExplicit("yes", { trimString: null as any })).toThrow(
      TypeError
    );

    expect(() => toBooleanExplicit("yes", { trimString: 123 as any })).toThrow(
      TypeError
    );
  });

  it("should handle number input", () => {
    expect(toBooleanExplicit(1)).toBe(true);
    expect(toBooleanExplicit(0)).toBe(false);
    expect(toBooleanExplicit(100)).toBe(false);
  });

  it("should handle boolean input", () => {
    expect(toBooleanExplicit(true)).toBe(true);
    expect(toBooleanExplicit(false)).toBe(false);
  });

  it("should handle null or undefined", () => {
    expect(toBooleanExplicit(null)).toBe(false);
    expect(toBooleanExplicit(undefined)).toBe(false);
  });

  it("should return false for unrelated string", () => {
    expect(toBooleanExplicit("foo")).toBe(false);
    expect(toBooleanExplicit("0")).toBe(false);
  });
});
