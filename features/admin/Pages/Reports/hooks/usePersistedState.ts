import { useEffect, useState } from "react";

/**
 * Like useState, but reads/writes to localStorage so the choice
 * survives a page refresh. SSR-safe: initial render uses defaultValue,
 * stored value is loaded after mount.
 */
export function usePersistedState<T>(
  key: string,
  defaultValue: T,
): [T, (next: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) setValue(JSON.parse(stored) as T);
    } catch {
      // ignore parse / storage errors
    }
  }, [key]);

  const set = (next: T) => {
    setValue(next);
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // ignore storage errors (quota, disabled, etc.)
    }
  };

  return [value, set];
}
