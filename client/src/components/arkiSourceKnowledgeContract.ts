import type { K1Context, K1Provenance } from "./arkiLearningContract";
import { createK1ReadModel, proposeKnowledgeCandidate, validateKnowledgeCandidate } from "./arkiLearningContract";
import { ARKI_K2_DOMAINS, K2_SPATIAL_SCOPES, type K2Output } from "./arkiKnowledgeCurriculum";
type K3Provenance = K1Provenance;

export const K3_SOURCE_TYPES = ["BOOK", "PAPER", "STANDARD", "REGULATION", "MANUAL", "THESIS", "TECHNICAL_GUIDE", "CATALOG", "PRECEDENT_DOCUMENTATION", "DATASET", "PROJECT_DOCUMENTATION", "POST_OCCUPANCY_STUDY", "OTHER"] as const;
export type K3SourceType = typeof K3_SOURCE_TYPES[number];
export type K3Rights = "UNKNOWN" | "USER_PROVIDED" | "LICENSED" | "PUBLIC_DOMAIN" | "OPEN_LICENSE" | "RESTRICTED" | "INTERNAL" | "OTHER";
export type K3Validity = "CURRENT" | "UNKNOWN_VALIDITY" | "SUPERSEDED";
export type K3Location = { page?: number; pageRange?: string; chapter?: string; section?: string; paragraph?: string; record?: string; clause?: string };
export type K3SourceRecord = { sourceId: string; sourceType: K3SourceType; title: string; author: string; edition?: string; publicationDate?: string; language: string; publisher?: string; jurisdiction?: string; rights: K3Rights; origin: "CONTROLLED_FIXTURE" | "HUMAN_ENTERED" | "DETERMINISTIC_TRANSFORMATION"; fingerprint: string; metadataProvenance: string[]; validity: K3Validity };
export type K3ContentUnit = { contentUnitId: string; sourceId: string; location: K3Location; text: string; contentType: "PASSAGE" | "STATEMENT" | "CLAUSE" | "PRECEDENT_OBSERVATION" | "MEASURED_RESULT"; provenance: K3Provenance };
export type K3ClaimType = "DEFINITION" | "SOURCE_STATEMENT" | "AUTHOR_POSITION" | "DESIGN_PRINCIPLE" | "STRATEGY_CANDIDATE" | "PATTERN_CANDIDATE" | "METHOD" | "PRECEDENT_OBSERVATION" | "MEASURED_RESULT" | "REGULATORY_REQUIREMENT_CANDIDATE" | "LIMITATION" | "CONTRADICTION" | "OPEN_QUESTION" | "UNKNOWN";
export type K3DomainOwnership = "ARKI_GENERAL" | "SPECIALIST_DEEP" | "CROSS_CUTTING";
export type K3KnowledgeUnit = { knowledgeUnitId: string; contentUnitId: string; sourceId: string; sourceLocation: K3Location; domainIds: string[]; ownership: K3DomainOwnership; topic: string; claimType: K3ClaimType; claim: string; epistemicStatus: "SOURCE_STATEMENT" | "AUTHOR_POSITION" | "FACT" | "INTERPRETATION" | "HYPOTHESIS" | "UNKNOWN"; context: K1Context; spatialScope: string; designStage: string; typology?: string; geographicContext?: string; jurisdiction?: string; applicability: "APPLICABLE_IN_CONTEXT" | "POTENTIALLY_APPLICABLE" | "CONTEXT_BOUNDED" | "UNKNOWN_APPLICABILITY" | "NOT_APPLICABLE" | "SUPERSEDED"; evidenceRequirement: string; validationState: "EXTRACTED" | "CLASSIFIED" | "KNOWLEDGE_CANDIDATE" | "HUMAN_VALIDATED" | "REJECTED" | "SUPERSEDED" | "UNKNOWN_VALIDITY"; provenance: K3Provenance; output: K2Output; sourceAuthority: "UNKNOWN" | "NO" };
export type K3Contradiction = { contradictionId: string; knowledgeUnitIds: string[]; description: string; preserved: true; winnerCreated: false };
export type K3ReadModel = { sources: K3SourceRecord[]; contentUnits: K3ContentUnit[]; knowledgeUnits: K3KnowledgeUnit[]; contradictions: K3Contradiction[]; k1: ReturnType<typeof createK1ReadModel>; noAutomaticPromotion: true; noAutomaticDecision: true; noAutomaticWinner: true; retrieval: "NOT_ACTIVATED"; federation: "FROZEN_NOT_ACTIVATED"; fullSourceStorage: "NOT_IMPLEMENTED" };

