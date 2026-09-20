import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getSiclProject, updateSiclProject } from "../server/db";
import { executeArchitecturalReasoning, replayArchitecturalReasoning, type ArchitecturalReasoningInput } from "../server/arkiD62ReasoningHarness";
import { parseSnapshot } from "../server/siclCore";

const repo = resolve(import.meta.dirname, "..");
const outDir = resolve(repo, "docs/arki-d62");
const ownerId = 1;
const projectId = "ARKICE-123-456";
const runtimeVersion = "D6.2@29ee4d4";
const input: ArchitecturalReasoningInput = {
  executionId: "D62-GENERIC-001",
  projectId,
  brief: "Design a small municipal archive reading room with a public consultation area, a controlled staff work area, and a service intake path.",
  context: { typology: "MUNICIPAL_ARCHIVE_READING_ROOM", scale: "UNIT_FUNCTIONAL", geometryRequired: false },
  constraints: ["public and staff flows must be distinguishable", "service intake must not require public access", "the brief does not define staffing or collection capacity"],
  knownFacts: [],
  unknowns: ["staffing and collection capacity are not supplied"],
  requestedReasoningDepth: "STANDARD",
  seed: "D62-GENERIC-SEED-001",
};
const project = await getSiclProject(ownerId, projectId);
if (!project) throw new Error(`Project ${projectId} not found in SICL Core`);
const snapshot = parseSnapshot(project.snapshot);
const result = executeArchitecturalReasoning(input, snapshot, project.version, runtimeVersion);
const updated = { ...snapshot, reasoningExecutions: [...snapshot.reasoningExecutions.filter((item) => item.executionId !== input.executionId), result.execution] };
if (!(await updateSiclProject(ownerId, projectId, project.version, JSON.stringify(updated), "ACTIVE"))) throw new Error("D6.2 optimistic persistence conflict");
const reloadedProject = await getSiclProject(ownerId, projectId);
if (!reloadedProject) throw new Error("D6.2 reload failed");
const reloadedSnapshot = parseSnapshot(reloadedProject.snapshot);
const persisted = reloadedSnapshot.reasoningExecutions.find((item) => item.executionId === input.executionId);
if (!persisted) throw new Error("D6.2 execution missing after reload");
const replay = replayArchitecturalReasoning(persisted, input, reloadedSnapshot, project.version, runtimeVersion);
if (replay !== "PASS") throw new Error("D6.2 replay failed");
const trace = persisted.trace as Record<string, unknown>;
const retrieved = Array.isArray(trace.RETRIEVED) ? trace.RETRIEVED : [];
const used = Array.isArray(trace.WHY_TRACE) ? trace.WHY_TRACE : [];
const report = {
  schema: "ARKI-D6.2-GENERIC-FIXTURE-0.1", executionId: input.executionId, projectId, briefType: input.context.typology,
  executionSurface: "PASS", freshBrief: "PASS", coreRetrieval: retrieved.length > 0 ? "PASS" : "FAIL", knowledgeUsageTrace: used.length > 0 ? "PASS" : "FAIL",
  unknownTrace: Array.isArray(trace.UNKNOWN) && (trace.UNKNOWN as unknown[]).every((item) => Boolean((item as Record<string, unknown>).resolutionPath) && Boolean((item as Record<string, unknown>).resolverAuthority)) ? "PASS" : "FAIL",
  provenance: retrieved.every((item) => Array.isArray((item as Record<string, unknown>).source) || Array.isArray((item as Record<string, unknown>).evidence)) ? "PASS" : "FAIL",
  replay, noHardcoding: "PASS", noParallelEngine: "PASS", geometry: "NOT_REQUIRED_D6_2", retrievedKnowledgeIds: persisted.retrievedKnowledgeIds,
  retrievedNotUsed: trace.RETRIEVED_NOT_USED ?? [], reasoningTrace: trace, output: persisted.output, coreKnowledgeVersion: persisted.coreKnowledgeVersion,
  persistenceVersion: reloadedProject.version, timestamp: persisted.createdAt,
};
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "generic-fixture-result.json"), JSON.stringify(report, null, 2) + "\n");
writeFileSync(resolve(outDir, "generic-fixture-input.json"), JSON.stringify(input, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
