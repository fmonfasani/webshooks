import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const iconStroke = (isDark) => (isDark ? "#e2e8f0" : "#1f2937");

const SunIcon = ({ isDark }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={iconStroke(!isDark)} strokeWidth="1.6">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m16.95-6.95-1.41 1.41M6.46 17.54l-1.41 1.41m0-13.9 1.41 1.41M17.54 17.54l1.41 1.41" />
  </svg>
);

const MoonIcon = ({ isDark }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={iconStroke(isDark)} strokeWidth="1.6">
    <path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79z" />
  </svg>
);

const MailIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
    <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
    <polyline points="22 7 12 13 2 7" />
  </svg>
);

const LockIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UserIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CodeIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const DatabaseIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v6c0 1.6 4 3 9 3s9-1.4 9-3V5" />
    <path d="M3 11v6c0 1.6 4 3 9 3s9-1.4 9-3v-6" />
  </svg>
);

const PaletteIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
    <path d="M19.5 12.5a7.5 7.5 0 1 0-7.5 7.5c.5 0 1-.5 1-1 0-.3-.1-.5-.1-.8a1.5 1.5 0 0 1 1.5-1.7h3c2 0 3.6-1.6 3.1-3z" />
    <path d="M12 6.5h.01M8 7.5h.01M6 11.5h.01M16 7.5h.01" />
  </svg>
);

const RocketIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
    <path d="M5 15c-1.5 1.5-2 4-2 4s2.5-.5 4-2l10-10a3 3 0 0 0-4-4L5 15z" />
    <path d="M12 9l3 3" />
    <path d="M9 12l-2 5" />
    <path d="M7 17l-3 3" />
  </svg>
);

const GoogleGlyph = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <g fill="none">
      <path fill="#EA4335" d="M12 10.7v3.5h4.9a4.2 4.2 0 0 1-1.8 2.8l2.9 2.2c1.7-1.6 2.7-4 2.7-6.9 0-.6-.1-1.3-.2-1.9H12z" />
      <path fill="#34A853" d="M7.7 13.9 6.9 14l-2.3 1.8A8 8 0 0 0 12 20c2.4 0 4.4-.8 5.8-2l-2.9-2.2a4.9 4.9 0 0 1-7.2-1.9z" />
      <path fill="#4A90E2" d="M6 9.3 3.8 7.6A8 8 0 0 0 2 12c0 1.3.3 2.6.9 3.6l2.8-2.1a4.8 4.8 0 0 1 0-3.2z" />
      <path fill="#FBBC05" d="M12 5.2c1.2 0 2.3.4 3.2 1.2l2.4-2.4A8 8 0 0 0 3.7 7.7l2.8 2.1A4.9 4.9 0 0 1 12 5.2z" />
    </g>
  </svg>
);

const GitHubGlyph = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
    <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.6-1.6-1.5-2-1.5-2-1.2-.8.1-.8.1-.8 1.3.1 2 1.3 2 1.3 1.2 2 3.1 1.4 3.8 1.1.1-.8.4-1.4.7-1.7-2.6-.3-5.4-1.3-5.4-5.8 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.4 1.2a11.7 11.7 0 0 1 6.2 0c2.4-1.5 3.4-1.2 3.4-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 2 1.2 3.3 0 4.5-2.9 5.5-5.5 5.8.5.4.8 1.2.8 2.3v3.3c0 .3.2.6.8.5A12 12 0 0 0 12 .5" />
  </svg>
);

const featureCards = [
  {
    key: "code",
    title: "Generate UI in seconds",
    description: "From product brief to pixel-perfect React components instantly.",
    icon: CodeIcon,
  },
  {
    key: "database",
    title: "Database ready",
    description: "Provision scalable data layers with migrations and seeds included.",
    icon: DatabaseIcon,
  },
  {
    key: "palette",
    title: "Beautiful by default",
    description: "Adaptive theming, responsive spacing, and accessible typography baked in.",
    icon: PaletteIcon,
  },
  {
    key: "rocket",
    title: "Deploy instantly",
    description: "Ship to the edge with CI/CD, observability, and zero downtime deployments.",
    icon: RocketIcon,
  },
];

