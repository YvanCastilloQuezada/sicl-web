export const DELTA_62_FORMAT_VERSION = "DELTA-6.2-FEDERATED-KNOWLEDGE-1.0" as const;
export const DELTA_62_PRODUCTS = ["SHARED", "ARKI", "LUCA"] as const;
export type Delta62Product = (typeof DELTA_62_PRODUCTS)[number];
export type Delta62State = "CANDIDATE" | "STAGED" | "VALIDATED" | "CANONICAL" | "REJECTED" | "FROZEN";
export type Delta62KnowledgeRecord = {
  recordId: string;
  formatVersion: typeof DELTA_62_FORMAT_VERSION;
  product: Delta62Product;
  domain: string;
  title: string;
  statement: string;
  recordType: "FACT" | "METHOD" | "RULE" | "CASE" | "UNKNOWN" | "DECISION" | "SOURCE" | "CAPABILITY";
  state: Delta62State;
  provenance: string[];
  sourceCommit: string;
  sourceFile: string;
  dependencies: string[];
  confidence: "DECLARED" | "EVIDENCED" | "REVIEWED";
  humanReviewRequired: true;
};

export const DELTA_62_SHARED_FIELDS = ["recordId", "formatVersion", "product", "domain", "title", "statement", "recordType", "state", "provenance", "sourceCommit", "sourceFile", "dependencies", "confidence", "humanReviewRequired"] as const;

export function validateDelta62Record(record: Delta62KnowledgeRecord): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (record.formatVersion !== DELTA_62_FORMAT_VERSION) errors.push("FORMAT_VERSION_MISMATCH");
  if (!record.recordId || !record.title || !record.statement) errors.push("REQUIRED_TEXT_MISSING");
  if (!DELTA_62_PRODUCTS.includes(record.product)) errors.push("PRODUCT_PARTITION_INVALID");
  if (!record.sourceCommit || !record.sourceFile) errors.push("PROVENANCE_MISSING");
  if (record.humanReviewRequired !== true) errors.push("HUMAN_REVIEW_GATE_REQUIRED");
  return { valid: errors.length === 0, errors };
}

export function partitionDelta62Records(records: readonly Delta62KnowledgeRecord[]) {
  return {
    shared: records.filter((record) => record.product === "SHARED"),
    arki: records.filter((record) => record.product === "ARKI"),
    luca: records.filter((record) => record.product === "LUCA"),
    rejected: records.filter((record) => record.state === "REJECTED"),
    frozen: records.filter((record) => record.state === "FROZEN"),
  } as const;
}

export function makeDelta62LucaSeed(sourceCommit: string): Delta62KnowledgeRecord[] {
  const sourceFile = "docs/LUCA_FINAL_CONSOLIDATED_OPERATING_MANUAL.md";
  return [
    ["LUCA-GEO-001", "Georreferenciación contextual", "LUCA propone y valida puntos georreferenciados con provenance y revisión.", "METHOD", "GEOSPATIAL"],
    ["LUCA-VISION-001", "Visión artificial y OCR", "LUCA captura contexto visual y separa observación de interpretación.", "CAPABILITY", "COMPUTER_VISION"],
    ["LUCA-MARKETING-001", "Publicidad espacial", "La publicidad AR se prepara como candidato y requiere moderación antes de publicación.", "RULE", "MARKETING"],
    ["LUCA-DEVICE-001", "Interoperabilidad de dispositivos", "El teléfono puede actuar como control, teclado, trackpad, cámara o visor según capacidades y permisos.", "CAPABILITY", "DEVICE_INTEROP"],
    ["LUCA-GOV-001", "No mutación autónoma del Core", "La autonomía genera staging, evidencia y propuestas; no aprueba ni publica por sí sola.", "RULE", "GOVERNANCE"],
  ].map(([recordId, title, statement, recordType, domain]) => ({ recordId, formatVersion: DELTA_62_FORMAT_VERSION, product: "LUCA", domain, title, statement, recordType: recordType as Delta62KnowledgeRecord["recordType"], state: "STAGED", provenance: ["ARKI_DELTA_6.2_CONTRACT", "LUCA_REVIEWED_DOMAIN"], sourceCommit, sourceFile, dependencies: ["AR-LU-ORCHESTRATOR-1.0"], confidence: "DECLARED", humanReviewRequired: true }));
}


export type Delta62PromotionProposal = {
  schema: "ARKI-DELTA62-PROMOTION-PROPOSAL-1.0";
  proposalId: string;
  recordId: string;
  target: "CORE" | "D2" | "AGK";
  evidence: string[];
  requestedBy: string;
  canonicalMutation: false;
  status: "PROPOSED";
};

export function proposeDelta62Promotion(input: {
  proposalId: string;
  record: Delta62KnowledgeRecord;
  target: Delta62PromotionProposal["target"];
  evidence: string[];
  requestedBy: string;
}): Delta62PromotionProposal {
  const validation = validateDelta62Record(input.record);
  if (!validation.valid) throw new Error(`DELTA62_INVALID_RECORD:${validation.errors.join(",")}`);
  if (!input.proposalId.trim() || !input.requestedBy.trim()) throw new Error("DELTA62_PROMOTION_IDENTITY_REQUIRED");
  if (!input.evidence.length) throw new Error("DELTA62_PROMOTION_EVIDENCE_REQUIRED");
  if (!["VALIDATED", "CANONICAL"].includes(input.record.state)) throw new Error("DELTA62_RECORD_NOT_PROMOTABLE");
  return {
    schema: "ARKI-DELTA62-PROMOTION-PROPOSAL-1.0",
    proposalId: input.proposalId,
    recordId: input.record.recordId,
    target: input.target,
    evidence: [...input.evidence],
    requestedBy: input.requestedBy,
    canonicalMutation: false,
    status: "PROPOSED",
  };
}

export const DELTA_62_AUTHORITY_BOUNDARY = Object.freeze({
  role: "KNOWLEDGE_GATEWAY",
  directCoreMutation: false,
  directD2Mutation: false,
  directAgkMutation: false,
  promotionMode: "PROPOSAL_ONLY",
  rule: "Delta 6.2 may stage validated knowledge and promotion proposals; canonical mutation must occur through the target authority's governed commit path.",
} as const);
