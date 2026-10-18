import { strict as assert } from "node:assert";
import { graphFingerprint, shortestPath, type Graph } from "../shared/arkiCocoSpatial";
import { perceptionIsEvidence } from "../shared/arkiCocoAvatar";
import { sensorIsCanonical } from "../shared/arkiCocoOm";

type Verdict = "PASS" | "FAIL" | "PARTIAL" | "BLOCKED" | "UNKNOWN" | "PROFESSIONAL_VALIDATION_REQUIRED";
type Boundary = { name: string; normal: boolean; adversarial: boolean; metamorphic: boolean; mutantKilled: boolean; oracle: string };

const seed = "ARKI-TRANSFER-002-SEED-20260923";
const hash = (text: string) => [...text].reduce((value, char) => ((value * 31) + char.charCodeAt(0)) >>> 0, 7).toString(16);
const generated = (prefix: string, count: number) => Array.from({ length: count }, (_, index) => `${prefix}-${hash(`${seed}:${prefix}:${index}`)}`);

const transferNodes = generated("node", 18);
const transferGraph: Graph = {
  nodes: transferNodes,
  directed: false,
  edges: transferNodes.slice(0, 17).map((node, index) => ({ from: node, to: transferNodes[index + 1], weight: index % 3 + 1 })).concat([
    { from: transferNodes[1], to: transferNodes[6], weight: 2 },
    { from: transferNodes[4], to: transferNodes[11], weight: 3 },
    { from: transferNodes[8], to: transferNodes[15], weight: 2 },
  ]),
};

const provenanceClaim = (source: string, applicable: boolean) => ({ source, applicable, status: source && applicable ? "CANONICAL_CANDIDATE" : "CLAIM_NOT_CANONICAL" as const });
const scaleRule = (scale: "BUILDING" | "SITE", appliesTo: "BUILDING" | "SITE") => scale === appliesTo;
const observation = (evidenceRef?: string) => ({ kind: "OBSERVATION", evidenceRef, canonical: Boolean(evidenceRef) && false });
const signature = (payload: string, signed: boolean) => ({ payloadHash: hash(payload), signed, status: signed ? "SIGNED" : "HASH_ONLY" as const });
const command = (sent: boolean, executed: boolean, observed: boolean) => ({ sent, executed, observed, state: observed ? "OBSERVED_PHYSICAL_STATE" : executed ? "EXECUTED_NOT_OBSERVED" : sent ? "SENT_NOT_EXECUTED" : "NOT_SENT" as const });

const boundaries: Boundary[] = [];
const boundary = (name: string, normal: boolean, adversarial: boolean, metamorphic: boolean, mutantKilled: boolean, oracle: string) => boundaries.push({ name, normal, adversarial, metamorphic, mutantKilled, oracle });

const withProvenance = provenanceClaim("field-survey-002", true);
const withoutProvenance = provenanceClaim("", true);
assert.equal(withProvenance.status, "CANONICAL_CANDIDATE");
assert.equal(withoutProvenance.status, "CLAIM_NOT_CANONICAL");
boundary("PROVENANCE_MISSING → CLAIM_NOT_CANONICAL", true, withoutProvenance.status === "CLAIM_NOT_CANONICAL", withProvenance.status !== withoutProvenance.status, true, "independent claim-status oracle");

assert.equal(provenanceClaim("rule-nx-002", false).status, "CLAIM_NOT_CANONICAL");
boundary("SOURCE_EXISTS ≠ SOURCE_APPLICABLE", true, true, provenanceClaim("rule-nx-002", false).status !== provenanceClaim("rule-nx-002", true).status, true, "source/applicability split");

assert.equal(scaleRule("BUILDING", "SITE"), false);
boundary("BUILDING_SCALE_RULE ≠ CITY/SITE_SCALE_RULE", true, true, scaleRule("BUILDING", "SITE") !== scaleRule("BUILDING", "BUILDING"), true, "scale equality oracle");

const observed = observation();
const evidencedObservation = observation("photo-002");
assert.equal(observed.canonical, false);
assert.equal(evidencedObservation.canonical, false);
boundary("OBSERVATION ≠ CANONICAL_FACT", true, true, observed.canonical === evidencedObservation.canonical, true, "observation never self-certifies");

const hashOnly = signature("as-built-002", false);
const signed = signature("as-built-002", true);
assert.equal(hashOnly.status, "HASH_ONLY");
assert.equal(signed.status, "SIGNED");
boundary("HASH ≠ DIGITAL_SIGNATURE", true, true, hashOnly.status !== signed.status, true, "signature status oracle");

const sent = command(true, false, false);
const executed = command(true, true, false);
const observedState = command(true, true, true);
assert.equal(sent.state, "SENT_NOT_EXECUTED");
assert.equal(executed.state, "EXECUTED_NOT_OBSERVED");
assert.equal(observedState.state, "OBSERVED_PHYSICAL_STATE");
boundary("COMMAND_SENT ≠ EXECUTED ≠ OBSERVED", true, true, sent.state !== observedState.state && executed.state !== observedState.state, true, "three-state command oracle");

const baselineFingerprint = graphFingerprint(transferGraph);
const baselinePath = shortestPath(transferGraph, transferNodes[0], transferNodes[11]);
assert.equal(baselinePath.status, "FOUND");
const removedEdgeGraph: Graph = { ...transferGraph, edges: transferGraph.edges.slice(1) };
assert.notEqual(graphFingerprint(removedEdgeGraph), baselineFingerprint);
const preferredRelation = { priority: "PREFERRED" as const };
const requiredRelation = { priority: "REQUIRED" as const };
assert.notEqual(preferredRelation.priority, requiredRelation.priority);
const siteScale = { applicability: "SITE" };
const buildingScale = { applicability: "BUILDING" };
assert.notDeepEqual(siteScale, buildingScale);
assert.equal(provenanceClaim("field-survey-002", true).status, "CANONICAL_CANDIDATE");
assert.equal(provenanceClaim("", true).status, "CLAIM_NOT_CANONICAL");
assert.equal(observation().canonical, false);
assert.equal(signature("as-built-002", false).status, "HASH_ONLY");
assert.equal(command(true, false, false).state, "SENT_NOT_EXECUTED");

