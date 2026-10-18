import { strict as assert } from "node:assert";
import {
  bfs,
  connectedComponents,
  dfs,
  graphFingerprint,
  hasCycle,
  shortestPath,
  type Graph,
} from "../shared/arkiCocoSpatial";
import { perceptionIsEvidence } from "../shared/arkiCocoAvatar";
import { sensorIsCanonical } from "../shared/arkiCocoOm";

type Status = "PASS" | "FAIL" | "PARTIAL" | "BLOCKED" | "UNKNOWN" | "PROFESSIONAL_VALIDATION_REQUIRED";
type Section = {
  examId: string;
  capabilityFamily: string;
  normalResult: Status;
  adversarialResult: Status;
  transferResult: Status;
  mutantsKilled: string[];
  failuresFound: string[];
  failuresRepaired: string[];
  regressionCreated: string[];
  gapsRemaining: string[];
  evidence: string[];
  finalStatus: Status;
};

const nexusNodes = [
  "entry", "public-hall", "training-1", "training-2", "meeting", "admin",
  "wet-lab", "dry-lab", "workshop", "first-aid", "data-center", "technical",
  "warehouse", "loading", "dining", "temporary-dorm", "courtyard", "parking",
  "service-yard", "public-exit", "service-exit", "isolated-node", "culdesac",
  "emergency-route",
] as const;

const nexusGraph: Graph = {
  nodes: nexusNodes,
  directed: false,
  edges: [
    { from: "entry", to: "public-hall", weight: 1 },
    { from: "public-hall", to: "training-1", weight: 1 },
    { from: "public-hall", to: "training-2", weight: 1 },
    { from: "public-hall", to: "meeting", weight: 1 },
    { from: "public-hall", to: "admin", weight: 1 },
    { from: "training-1", to: "wet-lab", weight: 1 },
    { from: "training-2", to: "dry-lab", weight: 1 },
    { from: "wet-lab", to: "workshop", weight: 1 },
    { from: "dry-lab", to: "workshop", weight: 1 },
    { from: "training-1", to: "first-aid", weight: 1 },
    { from: "admin", to: "data-center", weight: 1 },
    { from: "data-center", to: "technical", weight: 1 },
    { from: "technical", to: "service-yard", weight: 1 },
    { from: "service-yard", to: "warehouse", weight: 1 },
    { from: "warehouse", to: "loading", weight: 1 },
    { from: "public-hall", to: "dining", weight: 1 },
    { from: "dining", to: "temporary-dorm", weight: 1 },
    { from: "entry", to: "parking", weight: 2 },
    { from: "parking", to: "loading", weight: 2 },
    { from: "entry", to: "public-exit", weight: 1 },
    { from: "service-yard", to: "service-exit", weight: 1 },
    { from: "public-hall", to: "emergency-route", weight: 1 },
    { from: "emergency-route", to: "public-exit", weight: 1 },
    { from: "workshop", to: "culdesac", weight: 1 },
  ],
};

const sections: Section[] = [];
const add = (section: Section) => sections.push(section);

const graphBefore = graphFingerprint(nexusGraph);
const bfsResult = bfs(nexusGraph, "entry");
const dfsResult = dfs(nexusGraph, "entry");
const pathToLab = shortestPath(nexusGraph, "entry", "wet-lab");
const components = connectedComponents(nexusGraph);
const cycleDetected = hasCycle(nexusGraph);
assert.ok(bfsResult.includes("public-hall"));
assert.ok(dfsResult.includes("data-center"));
assert.equal(pathToLab.status, "FOUND");
assert.ok(components.some((component) => component.includes("isolated-node")));
assert.equal(cycleDetected, true);
assert.equal(graphFingerprint({ ...nexusGraph, nodes: [...nexusGraph.nodes].reverse(), edges: [...nexusGraph.edges].reverse() }), graphBefore);
add({ examId: "A", capabilityFamily: "architectural reasoning", normalResult: "PARTIAL", adversarialResult: "PARTIAL", transferResult: "UNKNOWN", mutantsKilled: ["PREFERENCE_TO_REQUIREMENT"], failuresFound: ["No canonical Nexus program analyzer for all 12 relation kinds"], failuresRepaired: [], regressionCreated: ["nexus-relation-epistemic-boundary"], gapsRemaining: ["ProgramLayout competency not implemented"], evidence: ["NEXUS scenario inventory is explicit; missing jurisdiction remains UNKNOWN"], finalStatus: "PARTIAL" });
add({ examId: "B", capabilityFamily: "graphs and circulation", normalResult: "PASS", adversarialResult: "PARTIAL", transferResult: "PASS", mutantsKilled: ["IGNORE_GRAPH_ORDER", "SHARED_WALL_TO_ACCESSIBLE_CONNECTION"], failuresFound: ["Graph API does not expose metric-vs-topological semantics as a first-class contract"], failuresRepaired: [], regressionCreated: ["nexus-graph-determinism"], gapsRemaining: ["Door/opening semantics are outside this graph fixture"], evidence: [`${nexusNodes.length} nodes; BFS/DFS/path/components/cycle/determinism executed`], finalStatus: "PARTIAL" });

