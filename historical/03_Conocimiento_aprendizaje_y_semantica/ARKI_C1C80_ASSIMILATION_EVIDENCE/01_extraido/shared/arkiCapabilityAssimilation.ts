import { createHash } from "node:crypto";
import type { ReadinessState } from "./arkiCapabilityDigest";

export const ASSIMILATION_SCHEMA = "ARKI-C1C80-ASSIMILATION-1.0" as const;
export type CapabilityLifecycle = "TRANSFERRED" | "DOCUMENTED" | "DIGESTED" | "PREREQUISITES_READY" | "FORMALIZED" | "IMPLEMENTED_BOUNDED" | "TESTED" | "ADVERSARIALLY_TESTED" | "TRANSFER_TESTED" | "INTEGRATED" | "VERIFIED_BOUNDED" | "PROFESSIONAL_VALIDATION_REQUIRED";
export type DeficitKind = "KNOWLEDGE_DEFICIT" | "REASONING_DEFICIT" | "EVIDENCE_DEFICIT" | "INPUT_DEFICIT" | "TOOL_DEFICIT" | "SOLVER_DEFICIT" | "ORACLE_DEFICIT" | "GEOMETRY_DEFICIT" | "REPRESENTATION_DEFICIT" | "RELATIONSHIP_DEFICIT" | "CAUSAL_DEFICIT" | "CONSTRAINT_DEFICIT" | "STATE_DEFICIT" | "UNIT_DEFICIT" | "APPLICABILITY_DEFICIT" | "JURISDICTION_DEFICIT" | "TEMPORAL_DEFICIT" | "IMPLEMENTATION_DEFICIT" | "INTEGRATION_DEFICIT" | "VALIDATION_DEFICIT" | "PROFESSIONAL_VALIDATION_REQUIRED";
export type TrainingGate = "PREREQUISITES" | "IMPLEMENT" | "NORMAL" | "ADVERSARIAL" | "MUTANTS" | "TRANSFER" | "REGRESSION" | "EVIDENCE";

export type DeficitRecord = Readonly<{ kind: DeficitKind; what: string; why: string; evidence: readonly string[]; blocking: boolean; dependencies: readonly string[]; resolutionPath: string }>;
export type TrainingUnit = Readonly<{ schema: typeof ASSIMILATION_SCHEMA; capabilityId: string; foundation: readonly string[]; formalModel: string; inputContract: readonly string[]; outputContract: readonly string[]; method: readonly string[]; units: readonly string[]; assumptions: readonly string[]; applicability: readonly string[]; unknownHandling: readonly string[]; exercises: Readonly<{ normal: string; boundary: string; adversarial: string; mutants: readonly string[]; transfer: string }>; oracle: string; regression: readonly string[]; evidence: readonly string[]; lifecycle: CapabilityLifecycle; deficits: readonly DeficitRecord[] }>;

