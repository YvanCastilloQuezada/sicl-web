import { createHash } from "node:crypto";
import { createBaseline0, type Baseline0, type SourceClaim } from "./arkiProfessionalState";

export type OeceDatasetKind =
  | "PROCEDURE"
  | "AWARD"
  | "CONTRACT"
  | "ENTITY"
  | "SUPPLIER"
  | "DOCUMENT"
  | "WORK_LOG"
  | "VALUATION"
  | "OTHER";

export type OeceEvidenceRecord = {
  recordId: string;
  dataset: OeceDatasetKind;
  sourceRef: string;
  sourceChecksum: string;
  observedAt: string;
  fields: Record<string, unknown>;
};

export type OeceDocumentEvidence = {
  documentId: string;
  title: string;
  kind: "BASES" | "TDR" | "EXPEDIENTE_TECNICO" | "CONTRACT" | "DRAWING" | "BUDGET" | "SPECIFICATION" | "OTHER";
  sourceRef: string;
  acquisitionStatus: "DISCOVERED" | "DOWNLOADED" | "VERIFIED" | "FAILED" | "UNAVAILABLE";
  checksum?: string;
  mediaType?: string;
  localEvidenceRef?: string;
};

export type OeceEvidencePackage = {
  schema: "ARKI-OECE-EVIDENCE-PACKAGE-1.0";
  packageId: string;
  projectId: string;
  ocid?: string;
  procedureId?: string;
  records: OeceEvidenceRecord[];
  documents: OeceDocumentEvidence[];
  missingSurfaces: OeceDatasetKind[];
  completeness: "METADATA_ONLY" | "PARTIAL_EVIDENCE" | "SOURCE_PACKAGE_VERIFIED";
  technicalDossierClaim: "NOT_DEMONSTRATED" | "PARTIAL" | "TECHNICAL_CORE_SET_VERIFIED";
  canonicalMutation: false;
  immutable: true;
  fingerprint: string;
};

const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const required = (value: string, code: string) => { if (!value.trim()) throw new Error(code); };

export function createOeceEvidencePackage(input: Omit<OeceEvidencePackage, "schema" | "completeness" | "technicalDossierClaim" | "canonicalMutation" | "immutable" | "fingerprint">): OeceEvidencePackage {
  required(input.packageId, "OECE_PACKAGE_ID_REQUIRED");
  required(input.projectId, "OECE_PROJECT_ID_REQUIRED");
  if (!input.ocid?.trim() && !input.procedureId?.trim()) throw new Error("OECE_PROCEDURE_IDENTITY_REQUIRED");
  const recordIds = new Set<string>();
  for (const record of input.records) {
    required(record.recordId, "OECE_RECORD_ID_REQUIRED");
    required(record.sourceRef, `OECE_RECORD_SOURCE_REQUIRED:${record.recordId}`);
    required(record.sourceChecksum, `OECE_RECORD_CHECKSUM_REQUIRED:${record.recordId}`);
    required(record.observedAt, `OECE_RECORD_OBSERVED_AT_REQUIRED:${record.recordId}`);
    if (recordIds.has(record.recordId)) throw new Error(`OECE_DUPLICATE_RECORD_ID:${record.recordId}`);
    recordIds.add(record.recordId);
  }
  const documentIds = new Set<string>();
  for (const document of input.documents) {
    required(document.documentId, "OECE_DOCUMENT_ID_REQUIRED");
    required(document.sourceRef, `OECE_DOCUMENT_SOURCE_REQUIRED:${document.documentId}`);
    if (documentIds.has(document.documentId)) throw new Error(`OECE_DUPLICATE_DOCUMENT_ID:${document.documentId}`);
    documentIds.add(document.documentId);
    if (document.acquisitionStatus === "VERIFIED" && (!document.checksum?.trim() || !document.localEvidenceRef?.trim())) {
      throw new Error(`OECE_VERIFIED_DOCUMENT_EVIDENCE_REQUIRED:${document.documentId}`);
    }
  }

  const verifiedDocs = input.documents.filter(d => d.acquisitionStatus === "VERIFIED");
  const hasStructuredProcurement = input.records.some(r => ["PROCEDURE", "AWARD", "CONTRACT"].includes(r.dataset));
  const completeness: OeceEvidencePackage["completeness"] =
    verifiedDocs.length && hasStructuredProcurement && input.missingSurfaces.length === 0 ? "SOURCE_PACKAGE_VERIFIED"
      : verifiedDocs.length || hasStructuredProcurement ? "PARTIAL_EVIDENCE"
      : "METADATA_ONLY";

  const technicalKinds = new Set(verifiedDocs.map(d => d.kind));
  const hasTechnicalCore = technicalKinds.has("EXPEDIENTE_TECNICO")
    && technicalKinds.has("BUDGET")
    && technicalKinds.has("SPECIFICATION");
  const technicalDossierClaim: OeceEvidencePackage["technicalDossierClaim"] =
    hasTechnicalCore ? "TECHNICAL_CORE_SET_VERIFIED" : verifiedDocs.length ? "PARTIAL" : "NOT_DEMONSTRATED";

  const payload = {
    ...input,
    schema: "ARKI-OECE-EVIDENCE-PACKAGE-1.0" as const,
    completeness,
    technicalDossierClaim,
    canonicalMutation: false as const,
    immutable: true as const,
  };
  return { ...payload, fingerprint: hash(payload) };
}

