import { createHash } from "node:crypto";
import type { ParametricGraph } from "./arkiParametricRuntime";

export type ArkGeometry = { kind: "RECTANGULAR_MASS" | "COURTYARD_MASS" | "POINTS"; width: number; depth: number; height: number; floors: number; courtyardRatio?: number; points?: Array<[number, number, number]> };
export type ArkCanonicalSections = { manifest: { contractVersion: "ARKI-ARK-1.0"; createdAt: string; humanReviewRequired: true }; project: { projectId: string; name: string }; geometry: ArkGeometry; semantics: { entities: Array<{ id: string; kind: "VOLUMETRIC_ENTITY" | "POINT_ENTITY"; certainty: "OBSERVED" | "INFERRED" }>; relations: Array<{ subject: string; predicate: string; object: string; certainty: "OBSERVED" | "INFERRED" }> }; provenance: { sources: string[]; externalArtifacts: string[] }; requirements: string[]; objectives: string[]; constraints: string[]; preferences: string[]; alternatives: Array<{ id: string; label: string; status: "CANDIDATE" | "REJECTED" | "SELECTED" }>; evaluations: Array<{ id: string; criterion: string; status: "NOT_RUN" | "UNKNOWN" | "PASS" | "FAIL"; value?: number; unit?: string }>; unknowns: string[]; conflicts: string[]; decisions: Array<{ id: string; status: "NOT_DECIDED" | "HUMAN_APPROVED"; statement: string }>; history: Array<{ event: string; at: string }>; externalArtifacts: string[] };
export type ArkProposal = ArkCanonicalSections & { formatVersion: "ARKI-ARK-1.0"; projectId: string; name: string; source: { fileName?: string; artifactId?: string; checksum?: string; provenance: string[] }; graph?: ParametricGraph; observations: string[]; humanReviewRequired: true; createdAt: string };

function safeName(value: string) { return value.trim().replace(/[^a-zA-Z0-9_-]+/g, "_").replace(/^_+|_+$/g, "") || "arki_proposal"; }
function checksum(value: string) { return `sha256:${createHash("sha256").update(value).digest("hex")}`; }
export function arkFileName(name: string) { return `${safeName(name)}.ark`; }

export function createArkProposal(input: { projectId: string; name: string; geometry: ArkGeometry; graph?: ParametricGraph; source?: ArkProposal["source"]; observations?: string[]; unknowns?: string[] }): ArkProposal {
  const createdAt = new Date().toISOString();
  const name = safeName(input.name);
  const entityKind = input.geometry.kind === "POINTS" ? "POINT_ENTITY" as const : "VOLUMETRIC_ENTITY" as const;
  const unknowns = input.unknowns ?? ["Material, structure, code compliance and site fit require project evidence", "Exact program assignment is not evidenced", "Occupancy and fire strategy are not evidenced"];
  return { formatVersion: "ARKI-ARK-1.0", projectId: input.projectId, name, source: { ...input.source, provenance: input.source?.provenance ?? ["ARKI-PARAMETRIC-RUNTIME"] }, graph: input.graph, observations: input.observations ?? ["Parametric geometry observed from an external or local result"], humanReviewRequired: true, createdAt, project: { projectId: input.projectId, name }, manifest: { contractVersion: "ARKI-ARK-1.0", createdAt, humanReviewRequired: true }, geometry: input.geometry, semantics: { entities: [{ id: "GEOM-001", kind: entityKind, certainty: "OBSERVED" }], relations: [], }, provenance: { sources: input.source?.provenance ?? ["ARKI-PARAMETRIC-RUNTIME"], externalArtifacts: input.source?.fileName ? [input.source.fileName] : [] }, requirements: [], objectives: [], constraints: [], preferences: [], alternatives: [{ id: "ALT-001", label: "Imported parametric proposal", status: "CANDIDATE" }], evaluations: [{ id: "EVAL-FUNCTION", criterion: "Functional program and circulation", status: "NOT_RUN" }, { id: "EVAL-CODE", criterion: "Jurisdictional and dimensional compliance", status: "NOT_RUN" }, { id: "EVAL-DAYLIGHT", criterion: "Daylight and ventilation", status: "NOT_RUN" }], unknowns, conflicts: [], decisions: [{ id: "DEC-001", status: "NOT_DECIDED", statement: "No human decision has approved this proposal" }], history: [{ event: "IMPORTED_AS_PROPOSAL", at: createdAt }], externalArtifacts: input.source?.fileName ? [input.source.fileName] : [] };
}

