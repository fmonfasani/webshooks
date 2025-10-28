"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="rounded-md border border-neutral-200/60 dark:border-neutral-700/60 px-2 py-1 text-xs transition duration-300 ease-in-out hover:scale-[1.02] hover:opacity-90 focus-visible:ring-2 ring-blue-500 ring-offset-2"
    >
      <span className="inline-flex items-center gap-1">
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
