"use client";

import React from "react";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <DashboardSidebar activeModule="planning" activeSubmodule="idea-board" />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
