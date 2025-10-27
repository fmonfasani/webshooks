"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getToken, saveToken, clearToken } from "@/lib/storage";
import type { Session, User } from "@/types";

interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  session: Session;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const AUTH_BASE = `${API_BASE}/api/auth`;

async function handleAuthResponse(res: Response) {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Authentication failed");
  }
  return res.json() as Promise<{ access_token?: string; token?: string }>;
}

async function fetchProfile(token: string): Promise<User | null> {
  try {
    const res = await fetch(`${AUTH_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;

    const data = (await res.json()) as { id?: string | number; email: string };
    return { id: String(data.id ?? "me"), email: data.email };
  } catch (error) {
    console.error("Failed to fetch auth profile", error);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>({ token: null, user: null });
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback(async (token: string | null) => {
    if (token) {
      saveToken(token);
      const profile = await fetchProfile(token);
      setSession({ token, user: profile });
    } else {
      clearToken();
      setSession({ token: null, user: null });
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    let active = true;
    (async () => {
      await persistSession(token);
      if (active) setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [persistSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const endpoints = ["/login", "/signin"];
        let token: string | null = null;

        for (const endpoint of endpoints) {
          const res = await fetch(`${AUTH_BASE}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          if (res.ok) {
            const data = await handleAuthResponse(res);
            token = String(data.access_token ?? data.token ?? "");
            if (!token) throw new Error("Missing token in response");
            break;
          }
          if (res.status !== 404) {
            const message = await res.text();
            throw new Error(message || "Unable to sign in");
          }
        }

        if (!token) throw new Error("Authentication endpoint not found");
        await persistSession(token);
      } finally {
        setLoading(false);
      }
    },
    [persistSession]
  );

  const register = useCallback(
    async ({ email, password }: RegisterPayload) => {
      setLoading(true);
      try {
        const res = await fetch(`${AUTH_BASE}/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await handleAuthResponse(res);
        const token = String(data.access_token ?? data.token ?? "");
        if (!token) throw new Error("Missing token in response");
        await persistSession(token);
      } finally {
        setLoading(false);
      }
    },
    [persistSession]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await persistSession(null);
    } finally {
      setLoading(false);
    }
  }, [persistSession]);

  const refreshProfile = useCallback(async () => {
    if (session.token) await persistSession(session.token);
  }, [persistSession, session.token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session.user,
      token: session.token,
      isAuthenticated: Boolean(session.token),
      loading,
      session,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [login, logout, register, refreshProfile, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
