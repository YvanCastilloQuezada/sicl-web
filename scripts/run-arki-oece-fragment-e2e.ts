import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { ingestOeceEvidenceEnvelope, oecePackageToBaseline0 } from "../server/arkiOeceEvidence";
import { attachOeceEmbeddedTechnicalFragment, ingestOeceEmbeddedTechnicalFragment } from "../server/arkiOeceEmbeddedTechnicalFragment";
import { assessF7SourceReadiness } from "../server/arkiProfessionalState";

const hash = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");

async function verifiedJson(pathEnv: string, shaEnv: string): Promise<{ value: unknown; sha256: string; path: string }> {
  const path = process.env[pathEnv]?.trim();
  const expectedSha = process.env[shaEnv]?.trim().toLowerCase();
  if (!path || !expectedSha) throw new Error(`INPUT_NOT_AVAILABLE:${pathEnv}/${shaEnv}`);
  const bytes = await readFile(path);
  const actualSha = hash(bytes);
  if (actualSha !== expectedSha) throw new Error(`OECE_DERIVED_HANDOFF_SHA_MISMATCH:${pathEnv}`);
  return { path, sha256: actualSha, value: JSON.parse(bytes.toString("utf8")) as unknown };
}

const pkgInput = await verifiedJson("ARKI_OECE_EVIDENCE_JSON", "ARKI_OECE_EVIDENCE_SHA256");
const fragmentInput = await verifiedJson("ARKI_OECE_FRAGMENT_JSON", "ARKI_OECE_FRAGMENT_SHA256");
const ocrPath = process.env.ARKI_OECE_OCR_JSON?.trim();
const ocrExpectedSha = process.env.ARKI_OECE_OCR_SHA256?.trim().toLowerCase();
if (!ocrPath || !ocrExpectedSha) throw new Error("INPUT_NOT_AVAILABLE:ARKI_OECE_OCR_JSON/ARKI_OECE_OCR_SHA256");
const ocrActualSha = hash(await readFile(ocrPath));
if (ocrActualSha !== ocrExpectedSha) throw new Error("OECE_DERIVED_OCR_SHA_MISMATCH");

const pkg = ingestOeceEvidenceEnvelope(pkgInput.value);
const baseline = oecePackageToBaseline0(pkg);
const fragment = ingestOeceEmbeddedTechnicalFragment(fragmentInput.value);
const enriched = attachOeceEmbeddedTechnicalFragment({
  pkg, baseline, fragment,
  artifactSha256: fragmentInput.sha256,
  ocrArtifactSha256: ocrActualSha,
  ocrEvidencePath: ocrPath,
});

const derived = enriched.claims.filter(claim => claim.field === "oece.derived.embedded_technical_fragment");
if (derived.length !== 1 || derived[0].evidenceState !== "PARTIAL") {
  throw new Error("OECE_DERIVED_FRAGMENT_EVIDENCE_OVERCLAIM");
}
if (pkg.technicalDossierClaim !== "NOT_DEMONSTRATED" || !enriched.immutable) {
  throw new Error("OECE_DERIVED_FRAGMENT_AUTHORITY_VIOLATION");
}

const f7Readiness = assessF7SourceReadiness(enriched);
if (f7Readiness.status !== "EVIDENCE_ONLY_BLOCKED" || f7Readiness.blockers.length !== 1) {
  throw new Error("OECE_DERIVED_FRAGMENT_F7_ADMISSION_GATE_BYPASS");
}

console.log(JSON.stringify({
  gate: "OECE_ACS_DERIVED_FRAGMENT_TO_ARKI_BASELINE0",
  status: "PASS",
  physicalHandoffVerified: true,
  packageSha256: pkgInput.sha256,
  fragmentArtifactSha256: fragmentInput.sha256,
  ocrEvidenceSha256: ocrActualSha,
  fragmentFingerprint: fragment.Fingerprint,
  sourceDocumentSha256: fragment.SourceSha256,
  start: `${fragment.StartPage}:${fragment.StartBoundary}`,
  end: `${fragment.EndPage}:${fragment.EndBoundary}`,
  derivedClaims: derived.length,
  f7SourceReadiness: f7Readiness.status,
  f7SourceBlockers: f7Readiness.blockers,
  derivedClaimEvidenceState: derived[0].evidenceState,
  technicalDossierClaim: pkg.technicalDossierClaim,
  wholeDocumentPromotion: fragment.WholeDocumentPromotion,
  canonicalMutation: fragment.CanonicalMutation,
  baselineFingerprint: enriched.fingerprint,
  baselineSourceArtifacts: enriched.sourceArtifacts.length,
  baselineClaims: enriched.claims.length,
  immutable: enriched.immutable,
}, null, 2));
