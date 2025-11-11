/**
 * @jest-environment jsdom
 */
import { describe, expect, it, jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  jest.useFakeTimers();

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("should not update the value if the delay has not passed", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: "first" },
      }
    );

    rerender({ value: "second" });
    act(() => {
      jest.advanceTimersByTime(499);
    });

    expect(result.current).toBe("first");
  });

  it("should update the value after the delay has passed", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: "first" },
      }
    );

    rerender({ value: "second" });
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe("second");
  });

  it("should only use the latest value after multiple rapid changes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: "first" },
      }
    );

    rerender({ value: "second" });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    rerender({ value: "third" });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    rerender({ value: "final" });
    act(() => {
      jest.advanceTimersByTime(499);
    });

    expect(result.current).toBe("first"); // Still the initial value

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(result.current).toBe("final"); // Now updated to the last value
  });
});
