import type { A24FloorPlanAlternative } from "./a24IntelligentFloorplan";

export type A25EpistemicState = "SOURCE_METADATA_ONLY" | "CONTEXT_ONLY" | "DETERMINISTIC_DERIVED" | "HYPOTHESIS" | "NOT_ASSESSED";
export type A25AnalysisState = "SUPPORTED" | "PARTIAL" | "CONFLICTING" | "NOT_ASSESSED";
export type A25PrecedentSourceClass = "AWARD_ARCHIVE" | "ACADEMIC_ARCHIVE" | "PROJECT_DATABASE";

export type A25ArchitecturalPrecedent = { precedentId: string; title: string; architect: string; workType: "BUILT_WORK" | "ARCHIVE_COLLECTION" | "PRECEDENT_INDEX"; sourceUrl: string; sourceClass: A25PrecedentSourceClass; sourceStatus: "DISCOVERED" | "BIBLIOGRAPHICALLY_VERIFIED" | "REQUIRES_HUMAN_REVIEW"; designTopics: string[]; epistemicState: A25EpistemicState; provenance: string[]; authorIsNotAgent: true; precedentIsNotRequirement: true };
export type A25DaylightAnalysis = { alternativeId: string; orientationDeg: number; apertureToWallRatio: number | null; daylightContext: "ORIENTATION_CONTEXT" | "PARTIAL_PROXY" | "NOT_ASSESSED"; affectedSpaces: string[]; assumptions: string[]; evidenceRefs: string[]; state: A25AnalysisState; noDaylightSimulation: true; humanReviewRequired: true };
export type A25ThermalAnalysis = { alternativeId: string; airTemperatureC: number | null; relativeHumidityPct: number | null; windSpeedMs: number | null; thermalContext: "AMBIENT_CONTEXT" | "PARTIAL_PROXY" | "NOT_ASSESSED"; comfortState: "NOT_ASSESSED"; assumptions: string[]; evidenceRefs: string[]; state: A25AnalysisState; noComfortFormula: true; noThermalSimulation: true; humanReviewRequired: true };
export type A25StructuralPreliminaryCheck = { alternativeId: string; geometryFamily: string; ruledSurfaceChecks: string[]; hyperbolicChecks: string[]; warnings: string[]; state: A25AnalysisState; constructabilityState: "CONCEPTUAL" | "CONTROLLED_HYPOTHESIS" | "NOT_ASSESSED"; noStructuralCertification: true; humanReviewRequired: true };
export type A25FlowNode = { nodeId: string; levelId: string; role: "ORIGIN" | "ROUTE" | "STAIR" | "ELEVATOR" | "EXIT" | "DESTINATION"; capacityPersons: number; provenance: string[] };
export type A25FlowEdge = { edgeId: string; from: string; to: string; lengthM: number; capacityPersonsPerMin: number; state: "OBSERVED" | "HYPOTHESIS"; provenance: string[] };
export type A25EvacuationSimulation = { alternativeId: string; nodes: A25FlowNode[]; edges: A25FlowEdge[]; routes: Array<{ origin: string; exit: string; path: string[]; reachable: boolean; bottlenecks: string[] }>; maxDemandPersons: number; maxEstimatedFlowMinutes: number | null; state: A25AnalysisState; evacuationCompliance: "NOT_ASSESSED"; assumptions: string[]; humanReviewRequired: true; noAutomaticCorrection: true };

