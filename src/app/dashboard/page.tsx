//src\app\dashboard\page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Menu, Moon, Settings, Sun } from 'lucide-react';

import { DashboardSidebar } from '@/components/dashboard/Sidebar';
import { ModuleContent } from '@/components/dashboard/ModuleContent';
import { Button } from '@/components/ui/button';
import { getToken } from '@/lib/storage';
import { useAuthStore } from '@/store/useAuthStore';
import type { ModuleId, Project, ProjectWithModules, SubmoduleId } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const defaultModuleProgress: Record<ModuleId, number> = {
  planning: 0,
  design: 0,
  build: 0,
  integrate: 0,
  test: 0,
  deploy: 0,
  monitor: 0,
  collaborate: 0,
};

type ApiProject = Project & {
  progress?: Partial<Record<ModuleId, number>>;
  activeModules?: string[];
  [key: string]: unknown;
};

export default function DashboardPage() {
  const router = useRouter();
  const { session, signout } = useAuthStore();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [activeModule, setActiveModule] = useState<ModuleId>('build');
  const [activeSubmodule, setActiveSubmodule] = useState<SubmoduleId>('modules');
  const [projectData, setProjectData] = useState<ProjectWithModules | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      router.replace('/signin');
      return;
    }

    let isMounted = true;

    async function fetchProject() {
      try {
        const res = await fetch(`${API_BASE}/api/projects/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          router.replace('/signin');
          return;
        }

        if (!res.ok) throw new Error('Failed to load project');

        const projects: ApiProject[] = await res.json();
        if (!isMounted) return;

        if (projects.length > 0) {
          const first = projects[0];
          const normalizedProgress = {
            ...defaultModuleProgress,
            ...(first.progress ?? {}),
          } as Record<ModuleId, number>;
          const normalizedActiveModules = Array.isArray(first.activeModules)
            ? first.activeModules
            : [];

          setProjectData({
            ...first,
            progress: normalizedProgress,
            activeModules: normalizedActiveModules,
          } as ProjectWithModules);
        }
      } catch (error) {
        console.error('Failed to fetch project', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void fetchProject();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleSelectSubmodule = (moduleId: ModuleId, submoduleId: SubmoduleId) => {
    setActiveModule(moduleId);
    setActiveSubmodule(submoduleId);
    setIsSidebarOpen(false);
  };

  const handleSignOut = async () => {
    await signout();
    router.push('/signin');
  };

  if (loading) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${
          isDark ? 'bg-slate-950 text-gray-400' : 'bg-gray-50 text-gray-500'
        }`}
      >
        Loading...
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <div className="flex min-h-screen">
        <div className="hidden lg:flex">
          <DashboardSidebar
            activeModule={activeModule}
            activeSubmodule={activeSubmodule}
            onSelectSubmodule={handleSelectSubmodule}
            projectProgress={projectData?.progress}
          />
        </div>

        <div className="flex flex-1 flex-col">
          <header
            className={`border-b transition-colors ${
              isDark ? 'border-slate-800 bg-slate-900/80' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between px-4 py-4 md:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className={`rounded-lg p-2 transition-colors lg:hidden ${
                    isDark ? 'text-gray-400 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="Open navigation"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div
                  className={`hidden items-center gap-2 rounded-full px-3 py-1 text-xs font-medium md:flex ${
                    isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  System ok
                </div>
                {projectData?.name && (
                  <div className="hidden md:block">
                    <div
                      className={`text-xs uppercase tracking-wide ${
                        isDark ? 'text-gray-500' : 'text-gray-500'
                      }`}
                    >
                      Active project
                    </div>
                    <div
                      className={`text-base font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {projectData.name}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {session?.user?.email && (
                  <div className={`hidden text-sm md:block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {session.user.email}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  className={`rounded-lg p-2 transition-colors ${
                    isDark ? 'text-gray-400 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <button
                  type="button"
                  className={`rounded-lg p-2 transition-colors ${
                    isDark ? 'text-gray-400 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="Settings"
                >
                  <Settings className="h-5 w-5" />
                </button>
                <Button variant="secondary" size="sm" onClick={handleSignOut}>
                  Sign out
                </Button>
              </div>
            </div>
          </header>

          <ModuleContent
            moduleId={activeModule}
            submoduleId={activeSubmodule}
            projectData={projectData}
          />
        </div>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="h-full w-full bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              className="relative h-full w-64"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <DashboardSidebar
                activeModule={activeModule}
                activeSubmodule={activeSubmodule}
                onSelectSubmodule={handleSelectSubmodule}
                projectProgress={projectData?.progress}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
