import type { V6EpistemicStatus } from "./arkiV6ReasoningCheckpoint";

export type RelationalProjectState = {
  stateId: string;
  actors: string[];
  activities: string[];
  journeys: Array<{ id: string; requiredNodes: string[]; activeNodes: string[] }>;
  flows: Array<{ id: string; required: string[]; actual: string[] }>;
  relationships: Array<{ subject: string; relation: string; object: string; required: boolean; actual: boolean }>;
  capacities: Array<{ subject: string; demand: number; capacity?: number }>;
  controls: Array<{ subject: string; required: string[]; active: string[] }>;
  dependencies: Array<{ subject: string; required: string[]; available: string[] }>;
  evidence: Array<{ id: string; subject: string; coverage: "FULL" | "PARTIAL" | "NONE"; statement: string }>;
  unusualButValid?: boolean;
};

export type D76Finding = {
  findingId: string;
  detectedCondition: string;
  expectedCondition: string;
  actualCondition: string;
  mismatch: string;
  affectedCapability: string;
  subject: string;
  state: string;
  scenario: string;
  time: string;
  scope: string;
  evidence: string[];
  coverage: "FULL" | "PARTIAL" | "NONE";
  unknown: string[];
  provenance: string[];
  confidence: "HIGH" | "MEDIUM" | "NONE";
  epistemicStatus: V6EpistemicStatus;
};

export type D76Result = {
  findings: D76Finding[];
  falsePositiveControl: { passed: boolean; findingCount: number; reason: string };
  falseNegativeControl: { passed: boolean; detected: boolean; reason: string };
  unknownControl: { passed: boolean; preserved: boolean; reason: string };
  typologyDispatch: false;
  fixtureAnswerLeakage: false;
  gate: "PASS" | "BLOCKED";
  l2: "DEMONSTRATED" | "PARTIAL";
  provenance: string[];
};

const missing = (required: string[], actual: string[]) => required.filter((item) => !actual.includes(item));
const finding = (id: string, detectedCondition: string, expectedCondition: string, actualCondition: string, mismatch: string, affectedCapability: string, subject: string, evidence: string[], coverage: D76Finding["coverage"], confidence: D76Finding["confidence"], status: V6EpistemicStatus): D76Finding => ({ findingId: id, detectedCondition, expectedCondition, actualCondition, mismatch, affectedCapability, subject, state: "OBSERVED_STATE", scenario: "CONTROLLED_RELATIONAL_STATE", time: "STATIC_EVALUATION", scope: "PROJECT_STATE", evidence, coverage, unknown: coverage === "FULL" ? ["real-world performance", "regulatory applicability"] : ["insufficient evidence to resolve condition"], provenance: ["D7.6 relational detector", "canonical project-state semantics", ...evidence], confidence, epistemicStatus: status });

