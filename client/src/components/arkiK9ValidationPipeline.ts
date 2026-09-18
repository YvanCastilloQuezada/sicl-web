import { humanValidate, reconstructSourceTrace, type K3KnowledgeUnit, type K3ReadModel } from "./arkiSourceKnowledgeContract";
import { buildK8RealSourcePilot } from "./arkiK8RealSourcePilot";
import { createK4Store, insertK4Records, type K4Record, type K4Store } from "./arkiKnowledgeStore";

export type K9ValidationState = "CANDIDATE" | "VALIDATED" | "CORRECTED" | "REJECTED" | "SUPERSEDED" | "CONTEXT_LIMITED" | "UNKNOWN_VALIDITY";
export type K9Action = "CONFIRM" | "CORRECT" | "REJECT" | "LIMIT_CONTEXT" | "SUPERSEDE";
export type K9Record = { knowledgeId: string; sourceId: string; originalClaim: string; currentClaim: string; state: K9ValidationState; applicability: string; originalPreserved: true; provenance: string[]; actionHistory: string[]; contradictionIds: string[]; eligibleForK4: boolean };
export type K9ValidationModel = { sourceModel: K3ReadModel; records: K9Record[]; contradictionsPreserved: true; originsSeparated: true; noAutomaticValidation: true; noAutomaticPromotion: true; humanAuthority: "HUMAN_ARCHITECT" };

const recordFrom = (unit: K3KnowledgeUnit): K9Record => ({ knowledgeId: unit.knowledgeUnitId, sourceId: unit.sourceId, originalClaim: unit.claim, currentClaim: unit.claim, state: "CANDIDATE", applicability: unit.applicability, originalPreserved: true, provenance: [...unit.provenance.sourceRefs], actionHistory: ["SOURCE_INGESTED"], contradictionIds: [], eligibleForK4: false });

export function createK9ValidationModel(sourceModel: K3ReadModel): K9ValidationModel { return { sourceModel, records: sourceModel.knowledgeUnits.map(recordFrom), contradictionsPreserved: true, originsSeparated: true, noAutomaticValidation: true, noAutomaticPromotion: true, humanAuthority: "HUMAN_ARCHITECT" }; }
export function applyK9HumanAction(model: K9ValidationModel, knowledgeId: string, action: K9Action, correctedClaim?: string): K9ValidationModel {
  const target = model.records.find((record) => record.knowledgeId === knowledgeId);
  if (!target) return model;
  const nextState: K9ValidationState = action === "CONFIRM" ? "VALIDATED" : action === "CORRECT" ? "CORRECTED" : action === "REJECT" ? "REJECTED" : action === "LIMIT_CONTEXT" ? "CONTEXT_LIMITED" : "SUPERSEDED";
  const sourceModel = action === "REJECT" ? humanValidate(model.sourceModel, knowledgeId, "REJECT") : action === "CORRECT" ? humanValidate(model.sourceModel, knowledgeId, "CORRECT", correctedClaim) : action === "LIMIT_CONTEXT" ? humanValidate(model.sourceModel, knowledgeId, "LIMIT_CONTEXT") : action === "CONFIRM" ? humanValidate(model.sourceModel, knowledgeId, "CONFIRM") : model.sourceModel;
  return { ...model, sourceModel, records: model.records.map((record) => record.knowledgeId !== knowledgeId ? record : { ...record, currentClaim: action === "CORRECT" ? correctedClaim ?? record.currentClaim : record.currentClaim, state: nextState, applicability: action === "LIMIT_CONTEXT" ? "CONTEXT_BOUNDED" : record.applicability, actionHistory: [...record.actionHistory, `HUMAN_${action}`], eligibleForK4: action === "CONFIRM" || action === "CORRECT" || action === "LIMIT_CONTEXT" }) };
}
export function markK9Superseded(model: K9ValidationModel, knowledgeId: string): K9ValidationModel { return applyK9HumanAction(model, knowledgeId, "SUPERSEDE"); }
export function preserveK9Contradiction(model: K9ValidationModel, contradictionId: string, knowledgeIds: string[]): K9ValidationModel { return { ...model, records: model.records.map((record) => knowledgeIds.includes(record.knowledgeId) ? { ...record, contradictionIds: Array.from(new Set([...record.contradictionIds, contradictionId])) } : record) }; }

