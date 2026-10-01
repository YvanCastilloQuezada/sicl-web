export type SolverDomain =
  | "GEOMETRY"
  | "STRUCTURAL"
  | "ENERGY"
  | "DAYLIGHT"
  | "CFD"
  | "ACOUSTICS"
  | "GEOTECHNICAL"
  | "OPTIMIZATION"
  | "SPATIAL"
  | "BIM_IFC"
  | "LCA"
  | "SOLAR"
  | "SCIENTIFIC_VISUALIZATION";

export type SolverLifecycle = "CANDIDATE" | "VERIFIED" | "ENABLED" | "REJECTED";
export type SolverExecutionMode = "IN_PROCESS" | "WORKER" | "RPC" | "EXTERNAL_HOST";

export interface SolverCandidate {
  solverId: string;
  domain: SolverDomain;
  requestedCapabilities: readonly string[];
  lifecycle: SolverLifecycle;
  executionMode: SolverExecutionMode;
  licenseSpdx: string | null;
  licenseVerified: boolean;
  runtimeVerified: boolean;
  source: "USER_HARVEST" | "ARKI_HARVEST";
  notes: readonly string[];
}

const CANDIDATES: readonly SolverCandidate[] = Object.freeze([
  ["opensees","STRUCTURAL",["NONLINEAR_STRUCTURAL_ANALYSIS","SEISMIC_TIME_HISTORY","SOIL_STRUCTURE_INTERACTION"],"WORKER"],
  ["energyplus","ENERGY",["BUILDING_ENERGY_SIMULATION","THERMAL_LOAD_SIMULATION"],"EXTERNAL_HOST"],
  ["openstudio","ENERGY",["ENERGY_MODEL_AUTHORING","HVAC_MODELING"],"EXTERNAL_HOST"],
  ["radiance","DAYLIGHT",["DAYLIGHT_SIMULATION","RADIANCE_SIMULATION"],"EXTERNAL_HOST"],
  ["openfoam","CFD",["CFD_SIMULATION","URBAN_WIND_SIMULATION"],"EXTERNAL_HOST"],
  ["su2","CFD",["CFD_SIMULATION","AERODYNAMIC_OPTIMIZATION"],"EXTERNAL_HOST"],
  ["pyroomacoustics","ACOUSTICS",["ROOM_IMPULSE_RESPONSE","REVERBERATION_ANALYSIS"],"WORKER"],
  ["scipy-optimize","OPTIMIZATION",["CONTINUOUS_OPTIMIZATION"],"WORKER"],
  ["deap","OPTIMIZATION",["EVOLUTIONARY_OPTIMIZATION"],"WORKER"],
  ["pyomo","OPTIMIZATION",["MATHEMATICAL_OPTIMIZATION"],"WORKER"],
  ["nevergrad","OPTIMIZATION",["DERIVATIVE_FREE_OPTIMIZATION"],"WORKER"],
  ["networkx","SPATIAL",["GRAPH_ANALYSIS"],"WORKER"],
  ["pysal-spopt","SPATIAL",["SPATIAL_REGIONALIZATION","FACILITY_LOCATION","MAXIMAL_COVERAGE_LOCATION","P_MEDIAN_LOCATION","P_CENTER_LOCATION","P_DISPERSION_LOCATION"],"WORKER"],
  ["pysal-access","SPATIAL",["SPATIAL_ACCESSIBILITY","SUPPLY_DEMAND_ACCESS","TRAVEL_TIME_ACCESS"],"WORKER"],
  ["osmnx","SPATIAL",["URBAN_NETWORK_ANALYSIS"],"WORKER"],
  ["ifcopenshell","BIM_IFC",["IFC_READ","IFC_WRITE","IFC_GEOMETRY"],"WORKER"],
  ["brightway","LCA",["LIFE_CYCLE_ASSESSMENT"],"WORKER"],
  ["cgal","GEOMETRY",["EXACT_GEOMETRY","MESH_BOOLEAN","CONVEX_HULL"],"WORKER"],
  ["libigl","GEOMETRY",["MESH_PROCESSING","PARAMETERIZATION"],"WORKER"],
  ["manifold","GEOMETRY",["ROBUST_MESH_BOOLEAN"],"WORKER"],
  ["opencascade","GEOMETRY",["BREP_MODELING","NURBS_MODELING","SOLID_BOOLEAN"],"WORKER"],
  ["openvdb","GEOMETRY",["SPARSE_VOLUMETRIC_MODELING"],"WORKER"],
  ["picogk","GEOMETRY",["VOXEL_SDF_MODELING"],"WORKER"],
  ["paraview","SCIENTIFIC_VISUALIZATION",["SCIENTIFIC_VISUALIZATION"],"EXTERNAL_HOST"],
  ["vtk","SCIENTIFIC_VISUALIZATION",["SCIENTIFIC_VISUALIZATION","VOLUMETRIC_RENDERING"],"WORKER"],
].map(([solverId,domain,requestedCapabilities,executionMode]) => Object.freeze({
  solverId,
  domain,
  requestedCapabilities: Object.freeze(requestedCapabilities),
  lifecycle: "CANDIDATE" as const,
  executionMode,
  licenseSpdx: null,
  licenseVerified: false,
  runtimeVerified: false,
  source: "USER_HARVEST" as const,
  notes: Object.freeze(["Candidate only: license/API/runtime require independent verification before enablement."]),
} as SolverCandidate)));

export function solverCandidates(): readonly SolverCandidate[] {
  return CANDIDATES;
}

export function enablementFailures(candidate: SolverCandidate): readonly string[] {
  const failures: string[] = [];
  if (!candidate.licenseVerified || !candidate.licenseSpdx) failures.push("LICENSE_UNVERIFIED");
  if (!candidate.runtimeVerified) failures.push("RUNTIME_UNVERIFIED");
  if (candidate.requestedCapabilities.length === 0) failures.push("NO_CAPABILITY");
  return Object.freeze(failures);
}
