import { safeStableStringify } from "@/index";
import { describe, it, expect } from "vitest";

describe("safeStableStringify (advanced)", () => {
  it("should stringify primitives correctly", () => {
    expect(safeStableStringify(42)).toBe("42");
    expect(safeStableStringify(true)).toBe("true");
    expect(safeStableStringify(null)).toBe("null");
    expect(safeStableStringify(undefined)).toBe("null");
    expect(safeStableStringify(NaN)).toBe("null");
    expect(safeStableStringify(Infinity)).toBe("null");
  });

  it("should stringify arrays with nested objects", () => {
    const arr = [1, { b: 2, a: 1 }];
    expect(safeStableStringify(arr, true, false, true)).toBe(`[
  1,
  {
    "a": 1,
    "b": 2
  }
]`);
  });

  it("should sort nested object keys recursively", () => {
    const nested = { z: 1, a: { d: 4, c: 3 } };
    expect(safeStableStringify(nested, true, false, true)).toBe(`{
  "a": {
    "c": 3,
    "d": 4
  },
  "z": 1
}`);
  });

  it("should handle Date, BigInt, Map, Set nested inside objects & arrays", () => {
    const complex = {
      time: new Date("2025-01-01"),
      big: BigInt(123),
      list: [new Set([1, 2]), new Map([["x", 9]])],
    };
    expect(safeStableStringify(complex, true, false, true)).toBe(`{
  "big": "123",
  "list": [
    {
      "set": [
        1,
        2
      ]
    },
    {
      "map": [
        [
          "x",
          9
        ]
      ]
    }
  ],
  "time": "2025-01-01T00:00:00.000Z"
}`);
  });

  it("should handle functions and symbols inside nested objects/arrays", () => {
    const obj = {
      fn: () => {},
      sym: Symbol("wow"),
      arr: [1, () => {}, Symbol("arr")],
    };
    expect(safeStableStringify(obj, true, false, true)).toBe(`{
  "arr": [
    1,
    null,
    null
  ]
}`);
  });

  it("should handle circular references with multiple branches", () => {
    const obj: any = { a: 1 };
    obj.self = obj;
    obj.child = { parent: obj };
    expect(safeStableStringify(obj, true, false, true)).toBe(`{
  "a": 1,
  "child": {
    "parent": "[Circular]"
  },
  "self": "[Circular]"
}`);
  });

  it("should serialize non-plain objects (custom classes)", () => {
    class Person {
      constructor(public name: string) {}
    }
    const p = new Person("Alice");
    expect(safeStableStringify(p, true, false, true)).toBe(`{
  "name": "Alice"
}`);
  });

  it("should serialize Map and Set deeply nested", () => {
    const obj = {
      outerMap: new Map([["k", new Set([1, 2])]]),
    };
    expect(safeStableStringify(obj, true, false, true)).toBe(`{
  "outerMap": {
    "map": [
      [
        "k",
        {
          "set": [
            1,
            2
          ]
        }
      ]
    ]
  }
}`);
  });

  it("should sort array values if ignoreOrder = true even nested", () => {
    const arr = [3, 1, [9, 2]];
    expect(safeStableStringify(arr, true, true, true)).toBe(`[
  1,
  3,
  [
    2,
    9
  ]
]`);
  });

  it("should throw on invalid sortKeys or ignoreOrder types", () => {
    // @ts-expect-error intentionally wrong
    expect(() => safeStableStringify({}, "nope")).toThrow();
    // @ts-expect-error intentionally wrong
    expect(() => safeStableStringify({}, true, "nah")).toThrow();
  });
});

