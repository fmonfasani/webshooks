import { useSyncExternalStore, useRef } from 'react';
import type { Session } from '../types';
import type { AuthService } from '../lib/auth';
import { authApi } from '../lib/auth';
import { logEvent } from '../telemetry/logger';

type State = { session: Session; loading: boolean };
type Actions = {
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
  hydrate: () => Promise<void>;
  setAdapter: (svc: AuthService) => void;
};
type Store = State & Actions;

const listeners = new Set<() => void>();
let svc: AuthService = authApi;
let state: State = { session: { token: null, user: null }, loading: false };

function set(partial: Partial<State>) { state = { ...state, ...partial }; listeners.forEach(l => l()); }

async function hydrate() { set({ loading: true }); try { set({ session: await svc.getSession() }); } finally { set({ loading: false }); } }

const actions: Actions = {
  async signin(email, password) { set({ loading: true }); try { set({ session: await svc.signin(email, password) }); } finally { set({ loading: false }); } },
  async signup(email, password) { set({ loading: true }); try { set({ session: await svc.signup(email, password) }); } finally { set({ loading: false }); } },
  async signout() { await svc.signout(); set({ session: { token: null, user: null } }); logEvent('auth_signout', 'success'); },
  hydrate,
  setAdapter(next: AuthService) { svc = next; },
};

export function useAuthStore(): Store {
  const initialized = useRef(false);
  if (!initialized.current) { initialized.current = true; void actions.hydrate(); }
  useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb); }, () => state, () => state);
  return { ...actions, ...state } as Store;
}
