export type HistogramBucket = { le: number; count: number };

const counters: Record<string, number> = { feature_events_total: 0, feature_errors_total: 0 };
const histogram: { name: string; buckets: HistogramBucket[] } = {
  name: 'feature_latency_ms',
  buckets: [ { le: 5, count: 0 }, { le: 10, count: 0 }, { le: 50, count: 0 }, { le: 100, count: 0 }, { le: 250, count: 0 }, { le: 500, count: 0 }, { le: 1000, count: 0 }, { le: Infinity, count: 0 } ],
};

export function incCounter(name: keyof typeof counters, value = 1) { counters[name] += value; }
export function getCounter(name: keyof typeof counters) { return counters[name]; }
export function observeLatencyMs(durationMs: number) {
  for (const b of histogram.buckets) { if (durationMs <= b.le) { b.count += 1; break; } }
}
export function readHistogram() { return { ...histogram, buckets: histogram.buckets.map(b => ({ ...b })) }; }

