# AV036 — MO-05 local batch receipt (2026-10-16)

**Status: LOCAL_INTEGRATION_GATE_PASS / NOT_E3_OR_PRODUCTION_CERTIFIED**

Operator Arki-02 executed `ARKI_AV036_BATCH/EJECUTAR_TODO.sh` at 2026-10-16T21:15:23Z with Node v22.22.1.

Observed: ZIP_INTEGRITY=PASS; 42 tests, 42 pass, 0 fail, 0 skipped, 486.324682 ms. Test set includes 38 previously validated unit/smoke cases and four MO-05 integration tests. Six test file hashes recorded in `AV036_LOTE_20261016-161523.sha256`.

ZIP SHA-256: `94995c16d477a5572663744c3585955588d0c92c55b301eba7354ef803b7eb93`.

**Explicit limits**: `SOURCE_PROVENANCE=UNATTESTED_ZIP`; `CANONICAL_MUTATION=NOT_REQUESTED`; `E3_BROWSER=NOT_TESTED`; `SECURITY_DNS_REBINDING=NOT_TESTED`. Passing these tests does not independently attest the branch commit, prove browser E3, certify DNS/network policy, or authorize promotion to main.

Next: source provenance attestation, E3 browser workflow, adversarial DNS/private-network testing, and real independent metrics verification. No deletion of branches or canonical changes without PO approval.
