import { readFile } from "node:fs/promises";
import { ingestOeceEvidenceEnvelope, oecePackageToBaseline0 } from "../server/arkiOeceEvidence";

const inputPath = process.env.ARKI_OECE_EVIDENCE_JSON;
if (!inputPath?.trim()) {
  throw new Error("INPUT_NOT_AVAILABLE: set ARKI_OECE_EVIDENCE_JSON to the ACS evidence-envelope JSON");
}

const raw = await readFile(inputPath, "utf8");
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
if (baseline.claims.some(claim => claim.evidenceState !== "PARTIAL")) {
  throw new Error("OECE_ARKI_PROCUREMENT_OVERCLAIM");
}

console.log(JSON.stringify({
  gate: "OECE_ACS_TO_ARKI_BASELINE0",
  status: "PASS",
  inputPath,
  packageId: pkg.packageId,
  packageFingerprint: pkg.fingerprint,
  packageCompleteness: pkg.completeness,
  technicalDossierClaim: pkg.technicalDossierClaim,
  canonicalMutation: pkg.canonicalMutation,
  baselineId: baseline.baselineId,
  baselineFingerprint: baseline.fingerprint,
  sourceArtifacts: baseline.sourceArtifacts.length,
  claims: baseline.claims.length,
  immutable: baseline.immutable,
}, null, 2));
