// src/app/signin/page.tsx
"use client";

import AuthScreen from "../../components/auth/AuthScreen";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AuthScreen initialMode="signin" />
    </div>
  );
}



