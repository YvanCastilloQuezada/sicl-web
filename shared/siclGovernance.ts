export const CAPABILITY_GATE_STAGES = [
  "PROPOSAL",
  "CONTRACT",
  "AUTHORIZED",
  "IMPLEMENTED",
  "VERIFIED",
  "AUDITED",
  "RELEASED",
] as const;

export type CapabilityGateStage = (typeof CAPABILITY_GATE_STAGES)[number];
export type BuildRole = "PRODUCT_OWNER" | "CHIEF_ARCHITECT" | "IMPLEMENTATION_ENGINEER";

export type CapabilityGateRecord = {
  stage: CapabilityGateStage;
  label: string;
  owner: BuildRole;
  reference: string;
};

export const SICL_65_CAPABILITY_GATES: readonly CapabilityGateRecord[] = [
  { stage: "PROPOSAL", label: "Capability proposed", owner: "PRODUCT_OWNER", reference: "doc65:proposal" },
  { stage: "CONTRACT", label: "Semantic contract", owner: "CHIEF_ARCHITECT", reference: "doc65:contract" },
  { stage: "AUTHORIZED", label: "Roadmap authorization", owner: "PRODUCT_OWNER", reference: "doc65:authorization" },
  { stage: "IMPLEMENTED", label: "Code and integration", owner: "IMPLEMENTATION_ENGINEER", reference: "checkpoint:a73890ab" },
  { stage: "VERIFIED", label: "Tests and evidence", owner: "IMPLEMENTATION_ENGINEER", reference: "tests:web38+python" },
  { stage: "AUDITED", label: "Architectural audit", owner: "CHIEF_ARCHITECT", reference: "doc65:boundary-review" },
  { stage: "RELEASED", label: "Reproducible release", owner: "PRODUCT_OWNER", reference: "checkpoint:a73890ab" },
] as const;

export function isSequentialCapabilityGateLedger(records: readonly CapabilityGateRecord[]): boolean {
  return records.length === CAPABILITY_GATE_STAGES.length && records.every((record, index) => record.stage === CAPABILITY_GATE_STAGES[index]);
}
