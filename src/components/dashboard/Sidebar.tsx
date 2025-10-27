// src/components/dashboard/Sidebar.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  Palette,
  Code,
  Plug,
  TestTube,
  TrendingUp,
  Activity,
  Users,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Github,
  MessageSquare,
  CheckSquare,
  Layers,
  Map,
  Box,
  Image,
  Layout,
  Table,
  Workflow,
  Webhook,
  Shield,
  Mail,
  Eye,
  Bug,
  Settings,
  GitBranch,
  Server,
  AlertCircle,
  BarChart3,
  Bell,
  MessageCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import type { Module, ModuleId, ProjectProgress, SubmoduleId } from "@/types";

const modules: Module[] = [
  {
    id: "planning",
    name: "Planning",
    icon: Lightbulb,
    submodules: [
      { id: "idea-board", name: "Idea Board", icon: MessageSquare },
      { id: "requirements", name: "Requirements", icon: CheckSquare },
      { id: "tech-stack", name: "Tech Stack", icon: Layers },
      { id: "roadmap", name: "Roadmap", icon: Map },
    ],
  },
  {
    id: "design",
    name: "Design",
    icon: Palette,
    submodules: [
      { id: "ui-components", name: "UI Components", icon: Box },
      { id: "theme-builder", name: "Theme Builder", icon: Palette },
      { id: "pages", name: "Pages", icon: Layout },
      { id: "assets", name: "Assets", icon: Image },
    ],
  },
  {
    id: "build",
    name: "Build",
    icon: Code,
    submodules: [
      { id: "modules", name: "Modules", icon: Box },
      { id: "database-schema", name: "Database Schema", icon: Table },
      { id: "api-endpoints", name: "API Endpoints", icon: Code },
      { id: "logic-builder", name: "Logic Builder", icon: Workflow },
    ],
  },
  {
    id: "integrate",
    name: "Integrate",
    icon: Plug,
    submodules: [
      { id: "external-apis", name: "External APIs", icon: Plug },
      { id: "webhooks", name: "Webhooks", icon: Webhook },
      { id: "third-party-auth", name: "Third Party Auth", icon: Shield },
      { id: "email-sms", name: "Email/SMS", icon: Mail },
    ],
  },
  {
    id: "test",
    name: "Test",
    icon: TestTube,
    submodules: [
      { id: "preview", name: "Preview", icon: Eye },
      { id: "test-users", name: "Test Users", icon: Users },
      { id: "debug-logs", name: "Debug Logs", icon: Bug },
      { id: "performance", name: "Performance", icon: Activity },
    ],
  },
  {
    id: "deploy",
    name: "Deploy",
    icon: TrendingUp,
    submodules: [
      { id: "environment", name: "Environment Config", icon: Settings },
      { id: "domain", name: "Domain Setup", icon: ExternalLink },
      { id: "cicd", name: "CI/CD Pipeline", icon: GitBranch },
      { id: "version-control", name: "Version Control", icon: Github },
    ],
  },
  {
    id: "monitor",
    name: "Monitor",
    icon: Activity,
    submodules: [
      { id: "analytics", name: "Analytics", icon: BarChart3 },
      { id: "error-tracking", name: "Error Tracking", icon: AlertCircle },
      { id: "uptime", name: "Uptime", icon: Activity },
      { id: "usage-metrics", name: "Usage Metrics", icon: Server },
    ],
  },
  {
    id: "collaborate",
    name: "Collaborate",
    icon: Users,
    submodules: [
      { id: "team-members", name: "Team Members", icon: Users },
      { id: "comments", name: "Comments", icon: MessageCircle },
      { id: "activity-feed", name: "Activity Feed", icon: Bell },
      { id: "permissions", name: "Permissions", icon: Shield },
    ],
  },
];

type Props = {
  activeModule: ModuleId;
  activeSubmodule: SubmoduleId;
  onSelectSubmodule: (moduleId: ModuleId, submoduleId: SubmoduleId) => void;
  projectProgress?: ProjectProgress;
};

export function DashboardSidebar({
  activeModule,
  activeSubmodule,
  onSelectSubmodule,
  projectProgress,
}: Props) {
  const [expandedModules, setExpandedModules] = useState<ModuleId[]>(["build"]);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const toggleModule = (moduleId: ModuleId) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return isDark ? "text-emerald-400" : "text-emerald-600";
    if (progress >= 50) return isDark ? "text-amber-400" : "text-amber-600";
    if (progress > 0) return isDark ? "text-blue-400" : "text-blue-600";
    return isDark ? "text-gray-600" : "text-gray-400";
  };

  return (
    <aside
      className={`flex w-64 flex-col border-r transition-colors ${
        isDark ? "border-slate-800 bg-slate-900" : "border-gray-200 bg-white"
      }`}
    >
      <div
        className={`border-b px-6 py-5 transition-colors ${
          isDark ? "border-slate-800" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
            <span className="text-sm font-bold text-white">SS</span>
          </div>
          <div>
            <h1
              className={`text-base font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              serverless
              <span className={isDark ? "text-gray-500" : "text-gray-400"}>
                .io
              </span>
            </h1>
          </div>
        </div>
      </div>

      <nav className="h-[calc(100vh-180px)] space-y-1 overflow-y-auto p-3">
        {modules.map((module) => {
          const Icon = module.icon;
          const isExpanded = expandedModules.includes(module.id);
          const progress = projectProgress?.[module.id] ?? 0;

          return (
            <div key={module.id}>
              <button
                type="button"
                onClick={() => toggleModule(module.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                  activeModule === module.id
                    ? isDark
                      ? "bg-slate-800 text-white"
                      : "bg-gray-100 text-gray-900"
                    : isDark
                    ? "text-gray-400 hover:bg-slate-800 hover:text-gray-300"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{module.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {progress === 100 && (
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${getProgressColor(progress)}`}
                  >
                    {progress}%
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-6 mt-1 space-y-0.5"
                >
                  {module.submodules.map((submodule) => {
                    const isActive =
                      activeModule === module.id &&
                      activeSubmodule === submodule.id;

                    return (
                      <button
                        key={submodule.id}
                        type="button"
                        onClick={() =>
                          onSelectSubmodule(module.id, submodule.id)
                        }
                        className={`w-full rounded-md px-3 py-1.5 text-left text-sm transition ${
                          isActive
                            ? isDark
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-blue-50 text-blue-600"
                            : isDark
                            ? "text-gray-500 hover:bg-slate-800 hover:text-gray-300"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {submodule.name}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </div>
          );
        })}
      </nav>

      <div
        className={`border-t p-3 ${
          isDark ? "border-slate-800" : "border-gray-200"
        }`}
      >
        <div
          className={`mb-2 px-3 text-xs font-semibold ${
            isDark ? "text-gray-500" : "text-gray-500"
          }`}
        >
          Resources
        </div>
        <Link
          href="/docs"
          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
            isDark
              ? "text-gray-400 hover:bg-slate-800 hover:text-gray-300"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <ExternalLink className="h-4 w-4" />
          <span>Documentation</span>
        </Link>
        <Link
          href="https://github.com"
          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
            isDark
              ? "text-gray-400 hover:bg-slate-800 hover:text-gray-300"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Github className="h-4 w-4" />
          <span>GitHub</span>
        </Link>
      </div>
    </aside>
  );
}
