import { ChatMessage } from '../types';
import { logEvent } from '../telemetry/logger';
import { getToken } from './storage';

export interface ChatService {
  send(messages: ChatMessage[]): Promise<ChatMessage>;
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

export const chatMock: ChatService = {
  async send(messages: ChatMessage[]) {
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    await sleep(180);
    const content = lastUser?.content?.trim();
    let suggestion = 'Could you share more about your app idea?';
    if (content) {
      if (/auth|login|signup/i.test(content)) suggestion = 'Add email/password auth with a reusable form.';
      else if (/dashboard|analytics|metrics/i.test(content)) suggestion = 'Create a dashboard with recent activity and KPIs.';
      else if (/chat|assistant|ai/i.test(content)) suggestion = 'Include a chat builder that refines requirements.';
      else suggestion = `Start by naming your project and defining the main user journey for: "${content.slice(0, 80)}".`;
    }
    const reply: ChatMessage = {
      id: 'm_' + Math.random().toString(36).slice(2),
      role: 'system',
      content: suggestion,
      timestamp: new Date().toISOString(),
    };
    logEvent('chat_suggestion_generated', 'success', 'info', { length: reply.content.length });
    return reply;
  },
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const CHAT_BASE = `${API_BASE}/api/chat`;

export const chatApi: ChatService = {
  async send(messages: ChatMessage[]) {
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    const token = getToken();
    const res = await fetch(`${CHAT_BASE}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ message: lastUser?.content || '' })
    });
    if (!res.ok) { const t = await res.text(); throw new Error(t || 'CHAT_ERROR'); }
    const data = await res.json();
    const reply: ChatMessage = {
      id: 'm_' + Math.random().toString(36).slice(2),
      role: 'system',
      content: data.reply as string,
      timestamp: new Date().toISOString(),
    };
    logEvent('chat_suggestion_generated', 'success', 'info', { length: reply.content.length });
    return reply;
  }
};
