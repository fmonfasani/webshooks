// src/app/page.tsx
import React from "react";
import { ClientRedirect } from "@/components/layout/ClientRedirect";

export default function HomePage() {
  return <ClientRedirect authenticatedHref="/dashboard" unauthenticatedHref="/signin" />;
}
