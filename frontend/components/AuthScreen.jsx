
// src\components\AuthScreen.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  CheckCircle2,
  Chrome,
  Github,
  Lock,
  Mail,
  Moon,
  Sparkles,
  Sun,
  User,
  Zap,
} from "lucide-react";

const featureCards = [
  {
    title: "AI scaffolding",
    description: "Prototype flows and dashboards with AI-generated components in seconds.",
    icon: Sparkles,
  },
  {
    title: "Zero-config auth",
    description: "Secure OAuth, magic links, and RBAC baked into your stack.",
    icon: CheckCircle2,
  },
  {
    title: "Deploy globally",
    description: "Push to the edge with automated rollbacks and latency-aware routing.",
    icon: Zap,
  },
];

const exampleApps = [
  {
    name: "Support Copilot",
    description: "Triage requests with GPT-powered automations and human handoffs.",
  },
  {
    name: "Revenue Radar",
    description: "Monitor MRR, churn, and expansion in real-time across regions.",
  },
  {
    name: "Creator Launchpad",
    description: "Spin up memberships, billing, and CRM in under an hour.",
  },
];

export default function AuthScreen() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState("signin");
  const [activeFeature, setActiveFeature] = useState(0);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveFeature((current) => (current + 1) % featureCards.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  const gradients = useMemo(
    () => ({
      background: isDark
        ? "from-slate-900 via-slate-950 to-slate-900"
        : "from-slate-100 via-white to-slate-100",
      accent: "from-blue-500 to-indigo-600",
    }),
    [isDark]
  );

  function handleThemeToggle() {
    setTheme(isDark ? "light" : "dark");
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // mock submit
  }

  return (
    <div className={`min-h-screen overflow-hidden bg-gradient-to-br ${gradients.background}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[50vh] blur-3xl">
        <div className={`mx-auto h-full w-[80%] rounded-full bg-gradient-to-r ${gradients.accent} opacity-30`} />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <section className="flex flex-1 flex-col justify-between px-6 py-10 sm:px-12 lg:px-16">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                <Zap className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-300">
                  ⚡ Serverless SaaS
                </p>
                <p className="text-base font-medium text-slate-600 dark:text-slate-200">
                  Build in minutes, launch worldwide
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleThemeToggle}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/60 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:scale-105 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {isDark ? "Light" : "Dark"} mode
            </button>
          </header>

          <div className="mt-12 w-full max-w-md space-y-8">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>

            <div className="grid gap-3 sm:grid-cols-2">
              <button className="group flex items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-100">
                <Chrome className="h-4 w-4" /> Google
              </button>
              <button className="group flex items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-100">
                <Github className="h-4 w-4" /> GitHub
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <label className="block">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Full name</span>
                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 dark:border-slate-800/80 dark:bg-slate-900/60">
                    <User className="h-4 w-4 text-slate-400" />
                    <input
                      name="name"
                      value={formState.name}
                      onChange={handleInputChange}
                      placeholder="Ada Lovelace"
                      className="flex-1 border-0 bg-transparent text-sm text-slate-900 dark:text-slate-100"
                      required
                    />
                  </div>
                </label>
              )}

              <label className="block">
                <span className="text-sm text-slate-600 dark:text-slate-400">Email address</span>
                <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 dark:border-slate-800/80 dark:bg-slate-900/60">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    required
                    className="flex-1 border-0 bg-transparent text-sm text-slate-900 dark:text-slate-100"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm text-slate-600 dark:text-slate-400">Password</span>
                <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 dark:border-slate-800/80 dark:bg-slate-900/60">
                  <Lock className="h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    value={formState.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    className="flex-1 border-0 bg-transparent text-sm text-slate-900 dark:text-slate-100"
                  />
                </div>
              </label>

              <button
                type="submit"
                className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition"
              >
                <span className="flex items-center gap-2">
                  {mode === "signin" ? "Sign in" : "Create account"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </form>
          </div>
        </section>

        <aside className="hidden flex-1 items-center justify-center bg-slate-900/80 p-10 text-slate-100 lg:flex">
          <div className="max-w-lg space-y-6">
            <h2 className="text-3xl font-semibold">Design. Ship. Scale.</h2>
            {featureCards.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-4 rounded-2xl border border-white/10 p-4 transition ${
                    i === activeFeature ? "bg-blue-500/20 scale-[1.03]" : "opacity-70"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/30">
                    <Icon className="h-5 w-5 text-blue-200" />
                  </div>
                  <div>
                    <p className="font-semibold">{feature.title}</p>
                    <p className="text-sm text-slate-300">{feature.description}</p>
                  </div>
                </div>
              );
            })}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {exampleApps.map((app) => (
                <div
                  key={app.name}
                  className="rounded-xl border border-white/10 bg-white/10 p-3 text-left text-sm text-slate-100"
                >
                  <p className="font-semibold">{app.name}</p>
                  <p className="text-xs opacity-80">{app.description}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
