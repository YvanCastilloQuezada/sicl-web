# AKI-001 — Delta curricular BKH-1 Relationship Fabric

**Fecha:** 23 de septiembre de 2026

## Nuevo conocimiento incorporado

ARKI incorpora una infraestructura relacional transversal denominada **Relationship Fabric**. El aprendizaje principal es que una relación BIM no debe confundirse con geometría, cantidad, costo, schedule, snapshot o representación de escena. La Fabric expresa vínculos; los demás dominios conservan sus propios propietarios hasta que una fase posterior los consolide formalmente.

## Principios aprendidos

La identidad semántica de una relación (`relationshipId`) es distinta de la revisión de proyecto (`relationshipRevisionId` y `projectVersion`). Las relaciones deben conservar escala de origen, escala de destino y escala de aplicabilidad. También deben conservar disciplina de origen, disciplina de destino y, de manera opcional, disciplina de la relación.

El vocabulario relacional debe estar gobernado por un `RelationshipTypeRegistry`. Los adapters legacy no pueden inventar silenciosamente tipos nuevos. Una relación no registrada debe rechazarse o quedar explícitamente clasificada como desconocida y producir evidencia de migración.

## Evidencia incorporada

- `shared/arkiRelationshipFabric.ts`.
- `shared/arkiRelationshipAdapters.ts`.
- `scripts/test-bkh1-relationship-fabric.ts`.
- `BKH1_IMPLEMENTATION_OUTPUTS.txt`.
- `BKH1_REPORT.md`.

## Estado epistemológico

El conocimiento de BKH-1 se clasifica como **IMPLEMENTED / PENDING EVIDENCE REVIEW**. Las pruebas de dominio pasan, pero la Fabric aún no equivale a un grafo global con registry universal de entidades, detección universal de ciclos o autoridad humana transversal.
