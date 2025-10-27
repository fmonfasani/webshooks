import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { AuthForm } from '../../src/components/AuthForm';

const html = ReactDOMServer.renderToString(
  <AuthForm mode="signin" loading={false} onSubmit={async () => {}} />
);
console.log('AuthForm OK', html.length > 0);

