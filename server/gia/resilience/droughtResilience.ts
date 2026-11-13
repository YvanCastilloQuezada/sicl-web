/**
 * Resiliencia a sequía.
 *
 * Basado en MINSA / SUNASS: captación de lluvia + reúso de aguas grises.
 * - Cobertura > 50% de la demanda → HIGH.
 * - 20-50% → MEDIUM.
 * - < 20% → LOW.
 * - Greywater reuse suma +20%.
 */

import type { WaterSystems, DroughtResilienceResult } from "./types";

export function droughtResilience(water: WaterSystems): DroughtResilienceResult {
  const factors: string[] = [];

  if (water.demand_m3 <= 0) {
    return {
      score: "UNKNOWN",
      coverage_pct: 0,
      factors: ["Demanda de agua desconocida o cero"],
    };
  }

  const rainwaterPct = (water.rainwaterHarvesting_m3 / water.demand_m3) * 100;
  const greywaterPct = water.greywaterReuse ? 20 : 0;
  const coverage = rainwaterPct + greywaterPct;

  factors.push(`Captación de lluvia: ${rainwaterPct.toFixed(1)}% de la demanda`);
  if (water.greywaterReuse) factors.push("Reúso de aguas grises: +20%");

  let score: "LOW" | "MEDIUM" | "HIGH";
  if (coverage > 50) score = "HIGH";
  else if (coverage > 20) score = "MEDIUM";
  else score = "LOW";

  return { score, coverage_pct: coverage, factors };
}
