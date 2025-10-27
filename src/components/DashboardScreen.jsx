import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const LockIcon = ({ color = "#1d4ed8" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const DatabaseIcon = ({ color = "#0f766e" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v6c0 1.6 4 3 9 3s9-1.4 9-3V5" />
    <path d="M3 11v6c0 1.6 4 3 9 3s9-1.4 9-3v-6" />
  </svg>
);

const LayoutIcon = ({ color = "#7c3aed" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M3 9h18" />
    <path d="M12 9v12" />
  </svg>
);

const CodeIcon = ({ color = "#f97316" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const EyeIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ChevronRight = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const moduleCatalog = [
  {
    key: "authentication",
    title: "Authentication",
    description: "Email/Password, OAuth providers, and passwordless flows",
    icon: LockIcon,
    options: ["Email/Password", "OAuth", "Magic Link"],
  },
  {
    key: "database",
    title: "Database",
    description: "Choose your managed store with migrations ready",
    icon: DatabaseIcon,
    options: ["PostgreSQL", "MongoDB", "Supabase"],
  },
  {
    key: "ui",
    title: "UI Kit",
    description: "Responsive dashboards, forms, tables, and UI primitives",
    icon: LayoutIcon,
    options: ["Dashboard", "Forms", "Tables"],
  },
  {
    key: "api",
    title: "API Generator",
    description: "Create REST, GraphQL, or realtime endpoints in minutes",
    icon: CodeIcon,
    options: ["REST", "GraphQL", "WebSockets"],
  },
];

const starterProjects = [
  {
    id: "PROJ-1024",
    name: "Launch Control",
    status: "ACTIVE",
    lastDeployDays: 3,
    modules: {
      authentication: { enabled: true, options: ["Email/Password", "OAuth"] },
      database: { enabled: true, options: ["PostgreSQL"] },
      ui: { enabled: true, options: ["Dashboard", "Forms"] },
      api: { enabled: true, options: ["REST"] },
    },
  },
  {
    id: "PROJ-2048",
    name: "Insight Hub",
    status: "ACTIVE",
    lastDeployDays: 7,
    modules: {
      authentication: { enabled: true, options: ["Email/Password"] },
      database: { enabled: true, options: ["Supabase"] },
      ui: { enabled: true, options: ["Dashboard"] },
      api: { enabled: false, options: [] },
    },
  },
  {
    id: "PROJ-3056",
    name: "Creator Studio",
    status: "ACTIVE",
    lastDeployDays: 12,
    modules: {
      authentication: { enabled: true, options: ["Magic Link"] },
      database: { enabled: true, options: ["MongoDB"] },
      ui: { enabled: true, options: ["Dashboard", "Tables"] },
      api: { enabled: true, options: ["GraphQL"] },
    },
  },
];

const paletteForTheme = (isDark) => ({
  background: isDark
    ? "linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)"
    : "linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f3f4f6 100%)",
  cardBackground: isDark ? "rgba(30,41,59,0.75)" : "#ffffff",
  cardBorder: isDark ? "1px solid rgba(71,85,105,0.6)" : "1px solid rgba(203,213,225,1)",
  cardShadow: isDark ? "0 10px 40px rgba(15,23,42,0.45)" : "0 18px 40px rgba(15,23,42,0.08)",
  textPrimary: isDark ? "#f8fafc" : "#0f172a",
  textSecondary: isDark ? "#94a3b8" : "#4b5563",
  inputBackground: isDark ? "#0f172a" : "#ffffff",
  inputBorder: isDark ? "1px solid rgba(71,85,105,0.7)" : "1px solid rgba(203,213,225,1)",
  modalBackground: isDark ? "#0f172a" : "#ffffff",
  modalBorder: isDark ? "1px solid rgba(71,85,105,0.7)" : "1px solid rgba(226,232,240,1)",
  overlay: isDark ? "rgba(2,6,23,0.7)" : "rgba(15,23,42,0.4)",
  navBackground: isDark ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.9)",
  activeModuleBackground: isDark ? "rgba(59,130,246,0.15)" : "#e0f2ff",
  inactiveModuleBackground: isDark ? "rgba(30,41,59,0.7)" : "#f8fafc",
});

const ModuleModal = ({ palette, draft, onToggleModule, onToggleOption, onClose, onSave }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: palette.overlay,
      backdropFilter: "blur(6px)",
      display: "grid",
      placeItems: "center",
      padding: "24px",
      zIndex: 50,
    }}
  >
    <div
      style={{
        width: "min(720px, 96vw)",
        maxHeight: "90vh",
        overflowY: "auto",
        borderRadius: "24px",
        background: palette.modalBackground,
        border: palette.modalBorder,
        padding: "32px",
        display: "grid",
        gap: "24px",
        color: palette.textPrimary,
        boxShadow: "0 24px 60px rgba(15,23,42,0.28)",
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.35rem" }}>Add Modules</h3>
          <p style={{ margin: 0, marginTop: "6px", color: palette.textSecondary }}>
            Configure your app features and scaffolding in a few clicks.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            border: palette.inputBorder,
            background: palette.inputBackground,
            color: palette.textSecondary,
            fontSize: "1.2rem",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          x
        </button>
      </header>

      <div style={{ display: "grid", gap: "18px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {moduleCatalog.map((module) => {
          const moduleState = draft[module.key] || { enabled: false, options: [] };
          const Icon = module.icon;
          return (
            <div
              key={module.key}
              style={{
                border: moduleState.enabled ? "1px solid rgba(59,130,246,0.6)" : palette.inputBorder,
                background: moduleState.enabled ? palette.activeModuleBackground : palette.inactiveModuleBackground,
                borderRadius: "18px",
                padding: "20px",
                display: "grid",
                gap: "12px",
                transition: "all 0.3s ease",
              }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <input
                  type="checkbox"
                  checked={moduleState.enabled}
                  onChange={() => onToggleModule(module.key)}
                  style={{ width: "18px", height: "18px" }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "12px",
                      background: "rgba(59,130,246,0.12)",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <Icon color={moduleState.enabled ? "#2563eb" : palette.textSecondary} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: palette.textPrimary }}>{module.title}</p>
                    <span style={{ fontSize: "0.8rem", color: palette.textSecondary }}>{module.description}</span>
                  </div>
                </div>
              </label>

              <div style={{ display: "grid", gap: "8px", marginLeft: "28px" }}>
                {module.options.map((option) => (
                  <label key={option} style={{ display: "flex", gap: "10px", fontSize: "0.85rem", color: palette.textSecondary }}>
                    <input
                      type="checkbox"
                      checked={moduleState.options.includes(option)}
                      onChange={() => onToggleOption(module.key, option)}
                      disabled={!moduleState.enabled}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <footer style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: "10px 18px",
            borderRadius: "12px",
            border: palette.inputBorder,
            background: palette.inputBackground,
            color: palette.textSecondary,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          style={{
            padding: "10px 22px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            color: "#ffffff",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 18px 40px rgba(59,130,246,0.35)",
          }}
        >
          Save configuration
        </button>
      </footer>
    </div>
  </div>
);

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [projects, setProjects] = useState(starterProjects);
  const [projectName, setProjectName] = useState("");
  const [modalState, setModalState] = useState({ open: false, projectId: null, draft: {} });

  const palette = useMemo(() => paletteForTheme(isDark), [isDark]);

  const createProject = () => {
    if (!projectName.trim()) return;
    const idSuffix = Math.floor(Math.random() * 9000 + 1000);
    const newProject = {
      id: `PROJ-${idSuffix}`,
      name: projectName.trim(),
      status: "ACTIVE",
      lastDeployDays: 0,
      modules: {
        authentication: { enabled: true, options: ["Email/Password"] },
        database: { enabled: false, options: [] },
        ui: { enabled: false, options: [] },
        api: { enabled: false, options: [] },
      },
    };
    setProjects((prev) => [newProject, ...prev]);
    setProjectName("");
  };

  const openModuleModal = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    setModalState({
      open: true,
      projectId,
      draft: JSON.parse(JSON.stringify(project.modules)),
    });
  };

  const closeModal = () => setModalState({ open: false, projectId: null, draft: {} });

  const toggleModule = (key) => {
    setModalState((prev) => ({
      ...prev,
      draft: {
        ...prev.draft,
        [key]: {
          enabled: !prev.draft[key]?.enabled,
          options: prev.draft[key]?.enabled ? [] : prev.draft[key]?.options || [],
        },
      },
    }));
  };

  const toggleModuleOption = (key, option) => {
    setModalState((prev) => {
      const moduleState = prev.draft[key] || { enabled: false, options: [] };
      const options = moduleState.options.includes(option)
        ? moduleState.options.filter((item) => item !== option)
        : [...moduleState.options, option];
      return {
        ...prev,
        draft: {
          ...prev.draft,
          [key]: {
            ...moduleState,
            options,
          },
        },
      };
    });
  };

  const saveModules = () => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === modalState.projectId
          ? {
              ...project,
              modules: modalState.draft,
            }
          : project,
      ),
    );
    closeModal();
  };

  const signOutAndRedirect = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: palette.background,
        color: palette.textPrimary,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(16px)",
          background: palette.navBackground,
          borderBottom: palette.inputBorder,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "20px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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
            <nav style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <span style={{ fontWeight: 600, color: palette.textPrimary }}>Serverless SaaS</span>
              <a href="#" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
                Dashboard
              </a>
              <a href="#" style={{ color: palette.textSecondary, textDecoration: "none" }}>
                Builder
              </a>
            </nav>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              type="button"
              onClick={toggleTheme}
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                border: palette.inputBorder,
                background: palette.inputBackground,
                color: palette.textPrimary,
                cursor: "pointer",
              }}
            >
              {isDark ? "Light" : "Dark"} mode
            </button>
            <button
              type="button"
              onClick={signOutAndRedirect}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg,#ef4444,#f97316)",
                color: "#ffffff",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 18px 35px rgba(239,68,68,0.35)",
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "48px 32px", display: "grid", gap: "32px" }}>
        <section>
          <h1 style={{ margin: 0, fontSize: "2.2rem" }}>Welcome back{user?.name ? `, ${user.name}` : ""}</h1>
          <p style={{ marginTop: "10px", color: palette.textSecondary }}>
            Build, iterate, and launch your SaaS in minutes with pre-wired auth, data, UI, and deploy pipelines.
          </p>
        </section>

        <section
          style={{
            borderRadius: "20px",
            border: palette.cardBorder,
            background: palette.cardBackground,
            boxShadow: palette.cardShadow,
            padding: "24px",
            display: "grid",
            gap: "18px",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Create a new project</h2>
              <p style={{ margin: 0, marginTop: "6px", color: palette.textSecondary }}>
                Name your experience and start wiring modules instantly.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project name"
              style={{
                flex: "1 1 260px",
                padding: "12px 16px",
                borderRadius: "12px",
                border: palette.inputBorder,
                background: palette.inputBackground,
                color: palette.textPrimary,
                outline: "none",
                fontSize: "0.95rem",
              }}
            />
            <button
              type="button"
              onClick={createProject}
              style={{
                padding: "12px 22px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                color: "#ffffff",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 18px 40px rgba(59,130,246,0.35)",
              }}
            >
              Create project
            </button>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {projects.map((project) => (
            <article
              key={project.id}
              style={{
                borderRadius: "20px",
                border: palette.cardBorder,
                background: palette.cardBackground,
                boxShadow: palette.cardShadow,
                padding: "24px",
                display: "grid",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <div>
                  <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>{project.name}</p>
                  <span style={{ fontSize: "0.8rem", color: palette.textSecondary }}>{project.id}</span>
                </div>
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: "999px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: isDark ? "#86efac" : "#15803d",
                    background: isDark ? "rgba(34,197,94,0.18)" : "#dcfce7",
                  }}
                >
                  {project.status}
                </span>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {project.modules.authentication?.enabled && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 12px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))",
                      color: palette.textPrimary,
                    }}
                  >
                    <LockIcon color="#2563eb" /> Auth
                  </span>
                )}
                {project.modules.database?.enabled && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 12px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))",
                      color: palette.textPrimary,
                    }}
                  >
                    <DatabaseIcon color="#059669" /> Database
                  </span>
                )}
                {project.modules.ui?.enabled && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 12px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.08))",
                      color: palette.textPrimary,
                    }}
                  >
                    <LayoutIcon color="#9333ea" /> UI Kit
                  </span>
                )}
                {project.modules.api?.enabled && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 12px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, rgba(249,115,22,0.18), rgba(249,115,22,0.05))",
                      color: palette.textPrimary,
                    }}
                  >
                    <CodeIcon color="#f97316" /> API
                  </span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: palette.textSecondary, fontSize: "0.85rem" }}>
                <span>Last deploy: {project.lastDeployDays} days ago</span>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => openModuleModal(project.id)}
                    style={{
                      border: palette.inputBorder,
                      background: palette.inputBackground,
                      color: palette.textPrimary,
                      padding: "8px 14px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    Modules <ChevronRight color={palette.textSecondary} />
                  </button>
                  <button
                    type="button"
                    style={{
                      border: palette.inputBorder,
                      background: palette.inputBackground,
                      color: palette.textPrimary,
                      padding: "8px 14px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <EyeIcon color={palette.textSecondary} /> View
                  </button>
                  <button
                    type="button"
                    style={{
                      border: palette.inputBorder,
                      background: palette.inputBackground,
                      color: palette.textPrimary,
                      padding: "8px 14px",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Settings
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>

      {modalState.open && (
        <ModuleModal
          palette={palette}
          draft={modalState.draft}
          onToggleModule={toggleModule}
          onToggleOption={toggleModuleOption}
          onClose={closeModal}
          onSave={saveModules}
        />
      )}
    </div>
  );
}
