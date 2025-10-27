import React from 'react';
export const dynamic = 'force-static';
export const fetchCache = 'default-cache';

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Serverless SaaS Builder</h1>
      <p className="text-sm text-gray-600">Start by signing in, then open the dashboard or try the chat builder to describe your app idea.</p>
      <ul className="list-disc pl-5 text-sm">
        <li><a className="underline" href="/signin">Sign in</a></li>
        <li><a className="underline" href="/signup">Sign up</a></li>
        <li><a className="underline" href="/dashboard">Dashboard</a></li>
        <li><a className="underline" href="/builder">Chat Builder</a></li>
      </ul>
    </div>
  );
}
