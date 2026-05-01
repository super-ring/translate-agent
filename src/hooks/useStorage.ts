import { useState, useEffect, useCallback } from "react";
import { getItem, setItem } from "../lib/storage";

const isChromeExtension =
  typeof chrome !== "undefined" && chrome.storage?.local;

export function useStorage(key: string, defaultValue: string = "") {
  const [value, setValue] = useState(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getItem(key).then((stored) => {
      if (stored !== null) setValue(stored);
      setLoaded(true);
    });
  }, [key]);

  useEffect(() => {
    if (isChromeExtension) {
      const listener = (
        changes: { [key: string]: chrome.storage.StorageChange },
        area: string,
      ) => {
        if (area === "local" && changes[key]) {
          setValue((changes[key].newValue as string) ?? defaultValue);
        }
      };
      chrome.storage.onChanged.addListener(listener);
      return () => chrome.storage.onChanged.removeListener(listener);
    }

    const listener = (e: Event) => {
      const { key: changedKey, value: newValue } = (e as CustomEvent).detail;
      if (changedKey === key) {
        setValue(newValue ?? defaultValue);
      }
    };
    // 本地模式监听stotage修改
    window.addEventListener("storage-sync", listener);
    return () => window.removeEventListener("storage-sync", listener);
  }, [key, defaultValue]);

  const save = useCallback(
    async (newValue: string) => {
      setValue(newValue);
      await setItem(key, newValue);
    },
    [key],
  );

  return { value, setValue, save, loaded } as const;
}