function toK4Record(record: K9Record, model: K3ReadModel): K4Record | undefined {
  if (!record.eligibleForK4 || record.state === "REJECTED" || record.state === "SUPERSEDED") return undefined;
  const unit = model.knowledgeUnits.find((item) => item.knowledgeUnitId === record.knowledgeId);
  const trace = unit && reconstructSourceTrace(model, unit.knowledgeUnitId);
  if (!unit || !trace) return undefined;
  return { knowledgeId: record.knowledgeId, origin: "SOURCE_DERIVED", claim: record.currentClaim, topic: unit.topic, domainIds: unit.domainIds, ownership: unit.ownership, spatialScope: unit.spatialScope, typology: unit.typology, designStage: unit.designStage, geographicContext: unit.geographicContext, jurisdiction: unit.jurisdiction, epistemicStatus: unit.epistemicStatus, validation: "VALIDATED", applicability: record.applicability, sourceId: record.sourceId, sourceTrace: { sourceId: trace.source.sourceId, contentUnitId: trace.content.contentUnitId, location: trace.content.location }, provenanceRefs: [...record.provenance, ...record.actionHistory], rightsStatus: trace.source.rights, temporalStatus: trace.source.validity, noAutomaticDecision: true, noAutomaticWinner: true };
}
export function buildK4FromK9(model: K9ValidationModel): K4Store { return insertK4Records(createK4Store(), model.records.map((record) => toK4Record(record, model.sourceModel)).filter((record): record is K4Record => Boolean(record))); }
export function buildK9ValidationProof() {
  let model = createK9ValidationModel(buildK8RealSourcePilot());
  model = applyK9HumanAction(model, "K8-KU-ARB-01", "CORRECT", "The ARB source provides professional standards, including competence and public-interest duties; it does not establish a project design requirement.");
  model = applyK9HumanAction(model, "K8-KU-ASES-01", "CONFIRM");
  model = applyK9HumanAction(model, "K8-KU-RNE-01", "LIMIT_CONTEXT");
  const rejectedSource = buildK8RealSourcePilot();
  let rejected = createK9ValidationModel(rejectedSource);
  rejected = applyK9HumanAction(rejected, "K8-KU-RNE-01", "REJECT");
  let superseded = createK9ValidationModel(buildK8RealSourcePilot());
  superseded = applyK9HumanAction(superseded, "K8-KU-ARB-01", "CONFIRM");
  superseded = markK9Superseded(superseded, "K8-KU-ARB-01");
  model = preserveK9Contradiction(model, "K9-CONTRADICTION-PASSIVE-VS-COMPACT", ["K8-KU-ARB-01", "K8-KU-ASES-01"]);
  const k4 = buildK4FromK9(model);
  return { model, rejected, superseded, k4, trace: reconstructSourceTrace(model.sourceModel, "K8-KU-ASES-01") };
}
export function validateK9ValidationProof(proof: ReturnType<typeof buildK9ValidationProof>): boolean { const states = new Set(proof.model.records.map((record) => record.state)); return states.has("CORRECTED") && states.has("VALIDATED") && states.has("CONTEXT_LIMITED") && proof.rejected.records.some((record) => record.state === "REJECTED") && proof.superseded.records.some((record) => record.state === "SUPERSEDED") && proof.model.records.every((record) => record.originalPreserved) && proof.model.contradictionsPreserved && proof.model.originsSeparated && proof.k4.records.some((record) => record.knowledgeId === "K8-KU-ASES-01") && proof.k4.records.some((record) => record.knowledgeId === "K8-KU-RNE-01") && Boolean(proof.trace);
}
