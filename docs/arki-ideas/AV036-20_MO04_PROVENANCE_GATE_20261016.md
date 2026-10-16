# AV036 MO-04 — Provenance and conservation gate

## Confirmed local evidence
- Operator reported 2026-10-16 local automated run: 38 tests passed, 0 failed, exit 0.
- The run fell back to a local ZIP after HTTP 404.
- ZIP SHA-256 from that run: `94995c16d477a5572663744c3585955588d0c92c55b301eba7354ef803b7eb93`.
- `REC001_CLI_MECHANICS=PASS_READ_ONLY`.
- `SOURCE_SHA=PLACEHOLDER_NOT_ATTESTED`.

## Evidence semantics
The SHA-256 is an identity for the ZIP bytes only; it does not attest the Git commit, the remote branch head, or the content of a newly published commit. Tests are a local gate, not E3, independent measurement verification, or network-security certification.

## Next execution
Run `ARKI_AV036_MO04.sh` on the extracted ZIP to record the SHA-256 of each relevant source and verify ZIP integrity. Retain the generated log. No branch deletion, canonical mutation, automatic approval, or claims of GitHub Actions success.

## Pending acceptance gates
1. Link the tested artifact to a Git commit using independently obtained immutable commit metadata and a verified content tree.
2. Exercise full application integration and E3 in the user environment.
3. Review DNS rebinding and private-address access controls in REC-006.
4. Implement independent measurement verification for REC-003.
5. Reconcile source branches before any pruning.
