import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ChatInput } from '../../src/components/chat/ChatInput';

const html = ReactDOMServer.renderToString(<ChatInput onSend={() => {}} />);
console.log('ChatInput OK', html.length > 0);

