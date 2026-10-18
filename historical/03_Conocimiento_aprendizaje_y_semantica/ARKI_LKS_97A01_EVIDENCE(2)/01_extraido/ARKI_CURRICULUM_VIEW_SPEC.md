# ARKI Curriculum View Specification v1.1

## Owner

A derived view over AKI-001 historical curriculum, Knowledge Inventory, Competency Matrix, Knowledge Gaps, evidence and LKS records. It is not a second CurriculumRegistry.

## Required fields

`curriculumItemId`, `canonicalName`, `domain`, `discipline`, `applicableScales`, `knowledgePrerequisites`, `competencyPrerequisites`, `learningObjectives`, `requiredKnowledge`, `requiredCapabilities`, `sourceClaims`, `standardsReferences`, `regulatoryReferences`, `epistemicState`, `competencyState`, `evidence`, `tests`, `heldOutTests`, `deficits`, `lastReviewed`, `lastChanged`, `stalenessStatus`, `humanDecisionRequired`.

## Rules

- Historical AKI-001 entries remain historical.
- The view can compose fields from multiple owners.
- A gap does not authorize training or product modification.
- Teaching does not create VERIFIED competence.
- Project evidence does not become general knowledge without a transfer test.
- Scale and jurisdiction are mandatory applicability guards.
- `CANONICAL_CANDIDATE` policy remains an ADR decision.
