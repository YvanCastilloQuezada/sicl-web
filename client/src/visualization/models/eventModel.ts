export type CoreEvent = {
  id: string;
  type: string;
  timestamp: string | number;
  payload?: unknown;
  actor?: string;
  source?: string;
};

export type TimelineEvent = CoreEvent & {
  x: number;
  y: 0;
  summary: string;
};

export type EventData = {
  events: TimelineEvent[];
  timeRange: { min: number | null; max: number | null };
  legend: Record<string, { label: string; color: string }>;
};

function timestamp(value: string | number): number {
  const parsed = typeof value === "number" ? value : Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function summary(payload: unknown): string {
  if (payload === null || payload === undefined) return "";
  if (typeof payload === "string") return payload;
  try { return JSON.stringify(payload); } catch { return String(payload); }
}

export function transformEventData(response: { events?: CoreEvent[] } | CoreEvent[] | null | undefined): EventData {
  const events = Array.isArray(response) ? response : response?.events ?? [];
  const sorted = events.map((event) => ({ ...event, x: timestamp(event.timestamp), y: 0 as const, summary: summary(event.payload) })).sort((a, b) => a.x - b.x);
  const types = Array.from(new Set(sorted.map((event) => event.type)));
  const palette = ["#385348", "#d07b4a", "#6a7d72", "#8e6b58", "#52645a"];
  const legend = Object.fromEntries(types.map((type, index) => [type, { label: type, color: palette[index % palette.length] }]));
  return { events: sorted, timeRange: { min: sorted[0]?.x ?? null, max: sorted.at(-1)?.x ?? null }, legend };
}
