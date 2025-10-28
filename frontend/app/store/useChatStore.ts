import { useSyncExternalStore } from 'react';
import type { ChatMessage } from '../src/types';
import type { ChatService } from '../lib/chat';
import { chatApi } from '../lib/chat';
import { logEvent, logError } from '../src/telemetry/logger';

type State = { messages: ChatMessage[]; sending: boolean };
type Actions = { send: (content: string) => Promise<void>; reset: () => void; setAdapter: (svc: ChatService) => void };
type Store = State & Actions;

const listeners = new Set<() => void>();
let svc: ChatService = chatApi;
let state: State = { messages: [], sending: false };

function set(partial: Partial<State>) { state = { ...state, ...partial }; listeners.forEach(l => l()); }

const actions: Actions = {
  async send(content: string) {
    const trimmed = content.trim();
    if (!trimmed) { logError('chat_message_sent', 'CHAT_EMPTY_MESSAGE'); return; }
    set({ sending: true, messages: [...state.messages, { id: 'm_'+Math.random().toString(36).slice(2), role: 'user', content: trimmed, timestamp: new Date().toISOString() }] });
    logEvent('chat_message_sent', 'success');
    try {
      const reply = await svc.send(state.messages);
      set({ messages: [...state.messages, reply] });
    } finally { set({ sending: false }); }
  },
  reset() { set({ messages: [] }); },
  setAdapter(next: ChatService) { svc = next; },
};

export function useChatStore(): Store {
  useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb); }, () => state, () => state);
  return { ...actions, ...state } as Store;
}
