export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  timestamp: string; // ISO8601
  feature?: string;
  action: string;
  outcome: 'success' | 'error' | 'start' | 'progress' | 'noop';
  error_code?: string;
  correlation_id?: string;
  [key: string]: unknown;
}

export function logJSON(entry: Omit<LogEntry, 'timestamp'>) {
  const payload = {
    timestamp: new Date().toISOString(),
    ...entry,
  } as LogEntry;
  console.log(JSON.stringify(payload));
}

export function logEvent(action: string, outcome: LogEntry['outcome'], level: LogLevel = 'info', extra?: Record<string, unknown>) {
  logJSON({ level, action, outcome, ...extra });
}

export function logError(action: string, error_code: string, extra?: Record<string, unknown>) {
  logJSON({ level: 'error', action, outcome: 'error', error_code, ...extra });
}
