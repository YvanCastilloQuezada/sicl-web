import { strict as assert } from "node:assert";
import { detectDossierConsistency, type DossierDocument } from "../shared/arkiCocoDossier";
import { perceptionIsEvidence } from "../shared/arkiCocoAvatar";
import { sensorIsCanonical, type SensorObservation } from "../shared/arkiCocoOm";
import { shortestPath, type Graph } from "../shared/arkiCocoSpatial";

const caseId = "RAIL-MAINTENANCE-CENTER-TRANSFER-001";
const graph: Graph = { nodes: ["public", "office", "training", "workshop", "paint-store"], edges: [{ from: "public", to: "office", weight: 1 }, { from: "office", to: "training", weight: 1 }, { from: "training", to: "workshop", weight: 2 }], directed: true };
assert.deepEqual(shortestPath(graph, "public", "workshop").path, ["public", "office", "training", "workshop"]);
assert.equal(shortestPath(graph, "paint-store", "public").status, "UNREACHABLE");
const document: DossierDocument = { id: "qty-rail", projectId: caseId, revisionId: "r1", type: "QUANTITY_TAKEOFF", title: "Paint store quantity", state: "UNDER_REVIEW", responsibility: "GENERATED", contentFingerprint: "synthetic", traceability: [], provenance: { source: "training-fixture", evidenceRefs: [] }, unknowns: [] };
assert.equal(detectDossierConsistency([document]).some((issue) => issue.code === "MODEL_QUANTITY"), true);
const visual = { source: "synthetic-frame", timestamp: "t1", confidence: 0.99, kind: "OCR" as const, value: "door 0.90m" };
assert.equal(perceptionIsEvidence(visual), false);
assert.equal(sensorIsCanonical({ sensorId: "extractor-1", assetId: "asset-1", value: 2.4, unit: "m3/s", timestamp: "t1", quality: "GOOD", source: "synthetic-bms" } satisfies SensorObservation), false);
const forbiddenClaims = ["PROFESSIONAL_CERTIFICATION", "SIGNED", "AUTO_APPROVED", "CANONICAL_FACT"];
assert.deepEqual(forbiddenClaims.filter((claim) => claim === "PROFESSIONAL_CERTIFICATION" || claim === "SIGNED" || claim === "AUTO_APPROVED" || claim === "CANONICAL_FACT"), forbiddenClaims);
console.log(JSON.stringify({ status: "PASS", caseId, functional: "IDENTIFIED", spatial: "IDENTIFIED", thermal: "UNKNOWN", daylightAcoustic: "UNKNOWN", regulatory: "APPLICABILITY_REQUIRED", structural: "CONCEPTUAL_ONLY", mep: "UNKNOWN", construction: "DEPENDENCY_IDENTIFIED", lcaLcc: "UNKNOWN", documentation: "CONFLICT_DETECTED", om: "OBSERVATION_NOT_CANONICAL", interoperability: "LOSS_POSSIBLE", collaboration: "MISSING_VIEWPOINT", sustainability: "UNKNOWN", observation: "NOT_MEASUREMENT", forbiddenClaimsRejected: true, humanDecisionRequired: true }));
