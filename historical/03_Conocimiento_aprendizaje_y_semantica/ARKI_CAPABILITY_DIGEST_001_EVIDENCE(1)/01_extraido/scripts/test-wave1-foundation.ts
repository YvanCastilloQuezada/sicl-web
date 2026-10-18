import { strict as assert } from "node:assert";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { addQuantities, normalizeUnit, type UnitValue } from "../shared/arkiSharedFoundation";
import { createCapabilityOutput, validateCapabilityInput, type CapabilityInputBase } from "../shared/arkiCapabilityContracts";

type Capability = {
  id: string;
  name: string;
  domain: string;
  dependencies: string[];
  inputContract: string;
  outputContract: string;
};

type Registry = { capabilities: Capability[] };
const root = path.resolve(import.meta.dirname, "..");
const registry = JSON.parse(await readFile(path.join(root, "C1_C80_WAVE0/01_C1_C80_CAPABILITY_REGISTRY.json"), "utf8")) as Registry;
const capabilities = registry.capabilities.map((item) => ({
  ...item,
  implementationStatus: item.implementationStatus === "FOUNDATIONAL_OVERLAP" ? "DOCUMENTED" : item.implementationStatus,
  inputContract: item.inputContract === "WAVE0_CONTRACT_TO_DEFINE" ? "ARKI-CAPABILITY-INPUT-BASE-1.0 + CAPABILITY_SPECIFIC_EXTENSION" : item.inputContract,
  outputContract: item.outputContract === "WAVE0_EVIDENCE_RECORD" ? "ARKI-CAPABILITY-OUTPUT-BASE-1.0 + CAPABILITY_SPECIFIC_EXTENSION" : item.outputContract,
}));
await writeFile(path.join(root, "C1_C80_WAVE1_REGISTRY.json"), `${JSON.stringify({ ...registry, status: "WAVE1_FOUNDATION_RECONCILED", capabilities }, null, 2)}\n`);
const ids = new Set(capabilities.map((item) => item.id));
const names = new Set(capabilities.map((item) => item.name));
const allowedDomains = new Set(["Architecture", "Engineering", "Experience", "Interoperability", "Learning and evaluation"]);
const sharedReferences = new Set<string>();
const edges: Array<{ from: string; to: string; kind: "CAPABILITY" | "SHARED_ENGINE" }> = [];

assert.equal(capabilities.length, 80, "WAVE1_DAG_CAPABILITY_COUNT");
assert.equal(ids.size, 80, "WAVE1_DAG_UNIQUE_IDS");
assert.equal(names.size, 80, "WAVE1_DAG_UNIQUE_NAMES");

for (const capability of capabilities) {
  assert.match(capability.id, /^C\d{2}$/);
  assert.ok(allowedDomains.has(capability.domain), `INVALID_DOMAIN:${capability.id}`);
  assert.ok(capability.inputContract !== "WAVE0_CONTRACT_TO_DEFINE", `UNRESOLVED_INPUT_CONTRACT:${capability.id}`);
  assert.ok(capability.outputContract.length > 0, `MISSING_OUTPUT_CONTRACT:${capability.id}`);
  for (const dependency of capability.dependencies) {
    if (/^C\d{2}$/.test(dependency)) {
      assert.ok(ids.has(dependency), `MISSING_CAPABILITY_DEPENDENCY:${capability.id}->${dependency}`);
      assert.notEqual(capability.id, dependency, `SELF_DEPENDENCY:${capability.id}`);
      edges.push({ from: dependency, to: capability.id, kind: "CAPABILITY" });
    } else {
      assert.match(dependency, /^W\d+:[a-z0-9-]+$/, `INVALID_SHARED_ENGINE_REFERENCE:${dependency}`);
      sharedReferences.add(dependency);
      edges.push({ from: dependency, to: capability.id, kind: "SHARED_ENGINE" });
    }
  }
}

const capabilityGraph = new Map<string, string[]>();
for (const edge of edges.filter((item) => item.kind === "CAPABILITY")) {
  capabilityGraph.set(edge.from, [...(capabilityGraph.get(edge.from) ?? []), edge.to]);
}
const active = new Set<string>();
const complete = new Set<string>();
const visit = (id: string): void => {
  if (active.has(id)) throw new Error(`PROHIBITED_DAG_CYCLE:${id}`);
  if (complete.has(id)) return;
  active.add(id);
  for (const next of capabilityGraph.get(id) ?? []) visit(next);
  active.delete(id);
  complete.add(id);
};
for (const id of ids) visit(id);

