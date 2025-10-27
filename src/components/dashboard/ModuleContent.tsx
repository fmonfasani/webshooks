// src/components/dashboard/ModuleContent.tsx
"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import type { ModuleId, ProjectWithModules, SubmoduleId } from "@/types";
import { ModuleGrid } from "./ModuleGrid";

type Props = {
  moduleId: ModuleId;
  submoduleId: SubmoduleId;
  projectData?: ProjectWithModules | null;
};

export function ModuleContent({ moduleId, submoduleId, projectData }: Props) {
  const { resolvedTheme } = useTheme();
  const { isDark } = useTheme();

  if (moduleId === "build" && submoduleId === "modules") {
    return <ModuleGrid projectData={projectData ?? undefined} />;
  }

  return (
    <div className="flex-1 p-6 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <div
            className={`mb-2 text-sm font-medium ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {moduleId.charAt(0).toUpperCase() + moduleId.slice(1)}
          </div>
          <h1
            className={`mb-3 text-3xl font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {submoduleId
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </h1>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Configure your {submoduleId.replace("-", " ")} settings
          </p>
        </div>

        <div
          className={`rounded-xl border p-16 text-center ${
            isDark
              ? "border-slate-700 bg-slate-800/30"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
              isDark ? "bg-slate-700" : "bg-gray-200"
            }`}
          >
            <span
              className={`text-2xl ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              🚧
            </span>
          </div>
          <h3
            className={`mb-2 text-xl font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Coming Soon
          </h3>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            This section is under construction
          </p>
        </div>
      </div>
    </div>
  );
}
    