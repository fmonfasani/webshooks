// src/components/layout/ThemeProvider.tsx
"use client";

import React from "react";
import { ThemeProvider as InternalThemeProvider } from "@/contexts/ThemeContext";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <InternalThemeProvider>{children}</InternalThemeProvider>;
}
