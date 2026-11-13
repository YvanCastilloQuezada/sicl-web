/**
 * Cálculo de carbono incorporado (A1-A5) según EN 15978.
 *
 * A1-A3: producto (extracción + manufactura) = Σ (quantity_kg × GWP_kgCO2e_per_kg)
 * A4-A5: construcción (transporte + instalación) = A1-A3 × 5% (regla aproximada RICS)
 *
 * Referencia: RICS WLCA 2023, EN 15978:2011.
 */

import type { CarbonFactor, MaterialQuantity, EmbodiedCarbonResult } from "./types";
import { CARBON_FACTORS, DEFAULT_TRANSPORT_DISTANCE_KM, TRANSPORT_FACTOR_KGCO2E_PER_KG_KM } from "./carbonFactors";

/**
 * Calcula el carbono incorporado de un conjunto de materiales.
 *
 * @param quantities - Cantidades de material (materialId + kg).
 * @param factors - Mapa de factores de carbono (por defecto CARBON_FACTORS).
 * @param area_m2 - Área construida (opcional, para calcular kgCO2e/m2).
 * @param transportDistance_km - Distancia de transporte (por defecto 100 km).
 * @returns Resultado con A1-A3, A4-A5, total, y kgCO2e/m2.
 */
export function calculateEmbodiedCarbon(
  quantities: MaterialQuantity[],
  factors: Map<string, CarbonFactor> = CARBON_FACTORS,
  area_m2?: number,
  transportDistance_km: number = DEFAULT_TRANSPORT_DISTANCE_KM,
): EmbodiedCarbonResult {
  let a1a3 = 0;
  const unknownMaterials: string[] = [];

  for (const q of quantities) {
    const factor = factors.get(q.materialId);
    if (!factor) {
      unknownMaterials.push(q.materialId);
      continue;
    }
    a1a3 += q.quantity_kg * factor.gwp_kgco2e_per_kg;
  }

  // A4-A5: transporte + instalación (5% de A1-A3, regla RICS aproximada).
  // Más preciso: Σ (quantity_kg × transportDistance_km × TRANSPORT_FACTOR) + 2% instalación.
  let a4a5 = 0;
  for (const q of quantities) {
    a4a5 += q.quantity_kg * transportDistance_km * TRANSPORT_FACTOR_KGCO2E_PER_KG_KM;
  }
  a4a5 += a1a3 * 0.02; // Instalación 2%

  const total = a1a3 + a4a5;

  const result: EmbodiedCarbonResult = {
    a1a3_kgco2e: a1a3,
    a4a5_kgco2e: a4a5,
    total_kgco2e: total,
    unknownMaterials,
  };

  if (area_m2 !== undefined && area_m2 > 0) {
    result.kgco2e_per_m2 = total / area_m2;
  }

  return result;
}
