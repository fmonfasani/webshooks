// src/types/index.ts
export type ID = string;

export type User = {
  id: ID;
  email: string;
};

export type Session = {
  token: string | null;
  user: User | null;
};

export type Project = {
  id: ID;
  name: string;
  updatedAt: string; // ISO8601
};

export type ModuleId =
  | "planning"
  | "design"
  | "build"
  | "integrate"
  | "test"
  | "deploy"
  | "monitor"
  | "collaborate";

export type SubmoduleId = string;

export type Submodule = {
  id: SubmoduleId;
  name: string;
  icon: any; // lucide-react icon
  description?: string;
};

export type Module = {
  id: ModuleId;
  name: string;
  icon: any;
  submodules: Submodule[];
};

export type ProjectProgress = Record<ModuleId, number>; // 0-100

export type ProjectWithModules = Project & {
  progress: ProjectProgress;
  activeModules: string[]; // IDs de módulos habilitados
};

export type ChatRole = "user" | "system";

export type ChatMessage = {
  id: ID;
  role: ChatRole;
  content: string;
  timestamp: string; // ISO8601
};
