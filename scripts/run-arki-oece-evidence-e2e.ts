import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { ingestOeceEvidenceEnvelope, oecePackageToBaseline0 } from "../server/arkiOeceEvidence";

const inputPath = process.env.ARKI_OECE_EVIDENCE_JSON;
if (!inputPath?.trim()) {
  throw new Error("INPUT_NOT_AVAILABLE: set ARKI_OECE_EVIDENCE_JSON to the ACS evidence-envelope JSON");
}

const raw = await readFile(inputPath, "utf8");
const inputSha256 = createHash("sha256").update(raw).digest("hex");
const expectedInputSha256 = process.env.ARKI_OECE_EVIDENCE_SHA256?.trim().toLowerCase();
if (expectedInputSha256 && inputSha256 !== expectedInputSha256) {
  throw new Error(`OECE_ARKI_HANDOFF_SHA256_MISMATCH:expected=${expectedInputSha256}:actual=${inputSha256}`);
}
const envelope = JSON.parse(raw) as unknown;
const pkg = ingestOeceEvidenceEnvelope(envelope);
const baseline = oecePackageToBaseline0(pkg);

if (pkg.schema !== "ARKI-OECE-EVIDENCE-PACKAGE-1.0") {
  throw new Error("OECE_ARKI_SCHEMA_MISMATCH");
}
if (!pkg.immutable || pkg.canonicalMutation !== false) {
  throw new Error("OECE_ARKI_EVIDENCE_BOUNDARY_VIOLATION");
}
if (!baseline.immutable) {
  throw new Error("OECE_ARKI_BASELINE_NOT_IMMUTABLE");
}
if (baseline.projectId !== pkg.projectId) {
  throw new Error("OECE_ARKI_PROJECT_IDENTITY_MISMATCH");
}
if (baseline.claims.length === 0 || baseline.sourceArtifacts.length === 0) {
  throw new Error("OECE_ARKI_BASELINE_EMPTY");
}
const verifiedDocuments = pkg.documents.filter(document => document.acquisitionStatus === "VERIFIED").length;
const procurementClaims = baseline.claims.filter(claim =>
  claim.sourceId.startsWith("OECE-RECORD:")
);
const documentClaims = baseline.claims.filter(claim =>
  claim.sourceId.startsWith("OECE-DOCUMENT:")
);
if (procurementClaims.some(claim => claim.evidenceState !== "PARTIAL")) {
  throw new Error("OECE_ARKI_PROCUREMENT_OVERCLAIM");
}
if (documentClaims.some(claim => claim.evidenceState !== "VERIFIED")) {
  throw new Error("OECE_ARKI_DOCUMENT_EVIDENCE_UNDERRATED");
}
if (documentClaims.length !== verifiedDocuments) {
  throw new Error("OECE_ARKI_VERIFIED_DOCUMENT_CLAIM_COUNT_MISMATCH");
}

const datasetCounts = Object.fromEntries(
  [...new Set(pkg.records.map(record => record.dataset))]
    .sort()
    .map(dataset => [dataset, pkg.records.filter(record => record.dataset === dataset).length]),
);
const documentStatusCounts = Object.fromEntries(
  [...new Set(pkg.documents.map(document => document.acquisitionStatus))]
    .sort()
    .map(status => [status, pkg.documents.filter(document => document.acquisitionStatus === status).length]),
);
const duplicateDocumentContent = Object.entries(
  pkg.documents
    .filter(document => document.checksum)
    .reduce<Record<string, string[]>>((groups, document) => {
      (groups[document.checksum!] ??= []).push(document.documentId);
      return groups;
    }, {}),
)
  .filter(([, documentIds]) => documentIds.length > 1)
  .map(([checksum, documentIds]) => ({ checksum, documentIds }));
const allExpectedSurfacesPresent = Boolean(pkg.expectedSurfaces?.length)
  && pkg.expectedSurfaces.every(surface => !pkg.missingSurfaces.includes(surface));

if (verifiedDocuments === 0 && pkg.technicalDossierClaim !== "NOT_DEMONSTRATED") {
  throw new Error("OECE_ARKI_TECHNICAL_DOSSIER_OVERCLAIM");
}
if (allExpectedSurfacesPresent && verifiedDocuments < pkg.documents.length && pkg.completeness === "SOURCE_PACKAGE_VERIFIED") {
  throw new Error("OECE_ARKI_SOURCE_PACKAGE_OVERCLAIM");
}
const verifiedTechnicalDocuments = pkg.documents.filter(document =>
  document.acquisitionStatus === "VERIFIED"
  && ["EXPEDIENTE_TECNICO", "BUDGET", "SPECIFICATION"].includes(document.kind)
).length;
if (verifiedTechnicalDocuments === 0 && pkg.technicalDossierClaim !== "NOT_DEMONSTRATED") {
  throw new Error("OECE_ARKI_TECHNICAL_DOSSIER_NONTECHNICAL_OVERCLAIM");
}

console.log(JSON.stringify({
  gate: "OECE_ACS_TO_ARKI_BASELINE0",
  status: "PASS",
  inputPath,
  inputSha256,
  physicalHandoffVerified: Boolean(expectedInputSha256),
  packageId: pkg.packageId,
  packageFingerprint: pkg.fingerprint,
  packageCompleteness: pkg.completeness,
  technicalDossierClaim: pkg.technicalDossierClaim,
  expectedSurfaces: pkg.expectedSurfaces ?? [],
  missingSurfaces: pkg.missingSurfaces,
  allExpectedSurfacesPresent,
  datasetCounts,
  documents: pkg.documents.length,
  documentStatusCounts,
  verifiedDocuments,
  verifiedTechnicalDocuments,
  duplicateDocumentContent,
  canonicalMutation: pkg.canonicalMutation,
  baselineId: baseline.baselineId,
  baselineFingerprint: baseline.fingerprint,
  sourceArtifacts: baseline.sourceArtifacts.length,
  claims: baseline.claims.length,
  procurementClaims: procurementClaims.length,
  verifiedDocumentClaims: documentClaims.length,
  immutable: baseline.immutable,
}, null, 2));
