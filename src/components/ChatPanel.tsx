import React from 'react';
import { MessageBubble } from './ui/message-bubble';
import type { ChatMessage } from '../types';

export function ChatPanel({ messages, state }: { messages: ChatMessage[]; state: 'empty'|'loading'|'success'|'error' }) {
  if (state === 'empty') {
    return <div className="h-64 flex items-center justify-center text-sm text-gray-500">Start the conversation by describing your app idea.</div>;
  }
  return (
    <div className="h-64 overflow-y-auto space-y-2 p-2 border border-gray-200 rounded-md bg-gray-50">
      {messages.map((m) => (
        <MessageBubble key={m.id} role={m.role} content={m.content} timestamp={m.timestamp} />
      ))}
      {state === 'loading' && (
        <div className="text-xs text-gray-500">Thinking...</div>
      )}
    </div>
  );
}
