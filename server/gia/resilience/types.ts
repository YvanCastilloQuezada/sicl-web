/**
 * Tipos del motor de resiliencia climática.
 *
 * Referencias:
 * - RIBA 2030 Climate Challenge v3 (2021): "design for resilience" es prioridad.
 * - Banco Mundial: matriz de riesgo de inundación (RMA).
 * - Urban Weather Generator (UWG) + EnergyPlus: isla de calor urbana.
 * - MINSA / SUNASS: captación de lluvia y reúso de aguas grises.
 */

/** Terreno para cálculo de inundación. */
export type Terrain = {
  /** Pendiente en m/m (0.02 = 2%). */
  slope: number;
  /** Elevación en metros sobre el nivel del mar. */
  elevation_m: number;
  /** Distancia a cuerpo de agua en metros (río, mar, lago). */
  proximityToWater_m: number;
};

/** Geometría para cálculo de isla de calor. */
export type Geometry = {
  /** Huella del edificio en m2. */
  footprint_m2: number;
  /** Altura del edificio en metros. */
  height_m: number;
  /** Albedo de la superficie (0-1; 0.3 = concreto, 0.8 = techos blancos). */
  albedo: number;
  /** Área de vegetación en m2. */
  vegetation_m2: number;
};

/** Sistemas de agua para cálculo de sequía. */
export type WaterSystems = {
  /** Captación de lluvia anual en m3. */
  rainwaterHarvesting_m3: number;
  /** Demanda anual de agua en m3. */
  demand_m3: number;
  /** Si tiene reúso de aguas grises. */
  greywaterReuse: boolean;
};

/** Resultado de flood risk. */
export type FloodRiskResult = {
  score: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";
  factors: string[];
};

/** Resultado de heat island. */
export type HeatIslandResult = {
  /** Intensidad UHI en °C. */
  uhiIntensity_c: number;
  score: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";
  factors: string[];
};

/** Resultado de drought resilience. */
export type DroughtResilienceResult = {
  score: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";
  /** Cobertura de la demanda por captación + reúso. */
  coverage_pct: number;
  factors: string[];
};

/** Score combinado de resiliencia. */
export type ResilienceIndex = {
  flood: FloodRiskResult;
  heat: HeatIslandResult;
  drought: DroughtResilienceResult;
  overall: "PASS" | "PARTIAL" | "FAIL" | "UNKNOWN";
  unknowns: string[];
};
