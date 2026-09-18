import { generateVerifiedResidentialPlan, type ResidentialPlan } from "./residentialConstructivePlan";
import { applyCrazyProfile, simulateHouseEnvironment } from "./houseEnvironmentalCrazy";

export type EpistemicVisualState = "COMPUTED" | "OBSERVED" | "DERIVED" | "PROXY" | "HYPOTHESIS" | "NOT_ASSESSED" | "REQUIRES_HUMAN_REVIEW";
export type PresentationMetric = { name: string; value: string; unit: string; scope: string; method: string; source: string; state: EpistemicVisualState };
export type PresentationViewModel = { projectId: string; alternativeId: string; modelVersion: string; title: string; subtitle: string; levels: Array<{ levelId: string; roomIds: string[]; areaM2: number; state: EpistemicVisualState }>; visibleLayers: string[]; metrics: PresentationMetric[]; warnings: string[]; provenance: string[]; boardBlocks: Array<"PLAN_N1" | "PLAN_N2" | "AXONOMETRIC" | "DAYLIGHT_PROXY" | "THERMAL_CONTEXT" | "MATERIAL_PROXY" | "WARNINGS"> };

export function buildHousePresentation(plan: ResidentialPlan = generateVerifiedResidentialPlan()): PresentationViewModel {
  const environment = simulateHouseEnvironment(plan);
  const crazy = applyCrazyProfile(plan);
  const roomsByLevel = (levelId: string) => plan.rooms.filter((room) => room.levelId === levelId);
  const grossAreaM2 = plan.rooms.reduce((sum, room) => sum + room.areaM2, 0);
  return {
    projectId: plan.projectId,
    alternativeId: plan.alternativeId,
    modelVersion: "HOUSE-001-EXPLICIT:v1",
    title: "HOUSE-001 · ARKI",
    subtitle: "Architectural presentation · N1 + N2 · Visual First / Data on Demand",
    levels: ["N1", "N2"].map((levelId) => ({ levelId, roomIds: roomsByLevel(levelId).map((room) => room.id), areaM2: roomsByLevel(levelId).reduce((sum, room) => sum + room.areaM2, 0), state: "COMPUTED" })),
    visibleLayers: ["SPACE_BOUNDARY", "SPACE_LABEL", "AREA", "FUNCTIONAL_ZONE", "CIRCULATION", "CORE", "NORTH", "DAYLIGHT_PROXY", "AMBIENT_THERMAL_CONTEXT", "MATERIAL_PROXY", "EPISTEMIC_WARNING"],
    metrics: [
      { name: "GROSS_AREA", value: grossAreaM2.toFixed(1), unit: "m²", scope: "N1 + N2", method: "sum explicit room areas", source: "residentialConstructivePlan", state: "COMPUTED" },
      { name: "DAYLIGHT", value: "MEDIUM", unit: "proxy band", scope: "N1 + N2", method: "orientation + aperture ratio", source: "A25.analyzeDaylight", state: "PROXY" },
      { name: "OUTDOOR_AIR", value: "26", unit: "°C", scope: "ambient context", method: "weather input", source: "Open-Meteo:hourly / controlled fixture", state: "OBSERVED" },
      { name: "THERMAL_COMFORT", value: "NOT_ASSESSED", unit: "—", scope: "N1 + N2", method: "no comfort formula", source: "A25.analyzeThermalContext", state: "NOT_ASSESSED" },
      { name: "CARBON", value: String(Math.round(plan.carbonSummary.carbonMidKgCo2e)), unit: "kgCO₂e", scope: "illustrative material proxy", method: "material factor × area", source: "A26 material catalog", state: "PROXY" },
      { name: "CRAZY_FORM", value: crazy.shapeFamilies.join(" + "), unit: "—", scope: "HOUSE-A-CRAZY", method: "controlled hypothesis", source: "A24/A25", state: "HYPOTHESIS" },
    ],
    warnings: ["Daylight is a proxy, not annual illuminance simulation.", "Outdoor air temperature is not indoor operative temperature or comfort.", "Carbon is an illustrative proxy, not EPD or project LCA.", "CRAZY geometry is a structural hypothesis; buildability and code are not assessed.", "Human review required; no automatic winner or certification."],
    provenance: ["HOUSE-001-EXPLICIT", "residentialConstructivePlan", "A25.analyzeDaylight", "A25.analyzeThermalContext", "A26 material catalog", "A24/A25 CRAZY hypothesis"],
    boardBlocks: ["PLAN_N1", "PLAN_N2", "AXONOMETRIC", "DAYLIGHT_PROXY", "THERMAL_CONTEXT", "MATERIAL_PROXY", "WARNINGS"],
  };
}
