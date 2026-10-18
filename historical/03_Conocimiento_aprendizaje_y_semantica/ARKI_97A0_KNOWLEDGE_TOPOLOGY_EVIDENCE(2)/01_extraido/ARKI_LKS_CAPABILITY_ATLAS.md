# ARKI LKS — Derived Capability Atlas and Gap Register

**Status:** derived from structured assessment fixtures; not a second database.

## Capability Atlas

| Codebook | External concept | Dimension | Status | Evidence state |
|---|---|---|---|---|
| LKC-001-IFC | IFC wall / IFC schema | READ | PARTIAL | Existing bounded IFC evidence; full semantics not demonstrated |
| LKC-001-IFC | IFC exchange | ROUND_TRIP | NOT_DEMONSTRATED | Productive round-trip remains outside verified scope |
| LKC-001-IFC | IDS requirements | VALIDATE | NOT_DEMONSTRATED | No governed IDS validator evidence |
| LKC-001-IFC | BCF issue exchange | REPRESENT | UNKNOWN | No canonical ARKI mapping |
| LKC-002-SMART-CITIES | KPI framework | READ | MAPPED | Research mapping only; no product capability claim |
| LKC-002-SMART-CITIES | Indicator computation | REASON | NOT_DEMONSTRATED | Methodology, units and sources not integrated |
| LKC-003-URBAN-DIGITAL-TWIN | CityGML | IMPORT | PARTIAL | No complete productive adapter evidence |
| LKC-003-URBAN-DIGITAL-TWIN | SensorThings observations | READ | ABSENT | Not demonstrated in ARKI |
| LKC-003-URBAN-DIGITAL-TWIN | UDT synchronization | SIMULATE | NOT_DEMONSTRATED | No real-world synchronization contract |
| LKC-003-URBAN-DIGITAL-TWIN | UDT governance | VALIDATE | ARCHITECTURAL_DECISION_REQUIRED | Ownership, privacy and authority unresolved |

## Gap Register

| Gap | Codebook | Gap type | Impact | Status | Human decision |
|---|---|---|---|---|---|
| GAP-IFC-ROUNDTRIP | LKC-001-IFC | UNVERIFIED | HIGH | OPEN | No |
| GAP-IFC-IDS | LKC-001-IFC | UNVERIFIED | HIGH | OPEN | No |
| GAP-SMART-KPI-METHOD | LKC-002-SMART-CITIES | UNVERIFIED | UNKNOWN | OPEN | No |
| GAP-UDT-SENSOR | LKC-003-URBAN-DIGITAL-TWIN | ABSENT | HIGH | OPEN | No |
| GAP-UDT-GOVERNANCE | LKC-003-URBAN-DIGITAL-TWIN | DECISION | UNKNOWN | OPEN | Yes |
| GAP-UDT-SYNC | LKC-003-URBAN-DIGITAL-TWIN | UNVERIFIED | HIGH | OPEN | No |

A gap is evidence for planning, not authorization to implement.
