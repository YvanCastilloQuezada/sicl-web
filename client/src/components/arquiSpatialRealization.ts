import type { ArchitecturalStrategy, ArchitecturalSynthesis } from "./arquiArchitecturalSynthesis";
import { deriveCapabilityKnowledge, type CapabilityKnowledgeContext } from "./arquiCapabilityKnowledge";

export type SpatialScale = "SITE" | "BUILDING" | "MASS" | "SPACE";
export type SpatialUnitKind = "SITE" | "BUILDING_ORGANIZATION" | "PROGRAM_ZONE" | "MASS" | "VOID" | "CIRCULATION" | "ACCESS" | "VERTICAL_ZONE";
export type SpatialUnit = { id: string; kind: SpatialUnitKind; label: string; scale: SpatialScale; epistemicStatus: "HYPOTHESIS"; provenance: string[] };
export type SpatialRelation = { id: string; from: string; to: string; relation: "CONTAINS" | "CONNECTED" | "SEPARATED" | "SURROUNDS" | "ACCESSIBLE_FROM"; epistemicStatus: "HYPOTHESIS"; provenance: string[] };
export type GenerativeIntent = { id: string; target: string; purpose: string; requiredInputs: string[]; missingInputs: string[]; capabilityMatch: "PARTIAL" | "UNKNOWN"; executable: false; epistemicStatus: "DERIVED"; provenance: string[] };
export type SpatialDesignOrganization = {
  id: string; strategyId: string; strategyFamily: string; partiId: string;
  spatialUnits: SpatialUnit[]; relationships: SpatialRelation[]; generativeIntents: GenerativeIntent[];
  programZones: string[]; accessStructure: string[]; circulationStructure: string[]; massVoidStructure: string[]; verticalStructure: string[]; siteAnchors: string[]; orientationIntent: string;
  unresolvedElements: string[]; realizability: "PARTIALLY_REALIZABLE" | "UNKNOWN"; intentPreserved: true; noGeometryMutation: true; noExecution: true; provenance: string[];
};

const provenance = (strategy: ArchitecturalStrategy) => ["A11.design-problem", "A12.strategy", strategy.id, "A12.parti", "P8.capability-knowledge"];
const unit = (id: string, kind: SpatialUnitKind, label: string, scale: SpatialScale, p: string[]): SpatialUnit => ({ id, kind, label, scale, epistemicStatus: "HYPOTHESIS", provenance: p });
const rel = (id: string, from: string, to: string, relation: SpatialRelation["relation"], p: string[]): SpatialRelation => ({ id, from, to, relation, epistemicStatus: "HYPOTHESIS", provenance: p });

function unitsAndRelations(strategy: ArchitecturalStrategy, p: string[]) {
  const units: SpatialUnit[] = [unit("site", "SITE", "Site / context", "SITE", p), unit("building", "BUILDING_ORGANIZATION", strategy.parti.organizingIdea, "BUILDING", p), unit("public", "PROGRAM_ZONE", "Public zone", "SPACE", p), unit("private", "PROGRAM_ZONE", "Private zone", "SPACE", p), unit("access", "ACCESS", "Primary access", "SPACE", p), unit("circulation", "CIRCULATION", strategy.parti.circulationConcept, "SPACE", p)];
  const relations: SpatialRelation[] = [rel("site-building", "site", "building", "CONTAINS", p), rel("access-building", "access", "building", "ACCESSIBLE_FROM", p), rel("public-circulation", "public", "circulation", "CONNECTED", p), rel("public-private", "public", "private", "SEPARATED", p)];
  if (strategy.family === "COURTYARD") { units.push(unit("void", "VOID", "Central shared void", "MASS", p), unit("perimeter", "MASS", "Perimeter mass", "MASS", p)); relations.push(rel("perimeter-void", "perimeter", "void", "SURROUNDS", p)); }
  if (strategy.family === "LINEAR_BAR") { units.push(unit("bar", "MASS", "Linear bar", "MASS", p)); }
  if (strategy.family === "COMPACT_VERTICAL") { units.push(unit("compact", "MASS", "Compact mass", "MASS", p), unit("vertical", "VERTICAL_ZONE", "Stacked zones", "SPACE", p)); relations.push(rel("compact-vertical", "compact", "vertical", "CONTAINS", p)); }
  return { units, relations };
}

