/**
 * Comparación retrofit vs demolición.
 *
 * Lógica:
 * - Carbono de demolición (C1-C4): ~50 kgCO2e/m2.
 * - Carbono de retrofit: ~200 kgCO2e/m2.
 * - Carbono evitado = (existing + demolition + newBuild) − retrofit.
 * - Recomendación: RETROFIT si retrofit < (existing + demolition + newBuild) × 0.6.
 */

import type { ExistingStructure, NewBuild, RetrofitComparison } from "./types";
import {
  RETROFIT_CARBON_PER_M2_KGCO2E,
  DEMOLITION_CARBON_PER_M2_KGCO2E,
  RETROFIT_THRESHOLD_RATIO,
} from "./types";

export function retrofitVsDemolition(
  existing: ExistingStructure,
  newBuild: NewBuild,
): RetrofitComparison {
  const reasons: string[] = [];
  const unknowns: string[] = [];

  // 1. Carbono de demolición (C1-C4)
  const demolitionCarbon = existing.area_m2 * DEMOLITION_CARBON_PER_M2_KGCO2E;
  reasons.push(
    `Demolición: ${existing.area_m2} m2 × ${DEMOLITION_CARBON_PER_M2_KGCO2E} kgCO2e/m2 = ${demolitionCarbon.toFixed(0)} kgCO2e`,
  );

  // 2. Carbono de retrofit
  const retrofitCarbon = existing.area_m2 * RETROFIT_CARBON_PER_M2_KGCO2E;
  reasons.push(
    `Retrofit: ${existing.area_m2} m2 × ${RETROFIT_CARBON_PER_M2_KGCO2E} kgCO2e/m2 = ${retrofitCarbon.toFixed(0)} kgCO2e`,
  );

  // 3. Carbono existente (si falta, UNKNOWN)
  if (existing.embodiedCarbon_existing_kgco2e === undefined) {
    unknowns.push("embodiedCarbon_existing_kgco2e (falta el carbono incorporado del edificio existente)");
  }

  // 4. Carbono nuevo (si falta, UNKNOWN)
  if (newBuild.embodiedCarbon_new_kgco2e === undefined) {
    unknowns.push("embodiedCarbon_new_kgco2e (falta el carbono incorporado de la obra nueva)");
  }

  if (unknowns.length > 0) {
    return {
      demolitionCarbon_kgco2e: demolitionCarbon,
      retrofitCarbon_kgco2e: retrofitCarbon,
      avoidedCarbon_kgco2e: 0,
      recommendation: "UNKNOWN",
      reasons,
      unknowns,
    };
  }

  const existingCarbon = existing.embodiedCarbon_existing_kgco2e!;
  const newBuildCarbon = newBuild.embodiedCarbon_new_kgco2e;

  // 5. Carbono evitado
  const totalIfDemolish = existingCarbon + demolitionCarbon + newBuildCarbon;
  const totalIfRetrofit = retrofitCarbon;
  const avoided = totalIfDemolish - totalIfRetrofit;

  reasons.push(`Si demuele: ${totalIfDemolish.toFixed(0)} kgCO2e (existing + demolition + newBuild)`);
  reasons.push(`Si rehabilita: ${totalIfRetrofit.toFixed(0)} kgCO2e (retrofit)`);
  reasons.push(`Beneficio neto: ${avoided.toFixed(0)} kgCO2e evitados`);

  // 6. Recomendación
  const threshold = totalIfDemolish * RETROFIT_THRESHOLD_RATIO;
  if (totalIfRetrofit < threshold) {
    reasons.push(
      `Retrofit < ${RETROFIT_THRESHOLD_RATIO * 100}% de demoler+construir → RETROFIT`,
    );
    return {
      demolitionCarbon_kgco2e: demolitionCarbon,
      retrofitCarbon_kgco2e: retrofitCarbon,
      avoidedCarbon_kgco2e: avoided,
      recommendation: "RETROFIT",
      reasons,
      unknowns: [],
    };
  }

  reasons.push(
    `Retrofit ≥ ${RETROFIT_THRESHOLD_RATIO * 100}% de demoler+construir → DEMOLISH`,
  );
  return {
    demolitionCarbon_kgco2e: demolitionCarbon,
    retrofitCarbon_kgco2e: retrofitCarbon,
    avoidedCarbon_kgco2e: avoided,
    recommendation: "DEMOLISH",
    reasons,
    unknowns: [],
  };
}
