import { buildHousePresentation, type EpistemicVisualState, type PresentationViewModel } from "./architecturalPresentation";
import { generateVerifiedResidentialPlan, type ResidentialPlan } from "./residentialConstructivePlan";
import { buildA29ReadModel, type A29ReadModel } from "./a29BoundaryConnectivity";
import { summarizeA30OpeningAudit } from "./a30ArchitecturalOpenings";

export type VisualOverlay = { id: string; type: "DAYLIGHT_PROXY" | "THERMAL_CONTEXT" | "CIRCULATION" | "ACCESSIBILITY_EVIDENCE" | "REGULATORY_STATUS" | "CRITIQUE" | "OPENING_EVIDENCE"; label: string; state: EpistemicVisualState; source: string; method: string; units: string; result: string };
export type CoordinatedLevelView = { levelId: string; roomIds: string[]; coreIds: string[]; orientation: "NORTH_UP"; scale: "SHARED_SITE_SCALE"; stale: false };
export type PresentationBoard = { id: string; title: string; blocks: string[]; viewModel: PresentationViewModel; anatomy: A29ReadModel; overlays: VisualOverlay[]; legend: string[]; warnings: string[]; provenance: string[] };
export type ComparisonBoard = { alternatives: Array<{ alternativeId: string; modelVersion: string; levelIds: string[] }>; synchronized: boolean; winnerCreated: false; humanSelection: "NONE"; differences: string[]; tradeoffs: string[]; unresolved: string[] };
export type PresentationRequest = "SHOW_PLAN" | "SHOW_ORGANIZATION" | "SHOW_CIRCULATION" | "SHOW_SOLAR" | "SHOW_CHANGED" | "PREPARE_REVIEW_BOARD";

export function buildMultilevelView(plan: ResidentialPlan = generateVerifiedResidentialPlan()): CoordinatedLevelView[] {
  return ["N1", "N2"].map((levelId) => ({ levelId, roomIds: plan.rooms.filter((room) => room.levelId === levelId).map((room) => room.id), coreIds: plan.cores.filter((core) => core.levelIds.includes(levelId)).map((core) => core.id), orientation: "NORTH_UP", scale: "SHARED_SITE_SCALE", stale: false }));
}

export function buildTruthfulOverlays(plan: ResidentialPlan = generateVerifiedResidentialPlan()): VisualOverlay[] {
  const openingAudit = summarizeA30OpeningAudit(plan);
  return [
    { id: "A28-DAYLIGHT-PROXY", type: "DAYLIGHT_PROXY", label: "Daylight exposure proxy", state: "PROXY", source: "A25.analyzeDaylight", method: "orientation + aperture ratio", units: "band", result: "MEDIUM" },
    { id: "A28-THERMAL-CONTEXT", type: "THERMAL_CONTEXT", label: "Ambient thermal context", state: "OBSERVED", source: "Open-Meteo / controlled fixture", method: "outdoor weather context", units: "°C / % / m/s", result: "26°C / 65% / 2.4m/s" },
    { id: "A28-CIRCULATION", type: "CIRCULATION", label: "Declared circulation route", state: "DERIVED", source: "A20-P1 + ResidentialRoute", method: "route graph read model", units: "m", result: `${plan.routes[0]?.widthM ?? "UNKNOWN"}m width; accessibility PROPOSED` },
    { id: "A28-ACCESSIBILITY", type: "ACCESSIBILITY_EVIDENCE", label: "Accessibility evidence", state: "REQUIRES_HUMAN_REVIEW", source: "A20-P2", method: "evidence assessment", units: "status", result: "PROPOSED / NOT_COMPLIANCE" },
    { id: "A28-REGULATORY", type: "REGULATORY_STATUS", label: "Regulatory applicability", state: "NOT_ASSESSED", source: "A20-P3R", method: "source and jurisdiction gate", units: "status", result: "NOT_ASSESSED" },
    { id: "A28-CRITIQUE", type: "CRITIQUE", label: "Architectural critique", state: "REQUIRES_HUMAN_REVIEW", source: "A16", method: "geometry-critical reading", units: "findings", result: "review required" },
    { id: "A30-OPENINGS", type: "OPENING_EVIDENCE", label: "Generic opening evidence", state: "REQUIRES_HUMAN_REVIEW", source: "A30 + A29", method: "boundary binding read model", units: "openings", result: `${openingAudit.existingOpenings.length} observed legacy records; binding/role/traversability require evidence` },
  ];
}

export function composeReviewBoard(plan: ResidentialPlan = generateVerifiedResidentialPlan()): PresentationBoard {
  const viewModel = buildHousePresentation(plan);
  const anatomy = buildA29ReadModel(plan);
  const overlays = buildTruthfulOverlays(plan);
  return { id: "HOUSE-001-REVIEW-BOARD", title: "HOUSE-001 · Architectural Review Board", blocks: [...viewModel.boardBlocks, "BOUNDARY_INTERFACES", "CONNECTIONS", "OVERLAY_LEGEND", "PROVENANCE"], viewModel, anatomy, overlays, legend: ["PRIMARY_ARCHITECTURE", "FUNCTIONAL_ZONE", "ANALYTICAL_PROXY", "AMBIENT_CONTEXT", "BOUNDARY_INTERFACE", "CONNECTION_OBSERVED", "HYPOTHESIS", "HUMAN_REVIEW_REQUIRED"], warnings: [...viewModel.warnings, ...anatomy.warnings, ...overlays.filter((overlay) => overlay.state === "NOT_ASSESSED" || overlay.state === "REQUIRES_HUMAN_REVIEW").map((overlay) => `${overlay.label}: ${overlay.result}`)], provenance: [...viewModel.provenance, "A20-P1", "A20-P2", "A20-P3R", "A16", "A29.deriveA29Boundaries", "A29.deriveA29Connections"] };
}

export function comparePresentationStates(source: ResidentialPlan = generateVerifiedResidentialPlan(), result = source): ComparisonBoard {
  const sourceRooms = new Map(source.rooms.map((room) => [room.id, room]));
  const differences = result.rooms.flatMap((room) => { const before = sourceRooms.get(room.id); return before && JSON.stringify(before.footprint) !== JSON.stringify(room.footprint) ? [`${room.id}: footprint changed`] : []; });
  return { alternatives: [{ alternativeId: source.alternativeId, modelVersion: "HOUSE-001-EXPLICIT:v1", levelIds: ["N1", "N2"] }, { alternativeId: result.alternativeId, modelVersion: "HOUSE-001-EXPLICIT:v1", levelIds: ["N1", "N2"] }], synchronized: true, winnerCreated: false, humanSelection: "NONE", differences: differences.length ? differences : ["No geometric difference in supplied states"], tradeoffs: ["All metrics remain traceable and synchronized", "No automatic quality judgment"], unresolved: ["Structural validity", "Thermal comfort", "Regulatory compliance"] };
}

export function orchestratePresentation(request: PresentationRequest, plan: ResidentialPlan = generateVerifiedResidentialPlan()) {
  const board = composeReviewBoard(plan);
  const views = buildMultilevelView(plan);
  const overlayTypes = buildTruthfulOverlays(plan).map((overlay) => overlay.type);
  const unavailable: string[] = [];
  if (request === "SHOW_SOLAR") unavailable.push("REAL_SOLAR_SIMULATION");
  if (request === "SHOW_CIRCULATION") unavailable.push("VERIFIED_ACCESSIBLE_ROUTE");
  return { request, board, views, overlayTypes, unavailable, humanReviewRequired: true, decisionCreated: false, winnerCreated: false };
}
