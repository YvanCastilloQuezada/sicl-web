# ARKI — Generation and Evaluation API Contract V1



**Contract ID:** ARKI-GENERATION-EVALUATION-API-V1

**Version:** 1.0.0

**Status:** REQUIRED API CONTRACT — IMPLEMENTATION NOT YET VERIFIED

**Parent contract:** ARKI-GENERATION-FUNNEL-CONTRACT-V1



---



## 1. Purpose



Define the minimum server/client data contract for the canonical

generation and evaluation process:



100 → 40 → 25 → 16 → 9 → 4 → 1.



The API must expose actual evaluated and selected candidate sets.

Counts alone are insufficient.



## 2. Request requirements



A generation request must identify:



- projectId and generation configuration.

- Site and jurisdiction references.

- Program and project parameters.

- Generation strategy and family/variant constraints.

- Initial generation count (canonical default: 100).

- Versioned normative rule set.

- Versioned architectural evaluation rubric.

- Funnel target sequence.

- Required geometry and AGK validation policy.



The server must reject invalid or contradictory configurations.

It must not silently replace missing project facts with invented

site or regulatory values.



## 3. Response envelope



The response must expose, at minimum:



- contractVersion

- generationId

- projectId

- status

- generatedCandidates

- stages

- finalRecommendation

- evidenceManifest

- governance



Each candidate must retain its unique candidateId and references

to its project, generation, geometry and evaluation evidence.



## 4. Stage record



Every stage must return a structured record containing:



- stageId

- stageOrder

- stageType

- targetInputCount

- actualInputCount

- evaluatedCount

- passedCount

- failedCount

- unknownCount

- blockedCount

- selectedCount

- excludedCount

- inputCandidateIds

- evaluatedCandidateIds

- selectedCandidateIds

- excludedCandidateIds

- rubricVersion or ruleSetVersion

- evaluatorVersion

- evaluationRecords

- evidenceRefs

- completionStatus

- stopReasons



The API must not report evaluatedCount equal to inputCandidateCount

unless every input candidate has a completed evaluation record.



## 5. Required stage sequence



| Stage ID | Operation | Target |

|---|---|---:|

| GENERATION | Initial candidate generation | 100 |

| NORMATIVE_SCREENING | Verified hard constraints | 40 |

| ARCHITECTURAL_QUALITY | Architectural evaluation and ranking | 25 |

| FUNNEL_25_16 | Evaluate 25, select 16 | 16 |

| FUNNEL_16_9 | Evaluate 16, select 9 | 9 |

| FUNNEL_9_4 | Evaluate 9, select 4 | 4 |

| FUNNEL_4_1 | Evaluate 4, recommend 1 | 1 |



Actual counts must be returned even when a stage stops below target.



## 6. Candidate evaluation record



Each evaluation record must contain:



- candidateId

- stageId

- evaluationStatus

- criteriaResults

- score and scoreScale, when applicable

- ranking

- hardConstraintResults

- unknowns

- findings

- failureReasons

- evidenceRefs

- geometryRef

- agkCompilationRef

- rubricVersion

- evaluatorVersion

- evaluatedAt



A score without criteria, rubric version and evidence is not a valid

architectural evaluation record.



## 7. Selection record



Each selection record must contain:



- stageId

- candidateIdsBefore

- candidateIdsSelected

- candidateIdsExcluded

- rankingSnapshot

- selectionCriteria

- diversityAdjustments, if any

- tieBreakReasons, if any

- decisionEvidenceRefs



Diversity adjustments must be visible and explainable.

They must not conceal a lower quality ranking or bypass hard constraints.



## 8. Persistence and identity



The server must preserve the full generation and all stage records.



Persistence requirements:

- Unique generation and stage identifiers.

- No silent overwrite of an existing generation record.

- Versioned or append-only records.

- Integrity hashes or equivalent verifiable evidence references.

- Complete selected and excluded candidate histories.

- Reconstructable stage transitions.



Persisting only the final 25 candidates does not satisfy this contract.



## 9. Frontend requirements



The frontend must consume the server's actual stage records.

It must not reconstruct or simulate server evaluations.



It must not:

- Assume that a generated universe contains only 9 candidates.

- Treat the original generated universe as the selected Funnel set.

- Infer evaluation completion from a candidate count.

- Replace missing server evidence with local demo candidates.

- Display a proposal as evaluated without a completed evaluation record.



The Funnel must show actual evaluated, selected, excluded, unknown

and blocked counts for each stage.



## 10. Error and stop behavior



Required fail-closed conditions include:



- Missing normative evidence for a mandatory rule.

- Missing site or project facts needed for compliance.

- Incomplete candidate evaluation.

- Missing geometry or AGK evidence required by the stage.

- Duplicate candidate identity.

- Inconsistent stage counts.

- Missing rubric or evaluator version.

- Missing persistence evidence.

- Attempted advancement of a failed, unknown or blocked candidate.



The API must return a structured error or incomplete stage status.

It must never convert these conditions into a successful stage.



## 11. Compatibility and migration



The existing 9/4/1 implementation is not equivalent to this contract.



Existing endpoints, schemas, UI adapters, persistence and tests must

be migrated and verified against this contract. Compatibility adapters

must not fabricate 100 → 40 → 25 → 16 transitions or claim evaluations

that did not occur.



The frontend and backend must agree on the same generationId,

candidate IDs, stage IDs and evidence references.



## 12. Acceptance tests



Required tests:

1. 100 generated candidates are returned or referenced in the manifest.

2. 100 candidates receive normative screening records.

3. Only verified PASS candidates advance.

4. 40 candidates receive architectural quality evaluations before

   selection of 25.

5. Every candidate entering 25, 16, 9 and 4 receives that stage's

   evaluation before reduction.

6. Actual selected candidate IDs are returned, not just counts.

7. All excluded candidates and reasons remain retrievable.

8. Repeated generation IDs cannot overwrite prior evidence.

9. Frontend stage counts match server records.

10. Missing evidence blocks advancement.

11. Deterministic ranking is reproducible for identical inputs

    and versioned evaluation rules.

12. End-to-end tests prove continuity through AGK and the Funnel.



**Implementation status:** NOT VERIFIED until all acceptance gates pass.
