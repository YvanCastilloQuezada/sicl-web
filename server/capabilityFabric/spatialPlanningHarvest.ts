export type SpatialPlanningScale = "INTERIOR" | "BUILDING" | "CAMPUS_PARK" | "URBAN";
export type SpatialPlanningRole = "GENERATE" | "ANALYZE" | "EVALUATE" | "EVOLVE" | "REPRESENT";

export interface SpatialPlanningCapability {
  capability: string;
  roles: readonly SpatialPlanningRole[];
  scales: readonly SpatialPlanningScale[];
  arkiTargets: readonly string[];
  sourceClass: "OPEN_HARVEST" | "RESEARCH_PATTERN" | "EXTERNAL_REFERENCE";
}

const CAPABILITIES: readonly SpatialPlanningCapability[] = Object.freeze([
  {
    capability: "SPATIAL_SUBDIVISION",
    roles: ["GENERATE"],
    scales: ["INTERIOR", "BUILDING", "CAMPUS_PARK", "URBAN"],
    arkiTargets: ["SPACE_PLANNING_DIRECTOR", "SITE_GEOSPATIAL_DIRECTOR"],
    sourceClass: "OPEN_HARVEST",
  },
  {
    capability: "PROGRAM_ALLOCATION",
    roles: ["GENERATE", "EVALUATE"],
    scales: ["INTERIOR", "BUILDING", "CAMPUS_PARK", "URBAN"],
    arkiTargets: ["SPACE_PLANNING_DIRECTOR"],
    sourceClass: "OPEN_HARVEST",
  },
  {
    capability: "VORONOI_PARTITION_2D",
    roles: ["GENERATE", "REPRESENT"],
    scales: ["INTERIOR", "BUILDING", "CAMPUS_PARK", "URBAN"],
    arkiTargets: ["SPACE_PLANNING_DIRECTOR", "SITE_GEOSPATIAL_DIRECTOR", "GEOMETRY_TOPOLOGY_DIRECTOR"],
    sourceClass: "RESEARCH_PATTERN",
  },
  {
    capability: "WEIGHTED_VORONOI_PARTITION",
    roles: ["GENERATE", "EVOLVE"],
    scales: ["BUILDING", "CAMPUS_PARK", "URBAN"],
    arkiTargets: ["SPACE_PLANNING_DIRECTOR", "SITE_GEOSPATIAL_DIRECTOR"],
    sourceClass: "RESEARCH_PATTERN",
  },
  {
    capability: "PEDESTRIAN_PATH_NETWORK",
    roles: ["GENERATE", "ANALYZE", "EVALUATE"],
    scales: ["INTERIOR", "BUILDING", "CAMPUS_PARK", "URBAN"],
    arkiTargets: ["CIRCULATION_HUMAN_FLOW_DIRECTOR", "SITE_GEOSPATIAL_DIRECTOR"],
    sourceClass: "OPEN_HARVEST",
  },
  {
    capability: "ADJACENCY_ANALYSIS",
    roles: ["ANALYZE", "EVALUATE"],
    scales: ["INTERIOR", "BUILDING", "CAMPUS_PARK", "URBAN"],
    arkiTargets: ["SPACE_PLANNING_DIRECTOR"],
    sourceClass: "OPEN_HARVEST",
  },
  {
    capability: "ISOVIST_VISIBILITY",
    roles: ["ANALYZE", "EVALUATE"],
    scales: ["INTERIOR", "BUILDING", "CAMPUS_PARK", "URBAN"],
    arkiTargets: ["SPACE_PLANNING_DIRECTOR", "CIRCULATION_HUMAN_FLOW_DIRECTOR"],
    sourceClass: "OPEN_HARVEST",
  },
  {
    capability: "AMENITY_ZONE_GENERATION",
    roles: ["GENERATE", "EVALUATE"],
    scales: ["INTERIOR", "BUILDING", "CAMPUS_PARK", "URBAN"],
    arkiTargets: ["SPACE_PLANNING_DIRECTOR", "SITE_GEOSPATIAL_DIRECTOR"],
    sourceClass: "OPEN_HARVEST",
  },
  {
    capability: "LAND_USE_ALLOCATION",
    roles: ["GENERATE", "EVALUATE", "EVOLVE"],
    scales: ["CAMPUS_PARK", "URBAN"],
    arkiTargets: ["SITE_GEOSPATIAL_DIRECTOR", "OPTIMIZATION_DIRECTOR"],
    sourceClass: "RESEARCH_PATTERN",
  },
  {
    capability: "STREET_PATH_GENERATION",
    roles: ["GENERATE", "ANALYZE", "EVOLVE"],
    scales: ["CAMPUS_PARK", "URBAN"],
    arkiTargets: ["SITE_GEOSPATIAL_DIRECTOR", "CIRCULATION_HUMAN_FLOW_DIRECTOR"],
    sourceClass: "RESEARCH_PATTERN",
  },
  {
    capability: "PLOT_SUBDIVISION",
    roles: ["GENERATE", "EVALUATE"],
    scales: ["CAMPUS_PARK", "URBAN"],
    arkiTargets: ["SITE_GEOSPATIAL_DIRECTOR"],
    sourceClass: "RESEARCH_PATTERN",
  },
  {
    capability: "PARAMETRIC_LANDFORM",
    roles: ["GENERATE", "ANALYZE", "EVOLVE"],
    scales: ["CAMPUS_PARK", "URBAN"],
    arkiTargets: ["SITE_GEOSPATIAL_DIRECTOR", "ENVIRONMENT_DIRECTOR"],
    sourceClass: "RESEARCH_PATTERN",
  },
  {
    capability: "STORMWATER_GRADING_ANALYSIS",
    roles: ["ANALYZE", "EVALUATE"],
    scales: ["CAMPUS_PARK", "URBAN"],
    arkiTargets: ["SITE_GEOSPATIAL_DIRECTOR", "ENVIRONMENT_DIRECTOR"],
    sourceClass: "RESEARCH_PATTERN",
  },
  {
    capability: "FACADE_VORONOI_PATTERN",
    roles: ["GENERATE", "REPRESENT"],
    scales: ["BUILDING"],
    arkiTargets: ["GEOMETRY_TOPOLOGY_DIRECTOR", "PARAMETRIC_COMPUTATIONAL_DESIGN_DIRECTOR"],
    sourceClass: "RESEARCH_PATTERN",
  },
  {
    capability: "FACADE_PANELIZATION",
    roles: ["GENERATE", "ANALYZE", "EVALUATE"],
    scales: ["BUILDING"],
    arkiTargets: ["GEOMETRY_TOPOLOGY_DIRECTOR", "PARAMETRIC_COMPUTATIONAL_DESIGN_DIRECTOR"],
    sourceClass: "RESEARCH_PATTERN",
  },
  {
    capability: "SITE_AUTOMATION_REFERENCE",
    roles: ["GENERATE", "EVALUATE", "EVOLVE"],
    scales: ["CAMPUS_PARK", "URBAN"],
    arkiTargets: ["SITE_GEOSPATIAL_DIRECTOR", "OPTIMIZATION_DIRECTOR"],
    sourceClass: "EXTERNAL_REFERENCE",
  },
  {
    capability: "BUILDING_LAYOUT_EXPLORER_REFERENCE",
    roles: ["GENERATE", "EVALUATE"],
    scales: ["BUILDING"],
    arkiTargets: ["SPACE_PLANNING_DIRECTOR"],
    sourceClass: "EXTERNAL_REFERENCE",
  },
]);

export function spatialPlanningCapabilities(): readonly SpatialPlanningCapability[] {
  return CAPABILITIES;
}

export function capabilitiesForScale(scale: SpatialPlanningScale): readonly SpatialPlanningCapability[] {
  return CAPABILITIES.filter(item => item.scales.includes(scale));
}
