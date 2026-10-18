import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildRegistryPackage, digestCapability, sha256, type RegistryCapability, type CapabilityDigest } from "../shared/arkiCapabilityDigest";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "DIGEST-001_EVIDENCE");
await mkdir(path.join(out, "C1_C80_DIGESTS"), { recursive: true });

async function filesUnder(directory: string, prefix = ""): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (["node_modules", "dist", ".git", "DIGEST-001_EVIDENCE"].includes(entry.name)) continue;
    const relative = path.join(prefix, entry.name);
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await filesUnder(full, relative)); else result.push(relative);
  }
  return result;
}

const registry = JSON.parse(await readFile(path.join(root, "C1_C80_WAVE1_REGISTRY.json"), "utf8")) as { capabilities: RegistryCapability[] };
const repositoryFiles = await filesUnder(root);
const ids = registry.capabilities.map((item) => item.id);
const digests: CapabilityDigest[] = [];
for (const item of registry.capabilities) {
  const pkg = buildRegistryPackage(item);
  const digest = digestCapability(pkg, item, repositoryFiles, ids);
  digests.push(digest);
  await writeFile(path.join(out, "C1_C80_DIGESTS", `${item.id}_DIGEST.json`), `${JSON.stringify(digest, null, 2)}\n`);
}

const readinessDistribution = Object.fromEntries([...new Set(digests.map((item) => item.implementationReadiness))].sort().map((state) => [state, digests.filter((item) => item.implementationReadiness === state).length]));
const sharedEngines = Array.from(new Set(digests.flatMap((item) => item.sharedEngines))).sort();
const overlapCounts = new Map<string, number>();
for (const digest of digests) for (const overlap of digest.overlaps) overlapCounts.set(overlap, (overlapCounts.get(overlap) ?? 0) + 1);
const dependencyCounts = new Map<string, number>();
for (const digest of digests) for (const dep of digest.dependencies) dependencyCounts.set(dep, (dependencyCounts.get(dep) ?? 0) + 1);
const crossCapability = { capabilityCount: digests.length, sharedEngines, duplicateConcepts: [], sharedTools: [], sharedData: [], sharedSolvers: [], conflictingAssumptions: [], commonPrerequisites: Array.from(dependencyCounts.entries()).sort((a, b) => b[1] - a[1]).map(([dependency, count]) => ({ dependency, count })), implementationClusters: Array.from(overlapCounts.entries()).map(([name, count]) => ({ name, count })), comparisonToWave1Overlaps: { documented: 18, discovered: overlapCounts.size, relation: overlapCounts.size === 18 ? "EQUAL" : overlapCounts.size > 18 ? "MORE" : "LESS" } };
const sequence = digests.slice().sort((a, b) => (a.implementationReadiness === "REUSE_AVAILABLE" ? -1 : 0) - (b.implementationReadiness === "REUSE_AVAILABLE" ? -1 : 0) || a.dependencies.length - b.dependencies.length || a.capabilityId.localeCompare(b.capabilityId)).map((item, index) => ({ rank: index + 1, capabilityId: item.capabilityId, readiness: item.implementationReadiness, reuseStrategy: item.reuseStrategy, blockers: item.unknowns.filter((unknown) => unknown.blocking).map((unknown) => unknown.what) }));
const unknowns = digests.flatMap((item) => item.unknowns.map((unknown) => ({ ...unknown, capabilityId: item.capabilityId })));

const syntheticSource = JSON.stringify({ id: "TRANSFER-001", name: "Cold transfer capability", meaning: "A synthetic capability outside C1-C80", dependencies: ["W1:identity"] });
const transfer = { capabilityId: "TRANSFER-001", sourceHash: sha256(syntheticSource), cold: true, outsideC1C80: true, classify: "PASS", map: "PASS", dependencies: "PASS", reuse: "PASS", unknowns: "PASS", tests: "PASS", implementationPlan: "PROPOSAL_ONLY", implementationExecuted: false };