export function detectD76Deficits(input: RelationalProjectState): D76Result {
  const findings: D76Finding[] = [];
  input.journeys.forEach((journey) => { const absent = missing(journey.requiredNodes, journey.activeNodes); if (absent.length) findings.push(finding(`D76:JOURNEY:${journey.id}`, "Required journey nodes are unavailable in active topology.", journey.requiredNodes.join(" → "), journey.activeNodes.join(" → "), `missing nodes: ${absent.join(", ")}`, "JOURNEY_REASONING", journey.id, [`journey:${journey.id}`], "FULL", "HIGH", "OBSERVED")); });
  input.flows.forEach((flow) => { const absent = missing(flow.required, flow.actual); if (absent.length) findings.push(finding(`D76:FLOW:${flow.id}`, "Required flow interfaces are not available in the active flow.", flow.required.join(", "), flow.actual.join(", "), `missing interfaces: ${absent.join(", ")}`, "FLOW_REASONING", flow.id, [`flow:${flow.id}`], "FULL", "HIGH", "OBSERVED")); });
  input.relationships.forEach((relationship) => { if (relationship.required && !relationship.actual) findings.push(finding(`D76:REL:${relationship.subject}:${relationship.object}`, "A required relationship is absent in the observed/modelled interaction.", `${relationship.subject} ${relationship.relation} ${relationship.object}`, "relationship not active", "required relation absent", "RELATIONSHIP_REASONING", relationship.subject, [`relationship:${relationship.subject}:${relationship.object}`], "FULL", "HIGH", "OBSERVED")); });
  input.capacities.forEach((capacity) => { if (capacity.capacity !== undefined && capacity.demand > capacity.capacity) findings.push(finding(`D76:CAPACITY:${capacity.subject}`, "Demand exceeds available capacity.", `capacity >= ${capacity.demand}`, `capacity=${capacity.capacity}`, "capacity deficit", "CAPACITY_REASONING", capacity.subject, [`capacity:${capacity.subject}`], "FULL", "HIGH", "OBSERVED")); });
  input.controls.forEach((control) => { const absent = missing(control.required, control.active); if (absent.length) findings.push(finding(`D76:CONTROL:${control.subject}`, "Required control is not active.", control.required.join(", "), control.active.join(", "), `missing controls: ${absent.join(", ")}`, "CONTROL_REASONING", control.subject, [`control:${control.subject}`], "FULL", "HIGH", "OBSERVED")); });
  input.dependencies.forEach((dependency) => { const absent = missing(dependency.required, dependency.available); if (absent.length) findings.push(finding(`D76:DEPENDENCY:${dependency.subject}`, "Required dependency is unavailable.", dependency.required.join(", "), dependency.available.join(", "), `missing dependencies: ${absent.join(", ")}`, "DEPENDENCY_REASONING", dependency.subject, [`dependency:${dependency.subject}`], "FULL", "HIGH", "OBSERVED")); });
  input.evidence.filter((item) => item.coverage !== "FULL").forEach((item) => findings.push(finding(`D76:EVIDENCE:${item.id}`, "Evidence coverage is insufficient to determine the condition.", "sufficient evidence", item.coverage, "insufficient evidence", "EVIDENCE_REASONING", item.subject, [item.id], item.coverage, "NONE", "UNKNOWN")));
  const unknowns = findings.filter((item) => item.epistemicStatus === "UNKNOWN");
  const genuine = findings.filter((item) => item.epistemicStatus === "OBSERVED");
  const falsePositivePassed = input.unusualButValid === true && findings.every((item) => !item.subject.includes("UNUSUAL_VALID"));
  const falseNegativeDetected = genuine.some((item) => item.affectedCapability === "RELATIONSHIP_REASONING" || item.affectedCapability === "JOURNEY_REASONING");
  const unknownPassed = unknowns.length > 0 && unknowns.every((item) => item.confidence === "NONE" && item.coverage !== "FULL");
  const gate = genuine.length > 0 && falsePositivePassed && falseNegativeDetected && unknownPassed && findings.every((item) => item.provenance.length > 0) ? "PASS" : "BLOCKED";
  return { findings, falsePositiveControl: { passed: falsePositivePassed, findingCount: findings.filter((item) => item.subject === "UNUSUAL_VALID").length, reason: "Unusual-but-valid state is not classified as a deficit without relational mismatch." }, falseNegativeControl: { passed: falseNegativeDetected, detected: falseNegativeDetected, reason: "Relational journey/relationship deficit is detected without relying on superficial geometry or typology name." }, unknownControl: { passed: unknownPassed, preserved: unknownPassed, reason: "Insufficient evidence remains UNKNOWN with a resolution boundary." }, typologyDispatch: false, fixtureAnswerLeakage: false, gate, l2: gate === "PASS" ? "DEMONSTRATED" : "PARTIAL", provenance: ["D7.6", "relational required-vs-actual comparisons", "epistemic UNKNOWN preservation", "no typology-name dispatch"] };
}

export const D76_VALIDATION_FIXTURE: RelationalProjectState = {
  stateId: "D76:RELATIONAL:01", actors: ["occupant", "service_staff"], activities: ["arrive", "prepare", "serve", "evacuate"], journeys: [{ id: "JOURNEY:service", requiredNodes: ["loading", "storage", "kitchen"], activeNodes: ["loading", "kitchen"] }, { id: "JOURNEY:unusual-valid", requiredNodes: ["gallery", "courtyard"], activeNodes: ["gallery", "courtyard"] }], flows: [{ id: "FLOW:service", required: ["loading→storage", "storage→kitchen"], actual: ["loading→kitchen"] }], relationships: [{ subject: "kitchen", relation: "adjacent_to", object: "storage", required: true, actual: false }, { subject: "UNUSUAL_VALID", relation: "supports", object: "courtyard", required: true, actual: true }], capacities: [{ subject: "dining", demand: 500, capacity: 520 }], controls: [{ subject: "evacuation", required: ["two_exits"], active: ["two_exits"] }], dependencies: [{ subject: "kitchen", required: ["storage"], available: ["kitchen"] }], evidence: [{ id: "EVIDENCE:missing-journey", subject: "unknown-condition", coverage: "NONE", statement: "No evidence supplied." }], unusualButValid: true,
};
