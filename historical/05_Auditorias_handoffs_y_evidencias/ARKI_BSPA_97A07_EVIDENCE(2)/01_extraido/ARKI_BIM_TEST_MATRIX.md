# ARKI BIM Test Matrix — bounded foundation

| ID range | Coverage |
|---|---|
| BIM-01..05 | correct model, real clash, false-positive clash, missing property, contradictory documents |
| BIM-06..10 | unknown dimension, duplicate, orphan, invalid relationship, missing classification |
| BIM-11..15 | quantity mismatch, drawing/model conflict, unsupported discipline, missing audit basis, wrong requirement version |
| BIM-16..20 | inapplicable requirement, repair new clash, repair approved design, specialty redesign, scan without scale |
| BIM-21..25 | photo without dimensional evidence, IFC property loss, IFC relationship loss, federated ownership, as-designed/as-built |
| BIM-26..30 | as-built/digital twin, audit conflict, audit-only anti-upsell, project isolation, client data not canonicalized |
| BIM-31..35 | post-award need distinction, BIM requirement distinction, one-project generalization, human authority, professional validation |
| BIM-36..40 | large-project extrapolation, false positive, false negative, UNKNOWN, provenance |

## Required outcomes

Every case must preserve evidence state and may produce PASS, finding, conflict, UNKNOWN or professional validation required. No test may convert an absent source into a defect or use a quantity of findings as a quality metric.

## Security boundary

Client model data remains project-specific. It is not promoted to general or canonical knowledge without explicit curation and human authority. Sensitive facility information remains governed by CFMI/ICWI restrictions.
