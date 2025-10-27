"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { SaaSBuilderDashboard } from "@/components/dashboard/SaaSBuilderDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { getToken } from "@/lib/storage";
import { toast } from "@/lib/toast";
import type { ModuleId, ProjectWithModules, SubmoduleId } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, logout, loading: authLoading } = useAuth();

  const [activeModule, setActiveModule] = useState<ModuleId>("build");
  const [activeSubmodule, setActiveSubmodule] = useState<SubmoduleId>("modules");
  const [projectData, setProjectData] = useState<ProjectWithModules | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    const token = getToken();
    if (!token || !isAuthenticated) {
      router.replace("/signin");
      return;
    }

    async function fetchProject() {
      try {
        const res = await fetch(`${API_BASE}/api/projects/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const projects = await res.json();
          if (projects.length > 0) {
            const firstProject = projects[0];
            setProjectData({
              ...firstProject,
              progress: {
                planning: 20,
                design: 40,
                build: 60,
                integrate: 10,
                test: 0,
                deploy: 0,
                monitor: 0,
                collaborate: 0,
              },
              activeModules: ["auth", "database"],
            });
          }
        }
      } catch (e) {
        console.error("Error fetching project:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [router, isAuthenticated, authLoading]);

  const handleSelectSubmodule = (moduleId: ModuleId, submoduleId: SubmoduleId) => {
    setActiveModule(moduleId);
    setActiveSubmodule(submoduleId);
    setSidebarOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success("Signed out successfully");
      router.push("/signin");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-gray-500 dark:text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950">
      <DashboardSidebar
        activeModule={activeModule}
        activeSubmodule={activeSubmodule}
        onSelectSubmodule={handleSelectSubmodule}
        projectProgress={projectData?.progress}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <SaaSBuilderDashboard
        projectData={projectData}
        loadingProject={loading}
        activeModule={activeModule}
        activeSubmodule={activeSubmodule}
        onSelectSubmodule={handleSelectSubmodule}
        onOpenSidebar={() => setSidebarOpen(true)}
        onCloseSidebar={() => setSidebarOpen(false)}
        onSignOut={handleSignOut}
      />
    </div>
  );
}