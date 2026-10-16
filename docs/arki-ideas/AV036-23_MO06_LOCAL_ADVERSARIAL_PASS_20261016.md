# ARKI AV036 — MO-06 local adversarial validation receipt

Date: 2026-10-16. Operator: Arki-02 (local Linux environment). Node v22.22.1.

**Verdict: LOCAL_GATE_PASS_47_OF_47. PRODUCTION_SECURITY_NOT_CERTIFIED.**

- ZIP SHA-256: `94995c16d477a5572663744c3585955588d0c92c55b301eba7354ef803b7eb93`
- ZIP_INTEGRITY=PASS
- SECURITY_PATCH=APPLIED_ISOLATED
- 47 tests / 47 passed / 0 failed / 0 skipped; duration 468.133328 ms.
- FINDINGS empty.
- SOURCE_PROVENANCE=UNATTESTED_ZIP
- E3_BROWSER=NOT_TESTED
- NETWORK_TRANSPORT=DISABLED_UNTIL_PINNED
- CANONICAL_MUTATION=NONE

Evidence supplied by operator:
`MO06_COMPLETE_20261016-163530.log` and `MO06_COMPLETE_20261016-163530.tap`.

**Scope caution:** The passing tests were run against an isolated patched copy of the historical ZIP, not a cryptographically attested current GitHub commit. The live pulse network transport remains disabled. Do not interpret the local result as full DNS-rebinding mitigation in a deployed transport, production E3, independent measurement verification, or permission to merge into main.

Next gates: MO-07 browser E3 with captured evidence; source provenance; safe pinned network transport; independent measurement verification; PO authorization for any canonical promotion.
