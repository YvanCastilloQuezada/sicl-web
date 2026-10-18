# BKH4-0 Mutation Writer Inventory

**Estado:** auditado contractualmente; ninguna ruta fue migrada en BKH4-0.

| Writer / route | Current target | Current classification | BKH4 relevance | Treatment in Order 95 |
|---|---|---|---|---|
| `GeneratorModule → ProjectContext` | `building` / `constructionModel` UI state | Direct mutation / bypass risk | High | Inventory only; migration forbidden |
| `arkiRecalculation` | Derived geometry, quantities and outputs | Legacy derived writer | High | Inventory only; BKH4-3+ |
| `arki4d` | Schedule activities and critical path | Derived writer / ownership unresolved | Medium | Inventory only |
| `arki5d` | Quantities, PriceBook and budget | Derived writer / ownership unresolved | High | Inventory only |
| Relationship Fabric adapters | Relationship records | Safe adapter candidate | High | BKH-1 authority reused; no duplicate |
| Constraint Engine registry/evaluator | Constraint evaluation | BKH-2 authority | High | Consumed later; no duplicate |
| Regeneration Engine | Derived-state plan and outputs | BKH-3 authority | High | Consumed later; no integration in BKH4-0/1/2 |
| `shared/persistence/arkiPersistence.ts` | IndexedDB snapshots, projects, versions, audit | Persistence adapter | High | No atomic commit or recovery claim |
| `client/src/persistence/arkiIndexedDb.ts` | Browser IndexedDB records | Persistence adapter | High | No transaction commit migration |
| IFC exporter | External IFC artifact | External writer / representation | Medium | No external side-effect integration |
| IFC importer / web-ifc adapter | In-memory semantic representation | Safe adapter / partial | Medium | No canonical mutation |
| Structural adapter | Structural model contract | `NOT_DEMONSTRATED` bounded adapter | Medium | Professional firewall preserved |
| MEP adapter | Bounded/topological MEP fixture | `VERIFIED` bounded only | Medium | No professional solver claim |

## Confirmed mutation operations for BKH4-2

The inventory confirms that the initial declarative vocabulary is semantically relevant: `CREATE_ENTITY`, `UPDATE_PROPERTY`, `MOVE_ENTITY`, `DELETE_ENTITY`, `ADD_RELATIONSHIP`, `REMOVE_RELATIONSHIP` and `UPDATE_PARAMETER`. BKH4-2 implements their typed schema and validation only. It does not execute any operation.

## Persistence writers

Current persistence supports local records, snapshots, versions, audit entries and viewpoints according to existing contracts. It does not demonstrate a durable atomic commit primitive or crash recovery. `ATOMIC_COMMIT_PERSISTENCE` remains an implementation prerequisite for BKH4-6.

## Firewall result

No writer was wrapped, redirected, deleted, or promoted to canonical ownership by this order. Legacy migration and ownership consolidation remain blocked.
