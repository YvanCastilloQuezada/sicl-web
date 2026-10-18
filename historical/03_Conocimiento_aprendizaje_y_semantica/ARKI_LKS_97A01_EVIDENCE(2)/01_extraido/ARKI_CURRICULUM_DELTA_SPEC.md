# ARKI CurriculumDelta Specification v1.1

A `CurriculumDelta` records a verified or material knowledge change without silently modifying curriculum.

Required fields: `deltaId`, `triggeringChange`, `source`, `previousState`, `newEvidence`, `affectedKnowledge`, `affectedCurriculumItems`, `affectedCompetencies`, `proposedAddition`, `proposedModification`, `proposedDeprecation`, `revalidationRequired`, `impact`, `unknowns`, `humanDecisionRequired`.

Impact values: `NO_IMPACT`, `POSSIBLE_IMPACT`, `MATERIAL_IMPACT`, `UNKNOWN`, `HUMAN_DECISION_REQUIRED`.

No-impact or rejected/non-material changes may close silently after recording. Material changes, stale competencies, conflicts, regulatory impact and architectural impact escalate to Human Authority.

The implementation creates a delta and revalidation analysis; it does not apply a curriculum mutation.
