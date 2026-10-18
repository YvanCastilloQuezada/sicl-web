import { strict as assert } from "node:assert";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { assertApplicability, assertEpistemicConsistency, reviewCuratorProposal, rejectExecutablePayload, type FoundationSnapshot } from "../shared/arkiSharedFoundation";
import { assertEpistemicTransition, validateCapabilityKnowledgePackage, type CapabilityKnowledgePackage } from "../shared/arkiCapabilityDigest";

const root = path.resolve(import.meta.dirname, "..");
const registryPath = path.join(root, "C1_C80_WAVE1_REGISTRY.json");
const registry = JSON.parse(await readFile(registryPath, "utf8")) as { capabilities: Array<Record<string, unknown>> };
for (const item of registry.capabilities) {
  if (item.implementationStatus === "FOUNDATIONAL_OVERLAP") {
    item.implementationStatus = "DOCUMENTED";
    assert.equal(item.reuseDecision, "ADAPT_SHARED_ENGINE");
  }
}
await writeFile(registryPath, `${JSON.stringify(registry, null, 2)}\n`);

const baseSnapshot: FoundationSnapshot = { schema: "ARKI-SHARED-FOUNDATION-1.0", identities: [], mappings: [], concepts: [], evidence: [], quantities: [], dependencies: [] };
assert.doesNotThrow(() => reviewCuratorProposal(baseSnapshot, { proposalId: "p1", kind: "ADD_CONCEPT", provenance: [] }));
assert.throws(() => rejectExecutablePayload(() => true), /ARBITRARY_CODE_REJECTED/);
assert.doesNotThrow(() => rejectExecutablePayload({ text: "ordinary text about eval and functions" }));
assert.throws(() => rejectExecutablePayload({ callback: "not allowed" }), /ARBITRARY_CODE_REJECTED/);
assert.doesNotThrow(() => assertApplicability({ scale: "BUILDING", disciplines: ["ARCHITECTURE"], jurisdiction: "PE", phase: "DESIGN", projectType: "RESIDENTIAL" }, { scale: "BUILDING", disciplines: ["ARCHITECTURE"], jurisdiction: "PE", phase: "DESIGN", projectType: "RESIDENTIAL" }));
assert.throws(() => assertApplicability({ scale: "CITY", disciplines: ["ARCHITECTURE"] }, { scale: "BUILDING", disciplines: ["ARCHITECTURE"] }), /NO_SCALE_EXTRAPOLATION/);
assert.throws(() => assertEpistemicConsistency({ truth: "FACT", evidence: "NONE", validation: "NOT_VALIDATED", humanDecisionRequired: false }), /FACT_REQUIRES_EVIDENCE/);
assert.doesNotThrow(() => assertEpistemicConsistency({ truth: "OBSERVED", evidence: "PRESENT", validation: "NOT_VALIDATED", humanDecisionRequired: false }));
assert.throws(() => assertEpistemicTransition("UNKNOWN", "FACT"), /INVALID_EPISTEMIC_TRANSITION/);
assert.throws(() => assertEpistemicTransition("PROPOSAL", "FACT"), /INVALID_EPISTEMIC_TRANSITION/);
const pkg: CapabilityKnowledgePackage = { schema: "ARKI-CAPABILITY-KNOWLEDGE-PACKAGE-1.0", identity: { capabilityId: "SYN-001", name: "Synthetic capability", version: "1" }, source: { uri: "test://synthetic", version: "1", hash: "sha256:v1:test", trust: "TRANSFER_PACKAGE" }, provenance: [{ provenanceId: "p", source: "test", sourceType: "TEST", actor: "test", observedAt: new Date(0).toISOString(), action: "test", evidenceIds: [] }], evidence: [] };
assert.throws(() => validateCapabilityKnowledgePackage({ ...pkg, source: { ...pkg.source, hash: "fnv1a:weak" } }), /SOURCE_HASH_REQUIRED/);
console.log(JSON.stringify({ status: "PASS", h01StatusCorrections: registry.capabilities.filter((item) => item.implementationStatus === "DOCUMENTED").length, identity: "PASS", executablePayload: "PASS", curator: "PASS", applicability: "PASS", epistemic: "PASS" }));
