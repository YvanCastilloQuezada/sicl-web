/**
 * ARKI — Ranking por mérito.
 *
 * Ordena los candidatos por una puntuación ponderada de eficiencia,
 * coste, capacidad, cumplimiento, energía, agua, carbono y estructura.
 *
 * El ranking NO elige el ganador. Solo ordena.
 * La decisión final es humana.
 */

import type { DesignCandidate } from "../../../shared/arkiDesignFunnel";

export type RankingCriteria = {
  efficiency: number;
  cost: number;
  capacity: number;
  compliance: number;
  energy: number;
  water: number;
  carbon: number;
  structural: number;
};

export type RankingResult = {
  ranked: DesignCandidate[];
  scores: Record<string, number>;
  criteria: RankingCriteria;
};

const DEFAULT_CRITERIA: RankingCriteria = {
  efficiency: 0.20,
  cost: 0.20,
  capacity: 0.15,
  compliance: 0.15,
  energy: 0.10,
  water: 0.05,
  carbon: 0.10,
  structural: 0.05,
};

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return (value - min) / (max - min);
}

function scoreCandidate(candidate: DesignCandidate, criteria: RankingCriteria, ranges: Record<string, { min: number; max: number }>): number {
  const metrics = candidate.metrics as any;
  const efficiency = normalize(metrics.efficiencyRatio ?? 0, ranges.efficiency.min, ranges.efficiency.max);
  const cost = 1 - normalize(metrics.costPerM2 ?? 0, ranges.cost.min, ranges.cost.max);
  const capacity = normalize(metrics.capacityPerM2 ?? 0, ranges.capacity.min, ranges.capacity.max);
  const compliance = metrics.complianceScore ?? 0;
  const energy = 1 - normalize(metrics.energyUseIntensity ?? 0, ranges.energy.min, ranges.energy.max);
  const water = 1 - normalize(metrics.waterUseIntensity ?? 0, ranges.water.min, ranges.water.max);
  const carbon = 1 - normalize(metrics.carbonFootprint ?? 0, ranges.carbon.min, ranges.carbon.max);
  const structural = normalize(metrics.structuralEfficiency ?? 0, ranges.structural.min, ranges.structural.max);

  return (
    efficiency * criteria.efficiency +
    cost * criteria.cost +
    capacity * criteria.capacity +
    compliance * criteria.compliance +
    energy * criteria.energy +
    water * criteria.water +
    carbon * criteria.carbon +
    structural * criteria.structural
  );
}

export function arkiRanking(
  candidates: DesignCandidate[],
  criteria: Partial<RankingCriteria> = {},
  topN?: number,
): RankingResult {
  const finalCriteria = { ...DEFAULT_CRITERIA, ...criteria };
  if (candidates.length === 0) {
    return { ranked: [], scores: {}, criteria: finalCriteria };
  }

  const ranges: Record<string, { min: number; max: number }> = {
    efficiency: { min: Infinity, max: -Infinity },
    cost: { min: Infinity, max: -Infinity },
    capacity: { min: Infinity, max: -Infinity },
    energy: { min: Infinity, max: -Infinity },
    water: { min: Infinity, max: -Infinity },
    carbon: { min: Infinity, max: -Infinity },
    structural: { min: Infinity, max: -Infinity },
  };

  for (const c of candidates) {
    const m = c.metrics as any;
    const update = (key: string, val: number) => {
      if (val < ranges[key].min) ranges[key].min = val;
      if (val > ranges[key].max) ranges[key].max = val;
    };
    update("efficiency", m.efficiencyRatio ?? 0);
    update("cost", m.costPerM2 ?? 0);
    update("capacity", m.capacityPerM2 ?? 0);
    update("energy", m.energyUseIntensity ?? 0);
    update("water", m.waterUseIntensity ?? 0);
    update("carbon", m.carbonFootprint ?? 0);
    update("structural", m.structuralEfficiency ?? 0);
  }

  const scored = candidates.map((c) => ({
    candidate: c,
    score: scoreCandidate(c, finalCriteria, ranges),
  }));

  scored.sort((a, b) => b.score - a.score);

  const limited = topN ? scored.slice(0, topN) : scored;
  const ranked = limited.map((s) => s.candidate);
  const scores: Record<string, number> = {};
  for (const s of limited) {
    scores[s.candidate.id] = Number(s.score.toFixed(4));
  }

  return { ranked, scores, criteria: finalCriteria };
}
