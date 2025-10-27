// src/components/layout/ClientRedirect.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type ClientRedirectProps = {
  authenticatedHref: string;
  unauthenticatedHref: string;
  fallback?: React.ReactNode;
};

export function ClientRedirect({
  authenticatedHref,
  unauthenticatedHref,
  fallback,
}: ClientRedirectProps) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    router.replace(isAuthenticated ? authenticatedHref : unauthenticatedHref);
  }, [authenticatedHref, isAuthenticated, loading, router, unauthenticatedHref]);

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-sm text-gray-500 dark:bg-slate-950 dark:text-gray-400">
      Redirecting...
    </div>
  );
}
