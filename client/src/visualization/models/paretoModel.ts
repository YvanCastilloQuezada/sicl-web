import { STATUS_COLORS, type ChartStatus } from "../lib/d3Setup";

export type ParetoCoreResponse = {
  pareto_front?: string[];
  dominated?: string[];
  incomplete?: string[];
  alternatives?: Array<Record<string, unknown>>;
  objectives?: string[];
  tradeoffs?: Record<string, unknown>;
  provenance?: string[];
  read_only?: boolean;
};

export type ParetoPoint = {
  id: string;
  x: number | null;
  y: number | null;
  status: ChartStatus;
};

export type ParetoData = {
  points: ParetoPoint[];
  axes: {
    x: { label: string; direction: "MAXIMIZE" | "MINIMIZE" };
    y: { label: string; direction: "MAXIMIZE" | "MINIMIZE" };
  };
  legend: Record<ChartStatus, { label: string; color: string }>;
};

function numeric(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function alternativeId(item: Record<string, unknown>): string | null {
  const value = item.id ?? item.alternative_id ?? item.code;
  return typeof value === "string" ? value : null;
}

function metric(item: Record<string, unknown>, names: string[]): number | null {
  for (const name of names) {
    const value = numeric(item[name]);
    if (value !== null) return value;
    const values = item.values;
    if (values && typeof values === "object") {
      const nested = numeric((values as Record<string, unknown>)[name]);
      if (nested !== null) return nested;
    }
  }
  return null;
}

export function transformParetoData(response: ParetoCoreResponse | null | undefined): ParetoData {
  const source = response ?? {};
  const front = new Set(source.pareto_front ?? []);
  const dominated = new Set(source.dominated ?? []);
  const incomplete = new Set(source.incomplete ?? []);
  const alternatives = source.alternatives ?? [];
  const ids = Array.from(new Set([...Array.from(front), ...Array.from(dominated), ...Array.from(incomplete), ...alternatives.map(alternativeId).filter((id): id is string => Boolean(id))]));
  const points = ids.map((id) => {
    const item = alternatives.find((candidate) => alternativeId(candidate) === id) ?? {};
    const rawStatus = item.raw_pareto_status;
    const status: ChartStatus = rawStatus === "INCOMPLETE" || incomplete.has(id) ? "incomplete" : rawStatus === "NON_DOMINATED" || front.has(id) ? "front" : "dominated";
    return { id, x: metric(item, ["GROSS_MASSING_AREA", "gross_massing_area", "ENERGY_SAVINGS", "energy_savings", "x"]), y: metric(item, ["OPEN_SITE_AREA", "open_site_area", "CONSTRUCTION_COST", "construction_cost", "cost", "y"]), status };
  });
  return {
    points,
    axes: { x: { label: source.objectives?.[0] ?? "ENERGY_SAVINGS", direction: "MAXIMIZE" }, y: { label: source.objectives?.[1] ?? "CONSTRUCTION_COST", direction: source.objectives?.[1] === "OPEN_SITE_AREA" ? "MAXIMIZE" : "MINIMIZE" } },
    legend: {
      front: { label: "No dominados", color: STATUS_COLORS.front },
      dominated: { label: "Dominados", color: STATUS_COLORS.dominated },
      incomplete: { label: "Incompletos", color: STATUS_COLORS.incomplete },
    },
  };
}
