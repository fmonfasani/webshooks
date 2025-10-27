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

export type ChatRole = 'user' | 'system';

export type ChatMessage = {
  id: ID;
  role: ChatRole;
  content: string;
  timestamp: string; // ISO8601
};

