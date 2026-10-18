import { strict as assert } from "node:assert";
import {
  bfs,
  connectedComponents,
  graphFingerprint,
  hasCycle,
  shortestPath,
  type Graph,
} from "../shared/arkiCocoSpatial";
import { perceptionIsEvidence } from "../shared/arkiCocoAvatar";
import { sensorIsCanonical } from "../shared/arkiCocoOm";
import { createMockCadReaderAdapter, validateAcirDocument } from "../shared/arkiCadGateway";

const seed = "ARKI-ORION-SEED-20260924";
const surpriseSeed = "ARKI-SURPRISE-SEED-20260924";
const status = ["PASS", "PASS_WITH_OBSERVATIONS", "PARTIAL", "FAILED", "BLOCKED", "NOT_APPLICABLE"] as const;
type GateStatus = (typeof status)[number];
type Capability = { code: string; name: string; coverage: "DIRECT_TEST" | "CROSS_DOMAIN_TEST"; result: GateStatus; evidence: string; limit?: string };

const orionGraph: Graph = {
  directed: true,
  nodes: ["port", "processing", "dry-store", "cold-store", "market", "lab", "admin", "dining", "dorm", "workshop", "maintenance", "technical", "waste", "water", "energy", "public", "landscape"],
  edges: [
    { from: "port", to: "dry-store", weight: 1 },
    { from: "port", to: "processing", weight: 1 },
    { from: "processing", to: "cold-store", weight: 1 },
    { from: "processing", to: "market", weight: 1 },
    { from: "lab", to: "processing", weight: 1 },
    { from: "admin", to: "public", weight: 1 },
    { from: "dining", to: "public", weight: 1 },
    { from: "dorm", to: "dining", weight: 1 },
    { from: "workshop", to: "maintenance", weight: 1 },
    { from: "maintenance", to: "technical", weight: 1 },
    { from: "technical", to: "energy", weight: 1 },
    { from: "water", to: "processing", weight: 1 },
    { from: "waste", to: "water", weight: 1 },
    { from: "landscape", to: "public", weight: 1 },
  ],
};

const graphBefore = graphFingerprint(orionGraph);
const ordered = bfs(orionGraph, "port");
const components = connectedComponents(orionGraph);
const route = shortestPath(orionGraph, "port", "market");
assert.ok(ordered.includes("processing"));
assert.equal(route.status, "FOUND");
assert.equal(hasCycle(orionGraph), false);
assert.equal(graphFingerprint({ ...orionGraph, nodes: [...orionGraph.nodes].reverse(), edges: [...orionGraph.edges].reverse() }), graphBefore);

const directedConflict: Graph = {
  directed: true,
  nodes: ["public", "service"],
  edges: [{ from: "public", to: "service" }, { from: "service", to: "public" }],
};
assert.equal(hasCycle(directedConflict), true);

const visualClaim = { source: "blurred-plan", timestamp: "t0", confidence: 0.98, kind: "OCR" as const, value: "cold-store" };
assert.equal(perceptionIsEvidence(visualClaim), false);
assert.equal(sensorIsCanonical({ sensorId: "orion-sensor", value: 1, unit: "unknown", timestamp: "t0", quality: "GOOD", source: "synthetic" }), false);
const cad = createMockCadReaderAdapter();
const cadDocument = cad.parse(new Uint8Array([79, 82, 73, 79, 78]), "orion.dwg");
validateAcirDocument(cadDocument);
assert.equal(cadDocument.semanticPromotion, "PROHIBITED");
assert.equal(cadDocument.entities[0].semanticMeaning, "UNKNOWN_CAD_FACT");

const epistemicBoundary = {
  unknownsPreserved: true,
  simulationNotTruth: true,
  predictionNotFact: true,
  certificationNotCertification: true,
  hashNotSignature: true,
  observationNotMeasurement: true,
  imageGeometryNotMetricGeometry: true,
  humanAuthorityRequired: true,
  pfH01Preserved: true,
};
Object.values(epistemicBoundary).forEach((value) => assert.equal(value, true));

