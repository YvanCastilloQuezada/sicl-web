# BKH-1 — Relationship Schema

## Entidad principal: `RelationshipRecord`

```text
RelationshipRecord {
  relationshipId: StableRelationshipId
  relationshipType: RelationshipType
  family: RelationshipFamily
  sourceEntityId: EntityId
  targetEntityId: EntityId
  direction: RelationshipDirection
  scale: RelationshipScale
  discipline: DisciplineId
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

`relationshipId` debe ser estable para la misma relación semántica dentro de una versión de proyecto. Debe distinguir source, target, tipo, dirección, escala, disciplina y versión. Una relación derivada no puede reutilizar silenciosamente el ID de su relación fuente.

## Obligatorios y derivados

Son obligatorios: identidad, tipo, familia, source, target, dirección, escala, disciplina, origen, evidencia, estado epistémico, versión y provenance. `validFrom`, `validTo` y `scenario` son opcionales. `legacyRefs` y `derivedFrom` son opcionales en relaciones canónicas y obligatorios cuando `origin` es `LEGACY_ADAPTER` o `DERIVED`.

Los inversos, índices por source/target y consultas por familia son derivados. No son fuentes de verdad independientes.

## Invariantes del esquema

Una relación no puede apuntar a una entidad inexistente. No puede tener source y target idénticos salvo que el tipo lo autorice explícitamente. Las relaciones causales necesitan evidencia causal; una simple coincidencia temporal sólo puede ser `DERIVED` o `UNKNOWN`. El estado `VERIFIED` exige evidencia reproducible. Las relaciones cross-discipline y cross-scale deben conservar ambas dimensiones en el registro.

## Ownership

La Fabric posee la relación. La entidad fuente y destino conservan sus propios owners. SceneModel, Quantity, Cost, Schedule, StructuralModel, MEPModel, Snapshot y HumanDecision no se absorben en este esquema.