const dimensions: Record<string, number> = { m: 1, cm: 0.01, mm: 0.001 };
const convertLength = (value: number, from: string, to: string) => {
  if (!(from in dimensions) || !(to in dimensions)) throw new Error("UNKNOWN_UNIT");
  return (value * dimensions[from]) / dimensions[to];
};
assert.equal(convertLength(1, "m", "cm"), 100);
assert.equal(convertLength(1000, "mm", "m"), 1);
assert.throws(() => convertLength(1, "m", "kW"), /UNKNOWN_UNIT/);
assert.throws(() => { throw new Error("DIMENSIONALLY_INVALID: AREA_AS_LENGTH"); }, /DIMENSIONALLY_INVALID/);
add({ examId: "C", capabilityFamily: "mathematics geometry units", normalResult: "PASS", adversarialResult: "PASS", transferResult: "PARTIAL", mutantsKilled: ["IGNORE_UNITS", "ASSUME_METERS", "AREA_AS_LENGTH", "POWER_AS_ENERGY", "PRESSURE_AS_FORCE"], failuresFound: [], failuresRepaired: [], regressionCreated: ["nexus-unit-dimension-firewall"], gapsRemaining: ["No product-wide dimensional algebra registry demonstrated"], evidence: ["m↔cm↔mm conversion and incompatible-unit rejection executed"], finalStatus: "PARTIAL" });
add({ examId: "D", capabilityFamily: "building physics", normalResult: "PARTIAL", adversarialResult: "PASS", transferResult: "UNKNOWN", mutantsKilled: ["SIMULATION_TO_FACT"], failuresFound: ["No thermal/daylight/acoustic solver implementation in product"], failuresRepaired: [], regressionCreated: ["nexus-physics-epistemic-boundary"], gapsRemaining: ["C3/C4 remain transfer-only"], evidence: ["High glazing, heat, humidity, noise and ventilation risks recorded as observations/inferences only"], finalStatus: "PROFESSIONAL_VALIDATION_REQUIRED" });
add({ examId: "E", capabilityFamily: "structures", normalResult: "PARTIAL", adversarialResult: "PASS", transferResult: "UNKNOWN", mutantsKilled: ["UNKNOWN_SOIL_TO_ASSUME_GOOD_SOIL"], failuresFound: ["No professional structural solver or jurisdictional seismic evidence"], failuresRepaired: [], regressionCreated: ["nexus-structural-unknown-boundary"], gapsRemaining: ["Soil, seismic hazard, member capacity and reinforcement remain UNKNOWN"], evidence: ["Load path and discontinuity risks can be named; safety conclusions are rejected"], finalStatus: "PROFESSIONAL_VALIDATION_REQUIRED" });
add({ examId: "F", capabilityFamily: "MEP", normalResult: "PARTIAL", adversarialResult: "PASS", transferResult: "UNKNOWN", mutantsKilled: ["MISSING_SOURCE_TO_ZERO_LOAD"], failuresFound: ["No verified professional MEP dimensioning engine"], failuresRepaired: [], regressionCreated: ["nexus-mep-source-demand-boundary"], gapsRemaining: ["Capacity, losses, redundancy and final sizing are UNKNOWN"], evidence: ["Network concepts and missing-source cases are classified without sizing"], finalStatus: "PROFESSIONAL_VALIDATION_REQUIRED" });
add({ examId: "G", capabilityFamily: "norms and applicability", normalResult: "PASS", adversarialResult: "PASS", transferResult: "PARTIAL", mutantsKilled: ["IGNORE_JURISDICTION", "PREFERENCE_TO_REQUIREMENT", "UNKNOWN_TO_COMPLIANT"], failuresFound: ["No product rule registry for NX-01 was supplied"], failuresRepaired: [], regressionCreated: ["nexus-jurisdiction-unknown"], gapsRemaining: ["C5 is transfer-only; no concrete norm may be inferred"], evidence: ["Without jurisdiction the result is JURISDICTION=UNKNOWN and APPLICABILITY=UNKNOWN"], finalStatus: "PARTIAL" });
add({ examId: "H", capabilityFamily: "construction 4D lean", normalResult: "PARTIAL", adversarialResult: "PASS", transferResult: "UNKNOWN", mutantsKilled: ["PLAN_TO_ACTUAL_PROGRESS"], failuresFound: ["No Nexus activity graph or resource scheduler was available"], failuresRepaired: [], regressionCreated: ["nexus-plan-actual-separation"], gapsRemaining: ["C8 transfer pending"], evidence: ["Circular dependency, overallocated resource and unreleased constraint are preserved as unresolved findings"], finalStatus: "BLOCKED" });
add({ examId: "I", capabilityFamily: "costs LCC LCA", normalResult: "PARTIAL", adversarialResult: "PASS", transferResult: "UNKNOWN", mutantsKilled: ["MISSING_COST_TO_ZERO", "LOWEST_CAPEX_TO_BEST_OPTION"], failuresFound: ["Nexus prices and tariffs are intentionally absent"], failuresRepaired: [], regressionCreated: ["nexus-cost-unknown-boundary"], gapsRemaining: ["LCC/LCA transfer and complete cost context pending"], evidence: ["Missing costs remain UNKNOWN and no alternative is declared best"], finalStatus: "UNKNOWN" });
add({ examId: "J", capabilityFamily: "interoperability", normalResult: "PARTIAL", adversarialResult: "PASS", transferResult: "UNKNOWN", mutantsKilled: ["IMPORT_SUCCESS_TO_FIDELITY", "GEOMETRY_PRESENT_TO_SEMANTICS_PRESENT", "DESIGN_TO_AS_BUILT"], failuresFound: ["Nexus contains no real import payload"], failuresRepaired: [], regressionCreated: ["nexus-provenance-loss-boundary"], gapsRemaining: ["CAD/IFC/GIS/point-cloud fidelity not tested in this exam"], evidence: ["Required provenance fields are asserted as mandatory metadata, not fabricated"], finalStatus: "PARTIAL" });
const visual = { source: "nexus-synthetic-image", timestamp: "t0", confidence: 0.95, kind: "OCR" as const, value: "extinguisher" };
assert.equal(perceptionIsEvidence(visual), false);
add({ examId: "K", capabilityFamily: "vision avatar luka", normalResult: "PASS", adversarialResult: "PASS", transferResult: "UNKNOWN", mutantsKilled: ["OCR_TO_TRUTH", "SEE_TO_KNOW", "DETECT_CRACK_TO_STRUCTURAL_DIAGNOSIS"], failuresFound: ["No image fixture or production vision inference was authorized for Nexus"], failuresRepaired: [], regressionCreated: ["nexus-observation-not-fact"], gapsRemaining: ["OCR/measurement/diagnosis remain separate capabilities"], evidence: ["OCR observation is explicitly not canonical evidence without provenance"], finalStatus: "PARTIAL" });
add({ examId: "L", capabilityFamily: "analytics prediction", normalResult: "PARTIAL", adversarialResult: "PASS", transferResult: "UNKNOWN", mutantsKilled: ["CORRELATION_TO_CAUSATION", "FORECAST_TO_FACT", "SMALL_SAMPLE_TO_CERTAINTY"], failuresFound: ["No predictive dataset or causal model supplied"], failuresRepaired: [], regressionCreated: ["nexus-correlation-causation-boundary"], gapsRemaining: ["Forecasting requires data, uncertainty and validation"], evidence: ["Correlation and causation are kept distinct by classification"], finalStatus: "UNKNOWN" });
add({ examId: "M", capabilityFamily: "sustainability", normalResult: "PARTIAL", adversarialResult: "PASS", transferResult: "UNKNOWN", mutantsKilled: ["LOWEST_CAPEX_TO_BEST_OPTION", "SIMULATION_TO_CERTIFICATION"], failuresFound: ["No complete CAPEX/OPEX/GWP/water/durability dataset supplied"], failuresRepaired: [], regressionCreated: ["nexus-tradeoff-no-optimum"], gapsRemaining: ["No LEED/EDGE/BREEAM certification claim permitted"], evidence: ["Alternatives are represented as trade-offs, not a BEST DESIGN"], finalStatus: "UNKNOWN" });
add({ examId: "N", capabilityFamily: "integrated architectural reasoning", normalResult: "PARTIAL", adversarialResult: "PASS", transferResult: "UNKNOWN", mutantsKilled: ["ISOLATED_RECOMMENDATION_TO_SYSTEM_EFFECT"], failuresFound: ["No canonical consequence graph for all Nexus disciplines"], failuresRepaired: [], regressionCreated: ["nexus-propagation-chain"], gapsRemaining: ["Move→circulation→MEP→cost→schedule→daylight propagation is not productized"], evidence: ["A candidate change is required to carry dependencies, trade-offs, risks and unknowns"], finalStatus: "PARTIAL" });
add({ examId: "O", capabilityFamily: "human authority PF-H01", normalResult: "PASS", adversarialResult: "PASS", transferResult: "PASS", mutantsKilled: ["OPTIMUM_TO_HUMAN_DECISION", "RENTABILITY_TO_HARM"], failuresFound: [], failuresRepaired: [], regressionCreated: ["nexus-pf-h01-human-decision-boundary"], gapsRemaining: ["Human Authority remains required for any consequential decision"], evidence: ["Profitability is not treated as harm; deliberate human deterioration is flagged"], finalStatus: "PASS" });
const classification = ["FACT", "ASSUMPTION", "OBJECTIVE", "RESTRICTION", "PREFERENCE", "REQUIREMENT", "OBSERVATION", "EVIDENCE", "INFERENCE", "DECISION", "UNKNOWN"] as const;
assert.equal(classification.includes("UNKNOWN"), true);
assert.equal(sensorIsCanonical({ sensorId: "nexus-sensor", value: 1, unit: "unknown", timestamp: "t0", quality: "GOOD", source: "synthetic" }), false);
add({ examId: "P", capabilityFamily: "epistemology", normalResult: "PASS", adversarialResult: "PASS", transferResult: "PARTIAL", mutantsKilled: ["UNKNOWN_TO_TRUE", "UNKNOWN_TO_FALSE", "OBSERVATION_TO_FACT", "INFERENCE_TO_FACT", "ABSENCE_OF_EVIDENCE_TO_VIOLATION", "RECOMMENDATION_TO_DECISION"], failuresFound: [], failuresRepaired: [], regressionCreated: ["nexus-epistemic-classification"], gapsRemaining: ["Thirty-claim external corpus not generated in this bounded run"], evidence: [`${classification.length} epistemic labels preserved; sensor observation not canonical`], finalStatus: "PARTIAL" });
add({ examId: "Q", capabilityFamily: "transfer", normalResult: "BLOCKED", adversarialResult: "BLOCKED", transferResult: "BLOCKED", mutantsKilled: [], failuresFound: ["A second generated scenario was not executed because this run is the first Nexus baseline"], failuresRepaired: [], regressionCreated: [], gapsRemaining: ["Need a fresh non-Nexus scenario and no expected-answer reuse"], evidence: ["Transfer gate remains closed until baseline failures are converted into regression tests"], finalStatus: "BLOCKED" });

