import { createHash } from "node:crypto";
import type { Applicability, EvidenceRecord, ProvenanceRecord } from "./arkiSharedFoundation";

export const CAPABILITY_DIGEST_SCHEMA = "ARKI-CAPABILITY-DIGEST-1.0" as const;
export const CAPABILITY_KNOWLEDGE_PACKAGE_SCHEMA = "ARKI-CAPABILITY-KNOWLEDGE-PACKAGE-1.0" as const;

export type SourceTrust = "OFFICIAL_STANDARD" | "REGULATION" | "ACADEMIC" | "TECHNICAL_REFERENCE" | "MANUFACTURER" | "PROFESSIONAL_GUIDE" | "TRANSFER_PACKAGE" | "USER_INPUT" | "OBSERVATION" | "GENERATED_HYPOTHESIS" | "UNKNOWN_SOURCE";
export type ReadinessState = "READY_FOR_ASSIMILATION" | "PARTIAL_REUSE" | "REUSE_AVAILABLE" | "DEPENDENCY_BLOCKED" | "TOOL_DEFICIT" | "EVIDENCE_DEFICIT" | "KNOWLEDGE_DEFICIT" | "CONTRADICTION_DETECTED" | "PROFESSIONAL_VALIDATION_REQUIRED" | "HUMAN_DECISION_REQUIRED" | "NOT_READY";
export type ImplementationStatus = "DOCUMENTED" | "PARTIAL" | "IMPLEMENTED" | "VERIFIED" | "FOUNDATIONAL_OVERLAP" | "DOCUMENTED_OR_BLOCKED";
export type ReuseStrategy = "REUSE" | "EXTEND" | "ADAPT_SHARED_ENGINE" | "NEW_IMPLEMENTATION" | "EXTERNAL_TOOL_REQUIRED" | "BLOCKED";
export type UnknownSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type CapabilityKnowledgePackage = Readonly<{
  schema: typeof CAPABILITY_KNOWLEDGE_PACKAGE_SCHEMA;
  identity: { capabilityId: string; name: string; version: string };
  source: { uri: string; version: string; hash: string; trust: SourceTrust };
  description?: string;
  domain?: string;
  theory?: readonly string[];
  methods?: readonly string[];
  algorithms?: readonly string[];
  equations?: readonly string[];
  constraints?: readonly string[];
  dependencies?: readonly string[];
  references?: readonly string[];
  examples?: readonly string[];
  knownLimitations?: readonly string[];
  requiredTools?: readonly string[];
  expectedInputs?: readonly string[];
  expectedOutputs?: readonly string[];
  validationRequirements?: readonly string[];
  applicability?: Applicability;
  provenance: readonly ProvenanceRecord[];
  evidence: readonly EvidenceRecord[];
}>;

export type UnknownRecord = Readonly<{
  what: string;
  why: string;
  affectedCapability: string;
  dependencies: readonly string[];
  severity: UnknownSeverity;
  blocking: boolean;
  requiredEvidence: readonly string[];
  resolutionPath: string;
}>;

export type CodeEvidence = Readonly<{
  path: string;
  kind: "FILE" | "SYMBOL" | "TYPE" | "TEST" | "IMPORT" | "REGISTRY_REFERENCE";
  matches: readonly string[];
  readOnly: true;
}>;

export type CapabilityDigest = Readonly<{
  schema: typeof CAPABILITY_DIGEST_SCHEMA;
  capabilityId: string;
  source: CapabilityKnowledgePackage["source"];
  sourceVersion: string;
  sourceHash: string;
  semanticClassification: string;
  domains: readonly string[];
  scales: readonly string[];
  jurisdictions: readonly string[];
  dependencies: readonly string[];
  existingCapabilities: readonly string[];
  existingCode: readonly CodeEvidence[];
  sharedEngines: readonly string[];
  overlaps: readonly string[];
  contradictions: readonly string[];
  identityRequirements: readonly string[];
  epistemicState: "FACT" | "OBSERVED" | "INFERRED" | "ASSUMPTION" | "UNKNOWN" | "PROPOSAL";
  evidenceAvailable: readonly string[];
  evidenceMissing: readonly string[];
  provenance: readonly ProvenanceRecord[];
  units: readonly string[];
  toolsRequired: readonly string[];
  toolsAvailable: readonly string[];
  oracles: readonly string[];
  professionalValidation: readonly string[];
  unknowns: readonly UnknownRecord[];
  risks: readonly string[];
  reuseStrategy: ReuseStrategy;
  implementationReadiness: ReadinessState;
  implementationStatus: ImplementationStatus;
  testPlan: readonly string[];
  adversarialPlan: readonly string[];
  transferPlan: readonly string[];
  humanDecisionsRequired: readonly string[];
}>;