export function sha256(value: string): string { return `sha256:v1:${createHash("sha256").update(value).digest("hex")}`; }
export function deriveCluster(item: { domain: string; dependencies: readonly string[]; name: string }): string {
  const value = `${item.domain} ${item.name}`.toLowerCase();
  if (/structure|geotech|seismic|wind/.test(value)) return "STRUCTURES_GEOTECHNICS";
  if (/mep|energy|environment|thermal|hvac|electrical/.test(value)) return "MEP_BUILDING_PHYSICS";
  if (/bim|cad|ifc|digital|interoper/.test(value)) return "BIM_CAD_IFC_DIGITAL";
  if (/construction|cost|schedule|planning|budget/.test(value)) return "CONSTRUCTION_PLANNING_COST";
  if (/operation|maintenance|twin|asset/.test(value)) return "OPERATIONS_DIGITAL_TWIN";
  if (/simulation|optimization|solver|risk|financial/.test(value)) return "SIMULATION_OPTIMIZATION_RISK";
  if (/human|experience|hospital|special/.test(value)) return "SPECIALIZED_BUILDINGS_HUMAN_EXPERIENCE";
  return "ARCHITECTURAL_SPATIAL_REASONING";
}
export function prerequisiteKinds(item: { domain: string; dependencies: readonly string[] }): string[] {
  const kinds = ["MATHEMATICS", "GEOMETRY", "DOMAIN_KNOWLEDGE", "DATA", "REPRESENTATION"];
  const text = item.domain.toLowerCase();
  if (/engineering|interoperability/.test(text)) kinds.push("PHYSICS", "COMPUTATIONAL_METHODS", "ORACLE", "PROFESSIONAL_VALIDATION");
  if (item.dependencies.some((dep) => dep.includes("units"))) kinds.push("UNITS");
  return Array.from(new Set(kinds));
}
export function makeDeficits(item: { id: string; domain: string; dependencies: readonly string[]; requiredTools?: readonly string[]; professionalValidationRequirement?: string; implementationStatus: string }): DeficitRecord[] {
  const result: DeficitRecord[] = [
    { kind: "IMPLEMENTATION_DEFICIT", what: "No capability-specific implementation is authorized by the foundation registry", why: "The registry records foundation binding, not a demonstrated domain implementation", evidence: ["C1_C80_WAVE1_REGISTRY.json"], blocking: true, dependencies: item.dependencies, resolutionPath: "Define bounded capability contract and implement only after prerequisite gate" },
    { kind: "EVIDENCE_DEFICIT", what: "No capability-specific evidence package", why: "Foundation evidence does not prove domain behavior", evidence: ["WAVE1_OUTPUTS.txt"], blocking: true, dependencies: [item.id], resolutionPath: "Execute normal, adversarial, mutant, transfer and regression gates" },
  ];
  if ((item.requiredTools ?? []).length > 0) result.push({ kind: "TOOL_DEFICIT", what: "Required tool not demonstrated", why: "Registry declares a tool requirement without a connected execution proof", evidence: ["registry.requiredTools"], blocking: true, dependencies: item.dependencies, resolutionPath: "Govern an adapter and validate tool output" });
  if (item.professionalValidationRequirement && item.professionalValidationRequirement !== "NOT_REQUIRED") result.push({ kind: "PROFESSIONAL_VALIDATION_REQUIRED", what: "Professional validation boundary remains active", why: item.professionalValidationRequirement, evidence: ["registry.professionalValidationRequirement"], blocking: true, dependencies: [item.id], resolutionPath: "Obtain authorized professional review; never self-certify" });
  return result;
}
export function makeTrainingUnit(item: { id: string; name: string; domain: string; dependencies: readonly string[]; requiredTools?: readonly string[]; professionalValidationRequirement?: string; implementationStatus: string }, readiness: ReadinessState): TrainingUnit {
  const deficits = makeDeficits(item);
  return { schema: ASSIMILATION_SCHEMA, capabilityId: item.id, foundation: item.dependencies, formalModel: `Bounded declarative model for ${item.name}; no professional solver claim`, inputContract: ["stable identity", "applicability", "epistemic state", "evidence", "units", "provenance"], outputContract: ["bounded result", "unknowns", "evidence", "limitations", "candidate actions"], method: ["reuse-before-build", "explicit units", "fail-closed unknowns", "deterministic oracle where computable"], units: ["explicit units required; no silent conversion"], assumptions: ["no Aurora-specific input", "no unsupported professional claim"], applicability: ["registry scope only", `readiness=${readiness}`], unknownHandling: ["UNKNOWN is non-pass", "missing tools become TOOL_DEFICIT", "missing evidence blocks promotion"], exercises: { normal: `Synthetic ${item.domain} baseline`, boundary: "near-limit synthetic variant", adversarial: "wrong unit, missing evidence, stale revision and unsupported certainty", mutants: ["wrong unit", "swapped value", "wrong sign", "stale revision", "false provenance", "invalid applicability"], transfer: `Unseen synthetic ${item.domain} variant with changed scale or geometry` }, oracle: "Deterministic oracle required when objective computation is possible; otherwise independent reference or professional validation", regression: ["WAVE0", "WAVE1", "DIGEST-001", "capability-specific regression"], evidence: [], lifecycle: readiness === "REUSE_AVAILABLE" ? "DIGESTED" : "DOCUMENTED", deficits };
}
export function canPromote(unit: TrainingUnit, gates: Readonly<Record<TrainingGate, boolean>>): boolean { return unit.deficits.length === 0 && Object.values(gates).every(Boolean); }
export function quarantinePath(path: string): boolean { return /aurora|vertical[-_ ]aurora|arki[-_ ]be[-_ ]x01|150[-_ ](storey|story|pisos)/i.test(path); }