const exampleApps = [
  { name: "AI Support Desk", description: "Automated triage with human-in-the-loop escalation" },
  { name: "Finance Insights", description: "Self-serve analytics for revenue and retention" },
  { name: "Creator Toolkit", description: "Launch gated content and memberships in hours" },
];

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 1024;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const resize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return isMobile;
};

const getPalette = (isDark) => ({
  background: isDark
    ? "radial-gradient(circle at top, rgba(34,197,94,0.08), rgba(2,6,23,1))"
    : "linear-gradient(135deg, #f5f7ff 0%, #eef2ff 40%, #e0e7ff 100%)",
  textPrimary: isDark ? "#f8fafc" : "#0f172a",
  textSecondary: isDark ? "#94a3b8" : "#4b5563",
  cardBorder: isDark ? "rgba(148,163,184,0.35)" : "rgba(148,163,184,0.35)",
  inputBg: isDark ? "#0f172a" : "#ffffff",
  inputBorder: isDark ? "rgba(148,163,184,0.3)" : "rgba(148,163,184,0.45)",
  inputShadow: isDark ? "none" : "0 1px 3px rgba(15,23,42,0.1)",
  buttonGradient: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
  divider: isDark ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.3)",
  showcaseGradient: isDark
    ? "linear-gradient(135deg, rgba(15,23,42,0.92), rgba(30,64,175,0.55), rgba(67,56,202,0.4))"
    : "linear-gradient(135deg, rgba(226,232,255,0.95), rgba(219,234,254,0.85), rgba(233,213,255,0.85))",
  badgeBg: isDark ? "rgba(59,130,246,0.18)" : "rgba(59,130,246,0.12)",
  badgeText: isDark ? "#bfdbfe" : "#1d4ed8",
});