export type RegistryCapability = Readonly<{
  id: string;
  name: string;
  domain: string;
  dependencies: readonly string[];
  implementationStatus: ImplementationStatus;
  runtimeStatus?: string;
  verificationStatus?: string;
  requiredTools?: readonly string[];
  availableTools?: readonly string[];
  oracle?: string;
  professionalValidationRequirement?: string;
  reuseDecision?: string;
  evidenceBasis?: string;
}>;

const EXECUTABLE_KEY = /^(?:__proto__|prototype|constructor|callback|handler|function|execute|executable|eval|script)$/i;
const EXECUTABLE_TEXT = /(?:^|[^a-z])(eval\s*\(|new\s+Function\s*\(|javascript\s*:|<script\b)/i;

export function sha256(value: string | Uint8Array): string {
  return `sha256:v1:${createHash("sha256").update(value).digest("hex")}`;
}

export function rejectExecutablePayload(value: unknown, path = "$", seen = new WeakSet<object>()): void {
  if (typeof value === "function" || typeof value === "symbol" || typeof value === "bigint") throw new Error(`EXECUTABLE_PAYLOAD_REJECTED:${path}`);
  if (typeof value === "string" && EXECUTABLE_TEXT.test(value)) throw new Error(`EXECUTABLE_TEXT_REJECTED:${path}`);
  if (!value || typeof value !== "object") return;
  if (seen.has(value)) throw new Error(`CYCLIC_PACKAGE_REJECTED:${path}`);
  seen.add(value);
  if (Array.isArray(value)) value.forEach((item, index) => rejectExecutablePayload(item, `${path}[${index}]`, seen));
  else Object.entries(value).forEach(([key, item]) => {
    if (EXECUTABLE_KEY.test(key)) throw new Error(`EXECUTABLE_KEY_REJECTED:${path}.${key}`);
    rejectExecutablePayload(item, `${path}.${key}`, seen);
  });
  seen.delete(value);
}

export function validateCapabilityKnowledgePackage(pkg: CapabilityKnowledgePackage): void {
  rejectExecutablePayload(pkg);
  if (pkg.schema !== CAPABILITY_KNOWLEDGE_PACKAGE_SCHEMA) throw new Error("INVALID_KNOWLEDGE_PACKAGE_SCHEMA");
  if (!/^C\d{2,3}$/.test(pkg.identity.capabilityId) && !pkg.identity.capabilityId.startsWith("SYN-") && !pkg.identity.capabilityId.startsWith("TRANSFER-")) throw new Error("INVALID_CAPABILITY_ID");
  if (!pkg.identity.name.trim() || !pkg.identity.version.trim()) throw new Error("IDENTITY_REQUIRED");
  if (!pkg.source.uri.trim() || !pkg.source.hash.startsWith("sha256:v1:")) throw new Error("SOURCE_HASH_REQUIRED");
  if (pkg.provenance.length === 0) throw new Error("PROVENANCE_REQUIRED");
  if (pkg.evidence.some((item) => !item.contentHash.startsWith("sha256:v1:"))) throw new Error("EVIDENCE_HASH_REQUIRED");
}

export function classifyEpistemic(pkg: CapabilityKnowledgePackage): CapabilityDigest["epistemicState"] {
  if (pkg.evidence.length === 0) return "UNKNOWN";
  if (pkg.source.trust === "GENERATED_HYPOTHESIS" || pkg.source.trust === "USER_INPUT") return "PROPOSAL";
  if (pkg.evidence.some((e) => e.reliability === "HIGH")) return "OBSERVED";
  return "INFERRED";
}

export function discoverCode(capability: RegistryCapability, repositoryFiles: readonly string[]): CodeEvidence[] {
  const tokens = [capability.id, capability.name, ...capability.dependencies.filter((item) => item.startsWith("W1:"))];
  return repositoryFiles.filter((path) => tokens.some((token) => path.toLowerCase().includes(token.toLowerCase().replaceAll(" ", "-")))).slice(0, 20).map((path) => ({ path, kind: "FILE", matches: tokens.filter((token) => path.toLowerCase().includes(token.toLowerCase().replaceAll(" ", "-"))), readOnly: true as const }));
}

function unique(values: readonly string[]): string[] { return Array.from(new Set(values.filter(Boolean))); }

export function determineReadiness(input: { dependencies: readonly string[]; requiredTools: readonly string[]; availableTools: readonly string[]; evidence: readonly EvidenceRecord[]; unknowns: readonly UnknownRecord[]; contradictions: readonly string[]; professionalValidation: readonly string[]; humanDecisions: readonly string[]; implementationStatus: ImplementationStatus }): ReadinessState {
  if (input.contradictions.length > 0) return "CONTRADICTION_DETECTED";
  if (input.humanDecisions.length > 0) return "HUMAN_DECISION_REQUIRED";
  if (input.requiredTools.some((tool) => !input.availableTools.includes(tool))) return "TOOL_DEFICIT";
  if (input.evidence.length === 0) return "EVIDENCE_DEFICIT";
  if (input.unknowns.some((unknown) => unknown.blocking)) return "KNOWLEDGE_DEFICIT";
  if (input.professionalValidation.length > 0) return "PROFESSIONAL_VALIDATION_REQUIRED";
  if (input.dependencies.some((dependency) => dependency.startsWith("MISSING:"))) return "DEPENDENCY_BLOCKED";
  if (input.implementationStatus === "FOUNDATIONAL_OVERLAP") return "REUSE_AVAILABLE";
  if (input.implementationStatus === "PARTIAL") return "PARTIAL_REUSE";
  return "READY_FOR_ASSIMILATION";
}

export function digestCapability(pkg: CapabilityKnowledgePackage, registryItem: RegistryCapability, repositoryFiles: readonly string[], knownCapabilityIds: readonly string[]): CapabilityDigest {
  validateCapabilityKnowledgePackage(pkg);
  const contradictions: string[] = [];
  const requiredTools = unique([...(pkg.requiredTools ?? []), ...(registryItem.requiredTools ?? [])]);
  const availableTools = unique(registryItem.availableTools ?? []);
  const existingCode = discoverCode(registryItem, repositoryFiles);
  const evidenceMissing = pkg.evidence.length === 0 ? ["SOURCE_EVIDENCE"] : [];
  const unknowns: UnknownRecord[] = evidenceMissing.map((what) => ({ what, why: "No qualifying evidence was supplied in the digest input", affectedCapability: registryItem.id, dependencies: registryItem.dependencies, severity: "HIGH", blocking: true, requiredEvidence: ["source evidence with locator and content hash"], resolutionPath: "Provide qualifying evidence package and rerun digest" }));
  if (!pkg.applicability?.scale) unknowns.push({ what: "SCALE", why: "The registry does not establish a safe applicability scale for this capability", affectedCapability: registryItem.id, dependencies: registryItem.dependencies, severity: "HIGH", blocking: true, requiredEvidence: ["explicit scale applicability"], resolutionPath: "Supply a governed applicability context" });
  if (pkg.source.trust === "UNKNOWN_SOURCE") unknowns.push({ what: "SOURCE_TRUST", why: "The source trust category is unknown", affectedCapability: registryItem.id, dependencies: registryItem.dependencies, severity: "HIGH", blocking: true, requiredEvidence: ["qualified source classification"], resolutionPath: "Qualify the source before assimilation" });
  const professionalValidation = registryItem.professionalValidationRequirement && registryItem.professionalValidationRequirement !== "NOT_REQUIRED" ? [registryItem.professionalValidationRequirement] : [];
  const humanDecisions = contradictions.length ? ["Review contradiction before assimilation"] : [];
  const readiness = determineReadiness({ dependencies: registryItem.dependencies, requiredTools, availableTools, evidence: pkg.evidence, unknowns, contradictions, professionalValidation, humanDecisions, implementationStatus: registryItem.implementationStatus });
  return {
    schema: CAPABILITY_DIGEST_SCHEMA,
    capabilityId: registryItem.id,
    source: pkg.source,
    sourceVersion: pkg.source.version,
    sourceHash: pkg.source.hash,
    semanticClassification: `${registryItem.domain}:${registryItem.name}`,
    domains: [registryItem.domain],
    scales: pkg.applicability?.scale ? [pkg.applicability.scale] : [],
    jurisdictions: pkg.applicability?.jurisdiction ? [pkg.applicability.jurisdiction] : [],
    dependencies: registryItem.dependencies,
    existingCapabilities: knownCapabilityIds.filter((id) => id !== registryItem.id),
    existingCode,
    sharedEngines: registryItem.dependencies.filter((dependency) => dependency.startsWith("W1:")),
    overlaps: registryItem.reuseDecision === "ADAPT_SHARED_ENGINE" ? ["shared foundation overlap"] : [],
    contradictions,
    identityRequirements: ["stable semantic capability identity", "source/version/hash provenance"],
    epistemicState: classifyEpistemic(pkg),
    evidenceAvailable: pkg.evidence.map((e) => e.evidenceId),
    evidenceMissing,
    provenance: pkg.provenance,
    units: registryItem.dependencies.includes("W1:units") ? ["explicit unit context required"] : [],
    toolsRequired: requiredTools,
    toolsAvailable: availableTools,
    oracles: registryItem.oracle ? [registryItem.oracle] : [],
    professionalValidation,
    unknowns,
    risks: ["readiness is not implementation authorization", "registry evidence does not prove runtime capability"],
    reuseStrategy: registryItem.reuseDecision === "ADAPT_SHARED_ENGINE" ? "ADAPT_SHARED_ENGINE" : registryItem.reuseDecision === "BLOCKED_UNTIL_DEPENDENCIES_OR_EXTERNAL_TOOL" ? "EXTERNAL_TOOL_REQUIRED" : "EXTEND",
    implementationReadiness: readiness,
    implementationStatus: registryItem.implementationStatus,
    testPlan: ["normal", "boundary", "property", "mutant", "adversarial", "transfer", "regression"],
    adversarialPlan: ["duplicate identity", "wrong unit", "wrong scale", "missing provenance", "malicious executable payload", "fake VERIFIED claim"],
    transferPlan: ["process cold synthetic capability outside C1-C80"],
    humanDecisionsRequired: humanDecisions,
  };
}

export function assertNoCanonicalMutation(before: string, after: string): void { if (before !== after) throw new Error("CANONICAL_MUTATION_FORBIDDEN"); }

export const DIGEST_TRANSITIONS = Object.freeze([
  { from: "UNKNOWN", to: "OBSERVED", evidence: "qualifying observation", validation: "source qualification", authority: "none", reason: "evidence added" },
  { from: "OBSERVED", to: "FACT", evidence: "reproducible evidence", validation: "required validator", authority: "human authority where required", reason: "validated claim" },
  { from: "PROPOSAL", to: "FACT", evidence: "required evidence", validation: "independent validation", authority: "human authority", reason: "proposal promoted only after gate" },
] as const);

export function assertEpistemicTransition(from: string, to: string): void {
  if ((from === "UNKNOWN" && to === "FACT") || (from === "ASSUMPTION" && to === "VERIFIED") || (from === "PROPOSAL" && to === "FACT") || (from === "GENERATED" && to === "VERIFIED")) throw new Error("INVALID_EPISTEMIC_TRANSITION");
  if (!DIGEST_TRANSITIONS.some((item) => item.from === from && item.to === to)) throw new Error("UNREGISTERED_EPISTEMIC_TRANSITION");
}

export function buildRegistryPackage(item: RegistryCapability): CapabilityKnowledgePackage {
  const sourceUri = `registry://${item.id}`;
  const sourceHash = sha256(JSON.stringify(item));
  return {
    schema: CAPABILITY_KNOWLEDGE_PACKAGE_SCHEMA,
    identity: { capabilityId: item.id, name: item.name, version: "C1C80-W1-digest-1.0" },
    source: { uri: sourceUri, version: "C1C80-W1", hash: sourceHash, trust: "TRANSFER_PACKAGE" },
    description: item.evidenceBasis,
    domain: item.domain,
    dependencies: item.dependencies,
    requiredTools: item.requiredTools,
    provenance: [{ provenanceId: `prov:${item.id}`, source: sourceUri, sourceType: "SYSTEM", actor: "DIGEST-001", observedAt: new Date(0).toISOString(), action: "READ_ONLY_REGISTRY_DIGEST", evidenceIds: [] }],
    evidence: [{ evidenceId: `registry-evidence:${item.id}`, sourceUri, sourceType: "TEST", observedAt: new Date(0).toISOString(), contentHash: sourceHash, reliability: "MEDIUM", locator: `registry.${item.id}` }],
  };
}
