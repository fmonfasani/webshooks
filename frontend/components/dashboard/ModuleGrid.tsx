// src\components\dashboard\ModuleGrid.tsx

"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Code, Database, Layout, Lock } from "lucide-react";

import type { ProjectWithModules } from "@/types";

type BuildModule = {
  id: string;
  name: string;
  icon: typeof Lock;
  color: string;
  options: string[];
};

const buildModules: BuildModule[] = [
  {
    id: "auth",
    name: "Authentication",
    icon: Lock,
    color: "from-blue-500 to-indigo-600",
    options: ["Email/Password", "OAuth", "Magic Link"],
  },
  {
    id: "database",
    name: "Database",
    icon: Database,
    color: "from-green-500 to-emerald-600",
    options: ["PostgreSQL", "MongoDB", "Supabase"],
  },
  {
    id: "ui",
    name: "UI Kit",
    icon: Layout,
    color: "from-purple-500 to-pink-600",
    options: ["Dashboard", "Forms", "Tables"],
  },
  {
    id: "api",
    name: "API Generator",
    icon: Code,
    color: "from-orange-500 to-red-600",
    options: ["REST", "GraphQL", "WebSockets"],
  },
];

type Props = {
  projectData?: ProjectWithModules;
};

export function ModuleGrid({ projectData }: Props) {
  const { isDark } = useTheme();

  const activeModules = projectData?.activeModules ?? [];

  return (
    <div className="flex-1 p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div
            className={`mb-2 text-sm font-medium ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Build
          </div>
          <h1
            className={`mb-3 text-3xl font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Modules
          </h1>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Configure your app modules: Auth, DB, API, UI
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {buildModules.map((module) => {
            const Icon = module.icon;
            const isActive = activeModules.includes(module.id);

            return (
              <div
                key={module.id}
                className={`cursor-pointer rounded-xl border p-6 transition ${
                  isDark
                    ? isActive
                      ? "border-blue-500/50 bg-blue-500/10"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                    : isActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className={`rounded-lg bg-gradient-to-br ${module.color} p-3`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border-2 transition ${
                      isActive
                        ? "border-blue-500 bg-blue-500"
                        : isDark
                        ? "border-slate-600"
                        : "border-gray-300"
                    }`}
                  >
                    {isActive && (
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <h4
                  className={`mb-3 text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {module.name}
                </h4>
                <div className="space-y-2">
                  {module.options.map((option) => (
                    <label
                      key={option}
                      className={`flex items-center gap-2 text-sm ${
                        isDark
                          ? "text-gray-400 hover:text-gray-300"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded border-2 ${
                          isDark ? "border-slate-600" : "border-gray-300"
                        }`}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
