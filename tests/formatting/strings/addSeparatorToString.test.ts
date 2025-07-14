import { addSeparatorToString } from "@/index";
import { describe, it, expect } from "vitest";

describe("addSeparatorToString", () => {
  it("should insert separator every limiter characters", () => {
    expect(addSeparatorToString("1234567890", 3, "-")).toBe("123-456-789-0");
  });

  it("should reset counting after space if reCountAfterSpace=true", () => {
    expect(addSeparatorToString("AB CD EF GH", 2, "-", true)).toBe(
      "AB-CD EF-GH"
    );
  });
  it("should reset counting after space if reCountAfterSpace=true", () => {
    expect(addSeparatorToString("ABC DEF GHI JKL", 3, "-", true)).toBe(
      "ABC-DEF-GHI JKL"
    );
  });
  it("should reset counting after space if reCountAfterSpace=true", () => {
    expect(addSeparatorToString("ABC  DEF GHI JKL MNO", 3, "-", true)).toBe(
      "ABC-DEF-GHI JKL-MNO"
    );
    expect(addSeparatorToString("ABC DEF GHI JKL MNO OPQ", 4, "-", true)).toBe(
      "ABC-DEF-GHI-JKL MNO-OPQ"
    );
  });

  it("should default separator to space if not provided", () => {
    expect(addSeparatorToString("abcdefghij", 3)).toBe("abc def ghi j");
  });

  it("should not modify string if limiter is zero or negative", () => {
    expect(addSeparatorToString("abcde", 0)).toBe("abcde");
    expect(addSeparatorToString("abcde", -1)).toBe("abcde");
  });

  it("should return original string if empty or nullish", () => {
    expect(addSeparatorToString("", 3)).toBe("");
    expect(addSeparatorToString(null as any, 3)).toBe(null);
  });

  it("should throw TypeError if argument types are invalid", () => {
    expect(() => addSeparatorToString(123 as any, 3, "-")).toThrow(TypeError);
    expect(() => addSeparatorToString("abc", "3" as any, "-")).toThrow(
      TypeError
    );
    expect(() => addSeparatorToString("abc", 3, 5 as any)).toThrow(TypeError);
    expect(() => addSeparatorToString("abc", 3, "-", "true" as any)).toThrow(
      TypeError
    );
  });
});
