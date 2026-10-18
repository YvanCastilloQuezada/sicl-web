import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getSiclProject } from "../server/db";
import { executeReasoningToTopology, type BridgeProjectInput } from "../server/arkiD62ReasoningHarness";
import { parseSnapshot } from "../server/siclCore";

const repo = resolve(import.meta.dirname, "..");
const outDir = resolve(repo, "docs/arki-d62m");
const ownerId = 1;
const projectId = "ARKICE-123-456";
const input: BridgeProjectInput = {
  executionId: "D62M-MICRO-001",
  projectId,
  brief: "A small civic consultation service with a public orientation activity and a staff intake activity.",
  typology: "CIVIC_CONSULTATION_UNIT",
  activities: [
    { id: "public-orientation", label: "public orientation", subjects: ["visitor"], capacity: 8, frequency: "daily", duration: "short", temporalOverlap: true, privacy: "shared" },
    { id: "staff-intake", label: "staff intake", subjects: ["staff"], capacity: 3, frequency: "daily", duration: "medium", temporalOverlap: true, accessControl: "staff", privacy: "controlled" },
  ],
  subjects: ["visitor", "staff"],
  relationships: [{ id: "r1", from: "public-orientation", to: "staff-intake", relation: "controlled service interface", subjects: ["visitor", "staff"], state: "open", frequency: "daily", time: "business-hours", control: "staff-mediated" }],
  conditions: ["visitor and staff activities may overlap", "staff controls service intake"],
  constraints: ["Do not infer rooms, dimensions or geometry from the brief."],
  unknowns: ["capacity of the service process after peak demand is not supplied"],
  perturbation: { id: "p1", statement: "Staff-mediated control is unavailable during the peak period.", changes: { control: "unavailable" } },
};

const project = await getSiclProject(ownerId, projectId);
if (!project) throw new Error(`D6.2-M Core project not found: ${projectId}`);
const snapshot = parseSnapshot(project.snapshot);
const result = executeReasoningToTopology(input, snapshot, project.version, "D6.2-M@local");
const report = {
  schema: "ARKI-D6.2-M-MINIMAL-BRIDGE-0.1",
  baseline: { projectId, coreVersion: project.version },
  filesReused: ["server/arkiD62ReasoningHarness.ts", "server/siclCore.ts"],
  bridgeImplemented: "KNOWLEDGE_TO_TOPOLOGY_ONLY",
  coreRetrievalUsed: result.retrievedKnowledge.length > 0 ? "PASS" : "FAIL",
  microcaseInput: input,
  retrievedKnowledge: result.retrievedKnowledge,
  requirements: result.requirements,
  unknown: result.unknown,
  deficits: result.deficits,
  causeHypotheses: result.causeHypotheses,
  strategies: result.strategies,
  realizations: result.realizations,
  topology: result.topology,
  traceability: result.topology.traceability,
  perturbation: result.perturbation,
  dependencyReevaluation: "ONLY_DECLARED_PERTURBATION_DEPENDENCIES_REEVALUATED",
  geometry: "NOT_IMPLEMENTED_BY_DELTA",
  humanAuthority: "FINAL",
  finalStatus: result.status,
};
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "microcase-result.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
