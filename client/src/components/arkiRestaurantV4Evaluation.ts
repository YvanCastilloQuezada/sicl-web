import { buildRestaurantDesign, type RestaurantDesign } from "./arkiRestaurantDesign";
import { evaluateRestaurantV3, type RestaurantV3Evaluation } from "./arkiRestaurantV3Evaluation";
import { createV4SubjectState, deriveV4ActiveTopology, evaluateV4DependencyGraph, evaluateV4Redundancy, type V4ActiveTopology, type V4ConcurrentDemand, type V4CoverageRecord, type V4DependencyGraph, type V4RedundancyAssessment, type V4Scenario, type V4SubjectState } from "./arkiV4ResearchDelta";

export type RestaurantV4Evaluation = {
  projectId: string;
  alternativeId: string;
  typology: "RESTAURANT";
  design: RestaurantDesign;
  baselineV3: RestaurantV3Evaluation;
  scenarios: V4Scenario[];
  subjectStates: V4SubjectState[];
  activeTopologies: V4ActiveTopology[];
  dependencyGraphs: V4DependencyGraph[];
  concurrentDemands: V4ConcurrentDemand[];
  redundancy: V4RedundancyAssessment[];
  coverage: V4CoverageRecord[];
  incrementalFindings: string[];
  status: "SUPPORTED_WITH_OBSERVATIONS" | "PARTIAL" | "CONFLICTING";
  humanReviewRequired: true;
  epistemicState: "HYPOTHESIS";
  noPermitClaim: true;
};

const evidence = (id: string, source: string) => [{ id, source, evidenceState: "SOURCE_DERIVED_HYPOTHESIS" as const }];

