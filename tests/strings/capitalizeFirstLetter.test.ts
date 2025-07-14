import { describe, it, expect } from "vitest";
import { capitalizeFirstLetter } from "@/index";

describe("capitalizeFirstLetter", () => {
  it("should capitalize first letter and lowercase the rest by default", () => {
    expect(capitalizeFirstLetter("hello WORLD")).toBe("Hello world");
    expect(capitalizeFirstLetter("JAVA script")).toBe("Java script");
    expect(capitalizeFirstLetter("m")).toBe("M");
    expect(capitalizeFirstLetter("HELLO")).toBe("Hello");
    expect(capitalizeFirstLetter("heLLo")).toBe("Hello");
    expect(capitalizeFirstLetter("hELLO")).toBe("Hello");
  });

  it("should keep the rest intact if lowerCaseNextRest is false", () => {
    expect(
      capitalizeFirstLetter("hello WORLD", {
        lowerCaseNextRest: false,
      })
    ).toBe("Hello WORLD");
    expect(
      capitalizeFirstLetter("javaScript", {
        lowerCaseNextRest: false,
      })
    ).toBe("JavaScript");
    expect(
      capitalizeFirstLetter("hELLo WOrLD", {
        lowerCaseNextRest: false,
      })
    ).toBe("HELLo WOrLD".replace(/^./, (c) => c.toUpperCase()));
  });

  it("should trim when trim option is true", () => {
    expect(capitalizeFirstLetter("   hello WORLD   ", { trim: true })).toBe(
      "Hello world"
    );
    expect(
      capitalizeFirstLetter("   JAVA script   ", {
        lowerCaseNextRest: false,
        trim: true,
      })
    ).toBe("JAVA script");
    expect(capitalizeFirstLetter("   m   ", { trim: true })).toBe("M");
    expect(capitalizeFirstLetter("    ", { trim: true })).toBe("");
  });

  it("should handle strings that are only whitespace", () => {
    expect(capitalizeFirstLetter("     ")).toBe("");
    expect(capitalizeFirstLetter("     ", { trim: true })).toBe("");
  });

  it("should handle non-latin & accented characters", () => {
    expect(capitalizeFirstLetter("ñandú")).toBe("Ñandú");
    expect(capitalizeFirstLetter("éclair")).toBe("Éclair");
    expect(capitalizeFirstLetter("čokoláda")).toBe("Čokoláda");
    expect(capitalizeFirstLetter("中華")).toBe("中華");
    expect(capitalizeFirstLetter("ñandú", { lowerCaseNextRest: false })).toBe(
      "Ñandú"
    );
  });

  it("should handle strings that start with numbers or symbols", () => {
    expect(capitalizeFirstLetter("123abc")).toBe("123abc");
    expect(capitalizeFirstLetter("!hello")).toBe("!hello");
    expect(capitalizeFirstLetter("👍 cool")).toBe("👍 cool");
  });

  it("should collapse multi-space with trim", () => {
    expect(
      capitalizeFirstLetter("   many     spaces   here  ", { trim: true })
    ).toBe("Many     spaces   here");
  });

  it("should return empty string for null, undefined, or empty input", () => {
    expect(capitalizeFirstLetter(null)).toBe("");
    expect(capitalizeFirstLetter(undefined)).toBe("");
    expect(capitalizeFirstLetter("")).toBe("");
  });

  it("should return empty string for non-string input types", () => {
    // @ts-expect-error
    expect(capitalizeFirstLetter(123)).toBe("");
    // @ts-expect-error
    expect(capitalizeFirstLetter({})).toBe("");
    // @ts-expect-error
    expect(capitalizeFirstLetter([])).toBe("");
    // @ts-expect-error
    expect(capitalizeFirstLetter(true)).toBe("");
    // @ts-expect-error
    expect(capitalizeFirstLetter(() => {})).toBe("");
  });

  it("should fallback to default options if options is invalid", () => {
    // @ts-expect-error
    expect(capitalizeFirstLetter("hello WORLD", "invalid")).toBe("Hello world");
    // @ts-expect-error
    expect(capitalizeFirstLetter("FOO", 123)).toBe("Foo");
    // @ts-expect-error
    expect(capitalizeFirstLetter("BAR", null)).toBe("Bar");
  });

  it("should handle single character strings correctly", () => {
    expect(capitalizeFirstLetter("h")).toBe("H");
    expect(capitalizeFirstLetter("H")).toBe("H");
    expect(capitalizeFirstLetter("ñ")).toBe("Ñ");
    expect(capitalizeFirstLetter("z", { lowerCaseNextRest: false })).toBe("Z");
  });

  it("should handle strings that are already properly capitalized", () => {
    expect(capitalizeFirstLetter("Hello world")).toBe("Hello world");
    expect(
      capitalizeFirstLetter("Hello World", {
        lowerCaseNextRest: false,
      })
    ).toBe("Hello World");
  });

  it("should lowercase the rest even if already uppercase", () => {
    expect(capitalizeFirstLetter("FOOBAR")).toBe("Foobar");
    expect(capitalizeFirstLetter("FOOBAR baz")).toBe("Foobar baz");
  });

  it("should handle multi-script mixes", () => {
    expect(capitalizeFirstLetter("абв ABC")).toBe("Абв abc");
    expect(
      capitalizeFirstLetter("абв ABC", {
        lowerCaseNextRest: false,
      })
    ).toBe("Абв ABC");
  });

  it("should preserve emojis / symbols intact", () => {
    expect(capitalizeFirstLetter("😄hello")).toBe("😄hello");
    expect(capitalizeFirstLetter("🤯HELLO WORLD")).toBe("🤯hello world");
  });
});
