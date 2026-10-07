import { createHash } from "node:crypto";
import { z } from "zod";
import { createBaseline0, type Baseline0, type SourceClaim } from "./arkiProfessionalState";
import type { OeceEvidencePackage } from "./arkiOeceEvidence";

const sha256 = z.string().regex(/^[a-f0-9]{64}$/);
const fragmentInput = z.object({
  Schema: z.literal("ACS-OECE-EMBEDDED-TECHNICAL-FRAGMENT-1.0"),
  SourcePath: z.string().min(1),
  SourceSha256: sha256,
  EvidenceArtifactSha256: sha256,
  StartPage: z.number().int().positive(),
  StartBoundary: z.string().min(1),
  EndPage: z.number().int().positive(),
  EndBoundary: z.string().min(1),
  DemonstratedContent: z.array(z.string().min(1)).min(1),
  ReferencedButNotPossessed: z.array(z.string().min(1)),
  UnverifiedFields: z.array(z.string().min(1)),
  WholeDocumentPromotion: z.literal(false),
  TechnicalCoreSetVerified: z.literal(false),
  CanonicalMutation: z.literal(false),
  Fingerprint: sha256,
}).strict().refine(value => value.EndPage >= value.StartPage, {
  message: "OECE_FRAGMENT_PAGE_RANGE_INVALID",
});

export type OeceEmbeddedTechnicalFragment = z.infer<typeof fragmentInput>;
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

export function ingestOeceEmbeddedTechnicalFragment(value: unknown): OeceEmbeddedTechnicalFragment {
  const parsed = fragmentInput.safeParse(value);
  if (!parsed.success) {
    throw new Error(`OECE_FRAGMENT_INVALID:${parsed.error.issues.map(issue => issue.message).join("|")}`);
  }
  const { Fingerprint, ...payload } = parsed.data;
  if (hash(payload) !== Fingerprint) throw new Error("OECE_FRAGMENT_FINGERPRINT_MISMATCH");
  return parsed.data;
}

export function attachOeceEmbeddedTechnicalFragment(input: {
  pkg: OeceEvidencePackage;
  baseline: Baseline0;
  fragment: OeceEmbeddedTechnicalFragment;
  artifactSha256: string;
  ocrArtifactSha256: string;
  ocrEvidencePath: string;
}): Baseline0 {
  const { pkg, baseline, fragment } = input;
  if (baseline.projectId !== pkg.projectId || baseline.baselineId !== `OECE:${pkg.packageId}`) {
    throw new Error("OECE_FRAGMENT_BASELINE_IDENTITY_MISMATCH");
  }
  if (!sha256.safeParse(input.artifactSha256).success || !sha256.safeParse(input.ocrArtifactSha256).success) {
    throw new Error("OECE_FRAGMENT_ARTIFACT_HASH_INVALID");
  }
  if (input.ocrArtifactSha256 !== fragment.EvidenceArtifactSha256) {
    throw new Error("OECE_FRAGMENT_OCR_SHA256_MISMATCH");
  }
  if (!input.ocrEvidencePath.trim()) throw new Error("OECE_FRAGMENT_OCR_EVIDENCE_PATH_REQUIRED");
  if (pkg.technicalDossierClaim !== "NOT_DEMONSTRATED") {
    throw new Error("OECE_FRAGMENT_TECHNICAL_DOSSIER_OVERCLAIM");
  }

  const source = pkg.documents.find(document =>
    document.acquisitionStatus === "VERIFIED"
    && document.localEvidenceRef === fragment.SourcePath
    && document.checksum?.toLowerCase() === fragment.SourceSha256
  );
  if (!source) throw new Error("OECE_FRAGMENT_VERIFIED_SOURCE_NOT_FOUND");

  const baselineSource = baseline.sourceArtifacts.find(item =>
    item.sourceId === `OECE-DOCUMENT:${source.documentId}`
    && item.checksum.toLowerCase() === fragment.SourceSha256
  );
  if (!baselineSource) throw new Error("OECE_FRAGMENT_BASELINE_SOURCE_MISMATCH");

  const fragmentSourceId = `OECE-DERIVED-FRAGMENT:${fragment.Fingerprint}`;
  const claimId = `OECE:EMBEDDED_TECHNICAL_FRAGMENT:${fragment.Fingerprint}`;
  if (baseline.sourceArtifacts.some(item => item.sourceId === fragmentSourceId)
    || baseline.claims.some(item => item.claimId === claimId)) {
    throw new Error("OECE_FRAGMENT_ALREADY_ATTACHED");
  }
  const claim: SourceClaim = {
    claimId,
    sourceId: fragmentSourceId,
    subjectId: pkg.ocid ?? pkg.procedureId!,
    field: "oece.derived.embedded_technical_fragment",
    value: {
      sourceDocumentId: source.documentId,
      sourceDocumentSha256: fragment.SourceSha256,
      startPage: fragment.StartPage,
      startBoundary: fragment.StartBoundary,
      endPage: fragment.EndPage,
      endBoundary: fragment.EndBoundary,
      demonstratedContent: fragment.DemonstratedContent,
      referencedButNotPossessed: fragment.ReferencedButNotPossessed,
      unverifiedFields: fragment.UnverifiedFields,
      technicalCoreSetVerified: false,
      canonicalMutation: false,
    },
    evidenceState: "PARTIAL",
    provenance: [
      `OECE-DOCUMENT:${source.documentId}`,
      fragment.SourceSha256,
      fragment.EvidenceArtifactSha256,
      fragment.Fingerprint,
      input.artifactSha256,
      input.ocrEvidencePath,
    ],
  };
  return createBaseline0({
    baselineId: `${baseline.baselineId}:WITH-DERIVED-FRAGMENT:${fragment.Fingerprint}`,
    projectId: baseline.projectId,
    sourceArtifacts: [
      ...baseline.sourceArtifacts,
      {
        sourceId: fragmentSourceId,
        checksum: input.artifactSha256,
        format: fragment.Schema,
        receivedAt: "ACS_DERIVED_EVIDENCE",
      },
    ],
    claims: [...baseline.claims, claim],
    contradictions: [...baseline.contradictions],
  });
}
