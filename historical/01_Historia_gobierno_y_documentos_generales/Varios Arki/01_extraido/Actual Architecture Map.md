# Actual Architecture Map

| Layer | Evidence | Current truth | Canonical? | Runtime evidence |
|---|---|---|---|---|
| Frontend | `client/src/App.tsx`, `ArkiWorkspaceShell.tsx`, modules, canvas | React/Vite BIM shell and bounded modules | No global state owner | Build/check history and focal check |
| Construction domain | `shared/arkiConstructionOntology.ts`, `arkiConstructionElements.ts` | semantic construction objects, quantities, relations | Partial owner | constructive/E7 tests |
| Scene/selection | `shared/arkiSceneModel.ts`, `client/src/canvas/SceneModel3D.tsx`, selection/context files | derived scene and selection | Derived, not semantic owner | scene/selection tests |
| CAD | `shared/arkiCadGateway.ts`, `scripts/test-arki-cad-real-reader.ts` | ACIR + real LibreDWG bounded ingestion | No promotion authority | PASS, 7447 entities |
| IFC | `shared/ifc4/*` | IFC4 parser/export contracts and fixtures | No complete round-trip owner | web-ifc PASS |
| Constraint/regeneration | `shared/arkiConstraintEngine.ts`, `arkiRegenerationEngine.ts` | bounded engines | Not universal canonical mutation | BKH tests |
| Transactions | `shared/arkiTransactionEngine.ts` | schemas/state/mutation contracts | partial foundation | BKH4 tests |
| Canonical repository | `shared/arkiCanonicalProjectRepository.ts` | lineage/current/revision validation in memory | bounded canonical boundary | TX-003A |
| Durable persistence | `shared/arkiCanonicalPersistence.ts` | IndexedDB multi-store/CAS/idempotency/recovery | bounded authorized commit boundary | TX-003B.R/C/D |
| Reversal | `shared/arkiReversalEngine.ts` | compensating undo/redo | uses canonical persistence | TX-004 bounded |
| Knowledge | `shared/arkiLivingKnowledge.ts` | contracts for LKS/learning needs | not one integrated authority | LKS tests |
| Semantic Curator | external inspected ZIP only | starter package, not integrated | no | no product runtime evidence |
| Enterprise | documents/workspaces only | contract/documentation foundations | no production service | not demonstrated |