const timestamp = "2026-09-18T00:00:00.000Z";
const provenance = (sourceClass: K1Provenance["sourceClass"], refs: string[]): K1Provenance => ({ sourceClass, sourceRefs: refs, capturedBy: "SYSTEM", capturedAt: timestamp, evidenceRefs: [], humanReviewState: "PENDING" });
const validLocation = (location: K3Location) => Object.values(location).some(Boolean);
const domainExists = (id: string) => ARKI_K2_DOMAINS.some((domain) => domain.id === id);

export function createK3ReadModel() : K3ReadModel { return { sources: [], contentUnits: [], knowledgeUnits: [], contradictions: [], k1: createK1ReadModel("K3-CONTROLLED-PROJECT"), noAutomaticPromotion: true, noAutomaticDecision: true, noAutomaticWinner: true, retrieval: "NOT_ACTIVATED", federation: "FROZEN_NOT_ACTIVATED", fullSourceStorage: "NOT_IMPLEMENTED" }; }

export function registerSource(model: K3ReadModel, source: K3SourceRecord): K3ReadModel {
  if (model.sources.some((item) => item.fingerprint === source.fingerprint)) return model;
  return { ...model, sources: [...model.sources, source] };
}
export function addContentUnit(model: K3ReadModel, unit: K3ContentUnit): K3ReadModel {
  if (!model.sources.some((source) => source.sourceId === unit.sourceId) || !validLocation(unit.location)) return model;
  if (model.contentUnits.some((item) => item.contentUnitId === unit.contentUnitId)) return model;
  return { ...model, contentUnits: [...model.contentUnits, unit] };
}
export function deriveKnowledgeUnit(model: K3ReadModel, unit: Omit<K3KnowledgeUnit, "validationState" | "applicability" | "sourceAuthority"> & { applicability?: K3KnowledgeUnit["applicability"]; sourceAuthority?: K3KnowledgeUnit["sourceAuthority"] }): K3ReadModel {
  if (!model.sources.some((source) => source.sourceId === unit.sourceId) || !model.contentUnits.some((content) => content.contentUnitId === unit.contentUnitId && content.sourceId === unit.sourceId) || !validLocation(unit.sourceLocation) || !unit.domainIds.length || !unit.domainIds.every(domainExists)) return model;
  if (model.knowledgeUnits.some((item) => item.sourceId === unit.sourceId && item.contentUnitId === unit.contentUnitId && item.claim === unit.claim)) return model;
  const knowledge: K3KnowledgeUnit = { ...unit, validationState: "KNOWLEDGE_CANDIDATE", applicability: unit.applicability ?? "UNKNOWN_APPLICABILITY", sourceAuthority: unit.sourceAuthority ?? "UNKNOWN" };
  return { ...model, knowledgeUnits: [...model.knowledgeUnits, knowledge] };
}
export function humanValidate(model: K3ReadModel, knowledgeUnitId: string, action: "CONFIRM" | "CORRECT" | "REJECT" | "LIMIT_CONTEXT", correctedClaim?: string): K3ReadModel {
  return { ...model, knowledgeUnits: model.knowledgeUnits.map((unit) => unit.knowledgeUnitId !== knowledgeUnitId ? unit : action === "REJECT" ? { ...unit, validationState: "REJECTED" } : { ...unit, claim: correctedClaim ?? unit.claim, validationState: "HUMAN_VALIDATED", applicability: action === "LIMIT_CONTEXT" ? "CONTEXT_BOUNDED" : unit.applicability, provenance: { ...unit.provenance, humanReviewState: "CONFIRMED", sourceRefs: [...unit.provenance.sourceRefs, `human:${action}`] } }) };
}
export function reconstructSourceTrace(model: K3ReadModel, knowledgeUnitId: string) { const knowledge = model.knowledgeUnits.find((item) => item.knowledgeUnitId === knowledgeUnitId); const content = knowledge && model.contentUnits.find((item) => item.contentUnitId === knowledge.contentUnitId); const source = content && model.sources.find((item) => item.sourceId === content.sourceId); return knowledge && content && source ? { knowledge, content, source } : undefined; }
export function addContradiction(model: K3ReadModel, contradiction: Omit<K3Contradiction, "preserved" | "winnerCreated">): K3ReadModel { return { ...model, contradictions: [...model.contradictions, { ...contradiction, preserved: true, winnerCreated: false }] }; }
export function sourceFixture(id: "A" | "B"): K3SourceRecord { return id === "A" ? { sourceId: "K3-FIXTURE-HOUSING-001", sourceType: "BOOK", title: "Controlled Housing Design Fixture", author: "K3 Test Author", language: "en", rights: "CONTROLLED_FIXTURE" as K3Rights, origin: "CONTROLLED_FIXTURE", fingerprint: "fixture:housing:001", metadataProvenance: ["K3 synthetic fixture"], validity: "CURRENT" } : { sourceId: "K3-FIXTURE-HOUSING-002", sourceType: "BOOK", title: "Controlled Compact Housing Fixture", author: "K3 Test Author B", language: "en", rights: "CONTROLLED_FIXTURE" as K3Rights, origin: "CONTROLLED_FIXTURE", fingerprint: "fixture:housing:002", metadataProvenance: ["K3 synthetic fixture"], validity: "CURRENT" }; }
export function buildK3Fixture() {
  let model = registerSource(registerSource(createK3ReadModel(), sourceFixture("A")), sourceFixture("B"));
  const base = { projectId: undefined, spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT", geographicContext: "UNKNOWN" } satisfies K1Context;
  model = addContentUnit(model, { contentUnitId: "K3-CU-A", sourceId: "K3-FIXTURE-HOUSING-001", location: { page: 1, section: "Synthetic statement A" }, text: "Courtyard organization may support a relationship between interior domestic spaces and a protected outdoor space in some housing contexts.", contentType: "STATEMENT", provenance: provenance("BOOK", ["K3-FIXTURE-HOUSING-001", "page:1"]) });
  model = addContentUnit(model, { contentUnitId: "K3-CU-B", sourceId: "K3-FIXTURE-HOUSING-002", location: { page: 1, section: "Synthetic statement B" }, text: "Compact organization may reduce circulation distance and external envelope in some housing contexts.", contentType: "STATEMENT", provenance: provenance("BOOK", ["K3-FIXTURE-HOUSING-002", "page:1"]) });
  const make = (id: string, cu: string, sourceId: string, claim: string, domains: string[], type: K3ClaimType): Omit<K3KnowledgeUnit, "validationState" | "applicability" | "sourceAuthority"> => ({ knowledgeUnitId: id, contentUnitId: cu, sourceId, sourceLocation: { page: 1, section: "Synthetic statement" }, domainIds: domains, ownership: "ARKI_GENERAL", topic: "housing organization", claimType: type, claim, epistemicStatus: "SOURCE_STATEMENT", context: base, spatialScope: "edificacion", designStage: "CONCEPT", typology: "HOUSING", evidenceRequirement: "SOURCE_REQUIRED", provenance: provenance("BOOK", [sourceId, "page:1"]), output: "STRATEGY_CANDIDATE" });
  model = deriveKnowledgeUnit(model, make("K3-KU-A", "K3-CU-A", "K3-FIXTURE-HOUSING-001", "Courtyard organization may support an interior-to-protected-outdoor relationship in some housing contexts.", ["HOUSING", "SPATIAL_COMPOSITION"], "STRATEGY_CANDIDATE"));
  model = deriveKnowledgeUnit(model, make("K3-KU-B", "K3-CU-B", "K3-FIXTURE-HOUSING-002", "Compact organization may reduce circulation distance and external envelope in some housing contexts.", ["HOUSING", "SPATIAL_COMPOSITION"], "STRATEGY_CANDIDATE"));
  model = addContradiction(model, { contradictionId: "K3-CONFLICT-01", knowledgeUnitIds: ["K3-KU-A", "K3-KU-B"], description: "Courtyard outdoor relationship versus compact circulation and envelope." });
  return model;
}
export function buildK3NegativeControls() {
  const fixture = buildK3Fixture();
  const noId = deriveKnowledgeUnit(fixture, { ...fixture.knowledgeUnits[0], knowledgeUnitId: "K3-NO-ID", sourceId: "", contentUnitId: "K3-CU-A" });
  const noLocation = deriveKnowledgeUnit(fixture, { ...fixture.knowledgeUnits[0], knowledgeUnitId: "K3-NO-LOCATION", sourceLocation: {}, contentUnitId: "K3-CU-A" });
  const unknownDomain = deriveKnowledgeUnit(fixture, { ...fixture.knowledgeUnits[0], knowledgeUnitId: "K3-UNKNOWN-DOMAIN", domainIds: ["NOT_A_K2_DOMAIN"], contentUnitId: "K3-CU-A" });
  const duplicateSource = registerSource(fixture, sourceFixture("A"));
  const duplicateClaim = deriveKnowledgeUnit(fixture, { ...fixture.knowledgeUnits[0], knowledgeUnitId: "K3-DUP", contentUnitId: "K3-CU-A" });
  return { fixture, noId, noLocation, unknownDomain, duplicateSource, duplicateClaim };
}
export function buildK3ValidationProof() {
  let model = buildK3Fixture();
  model = humanValidate(model, "K3-KU-A", "CONFIRM");
  model = humanValidate(model, "K3-KU-B", "REJECT");
  model = humanValidate(model, "K3-KU-A", "LIMIT_CONTEXT");
  const trace = reconstructSourceTrace(model, "K3-KU-A");
  const k1 = proposeKnowledgeCandidate(model.k1, { candidateId: "K3-K1-CANDIDATE", claim: "A controlled source claim may inform a housing strategy candidate.", source: "BOOK", provenance: provenance("BOOK", ["K3-KU-A", "K3-FIXTURE-HOUSING-001"]), context: { spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT" }, assumptions: ["context applies"], supportingEvidence: ["K3-KU-A"], contradictingEvidence: [] });
  const promoted = validateKnowledgeCandidate(k1, "K3-K1-CANDIDATE", true);
  return { model, trace, k1, promoted };
}
export function validateK3ReadModel(model: K3ReadModel): boolean { return model.noAutomaticPromotion && model.noAutomaticDecision && model.noAutomaticWinner && model.knowledgeUnits.every((unit) => unit.sourceId && unit.contentUnitId && unit.domainIds.length && unit.provenance.sourceRefs.length && unit.validationState === "KNOWLEDGE_CANDIDATE") && model.contradictions.every((item) => item.preserved && !item.winnerCreated) && model.retrieval === "NOT_ACTIVATED" && model.federation === "FROZEN_NOT_ACTIVATED"; }
export const K3_CANONICAL_SPATIAL_SCOPES = K2_SPATIAL_SCOPES;
