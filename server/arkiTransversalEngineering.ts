export type ArkIfcProperty = { name: string; value: string | number | boolean; unit?: string; source: "USER" | "ARKI_DERIVED" | "EXTERNAL_SOURCE" | "UNKNOWN"; confidence: "OBSERVED" | "DERIVED" | "UNKNOWN" };
export type ArkIfcQuantity = { name: string; value: number; unit: string; source: "GEOMETRY" | "USER" | "ARKI_DERIVED" | "UNKNOWN" };
export type ArkIfcElement = { globalId: string; ifcClass: string; predefinedType?: string; name: string; discipline: string; level?: string; propertySets: Record<string, ArkIfcProperty[]>; quantities: ArkIfcQuantity[]; sourceIds: string[]; geometryReference: { kind: "ARK_GEOMETRY" | "EXTERNAL_GEOMETRY" | "NOT_AVAILABLE"; elementId?: string } };
export type ArkIfcEnvelope = { schema: "ARKI-IFC-COMPAT-1.0"; ifcSchema: "IFC4"; projectGlobalId: string; units: string; coordinateSystem: string; elements: ArkIfcElement[]; propertySetPolicy: "EXPLICIT_SOURCE_AND_CONFIDENCE"; geometryStatus: "CONCEPTUAL_PROXY" | "COORDINATED" | "NOT_AVAILABLE"; humanReviewRequired: true };

export type PredimensioningInput = {
  projectId: string;
  use: string;
  floors: number;
  typicalSpanM: number;
  maxSpanM?: number;
  floorToFloorM: number;
  structuralSystem: "REINFORCED_CONCRETE_FRAME" | "STEEL_FRAME" | "MASONRY" | "TIMBER" | "UNKNOWN";
  columnWidthM?: number;
  columnDepthM?: number;
  beamDepthM?: number;
  slabThicknessM?: number;
  wetAreaCount?: number;
  electricalRoomCount?: number;
  hvacRequired?: boolean;
  healthcareCritical?: boolean;
  serviceShaftCount?: number;
};
export type PredimensioningCheck = { id: string; discipline: "STRUCTURE" | "SANITARY" | "ELECTRICAL" | "MECHANICAL" | "COORDINATION"; status: "PASS_PRELIMINARY" | "WARNING" | "BLOCKED_UNKNOWN"; title: string; finding: string; recommendedAction: string; source: "HEURISTIC_PRELIMINARY" | "USER_INPUT" | "UNKNOWN" };
export type PredimensioningReport = { schema: "ARKI-PREDIMENSIONING-1.0"; projectId: string; checks: PredimensioningCheck[]; assumptions: string[]; unknowns: string[]; status: "PRELIMINARY_COORDINATION_PASS" | "REVIEW_REQUIRED" | "BLOCKED_UNKNOWN"; downstreamGate: "CAN_PROCEED_TO_CONCEPTUAL_COORDINATION" | "HOLD_FOR_SPECIALIST_INPUT"; humanReviewRequired: true };

function finitePositive(value: number | undefined) { return value !== undefined && Number.isFinite(value) && value > 0; }
function checkRange(id: string, discipline: PredimensioningCheck["discipline"], title: string, value: number | undefined, min: number, max: number, unit: string, recommendedAction: string): PredimensioningCheck {
  if (!finitePositive(value)) return { id, discipline, status: "BLOCKED_UNKNOWN", title, finding: "UNKNOWN: no valid input was provided", recommendedAction, source: "UNKNOWN" };
  const validValue = value as number;
  if (validValue < min || validValue > max) return { id, discipline, status: "WARNING", title, finding: `${validValue.toFixed(3)} ${unit} is outside the preliminary range ${min.toFixed(3)}–${max.toFixed(3)} ${unit}`, recommendedAction, source: "HEURISTIC_PRELIMINARY" };
  return { id, discipline, status: "PASS_PRELIMINARY", title, finding: `${validValue.toFixed(3)} ${unit} is inside the preliminary range ${min.toFixed(3)}–${max.toFixed(3)} ${unit}`, recommendedAction, source: "HEURISTIC_PRELIMINARY" };
}