export const A25_PRECEDENTS: A25ArchitecturalPrecedent[] = [
  { precedentId: "PRITZKER-ARCHIVE-LAUREATES", title: "Pritzker Architecture Prize laureate archive", architect: "Multiple laureates", workType: "ARCHIVE_COLLECTION", sourceUrl: "https://www.pritzkerprize.com/", sourceClass: "AWARD_ARCHIVE", sourceStatus: "BIBLIOGRAPHICALLY_VERIFIED", designTopics: ["architectural practice", "built work", "international precedent"], epistemicState: "SOURCE_METADATA_ONLY", provenance: ["Official Pritzker Architecture Prize website accessed 2026-09-18"], authorIsNotAgent: true, precedentIsNotRequirement: true },
  { precedentId: "PENN-ARCHITECTURAL-ARCHIVES", title: "Architectural Archives collections", architect: "Multiple architects and designers", workType: "ARCHIVE_COLLECTION", sourceUrl: "https://www.design.upenn.edu/architectural-archives/home", sourceClass: "ACADEMIC_ARCHIVE", sourceStatus: "BIBLIOGRAPHICALLY_VERIFIED", designTopics: ["drawings", "models", "design process", "architectural history"], epistemicState: "SOURCE_METADATA_ONLY", provenance: ["University of Pennsylvania Stuart Weitzman School of Design Architectural Archives accessed 2026-09-18"], authorIsNotAgent: true, precedentIsNotRequirement: true },
  { precedentId: "ARCHIREF-BUILT-PRECEDENTS", title: "Built architecture precedent index", architect: "Multiple credited architects", workType: "PRECEDENT_INDEX", sourceUrl: "https://www.archiref.net/", sourceClass: "PROJECT_DATABASE", sourceStatus: "REQUIRES_HUMAN_REVIEW", designTopics: ["precedent search", "building type", "materials", "climate and design criteria"], epistemicState: "SOURCE_METADATA_ONLY", provenance: ["ArchRef public FAQ/index accessed 2026-09-18; individual records require review"], authorIsNotAgent: true, precedentIsNotRequirement: true },
];

export function analyzeDaylight(plan: A24FloorPlanAlternative, input: { orientationDeg: number; apertureToWallRatio?: number; sourceRefs?: string[] }): A25DaylightAnalysis {
  const ratio = input.apertureToWallRatio;
  const validRatio = ratio === undefined || (Number.isFinite(ratio) && ratio >= 0 && ratio <= 1);
  const state: A25AnalysisState = !validRatio ? "CONFLICTING" : ratio === undefined ? "PARTIAL" : "SUPPORTED";
  return { alternativeId: plan.alternativeId, orientationDeg: input.orientationDeg, apertureToWallRatio: validRatio ? ratio ?? null : null, daylightContext: state === "SUPPORTED" ? "PARTIAL_PROXY" : "ORIENTATION_CONTEXT", affectedSpaces: plan.spaces.map((space) => space.spaceId), assumptions: ["No sky-view model supplied", "No obstruction geometry supplied", "No annual daylight simulation executed"], evidenceRefs: ["A24 spatial candidate", ...(input.sourceRefs ?? [])], state, noDaylightSimulation: true, humanReviewRequired: true };
}

export function analyzeThermalContext(plan: A24FloorPlanAlternative, input: { airTemperatureC?: number; relativeHumidityPct?: number; windSpeedMs?: number; sourceRefs?: string[] }): A25ThermalAnalysis {
  const numeric = [input.airTemperatureC, input.relativeHumidityPct, input.windSpeedMs].filter((value) => value !== undefined);
  const valid = numeric.every((value) => Number.isFinite(value));
  const complete = input.airTemperatureC !== undefined && input.relativeHumidityPct !== undefined && input.windSpeedMs !== undefined;
  return { alternativeId: plan.alternativeId, airTemperatureC: input.airTemperatureC ?? null, relativeHumidityPct: input.relativeHumidityPct ?? null, windSpeedMs: input.windSpeedMs ?? null, thermalContext: valid && complete ? "AMBIENT_CONTEXT" : valid ? "PARTIAL_PROXY" : "NOT_ASSESSED", comfortState: "NOT_ASSESSED", assumptions: ["Ambient air data is not surface temperature", "No indoor model", "No thermal mass model", "No comfort formula or energy simulation"], evidenceRefs: ["A24 spatial candidate", ...(input.sourceRefs ?? [])], state: !valid ? "CONFLICTING" : complete ? "SUPPORTED" : "PARTIAL", noComfortFormula: true, noThermalSimulation: true, humanReviewRequired: true };
}

