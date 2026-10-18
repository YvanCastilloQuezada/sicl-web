# BKH-1 — Relation Migration Matrix

| Fuente actual | Significado actual | Decisión | Estrategia | Compatibilidad | Fuente final |
|---|---|---|---|---|---|
| `ConstructionModel.relations` | Relaciones constructivas principales | REUSE / CONSOLIDATE | Convertir cada relación a registro Fabric conservando IDs y `origin=CANONICAL`. | Adaptador de lectura si el shape cambia. | Relationship Fabric |
| `ElementRelation` | `supports`, `rests_on`, `hosts`, `bounds`, `opens_to`, `coordinates_with` | REUSE / EXTEND | Mantener tipos; añadir dirección, escala, evidencia, provenance y estado epistémico. | `ElementRelationAdapter`. | Relationship Fabric |
| `tracesTo` | Trazabilidad de elemento hacia otro | ADAPT | Convertir a relaciones documentales, funcionales o espaciales según evidencia. | El consumidor lee adapter durante transición. | Relationship Fabric |
| `wallIds` | Espacio limitado por muros | ADAPT / KEEP_AS_DERIVED | Generar relaciones `BOUNDED_BY`; no conservar lista como fuente primaria. | Derivar lista legacy desde Fabric. | Relationship Fabric |
| `elementIds` en schedule | Actividad vinculada a elementos | ADAPT | Generar `ACTIVITY_APPLIES_TO` o `ACTIVITY_DELIVERS`. | Schedule conserva API de lectura inicialmente. | Relationship Fabric |
| `relatedIds` de SceneModel | Vínculos de representación | KEEP_AS_DERIVED | Derivar desde Fabric; SceneModel no gana autoridad semántica. | Campo derivado versionado. | Relationship Fabric |
| Relaciones MEP | Conectores y sistemas | EXTEND | Mapear `CONNECTED_TO`, `SERVES`, `FEEDS`, `BELONGS_TO_SYSTEM`. | Adaptador de nodos MEP. | Relationship Fabric |
| Relaciones estructurales | Supports, members, restraints y references | EXTEND | Mapear soporte, continuidad y referencia estructural. | StructuralModel sigue siendo owner de cálculo. | Relationship Fabric |
| Relaciones 4D | Precedencias y elementos de actividad | ADAPT | Precedencia permanece owner de 4D; vínculo actividad-elemento va a Fabric. | API 4D mantiene proyección. | Relationship Fabric |
| Relaciones 5D | Cantidad/partida/elemento | ADAPT | Precio y cantidad no se absorben; se registran vínculos de trazabilidad. | Budget5D mantiene cálculos. | Relationship Fabric |
| Clashes | Intersecciones detectadas | KEEP_AS_DERIVED / EXTEND | Clash es resultado de coordinación; se relaciona con nodos y evidencia, no reemplaza relaciones semánticas. | Resultado actual se proyecta. | Relationship Fabric + Coordination |
| Impact/consequence relationships | Consecuencias de cambios | ADAPT | Se modelan como `CAUSAL` sólo si hay evidencia explícita; correlaciones quedan `DERIVED`. | `Impact` se convierte en vista o adapter. | Relationship Fabric |
| IFC relationships | Relaciones importadas/exportadas | ADAPT | Conservar provenance IFC, GlobalId y loss report. | Parser/exporter mantiene formato. | Relationship Fabric |

## Reglas de migración

La migración debe ser determinista, idempotente y reversible durante la transición. Cada relación migrada deberá conservar el identificador legacy, el origen, la versión y la evidencia. Los elementos inexistentes, ciclos inválidos, duplicados y relaciones ambiguas deben producir rechazo explícito, no descarte silencioso.

Toda relación migrada debe resolver explícitamente `sourceScale`, `targetScale`, `applicabilityScale`, `sourceDiscipline`, `targetDiscipline` y, cuando corresponda, `relationshipDiscipline`. La migración no puede colapsar una relación cross-scale o cross-discipline en un único campo ambiguo.

La migración debe separar `relationshipId` estable de `relationshipRevisionId` y `projectVersion`. Repetir una migración sobre una nueva versión no debe crear una nueva identidad semántica si source, target, tipo y significado no cambiaron.

Los tipos migrados deben resolverse mediante `RelationshipTypeRegistry`. Si un vocabulario legacy no tiene correspondencia canónica, el registro queda `UNKNOWN` y se produce un informe de migración; no se crea silenciosamente un nuevo sinónimo.

No se eliminará una estructura legacy hasta que exista una prueba de compatibilidad, una proyección equivalente y un registro de migración.
