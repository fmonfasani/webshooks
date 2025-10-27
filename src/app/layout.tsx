import React, { Suspense } from "react";
import "./globals.css";
import dynamic from 'next/dynamic';
const Navbar = dynamic(() => import("../components/Navbar").then(m => m.Navbar), {
  ssr: false,
  loading: () => (
    <div className="h-14 w-full motion-safe:animate-pulse bg-gray-200/10 dark:bg-gray-700/20" />
  ),
});
const Sidebar = dynamic(() => import("../components/Sidebar").then(m => m.Sidebar), {
  ssr: false,
  loading: () => (
    <div className="hidden md:block w-12 motion-safe:animate-pulse bg-gray-200/10 dark:bg-gray-700/20" />
  ),
});
import { Toaster } from "../lib/toast";
import { ThemeProvider } from "../components/ThemeProvider";
import { RouteTransition } from "../components/RouteTransition";

export const metadata = {
  title: "Webshooks  SaaS Builder",
  description: "Serverless SaaS creation flow powered by Codex",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen smooth-transition">
        <ThemeProvider>
          <Suspense fallback={<div className="hidden md:block w-12 motion-safe:animate-pulse bg-gray-200/10 dark:bg-gray-700/20" />}>
            <Sidebar />
          </Suspense>
          <div className="flex-1 flex flex-col">
            <Suspense fallback={<div className="h-14 w-full motion-safe:animate-pulse bg-gray-200/10 dark:bg-gray-700/20" />}>
              <Navbar />
            </Suspense>
            <RouteTransition>
              {children}
            </RouteTransition>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
