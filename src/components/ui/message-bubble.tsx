import React from 'react';
import type { ChatMessage } from '../../types';

export type MessageBubbleProps = Pick<ChatMessage, 'role' | 'content' | 'timestamp'>;

export function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
  const isUser = role === 'user';
  return (
    <div className={[ 'flex w-full', isUser ? 'justify-end' : 'justify-start' ].join(' ')}>
      <div className={[ 'max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap', isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900' ].join(' ')}>
        <div>{content}</div>
        {timestamp && (
          <div className={['mt-1 text-[10px] opacity-70', isUser ? 'text-white' : 'text-gray-700'].join(' ')}>
            {new Date(timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}

