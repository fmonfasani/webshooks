"use client";
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggleButton() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = (resolvedTheme || theme) === 'dark';
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="rounded-md border border-neutral-200/60 dark:border-neutral-700/60 px-2 py-1 text-xs hover:opacity-90 hover:scale-[1.02] transition duration-300 ease-in-out focus-visible:ring-2 ring-blue-500 ring-offset-2"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {mounted ? (
        <span className="inline-flex items-center gap-1">
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} {isDark ? 'Dark' : 'Light'}
        </span>
      ) : (
        'Theme'
      )}
    </button>
  );
}