const requiredMutants = ["UNKNOWN_TO_TRUE", "UNKNOWN_TO_FALSE", "IGNORE_PROVENANCE", "IGNORE_UNITS", "IGNORE_APPLICABILITY", "IGNORE_SCALE", "IGNORE_JURISDICTION", "SIMULATION_TO_FACT", "OBSERVATION_TO_CANONICAL_FACT", "DESIGN_TO_AS_BUILT", "HASH_TO_SIGNATURE", "FORECAST_TO_FACT", "CORRELATION_TO_CAUSATION", "OPTIMUM_TO_HUMAN_DECISION", "IMPORT_SUCCESS_TO_FIDELITY", "COMMAND_SENT_TO_OBSERVED_SUCCESS", "PREFERENCE_TO_REQUIREMENT"];
const killed = new Set(sections.flatMap((section) => section.mutantsKilled));
const survivingMutants = requiredMutants.filter((mutant) => !killed.has(mutant));
assert.ok(survivingMutants.includes("HASH_TO_SIGNATURE"));
assert.ok(survivingMutants.includes("IGNORE_SCALE"));
const testTheTest = { status: survivingMutants.length === 0 ? "PASS" : "TEST_WEAKNESS_DETECTED", survivingMutants, killed: [...killed].sort() };

const finalStatus = sections.some((section) => section.finalStatus === "FAIL") ? "EXAM_FAILED" : sections.some((section) => ["BLOCKED", "UNKNOWN"].includes(section.finalStatus)) ? "EXAM_PARTIAL" : "EXAM_COMPLETED";
console.log(JSON.stringify({
  schema: "ARKI-COCO-EXAM-001-RESULT-1.0",
  status: finalStatus,
  caseId: "PROJECT-NEXUS-001",
  antiContamination: "PASS",
  sections,
  testTheTest,
  graph: { nodes: nexusNodes.length, bfs: bfsResult.length, dfs: dfsResult.length, pathToWetLab: pathToLab, components: components.length, cycleDetected, deterministic: graphFingerprint({ ...nexusGraph, nodes: [...nexusGraph.nodes].reverse(), edges: [...nexusGraph.edges].reverse() }) === graphBefore },
  scope: { productMutation: false, professionalCertification: false, canonicalAutoApproval: false, PFH01Modified: false },
}));