export function evaluateRestaurantV4(design = buildRestaurantDesign()): RestaurantV4Evaluation {
  const baselineV3 = evaluateRestaurantV3(design);
  const scenarios: V4Scenario[] = [
    { id: "REST-NORMAL", name: "Operación normal", demandProfile: "clientes + servicio + abastecimiento", stateIds: ["NORMAL"], temporalProfile: { frequency: "daily", duration: 360, durationUnit: "min", overlap: ["public-arrival", "service-logistics"] }, phases: ["INITIAL", "SUSTAINED", "RECOVERY"], humanReviewRequired: true },
    { id: "REST-PEAK", name: "Hora pico", demandProfile: "500 comensales declarados + servicio concurrente", stateIds: ["PEAK"], temporalProfile: { frequency: "peak", duration: 120, durationUnit: "min", overlap: ["arrival", "dining", "toilets", "service", "waste"] }, phases: ["INITIAL", "SUSTAINED"], humanReviewRequired: true },
    { id: "REST-EMERGENCY", name: "Evacuación", demandProfile: "aforo declarado + personal + visitantes", stateIds: ["EMERGENCY"], temporalProfile: { responseTime: "not verified", duration: 60, durationUnit: "min", overlap: ["egress", "route-control"] }, phases: ["INITIAL", "SUSTAINED", "RECOVERY"], activeTopologyId: "ACTIVE-TOPOLOGY-EMERGENCY", humanReviewRequired: true },
    { id: "REST-MAINTENANCE", name: "Mantenimiento y retorno de residuos", demandProfile: "servicio + residuos con áreas públicas en operación", stateIds: ["MAINTENANCE"], temporalProfile: { frequency: "declared operational cycle", duration: 60, durationUnit: "min", overlap: ["service", "waste", "public"] }, phases: ["INITIAL", "SUSTAINED", "RECOVERY"], humanReviewRequired: true },
  ];
  const subjectStates = [
    createV4SubjectState({ subjectId: "PUBLIC-SPINE-N1", subjectKind: "ROUTE", dimensions: { LOCATION: "N1", ACCESS: "OPEN", AVAILABILITY: "AVAILABLE", SECURITY: "NORMAL" }, evidence: evidence("V4-REST-STATE-1", "restaurant canonical geometry + v4 scenario") }),
    createV4SubjectState({ subjectId: "SERVICE-SIDE-LANE-N1", subjectKind: "ROUTE", dimensions: { LOCATION: "N1", ACCESS: "CONTROLLED", AVAILABILITY: "AVAILABLE", CUSTODY: "STAFF" }, evidence: evidence("V4-REST-STATE-2", "restaurant service circuit + v4 scenario") }),
    createV4SubjectState({ subjectId: "WASTE-INTERFACE", subjectKind: "PROCESS", dimensions: { ACCESS: "CONTROLLED", ALLOCATION: "UNRESOLVED", AVAILABILITY: "UNKNOWN" }, evidence: evidence("V4-REST-STATE-3", "v3 preserved waste deficit") }),
  ];
  const activeTopologies = [
    deriveV4ActiveTopology({ id: "ACTIVE-TOPOLOGY-NORMAL", canonicalGraphId: "RESTAURANT-CANONICAL-GRAPH", scenarioId: "REST-NORMAL", stateIds: ["NORMAL"], availableNodeIds: ["MAIN-ENTRY", "PUBLIC-SPINE-N1", "SERVICE-SIDE-LANE-N1", "KITCHEN-N1", "STAIR-W-CORE", "STAIR-E-CORE"], restrictedNodeIds: ["SERVICE-RECEIVING"], availableEdgeIds: ["PUBLIC-ROUTE-N1", "SERVICE-ROUTE-N1", "VERTICAL-EGRESS"], blockedEdgeIds: [] }),
    deriveV4ActiveTopology({ id: "ACTIVE-TOPOLOGY-EMERGENCY", canonicalGraphId: "RESTAURANT-CANONICAL-GRAPH", scenarioId: "REST-EMERGENCY", stateIds: ["EMERGENCY"], availableNodeIds: ["STAIR-W-CORE", "STAIR-E-CORE", "PUBLIC-SPINE-N1", "PUBLIC-SPINE-N2"], restrictedNodeIds: ["SERVICE-SIDE-LANE-N1", "SERVICE-RECEIVING"], availableEdgeIds: ["VERTICAL-EGRESS"], blockedEdgeIds: ["SERVICE-ROUTE-N1"] }),
  ];
  const dependencyGraphs: V4DependencyGraph[] = [
    { capabilityId: "CAP-V4-RESTAURANT-EGRESS", nodes: [{ id: "CORE-W", requirement: "continuous west stair", necessity: "ESSENTIAL", status: "SATISFIED", evidence: evidence("V4-REST-EGRESS-1", "A22 continuous core") }, { id: "CORE-E", requirement: "continuous east stair", necessity: "ESSENTIAL", status: "SATISFIED", evidence: evidence("V4-REST-EGRESS-2", "A22 continuous core") }, { id: "N2-ROUTE", requirement: "verified accessible public route N2", necessity: "SUPPORTING", status: "UNKNOWN", evidence: evidence("V4-REST-EGRESS-3", "N2 accessible route remains proposed") }], andGroups: [["CORE-W", "CORE-E"]], orGroups: [["CORE-W", "CORE-E"]], condition: "emergency scenario", humanReviewRequired: true },
    { capabilityId: "CAP-V4-RESTAURANT-WASTE", nodes: [{ id: "WASTE-INTERFACE", requirement: "dimensioned dirty return and waste interface", necessity: "ESSENTIAL", status: "UNKNOWN", evidence: evidence("V4-REST-WASTE-1", "v3 interface deficit") }, { id: "SERVICE-SUPPORT", requirement: "service support area", necessity: "SUPPORTING", status: "SATISFIED", evidence: evidence("V4-REST-WASTE-2", "canonical service support space") }], andGroups: [["WASTE-INTERFACE"]], orGroups: [], condition: "maintenance and waste scenario", humanReviewRequired: true },
  ];
  const concurrentDemands: V4ConcurrentDemand[] = [
    { id: "CONCURRENT-PEAK-PUBLIC-SERVICE", activityIds: ["DINING", "SERVICE_LOGISTICS"], sharedResourceIds: ["DOOR-ENTRY-DINING-A", "DOOR-ENTRY-DINING-B"], sharedSegmentIds: ["PUBLIC-SPINE-N1"], compatible: "COMPATIBLE", reason: "Public and service flows are spatially separated in the current alternative; exact peak timing and staffing remain unverified.", evidence: evidence("V4-REST-CONC-1", "v3 separated service circuit + v4 concurrency hypothesis"), humanReviewRequired: true },
    { id: "CONCURRENT-MAINTENANCE-WASTE", activityIds: ["WASTE_RETURN", "PUBLIC_DINING"], sharedResourceIds: ["SERVICE-SUPPORT-N1"], sharedSegmentIds: ["SERVICE-SIDE-LANE-N1"], compatible: "UNKNOWN", reason: "The model identifies the shared operational condition but lacks dimensioned waste capacity and a verified timing/control protocol.", evidence: evidence("V4-REST-CONC-2", "v3 waste interface deficit"), humanReviewRequired: true },
  ];
  const redundancy = [evaluateV4Redundancy({ capabilityId: "CAP-V4-RESTAURANT-EGRESS", alternatePathIds: ["STAIR-W-CORE", "STAIR-E-CORE"], remainingCapacity: { value: 500, unit: "persons declared aforo", timeBasis: "emergency; discharge time not verified" }, independentFailureDomains: "UNKNOWN", distributionPathsIndependent: "UNKNOWN", plannedMaintenanceSupported: "UNKNOWN", singleFailureSupported: "UNKNOWN", endurance: "UNKNOWN", limits: ["No fire-engineering calculation or independent failure-domain evidence in this conceptual model."], humanReviewRequired: true })];
  const coverage: V4CoverageRecord[] = [
    { subjectId: design.projectId, claim: "relevant restaurant scenarios evaluated", state: "UNRESOLVED", evidence: evidence("V4-REST-COVERAGE-1", "normal, peak, emergency and maintenance scenario set"), scope: "functional/scenario/capacity/egress", humanReviewRequired: true },
    { subjectId: "REST-MAINTENANCE", claim: "waste and dirty-return capacity verified", state: "NOT_EVALUATED", evidence: evidence("V4-REST-COVERAGE-2", "missing dimensioned operational evidence"), scope: "service/waste", humanReviewRequired: true },
  ];
  const incrementalFindings = [
    "La geometría y los flujos principales se conservan del modelo v3; v4 no crea una planta paralela.",
    "v4 añade cuatro escenarios explícitos: normal, hora pico, emergencia y mantenimiento.",
    "v4 convierte la topología operativa en una vista derivada del grafo canónico y de los estados.",
    "v4 identifica que la separación espacial no demuestra por sí sola la factibilidad concurrente durante hora pico.",
    "v4 conserva el déficit de residuos y lo conecta con tiempo, asignación, capacidad y cobertura no evaluada.",
    "v4 identifica redundancia aparente en escaleras, pero mantiene UNKNOWN sobre independencia, endurance y dominio de falla.",
    "El incremento principal es explicabilidad y cobertura; no se afirma una mejora geométrica automática.",
  ];
  const hasUnknownEssential = dependencyGraphs.some((graph) => evaluateV4DependencyGraph(graph) === "UNKNOWN");
  return { projectId: design.projectId, alternativeId: design.alternativeId, typology: "RESTAURANT", design, baselineV3, scenarios, subjectStates, activeTopologies, dependencyGraphs, concurrentDemands, redundancy, coverage, incrementalFindings, status: hasUnknownEssential ? "PARTIAL" : "SUPPORTED_WITH_OBSERVATIONS", humanReviewRequired: true, epistemicState: "HYPOTHESIS", noPermitClaim: true };
}

