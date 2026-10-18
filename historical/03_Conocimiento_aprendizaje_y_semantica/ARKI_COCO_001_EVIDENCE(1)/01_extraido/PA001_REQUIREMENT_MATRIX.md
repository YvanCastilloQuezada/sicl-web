# PA-001 — Matriz de trazabilidad

| Requirement | Implementation | Test | Result | Evidence |
|---|---|---|---|---|
| ArchitecturalProgram | `shared/arkiArchitecturalProgram.ts` | PA-T01..T10 | PASS | `PA001_OUTPUTS.txt` |
| ProgramSpaceRequirement | `ProgramSpaceRequirement` | PA-A05, PA-A06 | PASS | test source + output |
| Explicit spatial relations | `ProgramRelationship` | PA-T01..T05 | PASS | test source + output |
| Priority distinct from truth | `ProgramPriority` and evaluator | PA-T04, PA-M04 | PASS | test source + output |
| UNKNOWN preserved | evaluator missing evidence branch | PA-T03, PA-T08 | PASS | test source + output |
| NOT_APPLICABLE | empty applicability branch | PA-T09 | PASS | test source + output |
| Conflict detection | equal-priority opposite relation branch | PA-T05, PA-A03 | PASS | test source + output |
| Provenance | `ProgramProvenance` carried to result | PA-A04 | PASS | test source + output |
| Applicability extensible | `ProgramApplicability` fields | PA-T09 | PASS | contract source |
| Determinism | pure evaluator and fixed output marker | PA-T06, PA-M01..M02 | PASS | test source + output |
| ID renaming semantic stability | separate source/target fixture | PA-T07, PA-M03 | PASS | test source + output |
| Duplicate rules | semantic-key deduplication | PA-A02, PA-M04 | PASS | test source + output |
| Project isolation | evaluator has no shared mutable state | PA-T10, PA-A07 | PASS | test source + output |
| Malformed/partial input no crash | fail-closed unknown paths | PA-A08 | PASS | test source + output |
| Test sensitivity | deliberate `UNKNOWN → SATISFIED` mutation | Test-the-test | PASS | test source + output |
| No Space Syntax implementation | explicit scope firewall | inspection/report | PASS | `PA001_IMPLEMENTATION_REPORT.md` |
