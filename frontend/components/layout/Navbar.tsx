"use client";

import React from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header
      className={`border-b transition-colors ${
        isDark ? "border-slate-800 bg-slate-950/60" : "border-gray-200 bg-white"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className={`text-lg font-semibold tracking-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            serverless<span className="text-blue-500">.io</span>
          </Link>

          <nav className="hidden items-center gap-4 text-sm font-medium text-gray-500 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-blue-500 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={isDark ? "text-gray-300 hover:bg-slate-900" : "text-gray-600"}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button type="button" size="sm">
            Upgrade
          </Button>
        </div>
      </div>
    </header>
  );
}
