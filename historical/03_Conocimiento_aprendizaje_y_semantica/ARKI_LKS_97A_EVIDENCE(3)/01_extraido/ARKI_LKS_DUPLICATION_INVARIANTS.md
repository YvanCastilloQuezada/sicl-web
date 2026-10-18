# ARKI LKS Duplication Invariants v1.1

The following invariants are enforced by inspection and integration tests:

| Invariant | Meaning |
|---|---|
| NO_SECOND_CURRICULUM | AKI-001 curriculum is referenced or viewed, not copied into a second owner |
| NO_SECOND_COMPETENCY_REGISTRY | Competency evidence remains derived from existing matrix/evidence and LKS |
| NO_SECOND_GAP_REGISTRY | Gap Register remains the LKS view over existing gaps |
| NO_SECOND_EVIDENCE_REGISTRY | Evidence references preserve source owners and hashes |
| NO_SECOND_IFC_KNOWLEDGE_BASE | IFC remains LKC-001 and existing IFC evidence is referenced |
| NO_PARALLEL_STANDARDS_TRUTH | Standards are an LKS family, not a parallel registry |
| NO_PARALLEL_KNOWLEDGE_BOOK | Knowledge Book deltas remain historical and traceable |
| NO_PARALLEL_CAPABILITY_ATLAS | Capability Atlas remains a derived view |

Duplicate values in one owner map are allowed when they represent multiple semantic views over one governed owner. Owners containing `SECOND`, `PARALLEL` or `#2` are rejected by the defensive test helper.