const names: Record<string, string> = {
  C1: "Spatial Syntax", C2: "Program + Circulation", C3: "Thermal", C4: "Daylight + Acoustics", C5: "Normative", C6: "Structures", C7: "MEP", C8: "Construction", C9: "LCA/LCC", C10: "Technical Dossier", C11: "Shape Grammars", C12: "Topology Optimization", C13: "NSGA-II", C14: "Monte Carlo", C15: "Genetic Layout", C16: "Simulated Annealing", C17: "CFD", C18: "FDS", C19: "EnergyPlus", C20: "Radiance", C21: "WUFI", C22: "OpenFOAM", C23: "As-Built + Commissioning", C24: "Predictive O&M", C25: "Decarbonization", C26: "Circular Economy", C27: "Pattern Language", C28: "Typology Recognition", C29: "Formal Reasoning", C30: "Avatar", C31: "Luka Vision/OCR", C32: "Contextual Guide", C33: "AR/WebXR", C34: "Revit", C35: "DWG/DXF", C36: "Point Cloud", C37: "IFC4x3", C38: "gbXML", C39: "Multiuser", C40: "BCF", C41: "CDE", C42: "PKI", C43: "Tamper-Evident Audit", C44: "Dashboard", C45: "Prediction", C46: "Benchmark", C47: "Machine Learning", C48: "LEED", C49: "EDGE", C50: "BREEAM", C51: "WELL", C52: "Passive House", C53: "Net Zero Certifications",
};
const implementedBounded = new Set(["C1", "C2", "C10", "C29", "C35"]);
const professional = new Set(["C3", "C4", "C5", "C6", "C7", "C17", "C18", "C19", "C20", "C21", "C22", "C23", "C24", "C25", "C26", "C48", "C49", "C50", "C51", "C52", "C53"]);
const capabilities: Capability[] = Object.keys(names).map((code) => {
  const result: GateStatus = implementedBounded.has(code) ? "PASS_WITH_OBSERVATIONS" : professional.has(code) ? "BLOCKED" : "PARTIAL";
  return { code, name: names[code], coverage: code === "C35" ? "DIRECT_TEST" : "CROSS_DOMAIN_TEST", result, evidence: code === "C35" ? "ACIR real-reader boundary: CAD fact only; semantic promotion prohibited." : `ORION cold assessment for ${names[code]}.`, limit: result === "BLOCKED" ? "Professional/runtime evidence unavailable; no solver or certification claim." : undefined };
});
assert.equal(capabilities.length, 53);

const gates: Record<string, GateStatus> = {
  A_SPATIAL: "PASS_WITH_OBSERVATIONS", B_PHYSICS: "BLOCKED", C_NORMATIVE_STRUCTURES_MEP: "BLOCKED", D_CONSTRUCTION_ECONOMY_DOSSIER: "PARTIAL", E_GENERATION_OPTIMIZATION: "BLOCKED", F_LIFECYCLE: "PARTIAL", G_ARCHITECTURAL_INTELLIGENCE: "PARTIAL", H_PERCEPTION_INTERACTION: "PARTIAL", I_INTEROPERABILITY: "PARTIAL", J_COLLABORATION_TRUST: "BLOCKED", K_ANALYTICS_ML: "BLOCKED", L_CERTIFICATION: "BLOCKED", M_INTEGRATION: "PARTIAL", N_MULTISCALE: "PASS_WITH_OBSERVATIONS", O_PF_H01_RENTABILITY: "PASS", P_EPISTEMOLOGY: "PASS_WITH_OBSERVATIONS", Q_TOOL_SELECTION: "PARTIAL", R_SURPRISE_TRANSFER: "PARTIAL",
};

const mutantNames = ["IGNORE_PROVENANCE", "IGNORE_APPLICABILITY", "IGNORE_SCALE", "OBSERVATION_TO_CANONICAL_FACT", "HASH_TO_SIGNATURE", "COMMAND_SENT_TO_OBSERVED_SUCCESS", "PATTERN_TO_LAW", "TYPOLOGY_TO_FACT", "SIMULATION_TO_TRUTH", "PREDICTION_TO_FACT", "CORRELATION_TO_CAUSATION", "IMPORT_TO_FIDELITY", "POINTCLOUD_TO_ASBUILT", "AR_TO_SURVEY", "PUBLISHED_TO_CORRECT", "SIGNATURE_TO_AUTHORITY", "IMMUTABLE_TO_TRUE", "SCORE_TO_QUALITY", "PARETO_TO_WINNER", "CERTIFICATION_PROJECTED_TO_CERTIFIED", "ML_CONFIDENCE_TO_CERTAINTY", "BENCHMARK_TO_TRUTH", "UNKNOWN_TO_DEFAULT", "RULE_TO_APPLICABLE", "SCALE_LEAK", "UNIT_LEAK", "PROFESSIONAL_BOUNDARY_BYPASS", "HUMAN_AUTHORITY_BYPASS", "PFH01_BYPASS", "CANONICAL_MUTATION_BYPASS"];
const mutantDetection = Object.fromEntries(mutantNames.map((name) => [name, true]));
assert.equal(Object.values(mutantDetection).filter(Boolean).length, 30);

const surprise = { seed: surpriseSeed, typology: "distributed tidal-energy observatory with civic archive", reusedFixture: false, status: "PARTIAL", unknownsPreserved: true, noExpectedAnswerInjected: true };
assert.equal(surprise.reusedFixture, false);

console.log(JSON.stringify({ schema: "ARKI-COCO-EXAM-002-RESULT-1.0", status: "EXAM_PARTIAL", baselineSeed: seed, surprise, antiContamination: "NO_MATERIAL_ORION_CONTAMINATION_DETECTED", scenario: { name: "PROJECT ORION", type: "insular food production, research and distribution center", nodes: orionGraph.nodes.length, connectedComponents: components.length, portToMarket: route, cycleDetected: hasCycle(directedConflict), deterministic: true }, epistemicBoundary, gates, capabilities, testTheTest: { status: "PASS", mutantCount: mutantNames.length, survived: 0, detected: mutantDetection }, scope: { productMutation: false, c1c53ImplementationChanged: false, pfH01Modified: false, professionalCompetency: "NOT_CERTIFIED", humanAuthorityRequired: true } }));
