"use client";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import dynamic from 'next/dynamic';
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
const HeroHeader = dynamic(() => import("../../components/ui/header").then(m => m.HeroHeader), {
  ssr: false,
  loading: () => <div className="h-24 w-full rounded-2xl motion-safe:animate-pulse bg-gray-200/10 dark:bg-gray-700/20" />, 
});
const EmptyStateUI = dynamic(() => import("../../components/ui/empty-state").then(m => m.EmptyState), {
  ssr: false,
  loading: () => <div className="h-40 w-full rounded-xl border border-dashed border-gray-300/60 dark:border-gray-700/60 motion-safe:animate-pulse bg-gray-200/5 dark:bg-gray-700/10" />,
});

import { getToken } from "../../lib/storage";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
import { toast } from "../../lib/toast";

type ProjectItem = { id: number | string; name: string; updatedAt?: string };

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<ProjectItem["id"] | null>(null);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<ProjectItem["id"] | null>(null);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);

  const cardVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
  } as const;

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/signin");
      return;
    }
    async function run() {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE}/api/projects/`,
          ({ headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 60 } } as any)
        );
        if (res.status === 401) {
          router.replace("/signin");
          return;
        }
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setProjects(data);
        // fetch user info for header
        try {
          const me = await fetch(
            `${API_BASE}/api/auth/me`,
            ({ headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 60 } } as any)
          );
          if (me.ok) {
            const u = await me.json();
            setUserEmail(u?.email);
          }
        } catch {}
      } catch (e: any) {
        setError(e?.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    }
    void run();
  }, [router]);

  const recent: Array<{ id: string; text: string; time: string }> = [];

  async function onCreateProject(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const token = getToken();
      const temp: ProjectItem = {
        id: "tmp_" + Math.random().toString(36).slice(2),
        name: newName.trim(),
      };
      setProjects((prev) => [...prev, temp]);
      const res = await fetch(`${API_BASE}/api/projects/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (!res.ok) throw new Error(await res.text());
      const created = await res.json();
      setProjects((prev) =>
        prev.map((p) => (p.id === temp.id ? created : p))
      );
      setNewName("");
      toast.success("Project created");
    } catch (e: any) {
      setCreateError(e?.message || "Failed to create project");
      setProjects((prev) =>
        prev.filter((p) => String(p.id).startsWith("tmp_") === false)
      );
      toast.error("Failed to create project");
    } finally {
      setCreating(false);
    }
  }

  async function onSaveProject(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId || !editName.trim()) return;
    setSaving(true);
    const snapshot = projects;
    try {
      const token = getToken();
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingId ? { ...p, name: editName.trim() } : p
        )
      );
      const res = await fetch(
        `${API_BASE}/api/projects/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ name: editName.trim() }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingId ? { ...p, name: updated.name } : p
        )
      );
      setEditingId(null);
      setEditName("");
      toast.success("Project updated");
    } catch (e: any) {
      setProjects(snapshot);
      toast.error("Failed to update project");
    } finally {
      setSaving(false);
    }
  }

  async function onDeleteProject(id: ProjectItem["id"]) {
    if (!confirm("Delete this project?")) return;
    setDeletingId(id);
    const snapshot = projects;
    try {
      const token = getToken();
      setProjects((prev) => prev.filter((p) => p.id !== id));
      const res = await fetch(`${API_BASE}/api/projects/${id}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Project deleted");
    } catch (e: any) {
      setProjects(snapshot);
      toast.error("Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <Suspense fallback={<div className="h-24 w-full rounded-2xl motion-safe:animate-pulse bg-gray-200/10 dark:bg-gray-700/20" />}> 
        <HeroHeader
          title="Welcome back"
          subtitle="Build, iterate, and launch your SaaS"
          email={userEmail}
        />
      </Suspense>

      <motion.div
        initial="hidden"
        animate="show"
        variants={cardVariants}
        transition={{ delay: 0.08, duration: 0.3, ease: "easeInOut" }}
        className="motion-safe:animate-fadeInUp"
      >
        <Card className="glass-panel rounded-68 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold tracking-tight">Create New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex gap-3" onSubmit={onCreateProject}>
              <Input
                placeholder="Project name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="rounded-68 bg-white/70 dark:bg-[#1A2027] border border-white/30 dark:border-white/10 focus:ring-2 focus:ring-electricBlue/50 focus:border-electricBlue/60"
              />
              <Button
                type="submit"
                disabled={creating || !newName.trim()}
                className="rounded-68 bg-electricBlue text-white hover:bg-electricBlue/90 smooth-transition shadow-soft"
              >
                {creating ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Creating...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Create
                  </span>
                )}
              </Button>
            </form>
            {createError && (
              <div className="text-sm text-dangerRed mt-2">{createError}</div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <section>
        <h2 className="text-sm font-medium mb-3 tracking-wide text-neutral-600 dark:text-neutral-300">Your Projects</h2>
        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-68 bg-white/40 dark:bg-neutralDark/40 backdrop-blur motion-safe:animate-pulse shadow-soft"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-sm text-dangerRed py-6">{error}</div>
        ) : projects.length === 0 ? (
          <EmptyStateUI title="No projects yet. Create your first one." />
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {projects.map((p, idx) => (
              <motion.div
                key={p.id}
                initial="hidden"
                animate="show"
                variants={cardVariants}
                transition={{
                  delay: 0.08 * (idx + 1),
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="motion-safe:animate-fadeInUp"
              >
                <Card className="glass-panel rounded-68 hover:shadow-lg smooth-transition">
                  <CardHeader>
                    {editingId === p.id ? (
                      <form
                        className="flex gap-2 items-center"
                        onSubmit={onSaveProject}
                      >
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="rounded-68 bg-white/70 dark:bg-[#1A2027] border border-white/30 dark:border-white/10 focus:ring-2 focus:ring-electricBlue/50 focus:border-electricBlue/60"
                        />
                        <Button
                          type="submit"
                          disabled={saving || !editName.trim()}
                          className="rounded-68 bg-successGreen text-white hover:bg-successGreen/90 smooth-transition"
                        >
                          {saving ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setEditingId(null);
                            setEditName("");
                          }}
                          className="rounded-68"
                        >
                          Cancel
                        </Button>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold">{p.name}</CardTitle>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setEditingId(p.id);
                              setEditName(p.name);
                            }}
                            className="rounded-68 bg-electricBlue text-white hover:bg-electricBlue/90 smooth-transition"
                          >
                            <Pencil className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            disabled={deletingId === p.id}
                            onClick={() => {
                              void onDeleteProject(p.id);
                            }}
                            className="rounded-68 bg-dangerRed/10 text-dangerRed hover:bg-dangerRed/15 smooth-transition"
                          >
                            {deletingId === p.id ? (
                              <span className="inline-flex items-center gap-1">
                                <Loader2 className="h-4 w-4 animate-spin" />{" "}
                                Deleting
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1">
                                <Trash2 className="h-4 w-4" /> Delete
                              </span>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-600 dark:text-gray-300">ID: {p.id}</div>
                      <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-successGreen/10 text-successGreen border border-successGreen/20">Active</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-medium mb-3 tracking-wide text-neutral-600 dark:text-neutral-300">Recent Activity</h2>
        <Card className="glass-panel rounded-68">
          <CardContent>
            {recent.length === 0 ? (
              <div className="text-sm text-gray-600 dark:text-gray-300 py-6">
                Nothing here yet.
              </div>
            ) : (
              <ul className="text-sm pl-4">
                {recent.map((r) => (
                  <li key={r.id} className="relative pl-4 border-l-2 border-electricBlue/40 text-gray-700 dark:text-gray-200">
                    <span className="absolute -left-[6px] top-1 h-2 w-2 rounded-full bg-electricBlue" />
                    <span className="font-medium">{r.text}</span> · <span className="text-xs opacity-70">{r.time}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
