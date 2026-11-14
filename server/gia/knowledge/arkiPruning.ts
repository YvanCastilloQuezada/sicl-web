/**
 * Poda de ARKI: de los supervivientes del screening, selecciona los N mejores
 * para el Funnel (1/4/9/16/25).
 *
 * Criterio de diversidad (en orden de prioridad):
 * 1. variantId (tipología arquitectónica real, ej. "HOSPITAL-GENERAL", "CLINIC")
 * 2. shapeType (forma: "COURTYARD", "L_SHAPE", "U_SHAPE", "LINEAR")
 * 3. floors (escala: bajo, medio, alto)
 * 4. strategy (eje de exploración: PARAMETRIC, TIPOLOGIC, EVOLUTIONARY) — solo como último recurso
 *
 * La poda preserva diversidad. No elige el "mejor" absoluto.
 * Esa decisión es del humano en el Funnel.
 */

import type { DesignCandidate } from "../../../shared/arkiDesignFunnel";

export type PruningResult = {
  pruned: DesignCandidate[];
  prunedOut: DesignCandidate[];
  criteria: {
    totalBefore: number;
    totalAfter: number;
    byStrategy: Record<string, number>;
    byDiversityKey: Record<string, number>;
  };
};

function diversityKey(candidate: DesignCandidate): string {
  // 1. variantId (si existe) — la diversidad arquitectónica real
  if (candidate.variantId) return `variant:${candidate.variantId}`;
  // 2. shapeType (si existe) — la forma
  if (candidate.shapeType) return `shape:${candidate.shapeType}`;
  // 3. floors (si existe) — la escala (agrupada en buckets)
  if (typeof candidate.floors === "number") {
    const bucket = candidate.floors <= 3 ? "low" : candidate.floors <= 8 ? "mid" : "high";
    return `floors:${bucket}`;
  }
  // 4. Fallback: strategy (eje) — el bug anterior
  return `strategy:${candidate.strategy || "UNKNOWN"}`;
}

export function arkiPruning(
  survivors: DesignCandidate[],
  funnelCount: number,
): PruningResult {
  if (survivors.length <= funnelCount) {
    return {
      pruned: survivors,
      prunedOut: [],
      criteria: {
        totalBefore: survivors.length,
        totalAfter: survivors.length,
        byStrategy: groupByStrategy(survivors),
        byDiversityKey: groupByDiversityKey(survivors),
      },
    };
  }

  // Agrupar por diversidad real
  const groups = new Map<string, DesignCandidate[]>();
  for (const candidate of survivors) {
    const key = diversityKey(candidate);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(candidate);
  }

  // Round-robin: tomar uno de cada grupo hasta llegar a funnelCount
  const pruned: DesignCandidate[] = [];
  const prunedOut: DesignCandidate[] = [];
  const groupEntries = Array.from(groups.entries());
  let round = 0;

  while (pruned.length < funnelCount) {
    let addedThisRound = 0;
    for (const [, candidates] of groupEntries) {
      if (pruned.length >= funnelCount) break;
      if (round < candidates.length) {
        pruned.push(candidates[round]);
        addedThisRound++;
      }
    }
    if (addedThisRound === 0) break;
    round++;
  }

  // Los que no entraron en la poda
  const prunedIds = new Set(pruned.map((c) => c.id));
  for (const candidate of survivors) {
    if (!prunedIds.has(candidate.id)) {
      prunedOut.push(candidate);
    }
  }

  return {
    pruned,
    prunedOut,
    criteria: {
      totalBefore: survivors.length,
      totalAfter: pruned.length,
      byStrategy: groupByStrategy(pruned),
      byDiversityKey: groupByDiversityKey(pruned),
    },
  };
}

function groupByStrategy(candidates: DesignCandidate[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const c of candidates) {
    const key = c.strategy || "UNKNOWN";
    result[key] = (result[key] ?? 0) + 1;
  }
  return result;
}

function groupByDiversityKey(candidates: DesignCandidate[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const c of candidates) {
    const key = diversityKey(c);
    result[key] = (result[key] ?? 0) + 1;
  }
  return result;
}
