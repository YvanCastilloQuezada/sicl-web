/**
 * ARKI Developer Proposal contract.
 *
 * Propuesta arquitectónica pre-D-2, producida por el Architectural Developer
 * a partir de una hipótesis seleccionada (típicamente un D63Result ya
 * seleccionado vía Funnel). NO es estado canónico. NO es D-2. NO promueve.
 *
 * Prefijo Developer* para evitar colisión con conceptos existentes
 * (ArkiChangeProposal, DesignCandidate, Unknown, Mutation, etc.).
 *
 * Core valida y promueve en Commit 8. Este contrato sólo fija la forma.
 */

export type DeveloperEpistemicStatus = "HYPOTHESIS" | "PROPOSAL";

export interface DeveloperProvenanceRef {
  source: string;
  ref: string;
  fingerprint?: string;
}

export interface DeveloperUnknown {
  field: string;
  reason: string;
  requiredEvidence: string;
}

export interface DeveloperHumanAction {
  action: string;
  reason: string;
}

export interface DeveloperMutation {
  kind: string;
  targetProvisionalId: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
}

export interface DeveloperFeedbackLoop {
  from: string;
  to: string;
  reason: string;
}

export type DeveloperPropertyValue = string | number | boolean | null;
export type DeveloperProperties = Record<string, DeveloperPropertyValue>;

export interface ProposedArchiElementDTO {
  provisionalId: string;
  /** Mapeo posterior a ElementKind de Core decidido en Commit 8. No enum falso aquí. */
  kind: string;
  geometry: Record<string, unknown> | null;
  properties: DeveloperProperties;
  provenance: DeveloperProvenanceRef[];
  epistemicStatus: "FACT" | "ASSUMPTION" | "HYPOTHESIS" | "UNKNOWN";
}

export interface ProposedArchiRelationDTO {
  fromProvisionalId: string;
  toProvisionalId: string;
  /** Mapeo posterior a RelationshipKind de Core decidido en Commit 8. No enum falso aquí. */
  relationKind: string;
  provenance: DeveloperProvenanceRef[];
}

export interface ProposedDerivationDTO {
  outputProvisionalId: string;
  inputsProvisionalIds: string[];
  method: string;
  methodVersion: string;
  assumptions: string[];
}

export interface DeveloperProposal {
  proposalId: string;
  parentProposalId: string | null;
  sourceExecutionId: string;
  /** Identidad/referencia del D63Result fuente. No copia el resultado entero. */
  sourceD63: string;
  fingerprint: string;
  epistemicStatus: DeveloperEpistemicStatus;
  proposedElements: ProposedArchiElementDTO[];
  proposedRelations: ProposedArchiRelationDTO[];
  proposedDerivations: ProposedDerivationDTO[];
  unresolvedUnknowns: DeveloperUnknown[];
  requiredHumanActions: DeveloperHumanAction[];
  provenance: DeveloperProvenanceRef[];
  reviewRequired: true;
  mutation: DeveloperMutation | null;
  rejectedBecause: string | null;
  feedbackLoops: DeveloperFeedbackLoop[];
}

export interface DeveloperProposalValidation {
  valid: boolean;
  errors: string[];
}


const SHA256_HEX = /^[0-9a-f]{64}$/;

type PropertyReasonCode =
  | "PROPERTY_NOT_OBJECT"
  | "PROPERTY_INVALID_PROTOTYPE"
  | "PROPERTY_INTROSPECTION_FAILED"
  | "PROPERTY_DESCRIPTOR_UNREADABLE"
  | "PROPERTY_SYMBOL_KEY"
  | "PROPERTY_NON_ENUMERABLE"
  | "PROPERTY_ACCESSOR_NOT_ALLOWED"
  | "PROPERTY_INVALID_KEY"
  | "PROPERTY_FORBIDDEN_PROTO_KEY"
  | "PROPERTY_RESERVED_KEY"
  | "PROPERTY_UNSUPPORTED_VALUE"
  | "PROPERTY_NON_FINITE_NUMBER";

function propertyError(provisionalId: string, key: PropertyKey | null, code: PropertyReasonCode): string {
  const prefix = `proposedElements[${provisionalId}].properties`;
  return key === null ? `${prefix}: ${code}` : `${prefix}[${String(key)}]: ${code}`;
}