export function runPreliminaryPredimensioning(input: PredimensioningInput): PredimensioningReport {
  const checks: PredimensioningCheck[] = [];
  const unknowns: string[] = [];
  const assumptions = ["Preliminary ranges are coordination heuristics, not a structural design or code compliance calculation.", "Loads, soil, seismicity, fire rating, material strengths and local regulations are not inferred.", "Service zones must be coordinated with beams, slabs, shafts, ceilings and equipment access."];
  if (!finitePositive(input.typicalSpanM) || !finitePositive(input.floorToFloorM) || input.floors < 1) unknowns.push("span/floor geometry");
  if (input.structuralSystem === "UNKNOWN") unknowns.push("structural system");
  const span = input.maxSpanM ?? input.typicalSpanM;
  if (input.structuralSystem === "REINFORCED_CONCRETE_FRAME" && finitePositive(span)) {
    checks.push(checkRange("STR-COL-001", "STRUCTURE", "Column preliminary width", input.columnWidthM, Math.max(0.25, span / 20), Math.max(0.35, span / 12), "m", "Coordinate architectural grid and obtain structural engineer verification."));
    checks.push(checkRange("STR-COL-002", "STRUCTURE", "Column preliminary depth", input.columnDepthM, Math.max(0.25, span / 20), Math.max(0.45, span / 10), "m", "Check axial load, slenderness, seismic demand and reinforcement congestion."));
    checks.push(checkRange("STR-BEA-001", "STRUCTURE", "Beam preliminary depth", input.beamDepthM, span / 20, span / 12, "m", "Coordinate beam depth with ceiling, ducts, pipes and clear height."));
    checks.push(checkRange("STR-SLAB-001", "STRUCTURE", "Slab preliminary thickness", input.slabThicknessM, span / 35, span / 24, "m", "Check punching, vibration, deflection, fire and acoustic requirements."));
  } else if (input.structuralSystem === "STEEL_FRAME" && finitePositive(span)) {
    checks.push({ id: "STR-STEEL-001", discipline: "STRUCTURE", status: "WARNING", title: "Steel member selection", finding: "Preliminary steel member depth cannot be selected from span alone.", recommendedAction: "Request loads, lateral system, fire protection and a structural design basis.", source: "UNKNOWN" });
    unknowns.push("steel section, loads and lateral system");
  } else if (input.structuralSystem === "UNKNOWN") {
    checks.push({ id: "STR-SYS-001", discipline: "STRUCTURE", status: "BLOCKED_UNKNOWN", title: "Structural system", finding: "UNKNOWN: structural system not defined.", recommendedAction: "Select a structural system before dimensional coordination.", source: "UNKNOWN" });
  }
  const wetAreas = input.wetAreaCount ?? 0;
  const shafts = input.serviceShaftCount ?? 0;
  checks.push({ id: "MEP-SHAFT-001", discipline: "SANITARY", status: wetAreas > 0 && shafts > 0 ? "PASS_PRELIMINARY" : wetAreas > 0 ? "WARNING" : "PASS_PRELIMINARY", title: "Wet-area vertical service continuity", finding: wetAreas > 0 && shafts > 0 ? `${shafts} service shafts declared for ${wetAreas} wet-area groups.` : wetAreas > 0 ? "Wet areas exist but no service shaft count was declared." : "No wet-area groups declared.", recommendedAction: "Align bathrooms, kitchens, equipment rooms and sanitary stacks before freezing plans.", source: wetAreas > 0 && shafts > 0 ? "USER_INPUT" : wetAreas > 0 ? "UNKNOWN" : "USER_INPUT" });
  if (wetAreas > 0 && shafts === 0) unknowns.push("sanitary shaft strategy");
  const electricalRooms = input.electricalRoomCount ?? 0;
  checks.push({ id: "MEP-ELE-001", discipline: "ELECTRICAL", status: electricalRooms > 0 ? "PASS_PRELIMINARY" : "WARNING", title: "Electrical room and riser provision", finding: electricalRooms > 0 ? `${electricalRooms} electrical room(s) declared.` : "No electrical room count was declared.", recommendedAction: "Reserve electrical rooms, risers, clearances, grounding and maintenance access.", source: electricalRooms > 0 ? "USER_INPUT" : "UNKNOWN" });
  if (electricalRooms === 0) unknowns.push("electrical room and riser strategy");
  checks.push({ id: "MEP-HVAC-001", discipline: "MECHANICAL", status: input.hvacRequired === undefined ? "BLOCKED_UNKNOWN" : "PASS_PRELIMINARY", title: "HVAC requirement", finding: input.hvacRequired === undefined ? "UNKNOWN: HVAC requirement not declared." : input.hvacRequired ? "HVAC required; plant, shafts and ceiling zones must be reserved." : "HVAC not declared for this preliminary scenario.", recommendedAction: "Confirm thermal, ventilation, smoke-control and equipment requirements.", source: input.hvacRequired === undefined ? "UNKNOWN" : "USER_INPUT" });
  if (input.hvacRequired === undefined) unknowns.push("HVAC requirement");
  if (input.healthcareCritical) checks.push({ id: "COORD-HEALTH-001", discipline: "COORDINATION", status: "WARNING", title: "Healthcare coordination", finding: "Hospital use requires clinical workflows, medical gases, infection control, electrical resilience and commissioning criteria.", recommendedAction: "Activate healthcare specialist review before spatial or BIM freeze.", source: "HEURISTIC_PRELIMINARY" });
  const hasBlock = checks.some((check) => check.status === "BLOCKED_UNKNOWN") || unknowns.length > 0;
  const hasWarning = checks.some((check) => check.status === "WARNING");
  return { schema: "ARKI-PREDIMENSIONING-1.0", projectId: input.projectId, checks, assumptions, unknowns: Array.from(new Set(unknowns)), status: hasBlock ? "BLOCKED_UNKNOWN" : hasWarning ? "REVIEW_REQUIRED" : "PRELIMINARY_COORDINATION_PASS", downstreamGate: hasBlock || hasWarning ? "HOLD_FOR_SPECIALIST_INPUT" : "CAN_PROCEED_TO_CONCEPTUAL_COORDINATION", humanReviewRequired: true };
}

