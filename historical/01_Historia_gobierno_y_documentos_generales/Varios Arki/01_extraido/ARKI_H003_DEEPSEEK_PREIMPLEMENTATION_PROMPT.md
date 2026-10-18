# DEEPSEEK RED TEAM --- H-003 PRE-IMPLEMENTATION BUNDLE

## Mandatory gate

Do not implement. Attack the proposed H-003 validity/invalidation
contract and its RED TDD tests before implementation.

## Context already verified

H-002 current reconciled snapshot: 340 PASS / 0 FAIL. RT-A is now
implemented: multiple independent derivations may justify one output.
F-1 identity observations now exist: `IDENTITY_UNVERIFIABLE`,
`IDENTITY_UNCERTAIN`, `CONTENT_HASH_MISMATCH`, `VERSION_MISMATCH`.

## Attack targets

1.  Is the proposed mapping from observation to validity status
    logically safe?
2.  Can VERSION_MISMATCH ever remain VALID?
3.  Can MISSING_DEPENDENCY be UNKNOWN rather than BLOCKED?
4.  Does CONTENT_HASH_MISMATCH imply INVALID or only provenance
    corruption/revalidation?
5.  Does IDENTITY_UNVERIFIABLE imply UNKNOWN in every domain?
6.  How should multiple independent derivations aggregate?
7.  Should computational, epistemic, normative and architectural
    derivations use different policies?
8.  Can one subject simultaneously be computationally stale but
    epistemically supported?
9.  Are VALID/STALE/INVALID/BLOCKED/UNKNOWN/REVALIDATION_REQUIRED
    sufficient and mutually intelligible?
10. Can cycles or alternative derivations create contradictory
    assessments?
11. Does H-003 need a validity vector instead of one scalar status?
12. Can historical validity be confused with current validity?
13. Does policy versioning itself need provenance/versioned refs?
14. Are the TDD tests missing adversarial cases?
15. Is any H-003 behavior secretly a reaction/recomputation rather than
    assessment?

## Required response

For each finding: - severity: CRITICAL/HIGH/MEDIUM/LOW; - exact
challenged clause/test; - counterexample; - why it matters
architecturally; - minimal correction; - whether it blocks
implementation.

Return a final gate: `PROCEED`, `PROCEED_WITH_REQUIRED_CORRECTIONS`, or
`DO_NOT_PROCEED`.

Do not claim runtime evidence. Do not implement code.
