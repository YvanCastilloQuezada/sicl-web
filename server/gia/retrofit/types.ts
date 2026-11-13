/**
 * Tipos del motor de retrofit / adaptive reuse.
 *
 * Referencia:
 * - RIBA 2030 Climate Challenge v3 (2021): el 40% de los ingresos de los arquitectos
 *   será retrofit para 2035.
 * - RICS WLCA 2023: el carbono evitado por retrofit vs demolición es un criterio
 *   de decisión clave.
 * - EN 15978:2011: módulos C1-C4 (fin de vida) y D (beneficios).
 */

/** Tipo de estructura existente. */
export type StructureType = "concrete" | "steel" | "masonry" | "timber" | "mixed";

/** Condición del edificio existente. */
export type Condition = "good" | "fair" | "poor";

/** Edificio existente que se evalúa para retrofit. */
export type ExistingStructure = {
  /** Área construida en m2. */
  area_m2: number;
  /** Tipo de estructura. */
  structureType: StructureType;
  /** Año de construcción. */
  yearBuilt: number;
  /** Condición actual. */
  condition: Condition;
  /** Carbono incorporado del edificio existente en kgCO2e (A1-A5 original). */
  embodiedCarbon_existing_kgco2e?: number;
};

/** Obra nueva alternativa (si se demoliera y se construyera). */
export type NewBuild = {
  /** Área construida en m2. */
  area_m2: number;
  /** Carbono incorporado de la obra nueva en kgCO2e. */
  embodiedCarbon_new_kgco2e: number;
};

/** Comparación retrofit vs demolición. */
export type RetrofitComparison = {
  /** Carbono de demolición (C1-C4) en kgCO2e. */
  demolitionCarbon_kgco2e: number;
  /** Carbono de retrofit (intervenciones + refuerzos + instalaciones) en kgCO2e. */
  retrofitCarbon_kgco2e: number;
  /** Carbono evitado: (existing + demolition + newBuild) − retrofit en kgCO2e. */
  avoidedCarbon_kgco2e: number;
  /** Recomendación. */
  recommendation: "RETROFIT" | "DEMOLISH" | "UNKNOWN";
  /** Razones. */
  reasons: string[];
  /** Si falta algún dato, se reporta aquí. */
  unknowns: string[];
};

/** Score de potencial de reutilización. */
export type ReusePotential = {
  /** Score 0-100. */
  score: number;
  /** Factores que contribuyen al score. */
  factors: Array<{ factor: string; weight: number; value: string }>;
};

/** Constantes de cálculo. */
export const RETROFIT_CARBON_PER_M2_KGCO2E = 200;
export const DEMOLITION_CARBON_PER_M2_KGCO2E = 50;
export const RETROFIT_THRESHOLD_RATIO = 0.6;
