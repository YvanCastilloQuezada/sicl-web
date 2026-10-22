import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { createOeceEvidencePackage, oecePackageToBaseline0 } from "./arkiOeceEvidence";
import { attachOeceEmbeddedTechnicalFragment, ingestOeceEmbeddedTechnicalFragment } from "./arkiOeceEmbeddedTechnicalFragment";

const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const sourceSha = "b1e1ef36ae4e62f230f9eed70ccbdc6ab946c690f83186b4fcd3e23208d7c7fc";
const ocrSha = "a703304253dcd454e1271bca69de05d30a7caf595e2098b85094dcc60f718b87";
const sourcePath = "C:\\acs-v1\\test-artifacts\\oece-documents\\ocds-dgv273-seacev3-1237735\\tender_24831474986086892.pdf";
const fragmentPayload = {
  Schema: "ACS-OECE-EMBEDDED-TECHNICAL-FRAGMENT-1.0",
  SourcePath: sourcePath,
  SourceSha256: sourceSha,
  EvidenceArtifactSha256: ocrSha,
  StartPage: 12,
  StartBoundary: "3.4 TERMINOS DE REFERENCIA",
  EndPage: 14,
  EndBoundary: "IMMEDIATELY_BEFORE_7_FORMA_DE_PAGO",
  DemonstratedContent: ["Terms of reference and bounded technical activities"],
  ReferencedButNotPossessed: ["Approved technical dossier", "Plans"],
  UnverifiedFields: ["Exact quantities", "Exact prices"],
  WholeDocumentPromotion: false,
  TechnicalCoreSetVerified: false,
  CanonicalMutation: false,
} as const;

function specimen() {
  const pkg = createOeceEvidencePackage({
    packageId: "OECE-YANAHUARA", projectId: "P1", ocid: "ocds-dgv273-seacev3-1237735",
    records: [{ recordId: "PROC", dataset: "PROCEDURE", sourceRef: "OECE:PROC", sourceChecksum: "p", observedAt: "2026-10-07", fields: { title: "Yanahuara" } }],
    documents: [{
      documentId: "tender:24831474986086892", title: "Bases Administrativas", kind: "OTHER",
      sourceRef: "OECE:BASES", acquisitionStatus: "VERIFIED",
      checksum: sourceSha, mediaType: "application/pdf", localEvidenceRef: sourcePath,
    }],
    expectedSurfaces: ["PROCEDURE", "DOCUMENT"], missingSurfaces: [],
  });
  const baseline = oecePackageToBaseline0(pkg);
  const fragment = ingestOeceEmbeddedTechnicalFragment({ ...fragmentPayload, Fingerprint: hash(fragmentPayload) });
  return { pkg, baseline, fragment };
}

describe("OECE embedded technical fragment authority boundary", () => {
  it("keeps OCR-derived technical evidence PARTIAL and noncanonical", () => {
    const { pkg, baseline, fragment } = specimen();
    const enriched = attachOeceEmbeddedTechnicalFragment({
      pkg, baseline, fragment, artifactSha256: "a".repeat(64),
      ocrArtifactSha256: ocrSha, ocrEvidencePath: "ACS:OCR-EVIDENCE",
    });
    expect(enriched.immutable).toBe(true);
    expect(enriched.claims.length).toBe(baseline.claims.length + 1);
    expect(enriched.sourceArtifacts.length).toBe(baseline.sourceArtifacts.length + 1);
    const claim = enriched.claims.at(-1)!;
    expect(claim.evidenceState).toBe("PARTIAL");
    expect(claim.value).toMatchObject({ technicalCoreSetVerified: false, canonicalMutation: false });
    expect(claim.provenance).toContain(sourceSha);
    expect(claim.provenance).toContain(ocrSha);
    expect(claim.provenance).toContain(fragment.Fingerprint);
    expect(pkg.technicalDossierClaim).toBe("NOT_DEMONSTRATED");
    expect(baseline.claims.length).toBe(2);
  });

  it("rejects forged fragment fingerprint, extra authority claims and missing verified source", () => {
    expect(() => ingestOeceEmbeddedTechnicalFragment({
      ...fragmentPayload, Fingerprint: "0".repeat(64),
    })).toThrow("OECE_FRAGMENT_FINGERPRINT_MISMATCH");
    expect(() => ingestOeceEmbeddedTechnicalFragment({
      ...fragmentPayload, Fingerprint: hash(fragmentPayload), CanonicalMutation: true,
    })).toThrow("OECE_FRAGMENT_INVALID");
    const { pkg, baseline, fragment } = specimen();
    expect(() => attachOeceEmbeddedTechnicalFragment({
      pkg, baseline, fragment: { ...fragment, SourceSha256: "b".repeat(64) },
      artifactSha256: "a".repeat(64), ocrArtifactSha256: ocrSha, ocrEvidencePath: "ACS:OCR-EVIDENCE",
    })).toThrow("OECE_FRAGMENT_FINGERPRINT_MISMATCH");
    expect(() => attachOeceEmbeddedTechnicalFragment({
      pkg, baseline, fragment, artifactSha256: "a".repeat(64),
      ocrArtifactSha256: "b".repeat(64), ocrEvidencePath: "ACS:OCR-EVIDENCE",
    })).toThrow("OECE_FRAGMENT_OCR_SHA256_MISMATCH");
  });
});
