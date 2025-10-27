import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ChatPanel } from '../../src/components/ChatPanel';
import type { ChatMessage } from '../../src/types';

const msgs: ChatMessage[] = [
  { id: '1', role: 'user', content: 'Hello', timestamp: new Date().toISOString() },
  { id: '2', role: 'system', content: 'Hi!', timestamp: new Date().toISOString() },
];

const html = ReactDOMServer.renderToString(<ChatPanel messages={msgs} state="success" />);
console.log('ChatPanel OK', html.length > 0);