export function checkCrazyStructuralHypothesis(plan: A24FloorPlanAlternative): A25StructuralPreliminaryCheck {
  const ruled = plan.shapeFamilies.includes("RULED_SURFACE");
  const hyperbolic = plan.shapeFamilies.includes("HYPERBOLIC_PROFILE");
  const ruledSurfaceChecks = ruled ? ["GENERATRICES_REQUIRE_DEFINED_SUPPORT_LINES", "EDGE_BOUNDARIES_REQUIRE_CLOSURE", "LOAD_PATH_NOT_ASSESSED"] : [];
  const hyperbolicChecks = hyperbolic ? ["CURVATURE_CHANGE_REQUIRES_CONTINUOUS_SHELL_OR_FRAME_HYPOTHESIS", "THRUST_AND_SUPPORT_REQUIRE_ENGINEERING_REVIEW", "BUCKLING_NOT_ASSESSED"] : [];
  const warnings = [...(!ruled && !hyperbolic ? ["ADVANCED_FORM_FAMILY_NOT_PRESENT"] : []), "PRELIMINARY_RULES_DO_NOT_CERTIFY_STRUCTURE", "MATERIAL_AND_CONNECTIONS_UNKNOWN"];
  return { alternativeId: plan.alternativeId, geometryFamily: plan.shapeFamilies.join(" + "), ruledSurfaceChecks, hyperbolicChecks, warnings, state: plan.profile === "CRAZY" && plan.shapeFamilies.length > 0 ? "PARTIAL" : "NOT_ASSESSED", constructabilityState: plan.constructabilityState, noStructuralCertification: true, humanReviewRequired: true };
}

export function simulateEvacuationAndPedestrianFlow(input: { plan: A24FloorPlanAlternative; nodes: A25FlowNode[]; edges: A25FlowEdge[]; demandByOrigin: Record<string, number>; exits: string[] }): A25EvacuationSimulation {
  const adjacency = new Map<string, A25FlowEdge[]>();
  for (const edge of input.edges) adjacency.set(edge.from, [...(adjacency.get(edge.from) ?? []), edge]);
  const routes: A25EvacuationSimulation["routes"] = [];
  for (const [origin, demand] of Object.entries(input.demandByOrigin)) {
    const queue: Array<{ node: string; path: string[] }> = [{ node: origin, path: [origin] }]; const visited = new Set([origin]); let found: string[] | undefined;
    while (queue.length && !found) { const current = queue.shift()!; if (input.exits.includes(current.node)) { found = current.path; break; } for (const edge of adjacency.get(current.node) ?? []) if (!visited.has(edge.to)) { visited.add(edge.to); queue.push({ node: edge.to, path: [...current.path, edge.to] }); } }
    const bottlenecks = found ? input.edges.filter((edge) => found!.includes(edge.from) && found!.includes(edge.to) && demand > edge.capacityPersonsPerMin).map((edge) => edge.edgeId) : ["NO_REACHABLE_EXIT"];
    routes.push({ origin, exit: found ? found[found.length - 1] : "UNKNOWN", path: found ?? [], reachable: Boolean(found), bottlenecks });
  }
  const maxFlow = input.edges.length ? Math.max(...Object.values(input.demandByOrigin).map((demand) => demand / Math.max(1, Math.min(...input.edges.map((edge) => edge.capacityPersonsPerMin))))) : 0;
  const allReachable = routes.every((route) => route.reachable);
  return { alternativeId: input.plan.alternativeId, nodes: input.nodes, edges: input.edges, routes, maxDemandPersons: Math.max(0, ...Object.values(input.demandByOrigin)), maxEstimatedFlowMinutes: allReachable ? maxFlow : null, state: allReachable ? "PARTIAL" : "CONFLICTING", evacuationCompliance: "NOT_ASSESSED", assumptions: ["Graph is conceptual and deterministic", "No fire, smoke, code, door-swing, stair-width, occupant-load, or egress-time model", "Flow estimate is a capacity proxy, not an evacuation certification"], humanReviewRequired: true, noAutomaticCorrection: true };
}
