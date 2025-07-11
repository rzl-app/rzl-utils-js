import { describe, it, expect } from "vitest";
import { formatCurrency, parseCurrencyString } from "@/index";

describe("parseCurrencyString", () => {
  it("parse no separator thousand but use decimal separator with points", () => {
    expect(parseCurrencyString("1234.56")).toBeCloseTo(1234.56);
  });
  it("parse no separator thousand but use decimal separator with comma", () => {
    expect(parseCurrencyString("1234,56")).toBeCloseTo(1234.56);
  });
  it("parses simple international format", () => {
    expect(parseCurrencyString("1,234.56")).toBeCloseTo(1234.56);
  });

  it("parses european format", () => {
    expect(parseCurrencyString("1.234,56")).toBeCloseTo(1234.56);
  });

  it("parses indian format", () => {
    expect(parseCurrencyString("12,34,567.89")).toBeCloseTo(1234567.89);
  });

  it("handles negative numbers", () => {
    expect(parseCurrencyString("-1.234,56")).toBeCloseTo(-1234.56);
    expect(parseCurrencyString("(1,234.56)")).toBeCloseTo(-1234.56);
  });
  it("returns 0 on invalid strings", () => {
    expect(parseCurrencyString("")).toBeCloseTo(0);
    expect(parseCurrencyString("abc")).toBeCloseTo(0);
  });
});

describe("formatCurrency", () => {
  it("formats international style", () => {
    expect(formatCurrency(1234567.89, { decimal: true })).toBe("1.234.567,89");
  });

  it("formats indian style explicitly", () => {
    expect(
      formatCurrency(1234567.89, { decimal: true, indianFormat: true })
    ).toBe("12,34,567.89");
    expect(
      formatCurrency("12.34.567,89", { decimal: true, indianFormat: true })
    ).toBe("12,34,567.89");
  });

  it("formats with negative dash", () => {
    expect(formatCurrency(-1234.56, { decimal: true })).toBe("-1.234,56");
  });

  it("formats with negative brackets", () => {
    expect(
      formatCurrency(-1234.56, { decimal: true, negativeFormat: "brackets" })
    ).toBe("(1.234,56)");
  });

  it("supports suffixCurrency", () => {
    expect(
      formatCurrency(1234.56, { decimal: true, suffixCurrency: "Rp " })
    ).toBe("Rp 1.234,56");
  });
  it("decimal tester", () => {
    expect(
      formatCurrency("-1.121.234,561", {
        decimal: true,
        suffixCurrency: "Rp ",
        totalDecimal: 2,
        roundedDecimal: "ceil",
        negativeFormat: {
          style: "brackets",
        },
      })
    ).toBe("(Rp 1.121.234,57)");
    expect(
      formatCurrency("-1.121.234,561", {
        decimal: false,
        suffixCurrency: "Rp ",
        // totalDecimal: 2,
        roundedDecimal: "ceil",
        negativeFormat: {
          style: "brackets",
        },
      })
    ).toBe("(Rp 1.121.234)");
    expect(
      formatCurrency("1.121.234", {
        decimal: true,
        suffixCurrency: "Rp ",
        roundedDecimal: "ceil",
      })
    ).toBe("Rp 1.121.234,00");
    expect(
      formatCurrency("1,121,234", {
        decimal: true,
        suffixCurrency: "Rp ",
        roundedDecimal: "ceil",
      })
    ).toBe("Rp 1.121.234,00");
    expect(
      formatCurrency("1,121,234.00", {
        decimal: true,
        suffixCurrency: "Rp ",
        roundedDecimal: "ceil",
      })
    ).toBe("Rp 1.121.234,00");
    expect(
      formatCurrency("1.121.234,00", {
        decimal: true,
        totalDecimal: 0,
        suffixCurrency: "Rp ",
        roundedDecimal: "ceil",
      })
    ).toBe("Rp 1.121.234");
  });
  it("supports custom separators", () => {
    expect(
      formatCurrency(1234567.89, {
        decimal: true,
        separator: "'",
        separatorDecimals: ".",
      })
    ).toBe("1'234'567.89");
  });
});
