# ARKI BIM Service Models

## Audit model

`BIMAuditBasis` defines the contract/TDR/EIR/BEP, information requirements, standards, regulations, conventions and expected deliverables against which inspection occurs. `BIMFinding` records observed state, expected state, evidence, consequence, confidence, affected relationships, suggested action and professional review.

A correct model produces `PASS`. A supported defect produces `EVIDENCE_BACKED_FINDING`. Conflicting sources produce `CONFLICT`; insufficient information produces `UNKNOWN`; professional conclusions produce `PROFESSIONAL_VALIDATION_REQUIRED`.

## Requirement model

`BIMRequirementMatrix` preserves source, version, clause/page, applicability, discipline, information object, expected/actual evidence, compliance, finding, severity and provenance. No requirement is invented when an audit basis is absent.

## Drawing-to-BIM model

Reconstruction must preserve the distinction between `AS_DOCUMENTED`, `INFERRED`, `PROPOSED_CORRECTION`, `REDESIGNED` and `UNKNOWN`. Explicit, dimension-derived, cross-view-derived and inferred geometry must not be conflated. Missing dimensions remain UNKNOWN.

## Rescue model

The bounded pipeline is audit → finding → red team → correction option → human-authorized test repair → revalidate → before/after. The present foundation proposes repairs only; it does not mutate canonical project state.

## Project assurance

The comparison is `expected delivery → actual delivery → compliance/findings/unknown`. Acceptance, rejection and professional certification remain human/professional authority.

## Post-award radar

Post-award opportunities are derived views of OPBI. Awarded project does not prove client need; BIM requirement does not prove BIM deficiency; potential client is not a confirmed lead.
