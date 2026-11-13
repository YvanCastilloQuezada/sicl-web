/**
 * Score Net Zero contra benchmarks LETI 2020 y RIBA 2030.
 *
 * Referencia:
 * - LETI Climate Emergency Design Guide (2020): A1-A5 < 350 kgCO2e/m2.
 * - RIBA 2030 Climate Challenge v3 (2021): A1-A5 < 750 (2025), < 625 (2030).
 */

import type { NetZeroScore } from "./types";
import { BENCHMARKS } from "./types";

/**
 * Calcula el score Net Zero de un proyecto.
 *
 * @param value_kgco2e_per_m2 - Carbono incorporado (A1-A5) por m2.
 * @returns Score contra LETI 2020, RIBA 2025, y RIBA 2030.
 */
export function netZeroScore(value_kgco2e_per_m2: number): NetZeroScore {
  const leti = BENCHMARKS.find((b) => b.id === "LETI-2020")!;
  const riba2025 = BENCHMARKS.find((b) => b.id === "RIBA-2025")!;
  const riba2030 = BENCHMARKS.find((b) => b.id === "RIBA-2030")!;

  const letiScore = scoreAgainst(value_kgco2e_per_m2, leti.threshold_kgco2e_per_m2);
  const riba2025Score = scoreAgainst(value_kgco2e_per_m2, riba2025.threshold_kgco2e_per_m2);
  const riba2030Score = scoreAgainst(value_kgco2e_per_m2, riba2030.threshold_kgco2e_per_m2);

  // Overall: el más estricto (LETI 2020).
  const overall = letiScore;

  return {
    leti2020: letiScore,
    riba2030: riba2030Score,
    overall,
    value_kgco2e_per_m2,
    benchmarks: [leti.id, riba2025.id, riba2030.id],
  };
}

function scoreAgainst(value: number, threshold: number): "PASS" | "PARTIAL" | "FAIL" {
  if (value <= threshold) return "PASS";
  if (value <= threshold * 1.2) return "PARTIAL";
  return "FAIL";
}