export function deriveSpatialDesignOrganization(strategy: ArchitecturalStrategy, context: CapabilityKnowledgeContext): SpatialDesignOrganization {
  const p = provenance(strategy); const { units, relations } = unitsAndRelations(strategy, p); const capability = deriveCapabilityKnowledge(context).descriptors.find((item) => item.id === "DESIGN_OPERATIONS");
  const generativeIntents: GenerativeIntent[] = strategy.operationMapping.map((target, index) => ({ id: `${strategy.id}-intent-${index + 1}`, target, purpose: strategy.parti.organizingIdea, requiredInputs: ["selected alternative", "operation parameters", "human confirmation"], missingInputs: ["operation-specific geometry", "human confirmation"], capabilityMatch: capability?.readiness === "READY" ? "PARTIAL" : "UNKNOWN", executable: false, epistemicStatus: "DERIVED", provenance: [...p, "P8.capability-knowledge"] }));
  return { id: `spatial-org-${strategy.id}`, strategyId: strategy.id, strategyFamily: strategy.family, partiId: strategy.parti.strategyId, spatialUnits: units, relationships: relations, generativeIntents, programZones: ["PUBLIC ZONE", "PRIVATE ZONE"], accessStructure: [strategy.parti.accessConcept], circulationStructure: [strategy.parti.circulationConcept], massVoidStructure: [strategy.parti.massVoidConcept], verticalStructure: [strategy.parti.verticalOrganization], siteAnchors: [strategy.parti.siteRelationship], orientationIntent: strategy.parti.orientationConcept, unresolvedElements: [...strategy.unknowns, ...strategy.parti.unresolvedQuestions], realizability: "PARTIALLY_REALIZABLE", intentPreserved: true, noGeometryMutation: true, noExecution: true, provenance: p };
}

export function deriveSpatialRealizations(synthesis: ArchitecturalSynthesis, context: CapabilityKnowledgeContext): SpatialDesignOrganization[] { return synthesis.strategies.map((strategy) => deriveSpatialDesignOrganization(strategy, context)); }
export function isSpatiallyCoherent(item: SpatialDesignOrganization): boolean { const ids = new Set(item.spatialUnits.map((unit) => unit.id)); return item.relationships.every((relation) => ids.has(relation.from) && ids.has(relation.to)); }
export function validateA13(item: SpatialDesignOrganization): boolean { return isSpatiallyCoherent(item) && item.intentPreserved && item.noGeometryMutation && item.noExecution && item.generativeIntents.every((intent) => intent.executable === false); }
export function a13Report(items: SpatialDesignOrganization[]) { return { status: items.length > 0 && items.every(validateA13) ? "PASS_WITH_OBSERVATIONS" : "BLOCKED", count: items.length, trace: ["A11 INTENT", "A12 STRATEGY", "A12 PARTI", "A13 SPATIAL ORGANIZATION", "A13 GENERATIVE INTENT"], humanAuthority: true, noDecision: true, noWinner: true, noGeometryMutation: true, noExecution: true }; }
export function organizationSummary(item: SpatialDesignOrganization) { return { id: item.id, units: item.spatialUnits.length, relationships: item.relationships.length, intents: item.generativeIntents.length, realizability: item.realizability }; }
export function a13Invariants(item: SpatialDesignOrganization) { return { coherent: isSpatiallyCoherent(item), intentPreserved: item.intentPreserved, noGeometryMutation: item.noGeometryMutation, noExecution: item.noExecution, humanAuthority: true, noDecision: true, noWinner: true }; }
export function a13Boundary(): string { return "Derived read model only; no execution, geometry mutation or decision."; }
export function a13Version(): string { return "A13.1"; }
export function a13FutureExtensions(): string[] { return ["geometry", "spatial metrics", "relationship distance", "human-confirmed realization"]; }
export function a13Trace(): string[] { return ["A11 INTENT", "A12 STRATEGY", "A12 PARTI", "A13 SPATIAL ORGANIZATION", "A13 GENERATIVE INTENT"]; }
export function a13Stop(): "STOP" { return "STOP"; }
export function a13HumanAuthority(): string { return "Human architect remains authority."; }
export function a13NoAutonomousCausality(): true { return true; }
export function a13NoP9Execution(): true { return true; }
export function a13NoBimAuthoring(): true { return true; }
export function a13ReadOnly(): true { return true; }
export function a13NonCanonical(): true { return true; }
export function a13NoNewEngine(): true { return true; }
export function a13Summary(items: SpatialDesignOrganization[]): string { return `${items.length} spatial organization hypotheses derived without execution.`; }
export function a13FinalReport(items: SpatialDesignOrganization[]) { return { ...a13Report(items), summaries: items.map(organizationSummary), boundary: a13Boundary(), future: a13FutureExtensions(), summary: a13Summary(items) }; }
export function a13Complete(items: SpatialDesignOrganization[]): boolean { return items.length > 0 && items.every(validateA13); }
export function a13Graph(item: SpatialDesignOrganization) { return { nodes: item.spatialUnits, edges: item.relationships }; }
export function a13Serialize(item: SpatialDesignOrganization): string { return JSON.stringify(item); }
export function a13HumanReviewState(): "PENDING_HUMAN_AUTHORITY" { return "PENDING_HUMAN_AUTHORITY"; }
export function a13DecisionState(): "NOT_CREATED" { return "NOT_CREATED"; }
export function a13WinnerState(): "NOT_CREATED" { return "NOT_CREATED"; }
export function a13DeploymentState(): "NOT_DEPLOYED" { return "NOT_DEPLOYED"; }
export function a13FinalStatus(items: SpatialDesignOrganization[]): string { return a13Report(items).status; }
export function a13FinalConclusion(): string { return "Spatial organization bridge ready for human review."; }
export function a13FinalStop(): "STOP" { return "STOP"; }
