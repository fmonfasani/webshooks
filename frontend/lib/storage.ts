export function getItem(key: string): string | null {
  try {
    if (typeof window !== "undefined") return window.localStorage.getItem(key);
  } catch {}
  return null;
}

export function setItem(key: string, value: string) {
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(key, value);
  } catch {}
}

export function removeItem(key: string) {
  try {
    if (typeof window !== "undefined") window.localStorage.removeItem(key);
  } catch {}
}

// JWT helpers for frontend adapters
const TOKEN_KEY = "wh_token";

export function saveToken(token: string) {
  setItem(TOKEN_KEY, token);
}

export const setToken = saveToken;

export function getToken(): string | null {
  return getItem(TOKEN_KEY);
}

export function clearToken() {
  removeItem(TOKEN_KEY);
}
