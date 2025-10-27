import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Navbar } from '../../src/components/Navbar';

const html = ReactDOMServer.renderToString(<Navbar />);
console.log('Navbar OK', html.length > 0);

