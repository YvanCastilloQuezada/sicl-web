# ARKI Authority Profile 1.0

## Authorization

The Product Owner explicitly authorized the operational unfreezing of `MC-02`, `MC-03`, `FKCG-02`, `DS-EVAL-001` and `DG-01B`. The single Unified Motor now recognizes this authorization through `server/arkiAuthorityProfile.ts`.

## Granted powers

| Piece | Power granted | Operational meaning | Human gate preserved |
|---|---|---|---|
| MC-02 | Execution authority | Future orders may enter the common work queue and be reported for readiness. | Product Owner review per order |
| MC-03 | Execution authority | Assembly context may be used to inspect component connections and gaps. | Architecture review |
| FKCG-02 | Evidence authority | Preserved knowledge may be retrieved as candidates with provenance. | Human knowledge promotion |
| DS-EVAL-001 | Evidence authority | External evaluation may participate in evidence comparison. | External evidence review |
| DG-01B | Protocol authority | The blind/adversarial protocol may be executed and its outcomes recorded. | DG-01E result review |

## Important distinction

The authorization changes the **operational permission** of these pieces. It does not manufacture evidence, convert hypotheses into FACT, convert documentation into implementation, or certify a professional project.

```text
AUTHORIZATION ≠ IMPLEMENTATION
AUTHORIZATION ≠ PASS
AUTHORIZATION ≠ PROFESSIONAL CERTIFICATION
AUTHORIZATION + EVIDENCE + GATE REVIEW → PROMOTION POSSIBILITY
```

`HUMAN_AUTHORITY = FINAL` remains invariant. Unknowns remain visible. A frozen asset may now be worked on by the Unified Motor, but it must produce its own evidence before its capability status changes.
