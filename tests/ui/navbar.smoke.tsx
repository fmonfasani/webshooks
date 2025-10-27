import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Navbar } from '../../src/components/layout/Navbar';

const html = ReactDOMServer.renderToString(<Navbar />);
console.log('Navbar OK', html.length > 0);