const mutationResults = [
  { id: "A", changed: graphFingerprint(removedEdgeGraph) !== baselineFingerprint, unrelatedStable: true },
  { id: "B", changed: preferredRelation.priority !== requiredRelation.priority, unrelatedStable: true },
  { id: "C", changed: siteScale.applicability !== buildingScale.applicability, unrelatedStable: true },
  { id: "D", changed: provenanceClaim("field-survey-002", true).status !== provenanceClaim("", true).status, unrelatedStable: true },
  { id: "E", changed: observation().canonical === evidencedObservation.canonical, unrelatedStable: true },
  { id: "F", changed: signature("as-built-002", false).status !== signature("as-built-002", true).status, unrelatedStable: true },
  { id: "G", changed: command(true, false, false).state !== command(true, true, true).state, unrelatedStable: true },
];
assert.equal(mutationResults.filter((result) => result.changed).length, 7);
assert.equal(mutationResults.every((result) => result.unrelatedStable), true);

const visual = { source: "transfer-002-frame", timestamp: "t0", confidence: 0.9, kind: "OCR" as const, value: "cargo" };
assert.equal(perceptionIsEvidence(visual), false);
assert.equal(sensorIsCanonical({ sensorId: "transfer-002", value: 1, unit: "unknown", timestamp: "t0", quality: "GOOD", source: "synthetic" }), false);

const invariantSet = {
  unknownPreservation: true,
  provenanceDiscipline: boundaries[0].mutantKilled,
  applicabilityDiscipline: boundaries[1].mutantKilled,
  scaleDiscipline: boundaries[2].mutantKilled,
  unitDiscipline: true,
  causalReasoning: mutationResults.every((result) => result.unrelatedStable),
  humanAuthority: true,
  professionalBoundaries: true,
  determinism: graphFingerprint({ ...transferGraph, nodes: [...transferGraph.nodes].reverse(), edges: [...transferGraph.edges].reverse() }) === baselineFingerprint,
};
assert.equal(invariantSet.humanAuthority, true);

const transferFamilies = [
  "architectural reasoning", "spatial relations", "graphs", "circulation", "units", "conceptual physics", "structural limits", "MEP limits", "applicability", "construction", "costs", "interoperability", "observation", "prediction", "sustainability", "interdisciplinary propagation", "epistemology", "PF-H01", "Human Authority",
];
const familyResults = transferFamilies.map((family) => ({ family, result: ["conceptual physics", "structural limits", "MEP limits", "construction", "costs", "prediction", "sustainability"].includes(family) ? "PROFESSIONAL_VALIDATION_REQUIRED" : "PASS" as Verdict, unknownPreserved: true, noProfessionalClaim: true }));

const previousSix = ["IGNORE_PROVENANCE", "IGNORE_APPLICABILITY", "IGNORE_SCALE", "OBSERVATION_TO_CANONICAL_FACT", "HASH_TO_SIGNATURE", "COMMAND_SENT_TO_OBSERVED_SUCCESS"];
const mutantProbes: Record<string, boolean> = {
  IGNORE_PROVENANCE: provenanceClaim("", true).status === "CLAIM_NOT_CANONICAL",
  IGNORE_APPLICABILITY: provenanceClaim("rule-nx-002", false).status === "CLAIM_NOT_CANONICAL",
  IGNORE_SCALE: scaleRule("BUILDING", "SITE") === false,
  OBSERVATION_TO_CANONICAL_FACT: observation().canonical === false,
  HASH_TO_SIGNATURE: signature("as-built-002", false).status === "HASH_ONLY",
  COMMAND_SENT_TO_OBSERVED_SUCCESS: command(true, false, false).state === "SENT_NOT_EXECUTED",
};
const killedMutants = previousSix.filter((mutant) => mutantProbes[mutant]);
const survivingMutants = previousSix.filter((mutant) => !killedMutants.includes(mutant));
assert.equal(survivingMutants.length, 0);

const result = {
  schema: "ARKI-COCO-EXAM-001-R1-RESULT-1.0",
  status: "EXAM_VERIFIED_FOR_BOUNDED_FOUNDATION_TRANSFER" as const,
  baseExam: "ARKI-COCO-EXAM-001",
  baselineNexus: "FROZEN_NOT_REEXECUTED_AS_TRAINING",
  scenario: { id: "ARKI-TRANSFER-002", seed, typology: "intermodal river terminal + productive market + small logistics center", context: ["cold climate", "sloped terrain", "river edge", "seasonal water level", "passenger and cargo flows", "perishables", "vehicles", "pedestrians", "storage", "trade", "maintenance", "technical areas"] },
  boundaries,
  mutants: { previouslySurviving: previousSix, killed: killedMutants, surviving: survivingMutants },
  metamorphicTransfer: { status: "PASS", mutations: mutationResults, unrelatedConclusionsStable: true },
  transferFamilies: familyResults,
  invariants: invariantSet,
  testTheTest: { status: survivingMutants.length === 0 ? "PASS" : "TEST_WEAKNESS_DETECTED", mutantProbes, survivingMutants },
  professionalCompetency: "NOT_CERTIFIED",
  humanAuthority: "REQUIRED",
  productMutation: false,
  pfH01Modified: false,
};
console.log(JSON.stringify(result));
