# ARKI-HARDENING-H003 — Validity & Invalidation Contract (PRE-IMPLEMENTATION / RED TEAM REQUIRED)

## Status
`CONTRACT_DRAFTED / TDD_RED / IMPLEMENTATION_FORBIDDEN_PENDING_DEEPSEEK`

## Purpose
H-003 must convert **observed dependency conditions** from H-001 and **read-only impact topology** from H-002 into explicit, explainable validity assessments.

It MUST NOT recompute results, mutate geometry, execute a reaction plan, write BIM, or bypass Human Authority.

## Non-negotiable distinctions

- `OBSERVATION != INTERPRETATION != REACTION`
- `VERSION_MISMATCH != AUTOMATICALLY_INVALID`
- `IMPACTED != STALE`
- `STALE != INVALID`
- `IDENTITY_UNVERIFIABLE != CONTENT_HASH_MISMATCH`
- `CURRENT PROJECT VERSION != EXACT DEPENDENCY VERSION`
- `HISTORICAL CLAIM != CURRENT JUSTIFICATION`

## Proposed minimal contract

### ValidityStatus
- `VALID`
- `STALE`
- `INVALID`
- `BLOCKED`
- `UNKNOWN`
- `REVALIDATION_REQUIRED`

### ValidityReason
A machine-readable reason must contain:
- `code`
- exact `subject: VersionedRef`
- exact triggering dependency/observation where applicable
- `source_record_id`
- `policy_id`
- human-readable explanation is optional and non-authoritative

### ValidityAssessment
- `subject: VersionedRef`
- `status: ValidityStatus`
- `reasons: tuple[ValidityReason, ...]`
- `derived_from_observations`
- `policy_id`
- `read_only = True`

## Policy principle

H-003 MUST NOT contain a universal hidden mapping from every mismatch to a status.
Classification is performed by an explicit versioned policy.

Initial conservative policy candidate:

| Observation | Default classification |
|---|---|
| no issue and identity verified | VALID |
| VERSION_MISMATCH | STALE |
| MISSING_DEPENDENCY | BLOCKED |
| CONTENT_HASH_MISMATCH | INVALID |
| IDENTITY_UNCERTAIN | REVALIDATION_REQUIRED |
| IDENTITY_UNVERIFIABLE | UNKNOWN |

DeepSeek must attack whether these defaults are safe across COMPUTATIONAL, EPISTEMIC, ARCHITECTURAL, NORMATIVE and GOVERNANCE domains.

## Multiple derivations (RT-A)

A subject may have more than one independent derivation.

H-003 MUST NOT mark the subject INVALID merely because one justification failed if another independent justification remains valid.

Required aggregation semantics are intentionally **not frozen yet**. DeepSeek must attack:
- ANY-valid vs ALL-valid;
- domain-specific aggregation;
- whether independent epistemic support differs from deterministic computational derivation;
- how contradictory derivations are represented.

## Scope boundaries

H-003 may:
- inspect H-001 records/checks;
- inspect H-002 impact reports;
- produce read-only validity assessments;
- explain reasons and policy.

H-003 may NOT:
- append invalidation events automatically;
- mutate derivations;
- recompute outputs;
- choose design alternatives;
- mutate geometry;
- write BIM;
- execute downstream actions.

## Required TDD scenarios

T1 exact hash+version match -> VALID.
T2 VERSION_MISMATCH -> policy-derived STALE, with exact evidence.
T3 MISSING_DEPENDENCY -> BLOCKED.
T4 CONTENT_HASH_MISMATCH -> INVALID.
T5 IDENTITY_UNCERTAIN -> REVALIDATION_REQUIRED.
T6 IDENTITY_UNVERIFIABLE -> UNKNOWN.
T7 impacted-only artifact with no direct integrity failure is NOT automatically STALE.
T8 two independent derivations, one broken and one verified -> must not collapse to INVALID without explicit aggregation policy.
T9 policy version is recorded and deterministic.
T10 assessment is read-only: Event Store unchanged.
T11 project isolation.
T12 unknown observation code fails closed.
T13 cycles do not cause infinite invalidation.
T14 historical assessment is distinguishable from current assessment.
T15 no recomputation/mutation method exists in H-003 API.

## DeepSeek gate

Before implementation, DeepSeek must review this contract and the RED tests.

Required DeepSeek output:
1. CRITICAL/HIGH/MEDIUM/LOW findings.
2. Counterexample for every challenged rule.
3. Specific attack on RT-A aggregation.
4. Specific attack on normative/epistemic validity.
5. Whether the six statuses are sufficient or misleading.
6. Whether `STALE`, `INVALID`, and `BLOCKED` are semantically separable.
7. Minimal contract corrections only; no implementation.

Until that review returns, H-003 implementation is prohibited.
