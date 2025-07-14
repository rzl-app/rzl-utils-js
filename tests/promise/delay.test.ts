import { describe, it, expect, vi } from "vitest";
import { delay } from "@/index";

describe("delay", () => {
  it("should resolve after the specified time", async () => {
    const start = Date.now();
    await delay(100); // 100ms
    const duration = Date.now() - start;
    expect(duration).toBeGreaterThanOrEqual(90);
  });

  it("should default to 1000ms if no parameter is provided", async () => {
    const start = Date.now();
    await delay();
    const duration = Date.now() - start;
    expect(duration).toBeGreaterThanOrEqual(900);
  });

  it("should throw an error if milliSeconds is not a number", () => {
    // @ts-expect-error
    expect(() => delay("2000")).toThrow(
      "Invalid parameter: `milliSeconds` must be 'number'."
    );
    // @ts-expect-error
    expect(() => delay(null)).toThrow(
      "Invalid parameter: `milliSeconds` must be 'number'."
    );
  });

  it("should integrate well with fake timers for instant resolution", async () => {
    vi.useFakeTimers();
    const promise = delay(5000);
    vi.advanceTimersByTime(5000);
    await expect(promise).resolves.toBeUndefined();
    vi.useRealTimers();
  });
});
