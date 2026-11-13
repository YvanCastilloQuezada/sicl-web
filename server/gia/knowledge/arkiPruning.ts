/**
 * Poda de ARKI: de los supervivientes del screening, selecciona los N mejores
 * para el Funnel (25/16/9/4/1).
 *
 * Criterio de poda:
 * 1. Diversidad de tipología (variantId).
 * 2. Diversidad de escalas (floors).
 * 3. Diversidad de métricas (área, costo, capacidad).
 *
 * La poda preserva la diversidad. No elige el "mejor" absoluto.
 * Eso es decisión del humano en el Funnel.
 */

import type { DesignCandidate } from "../../../shared/arkiDesignFunnel";

export type PruningResult = {
  pruned: DesignCandidate[];
  prunedOut: DesignCandidate[];
  criteria: {
    totalBefore: number;
    totalAfter: number;
    byStrategy: Record<string, number>;
  };
};

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
      },
    };
  }

  // Estrategia de poda: round-robin por tipología
  // Agrupar por strategy (variantId o axis)
  const groups = new Map<string, DesignCandidate[]>();
  for (const candidate of survivors) {
    const key = candidate.strategy || "UNKNOWN";
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
