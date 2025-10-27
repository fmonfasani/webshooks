"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '../../components/AuthForm';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from '../../lib/toast';
export const dynamic = 'force-static';
export const fetchCache = 'default-cache';

export default function SignInPage() {
  const router = useRouter();
  const { signin, loading } = useAuthStore();
  async function onSubmit(email: string, password: string) {
    await signin(email, password);
    toast.success('Signed in');
    router.push('/dashboard');
  }
  return <AuthForm mode="signin" onSubmit={onSubmit} loading={loading} />;
}
