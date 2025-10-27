// src/app/layout.tsx
import type { Metadata } from "next";
import React from "react";
import "./globals.css";

import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/lib/toast";

export const metadata: Metadata = {
  title: "Webshooks SaaS Builder",
  description: "Serverless SaaS creation flow powered by Webshooks",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased dark:bg-slate-950 dark:text-gray-100">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
