// src/components/dashboard/SaaSBuilderDashboard.tsx
"use client";

import React from "react";
import { Menu, Moon, Settings, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModuleContent } from "./ModuleContent";
import type { ModuleId, ProjectWithModules, SubmoduleId } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  projectData: ProjectWithModules | null;
  loadingProject: boolean;
  activeModule: ModuleId;
  activeSubmodule: SubmoduleId;
  onSelectSubmodule: (moduleId: ModuleId, submoduleId: SubmoduleId) => void;
  onOpenSidebar: () => void;
  onCloseSidebar: () => void;
  onSignOut: () => Promise<void>;
};

export function SaaSBuilderDashboard({
  projectData,
  loadingProject,
  activeModule,
  activeSubmodule,
  onOpenSidebar,
  onSignOut,
}: Props) {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  if (loadingProject) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${
          isDark ? "bg-slate-950 text-gray-400" : "bg-gray-50 text-gray-500"
        }`}
      >
        Loading dashboard...
      </div>
    );
  }

  return (
    <div
      className={`flex-1 transition-colors ${
        isDark ? "bg-slate-950" : "bg-gray-50"
      }`}
    >
      <div className="flex min-h-screen flex-col">
        <header
          className={`border-b transition-colors ${
            isDark ? "border-slate-800 bg-slate-900/80" : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-4 md:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenSidebar}
                className={`rounded-lg p-2 transition-colors lg:hidden ${
                  isDark
                    ? "text-gray-400 hover:bg-slate-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div
                className={`hidden items-center gap-2 rounded-full px-3 py-1 text-xs font-medium md:flex ${
                  isDark
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                System ok
              </div>

              {projectData?.name && (
                <div className="hidden md:block">
                  <div
                    className={`text-xs uppercase tracking-wide ${
                      isDark ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    Active project
                  </div>
                  <div
                    className={`text-base font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {projectData.name}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {user?.email && (
                <div
                  className={`hidden text-sm md:block ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {user.email}
                </div>
              )}

              <button
                type="button"
                onClick={toggleTheme}
                className={`rounded-lg p-2 transition-colors ${
                  isDark
                    ? "text-gray-400 hover:bg-slate-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <button
                type="button"
                className={`rounded-lg p-2 transition-colors ${
                  isDark
                    ? "text-gray-400 hover:bg-slate-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>

              <Button variant="secondary" size="sm" onClick={onSignOut}>
                Sign out
              </Button>
            </div>
          </div>
        </header>

        <ModuleContent
          moduleId={activeModule}
          submoduleId={activeSubmodule}
          projectData={projectData ?? undefined}
        />
      </div>
    </div>
  );
}
