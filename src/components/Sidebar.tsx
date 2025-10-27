"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, MessageSquare, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';

export function Sidebar() {
  return (
    <motion.aside initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="hidden md:block w-60 shrink-0 border-r border-neutral-200/60 dark:border-neutral-800/60 p-4 bg-white/30 dark:bg-neutral-800/30 backdrop-blur-lg shadow-lg">
      <div className="text-xs uppercase text-gray-500 mb-2">Navigation</div>
      <ul className="space-y-1 text-sm">
        <li>
          <Link prefetch={true} className="text-gray-700 dark:text-neutral-100 inline-flex items-center gap-2 hover:opacity-90 hover:scale-[1.02] transition duration-300 ease-in-out focus-visible:ring-2 ring-blue-500 ring-offset-2 rounded px-1 motion-reduce:transform-none motion-reduce:transition-none" href="/dashboard" aria-label="Dashboard">
            <LayoutDashboard className="h-4 w-4 cursor-pointer" /> Dashboard
          </Link>
        </li>
        <li>
          <Link prefetch={true} className="text-gray-700 dark:text-neutral-100 inline-flex items-center gap-2 hover:opacity-90 hover:scale-[1.02] transition duration-300 ease-in-out focus-visible:ring-2 ring-blue-500 ring-offset-2 rounded px-1 motion-reduce:transform-none motion-reduce:transition-none" href="/builder" aria-label="Builder">
            <MessageSquare className="h-4 w-4 cursor-pointer" /> Builder
          </Link>
        </li>
        <li>
          <Link prefetch={false} className="text-gray-700 dark:text-neutral-100 inline-flex items-center gap-2 hover:opacity-90 hover:scale-[1.02] transition duration-300 ease-in-out focus-visible:ring-2 ring-blue-500 ring-offset-2 rounded px-1 motion-reduce:transform-none motion-reduce:transition-none" href="/signin" aria-label="Sign In">
            <LogIn className="h-4 w-4 cursor-pointer" /> Sign In
          </Link>
        </li>
        <li>
          <Link prefetch={false} className="text-gray-700 dark:text-neutral-100 inline-flex items-center gap-2 hover:opacity-90 hover:scale-[1.02] transition duration-300 ease-in-out focus-visible:ring-2 ring-blue-500 ring-offset-2 rounded px-1 motion-reduce:transform-none motion-reduce:transition-none" href="/signup" aria-label="Sign Up">
            <UserPlus className="h-4 w-4 cursor-pointer" /> Sign Up
          </Link>
        </li>
      </ul>
    </motion.aside>
  );
}
