import type { Session, User } from "../types";
import { logEvent, logError } from "../telemetry/logger";
import { getToken, saveToken, clearToken } from "./storage";

export interface AuthService {
  signin(email: string, password: string): Promise<Session>;
  signup(email: string, password: string): Promise<Session>;
  signout(): Promise<{ ok: boolean }>;
  getSession(): Promise<Session>;
}

let memorySession: Session = { token: null, user: null };

function safeStorage(): Storage | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  } catch {}
  return null;
}

function setSession(next: Session) {
  const store = safeStorage();
  memorySession = next;
  if (store) store.setItem("serverless_saas_session", JSON.stringify(next));
}

function readSession(): Session {
  const store = safeStorage();
  if (store) {
    const raw = store.getItem("serverless_saas_session");
    if (raw) {
      try {
        return JSON.parse(raw) as Session;
      } catch {}
    }
  }
  return memorySession;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const authMock: AuthService = {
  async signin(email, password) {
    logEvent("auth_signin_attempt", "start", "info", { email });
    await sleep(150);

    if (!email || !password || password.length < 6) {
      logError("auth_signin_attempt", "AUTH_INVALID_CREDENTIALS", { email });
      throw new Error("AUTH_INVALID_CREDENTIALS");
    }

    const user: User = { id: "u_" + Math.random().toString(36).slice(2), email };
    const session: Session = { token: "t_" + Math.random().toString(36).slice(2), user };
    setSession(session);
    logEvent("auth_signin_success", "success", "info", { email });
    return session;
  },

  async signup(email, password) {
    await sleep(200);
    if (!password || password.length < 8) {
      logError("auth_signup", "AUTH_WEAK_PASSWORD", { email });
      throw new Error("AUTH_WEAK_PASSWORD");
    }

    const user: User = { id: "u_" + Math.random().toString(36).slice(2), email };
    const session: Session = { token: "t_" + Math.random().toString(36).slice(2), user };
    setSession(session);
    logEvent("auth_signup_success", "success", "info", { email });
    return session;
  },

  async signout() {
    await sleep(50);
    setSession({ token: null, user: null });
    logEvent("auth_signout", "success");
    return { ok: true };
  },

  async getSession() {
    await sleep(10);
    return readSession();
  },
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const AUTH_BASE = `${API_BASE}/api/auth`;

async function extractToken(res: Response) {
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `AUTH_ERROR_${res.status}`);
  }
  const data = (await res.json()) as { access_token?: string; token?: string };
  const token = data.access_token ?? data.token;
  if (!token) throw new Error("AUTH_INVALID_TOKEN");
  return token;
}

async function signinWithFallback(email: string, password: string) {
  const endpoints = [`${AUTH_BASE}/login`, `${AUTH_BASE}/signin`];
  for (const endpoint of endpoints) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.status === 404) continue;
    return extractToken(res);
  }
  throw new Error("AUTH_ENDPOINT_UNAVAILABLE");
}

export const authApi: AuthService = {
  async signin(email, password) {
    const token = await signinWithFallback(email, password);
    saveToken(token);
    const session: Session = { token, user: { id: "me", email } as User };
    logEvent("auth_signin_success", "success", "info", { email });
    return session;
  },

  async signup(email, password) {
    const res = await fetch(`${AUTH_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const token = await extractToken(res);
    saveToken(token);
    const session: Session = { token, user: { id: "me", email } as User };
    logEvent("auth_signup_success", "success", "info", { email });
    return session;
  },

  async signout() {
    clearToken();
    return { ok: true };
  },

  async getSession() {
    const token = getToken();
    if (!token) return { token: null, user: null };

    try {
      const res = await fetch(`${AUTH_BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("ME_ERROR");

      const data = await res.json();
      return { token, user: { id: String(data.id ?? "me"), email: data.email } as User };
    } catch {
      return { token, user: null };
    }
  },
};
