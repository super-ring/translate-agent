import { useState, useEffect, useCallback } from "react";
import { getItem, setItem } from "../lib/storage";

export function useStorage(key: string, defaultValue: string = "") {
  const [value, setValue] = useState(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getItem(key).then((stored) => {
      if (stored !== null) setValue(stored);
      setLoaded(true);
    });
  }, [key]);

  const save = useCallback(
    async (newValue: string) => {
      setValue(newValue);
      await setItem(key, newValue);
    },
    [key],
  );

  return { value, setValue, save, loaded } as const;
}