export function createArkIfcEnvelope(projectGlobalId: string, elements: ArkIfcElement[], units = "m", coordinateSystem = "LOCAL"): ArkIfcEnvelope { return { schema: "ARKI-IFC-COMPAT-1.0", ifcSchema: "IFC4", projectGlobalId, units, coordinateSystem, elements, propertySetPolicy: "EXPLICIT_SOURCE_AND_CONFIDENCE", geometryStatus: "CONCEPTUAL_PROXY", humanReviewRequired: true }; }

export function transversalKnowledgeContract() {
  return { version: "ARKI-TRANSVERSAL-KNOWLEDGE-1.0", principle: "Architecture is coordinated through transversal knowledge, not isolated vertical silos.", disciplines: ["ARCHITECTURE", "STRUCTURE", "SANITARY", "ELECTRICAL", "MECHANICAL", "FIRE_LIFE_SAFETY", "ACOUSTICS", "MEDICAL_PLANNING", "COST", "OPERATIONS", "BIM_INFORMATION"], checks: ["PREDIMENSIONING", "SERVICE_ZONE_COORDINATION", "VERTICAL_SHAFT_CONTINUITY", "ACCESS_AND_MAINTENANCE", "IFC_PROPERTY_COMPLETENESS"], boundary: "Preliminary coordination guides design; it does not replace signed calculations or approvals.", humanReviewRequired: true } as const;
}
