import { STORAGE_KEYS } from "./constants";

const isChromeExtension =
  typeof chrome !== "undefined" && chrome.storage?.local;

export async function getItem(key: string): Promise<string | null> {
  if (isChromeExtension) {
    const result = await chrome.storage.local.get(key);
    return (result[key] as string) ?? null;
  }
  return localStorage.getItem(key);
}

export async function setItem(key: string, value: string): Promise<void> {
  if (isChromeExtension) {
    await chrome.storage.local.set({ [key]: value });
  } else {
    localStorage.setItem(key, value);
    window.dispatchEvent(new CustomEvent("storage-sync", { detail: { key, value } }));
  }
}

export async function loadAllSettings() {
  const [apiUrl, apiKey, model, skill] = await Promise.all([
    getItem(STORAGE_KEYS.API_URL),
    getItem(STORAGE_KEYS.API_KEY),
    getItem(STORAGE_KEYS.MODEL),
    getItem(STORAGE_KEYS.SKILL),
  ]);
  return { apiUrl, apiKey, model, skill };
}