function validateProperties(provisionalId: string, raw: unknown): string[] {
  const errors: string[] = [];
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    return [propertyError(provisionalId, null, "PROPERTY_NOT_OBJECT")];
  }

  let prototype: object | null;
  try {
    prototype = Object.getPrototypeOf(raw);
  } catch {
    return [propertyError(provisionalId, null, "PROPERTY_INTROSPECTION_FAILED")];
  }
  if (prototype !== Object.prototype && prototype !== null) {
    return [propertyError(provisionalId, null, "PROPERTY_INVALID_PROTOTYPE")];
  }

  let keys: PropertyKey[];
  try {
    keys = Reflect.ownKeys(raw);
  } catch {
    return [propertyError(provisionalId, null, "PROPERTY_INTROSPECTION_FAILED")];
  }

  for (const key of keys) {
    let descriptor: PropertyDescriptor | undefined;
    try {
      descriptor = Object.getOwnPropertyDescriptor(raw, key);
    } catch {
      errors.push(propertyError(provisionalId, key, "PROPERTY_DESCRIPTOR_UNREADABLE"));
      continue;
    }
    if (!descriptor) {
      errors.push(propertyError(provisionalId, key, "PROPERTY_DESCRIPTOR_UNREADABLE"));
      continue;
    }

    // V1.3 O-4: one deterministic error at most per key.
    if (!("value" in descriptor)) {
      errors.push(propertyError(provisionalId, key, "PROPERTY_ACCESSOR_NOT_ALLOWED"));
      continue;
    }
    if (!descriptor.enumerable) {
      errors.push(propertyError(provisionalId, key, "PROPERTY_NON_ENUMERABLE"));
      continue;
    }
    if (typeof key !== "string") {
      errors.push(propertyError(provisionalId, key, "PROPERTY_SYMBOL_KEY"));
      continue;
    }
    if (key.length === 0 || key.trim().length === 0) {
      errors.push(propertyError(provisionalId, key, "PROPERTY_INVALID_KEY"));
      continue;
    }
    if (key === "__proto__") {
      errors.push(propertyError(provisionalId, key, "PROPERTY_FORBIDDEN_PROTO_KEY"));
      continue;
    }
    if (key === "canonical") {
      errors.push(propertyError(provisionalId, key, "PROPERTY_RESERVED_KEY"));
      continue;
    }

    const value = descriptor.value;
    if (typeof value === "number" && !Number.isFinite(value)) {
      errors.push(propertyError(provisionalId, key, "PROPERTY_NON_FINITE_NUMBER"));
      continue;
    }
    if (
      value !== null &&
      typeof value !== "string" &&
      typeof value !== "number" &&
      typeof value !== "boolean"
    ) {
      errors.push(propertyError(provisionalId, key, "PROPERTY_UNSUPPORTED_VALUE"));
    }
  }
  return errors;
}

export function validateDeveloperProposal(
  proposal: DeveloperProposal
): DeveloperProposalValidation {
  const errors: string[] = [];

  if (!proposal.proposalId || proposal.proposalId.trim() === "") {
    errors.push("proposalId must be non-empty");
  }
  if (
    proposal.parentProposalId !== null &&
    proposal.parentProposalId === proposal.proposalId
  ) {
    errors.push("parentProposalId must differ from proposalId");
  }
  if (!proposal.sourceExecutionId || proposal.sourceExecutionId.trim() === "") {
    errors.push("sourceExecutionId must be non-empty");
  }
  if (!proposal.sourceD63 || proposal.sourceD63.trim() === "") {
    errors.push("sourceD63 must be non-empty");
  }
  if (!SHA256_HEX.test(proposal.fingerprint)) {
    errors.push("fingerprint must be lowercase sha256 hex (64 chars)");
  }
  if (
    proposal.epistemicStatus !== "HYPOTHESIS" &&
    proposal.epistemicStatus !== "PROPOSAL"
  ) {
    errors.push("epistemicStatus must be HYPOTHESIS or PROPOSAL");
  }
  if (proposal.reviewRequired !== true) {
    errors.push("reviewRequired must be true");
  }

  const elementIds = new Set<string>();
  for (const el of proposal.proposedElements) {
    if (!el.provisionalId || el.provisionalId.trim() === "") {
      errors.push("proposedElements: provisionalId must be non-empty");
      continue;
    }
    if (elementIds.has(el.provisionalId)) {
      errors.push(`proposedElements: duplicate provisionalId ${el.provisionalId}`);
    }
    elementIds.add(el.provisionalId);
    if (el.epistemicStatus === "UNKNOWN") {
      errors.push(
        `proposedElements[${el.provisionalId}]: UNKNOWN element must be expressed via unresolvedUnknowns, not as element with epistemicStatus=UNKNOWN`
      );
    }
    errors.push(...validateProperties(el.provisionalId, el.properties as unknown));
  }

  for (const rel of proposal.proposedRelations) {
    if (!elementIds.has(rel.fromProvisionalId)) {
      errors.push(
        `proposedRelations: fromProvisionalId ${rel.fromProvisionalId} not declared`
      );
    }
    if (!elementIds.has(rel.toProvisionalId)) {
      errors.push(
        `proposedRelations: toProvisionalId ${rel.toProvisionalId} not declared`
      );
    }
  }

  for (const der of proposal.proposedDerivations) {
    if (!elementIds.has(der.outputProvisionalId)) {
      errors.push(
        `proposedDerivations: outputProvisionalId ${der.outputProvisionalId} not declared`
      );
    }
    for (const inp of der.inputsProvisionalIds) {
      if (!elementIds.has(inp)) {
        errors.push(
          `proposedDerivations: inputProvisionalId ${inp} not declared`
        );
      }
    }
  }

  for (const unk of proposal.unresolvedUnknowns) {
    if (!unk.field || unk.field.trim() === "") {
      errors.push("unresolvedUnknowns: field must be non-empty");
    }
  }

  for (const prov of proposal.provenance) {
    if (!prov.source || prov.source.trim() === "") {
      errors.push("provenance: source must be non-empty");
    }
    if (!prov.ref || prov.ref.trim() === "") {
      errors.push("provenance: ref must be non-empty");
    }
    if (prov.fingerprint !== undefined && !SHA256_HEX.test(prov.fingerprint)) {
      errors.push("provenance: fingerprint must be lowercase sha256 hex");
    }
  }

  return { valid: errors.length === 0, errors };
}
