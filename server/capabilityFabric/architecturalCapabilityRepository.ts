import { ecosystemAssets, type EcosystemHost, type HarvestDisposition } from "./ecosystemHarvest";

export type ArchitecturalCapabilityArea =
  | "GEOMETRY_TOPOLOGY"
  | "PARAMETRIC_COMPUTATIONAL"
  | "SPATIAL_LAYOUT"
  | "SITE_URBAN_TERRITORIAL"
  | "BIM_SEMANTICS"
  | "SYSTEMS_NETWORKS"
  | "ENVIRONMENT_BUILDING_PHYSICS"
  | "STRUCTURES_ENGINEERING"
  | "CODES_COMPLIANCE"
  | "OPTIMIZATION_GENERATIVE"
  | "COST_CONSTRUCTION_OPERATIONS"
  | "REPRESENTATION_DOCUMENTATION"
  | "VISUALIZATION_EXPERIENCE"
  | "INTEROPERABILITY_AUTOMATION"
  | "VERIFICATION_ORACLES";

export type CapabilityIdeaRecord = {
  recordId: string;
  capability: string;
  area: ArchitecturalCapabilityArea;
  sourceAssetId: string;
  host: EcosystemHost;
  disposition: HarvestDisposition;
  licenseVerified: boolean;
  hostRequired: boolean;
};

const AREA_RULES: ReadonlyArray<readonly [RegExp, ArchitecturalCapabilityArea]> = [
  [/TOPOLOG|VERTEX|EDGE|POLYGON|MESH|NURBS|TSPLINE|GEOMETR|BOOLEAN|MORPH|TWEEN|BLEND|TESSELL|PANEL|SURFACE|SOLID/, "GEOMETRY_TOPOLOGY"],
  [/PARAMETRIC|NODE_GRAPH|CUSTOM_NODE|REACTIVE|DEPENDENCY|GDL|GRASSHOPPER/, "PARAMETRIC_COMPUTATIONAL"],
  [/LAYOUT|SPACE_|ADJACENCY|ISOVIST|OPENNESS|PATHFIND|VISIBILITY|AMENITY|DESK|PACKING|VORONOI/, "SPATIAL_LAYOUT"],
  [/URBAN|SITE|PARCEL|STREET|REGION|SETTLEMENT|GEOSPATIAL|LAND_USE|OSM/, "SITE_URBAN_TERRITORIAL"],
  [/BIM|REVIT|ARCHICAD|IFC|CLASSIFICATION|PROPERTY|LIBRARY_PART|OBJECT_ATTRIBUTES/, "BIM_SEMANTICS"],
  [/MEP|CONNECTOR|ROUTE|FLOW|NETWORK|SYSTEM_TRAVERSAL/, "SYSTEMS_NETWORKS"],
  [/DAYLIGHT|SOLAR|ENERGY|ACOUSTIC|CFD|ENVIRONMENT|STORMWATER/, "ENVIRONMENT_BUILDING_PHYSICS"],
  [/STRUCTUR|LOAD|FORM_FINDING|CATENARY|PHYSICS_BASED/, "STRUCTURES_ENGINEERING"],
  [/CODE|COMPLIANCE|EGRESS|REGULAT/, "CODES_COMPLIANCE"],
  [/OPTIM|GENERATIVE|EVOLUTION|CP_SAT|RANK|SEARCH/, "OPTIMIZATION_GENERATIVE"],
  [/COST|CONSTRUCTION|FABRICAT|OPERATIONS/, "COST_CONSTRUCTION_OPERATIONS"],
  [/DOCUMENT|DRAWING|EXPORT|2D_REPRESENTATION/, "REPRESENTATION_DOCUMENTATION"],
  [/DISPLAY|VISUAL|VIEW|EXPERIENCE|UI/, "VISUALIZATION_EXPERIENCE"],
  [/AUTOMATION|INTEROP|JSON|REMOTE|EXTERNAL|IO|EXCHANGE/, "INTEROPERABILITY_AUTOMATION"],
  [/VERIFY|WARNING|ORACLE|VALIDAT|ANALYSIS/, "VERIFICATION_ORACLES"],
];

export function classifyCapability(capability: string): ArchitecturalCapabilityArea {
  return AREA_RULES.find(([pattern]) => pattern.test(capability))?.[1] ?? "INTEROPERABILITY_AUTOMATION";
}

export function architecturalCapabilityRepository(): readonly CapabilityIdeaRecord[] {
  return ecosystemAssets()
    .flatMap(asset => asset.capabilities.map(capability => ({
      recordId: `${asset.assetId}:${capability}`,
      capability,
      area: classifyCapability(capability),
      sourceAssetId: asset.assetId,
      host: asset.host,
      disposition: asset.disposition,
      licenseVerified: asset.licenseVerified,
      hostRequired: asset.hostRequired,
    })))
    .sort((a, b) => a.area.localeCompare(b.area) || a.capability.localeCompare(b.capability) || a.sourceAssetId.localeCompare(b.sourceAssetId));
}

export function capabilitiesByArea(area: ArchitecturalCapabilityArea): readonly CapabilityIdeaRecord[] {
  return architecturalCapabilityRepository().filter(record => record.area === area);
}

export function sourcesForCapability(capability: string): readonly CapabilityIdeaRecord[] {
  return architecturalCapabilityRepository().filter(record => record.capability === capability);
}
