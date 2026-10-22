export type SynthesisPort = {
  name: string;
  dataType: string;
  semanticRole: string;
};

export type SynthesisPrimitive = {
  primitiveId: string;
  capability: string;
  inputs: readonly SynthesisPort[];
  outputs: readonly SynthesisPort[];
  sourceRefs: readonly string[];
  deterministic: boolean | "UNKNOWN";
  licenseGate: "PASS" | "EXTERNAL_ONLY" | "UNKNOWN";
};

export type CapabilityComposition = {
  candidateId: string;
  artifactKind: "CAPABILITY_CANDIDATE";
  goalCapability: string;
  primitives: readonly SynthesisPrimitive[];
  links: readonly {
    fromPrimitiveId: string;
    fromPort: string;
    toPrimitiveId: string;
    toPort: string;
    dataType: string;
  }[];
  noveltyClaims: readonly string[];
  requiredOracles: readonly string[];
  status: "SANDBOX_PROPOSAL";
  canonicalMutation: false;
  geometryAuthority: "NONE";
  architecturalAuthority: "NONE";
};

export type SynthesisGateResult = {
  acceptedForSandbox: boolean;
  failures: readonly string[];
};

export function validateComposition(candidate: CapabilityComposition): SynthesisGateResult {
  const failures: string[] = [];
  const primitives = new Map(candidate.primitives.map(p => [p.primitiveId, p]));

  if (candidate.artifactKind !== "CAPABILITY_CANDIDATE") failures.push("INVENTOR_OUTPUT_FORBIDDEN");
  if (candidate.canonicalMutation !== false || candidate.geometryAuthority !== "NONE" || candidate.architecturalAuthority !== "NONE") {
    failures.push("INVENTOR_AUTHORITY_FORBIDDEN");
  }
  if (candidate.primitives.length < 2) failures.push("COMPOSITION_REQUIRES_MULTIPLE_PRIMITIVES");
  if (!candidate.goalCapability.trim()) failures.push("GOAL_CAPABILITY_REQUIRED");
  if (candidate.requiredOracles.length === 0) failures.push("INDEPENDENT_ORACLE_REQUIRED");

  for (const primitive of candidate.primitives) {
    if (primitive.licenseGate === "UNKNOWN") failures.push(`LICENSE_UNKNOWN:${primitive.primitiveId}`);
  }

  for (const link of candidate.links) {
    const source = primitives.get(link.fromPrimitiveId);
    const target = primitives.get(link.toPrimitiveId);
    if (!source || !target) {
      failures.push(`PRIMITIVE_NOT_FOUND:${!source ? link.fromPrimitiveId : link.toPrimitiveId}`);
      continue;
    }
    const output = source.outputs.find(port => port.name === link.fromPort);
    const input = target.inputs.find(port => port.name === link.toPort);
    if (!output) failures.push(`OUTPUT_PORT_NOT_FOUND:${link.fromPrimitiveId}.${link.fromPort}`);
    if (!input) failures.push(`INPUT_PORT_NOT_FOUND:${link.toPrimitiveId}.${link.toPort}`);
    if (output && input && (output.dataType !== input.dataType || link.dataType !== output.dataType)) {
      failures.push(`TYPE_MISMATCH:${link.fromPrimitiveId}.${link.fromPort}->${link.toPrimitiveId}.${link.toPort}`);
    }
  }

  return { acceptedForSandbox: failures.length === 0, failures: Object.freeze(failures) };
}

export type InventionEvaluation = {
  candidateId: string;
  feasibility: number;
  usefulness: number;
  novelty: number;
  robustness: number;
  architecturalRelevance: number;
  evidenceCoverage: number;
};

export function inventionArchiveCell(evaluation: InventionEvaluation): string {
  const bin = (value: number) => Math.max(0, Math.min(4, Math.floor(value * 5)));
  return [
    `novelty:${bin(evaluation.novelty)}`,
    `utility:${bin(evaluation.usefulness)}`,
    `architecture:${bin(evaluation.architecturalRelevance)}`,
  ].join("|");
}