export function serializeArkProposal(proposal: ArkProposal) { return `${JSON.stringify(proposal, null, 2)}\n`; }
export function parseArkProposal(raw: string): ArkProposal | { status: "REJECTED"; reason: string } {
  try {
    const value = JSON.parse(raw) as Partial<ArkProposal>;
    if (value.formatVersion !== "ARKI-ARK-1.0" || typeof value.projectId !== "string" || !value.geometry || value.humanReviewRequired !== true) return { status: "REJECTED", reason: "ARK file must declare ARKI-ARK-1.0, projectId, geometry and humanReviewRequired=true" };
    const complete = value as ArkProposal;
    if (!complete.semantics || !complete.manifest || !complete.evaluations || !complete.alternatives || !complete.decisions) return { status: "REJECTED", reason: "ARK file is missing canonical architectural sections" };
    return complete;
  } catch { return { status: "REJECTED", reason: "ARK file is not valid JSON" }; }
}

export function interpretArkProposal(proposal: ArkProposal) {
  const observed = proposal.semantics.entities.filter((entity) => entity.certainty === "OBSERVED").map((entity) => entity.id);
  const inferred = proposal.semantics.entities.filter((entity) => entity.certainty === "INFERRED").map((entity) => entity.id);
  const conflicts = [...proposal.conflicts];
  if (proposal.geometry.kind !== "POINTS" && proposal.geometry.floors > 10) conflicts.push("High-rise behavior requires structural and regulatory evidence");
  return { status: "INTERPRETED" as const, projectId: proposal.projectId, sourceName: proposal.name, observed, inferred, unknowns: proposal.unknowns, conflicts, deficits: ["Public/private transition unresolved until program evidence exists", "Circulation and functional adjacency not yet verified"], opportunities: ["Generate alternatives while preserving dimensional constraints", "Test courtyard/daylight hypotheses", "Compare program distributions before human review"], nextSteps: ["Relate geometry to project requirements", "Run functional, code, daylight and cost evaluations", "Generate candidates", "Request human review before assimilation"], humanReviewRequired: true, noAutomaticDecision: true };
}

export function architecturalAssimilation(proposal: ArkProposal) { return { ...interpretArkProposal(proposal), status: "PROPOSAL_IMPORTED" as const, architecturalRole: proposal.geometry.kind === "POINTS" ? "CONCEPTUAL_GEOMETRY" : "VOLUMETRIC_PROPOSAL", preservedRules: ["dimensions", "floors", "geometry provenance", "canonical sections"] }; }

export function exportDynamoGraph(graph: ParametricGraph, projectId: string) { return JSON.stringify({ Version: "3.0.0", IsCustomNode: false, geometryScaling: "Metric", RunType: "Manual", Nodes: graph.nodes.map((node, index) => ({ ConcreteType: "Dynamo.Graph.Nodes.ZeroTouch.DSFunction", NodeId: node.id, Id: node.id, Name: node.op, FunctionSignature: `ARKI.${node.op}`, X: 120 + index * 240, Y: 160, Inputs: node.params })), Connectors: [], Notes: [`ARKI project: ${projectId}`, "Generated exchange preview; execute only in an approved Dynamo/Revit host."] }, null, 2); }
export function exportGrasshopperXml(graph: ParametricGraph, projectId: string) { const nodes = graph.nodes.map((node, index) => `<chunk name="ARKI_${node.op}" index="${index}" id="${node.id}" x="${120 + index * 240}" y="160"><items><item name="projectId">${projectId}</item><item name="params">${escapeXml(JSON.stringify(node.params))}</item></items></chunk>`).join(""); return `<?xml version="1.0" encoding="utf-8"?><Archive name="ARKI Grasshopper Exchange" major_version="1" minor_version="0"><items><item name="contractVersion">ARKI-PARAMETRIC-1.0</item><item name="humanReviewRequired">true</item><item name="projectId">${escapeXml(projectId)}</item>${nodes}</items></Archive>`; }
function escapeXml(value: string) { return value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character] ?? character); }

export function exchangePackage(input: { projectId: string; name: string; geometry: ArkGeometry; graph: ParametricGraph }) { const ark = serializeArkProposal(createArkProposal(input)); const dyn = exportDynamoGraph(input.graph, input.projectId); const ghx = exportGrasshopperXml(input.graph, input.projectId); return { files: [{ fileName: arkFileName(input.name), format: "ARK", content: ark }, { fileName: `${safeName(input.name)}.dyn`, format: "DYN", content: dyn }, { fileName: `${safeName(input.name)}.ghx`, format: "GHX", content: ghx }], manifest: { contractVersion: "ARKI-EXCHANGE-PACKAGE-1.0", projectId: input.projectId, checksums: { ark: checksum(ark), dyn: checksum(dyn), ghx: checksum(ghx) }, nativeRevit: "HOST_REQUIRED", nativeRhino: "HOST_REQUIRED", humanReviewRequired: true } }; }
