export interface ArchitecturalResearchPattern {
  id: string;
  year: number;
  source: "AUTODESK_UNIVERSITY" | "AUTODESK_RESEARCH";
  capabilities: readonly string[];
  arkiUse: readonly string[];
}

const PATTERNS: readonly ArchitecturalResearchPattern[] = Object.freeze([
  {
    id: "au2017-generative-space-planning",
    year: 2017,
    source: "AUTODESK_UNIVERSITY",
    capabilities: ["PROGRAM_ALLOCATION", "SPACE_SUBDIVISION", "MULTIOBJECTIVE_EVALUATION", "EVOLUTIONARY_SEARCH"],
    arkiUse: ["SPACE_PLANNING_DIRECTOR", "OPTIMIZATION_DIRECTOR"],
  },
  {
    id: "au2018-project-discover-refinery",
    year: 2018,
    source: "AUTODESK_UNIVERSITY",
    capabilities: ["WORKPLACE_LAYOUT", "HUMAN_PREFERENCE_METRICS", "GENERATIVE_WORKFLOW"],
    arkiUse: ["SPACE_PLANNING_DIRECTOR"],
  },
  {
    id: "au2019-project-rediscover",
    year: 2019,
    source: "AUTODESK_UNIVERSITY",
    capabilities: ["VORONOI_SPACE_SUBDIVISION", "PATHFINDING_2D", "VISIBILITY_ANALYSIS", "ADJACENCY_METRIC", "BUZZ_METRIC"],
    arkiUse: ["SPACE_PLANNING_DIRECTOR", "CIRCULATION_HUMAN_FLOW_DIRECTOR"],
  },
  {
    id: "au2020-hospital-pharmacy",
    year: 2020,
    source: "AUTODESK_UNIVERSITY",
    capabilities: ["MACRO_ZONING", "MICRO_ZONING", "ROOM_ADJACENCY", "FLOW_OPTIMIZATION", "DAYLIGHT_OBJECTIVE"],
    arkiUse: ["SPACE_PLANNING_DIRECTOR", "HEALTHCARE_PROFILE"],
  },
  {
    id: "au2021-workspace-layout",
    year: 2021,
    source: "AUTODESK_UNIVERSITY",
    capabilities: ["WORKSPACE_LAYOUT", "AISLE_SPACING", "SEATING_DENSITY", "REVIT_DATA_ROUNDTRIP"],
    arkiUse: ["SPACE_PLANNING_DIRECTOR"],
  },
  {
    id: "au2022-complex-3d-schematic",
    year: 2022,
    source: "AUTODESK_UNIVERSITY",
    capabilities: ["LARGE_PROGRAM_ORGANIZATION_3D", "OVERLAPPING_CONSTRAINTS", "SCHEMATIC_OPTIMIZATION"],
    arkiUse: ["SPACE_PLANNING_DIRECTOR", "CODES_COMPLIANCE_DIRECTOR"],
  },
  {
    id: "au2023-vasa",
    year: 2023,
    source: "AUTODESK_UNIVERSITY",
    capabilities: ["VOXELIZE_ARCHITECTURAL_MODEL", "PATHFINDING_3D", "VISIBILITY_ANALYSIS_3D", "DAYLIGHT_ANALYSIS_3D"],
    arkiUse: ["CIRCULATION_HUMAN_FLOW_DIRECTOR", "ENVIRONMENT_DIRECTOR", "VERIFICATION_ORACLE_DIRECTOR"],
  },
  {
    id: "au2024-vasa-forma",
    year: 2024,
    source: "AUTODESK_UNIVERSITY",
    capabilities: ["VOXEL_ANALYSIS_WEB", "COMPOSABLE_SPATIAL_METRICS", "WASM_ANALYSIS_EXTENSION"],
    arkiUse: ["SITE_GEOSPATIAL_DIRECTOR", "VERIFICATION_ORACLE_DIRECTOR"],
  },
  {
    id: "au2025-vasa-sydevs-wasm",
    year: 2025,
    source: "AUTODESK_UNIVERSITY",
    capabilities: ["WASM_SPATIAL_ANALYSIS", "DISCRETE_EVENT_SIMULATION", "HUMAN_CENTRIC_SIMULATION"],
    arkiUse: ["CIRCULATION_HUMAN_FLOW_DIRECTOR", "VERIFICATION_ORACLE_DIRECTOR"],
  },
]);

export function architecturalResearchPatterns(): readonly ArchitecturalResearchPattern[] {
  return PATTERNS;
}