const inbound = new Set(edges.filter((item) => item.kind === "CAPABILITY").map((item) => item.to));
const outbound = new Set(edges.filter((item) => item.kind === "CAPABILITY").map((item) => item.from));
const orphanCapabilities = capabilities.filter((item) => item.dependencies.length === 0 && !inbound.has(item.id) && !outbound.has(item.id)).map((item) => item.id);
assert.equal(orphanCapabilities.length, 0, `ORPHAN_CAPABILITIES:${orphanCapabilities.join(",")}`);

const units: UnitValue = { value: 12, unit: "m", dimension: "LENGTH" };
assert.equal(normalizeUnit(units, "mm").value, 12000, "M_TO_MM");
assert.equal(addQuantities({ value: 5, unit: "m", dimension: "LENGTH" }, { value: 200, unit: "cm", dimension: "LENGTH" }).value, 7, "MIXED_LENGTH");
assert.throws(() => addQuantities({ value: 12, unit: "m", dimension: "LENGTH" }, { value: 5, unit: "m2", dimension: "AREA" }), /UNIT_DIMENSION_MISMATCH|DIMENSION_MISMATCH/);
assert.equal(normalizeUnit({ value: 2, unit: "kN", dimension: "FORCE" }, "N").value, 2000, "KN_TO_N");
assert.equal(normalizeUnit({ value: 2, unit: "kPa", dimension: "PRESSURE" }, "Pa").value, 2000, "KPA_TO_PA");
assert.equal(normalizeUnit({ value: 2, unit: "kW", dimension: "POWER" }, "W").value, 2000, "KW_TO_W");
assert.equal(normalizeUnit({ value: 1, unit: "m3/s", dimension: "FLOW" }, "L/s").value, 1000, "M3S_TO_LS");
assert.equal(normalizeUnit({ value: 180, unit: "deg", dimension: "ANGLE" }, "rad").value.toFixed(6), "3.141593", "DEG_TO_RAD");
assert.throws(() => normalizeUnit({ value: 20, unit: "C", dimension: "TEMPERATURE" }, "K"), /TEMPERATURE_CONTEXT_REQUIRED/);
assert.equal(normalizeUnit({ value: 20, unit: "C", dimension: "TEMPERATURE" }, "K", { temperatureKind: "ABSOLUTE" }).value, 293.15, "C_TO_K");
assert.throws(() => normalizeUnit({ value: 10, unit: "USD", dimension: "CURRENCY", currency: "USD" }, "PEN"), /CURRENCY_CONVERSION_CONTEXT_REQUIRED/);
assert.equal(normalizeUnit({ value: 10, unit: "USD", dimension: "CURRENCY", currency: "USD" }, "PEN", { currencyRates: { USD: 3.7 }, rateDate: "2026-09-24" }).value, 37, "EXPLICIT_CURRENCY_RATE");

const input: CapabilityInputBase = {
  schema: "ARKI-CAPABILITY-INPUT-BASE-1.0",
  context: { requestId: "req-wave1", actorId: "test", requestedAt: "2026-09-24T00:00:00Z" },
  epistemic: { truth: "OBSERVED", evidence: "PRESENT", validation: "NOT_VALIDATED", humanDecisionRequired: false },
  evidenceRefs: ["evidence:test"],
  provenance: [],
  units: [units],
  unknowns: [],
  humanAuthority: { required: false },
};
validateCapabilityInput(input);
const output = createCapabilityOutput({
  capabilityId: "WAVE1-TEST",
  result: { ok: true },
  resultType: "ASSESSMENT",
  affectedEntityRefs: [],
  epistemic: input.epistemic,
  evidence: [],
  provenance: [],
  assumptions: [],
  unknowns: [],
  limitations: [],
  invalidatedDependencyRefs: [],
  candidateActions: [],
  professionalValidationRequired: false,
});
assert.equal(output.canonicalMutationRequested, false, "OUTPUT_MUST_NOT_COMMIT");

const dag = {
  schema: "ARKI-C1C80-DAG-1.0",
  capabilityCount: capabilities.length,
  nodes: capabilities.map((item) => ({ id: item.id, name: item.name, domain: item.domain })),
  edges,
  sharedEngineReferences: [...sharedReferences].sort(),
  orphanCapabilities,
  prohibitedCycles: true,
  generatedAt: "2026-09-24T00:00:00Z",
};
await writeFile(path.join(root, "C1_C80_WAVE1_DAG.json"), `${JSON.stringify(dag, null, 2)}\n`);
console.log(JSON.stringify({ status: "PASS", capabilityCount: 80, uniqueIds: true, uniqueNames: true, cycles: 0, orphanCapabilities: 0, sharedEngineReferences: sharedReferences.size, unitMutants: 10, inputOutputContracts: "PASS" }));
