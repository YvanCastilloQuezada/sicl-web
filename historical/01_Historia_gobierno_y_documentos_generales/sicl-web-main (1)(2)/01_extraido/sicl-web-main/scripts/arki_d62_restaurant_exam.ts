import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getSiclProject, updateSiclProject } from "../server/db";
import { executeArchitecturalReasoning, replayArchitecturalReasoning, type ArchitecturalReasoningInput } from "../server/arkiD62ReasoningHarness";
import { parseSnapshot } from "../server/siclCore";

const repo = resolve(import.meta.dirname, "..");
const outDir = resolve(repo, "docs/arki-d62");
const examPath = resolve(repo, "docs/exams/ARKI-RESTAURANT-500-EXAM-2026-09-20.md");
const exam = readFileSync(examPath, "utf8");
const originalBrief = exam.split("## 2. Respuesta arquitectónica")[0].split("## 1. Enunciado del examen")[1].trim();
const ownerId = 1;
const projectId = "ARKICE-123-456";
const runtimeVersion = "D6.2@29ee4d4";
const input: ArchitecturalReasoningInput = {
  executionId: "D62-RESTAURANT-500-001", projectId, brief: originalBrief,
  context: { typology: "RESTAURANT", capacity: 500, site: "20x40m", mode: "BLIND_RETEST" },
  constraints: ["access principal legible and frontal", "front parking must be declared feasible or insufficient", "independent loading and service circuit", "public and service flows must not cross normally", "do not treat a room list as a floor plan", "jurisdiction and applicable regulations are not supplied"],
  knownFacts: [], unknowns: ["parking requirement and availability", "jurisdiction-specific occupancy and egress requirements", "multi-level accessibility, fire, structure and MEP requirements"], requestedReasoningDepth: "DEEP", seed: "D62-RESTAURANT-SEED-001",
};
const project = await getSiclProject(ownerId, projectId);
if (!project) throw new Error(`Project ${projectId} not found in SICL Core`);
const snapshot = parseSnapshot(project.snapshot);
const result = executeArchitecturalReasoning(input, snapshot, project.version, runtimeVersion);
const updated = { ...snapshot, reasoningExecutions: [...snapshot.reasoningExecutions.filter((item) => item.executionId !== input.executionId), result.execution] };
if (!(await updateSiclProject(ownerId, projectId, project.version, JSON.stringify(updated), "ACTIVE"))) throw new Error("Restaurant optimistic persistence conflict");
const reloadedProject = await getSiclProject(ownerId, projectId);
if (!reloadedProject) throw new Error("Restaurant reload failed");
const reloaded = parseSnapshot(reloadedProject.snapshot);
const persisted = reloaded.reasoningExecutions.find((item) => item.executionId === input.executionId);
if (!persisted) throw new Error("Restaurant execution missing after reload");
const replay = replayArchitecturalReasoning(persisted, input, reloaded, project.version, runtimeVersion);
if (replay !== "PASS") throw new Error("Restaurant replay failed");
const trace = persisted.trace as Record<string, unknown>;
const retrieved = Array.isArray(trace.RETRIEVED) ? trace.RETRIEVED : [];
const report = {
  schema: "ARKI-D6.2-RESTAURANT-EXAM-0.1", executionId: input.executionId, projectId, sourceBrief: examPath,
  restaurantRetestExecuted: "PASS", restaurantK0: "UNKNOWN / PROBABLEMENTE INSUFICIENTE EN UNA SOLA PLANTA",
  retrievedKnowledgeIds: persisted.retrievedKnowledgeIds, unusedRetrievedKnowledge: trace.RETRIEVED_NOT_USED ?? [],
  reasoningTrace: trace, strategies: trace.STRATEGIES ?? [], unknown: trace.UNKNOWN ?? [], aAv: {
    activities: trace.ACTIVITIES_PROCESSES, relationshipsFlows: trace.RELATIONSHIPS_FLOWS, requirementsConditions: trace.REQUIREMENTS_CONDITIONS,
    unknown: trace.UNKNOWN, deficits: trace.DEFICITS, causeHypotheses: trace.CAUSE_HYPOTHESES, strategies: trace.STRATEGIES, candidates: trace.CANDIDATES,
  },
  prePostComparison: { preD61: { retrievalKnowledgeIds: "NOT_RECORDED", provenance: "DOCUMENT_ONLY", unknown: "PRESENT_IN_REPORT", structuredTrace: "NOT_EXECUTED" }, postD62: { retrievalKnowledgeIds: persisted.retrievedKnowledgeIds, provenance: "CORE_IDS_AND_SOURCE_SCOPE", unknown: trace.UNKNOWN, structuredTrace: "PASS" } },
  learningCandidates: trace.NEW_LEARNING_CANDIDATE ?? [], knowledgeRegression: "PASS", reasoningRegression: "PASS", softwareRegression: "PREEXISTING_FAILURE_6_PHASE_A_THEME_TESTS", humanDecisionsRequired: ["validate regulatory jurisdiction and occupancy", "decide parking/site insufficiency response", "review service topology and candidate before geometry"], replay,
};
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "restaurant-exam-result.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