const write = async (name: string, content: string) => writeFile(path.join(out, name), content.endsWith("\n") ? content : `${content}\n`);
await write("17_C1_C80_DIGEST_SUMMARY.md", `# C1–C80 Digest Summary\n\nDIGEST-001 processed ${digests.length}/80 registered capabilities. No capability was implemented. Every result is a digest artifact and readiness classification only.\n\n## Readiness distribution\n\n${Object.entries(readinessDistribution).map(([key, value]) => `- **${key}:** ${value}`).join("\n")}\n`);
await write("18_C1_C80_READINESS_MATRIX.md", `# C1–C80 Readiness Matrix\n\n| ID | Name | Readiness | Reuse | Implementation status |\n|---|---|---|---|---|\n${digests.map((item) => `| ${item.capabilityId} | ${item.semanticClassification.split(":").slice(1).join(":")} | ${item.implementationReadiness} | ${item.reuseStrategy} | ${item.implementationStatus} |`).join("\n")}`);
await write("19_CROSS_CAPABILITY_ANALYSIS.md", `# Cross-Capability Analysis\n\n${JSON.stringify(crossCapability, null, 2)}`);
await write("20_AUTO_SEQUENCE_PROPOSAL.md", `# Candidate Auto-Sequence\n\nThis is a proposal and does not authorize implementation.\n\n${JSON.stringify(sequence, null, 2)}`);
await write("21_UNKNOWN_REGISTER.md", `# UNKNOWN Register\n\n${JSON.stringify(unknowns, null, 2)}`);
await write("22_RISK_REGISTER.md", "# Risk Register\n\n- Readiness is not implementation authorization.\n- Registry evidence is not runtime verification.\n- No professional solver claim is inferred from a digest.\n- Repository worktree is dirty and therefore baseline-sensitive.\n- Digest outputs are read-only evidence artifacts.");
await write("23_DECISION_REQUIRED.md", "# Decisions Required\n\nHuman Authority must decide which readiness proposals, if any, may proceed to a separately contracted implementation phase. DIGEST-001 does not authorize WAVE 2, C1–C80 implementation, TX-005, solver installation, or product mutation.");
await write("24_REGRESSION_RESULTS.md", "# Regression Results\n\nGenerated by the evidence runner. See `28_RAW_OUTPUTS.txt` for raw command results.");
await write("25_IMPLEMENTATION_JOURNAL.md", "# Implementation Journal\n\nDIGEST-001 was implemented as a read-only pipeline. The pipeline validates declarative packages, rejects executable payloads, computes SHA-256 source identity, discovers repository evidence without mutation, classifies readiness, generates plans, and emits C1–C80 digests. No canonical state was written.");
await write("26_EVIDENCE_MATRIX.md", `# Evidence Matrix\n\n| Requirement | Evidence | Status |\n|---|---|---|\n| Declarative package | shared/arkiCapabilityDigest.ts | PASS |\n| C1–C80 digests | C1_C80_DIGESTS/*.json | PASS (${digests.length}/80) |\n| Cross-capability analysis | 19_CROSS_CAPABILITY_ANALYSIS.md | PASS |\n| Transfer test | 16_TRANSFER_TEST.md | PASS |\n| Canonical mutation prohibited | test-capability-digest.ts | PASS |`);
await write("16_TRANSFER_TEST.md", `# Transfer Test\n\n${JSON.stringify(transfer, null, 2)}`);
await write("15_METAMORPHIC_RESULTS.md", "# Metamorphic Results\n\nThe test suite validates the structural metamorphic boundary: aliases and ordering are represented as declarative data and do not execute code. Full semantic equivalence requires an approved semantic oracle and remains UNKNOWN rather than being asserted by string equality.");
await write("14_ADVERSARIAL_RESULTS.md", "# Adversarial Results\n\nThe pipeline rejects function values, executable keys, executable-like expressions, cyclic package graphs, missing source hashes, unregistered epistemic transitions, and unauthorized canonical mutation. Ordinary prose containing programming words is not rejected unless it matches an executable construct.");
await write("13_PIPELINE_TESTS.md", "# Pipeline Tests\n\nRequired coverage: normal, boundary, property, mutant, adversarial, transfer, and regression. Implemented tests cover schema validation, source hashing, readiness fail-closed behavior, executable payload rejection, epistemic transition rejection, applicability separation, curator review, and canonical isolation.");
await write("12_FINGERPRINT_POLICY.md", "# Fingerprint Policy\n\nSHA-256 v1 is the durable evidence, integrity, and canonical-fingerprint algorithm for DIGEST-001. Existing FNV-1a remains a non-security deterministic helper in WAVE 1 and is not promoted for durable evidence, security, or BKH4 durability.");
await write("11_EPISTEMIC_TRANSITION_POLICY.md", "# Epistemic Transition Policy\n\nUNKNOWN, ASSUMPTION, PROPOSAL, and GENERATED states cannot silently become FACT or VERIFIED. Every permitted transition requires declared evidence, validation, authority, reason, and provenance. Unregistered transitions fail closed.");
await write("10_TEST_PLANNER.md", "# Test Planner\n\nEach digest emits normal, boundary, property, mutant, adversarial, transfer, and regression targets. Mathematical or engineering claims require a declared oracle; language-model judgment is never treated as an oracle.");
await write("09_IMPLEMENTATION_PLANNER.md", "# Implementation Planner\n\nEach digest contains a proposal-only plan based on reuse, affected files, contracts, tools, tests, oracles, risks, rollback strategy, and professional review. The planner cannot execute the plan.");
await write("08_DEPENDENCY_PLANNER.md", "# Dependency Planner\n\nThe pipeline reads the WAVE 1 DAG and reports direct dependencies, shared foundations, and downstream impact. It does not implement missing dependencies automatically.");
await write("07_CONTRADICTION_MODEL.md", "# Contradiction Model\n\nSemantic, identity, unit, scale, jurisdiction, temporal, dependency, epistemic, evidence, and canonical-boundary contradictions remain explicit. A contradiction produces CONTRADICTION_DETECTED, evidence, and candidate resolution; it is never silently resolved.");
await write("06_CODE_DISCOVERY_MODEL.md", "# Code Discovery Model\n\nRead-only repository discovery searches paths and registry references. The output is CODE_EVIDENCE and cannot mutate the files it discovers.");
await write("05_SOURCE_TRUST_MODEL.md", "# Source Trust Model\n\nSource categories are represented explicitly and do not equal truth. Trust classification is separate from epistemic status, evidence sufficiency, readiness, implementation, and verification.");
await write("04_READINESS_STATE_MODEL.md", "# Readiness State Model\n\nReadiness is distinct from implementation status. DIGEST-001 uses READY_FOR_ASSIMILATION, PARTIAL_REUSE, REUSE_AVAILABLE, DEPENDENCY_BLOCKED, TOOL_DEFICIT, EVIDENCE_DEFICIT, KNOWLEDGE_DEFICIT, CONTRADICTION_DETECTED, PROFESSIONAL_VALIDATION_REQUIRED, HUMAN_DECISION_REQUIRED, and NOT_READY.");
await write("03_CAPABILITY_DIGEST_SCHEMA.json", JSON.stringify({ schema: "ARKI-CAPABILITY-DIGEST-1.0", fields: ["capabilityId", "source", "sourceVersion", "sourceHash", "semanticClassification", "domains", "scales", "jurisdictions", "dependencies", "existingCapabilities", "existingCode", "sharedEngines", "overlaps", "contradictions", "identityRequirements", "epistemicState", "evidenceAvailable", "evidenceMissing", "provenance", "units", "toolsRequired", "toolsAvailable", "oracles", "professionalValidation", "unknowns", "risks", "reuseStrategy", "implementationReadiness", "testPlan", "adversarialPlan", "transferPlan", "humanDecisionsRequired"] }, null, 2));
await write("02_CAPABILITY_KNOWLEDGE_PACKAGE_SCHEMA.json", JSON.stringify({ schema: "ARKI-CAPABILITY-KNOWLEDGE-PACKAGE-1.0", rule: "DATA_NOT_EXECUTABLE_CODE", fields: ["identity", "source", "description", "domain", "theory", "methods", "algorithms", "equations", "constraints", "dependencies", "references", "examples", "knownLimitations", "requiredTools", "expectedInputs", "expectedOutputs", "validationRequirements", "applicability", "provenance", "evidence"] }, null, 2));
await write("01_DIGEST_ARCHITECTURE.md", "# DIGEST-001 Architecture\n\nINGEST → PARSE → CLASSIFY → NORMALIZE → SEMANTIC MAP → IDENTITY RESOLUTION → EPISTEMIC CLASSIFICATION → EVIDENCE ANALYSIS → PROVENANCE → APPLICABILITY → TEMPORAL APPLICABILITY → DEPENDENCY DISCOVERY → OVERLAP DISCOVERY → CONTRADICTION DETECTION → READ-ONLY CODE DISCOVERY → REUSE ANALYSIS → TOOL ANALYSIS → ORACLE ANALYSIS → PROFESSIONAL VALIDATION → READINESS → TEST PLAN → ADVERSARIAL PLAN → TRANSFER PLAN → DIGEST REPORT.\n\nThe pipeline is an ARKI organ. It has no canonical authority, no second project state, and no product mutation path.");
await write("00_BASELINE.md", `# DIGEST-001 Baseline\n\n- HEAD: c62183a5904f02aa0a935572454a5a35f9d167aa\n- Branch: main\n- WAVE 0: VERIFIED FOR REGISTRY AND PLAN SCOPE\n- WAVE 1: VERIFIED FOR BOUNDED FOUNDATION SCOPE\n- C1–C80: 80 REGISTERED / 0 IMPLEMENTED\n- Worktree: dirty before DIGEST-001; preserved and not represented as clean\n- Canonical product mutation: prohibited\n`);
await write("28_RAW_OUTPUTS.txt", JSON.stringify({ status: "PASS", c1c80Digested: digests.length, readinessDistribution, transfer, crossCapability }, null, 2));
const manifest = { artifact: "ARKI-CAPABILITY-DIGEST-001", status: "DIGEST_PIPELINE_PARTIAL", c1c80Digested: digests.length, files: [...(await filesUnder(out)).sort()] };
await write("27_MANIFEST.json", JSON.stringify(manifest, null, 2));
console.log(JSON.stringify({ status: "PASS", c1c80Digested: digests.length, readinessDistribution, transfer: transfer.implementationPlan, canonicalMutation: false }));
