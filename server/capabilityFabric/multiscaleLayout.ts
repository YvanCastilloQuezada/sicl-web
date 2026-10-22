// Mirrors sicl-core RFC-019 SpatialScope. Layout must not create a second scale ontology.
export type LayoutScale =
  | "PAIS"
  | "MACRO_REGION"
  | "REGION"
  | "PROVINCIA_METROPOLI"
  | "DISTRITO_CIUDAD"
  | "ZONA_BARRIO_SECTOR"
  | "PARCELA_SITIO"
  | "EDIFICACION"
  | "SISTEMA"
  | "ESPACIO"
  | "OBJETO";

export type LayoutEntityKind =
  | "OBJECT"
  | "SPACE"
  | "BUILDING"
  | "PARCEL"
  | "ACTIVITY"
  | "FACILITY"
  | "SETTLEMENT"
  | "INFRASTRUCTURE"
  | "ECOLOGICAL_ZONE"
  | "ADMINISTRATIVE_UNIT";

export type LayoutObjective =
  | "CAPACITY"
  | "ADJACENCY"
  | "ACCESSIBILITY"
  | "TRAVEL_DISTANCE"
  | "COVERAGE"
  | "CONNECTIVITY"
  | "DENSITY"
  | "LAND_USE_MIX"
  | "SERVICE_EQUITY"
  | "ENVIRONMENTAL_FIT"
  | "ECONOMIC_FIT"
  | "RESILIENCE";

export interface MultiscaleLayoutProblem {
  problemId: string;
  scale: LayoutScale;
  entityKinds: readonly LayoutEntityKind[];
  objectives: readonly LayoutObjective[];
  constraints: readonly string[];
  boundaryRef: string;
  networkRefs: readonly string[];
  demandRefs: readonly string[];
  jurisdictionRefs: readonly string[];
  canonicalMutation: false;
}

export interface LayoutCandidate {
  candidateId: string;
  problemId: string;
  placements: readonly {
    entityId: string;
    zoneRef: string;
    relationRefs: readonly string[];
  }[];
  metrics: Readonly<Record<string, number | "UNKNOWN">>;
  provenance: readonly string[];
  canonicalMutation: false;
}

export function validateLayoutProblem(problem: MultiscaleLayoutProblem): readonly string[] {
  const failures: string[] = [];
  if (!problem.problemId.trim()) failures.push("LAYOUT_PROBLEM_ID_REQUIRED");
  if (!problem.boundaryRef.trim()) failures.push("LAYOUT_BOUNDARY_REQUIRED");
  if (problem.entityKinds.length === 0) failures.push("LAYOUT_ENTITIES_REQUIRED");
  if (problem.objectives.length === 0) failures.push("LAYOUT_OBJECTIVES_REQUIRED");
  if (["PAIS", "MACRO_REGION", "REGION", "PROVINCIA_METROPOLI", "DISTRITO_CIUDAD"].includes(problem.scale) && problem.jurisdictionRefs.length === 0) {
    failures.push("LAYOUT_JURISDICTION_REQUIRED");
  }
  if (["PAIS", "MACRO_REGION", "REGION", "PROVINCIA_METROPOLI", "DISTRITO_CIUDAD"].includes(problem.scale) && problem.demandRefs.length === 0) {
    failures.push("LAYOUT_DEMAND_EVIDENCE_REQUIRED");
  }
  return failures;
}

export function layoutCapabilityFamily(scale: LayoutScale): readonly string[] {
  const common = [
    "LAYOUT_GENERATION",
    "LAYOUT_EVALUATION",
    "ADJACENCY_ANALYSIS",
    "ACCESSIBILITY_ANALYSIS",
    "MULTIOBJECTIVE_LAYOUT_OPTIMIZATION",
  ];
  if (scale === "OBJETO" || scale === "ESPACIO" || scale === "SISTEMA" || scale === "EDIFICACION") {
    return [...common, "SPACE_ALLOCATION", "CIRCULATION_LAYOUT", "EGRESS_DISTANCE_ANALYSIS"];
  }
  if (scale === "PARCELA_SITIO" || scale === "ZONA_BARRIO_SECTOR" || scale === "DISTRITO_CIUDAD") {
    return [...common, "LAND_USE_ALLOCATION", "PARCEL_LAYOUT", "STREET_NETWORK_LAYOUT", "FACILITY_SITING"];
  }
  return [...common, "REGIONAL_ALLOCATION", "SETTLEMENT_SYSTEM_LAYOUT", "INFRASTRUCTURE_CORRIDOR_LAYOUT", "SERVICE_COVERAGE", "ECOLOGICAL_CONSTRAINT_LAYOUT"];
}
