import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { MessageBubble } from '../../src/components/MessageBubble';

const html = ReactDOMServer.renderToString(
  <div>
    <MessageBubble role="user" content="Test" timestamp={new Date().toISOString()} />
    <MessageBubble role="system" content="Reply" timestamp={new Date().toISOString()} />
  </div>
);
console.log('MessageBubble OK', html.length > 0);

