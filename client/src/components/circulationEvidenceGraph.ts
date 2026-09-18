import type { SpatialElement, SpatialRepresentation } from "./UPAO001SpatialViewer";

export type CirculationEvidenceState = "OBSERVED" | "DERIVED" | "UNKNOWN" | "UNVERIFIED";
export type CirculationNodeKind = "CIRCULATION" | "ACCESS" | "SPACE" | "DESTINATION" | "LEVEL";
export type CirculationGraphChange = "CHANGED" | "PRESERVED" | "BROKEN" | "UNKNOWN";

export type CirculationEvidenceNode = {
  id: string;
  kind: CirculationNodeKind;
  label?: string;
  sourceElementId?: string;
  spaceId?: string;
  level?: number | null;
  state: CirculationEvidenceState;
  evidenceRefs: string[];
};

export type CirculationEvidenceEdge = {
  id: string;
  from: string;
  to: string;
  relation: "CONNECTS" | "ACCESS_TO" | "DESTINATION_OF" | "SEQUENCE";
  state: CirculationEvidenceState;
  sourceElementId?: string;
  level?: number | null;
  direction?: string;
  evidenceRefs: string[];
};

export type CirculationEvidenceGraph = {
  graphId: string;
  alternativeId: string;
  representationId: string;
  nodes: CirculationEvidenceNode[];
  edges: CirculationEvidenceEdge[];
  continuity: "OBSERVED" | "UNKNOWN" | "UNVERIFIED";
  loop: "OBSERVED" | "UNKNOWN" | "UNVERIFIED";
  spine: "OBSERVED" | "UNKNOWN" | "UNVERIFIED";
  accessibleRoute: "NOT_ASSESSED";
  compliance: "NOT_ASSESSED";
  provenance: string[];
  readOnly: true;
  noGeometryMutation: true;
  noDecision: true;
  noRecommendation: true;
};

export type CirculationGraphComparison = {
  sourceAlternativeId: string;
  resultAlternativeId: string;
  nodeChanges: Array<{ id: string; change: CirculationGraphChange; sourceState?: CirculationEvidenceNode; resultState?: CirculationEvidenceNode }>;
  edgeChanges: Array<{ id: string; change: CirculationGraphChange; sourceState?: CirculationEvidenceEdge; resultState?: CirculationEvidenceEdge }>;
  continuity: CirculationGraphChange;
  loop: CirculationGraphChange;
  spine: CirculationGraphChange;
  accessibleRoute: "NOT_ASSESSED";
  compliance: "NOT_ASSESSED";
  humanReviewRequired: true;
  noAutomaticRepair: true;
};

type RecordValue = Record<string, unknown>;
const record = (value: unknown): RecordValue => value && typeof value === "object" && !Array.isArray(value) ? value as RecordValue : {};
const stringValue = (value: unknown): string | undefined => typeof value === "string" && value.length > 0 ? value : undefined;
const stringList = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.length > 0) : [];

function label(element: SpatialElement): string | undefined { return element.labels?.es ?? element.labels?.en; }
function evidence(representation: SpatialRepresentation, element?: SpatialElement): string[] { return element ? [`SpatialRepresentation:${representation.id}`, `SpatialElement:${element.id}`, "A20-P1"] : [`SpatialRepresentation:${representation.id}`, "A20-P1"]; }
function nodeForElement(representation: SpatialRepresentation, element: SpatialElement, kind: CirculationNodeKind): CirculationEvidenceNode { const metadata = record(element.metadata); return { id: element.id, kind, label: label(element), sourceElementId: element.id, spaceId: stringValue(metadata.space_id), level: element.level, state: "OBSERVED", evidenceRefs: evidence(representation, element) }; }

function addExplicitEdges(representation: SpatialRepresentation, element: SpatialElement, nodes: CirculationEvidenceNode[], edges: CirculationEvidenceEdge[]): void {
  const metadata = record(element.metadata);
  const sourceNode = element.id;
  const targetIds = [...stringList(metadata.connects_to), ...stringList(metadata.connected_to), ...stringList(metadata.destination_space_ids), ...[stringValue(metadata.to_space_id)].filter((item): item is string => Boolean(item))];
  const uniqueTargetIds = Array.from(new Set(targetIds));
  if (!uniqueTargetIds.length) return;
  for (const targetId of uniqueTargetIds) {
    if (!nodes.some((node) => node.id === targetId)) nodes.push({ id: targetId, kind: "DESTINATION", spaceId: targetId, state: "UNVERIFIED", evidenceRefs: [...evidence(representation, element), `declared_target:${targetId}`] });
    const relation = stringList(metadata.destination_space_ids).includes(targetId) || metadata.to_space_id === targetId ? "DESTINATION_OF" : "CONNECTS";
    edges.push({ id: `${element.id}->${targetId}`, from: sourceNode, to: targetId, relation, state: "OBSERVED", sourceElementId: element.id, level: element.level, direction: stringValue(metadata.direction), evidenceRefs: [...evidence(representation, element), `metadata:${relation}`] });
  }
}

