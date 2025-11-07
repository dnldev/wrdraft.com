"use client";

import { useEffect, useState } from "react";

/**
 * A custom hook that debounces a value.
 * It will only update the returned value after a specified delay has passed
 * without the input value changing.
 *
 * @template T - The type of the value to debounce.
 * @param {T} value - The value to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {T} The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to cancel the timeout if the value changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
