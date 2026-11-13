/**
 * Tipos compartidos del motor de sostenibilidad cuantificada.
 *
 * Referencias:
 * - EN 15978:2011 (Sustainability of construction works — Assessment of environmental performance)
 * - RICS Whole Life Carbon Assessment (2nd ed., 2023)
 * - LETI Climate Emergency Design Guide (2020)
 * - RIBA 2030 Climate Challenge (v3, 2021)
 *
 * Módulos EN 15978:
 *   A1-A3: Product stage (materials extraction + manufacturing)
 *   A4-A5: Construction process (transport + installation)
 *   B1-B7: Use stage (use, maintenance, repair, replacement, refurbishment, energy, water)
 *   C1-C4: End of life (deconstruction, transport, waste, disposal)
 *   D:    Benefits beyond system boundary (reuse, recovery, recycling)
 */

/** Factores de carbono por material (kgCO2e por kg de material). */
export type CarbonFactor = {
  /** ID del material (ej. "concrete-c30", "steel-rebar", "glass-double"). */
  id: string;
  /** Nombre legible. */
  name: string;
  /** GWP en kgCO2e/kg. Fuente: ICE Database v3.0, Ökobaudat, EPD específicos. */
  gwp_kgco2e_per_kg: number;
  /** Módulo EN 15978 al que aplica. */
  module: "A1-A3" | "A4-A5" | "B1-B7" | "C1-C4" | "D";
  /** Fuente y fecha del dato. */
  source: string;
};

/** Cantidad de material en un proyecto. */
export type MaterialQuantity = {
  /** ID del material (debe coincidir con CarbonFactor.id). */
  materialId: string;
  /** Cantidad en kg. */
  quantity_kg: number;
};

/** Resultado del cálculo de carbono incorporado. */
export type EmbodiedCarbonResult = {
  /** Carbono del módulo A1-A3 (producto) en kgCO2e. */
  a1a3_kgco2e: number;
  /** Carbono del módulo A4-A5 (construcción) en kgCO2e. */
  a4a5_kgco2e: number;
  /** Carbono total de A1-A5 en kgCO2e. */
  total_kgco2e: number;
  /** Carbono por m2 (si se provee área). */
  kgco2e_per_m2?: number;
  /** Materiales sin factor conocido. */
  unknownMaterials: string[];
};

/** Resultado del cálculo de carbono operacional. */
export type OperationalCarbonResult = {
  /** Energía anual en kWh. */
  annual_energy_kwh: number;
  /** Intensidad de carbono de la red (kgCO2e/kWh). */
  carbon_intensity_kgco2e_per_kwh: number;
  /** Carbono operacional anual en kgCO2e. */
  annual_kgco2e: number;
  /** Carbono operacional en 60 años (vida útil RICS) en kgCO2e. */
  lifecycle_60y_kgco2e: number;
};

/** Score Net Zero contra benchmarks. */
export type NetZeroScore = {
  /** Score contra LETI 2020 (A1-A5 < 350 kgCO2e/m2). */
  leti2020: "PASS" | "PARTIAL" | "FAIL" | "UNKNOWN";
  /** Score contra RIBA 2030 (A1-A5 < 750 en 2025, < 625 en 2030). */
  riba2030: "PASS" | "PARTIAL" | "FAIL" | "UNKNOWN";
  /** Score global. */
  overall: "PASS" | "PARTIAL" | "FAIL" | "UNKNOWN";
  /** Valor usado (kgCO2e/m2). */
  value_kgco2e_per_m2: number;
  /** Benchmarks aplicados. */
  benchmarks: string[];
};

/** Benchmarks de referencia. */
export type Benchmark = {
  id: string;
  name: string;
  /** Umbral en kgCO2e/m2. */
  threshold_kgco2e_per_m2: number;
  /** Año del benchmark. */
  year: number;
  /** Fuente. */
  source: string;
};

/** Benchmarks canónicos. */
export const BENCHMARKS: Benchmark[] = [
  { id: "LETI-2020", name: "LETI 2020 (A1-A5)", threshold_kgco2e_per_m2: 350, year: 2020, source: "LETI Climate Emergency Design Guide" },
  { id: "RIBA-2025", name: "RIBA 2030 (2025, A1-A5)", threshold_kgco2e_per_m2: 750, year: 2025, source: "RIBA 2030 Climate Challenge v3" },
  { id: "RIBA-2030", name: "RIBA 2030 (2030, A1-A5)", threshold_kgco2e_per_m2: 625, year: 2030, source: "RIBA 2030 Climate Challenge v3" },
];