export default function AuthScreen() {
  const { isAuthenticated, login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [busy, setBusy] = useState(false);

  const isMobile = useIsMobile();
  const palette = useMemo(() => getPalette(isDark), [isDark]);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % featureCards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, 400));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError(null);
    setBusy(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          throw new Error("NAME_REQUIRED");
        }
        await simulateDelay();
        login({ name: name.trim(), email: email.trim() });
      } else {
        await simulateDelay();
        login({ name: email.split("@")[0] || "Builder", email: email.trim(), rememberMe });
      }
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err.message === "NAME_REQUIRED") {
        setLocalError("Please add your name to continue.");
      } else {
        setLocalError("Invalid credentials.");
      }
    }
    setBusy(false);
  };

  const handleProvider = async (provider) => {
    setLocalError(null);
    setBusy(true);
    try {
      await simulateDelay();
      login({
        email: `${provider}@example.com`,
        name: provider === "google" ? "Google User" : "GitHub User",
        provider,
      });
      navigate("/dashboard", { replace: true });
    } catch {
      setLocalError("Provider sign-in failed. Please try again.");
    }
    setBusy(false);
  };

  const inputStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderRadius: "12px",
    border: `1px solid ${palette.inputBorder}`,
    background: palette.inputBg,
    padding: "12px 16px",
    boxShadow: palette.inputShadow,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        background: palette.background,
        transition: "background 0.3s ease",
      }}
    >
      <section
        style={{
          flex: 1,
          padding: isMobile ? "32px 24px 48px" : "64px",
          maxWidth: isMobile ? "100%" : "520px",
          margin: isMobile ? "0 auto" : "0",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          justifyContent: "center",
        }}
      >
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#ffffff",
                fontWeight: 700,
                display: "grid",
                placeItems: "center",
              }}
            >
              SS
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: palette.textPrimary }}>Serverless SaaS</p>
              <span style={{ fontSize: "0.85rem", color: palette.textSecondary }}>Build in minutes, not months</span>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "999px",
              border: isDark ? "1px solid rgba(148,163,184,0.35)" : "1px solid rgba(148,163,184,0.25)",
              background: isDark ? "rgba(15,23,42,0.65)" : "#ffffff",
              color: palette.textPrimary,
              cursor: "pointer",
              boxShadow: isDark ? "0 12px 30px rgba(15,23,42,0.45)" : "0 12px 30px rgba(15,23,42,0.08)",
            }}
          >
            {isDark ? <SunIcon isDark={isDark} /> : <MoonIcon isDark={isDark} />}
            {isDark ? "Light" : "Dark"} mode
          </button>
        </header>

        <main style={{ display: "grid", gap: "24px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "2rem", color: palette.textPrimary }}>
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p style={{ marginTop: "12px", color: palette.textSecondary, lineHeight: 1.6 }}>
              {isSignUp
                ? "Spin up production-ready SaaS foundations with auth, database, UI kit, and deploy pipelines already wired."
                : "Enter your workspace to iterate on modules, collaborate with your team, and launch to production in minutes."}
            </p>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            <button
              type="button"
              onClick={() => handleProvider("google")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                borderRadius: "12px",
                border: "1px solid rgba(148,163,184,0.35)",
                background: "#ffffff",
                padding: "12px 16px",
                cursor: "pointer",
                boxShadow: isDark ? "none" : "0 10px 30px rgba(15,23,42,0.08)",
              }}
            >
              <GoogleGlyph />
              <span style={{ fontWeight: 500, color: "#0f172a" }}>Continue with Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleProvider("github")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                borderRadius: "12px",
                border: "1px solid rgba(15,23,42,0.5)",
                background: isDark ? "#1f2937" : "#0f172a",
                padding: "12px 16px",
                cursor: "pointer",
                color: "#ffffff",
              }}
            >
              <GitHubGlyph />
              <span style={{ fontWeight: 500 }}>Continue with GitHub</span>
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ flex: 1, height: "1px", background: palette.divider }} />
            <span style={{ fontSize: "0.85rem", color: palette.textSecondary }}>Or continue with email</span>
            <span style={{ flex: 1, height: "1px", background: palette.divider }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
            {isSignUp && (
              <label style={inputStyle}>
                <UserIcon color={palette.textSecondary} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: palette.textPrimary,
                    fontSize: "0.95rem",
                  }}
                  autoComplete="name"
                  required
                  disabled={busy}
                />
              </label>
            )}

            <label style={inputStyle}>
              <MailIcon color={palette.textSecondary} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: palette.textPrimary,
                  fontSize: "0.95rem",
                }}
                autoComplete="email"
                required
                disabled={busy}
              />
            </label>

            <label style={inputStyle}>
              <LockIcon color={palette.textSecondary} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: palette.textPrimary,
                  fontSize: "0.95rem",
                }}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                minLength={4}
                required
                disabled={busy}
              />
            </label>

            {!isSignUp && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", color: palette.textSecondary, fontSize: "0.85rem" }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: "16px", height: "16px" }}
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  style={{
                    border: "none",
                    background: "none",
                    color: "#2563eb",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {localError && (
              <div style={{ color: "#ef4444", fontSize: "0.85rem" }}>{localError}</div>
            )}

            <button
              type="submit"
              disabled={busy}
              style={{
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                background: palette.buttonGradient,
                color: "#ffffff",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: busy ? "not-allowed" : "pointer",
                opacity: busy ? 0.7 : 1,
                boxShadow: "0 18px 40px rgba(59,130,246,0.35)",
              }}
            >
              {busy ? "Processing..." : isSignUp ? "Create account" : "Sign in"}
            </button>
          </form>

          <div style={{ fontSize: "0.9rem", color: palette.textSecondary }}>
            {isSignUp ? "Already have an account?" : "New to Serverless SaaS?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp((prev) => !prev);
                setLocalError(null);
              }}
              style={{
                border: "none",
                background: "none",
                color: "#2563eb",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {isSignUp ? "Sign in" : "Create one"}
            </button>
          </div>
        </main>
      </section>

      {!isMobile && (
        <aside
          style={{
            flex: 1,
            padding: "80px 64px",
            display: "grid",
            gap: "32px",
            color: "#ffffff",
            background: palette.showcaseGradient,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-120px",
              right: "-120px",
              width: "320px",
              height: "320px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(96,165,250,0.3), transparent 70%)",
              filter: "blur(4px)",
              animation: "pulse 7s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-160px",
              left: "-140px",
              width: "420px",
              height: "420px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(156,163,255,0.28), transparent 70%)",
              filter: "blur(6px)",
              animation: "pulse 8s ease-in-out infinite",
              animationDelay: "1.2s",
            }}
          />

          <div style={{ position: "relative", zIndex: 1, display: "grid", gap: "18px" }}>
            <span
              style={{
                alignSelf: "flex-start",
                background: palette.badgeBg,
                color: palette.badgeText,
                padding: "8px 16px",
                borderRadius: "999px",
                fontSize: "0.8rem",
                letterSpacing: "0.04em",
                fontWeight: 600,
              }}
            >
              Build in minutes, not months
            </span>
            <h2 style={{ margin: 0, fontSize: "2.6rem", lineHeight: 1.15 }}>
              Your SaaS.{" "}
              <span style={{ background: "linear-gradient(135deg,#60a5fa,#a855f7)", WebkitBackgroundClip: "text", color: "transparent" }}>
                In 5 minutes.
              </span>
            </h2>
            <p style={{ color: "rgba(226,232,240,0.78)", lineHeight: 1.6 }}>
              Select a blueprint, plug in modules like auth, billing, and UI kits, then deploy to the edge with observability baked in.
            </p>
          </div>

          <div style={{ display: "grid", gap: "16px", position: "relative", zIndex: 1 }}>
            {featureCards.map((feature, index) => {
              const isActive = index === activeFeatureIndex;
              return (
                <div
                  key={feature.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "18px 20px",
                    borderRadius: "18px",
                    border: isActive ? "1px solid rgba(59,130,246,0.5)" : "1px solid rgba(148,163,184,0.25)",
                    background: isActive ? "rgba(59,130,246,0.2)" : "rgba(15,23,42,0.35)",
                    transform: isActive ? "scale(1.05)" : "scale(1)",
                    transition: "all 0.4s ease",
                    boxShadow: isActive ? "0 22px 40px rgba(59,130,246,0.35)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "13px",
                      background: "rgba(59,130,246,0.18)",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <feature.icon color="#bfdbfe" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: "#e2e8f0" }}>{feature.title}</p>
                    <span style={{ fontSize: "0.85rem", color: "rgba(226,232,240,0.75)" }}>{feature.description}</span>
                  </div>
                </div>
              );
            })}
          </div>

  *** End Patch
*** End Patch
```
          <div style={{ display: "grid", gap: "18px", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", gap: "16px" }}>
              {exampleApps.map((app, idx) => (
                <div
                  key={app.name}
                  style={{
                    flex: 1,
                    borderRadius: "18px",
                    padding: "18px",
                    background:
                      idx === 0
                        ? "linear-gradient(135deg, rgba(99,102,241,0.85), rgba(56,189,248,0.9))"
                        : idx === 1
                        ? "linear-gradient(135deg, rgba(244,114,182,0.9), rgba(99,102,241,0.85))"
                        : "linear-gradient(135deg, rgba(34,197,94,0.85), rgba(14,165,233,0.75))",
                    color: "#ffffff",
                    boxShadow: "0 20px 36px rgba(15,23,42,0.35)",
                  }}
                >
                  <p style={{ margin: "0 0 6px", fontWeight: 600 }}>{app.name}</p>
                  <span style={{ fontSize: "0.8rem", opacity: 0.85 }}>{app.description}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "18px",
                borderRadius: "18px",
                padding: "20px",
                background: "rgba(15,23,42,0.5)",
                border: "1px solid rgba(148,163,184,0.25)",
              }}
            >
              {[
                { value: "1,247", label: "Apps deployed" },
                { value: "98%", label: "Uptime SLA" },
                { value: "5 min", label: "Avg setup time" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700 }}>{stat.value}</p>
                  <span style={{ fontSize: "0.8rem", color: "rgba(226,232,240,0.75)" }}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
