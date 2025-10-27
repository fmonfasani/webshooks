"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "@/lib/toast";

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
] as const;

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
] as const;

type Mode = "signin" | "signup";

type AuthScreenProps = {
  initialMode?: Mode;
};

export default function AuthScreen({ initialMode = "signin" }: AuthScreenProps) {
  const router = useRouter();
  const { isDark, setTheme, toggleTheme } = useTheme();
  const { login, register, loading, isAuthenticated } = useAuth();

  const [mode, setMode] = useState<Mode>(initialMode);
  const [mounted, setMounted] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveFeature((current) => (current + 1) % featureCards.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  const gradients = useMemo(
    () => ({
      background: isDark
        ? "from-slate-900 via-slate-950 to-slate-900"
        : "from-slate-100 via-white to-slate-100",
      accent: "from-blue-500 to-indigo-600",
    }),
    [isDark],
  );

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const { email, password } = formState;
    try {
      if (mode === "signin") {
        await login(email, password);
        toast.success("Welcome back");
      } else {
        await register({ email, password, name: formState.name });
        toast.success("Account created");
      }
      router.replace("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
      toast.error(message);
    }
  }

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setError(null);
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
              onClick={() => {
                if (!mounted) {
                  setTheme(isDark ? "light" : "dark");
                } else {
                  toggleTheme();
                }
              }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/60 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:scale-105 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {isDark ? "Light" : "Dark"} mode
            </button>
          </header>

          <div className="mt-12 w-full max-w-md space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </h1>
              <div className="inline-flex rounded-full border border-slate-200/60 bg-white/70 p-1 text-xs dark:border-slate-800/60 dark:bg-slate-900/60">
                <button
                  type="button"
                  className={`rounded-full px-3 py-1 font-medium transition ${
                    mode === "signin"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow"
                      : "text-slate-500 dark:text-slate-300"
                  }`}
                  onClick={() => switchMode("signin")}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  className={`rounded-full px-3 py-1 font-medium transition ${
                    mode === "signup"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow"
                      : "text-slate-500 dark:text-slate-300"
                  }`}
                  onClick={() => switchMode("signup")}
                >
                  Sign up
                </button>
              </div>
            </div>

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
                <span className="text-sm text-slate-600 dark:text-slate-400">Email</span>
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
                    minLength={8}
                    className="flex-1 border-0 bg-transparent text-sm text-slate-900 dark:text-slate-100"
                  />
                </div>
              </label>

              {error && <p className="text-sm text-rose-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition disabled:cursor-not-allowed disabled:opacity-80"
              >
                <span className="flex items-center gap-2">
                  {loading
                    ? mode === "signin"
                      ? "Signing in"
                      : "Creating account"
                    : mode === "signin"
                    ? "Sign in"
                    : "Create account"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </form>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              By continuing you agree to our Terms of Service and acknowledge our Privacy Policy.
            </p>
          </div>

          <footer className="mt-12 grid gap-4 sm:grid-cols-3">
            {exampleApps.map((app, index) => (
              <div
                key={app.name}
                className={`rounded-2xl border border-white/40 bg-white/20 p-4 text-sm shadow-lg backdrop-blur-sm transition dark:border-slate-800/60 dark:bg-slate-900/40 ${
                  index === activeFeature ? "ring-2 ring-blue-400/60" : ""
                }`}
              >
                <p className="font-semibold text-slate-900 dark:text-slate-100">{app.name}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {app.description}
                </p>
              </div>
            ))}
          </footer>
        </section>

        <aside className="hidden w-full max-w-xl border-l border-white/10 bg-white/40 px-8 py-12 backdrop-blur-xl dark:border-slate-800/40 dark:bg-slate-900/40 lg:block">
          <div className="flex h-full flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
                  Powered by Webshooks
                </p>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Launch a modern SaaS faster than ever
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Describe your product and let the builder orchestrate auth, databases, UI, and
                  automations tailored to your stack.
                </p>
              </div>

              <div className="space-y-4">
                {featureCards.map((card, index) => {
                  const Icon = card.icon;
                  const isActive = index === activeFeature;
                  return (
                    <div
                      key={card.title}
                      className={`flex items-start gap-3 rounded-2xl border px-4 py-4 transition ${
                        isActive
                          ? "border-blue-400/60 bg-white/70 shadow-lg dark:border-blue-500/40 dark:bg-slate-900/60"
                          : "border-white/30 bg-white/30 dark:border-slate-800/40 dark:bg-slate-900/40"
                      }`}
                    >
                      <div
                        className={`rounded-full p-2 ${
                          isActive
                            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                            : "bg-blue-500/10 text-blue-500"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {card.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/20 p-6 text-sm shadow-xl backdrop-blur dark:border-slate-800/40 dark:bg-slate-900/40">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">
                Workflow
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                1. Describe your SaaS idea
                <br />
                2. Pick modules and integrations
                <br />
                3. Deploy globally in minutes
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
