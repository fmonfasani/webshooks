"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from '../lib/toast';
import { ThemeToggleButton } from './ThemeToggleButton';
import Link from 'next/link';

export function Navbar() {
  const router = useRouter();
  const { session, signout } = useAuthStore();
  return (
    <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="w-full border-b border-neutral-200/60 dark:border-neutral-800/60 bg-white/30 dark:bg-neutral-800/30 backdrop-blur-lg shadow-sm">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link className="font-semibold focus-visible:ring-2 ring-blue-500 ring-offset-2 rounded px-1" href="/">Serverless SaaS</Link>
        <nav className="flex items-center gap-3">
          <Link prefetch={true} className="text-sm text-gray-700 dark:text-neutral-100 hover:opacity-90 hover:scale-[1.02] transition duration-300 ease-in-out focus-visible:ring-2 ring-blue-500 ring-offset-2 rounded px-1 motion-reduce:transform-none motion-reduce:transition-none" href="/dashboard" aria-label="Dashboard">Dashboard</Link>
          <Link prefetch={true} className="text-sm text-gray-700 dark:text-neutral-100 hover:opacity-90 hover:scale-[1.02] transition duration-300 ease-in-out focus-visible:ring-2 ring-blue-500 ring-offset-2 rounded px-1 motion-reduce:transform-none motion-reduce:transition-none" href="/builder" aria-label="Builder">Builder</Link>
          {session.user ? (
            <Button
              variant="secondary"
              size="sm"
              className="transition duration-300 ease-in-out hover:scale-[1.02]"
              onClick={async () => { await signout(); toast.info('Signed out'); router.push('/signin'); }}
            >
              Sign out
            </Button>
          ) : (
            <Link prefetch={false} className="text-sm text-gray-700 dark:text-neutral-100 hover:opacity-90 hover:scale-[1.02] transition duration-300 ease-in-out focus-visible:ring-2 ring-blue-500 ring-offset-2 rounded px-1 motion-reduce:transform-none motion-reduce:transition-none" href="/signin" aria-label="Sign in">Sign in</Link>
          )}
          <ThemeToggleButton />
        </nav>
      </div>
    </motion.header>
  );
}
