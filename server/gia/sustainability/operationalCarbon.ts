/**
 * Cálculo de carbono operacional (B6) según EN 15978.
 *
 * B6: energía operacional anual = energía_anual_kWh × intensidad_kgCO2e_per_kWh.
 * Ciclo de vida: 60 años (RICS WLCA 2023).
 *
 * Referencia: RICS WLCA 2023, EN 15978:2011, módulo B6.
 */

import type { OperationalCarbonResult } from "./types";

/** Intensidad de carbono de la red eléctrica de Perú (SEIN), 2023. */
export const PERU_GRID_CARBON_INTENSITY_KGCO2E_PER_KWH = 0.45;

/** Vida útil por defecto (RICS WLCA 2023). */
export const DEFAULT_LIFECYCLE_YEARS = 60;

/**
 * Calcula el carbono operacional anual y de ciclo de vida.
 */
export function calculateOperationalCarbon(
  annualEnergy_kWh: number,
  carbonIntensity_kgco2e_per_kwh: number = PERU_GRID_CARBON_INTENSITY_KGCO2E_PER_KWH,
  lifecycleYears: number = DEFAULT_LIFECYCLE_YEARS,
): OperationalCarbonResult {
  const annual = annualEnergy_kWh * carbonIntensity_kgco2e_per_kwh;
  return {
    annual_energy_kwh: annualEnergy_kWh,
    carbon_intensity_kgco2e_per_kwh: carbonIntensity_kgco2e_per_kwh,
    annual_kgco2e: annual,
    lifecycle_60y_kgco2e: annual * lifecycleYears,
  };
}