export function deriveCirculationEvidenceGraph(representation: SpatialRepresentation): CirculationEvidenceGraph {
  const circulationElements = representation.elements.filter((element) => element.element_type === "CirculationElement");
  const nodes: CirculationEvidenceNode[] = circulationElements.map((element) => nodeForElement(representation, element, "CIRCULATION"));
  const edges: CirculationEvidenceEdge[] = [];
  for (const element of circulationElements) {
    const metadata = record(element.metadata);
    if (metadata.access_point !== undefined) {
      const accessId = `${element.id}:access`;
      nodes.push({ id: accessId, kind: "ACCESS", label: String(metadata.access_point), sourceElementId: element.id, level: element.level, state: "OBSERVED", evidenceRefs: [...evidence(representation, element), "metadata:access_point"] });
      edges.push({ id: `${accessId}->${element.id}`, from: accessId, to: element.id, relation: "ACCESS_TO", state: "OBSERVED", sourceElementId: element.id, level: element.level, evidenceRefs: [...evidence(representation, element), "metadata:access_point"] });
    }
    addExplicitEdges(representation, element, nodes, edges);
  }
  const hasElements = circulationElements.length > 0;
  const hasExplicitEdges = edges.some((edge) => edge.relation === "CONNECTS" || edge.relation === "DESTINATION_OF" || edge.relation === "SEQUENCE");
  const continuity = hasExplicitEdges ? "OBSERVED" : hasElements ? "UNKNOWN" : "UNVERIFIED";
  return { graphId: `circulation-evidence:${representation.alternative_id}`, alternativeId: representation.alternative_id, representationId: representation.id, nodes, edges, continuity, loop: "UNKNOWN", spine: "UNKNOWN", accessibleRoute: "NOT_ASSESSED", compliance: "NOT_ASSESSED", provenance: ["actual SpatialRepresentation", "actual CirculationElement metadata", "A20-P1 derived circulation evidence graph"], readOnly: true, noGeometryMutation: true, noDecision: true, noRecommendation: true };
}

function compareRecord<T extends { id: string }>(source: T[], result: T[], equal: (a: T, b: T) => boolean): Array<{ id: string; change: CirculationGraphChange; sourceState?: T; resultState?: T }> {
  const sourceMap = new Map(source.map((item) => [item.id, item]));
  const resultMap = new Map(result.map((item) => [item.id, item]));
  const ids = Array.from(new Set([...Array.from(sourceMap.keys()), ...Array.from(resultMap.keys())]));
  return ids.map((id) => { const before = sourceMap.get(id); const after = resultMap.get(id); if (!before) return { id, change: "CHANGED", resultState: after }; if (!after) return { id, change: "BROKEN", sourceState: before }; return { id, change: equal(before, after) ? "PRESERVED" : "CHANGED", sourceState: before, resultState: after }; });
}
function graphStateChange(source: string, result: string): CirculationGraphChange { return source === result ? "PRESERVED" : source === "UNKNOWN" || result === "UNKNOWN" ? "UNKNOWN" : "CHANGED"; }

export function compareCirculationEvidenceGraphs(source: CirculationEvidenceGraph, result: CirculationEvidenceGraph): CirculationGraphComparison {
  return { sourceAlternativeId: source.alternativeId, resultAlternativeId: result.alternativeId, nodeChanges: compareRecord(source.nodes, result.nodes, (a, b) => a.kind === b.kind && a.spaceId === b.spaceId && a.level === b.level && a.state === b.state), edgeChanges: compareRecord(source.edges, result.edges, (a, b) => a.from === b.from && a.to === b.to && a.relation === b.relation && a.state === b.state), continuity: graphStateChange(source.continuity, result.continuity), loop: graphStateChange(source.loop, result.loop), spine: graphStateChange(source.spine, result.spine), accessibleRoute: "NOT_ASSESSED", compliance: "NOT_ASSESSED", humanReviewRequired: true, noAutomaticRepair: true };
}

export function validateCirculationEvidenceGraph(graph: CirculationEvidenceGraph): boolean { return graph.readOnly && graph.noGeometryMutation && graph.noDecision && graph.noRecommendation && graph.accessibleRoute === "NOT_ASSESSED" && graph.compliance === "NOT_ASSESSED" && graph.nodes.every((node) => node.state !== "DERIVED" || node.evidenceRefs.length > 0) && graph.edges.every((edge) => edge.evidenceRefs.length > 0); }
