"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '../../components/AuthForm';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from '../../lib/toast';

export default function SignUpPage() {
  const router = useRouter();
  const { signup, loading } = useAuthStore();
  async function onSubmit(email: string, password: string) {
    await signup(email, password);
    toast.success('Account created');
    router.push('/dashboard');
  }
  return <AuthForm mode="signup" onSubmit={onSubmit} loading={loading} />;
}
