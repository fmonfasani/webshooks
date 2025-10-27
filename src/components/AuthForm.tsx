import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';

export function AuthForm({ mode, onSubmit, loading }: { mode: 'signin' | 'signup'; onSubmit: (email: string, password: string) => Promise<void>; loading?: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try { await onSubmit(email, password); } catch (err: any) { setError(err?.message || 'Unknown error'); }
  }

  const title = mode === 'signin' ? 'Sign in' : 'Sign up';
  const cta = mode === 'signin' ? 'Sign in' : 'Create account';
  const switcher = mode === 'signin' ? (
    <div className="text-xs text-gray-500 mt-3">No account? <a className="underline" href="/signup">Sign up</a></div>
  ) : (
    <div className="text-xs text-gray-500 mt-3">Already have an account? <a className="underline" href="/signin">Sign in</a></div>
  );

  return (
    <div className="max-w-sm mx-auto">
      <Card>
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <label className="block text-sm">
              <span className="mb-1 block">Email</span>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block">Password</span>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === 'signup' ? 'At least 8 characters' : '********'} required />
            </label>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (<><Spinner className="mr-2" /> {mode === 'signin' ? 'Signing in...' : 'Creating account...'}</>) : cta}
            </Button>
          </form>
          {switcher}
        </CardContent>
      </Card>
    </div>
  );
}
