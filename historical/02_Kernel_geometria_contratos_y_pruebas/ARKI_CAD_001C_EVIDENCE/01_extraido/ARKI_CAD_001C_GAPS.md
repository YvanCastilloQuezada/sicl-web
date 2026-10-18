# ARKI-CAD-001C — Gaps and Blockers

| ID | Gap | Status | Required next evidence |
|---|---|---|---|
| CAD-001C-G01 | ODA Drawings SDK license, redistribution, runtime and SaaS terms | BLOCKED | Human/legal authorization and provider evidence |
| CAD-001C-G02 | Real DWG/DXF reader execution | BLOCKED | Authorized Windows-first headless worker |
| CAD-001C-G03 | CAD-T01…T10 corpus execution | NOT_EXECUTED / BLOCKED | Real or explicitly authorized fixtures |
| CAD-001C-G04 | Entity/layer/block/xref/units/coordinates extraction | NOT_DEMONSTRATED | Real parser output |
| CAD-001C-G05 | Primary versus RealDWG cross-check | DEFERRED | Independent authorized cross-check |
| CAD-001C-G06 | No-silent-loss proof | PARTIAL | Diagnostics over real files and discrepancy report |
| CAD-001C-G07 | ACIR to BIM semantic interpretation | PROHIBITED IN THIS ORDER | Later governed stage; `LINE` is not `WALL` |
| CAD-001C-G08 | ABB-001 reconstruction | BLOCKED | `CAD_GEOMETRY_READY=YES` plus explicit evidence |

## Explicit non-gaps

The provider boundary, minimum ACIR schema, parse-state taxonomy, deterministic serialization, synthetic diagnostics, source provenance fields, and semantic-promotion firewall are implemented for the declared open scope.

## Decision

Do not install or purchase a commercial SDK as part of CAD-001C. The correct next action is a separate human-authorized licensing/access decision followed by a controlled reader experiment. Until then, retain `PRIMARY_READER_RUNTIME = BLOCKED_BY_LICENSE_OR_ACCESS` and `CAD_GEOMETRY_READY = NO`.
