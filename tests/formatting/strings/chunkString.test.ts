import { chunkString } from "@/index";
import { describe, it, expect } from "vitest";

describe("chunkString", () => {
  it("should insert separator every limiter characters", () => {
    expect(chunkString("1234567890", 3, "-")).toBe("123-456-789-0");
  });

  it("should reset counting after space if reCountAfterSpace=true", () => {
    expect(chunkString("AB CD EF GH", 2, "-", true)).toBe("AB-CD EF-GH");
  });
  it("should reset counting after space if reCountAfterSpace=true", () => {
    expect(chunkString("ABC DEF GHI JKL", 3, "-", true)).toBe(
      "ABC-DEF-GHI JKL"
    );
  });
  it("should reset counting after space if reCountAfterSpace=true", () => {
    expect(chunkString("ABC  DEF GHI JKL MNO", 3, "-", true)).toBe(
      "ABC-DEF-GHI JKL-MNO"
    );
    expect(chunkString("ABC DEF GHI JKL MNO OPQ", 4, "-", true)).toBe(
      "ABC-DEF-GHI-JKL MNO-OPQ"
    );
  });

  it("should default separator to space if not provided", () => {
    expect(chunkString("abcdefghij", 3)).toBe("abc def ghi j");
  });

  it("should not modify string if limiter is zero or negative", () => {
    expect(chunkString("abcde", 0)).toBe("abcde");
    expect(chunkString("abcde", -1)).toBe("abcde");
  });

  it("should return original string if empty or nullish", () => {
    expect(chunkString("", 3)).toBe("");
    expect(chunkString(null as any, 3)).toBe(null);
  });

  it("should throw TypeError if argument types are invalid", () => {
    expect(() => chunkString(123 as any, 3, "-")).toThrow(TypeError);
    expect(() => chunkString("abc", "3" as any, "-")).toThrow(TypeError);
    expect(() => chunkString("abc", 3, 5 as any)).toThrow(TypeError);
    expect(() => chunkString("abc", 3, "-", "true" as any)).toThrow(TypeError);
  });
});
