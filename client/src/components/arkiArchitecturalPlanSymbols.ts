export type ArchitecturalPlanSymbolKind = "WALL" | "DOOR_HINGED" | "DOOR_SLIDING" | "WINDOW" | "WINDOW_HIGH" | "OPENING_UNKNOWN";

export type ArchitecturalPlanSymbolRule = {
  kind: ArchitecturalPlanSymbolKind;
  graphicMeaning: string;
  requiredGeometry: string[];
  semanticMeaning: string;
  prohibitedInference: string;
};

export const ARKI_PLAN_SYMBOL_RULES: ArchitecturalPlanSymbolRule[] = [
  { kind: "WALL", graphicMeaning: "thick continuous boundary; interruption only where an opening is modeled", requiredGeometry: ["boundary", "thickness"], semanticMeaning: "spatial enclosure or partition", prohibitedInference: "does not prove structure, fire rating or construction assembly" },
  { kind: "DOOR_HINGED", graphicMeaning: "wall gap + leaf line + hinge point + swing arc", requiredGeometry: ["opening", "leaf", "hinge", "swing_arc"], semanticMeaning: "passage connection with an explicit swing", prohibitedInference: "does not prove accessible width, hardware or code compliance" },
  { kind: "DOOR_SLIDING", graphicMeaning: "wall gap + leaf position/track line without swing arc", requiredGeometry: ["opening", "leaf", "track"], semanticMeaning: "passage connection with sliding action", prohibitedInference: "does not prove pocket, clearance or hardware" },
  { kind: "WINDOW", graphicMeaning: "wall gap + thin glass lines", requiredGeometry: ["opening", "glass_lines"], semanticMeaning: "ordinary window opening", prohibitedInference: "does not prove operability, egress, daylight or ventilation" },
  { kind: "WINDOW_HIGH", graphicMeaning: "wall gap + thin glass lines + high/clerestory tag", requiredGeometry: ["opening", "glass_lines", "height_semantics"], semanticMeaning: "window above ordinary eye/occupancy level", prohibitedInference: "does not invent sill/head height or compliance" },
  { kind: "OPENING_UNKNOWN", graphicMeaning: "reserved blank gap with UNKNOWN tag and no door/window symbol", requiredGeometry: ["reserved_gap", "unknown_status"], semanticMeaning: "opening intentionally unresolved", prohibitedInference: "must not be interpreted as a door or window" },
];

export type PlanSymbolInstance = { id: string; kind: ArchitecturalPlanSymbolKind; elementId: string; status: "HYPOTHESIS" | "FACT" | "UNKNOWN"; geometryParts: string[] };

export function validatePlanSymbolInstance(instance: PlanSymbolInstance): string[] {
  const rule = ARKI_PLAN_SYMBOL_RULES.find((candidate) => candidate.kind === instance.kind);
  if (!rule) return ["UNKNOWN_SYMBOL_KIND"];
  const missing = rule.requiredGeometry.filter((part) => !instance.geometryParts.includes(part));
  const errors = missing.map((part) => `MISSING_GEOMETRY:${part}`);
  if (instance.kind === "OPENING_UNKNOWN" && instance.status !== "UNKNOWN") errors.push("UNKNOWN_OPENING_MUST_REMAIN_UNKNOWN");
  if (instance.kind !== "OPENING_UNKNOWN" && instance.status === "UNKNOWN") errors.push("DEFINED_SYMBOL_CANNOT_CLAIM_UNKNOWN_GEOMETRY");
  return errors;
}

export function buildHousePlanSymbolLesson() {
  return {
    title: "Architectural plan symbols — residential lesson",
    sourceStatus: "PUBLIC_REFERENCE_SYNTHESIS",
    rules: ARKI_PLAN_SYMBOL_RULES,
    learningObjective: "Represent walls and openings legibly without fabricating unresolved doors, windows or heights.",
    humanReviewRequired: true,
  } as const;
}
