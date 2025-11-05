// in /hooks/useQueryState.ts
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useQueryState<T extends string>(
  key: string,
  defaultValue: T
): [T, (newValue: T) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = (searchParams.get(key) as T) || defaultValue;

  const setValue = useCallback(
    (newValue: T) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, newValue);
      router.push(pathname + "?" + params.toString(), { scroll: false });
    },
    [key, pathname, router, searchParams]
  );

  return [value, setValue];
}
