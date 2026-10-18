# BKH-1 — Relationship Schema

## Entidad principal: `RelationshipRecord`

```text
RelationshipRecord {
  relationshipId: StableRelationshipId
  relationshipRevisionId: RelationshipRevisionId
  relationshipType: RelationshipType
  family: RelationshipFamily
  sourceEntityId: EntityId
  targetEntityId: EntityId
  direction: RelationshipDirection
  sourceScale: RelationshipScale
  targetScale: RelationshipScale
  applicabilityScale: RelationshipScale
  sourceDiscipline: DisciplineId
  targetDiscipline: DisciplineId
  relationshipDiscipline?: DisciplineId
  origin: RelationshipOrigin
  evidence: EvidenceRef[]
  epistemicStatus: EpistemicStatus
  projectVersion: ProjectVersionRef
  validFrom?: Instant
  validTo?: Instant
  scenario?: ScenarioRef
  provenance: ProvenanceRecord
  legacyRefs?: LegacyReference[]
  derivedFrom?: RelationshipId[]
}
```

## Enumeraciones

`RelationshipFamily` = `SPATIAL | GEOMETRIC | STRUCTURAL | MEP | FUNCTIONAL | PARAMETRIC | CAUSAL | DOCUMENTAL | EPISTEMIC`.

`RelationshipDirection` = `DIRECTED | UNDIRECTED | BIDIRECTIONAL`.

`RelationshipOrigin` = `CANONICAL | LEGACY_ADAPTER | DERIVED | IMPORTED | HUMAN_ASSERTED`.

`EpistemicStatus` = `PROPOSED | OBSERVED | COMPUTED | VERIFIED | REJECTED | UNKNOWN`.

`RelationshipScale` = `HUMAN | COMPONENT | OBJECT | ACTIVITY | SPACE | SYSTEM | BUILDING | SITE | BLOCK | NEIGHBORHOOD | DISTRICT | CITY | METROPOLITAN_PROVINCIAL | REGION | COUNTRY`.

## Identidad

`relationshipId` es la identidad semántica estable de la relación y no cambia automáticamente cuando cambia `projectVersion`. `relationshipRevisionId` identifica el estado de esa relación en una revisión concreta. Una relación derivada no puede reutilizar silenciosamente el ID de su relación fuente.

## Obligatorios y derivados

Son obligatorios: identidad semántica, identidad de revisión, tipo, familia, source, target, dirección, escalas de origen/destino/aplicabilidad, disciplinas de origen/destino, origen, evidencia, estado epistémico, versión y provenance. `relationshipDiscipline`, `validFrom`, `validTo` y `scenario` son opcionales. `legacyRefs` y `derivedFrom` son opcionales en relaciones canónicas y obligatorios cuando `origin` es `LEGACY_ADAPTER` o `DERIVED`.

Los inversos, índices por source/target y consultas por familia son derivados. No son fuentes de verdad independientes.

## Invariantes del esquema

Una relación no puede apuntar a una entidad inexistente. No puede tener source y target idénticos salvo que el tipo lo autorice explícitamente. Las relaciones causales necesitan evidencia causal; una simple coincidencia temporal sólo puede ser `DERIVED` o `UNKNOWN`. El estado `VERIFIED` exige evidencia reproducible. Las relaciones cross-discipline deben conservar sourceDiscipline, targetDiscipline y, cuando aplique, relationshipDiscipline. Las relaciones cross-scale deben conservar sourceScale, targetScale y applicabilityScale. Una nueva versión no puede crear automáticamente una nueva identidad semántica si la relación no cambió.

## RelationshipTypeRegistry

El registro canónico debe declarar como mínimo:

```text
typeId
family
direction
inverseType
selfRelationAllowed
cyclePolicy
allowedSourceScales
allowedTargetScales
allowedSourceDisciplines
allowedTargetDisciplines
minimumEvidence
validationRules
status/version
```

El registro es la autoridad del vocabulario. Los adapters no pueden inventar sinónimos incompatibles.

## Ownership

La Fabric posee la relación. La entidad fuente y destino conservan sus propios owners. SceneModel, Quantity, Cost, Schedule, StructuralModel, MEPModel, Snapshot y HumanDecision no se absorben en este esquema.
