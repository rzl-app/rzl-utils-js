import { describe, it, expect } from "vitest";
import { textMatchesAnyPatterns } from "@/predicates";

describe("textMatchesAnyPatterns", () => {
  it("should return true if at least one word is found (default options)", () => {
    expect(
      textMatchesAnyPatterns("Hello world, WithAI APP", ["hello", "foo"], {})
    ).toBe(true);
    expect(
      textMatchesAnyPatterns(
        "JavaScript and TypeScript",
        ["Python", "Script"],
        {}
      )
    ).toBe(true);
  });

  it("should return false if no words found at all", () => {
    expect(textMatchesAnyPatterns("Machine Learning", ["AI", "Deep"], {})).toBe(
      false
    );
    expect(textMatchesAnyPatterns("Hello there", ["world"], {})).toBe(false);
  });

  it("should respect exactMatch option for single words", () => {
    expect(
      textMatchesAnyPatterns("open-source", ["open"], { exactMatch: true })
    ).toBe(false);
    expect(
      textMatchesAnyPatterns("open source", ["open"], { exactMatch: true })
    ).toBe(true);
    expect(
      textMatchesAnyPatterns("reusing code", ["use"], { exactMatch: true })
    ).toBe(false);
  });

  it("should work with custom regex flags", () => {
    expect(
      textMatchesAnyPatterns("Hello WORLD", ["world"], { flags: "" })
    ).toBe(false); // case-sensitive
    expect(
      textMatchesAnyPatterns("Hello WORLD", ["world"], { flags: "i" })
    ).toBe(true); // case-insensitive
  });

  it("should escape special regex characters in searchWords", () => {
    expect(textMatchesAnyPatterns("Price is $15.99", ["$15.99"], {})).toBe(
      true
    );
    expect(textMatchesAnyPatterns("RegExp test (a+b)*", ["(a+b)*"], {})).toBe(
      true
    );
    expect(textMatchesAnyPatterns("C++ vs Java", ["C++"], {})).toBe(true);
  });

  it("should trim empty strings and ignore them", () => {
    expect(textMatchesAnyPatterns("Hello world", ["", "Hello"], {})).toBe(true);
    expect(textMatchesAnyPatterns("Hello world", ["", ""], {})).toBe(false);
  });

  it("should return false for empty text or non-string text", () => {
    // @ts-expect-error
    expect(textMatchesAnyPatterns(null, ["test"], {})).toBe(false);
    expect(textMatchesAnyPatterns("", ["test"], {})).toBe(false);
    // @ts-expect-error
    expect(textMatchesAnyPatterns(123, ["test"], {})).toBe(false);
  });

  it("should return false if searchWords is not an array or empty", () => {
    // @ts-expect-error
    expect(textMatchesAnyPatterns("Hello", null, {})).toBe(false);
    expect(textMatchesAnyPatterns("Hello", [], {})).toBe(false);
  });

  it("should throw if options is not an object", () => {
    expect(() =>
      // @ts-expect-error
      textMatchesAnyPatterns("Hello", ["Hello"], "invalid")
    ).toThrow("props 'options' must be `object` type!");
  });

  it("should throw if exactMatch is not a boolean", () => {
    expect(() =>
      // @ts-expect-error
      textMatchesAnyPatterns("Hello", ["Hello"], { exactMatch: "yes" })
    ).toThrow("props 'exactMath' must be `boolean` type!");
  });

  it("should throw if flags is not a string", () => {
    expect(() =>
      // @ts-expect-error
      textMatchesAnyPatterns("Hello", ["Hello"], { flags: 123 })
    ).toThrow("props 'flags' must be `string` type!");
  });

  it("should match at least one word among many searchWords", () => {
    expect(
      textMatchesAnyPatterns(
        "TypeScript is great",
        ["foo", "bar", "Script"],
        {}
      )
    ).toBe(true);
    expect(
      textMatchesAnyPatterns("TypeScript is great", ["foo", "bar", "baz"], {})
    ).toBe(false);
  });

  it("should handle multiple spaces, tabs, and newlines", () => {
    expect(
      textMatchesAnyPatterns("Hello    world\nNew Line\tTabbed", ["world"], {})
    ).toBe(true);
    expect(textMatchesAnyPatterns("Hello\nNewLine", ["NewLine"], {})).toBe(
      true
    );
  });

  it("should return true if partial word found with exactMatch false", () => {
    expect(
      textMatchesAnyPatterns("Javascript", ["Script"], { exactMatch: false })
    ).toBe(true);
  });

  it("should return false if partial word found with exactMatch true", () => {
    expect(
      textMatchesAnyPatterns("Javascript", ["Script"], { exactMatch: true })
    ).toBe(false);
  });

  it("should handle complex punctuation and symbols", () => {
    expect(
      textMatchesAnyPatterns("Total: 12,000.50 USD!", ["12,000.50"], {})
    ).toBe(true);
    expect(
      textMatchesAnyPatterns("Formula: (a+b)^2 = ...", ["(a+b)^2"], {})
    ).toBe(true);
  });

  it("should work with emoji and unicode characters", () => {
    expect(textMatchesAnyPatterns("Test 😃👍🏽", ["👍🏽"], {})).toBe(true);
    expect(textMatchesAnyPatterns("测试中文", ["中文"], {})).toBe(true);
  });

  it("should match if only one among many special patterns found", () => {
    expect(textMatchesAnyPatterns("x+y = z", ["(x+y)", "(a+b)"], {})).toBe(
      false
    );
    expect(textMatchesAnyPatterns("price is $20", ["foo", "$20"], {})).toBe(
      true
    );
  });

  it("should work with global & multiline flags for repeated words", () => {
    expect(
      textMatchesAnyPatterns("hello\nhello\nhello", ["hello"], { flags: "gm" })
    ).toBe(true);
  });
});
