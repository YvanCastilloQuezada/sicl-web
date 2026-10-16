# AV036 — Local Node.js validation receipt (2026-10-16)

Status: **LOCAL_UNIT_SUITES_PASS / INTEGRATION_AND_SECURITY_NOT_CERTIFIED**

Operator environment: Arki-02, Node.js v22.22.1.
Source: ZIP archive of `experiment/arki-ideas-mapa-vivo-20261015`, extracted into isolated `~/ARKI/AV036-VALIDACION/`. The ZIP's exact commit SHA was not independently recorded in the submitted test log.

Executed:
```sh
node --test \
 experiments/arki-ideas/av036-smoke.test.cjs \
 experiments/arki-ideas/REC-001/arki-live-systems-coordinator.test.cjs \
 experiments/arki-ideas/REC-002/arki-relational-learning.test.cjs \
 experiments/arki-ideas/REC-003/arki-twin-three-alternatives.test.cjs \
 experiments/arki-ideas/REC-006/arki-live-pulse.test.cjs
```

Reported results from user machine: exit code 0, 37 tests, 37 pass, 0 fail, 0 skipped, 420.300131 ms. The complete TAP log was supplied to the architect in conversation.

Acceptance: REC-001, REC-002, REC-003, REC-006 and smoke tests pass as a local **unit-test gate**. Do not claim that GitHub Actions succeeded, that the ZIP commit SHA is attested, that SSRF protections withstand DNS rebinding, that a real independent verifier exists, or that E2E and production readiness are certified.

Remaining gates: artifact/commit identity attestation; adversarial DNS and real network controls for REC-006; real independent verification contract for REC-003; broader integration/E3 tests; preservation and branch reconciliation. Do not prune branches or change main/FROZEN.
