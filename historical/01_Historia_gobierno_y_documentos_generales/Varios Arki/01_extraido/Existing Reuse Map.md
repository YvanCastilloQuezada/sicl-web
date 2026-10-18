# Existing Reuse Map

| Existing artifact | Reuse target | Decision | Boundary |
|---|---|---|---|
| `shared/arkiConstructionOntology.ts` | C1,C2,C6-C10,C64,C74 | REUSE/EXTEND | not a professional solver |
| `shared/arkiArchitecturalProgram.ts` | C2 | REUSE/EXTEND | bounded program/relationship evaluation |
| BKH-1 Relationship Fabric | relationships for many Cn | REUSE | does not evaluate constraints or commit by itself |
| BKH-2 Constraint Engine | applicability/evaluation prerequisites | REUSE | not a solver or evidence authority |
| BKH-3 Regeneration Engine | dependency invalidation | REUSE | no auto-certification |
| BKH4/TX-003/TX-004 | canonical transaction boundary | REUSE | TX-005 remains blocked/not authorized |
| `shared/arkiCadGateway.ts` + real reader | C35 | REUSE | CAD ≠ BIM; bounded ingestion only |
| `shared/ifc4/*` + web-ifc | C37 | REUSE/EXTEND | IFC4 bounded; IFC4.3 round-trip unverified |
| E7 4D/5D/clash contracts | C8,C9,C23-C26,C44-C46,C69-C74 | REUSE/EXTEND | bounded capabilities only |
| E8 dossier/O&M/gate contracts | C10,C23,C24 | REUSE/EXTEND | scope-specific evidence |
| LKS contracts | C25-C29,C47,C56,C57 | ADAPT | not one integrated knowledge authority |
| Semantic Curator starter ZIP | semantic registry | RECONCILE FIRST | not integrated, no writer authority |
| frontend shell/i18n | C30-C33,C44,C75,C79,C80 exposure | REUSE/EXTEND | UI truth equals system truth |
