import { describe, expect, it } from "vitest";
import { createOeceEvidencePackage, ingestOeceEvidenceEnvelope, OECE_ARKI_BOUNDARY, oecePackageToBaseline0 } from "./arkiOeceEvidence";

describe("OECE/ACS evidence boundary", () => {
  it("fails closed on malformed or extra-field ACS runtime envelopes", () => {
    expect(() => ingestOeceEvidenceEnvelope({ packageId: "P", projectId: "P1", procedureId: "X", records: [], documents: [], missingSurfaces: [], injectedCanonicalTruth: true })).toThrow("OECE_ENVELOPE_INVALID");
    expect(() => ingestOeceEvidenceEnvelope({ packageId: "P", projectId: "P1", records: [], documents: [], missingSurfaces: [] })).toThrow("OECE_ENVELOPE_INVALID");
  });

  it("packages procurement records as immutable upstream evidence, never canonical ARKI truth", () => {
    const pkg = createOeceEvidencePackage({
      packageId: "OECE-P1", projectId: "P1", ocid: "OCID-1",
      records: [{
        recordId: "PROC-1", dataset: "PROCEDURE", sourceRef: "OECE:release:1", sourceChecksum: "sha256:proc",
        observedAt: "2026-10-07", fields: { title: "Hospital", amount: 1000000 },
      }],
      documents: [], missingSurfaces: ["AWARD", "CONTRACT", "DOCUMENT"],
    });
    expect(pkg.immutable).toBe(true);
    expect(pkg.canonicalMutation).toBe(false);
    expect(pkg.completeness).toBe("PARTIAL_EVIDENCE");
    expect(pkg.technicalDossierClaim).toBe("NOT_DEMONSTRATED");
    expect(OECE_ARKI_BOUNDARY.directF8Publication).toBe(false);
  });

  it("cannot claim source-package completeness by omitting expected missing surfaces", () => {
    expect(() => createOeceEvidencePackage({
      packageId: "OECE-M", projectId: "P1", procedureId: "PROC-M",
      records: [{ recordId: "P", dataset: "PROCEDURE", sourceRef: "S:P", sourceChecksum: "p", observedAt: "2026-10-07", fields: {} }],
      documents: [], expectedSurfaces: ["PROCEDURE", "AWARD", "CONTRACT"], missingSurfaces: [],
    })).toThrow("OECE_MISSING_SURFACES_UNDERREPORTED");
  });

  it("requires checksum plus local evidence reference before a document is VERIFIED", () => {
    expect(() => createOeceEvidencePackage({
      packageId: "OECE-P2", projectId: "P1", procedureId: "PROC-2", records: [],
      documents: [{ documentId: "D1", title: "Budget", kind: "BUDGET", sourceRef: "OECE:D1", acquisitionStatus: "VERIFIED" }],
      missingSurfaces: [],
    })).toThrow("OECE_VERIFIED_DOCUMENT_EVIDENCE_REQUIRED:D1");
  });

  it("creates BASELINE_0 with procurement facts kept PARTIAL and verified document lineage preserved", () => {
    const pkg = createOeceEvidencePackage({
      packageId: "OECE-P3", projectId: "P1", ocid: "OCID-3",
      records: [{
        recordId: "PROC-3", dataset: "PROCEDURE", sourceRef: "OECE:PROC-3", sourceChecksum: "sha256:p3",
        observedAt: "2026-10-07", fields: { title: "Public project" },
      }],
      documents: [{
        documentId: "D3", title: "Technical dossier", kind: "EXPEDIENTE_TECNICO", sourceRef: "OECE:D3",
        acquisitionStatus: "VERIFIED", checksum: "sha256:d3", mediaType: "application/pdf", localEvidenceRef: "ACS:D3",
      }],
      missingSurfaces: ["AWARD", "CONTRACT"],
    });
    const baseline = oecePackageToBaseline0(pkg);
    expect(baseline.immutable).toBe(true);
    expect(baseline.claims.find(c => c.claimId.includes("PROC-3"))?.evidenceState).toBe("PARTIAL");
    expect(baseline.claims.find(c => c.claimId.includes("DOCUMENT:D3"))?.evidenceState).toBe("VERIFIED");
    expect(baseline.claims.find(c => c.claimId.includes("DOCUMENT:D3"))?.provenance).toContain("sha256:d3");
  });

  it("does not call nontechnical verified documents partial technical-dossier evidence", () => {
    const pkg = createOeceEvidencePackage({
      packageId: "OECE-NONTECH", projectId: "P1", ocid: "OCID-NONTECH",
      records: [{ recordId: "P", dataset: "PROCEDURE", sourceRef: "S:P", sourceChecksum: "p", observedAt: "2026-10-07", fields: {} }],
      documents: [
        { documentId: "C", title: "Signed contract", kind: "CONTRACT", sourceRef: "S:C", acquisitionStatus: "VERIFIED", checksum: "c", localEvidenceRef: "L:C" },
        { documentId: "O", title: "Administrative bases", kind: "OTHER", sourceRef: "S:O", acquisitionStatus: "VERIFIED", checksum: "o", localEvidenceRef: "L:O" },
      ],
      expectedSurfaces: ["PROCEDURE", "DOCUMENT"], missingSurfaces: [],
    });
    expect(pkg.completeness).toBe("SOURCE_PACKAGE_VERIFIED");
    expect(pkg.technicalDossierClaim).toBe("NOT_DEMONSTRATED");
  });

  it("does not call a package verified while any discovered document remains unverified", () => {
    const pkg = createOeceEvidencePackage({
      packageId: "OECE-MIXED", projectId: "P1", ocid: "OCID-MIXED",
      records: [{ recordId: "P", dataset: "PROCEDURE", sourceRef: "S:P", sourceChecksum: "p", observedAt: "2026-10-07", fields: {} }],
      documents: [
        { documentId: "V", title: "Verified", kind: "CONTRACT", sourceRef: "S:V", acquisitionStatus: "VERIFIED", checksum: "v", localEvidenceRef: "L:V" },
        { documentId: "D", title: "Discovered", kind: "OTHER", sourceRef: "S:D", acquisitionStatus: "DISCOVERED" },
      ],
      expectedSurfaces: ["PROCEDURE", "DOCUMENT"], missingSurfaces: [],
    });
    expect(pkg.completeness).toBe("PARTIAL_EVIDENCE");
    expect(pkg.technicalDossierClaim).toBe("NOT_DEMONSTRATED");
  });

  it("does not call a partial document download a complete technical dossier", () => {
    const pkg = createOeceEvidencePackage({
      packageId: "OECE-P4", projectId: "P1", procedureId: "PROC-4", records: [],
      documents: [
        { documentId: "E", title: "Expediente", kind: "EXPEDIENTE_TECNICO", sourceRef: "S:E", acquisitionStatus: "VERIFIED", checksum: "e", localEvidenceRef: "L:E" },
        { documentId: "B", title: "Budget", kind: "BUDGET", sourceRef: "S:B", acquisitionStatus: "VERIFIED", checksum: "b", localEvidenceRef: "L:B" },
      ],
      missingSurfaces: [],
    });
    expect(pkg.technicalDossierClaim).toBe("PARTIAL");
  });
});
