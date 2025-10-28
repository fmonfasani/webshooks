export type Span = { end: () => void; setTag: (key: string, value: unknown) => void };

export function startSpan(name: string, tags?: Record<string, unknown>): Span {
  const start = performance?.now?.() ?? Date.now();
  const spanTags: Record<string, unknown> = { name, ...(tags || {}) };
  return {
    end: () => {
      const end = performance?.now?.() ?? Date.now();
      const duration = end - start;
      try { const metrics = require('./metrics') as typeof import('./metrics'); metrics.observeLatencyMs(duration); } catch {}
      spanTags.duration_ms = duration;
    },
    setTag: (key: string, value: unknown) => { spanTags[key] = value; },
  };
}

