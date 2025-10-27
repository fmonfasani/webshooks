import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Sidebar } from '../../src/components/dashboard/Sidebar';

const html = ReactDOMServer.renderToString(<Sidebar />);
console.log('Sidebar OK', html.length > 0);

