import { describe, it, expect } from "vitest";
import { textMatchesAllPatterns } from "@/predicates";

describe("textMatchesAllPatterns - comprehensive tests", () => {
  it("should return true if all words are found in the text (default options)", () => {
    expect(
      textMatchesAllPatterns("Hello world, WithAI APP", ["Hello", "world"], {})
    ).toBe(true);
    expect(
      textMatchesAllPatterns(
        "JavaScript and TypeScript",
        ["Java", "Script"],
        {}
      )
    ).toBe(true);
  });

  it("should return false if any word is missing", () => {
    expect(
      textMatchesAllPatterns("Machine Learning", ["AI", "Learning"], {})
    ).toBe(false);
    expect(textMatchesAllPatterns("Hello there", ["Hello", "world"], {})).toBe(
      false
    );
  });

  it("should respect exactMatch option", () => {
    expect(
      textMatchesAllPatterns("open-source", ["open"], { exactMatch: true })
    ).toBe(false);
    expect(
      textMatchesAllPatterns("open source", ["open"], { exactMatch: true })
    ).toBe(true);
  });

  it("should work with custom regex flags", () => {
    expect(
      textMatchesAllPatterns("Hello WORLD", ["world"], { flags: "" })
    ).toBe(false); // case-sensitive
    expect(
      textMatchesAllPatterns("Hello WORLD", ["world"], { flags: "i" })
    ).toBe(true); // case-insensitive
  });

  it("should escape special regex characters in searchWords", () => {
    expect(textMatchesAllPatterns("Price is $15.99", ["$15.99"], {})).toBe(
      true
    );
    expect(textMatchesAllPatterns("RegExp test (a+b)*", ["(a+b)*"], {})).toBe(
      true
    );
  });

  it("should trim empty strings and ignore them", () => {
    expect(textMatchesAllPatterns("Hello world", ["", "Hello"], {})).toBe(true);
    expect(textMatchesAllPatterns("Hello world", ["", ""], {})).toBe(false);
  });

  it("should return false for empty text or non-string text", () => {
    // @ts-expect-error
    expect(textMatchesAllPatterns(null, ["test"], {})).toBe(false);
    expect(textMatchesAllPatterns("", ["test"], {})).toBe(false);
    // @ts-expect-error
    expect(textMatchesAllPatterns(123, ["test"], {})).toBe(false);
  });

  it("should return false if searchWords is not an array or empty", () => {
    // @ts-expect-error
    expect(textMatchesAllPatterns("Hello", null, {})).toBe(false);
    expect(textMatchesAllPatterns("Hello", [], {})).toBe(false);
  });

  it("should throw if options is not an object", () => {
    expect(() =>
      // @ts-expect-error
      textMatchesAllPatterns("Hello", ["Hello"], "invalid")
    ).toThrow("props 'options' must be `object` type!");
  });

  it("should throw if exactMatch is not a boolean", () => {
    expect(() =>
      // @ts-expect-error
      textMatchesAllPatterns("Hello", ["Hello"], { exactMatch: "yes" })
    ).toThrow("props 'exactMatch' must be `boolean` type!");
  });

  it("should throw if flags is not a string", () => {
    expect(() =>
      // @ts-expect-error
      textMatchesAllPatterns("Hello", ["Hello"], { flags: 123 })
    ).toThrow("props 'flags' must be `string` type!");
  });

  // ⬇️ Tambahan test
  it("should return true with multiple spaces and line breaks", () => {
    expect(
      textMatchesAllPatterns("Hello    world\nNew Line", ["Hello", "world"], {})
    ).toBe(true);
  });

  it("should return true with partial words if exactMatch is false", () => {
    expect(
      textMatchesAllPatterns("Javascript", ["Script"], { exactMatch: false })
    ).toBe(true);
  });

  it("should return false with partial words if exactMatch is true", () => {
    expect(
      textMatchesAllPatterns("Javascript", ["Script"], { exactMatch: true })
    ).toBe(false);
  });

  it("should handle complex combination of special characters and spaces", () => {
    expect(
      textMatchesAllPatterns("Price: 12,000.50 USD", ["12,000.50"], {})
    ).toBe(true);
    expect(
      textMatchesAllPatterns(
        "Math formula: (a+b)^2 = a^2 + 2ab + b^2",
        ["(a+b)^2"],
        {}
      )
    ).toBe(true);
  });

  it("should work with symbols and unicode characters", () => {
    expect(textMatchesAllPatterns("Emoji test 😃👍🏽", ["😃", "👍🏽"], {})).toBe(
      true
    );
    expect(textMatchesAllPatterns("中文测试", ["测试"], {})).toBe(true);
  });

  it("should handle hyphen or dash properly with exactMatch", () => {
    expect(
      textMatchesAllPatterns("re-use and re-enter", ["use"], {
        exactMatch: true,
      })
    ).toBe(false);
    expect(
      textMatchesAllPatterns("re use and re enter", ["use"], {
        exactMatch: true,
      })
    ).toBe(true);
  });

  it("should match words adjacent to punctuation with exactMatch false", () => {
    expect(
      textMatchesAllPatterns("Hello, world!", ["world"], { exactMatch: false })
    ).toBe(true);
    expect(
      textMatchesAllPatterns("Hello, world!", ["world"], { exactMatch: true })
    ).toBe(false);
  });

  it("should be able to handle tabs and multiple lines", () => {
    expect(
      textMatchesAllPatterns("Hello\tworld\nnext line", ["Hello", "world"], {})
    ).toBe(true);
  });

  it("should correctly return false when words are scrambled order", () => {
    expect(
      textMatchesAllPatterns(
        "Hello world test string",
        ["test", "world", "foo"],
        {}
      )
    ).toBe(false);
  });

  it("should be able to use regex flags like global and multiline", () => {
    expect(
      textMatchesAllPatterns("Hello\nworld\nHello\nworld", ["Hello"], {
        flags: "gm",
      })
    ).toBe(true);
  });
});