describe("safeStableStringify with sortKeys & ignoreOrder variations", () => {
  it("should respect sortKeys=false for flat objects", () => {
    const obj = { b: 2, a: 1 };
    expect(safeStableStringify(obj, false, false, true)).toBe(`{
  "b": 2,
  "a": 1
}`);
  });

  it("should respect sortKeys=false for nested objects", () => {
    const obj = { z: 1, x: { d: 4, c: 3 }, a: { b: 2, a: 1 } };
    expect(safeStableStringify(obj, false, false, true)).toBe(`{
  "z": 1,
  "x": {
    "d": 4,
    "c": 3
  },
  "a": {
    "b": 2,
    "a": 1
  }
}`);
  });

  it("should still sort nested objects when sortKeys=true", () => {
    const obj = { z: 1, x: { d: 4, c: 3 }, a: { b: 2, a: 1 } };
    expect(safeStableStringify(obj, true, false, true)).toBe(`{
  "a": {
    "a": 1,
    "b": 2
  },
  "x": {
    "c": 3,
    "d": 4
  },
  "z": 1
}`);
  });

  it("should sort arrays when ignoreOrder=true", () => {
    expect(safeStableStringify([4, 1, 3, 2], true, true, true)).toBe(`[
  1,
  2,
  3,
  4
]`);
  });

  it("should sort nested arrays if ignoreOrder=true", () => {
    const arr = [9, 7, [4, 2, 3], { z: [5, 1, 6] }];
    expect(safeStableStringify(arr, true, true, true)).toBe(`[
  7,
  9,
  [
    2,
    3,
    4
  ],
  {
    "z": [
      1,
      5,
      6
    ]
  }
]`);
  });

  it("should not sort array if ignoreOrder=false", () => {
    expect(safeStableStringify([3, 1, 2], true, false, true)).toBe(`[
  3,
  1,
  2
]`);
  });

  it("should allow sortKeys=false and ignoreOrder=true together", () => {
    const obj = { z: [3, 1, 2], x: { d: 4, c: 3 }, a: { b: 2, a: 1 } };
    expect(safeStableStringify(obj, false, true, true)).toBe(`{
  "z": [
    1,
    2,
    3
  ],
  "x": {
    "d": 4,
    "c": 3
  },
  "a": {
    "b": 2,
    "a": 1
  }
}`);
  });

  it("should handle sortKeys=true and ignoreOrder=false", () => {
    const obj = { z: [3, 1, 2], x: { d: 4, c: 3 }, a: { b: 2, a: 1 } };
    expect(safeStableStringify(obj, true, false, true)).toBe(`{
  "a": {
    "a": 1,
    "b": 2
  },
  "x": {
    "c": 3,
    "d": 4
  },
  "z": [
    3,
    1,
    2
  ]
}`);
  });

  it("should handle sortKeys=false and ignoreOrder=false", () => {
    const obj = { z: [3, 1, 2], x: { d: 4, c: 3 }, a: { b: 2, a: 1 } };
    expect(safeStableStringify(obj, false, false, true)).toBe(`{
  "z": [
    3,
    1,
    2
  ],
  "x": {
    "d": 4,
    "c": 3
  },
  "a": {
    "b": 2,
    "a": 1
  }
}`);
  });

  it("should handle sortKeys=true and ignoreOrder=true", () => {
    const obj = { z: [3, 1, 2], x: { d: 4, c: 3 }, a: { b: 2, a: 1 } };
    expect(safeStableStringify(obj, true, true, true)).toBe(`{
  "a": {
    "a": 1,
    "b": 2
  },
  "x": {
    "c": 3,
    "d": 4
  },
  "z": [
    1,
    2,
    3
  ]
}`);
  });

  it("should be stable with repeated calls", () => {
    const input = { b: [3, 2, 1], a: { y: 2, x: 1 } };
    const first = safeStableStringify(input, true, true, true);
    const second = safeStableStringify(input, true, true, true);
    expect(first).toBe(second);
  });
});

describe("safeStableStringify (compact JSON / no newline)", () => {
  it("should serialize objects without \\n by default", () => {
    const obj = { b: 2, a: { d: 4, c: 3 } };
    expect(safeStableStringify(obj)).toBe('{"a":{"c":3,"d":4},"b":2}');
  });

  it("should serialize arrays without \\n by default", () => {
    expect(safeStableStringify([3, 1, 2], true, true)).toBe("[1,2,3]");
  });

  it("should handle nested structures without pretty", () => {
    const complex = {
      z: [3, 1, 2],
      x: { d: 4, c: 3 },
      a: { b: 2, a: 1 },
    };
    expect(safeStableStringify(complex, true, true)).toBe(
      '{"a":{"a":1,"b":2},"x":{"c":3,"d":4},"z":[1,2,3]}'
    );
  });

  it("should still allow pretty=true to get indented", () => {
    const arr = [3, 1, 2];
    expect(safeStableStringify(arr, true, true, true)).toBe(`[
  1,
  2,
  3
]`);
  });
});