export function compareRestaurantV3V4(evaluation = evaluateRestaurantV4()) {
  const v3 = evaluation.baselineV3;
  return {
    sameProject: v3.projectId === evaluation.projectId,
    sameAlternative: v3.alternativeId === evaluation.alternativeId,
    geometryPreserved: v3.design.spaces.length === evaluation.design.spaces.length && v3.design.walls.length === evaluation.design.walls.length && v3.design.openings.length === evaluation.design.openings.length,
    v3FlowCount: v3.flowSegments.length,
    v4ScenarioCount: evaluation.scenarios.length,
    v4ActiveTopologyCount: evaluation.activeTopologies.length,
    v3DeficitCount: v3.deficits.length,
    v4UnknownCoverageCount: evaluation.coverage.filter((item) => item.state === "UNRESOLVED" || item.state === "NOT_EVALUATED").length,
    v4ConcurrentDemandCount: evaluation.concurrentDemands.length,
    v4RedundancyResult: evaluation.redundancy[0]?.result,
    v3Status: v3.status,
    v4Status: evaluation.status,
    increment: "EXPLANATORY_AND_SCENARIO_COVERAGE",
  };
}

export function validateRestaurantV4Evaluation(evaluation = evaluateRestaurantV4()) {
  const comparison = compareRestaurantV3V4(evaluation);
  return {
    sameProject: comparison.sameProject,
    sameAlternative: comparison.sameAlternative,
    geometryPreserved: comparison.geometryPreserved,
    scenarioCoverageExpanded: comparison.v4ScenarioCount > 0,
    activeTopologyDerived: evaluation.activeTopologies.every((item) => item.derivedOnly),
    concurrencyEvaluated: evaluation.concurrentDemands.length > 0,
    redundancyNotOverclaimed: evaluation.redundancy.every((item) => item.result !== "SATISFIED"),
    unknownCoveragePreserved: comparison.v4UnknownCoverageCount > 0,
    wasteDeficitPreserved: evaluation.baselineV3.deficits.some((item) => item.capabilityId === "CAP-RESTAURANT-WASTE"),
    humanReviewRequired: evaluation.humanReviewRequired,
    noPermitClaim: evaluation.noPermitClaim,
    status: evaluation.status,
  };
}
