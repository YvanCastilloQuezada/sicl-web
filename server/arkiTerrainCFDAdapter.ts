/**
 * ARKI Terrain & CFD Adapter
 * 
 * Adaptador para terreno DTM/DSM y simulación CFD básica.
 * No es un motor CFD completo, pero implementa la interfaz mínima
 * para integrar datos de terreno y simular viento.
 * 
 * Basado en el estudio: ARKI_SOLVER_MAP_001_EVIDENCE/09_CFD_WIND_SOLVER_STUDY.md
 */

export interface TerrainPoint {
  lat: number;
  lon: number;
  elevation: number;
}

export interface CFDResult {
  windSpeed: number;
  windDirection: number;
  pressure: number;
  turbulenceIntensity: number;
}

export const ARKI_TERRAIN_CFD_ADAPTER = {
  schema: "ARKI-TERRAIN-CFD-ADAPTER-1.0",
  source: "ARKI_SOLVER_MAP_001_EVIDENCE/09_CFD_WIND_SOLVER_STUDY.md",
  status: "BASIC_IMPLEMENTATION",
  limitations: [
    "No es un motor CFD completo (no OpenFOAM, no SU2).",
    "Implementación básica para integración, no para análisis profesional.",
    "Requiere validación con datos reales antes de uso en producción."
  ]
} as const;

/**
 * Lee un DTM/DSM desde un array de puntos de terreno.
 */
export function readTerrain(points: TerrainPoint[]): { elevations: number[]; min: number; max: number; avg: number } {
  if (points.length === 0) {
    throw new Error("TERRAIN_EMPTY");
  }
  const elevations = points.map(p => p.elevation);
  const min = Math.min(...elevations);
  const max = Math.max(...elevations);
  const avg = elevations.reduce((a, b) => a + b, 0) / elevations.length;
  return { elevations, min, max, avg };
}

/**
 * Simula viento básico sobre un terreno.
 * No es CFD real, es una aproximación basada en gradiente de elevación.
 */
export function simulateWind(
  terrain: { elevations: number[]; min: number; max: number; avg: number },
  windSpeedBase: number,
  windDirection: number
): CFDResult {
  if (terrain.elevations.length === 0) {
    throw new Error("TERRAIN_EMPTY");
  }
  if (windSpeedBase < 0) {
    throw new Error("WIND_SPEED_NEGATIVE");
  }
  if (windDirection < 0 || windDirection >= 360) {
    throw new Error("WIND_DIRECTION_INVALID");
  }

  // Aproximación: el viento se acelera en elevaciones altas (efecto de colina)
  const elevationFactor = 1 + (terrain.avg / 1000) * 0.1;
  const windSpeed = windSpeedBase * elevationFactor;

  // Presión dinámica: 0.5 * rho * v^2 (rho = 1.225 kg/m³ a nivel del mar)
  const pressure = 0.5 * 1.225 * windSpeed * windSpeed;

  // Turbulencia aproximada por variación de elevación
  const variance = terrain.elevations.reduce((sum, e) => sum + Math.pow(e - terrain.avg, 2), 0) / terrain.elevations.length;
  const turbulenceIntensity = Math.sqrt(variance) / 100;

  return {
    windSpeed,
    windDirection,
    pressure,
    turbulenceIntensity
  };
}
