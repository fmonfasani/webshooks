// src/components/auth/AuthForm.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type AuthFormProps = {
  mode: "signin" | "signup";
  onSubmit: (email: string, password: string) => Promise<void>;
  loading?: boolean;
};

export function AuthForm({ mode, onSubmit, loading }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    try {
      await onSubmit(email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    }
  }

  const title = mode === "signin" ? "Sign in" : "Sign up";
  const cta = mode === "signin" ? "Sign in" : "Create account";
  const switcher =
    mode === "signin" ? (
      <div className="mt-3 text-xs text-gray-500">
        No account? <a className="underline" href="/signup">Sign up</a>
      </div>
    ) : (
      <div className="mt-3 text-xs text-gray-500">
        Already have an account? <a className="underline" href="/signin">Sign in</a>
      </div>
    );

  return (
    <div className="mx-auto max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <label className="block text-sm">
              <span className="mb-1 block">Email</span>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block">Password</span>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "At least 8 characters" : "********"}
                required
              />
            </label>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Spinner className="mr-2" />{" "}
                  {mode === "signin" ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                cta
              )}
            </Button>
          </form>
          {switcher}
        </CardContent>
      </Card>
    </div>
  );
}
