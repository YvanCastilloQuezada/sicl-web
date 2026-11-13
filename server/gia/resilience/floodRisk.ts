/**
 * Riesgo de inundación.
 *
 * Basado en matriz de riesgo del Banco Mundial (RMA):
 * - Pendiente < 2% + elevación baja + proximidad < 100m → HIGH.
 * - Pendiente 2-5% + proximidad 100-500m → MEDIUM.
 * - Pendiente > 5% + proximidad > 500m → LOW.
 * - Rainfall > 100mm → sube un nivel.
 */

import type { Terrain, FloodRiskResult } from "./types";

export function floodRisk(terrain: Terrain, rainfall_mm: number): FloodRiskResult {
  const factors: string[] = [];
  let score: "LOW" | "MEDIUM" | "HIGH" = "LOW";

  // Pendiente
  if (terrain.slope < 0.02) {
    score = "HIGH";
    factors.push(`Pendiente ${(terrain.slope * 100).toFixed(1)}% (<2%) → riesgo alto`);
  } else if (terrain.slope < 0.05) {
    score = "MEDIUM";
    factors.push(`Pendiente ${(terrain.slope * 100).toFixed(1)}% (2-5%) → riesgo medio`);
  } else {
    factors.push(`Pendiente ${(terrain.slope * 100).toFixed(1)}% (>5%) → riesgo bajo`);
  }

  // Proximidad a agua
  if (terrain.proximityToWater_m < 100) {
    if (score !== "HIGH") score = "HIGH";
    factors.push(`Proximidad ${terrain.proximityToWater_m}m (<100m) → riesgo alto`);
  } else if (terrain.proximityToWater_m < 500) {
    if (score === "LOW") score = "MEDIUM";
    factors.push(`Proximidad ${terrain.proximityToWater_m}m (100-500m) → riesgo medio`);
  } else {
    factors.push(`Proximidad ${terrain.proximityToWater_m}m (>500m) → riesgo bajo`);
  }

  // Elevación
  if (terrain.elevation_m < 10) {
    if (score !== "HIGH") score = "HIGH";
    factors.push(`Elevación ${terrain.elevation_m}m (<10m) → riesgo alto`);
  }

  // Rainfall
  if (rainfall_mm > 100) {
    if (score === "LOW") score = "MEDIUM";
    else if (score === "MEDIUM") score = "HIGH";
    factors.push(`Lluvia ${rainfall_mm}mm (>100mm) → sube un nivel`);
  }

  return { score, factors };
}
