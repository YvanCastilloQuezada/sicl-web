/**
 * Score combinado de resiliencia.
 */

import type { Terrain, Geometry, WaterSystems, ResilienceIndex } from "./types";
import { floodRisk } from "./floodRisk";
import { heatIslandScore } from "./heatIsland";
import { droughtResilience } from "./droughtResilience";

export function resilienceIndex(
  terrain: Terrain,
  geometry: Geometry,
  water: WaterSystems,
  climate: string,
  rainfall_mm: number,
): ResilienceIndex {
  const flood = floodRisk(terrain, rainfall_mm);
  const heat = heatIslandScore(geometry, climate);
  const drought = droughtResilience(water);

  const unknowns: string[] = [];
  if (flood.score === "UNKNOWN") unknowns.push("flood");
  if (heat.score === "UNKNOWN") unknowns.push("heat");
  if (drought.score === "UNKNOWN") unknowns.push("drought");

  if (unknowns.length > 0) {
    return { flood, heat, drought, overall: "UNKNOWN", unknowns };
  }

  // Score combinado: cuenta de PASS (LOW) vs FAIL (HIGH)
  const scores = [flood.score, heat.score, drought.score];
  const passCount = scores.filter((s) => s === "LOW").length;
  const failCount = scores.filter((s) => s === "HIGH").length;

  let overall: "PASS" | "PARTIAL" | "FAIL";
  if (passCount === 3) overall = "PASS";
  else if (failCount >= 2) overall = "FAIL";
  else overall = "PARTIAL";

  return { flood, heat, drought, overall, unknowns: [] };
}
