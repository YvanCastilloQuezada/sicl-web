# ARKI Curriculum Dependency Graph v1.1

```text
SOURCE
  ↓
CLAIM
  ↓
CURATION
  ↓
KNOWLEDGE
  ↓
PREREQUISITE
  ↓
CURRICULUM ITEM
  ↓
COMPETENCY
  ↓
EXAM
  ↓
EVIDENCE
  ↓
VERIFIED / DEFICIT / REVALIDATION_REQUIRED
```

Edges must preserve discipline, scale, jurisdiction, standard version and provenance. No automatic transfer is allowed from CITY to BUILDING or from one discipline to another. The graph is a semantic view over LKS and AKI evidence; it is not a new graph database.

Required relationship classes include `PREREQUISITE`, `SUPPORTED_BY`, `ASSESSED_BY`, `REVALIDATES`, `AFFECTS`, `APPLIES_AT_SCALE`, `APPLIES_IN_JURISDICTION`, `MAPPED_TO_STANDARD` and `CONFLICTS_WITH`.
