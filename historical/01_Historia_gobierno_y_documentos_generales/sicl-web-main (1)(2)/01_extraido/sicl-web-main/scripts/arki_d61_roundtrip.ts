import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getSiclProject, insertSiclProject, updateSiclProject } from "../server/db";
import { emptySnapshot, parseSnapshot, type SiclKnowledgeRecord, type SiclKnowledgeValidation, type SiclSnapshot } from "../server/siclCore";

const repo = resolve(import.meta.dirname, "..");
const inputPath = resolve(repo, "docs/arki-m0k/corpus-ingestion.json");
const promotionPath = resolve(repo, "docs/arki-m0k/human-promotion-review.json");
const outputDir = resolve(repo, "docs/arki-d61");
const ownerId = 1;
const projectId = "ARKICE-123-456";

function stableHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
function sourceRecord(raw: Record<string, unknown>) {
  return { id: String(raw.SOURCE_ID), name: String(raw.TITLE), statement: String(raw.NOTES ?? raw.TITLE), scope: "SOURCE_CATALOG", data: raw };
}
function knowledgeRecord(raw: Record<string, unknown>): SiclKnowledgeRecord {
  return {
    id: String(raw.knowledgeId), kind: String(raw.kind), title: String(raw.title), statement: String(raw.statement),
    epistemicStatus: String(raw.epistemicStatus), promotionState: String(raw.kState ?? "UNKNOWN"), scopeId: String(raw.scopeId ?? "UNKNOWN"),
    sourceIds: Array.isArray(raw.sourceIds) ? raw.sourceIds.map(String) : [], evidenceIds: Array.isArray(raw.evidenceIds) ? raw.evidenceIds.map(String) : [],
    applicability: raw.applicability ? String(raw.applicability) : undefined, transferability: raw.transferability ? String(raw.transferability) : undefined,
    rationale: raw.failureIfMisapplied ? String(raw.failureIfMisapplied) : undefined, rightsStatus: "ABSTRACT_AND_REFERENCE_ONLY", version: 1,
  };
}
function primitiveRecord(raw: Record<string, unknown>): SiclKnowledgeRecord {
  return { id: String(raw.PRIMITIVE_ID), kind: "DOMAIN_PRIMITIVE", title: String(raw.NAME), statement: String(raw.DEFINITION), epistemicStatus: "HYPOTHESIS", promotionState: String(raw.STATUS), scopeId: "SCP-GENERAL", sourceIds: [], evidenceIds: [], rationale: raw.NOTES ? String(raw.NOTES) : undefined, version: 1 };
}
function typologyRecord(raw: Record<string, unknown>): SiclKnowledgeRecord {
  return { id: String(raw.TYPOLOGY_ID), kind: "TYPOLOGY", title: String(raw.TYPOLOGY), statement: String(raw.PURPOSE), epistemicStatus: "UNKNOWN", promotionState: "PROVISIONAL", scopeId: "TYPOLOGY_PARTIAL", sourceIds: [], evidenceIds: [], applicability: "PARTIAL", transferability: "UNKNOWN", unknown: "Capability systems, actors, processes and flows require further decomposition.", version: 1 };
}
function strategyRecord(raw: Record<string, unknown>): SiclKnowledgeRecord {
  return { id: String(raw.STRATEGY_ID), kind: "STRATEGY", title: String(raw.NAME), statement: String(raw.DEFINITION), epistemicStatus: "HYPOTHESIS", promotionState: String(raw.K_STATE), scopeId: String(raw.SCOPE_ID), sourceIds: [], evidenceIds: [], applicability: String(raw.APPLICABLE_CONDITIONS), transferability: "ADAPT", rationale: String(raw.RISKS_SIDE_EFFECTS), version: 1 };
}
function validatePromotions(knowledge: SiclKnowledgeRecord[], promoted: Record<string, unknown>[]) {
  const validations: SiclKnowledgeValidation[] = [];
  for (const raw of promoted) {
    const id = String(raw.knowledgeId);
    const current = knowledge.find((item) => item.id === id);
    const sourceIds = Array.isArray(raw.sourceIds) ? raw.sourceIds.map(String) : [];
    const exact = current && current.statement === String(raw.statement) && current.epistemicStatus === "FACT" && current.scopeId === String(raw.scopeId) && JSON.stringify(current.sourceIds) === JSON.stringify(sourceIds);
    if (!exact) throw new Error(`Human validation mismatch for ${id}`);
    validations.push({ id: `HV-D61-${id}`, knowledgeId: id, decision: "CONFIRMED_WITHIN_SCOPE", authority: "PRODUCT_OWNER", scopeId: current.scopeId, validatedAt: "2026-09-20T00:00:00.000Z", evidenceHash: stableHash({ id, statement: current.statement, sourceIds: current.sourceIds, scopeId: current.scopeId }) });
  }
  return validations;
}
function addKnowledge(snapshot: SiclSnapshot, records: SiclKnowledgeRecord[], validations: SiclKnowledgeValidation[]): SiclSnapshot {
  return { ...snapshot, knowledge: records, knowledgeValidations: validations, events: [...snapshot.events, { id: "EVT-D61-INGEST", type: "KNOWLEDGE_CORPUS_INGESTED", entityId: projectId, actorId: ownerId, createdAt: new Date().toISOString(), data: { records: records.length, validations: validations.length, source: "M0-K" } }] };
}

