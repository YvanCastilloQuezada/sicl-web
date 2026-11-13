/**
 * Score de potencial de reutilización de un edificio existente.
 *
 * Factores:
 * - Condición (good=40, fair=25, poor=5)
 * - Tipo de estructura (concrete=20, steel=20, masonry=15, timber=15, mixed=10)
 * - Año de construcción (post-1990=20, 1970-1990=15, 1950-1970=10, pre-1950=5)
 * - Área (>=5000=20, 1000-5000=15, <1000=5)
 *
 * Score total: 0-100.
 */

import type { ExistingStructure, ReusePotential } from "./types";

export function reusePotential(existing: ExistingStructure): ReusePotential {
  const factors: ReusePotential["factors"] = [];

  // Condición
  const conditionScore =
    existing.condition === "good" ? 40 : existing.condition === "fair" ? 25 : 5;
  factors.push({ factor: "condition", weight: 40, value: existing.condition });

  // Tipo de estructura
  const structureScore =
    existing.structureType === "concrete" || existing.structureType === "steel"
      ? 20
      : existing.structureType === "masonry" || existing.structureType === "timber"
        ? 15
        : 10;
  factors.push({ factor: "structureType", weight: 20, value: existing.structureType });

  // Año de construcción
  const yearScore =
    existing.yearBuilt >= 1990 ? 20 : existing.yearBuilt >= 1970 ? 15 : existing.yearBuilt >= 1950 ? 10 : 5;
  factors.push({ factor: "yearBuilt", weight: 20, value: String(existing.yearBuilt) });

  // Área
  const areaScore = existing.area_m2 >= 5000 ? 20 : existing.area_m2 >= 1000 ? 15 : 5;
  factors.push({ factor: "area_m2", weight: 20, value: String(existing.area_m2) });

  const score = conditionScore + structureScore + yearScore + areaScore;

  return { score, factors };
}
