# ARKI-K9 — Human Validation and Applicability

## Result

K9 adds a deterministic lifecycle around K8 claims without replacing K3 provenance or creating automatic promotion. The lifecycle supports candidate, human-confirmed, corrected, context-limited, rejected and superseded states.

## Controlled proof

The proof performs the following actions:

1. The ARB claim is corrected by a human while its original claim is preserved.
2. The ASES claim is confirmed for contextual use.
3. The RNE claim is limited to its Peruvian regulatory context.
4. A separate negative branch rejects the RNE claim.
5. A separate branch supersedes the ARB claim.
6. A contradiction record is preserved without creating a winner.

Only confirmed, corrected or context-limited claims become eligible for the read-only K4 store. Rejection and supersession exclude a claim from eligibility. Eligibility does not make a claim a project fact or a decision.

## Applicability model

Applicability remains explicit. A source may be useful in a typology or jurisdiction while remaining insufficient for project-specific performance, compliance or geometry. K9 therefore carries the original claim, current claim, action history, provenance references, applicability and contradiction references.

## Validation

The K9 test proves all lifecycle states, preservation of original claims, source traceability, contradiction preservation and K4 eligibility behavior.
