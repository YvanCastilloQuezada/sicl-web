export const SPATIAL_SCALES = [
  "PROJECT",
  "SECTOR",
  "DISTRICT",
  "CITY",
  "METROPOLITAN_AREA",
  "REGION",
  "MACROREGION",
  "COUNTRY",
] as const;

export type SpatialScale = typeof SPATIAL_SCALES[number];

export type SpatialScope = {
  scale: SpatialScale;
  id: string;
  name: string;
  parentId?: string;
};

export const TEMPORAL_HORIZONS = ["PRESENT", "2030", "2040", "2050"] as const;
export type TemporalHorizon = typeof TEMPORAL_HORIZONS[number];

export type TemporalScope = {
  horizon: TemporalHorizon;
  scenario?: string;
};

export const DEFAULT_SPATIAL_SCOPE: SpatialScope = { scale: "PROJECT", id: "PROJECT", name: "Project" };
export const DEFAULT_TEMPORAL_SCOPE: TemporalScope = { horizon: "PRESENT" };

export function normalizeSpatialScope(value: unknown): SpatialScope | undefined {
  if (!value || typeof value !== "object") return undefined;
  const candidate = value as Record<string, unknown>;
  if (!SPATIAL_SCALES.includes(candidate.scale as SpatialScale)) return undefined;
  if (typeof candidate.id !== "string" || !candidate.id.trim()) return undefined;
  if (typeof candidate.name !== "string" || !candidate.name.trim()) return undefined;
  return { scale: candidate.scale as SpatialScale, id: candidate.id.trim(), name: candidate.name.trim(), ...(typeof candidate.parentId === "string" && candidate.parentId.trim() ? { parentId: candidate.parentId.trim() } : {}) };
}

export function normalizeTemporalScope(value: unknown): TemporalScope | undefined {
  if (!value || typeof value !== "object") return undefined;
  const candidate = value as Record<string, unknown>;
  if (!TEMPORAL_HORIZONS.includes(candidate.horizon as TemporalHorizon)) return undefined;
  return { horizon: candidate.horizon as TemporalHorizon, ...(typeof candidate.scenario === "string" && candidate.scenario.trim() ? { scenario: candidate.scenario.trim() } : {}) };
}
