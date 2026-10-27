export type TopologyLayer =
  | "GEOMETRIC"
  | "ARCHITECTURAL"
  | "SPATIAL"
  | "SYSTEM_NETWORK"
  | "PARAMETRIC_DEPENDENCY";

export interface TopologyPrecedent {
  precedentId: string;
  ecosystem: "REVIT" | "ARCHICAD";
  layer: TopologyLayer;
  capabilities: readonly string[];
  arkiLesson: string;
  arkiAuthority: "REFERENCE_OR_PROVIDER_ONLY";
}

const PRECEDENTS: readonly TopologyPrecedent[] = Object.freeze([
  {
    precedentId: "revit-geometry-subelements",
    ecosystem: "REVIT",
    layer: "GEOMETRIC",
    capabilities: ["FACE", "EDGE", "POINT_ON_ELEMENT", "SUBELEMENT"],
    arkiLesson: "Keep addressable geometric subelements without confusing host identifiers with AGK identity.",
    arkiAuthority: "REFERENCE_OR_PROVIDER_ONLY",
  },
  {
    precedentId: "revit-plan-space-topology",
    ecosystem: "REVIT",
    layer: "SPATIAL",
    capabilities: ["PLAN_TOPOLOGY", "ROOM_SPACE_BOUNDARIES", "BOUNDARY_ELEMENT_RELATIONS"],
    arkiLesson: "Spatial enclosure and boundary ownership are first-class topology, distinct from raw solid topology.",
    arkiAuthority: "REFERENCE_OR_PROVIDER_ONLY",
  },
  {
    precedentId: "revit-mep-connectors",
    ecosystem: "REVIT",
    layer: "SYSTEM_NETWORK",
    capabilities: ["PHYSICAL_CONNECTOR", "LOGICAL_CONNECTOR", "SYSTEM_TRAVERSAL"],
    arkiLesson: "Network topology needs typed ports, connection semantics and traversal independent of geometric containment.",
    arkiAuthority: "REFERENCE_OR_PROVIDER_ONLY",
  },
  {
    precedentId: "archicad-body-topology",
    ecosystem: "ARCHICAD",
    layer: "GEOMETRIC",
    capabilities: ["VERTEX", "EDGE", "POLYGON", "EDGE_POLYGON_ADJACENCY"],
    arkiLesson: "Explicit incidence and adjacency should be queryable on operational geometry.",
    arkiAuthority: "REFERENCE_OR_PROVIDER_ONLY",
  },
  {
    precedentId: "archicad-polygon-identity",
    ecosystem: "ARCHICAD",
    layer: "GEOMETRIC",
    capabilities: ["PERSISTENT_VERTEX_ID", "CONTOUR_ID", "EDGE_ID"],
    arkiLesson: "Stable subelement identity across edits is a dedicated contract, not an incidental array index.",
    arkiAuthority: "REFERENCE_OR_PROVIDER_ONLY",
  },
  {
    precedentId: "archicad-wall-zone-relations",
    ecosystem: "ARCHICAD",
    layer: "ARCHITECTURAL",
    capabilities: ["WALL_CONNECTION", "ZONE_BOUNDARY", "OPENING_OWNERSHIP"],
    arkiLesson: "Architectural topology must preserve semantic relations such as bounds, hosts and connects, not only geometric contact.",
    arkiAuthority: "REFERENCE_OR_PROVIDER_ONLY",
  },
  {
    precedentId: "archicad-mep-routes",
    ecosystem: "ARCHICAD",
    layer: "SYSTEM_NETWORK",
    capabilities: ["PORT", "ROUTE", "FLOW_DIRECTION", "DOMAIN"],
    arkiLesson: "Systems are cross-scale graphs with domain and flow semantics; they must not be forced into the spatial containment chain.",
    arkiAuthority: "REFERENCE_OR_PROVIDER_ONLY",
  },
  {
    precedentId: "archicad-param-o",
    ecosystem: "ARCHICAD",
    layer: "PARAMETRIC_DEPENDENCY",
    capabilities: ["NODE_GRAPH", "PARAMETER", "TRANSFORM", "BOOLEAN", "GDL_GENERATION"],
    arkiLesson: "Parametric dependency topology can compile to a host-native object while ARKI retains its richer graph and provenance.",
    arkiAuthority: "REFERENCE_OR_PROVIDER_ONLY",
  },
]);

export function topologyPrecedents(): readonly TopologyPrecedent[] {
  return PRECEDENTS;
}
