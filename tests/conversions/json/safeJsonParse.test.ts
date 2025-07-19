import { describe, it, expect, vi } from "vitest";
import { safeJsonParse } from "@/conversions";

describe("safeJsonParse", () => {
  it("should parse valid JSON strings", () => {
    expect(safeJsonParse('{"a":1,"b":2}')).toEqual({ a: 1, b: 2 });
    expect(safeJsonParse('["x","y","z"]')).toEqual(["x", "y", "z"]);
    expect(safeJsonParse('"string"')).toBe("string");
    expect(safeJsonParse("123")).toBe(123);
  });

  it("should return null if input is null", () => {
    expect(safeJsonParse(null)).toBeNull();
  });
  it("should return error", () => {
    expect(safeJsonParse(new Error("s"))).toBeUndefined();
  });

  it("should return undefined if input is undefined or not a string", () => {
    // @ts-expect-error force unset props as undefined value.
    expect(safeJsonParse()).toBeUndefined();
    // expect(() => safeJsonParse(undefined)).toThrow(TypeError);
    expect(safeJsonParse(undefined)).toBeUndefined();
    expect(safeJsonParse(123 as any)).toBeUndefined();
    expect(safeJsonParse({} as any)).toBeUndefined();
  });

  it("should throw TypeError if options is not an object", () => {
    expect(() => safeJsonParse("{}", 123 as any)).toThrow(TypeError);
    expect(() => safeJsonParse("{}", "wrong" as any)).toThrow(TypeError);
  });

  it("should return undefined for invalid JSON", () => {
    expect(safeJsonParse("{invalid-json}")).toBeUndefined();
    expect(safeJsonParse("[1,2,3")).toBeUndefined();
  });

  it("should call onError callback on parse failure", () => {
    const onError = vi.fn();
    safeJsonParse("{bad json}", { onError });
    expect(onError).toHaveBeenCalled();
  });

  it("should log error when loggingOnFail is true", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    safeJsonParse("{oops}", { loggingOnFail: true });
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("JSON parsing failed from `safeJsonParse`"),
      expect.any(Error)
    );
    spy.mockRestore();
  });

  it("should support combination of onError and loggingOnFail", () => {
    const onError = vi.fn();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    safeJsonParse("{broken}", { loggingOnFail: true, onError });
    expect(onError).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("safeJsonParse seconds", () => {
  it("parses valid JSON string", () => {
    expect(safeJsonParse('{"foo": "bar"}')).toEqual({ foo: "bar" });
    expect(safeJsonParse("[1, 2, 3]")).toEqual([1, 2, 3]);
  });

  it("returns null for input null", () => {
    expect(safeJsonParse(null)).toBeNull();
  });

  it("returns undefined for non-string input", () => {
    expect(safeJsonParse(123)).toBeUndefined();
    expect(safeJsonParse({})).toBeUndefined();
    expect(safeJsonParse([])).toBeUndefined();
    expect(safeJsonParse(() => {})).toBeUndefined();
    expect(safeJsonParse(Symbol)).toBeUndefined();
    expect(safeJsonParse(new Error())).toBeUndefined();
  });

  it("handles JSON parsing errors gracefully", () => {
    expect(safeJsonParse("{not-valid-json}")).toBeUndefined();
  });

  it("calls onError callback on JSON parse failure", () => {
    let called = false;
    safeJsonParse("{bad}", {
      onError: () => (called = true),
    });
    expect(called).toBe(true);
  });

  it("logs error when loggingOnFail is true", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    safeJsonParse("{bad}", { loggingOnFail: true });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("converts numeric strings when convertNumbers is enabled", () => {
    expect(safeJsonParse('{"age": "42"}', { convertNumbers: true })).toEqual({
      age: 42,
    });
  });

  it("converts boolean strings when convertBooleans is enabled", () => {
    expect(
      safeJsonParse('{"active": "true", "flag": "false"}', {
        convertBooleans: true,
      })
    ).toEqual({ active: true, flag: false });
  });

  it("converts ISO date strings to Date objects when convertDates is enabled", () => {
    type Result = { createdAt: Date };
    const result = safeJsonParse<Result, string>(
      '{"createdAt": "2023-07-12T08:00:00.000Z"}',
      {
        convertDates: true,
      }
    );

    expect(result).toBeDefined();
    expect(result?.createdAt).toBeInstanceOf(Date);
    expect(result?.createdAt.toISOString()).toBe("2023-07-12T08:00:00.000Z");
  });

  it("parses custom date formats when provided", () => {
    const result = safeJsonParse<{ birthday: Date }, string>(
      '{"birthday": "25/12/2000"}',
      {
        convertDates: true,
        customDateFormats: ["DD/MM/YYYY"],
      }
    );

    expect(result).toBeDefined();
    expect(result?.birthday).toBeInstanceOf(Date);
    expect(result?.birthday.getFullYear()).toBe(2000);
    expect(result?.birthday.getMonth()).toBe(11); // December
    expect(result?.birthday.getDate()).toBe(25);
  });

  it("removes null and undefined values when options are set", () => {
    const data = '{"name": null, "age": "30", "hobbies": [null, "reading"]}';
    const result = safeJsonParse(data, {
      removeNulls: true,
      convertNumbers: true,
    });
    expect(result).toEqual({ age: 30, hobbies: ["reading"] });
  });

  it("removes empty arrays and objects", () => {
    const data = '{"emptyArr": [], "emptyObj": {}, "full": {"a": 1}}';
    const result = safeJsonParse<{ full: { a: 1 } }, typeof data>(data, {
      removeEmptyArrays: true,
      removeEmptyObjects: true,
    });
    expect(result).toEqual({ full: { a: 1 } });
  });

  it("uses strictMode to remove non-matching strings", () => {
    const data = '{"name": " John ", "score": "100"}';
    const result = safeJsonParse(data, {
      strictMode: true,
      convertNumbers: true,
    });
    expect(result).toEqual({ score: 100 }); // name removed since it's a string not number
  });
});