export function oecePackageToBaseline0(pkg: OeceEvidencePackage): Baseline0 {
  const sourceArtifacts = [
    ...pkg.records.map(record => ({
      sourceId: `OECE-RECORD:${record.recordId}`,
      checksum: record.sourceChecksum,
      format: `OECE:${record.dataset}`,
      receivedAt: record.observedAt,
    })),
    ...pkg.documents.filter(d => d.acquisitionStatus === "VERIFIED").map(document => ({
      sourceId: `OECE-DOCUMENT:${document.documentId}`,
      checksum: document.checksum!,
      format: document.mediaType ?? document.kind,
      receivedAt: "OECE_PACKAGE",
    })),
  ];
  if (!sourceArtifacts.length) throw new Error("OECE_BASELINE_REQUIRES_EVIDENCE");

  const claims: SourceClaim[] = [];
  for (const record of pkg.records) {
    for (const [field, value] of Object.entries(record.fields)) {
      claims.push({
        claimId: `OECE:${record.recordId}:${field}`,
        sourceId: `OECE-RECORD:${record.recordId}`,
        subjectId: pkg.ocid ?? pkg.procedureId!,
        field: `oece.${record.dataset.toLowerCase()}.${field}`,
        value,
        evidenceState: "PARTIAL",
        provenance: [record.sourceRef, record.sourceChecksum],
      });
    }
  }
  for (const document of pkg.documents.filter(d => d.acquisitionStatus === "VERIFIED")) {
    claims.push({
      claimId: `OECE:DOCUMENT:${document.documentId}`,
      sourceId: `OECE-DOCUMENT:${document.documentId}`,
      subjectId: pkg.ocid ?? pkg.procedureId!,
      field: `oece.document.${document.kind.toLowerCase()}`,
      value: { title: document.title, localEvidenceRef: document.localEvidenceRef },
      evidenceState: "VERIFIED",
      provenance: [document.sourceRef, document.checksum!],
    });
  }
  return createBaseline0({
    baselineId: `OECE:${pkg.packageId}`,
    projectId: pkg.projectId,
    sourceArtifacts,
    claims,
    contradictions: [],
  });
}

export const OECE_ARKI_BOUNDARY = Object.freeze({
  sourceRole: "UPSTREAM_EVIDENCE",
  canonicalProjectTruth: false,
  architecturalSemanticAuthority: false,
  operationalGeometryAuthority: false,
  directF8Publication: false,
  requiredPath: "OECE/ACS → IMMUTABLE_EVIDENCE_PACKAGE → BASELINE_0 → D-2/AGK/F7 → ACCEPTANCE → F8",
} as const);