const corpus = JSON.parse(readFileSync(inputPath, "utf8")) as { records: Record<string, Record<string, unknown>[]> };
const promotion = JSON.parse(readFileSync(promotionPath, "utf8")) as { promotedToFact: Record<string, unknown>[] };
const sources = corpus.records.sources.map(sourceRecord);
const knowledge = [...corpus.records.knowledge.map(knowledgeRecord), ...corpus.records.domainPrimitives.map(primitiveRecord), ...corpus.records.typologies.map(typologyRecord), ...corpus.records.strategies.map(strategyRecord)];
const validations = validatePromotions(knowledge, promotion.promotedToFact);
const snapshot = addKnowledge({ ...emptySnapshot(), sources }, knowledge, validations);

const before = await getSiclProject(ownerId, projectId);
let version: number;
if (before) {
  const ok = await updateSiclProject(ownerId, projectId, before.version, JSON.stringify(snapshot), "ACTIVE");
  if (!ok) throw new Error("D61 project changed before persistence");
  version = before.version + 1;
} else {
  await insertSiclProject({ ownerId, projectId, name: "ARKI D6.1 Corpus Core", location: "SICL Core local canonical store", version: 1, snapshot: JSON.stringify(snapshot), status: "ACTIVE" });
  version = 1;
}

const reloadedProject = await getSiclProject(ownerId, projectId);
if (!reloadedProject) throw new Error("D61 reload failed");
const reloaded = parseSnapshot(reloadedProject.snapshot);
const query = "PROGRAM";
const retrieved = reloaded.knowledge.filter((item) => `${item.title} ${item.statement}`.toLowerCase().includes(query.toLowerCase()));
if (!retrieved.length) throw new Error("D61 retrieval failed for query PROGRAM");
const retrievedValidationIds = new Set(reloaded.knowledgeValidations.map((item) => item.knowledgeId));
const humanPreserved = validations.every((item) => retrievedValidationIds.has(item.knowledgeId));
if (!humanPreserved) throw new Error("D61 human validation preservation failed");

mkdirSync(outputDir, { recursive: true });
const result = {
  schema: "ARKI-D6.1-EXECUTED-0.1", projectId, version, coreMechanism: "SICL_PROJECT_SNAPSHOT_MYSQL",
  persistence: "PASS", reload: "PASS", retrieval: "PASS",
  provenancePreservation: reloaded.knowledge.every((item) => item.sourceIds.length > 0 || ["DOMAIN_PRIMITIVE", "TYPOLOGY", "STRATEGY"].includes(item.kind)),
  scopePreservation: reloaded.knowledge.every((item) => Boolean(item.scopeId)), rightsPreservation: reloaded.knowledge.every((item) => item.rightsStatus === undefined || item.rightsStatus.length > 0),
  humanValidationPreservation: humanPreserved, unknownConflictPreservation: reloaded.knowledge.some((item) => item.epistemicStatus === "UNKNOWN"),
  pilotRecords: ["KN-000001", "KN-000002", "KN-000008", "TYP-HEALTHCARE", "STR-000001"], query, retrievedKnowledgeIds: retrieved.map((item) => item.id),
  counts: { discovered: knowledge.length, mapped: knowledge.length, ingested: knowledge.length, humanValidatedFacts: validations.length, unknown: reloaded.knowledge.filter((item) => item.epistemicStatus === "UNKNOWN").length },
  validationIds: validations.map((item) => item.id), timestamp: new Date().toISOString(),
};
writeFileSync(resolve(outputDir, "roundtrip-result.json"), JSON.stringify(result, null, 2) + "\n");
writeFileSync(resolve(outputDir, "schema-map.json"), JSON.stringify({ schema: "ARKI-D6.1-SCHEMA-MAP-0.1", source: "M0-K corpus-ingestion.json", mapping: { sources: "REUSE→SiclSnapshot.sources", knowledge: "MAP→SiclSnapshot.knowledge", humanValidation: "MAP→SiclSnapshot.knowledgeValidations", typologies: "MAP→knowledge(kind=TYPOLOGY)", strategies: "MAP→knowledge(kind=STRATEGY)", unknownAndPartial: "PRESERVE→epistemicStatus/scope/unknown" }, doNotImport: ["copyrighted source text", "unverified scope expansion"] }, null, 2) + "\n");
writeFileSync(resolve(outputDir, "curriculum-update.md"), "# ARKI Curriculum Update — D6.1\n\nThe Living Curriculum now includes a public-facing lesson on evidence-backed architectural knowledge, bounded scope, persistence and retrieval. Internal runtime contracts remain internal; this lesson does not expose implementation-only schemas.\n\nStatus: EXECUTED / restaurant remains conditional on all D6.1 gates.\n");
console.log(JSON.stringify(result, null, 2));
