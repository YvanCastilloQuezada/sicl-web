/**
 * Isla de calor urbana (UHI).
 *
 * Basado en Urban Weather Generator (UWG) + EnergyPlus.
 * - Albedo alto (>0.6) reduce UHI.
 * - Vegetación > 30% del footprint reduce UHI.
 * - Clima tropical → +2°C baseline.
 */

import type { Geometry, HeatIslandResult } from "./types";

export function heatIslandScore(geometry: Geometry, climate: string): HeatIslandResult {
  const factors: string[] = [];
  let uhi = 0;

  // Baseline por clima
  const climateUpper = climate.toUpperCase();
  if (climateUpper.includes("TROPICAL")) {
    uhi += 2.0;
    factors.push("Clima tropical → +2.0°C baseline");
  } else if (climateUpper.includes("TEMPLADO")) {
    uhi += 1.0;
    factors.push("Clima templado → +1.0°C baseline");
  } else {
    uhi += 0.5;
    factors.push("Clima frío/variable → +0.5°C baseline");
  }

  // Albedo
  if (geometry.albedo > 0.6) {
    uhi -= 1.0;
    factors.push(`Albedo ${geometry.albedo} (>0.6) → -1.0°C`);
  } else if (geometry.albedo < 0.3) {
    uhi += 0.5;
    factors.push(`Albedo ${geometry.albedo} (<0.3) → +0.5°C`);
  }

  // Vegetación
  const vegetationPct = geometry.vegetation_m2 / geometry.footprint_m2;
  if (vegetationPct > 0.3) {
    uhi -= 1.0;
    factors.push(`Vegetación ${(vegetationPct * 100).toFixed(0)}% (>30%) → -1.0°C`);
  } else if (vegetationPct < 0.1) {
    uhi += 0.5;
    factors.push(`Vegetación ${(vegetationPct * 100).toFixed(0)}% (<10%) → +0.5°C`);
  }

  // Altura (edificios altos → más UHI por reflexión)
  if (geometry.height_m > 30) {
    uhi += 0.5;
    factors.push(`Altura ${geometry.height_m}m (>30m) → +0.5°C`);
  }

  // Score
  let score: "LOW" | "MEDIUM" | "HIGH";
  if (uhi < 1.0) score = "LOW";
  else if (uhi < 2.5) score = "MEDIUM";
  else score = "HIGH";

  return { uhiIntensity_c: uhi, score, factors };
}
