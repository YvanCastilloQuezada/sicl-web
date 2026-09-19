export type ArchitecturalPlanSymbolKind = "WALL" | "DOOR_HINGED" | "DOOR_SLIDING" | "DOOR_DOUBLE" | "DOOR_UNEVEN_DOUBLE" | "DOOR_OPPOSING" | "DOOR_REVOLVING" | "DOOR_POCKET" | "DOOR_DOUBLE_POCKET" | "DOOR_BYPASS" | "DOOR_BIFOLD" | "DOOR_DOUBLE_BIFOLD" | "DOOR_SLIDING_GLASS" | "DOOR_OVERHEAD" | "WINDOW" | "WINDOW_CASEMENT" | "WINDOW_GLIDER" | "WINDOW_GARDEN" | "WINDOW_BOW" | "WINDOW_BAY" | "WINDOW_HIGH" | "OPENING_UNKNOWN";

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
  { kind: "DOOR_DOUBLE", graphicMeaning: "two hinged leaves + two swing arcs", requiredGeometry: ["opening", "two_leaves", "hinges", "swing_arcs"], semanticMeaning: "double-leaf hinged passage", prohibitedInference: "does not prove clear width or code compliance" },
  { kind: "DOOR_UNEVEN_DOUBLE", graphicMeaning: "unequal hinged leaves + swing arcs", requiredGeometry: ["opening", "unequal_leaves", "hinges", "swing_arcs"], semanticMeaning: "unequal double-leaf hinged passage", prohibitedInference: "does not prove active leaf width or hardware" },
  { kind: "DOOR_OPPOSING", graphicMeaning: "opposing leaf swing direction", requiredGeometry: ["opening", "leaf", "hinge", "opposing_swing_arc"], semanticMeaning: "opposing-swing door condition", prohibitedInference: "does not prove egress or conflict-free clearance" },
  { kind: "DOOR_REVOLVING", graphicMeaning: "circular central pivot with radial leaves", requiredGeometry: ["opening", "center_pivot", "radial_leaves"], semanticMeaning: "revolving door", prohibitedInference: "does not prove accessibility or emergency bypass" },
  { kind: "DOOR_POCKET", graphicMeaning: "sliding leaf disappearing into wall pocket", requiredGeometry: ["opening", "leaf", "pocket", "track"], semanticMeaning: "pocket sliding door", prohibitedInference: "does not prove wall cavity or constructability" },
  { kind: "DOOR_DOUBLE_POCKET", graphicMeaning: "two sliding leaves into pockets", requiredGeometry: ["opening", "two_leaves", "pockets", "track"], semanticMeaning: "double pocket sliding door", prohibitedInference: "does not prove wall cavities or constructability" },
  { kind: "DOOR_BYPASS", graphicMeaning: "overlapping sliding leaves on parallel tracks", requiredGeometry: ["opening", "overlapping_leaves", "parallel_tracks"], semanticMeaning: "bypass sliding door", prohibitedInference: "does not prove overlap, clearance or hardware" },
  { kind: "DOOR_BIFOLD", graphicMeaning: "folding leaves with hinge/track sequence", requiredGeometry: ["opening", "folding_leaves", "hinges", "track"], semanticMeaning: "bi-fold passage", prohibitedInference: "does not prove folded stack clearance" },
  { kind: "DOOR_DOUBLE_BIFOLD", graphicMeaning: "two folding leaf groups", requiredGeometry: ["opening", "two_folding_groups", "hinges", "track"], semanticMeaning: "double bi-fold passage", prohibitedInference: "does not prove folded stack clearance" },
  { kind: "DOOR_SLIDING_GLASS", graphicMeaning: "glazed sliding leaves on track", requiredGeometry: ["opening", "glazed_leaves", "track"], semanticMeaning: "sliding glass door", prohibitedInference: "does not prove safety glazing, egress or thermal performance" },
  { kind: "DOOR_OVERHEAD", graphicMeaning: "large panel/roll-up opening without swing arc", requiredGeometry: ["opening", "overhead_leaf"], semanticMeaning: "overhead door", prohibitedInference: "does not prove motor, headroom or fire rating" },
  { kind: "DOOR_SLIDING", graphicMeaning: "wall gap + leaf position/track line without swing arc", requiredGeometry: ["opening", "leaf", "track"], semanticMeaning: "generic sliding passage", prohibitedInference: "does not prove pocket, clearance or hardware" },
  { kind: "WINDOW", graphicMeaning: "wall gap + thin glass lines", requiredGeometry: ["opening", "glass_lines"], semanticMeaning: "ordinary window opening", prohibitedInference: "does not prove operability, egress, daylight or ventilation" },
  { kind: "WINDOW_CASEMENT", graphicMeaning: "window gap + hinged sash and opening indication", requiredGeometry: ["opening", "glass_lines", "sash_hinge"], semanticMeaning: "casement window", prohibitedInference: "does not prove operation, hardware or ventilation" },
  { kind: "WINDOW_GLIDER", graphicMeaning: "window gap + parallel sliding sash lines", requiredGeometry: ["opening", "glass_lines", "sliding_sash"], semanticMeaning: "glider/sliding window", prohibitedInference: "does not prove opening fraction or egress" },
  { kind: "WINDOW_GARDEN", graphicMeaning: "projecting multi-panel window box", requiredGeometry: ["opening", "projecting_frame", "glass_lines"], semanticMeaning: "garden window", prohibitedInference: "does not prove projection, structure or waterproofing" },
  { kind: "WINDOW_BOW", graphicMeaning: "curved/bowed projecting window group", requiredGeometry: ["opening", "curved_projection", "glass_lines"], semanticMeaning: "bow window", prohibitedInference: "does not prove structure, projection or envelope performance" },
  { kind: "WINDOW_BAY", graphicMeaning: "angled projecting window group", requiredGeometry: ["opening", "angled_projection", "glass_lines"], semanticMeaning: "bay window", prohibitedInference: "does not prove structure, projection or envelope performance" },
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
