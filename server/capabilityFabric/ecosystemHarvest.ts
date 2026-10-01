export type EcosystemHost = "DYNAMO" | "GRASSHOPPER" | "RHINO";
export type HarvestDisposition = "REUSE_CODE" | "ADAPT_PATTERN" | "EXTERNAL_HOST" | "REFERENCE_ONLY";

export interface EcosystemAsset {
  assetId: string;
  host: EcosystemHost;
  capabilities: readonly string[];
  disposition: HarvestDisposition;
  licenseSpdx: string | null;
  licenseVerified: boolean;
  hostRequired: boolean;
  notes: readonly string[];
}

const ASSETS: readonly EcosystemAsset[] = Object.freeze([
  {
    assetId: "dynamo-core",
    host: "DYNAMO",
    capabilities: ["NODE_GRAPH_EXECUTION", "CUSTOM_NODE_LIBRARY", "REACTIVE_RECOMPUTATION"],
    disposition: "REUSE_CODE",
    licenseSpdx: "Apache-2.0",
    licenseVerified: true,
    hostRequired: false,
    notes: ["Open-source graph engine; keep Autodesk/Revit host-specific geometry outside ARKI core."],
  },
  {
    assetId: "refinery-space-planning-toolkit",
    host: "DYNAMO",
    capabilities: ["SPACE_SUBDIVISION", "PROGRAM_ALLOCATION", "AMENITY_SPACE_GENERATION", "SPACE_PLANNING_ANALYSIS"],
    disposition: "REUSE_CODE",
    licenseSpdx: "Apache-2.0",
    licenseVerified: true,
    hostRequired: false,
    notes: ["Official DynamoDS RefineryToolkits source; Generate/Analyse/Rank/Explore architecture; non-Revit projects run in Dynamo Sandbox."],
  },
  {
    assetId: "space-analysis",
    host: "DYNAMO",
    capabilities: ["PATHFINDING_2D", "VISIBILITY_ANALYSIS", "ACOUSTIC_SPACE_ANALYSIS", "SPATIAL_LATTICE"],
    disposition: "ADAPT_PATTERN",
    licenseSpdx: null,
    licenseVerified: false,
    hostRequired: false,
    notes: ["Autodesk Research 2D spatial analysis package; verify distributable source/license before code reuse."],
  },
  {
    assetId: "vasa",
    host: "DYNAMO",
    capabilities: ["VOXELIZE_ARCHITECTURAL_MODEL", "PATHFINDING_3D", "VISIBILITY_ANALYSIS_3D", "DIRECT_DAYLIGHT_VOXEL", "VOXEL_SPACE_OPERATIONS"],
    disposition: "ADAPT_PATTERN",
    licenseSpdx: null,
    licenseVerified: false,
    hostRequired: false,
    notes: ["Autodesk Research successor to SpaceAnalysis; common voxel representation enables composable analyses. Verify package license/source before reuse."],
  },
  {
    assetId: "project-rediscover",
    host: "DYNAMO",
    capabilities: ["NEIGHBORHOOD_GENERATION", "VORONOI_SPACE_SUBDIVISION", "AMENITY_PLACEMENT", "DESK_LAYOUT", "BUZZ_METRIC", "ADJACENCY_METRIC", "VISUAL_DISTRACTION_METRIC", "VIEWS_METRIC", "WORKSTYLE_METRIC", "DAYLIGHT_METRIC"],
    disposition: "ADAPT_PATTERN",
    licenseSpdx: null,
    licenseVerified: false,
    hostRequired: false,
    notes: ["Public Dynamo/Refinery reference workflow; harvest architectural algorithms and metrics, not canonical geometry."],
  },
  {
    assetId: "clockwork",
    host: "DYNAMO",
    capabilities: ["LIST_OPERATIONS", "GEOMETRY_UTILITIES", "PANELING", "REVIT_AUTOMATION_PATTERNS"],
    disposition: "ADAPT_PATTERN",
    licenseSpdx: "MIT",
    licenseVerified: true,
    hostRequired: false,
    notes: ["450+ nodes; harvest atomic algorithms instead of importing package wholesale."],
  },
  {
    assetId: "rhythm-core",
    host: "DYNAMO",
    capabilities: ["GENERAL_BIM_HELPERS", "DYNAMO_AUTOMATION_PATTERNS"],
    disposition: "ADAPT_PATTERN",
    licenseSpdx: "BSD-3-Clause",
    licenseVerified: true,
    hostRequired: false,
    notes: ["Prefer host-independent Rhythm Core concepts; Revit/UI sublibraries remain host-bound."],
  },
  {
    assetId: "data-shapes",
    host: "DYNAMO",
    capabilities: ["PARAMETRIC_USER_INPUT", "WORKFLOW_UI", "BIM_MANAGEMENT_PATTERNS"],
    disposition: "ADAPT_PATTERN",
    licenseSpdx: "MIT",
    licenseVerified: true,
    hostRequired: true,
    notes: ["Useful interaction/workflow patterns; do not make WPF/Revit UI a core dependency."],
  },
  {
    assetId: "genius-loci",
    host: "DYNAMO",
    capabilities: ["REVIT_AUTOMATION_PATTERNS", "BIM_INTEROPERABILITY_PATTERNS", "GEOMETRY_UTILITIES"],
    disposition: "ADAPT_PATTERN",
    licenseSpdx: "MIT",
    licenseVerified: true,
    hostRequired: true,
    notes: ["350+ mostly Python/Revit nodes; mine algorithms and interoperability patterns selectively."],
  },
  {
    assetId: "spring-nodes",
    host: "DYNAMO",
    capabilities: ["REVIT_AUTOMATION_PATTERNS", "BIM_WORKFLOW_ACCELERATION"],
    disposition: "ADAPT_PATTERN",
    licenseSpdx: "MIT",
    licenseVerified: true,
    hostRequired: true,
    notes: ["IronPython/DesignScript package; selective pattern harvest only."],
  },
  {
    assetId: "rhino-compute",
    host: "RHINO",
    capabilities: ["RHINOCOMMON_REMOTE_GEOMETRY", "GRASSHOPPER_REMOTE_EXECUTION", "RHINO_PLUGIN_REMOTE_ACCESS"],
    disposition: "EXTERNAL_HOST",
    licenseSpdx: null,
    licenseVerified: false,
    hostRequired: true,
    notes: ["Commercial Rhino runtime/licensing applies; never canonical geometry authority."],
  },
  {
    assetId: "rhino-inside-revit",
    host: "RHINO",
    capabilities: ["RHINO_REVIT_INTEROP", "GRASSHOPPER_REVIT_INTEROP"],
    disposition: "EXTERNAL_HOST",
    licenseSpdx: null,
    licenseVerified: false,
    hostRequired: true,
    notes: ["Interop bridge candidate, not ARKI core."],
  },
  {
    assetId: "human-ui",
    host: "GRASSHOPPER",
    capabilities: ["PARAMETRIC_USER_INPUT", "DESIGN_TOOL_UI_PATTERNS"],
    disposition: "ADAPT_PATTERN",
    licenseSpdx: "MIT",
    licenseVerified: true,
    hostRequired: true,
    notes: ["Harvest UI/workflow concepts; WPF implementation is host/platform-specific."],
  },
  {
    assetId: "human",
    host: "GRASSHOPPER",
    capabilities: ["RHINO_OBJECT_ATTRIBUTES", "BLOCK_WORKFLOWS", "CUSTOM_DISPLAY"],
    disposition: "EXTERNAL_HOST",
    licenseSpdx: null,
    licenseVerified: false,
    hostRequired: true,
    notes: ["Candidate Rhino document capability provider."],
  },
  {
    assetId: "elefront",
    host: "GRASSHOPPER",
    capabilities: ["RHINO_OBJECT_ATTRIBUTES", "MODEL_DATA_FILTERING", "BLOCK_WORKFLOWS"],
    disposition: "EXTERNAL_HOST",
    licenseSpdx: null,
    licenseVerified: false,
    hostRequired: true,
    notes: ["Strong semantic-object workflow reference; license must be verified before code reuse."],
  },
  {
    assetId: "pufferfish",
    host: "GRASSHOPPER",
    capabilities: ["MORPHING", "TWEENING", "BLENDING", "GEOMETRIC_INTERPOLATION"],
    disposition: "EXTERNAL_HOST",
    licenseSpdx: null,
    licenseVerified: false,
    hostRequired: true,
    notes: ["330-component shape-changing toolkit; harvest capability map before any dependency."],
  },
  {
    assetId: "weaverbird",
    host: "GRASSHOPPER",
    capabilities: ["MESH_SUBDIVISION", "MESH_SMOOTHING", "MESH_TRANSFORM"],
    disposition: "REFERENCE_ONLY",
    licenseSpdx: null,
    licenseVerified: false,
    hostRequired: true,
    notes: ["Algorithms overlap mature mesh libraries; prefer independent open implementations when available."],
  },
  {
    assetId: "lunchbox",
    host: "GRASSHOPPER",
    capabilities: ["PANELING", "TESSELLATION", "GEOMETRY_ANALYSIS", "DATA_WORKFLOW"],
    disposition: "ADAPT_PATTERN",
    licenseSpdx: "LGPL-2.1-or-later",
    licenseVerified: true,
    hostRequired: true,
    notes: ["Selective harvest; do not pull host package wholesale into ARKI core."],
  },
]);

export function ecosystemAssets(): readonly EcosystemAsset[] {
  return ASSETS;
}

export function reusableAssets(): readonly EcosystemAsset[] {
  return ASSETS.filter(asset =>
    asset.licenseVerified &&
    (asset.disposition === "REUSE_CODE" || asset.disposition === "ADAPT_PATTERN"),
  );
}
