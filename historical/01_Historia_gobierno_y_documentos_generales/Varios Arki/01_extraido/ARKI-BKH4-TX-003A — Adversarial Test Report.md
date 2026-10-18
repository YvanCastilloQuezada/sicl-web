# ARKI-BKH4-TX-003A — Adversarial Test Report

## Executed suite

The suite produced a machine-readable `VERIFIED` result with:

- 25 adversarial cases covering identity, isolation, lineage, corruption, malformed payloads, self-certification, current ambiguity, and bypass attempts;
- 1,001 revisions in a deterministic torture chain;
- 200 deterministic property/fuzz cases, all rejected;
- defensive-copy and nested-aliasing attempts;
- stable repeated serialization and fingerprint checks.

## Attack coverage

| Attack family | Result |
| --- | --- |
| Duplicate revision ID | REJECTED |
| Duplicate transaction identity | REJECTED |
| Project/revision/transaction identity collision | REJECTED |
| Cross-project injection | REJECTED |
| Missing parent | REJECTED |
| Self-parent | REJECTED |
| Cyclic lineage | REJECTED |
| Silent fork / competing current child | REJECTED |
| Ambiguous current revision | REJECTED |
| External payload mutation | ISOLATED |
| Nested aliasing mutation | ISOLATED |
| Fingerprint tampering | DETECTED |
| Payload tampering | DETECTED |
| Parent tampering | DETECTED |
| Project tampering | DETECTED |
| Malformed JSON-like payload | REJECTED |
| Missing provenance | REJECTED |
| Unexpected property | REJECTED |
| Supplied `VERIFIED` status | REJECTED |
| Unknown status promotion | REJECTED |
| Repository bypass attempt | REJECTED |

## Important limit

The adversarial suite attacks the isolated repository boundary. It does not prove that every existing ARKI writer uses that boundary. That global property remains unverified until the explicitly deferred writer-migration phase.
