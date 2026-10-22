# ARKI — Auditoría de reutilización de memoria: hallazgos confirmados

Fecha: 2026-10-10. Alcance: lectura remota de archivos en `sicl-core/main`; no se ejecutaron pruebas ni se verificó despliegue.

## Hallazgos confirmados por lectura de código

| Archivo | Evidencia | Conclusión limitada |
|---|---|---|
| `src/sicl/memory.py` | `extract_memory`, `memory_to_dict`; exige `project.stage == CLOSED`; produce `InstitutionalMemory` con evidencia, decisiones, estado, confianza, versión y anonimización | Memoria institucional de proyectos cerrados existe |
| `src/sicl/design_knowledge.py` | `DesignKnowledgeSource`, `DesignKnowledgeItem`, `DesignPattern`, `DesignKnowledgeAgent.query`, estados de revisión | Modelo y consultas de conocimiento de diseño existen |
| `src/sicl/domain.py` | `InstitutionalMemory`, `Event`, `Decision`, `Evidence`, `Project` | Tipos de dominio existentes |
| `src/sicl/derivation.py` | `DerivationLedger`, `DerivationRecord`, `TypedRelation`, `VersionedRef`; describe Event Store append-only | Trazabilidad de derivación existente |
| `src/sicl/repository.py` | `add_event`, `add_events_atomic`, `events`, `insert_memory_and_event`, `list_memory`, `get_memory`, `revoke_memory_and_event` | Persistencia SQLite y API de eventos/memoria existen |

## Ramas relevantes descubiertas

`rfc-011-institutional-memory`, `rfc-026-design-knowledge`, `feat/dam-dna-advisor-examiner-foundation`, `feat/h005-selective-recomputation`, `feat/commit-8a-d2-persistence`, `reconcile/arki-live-map-2026-10-07`.

Una rama no constituye evidencia de funcionalidad adicional vigente; las comparaciones de algunas ramas con main no mostraron diferencias.

## Dictamen provisional

**REUSE_CONFIRMED / CANONICAL_BOUNDARY_PENDING.** Existe infraestructura de eventos y memoria institucional en Core. La memoria operativa del **desarrollo de ARKI como producto** puede requerir un modelo de lectura distinto, pero debe reutilizar contratos e infraestructura cuando corresponda y evitar un segundo ledger canónico.

**No integrar** `arki-living-memory.cjs` como fuente de verdad; permanece prototipo aislado. No introducir eventos de auditoría de producto en el dominio de proyectos sin un contrato de ámbito y autoridad. No modificar Core/FROZEN.

## Siguientes verificaciones

1. Inspeccionar esquemas de tablas `events` y `institutional_memory`, y tests existentes.
2. Verificar límites de dominio y si un ledger de auditorías de producto puede apoyarse en Event Store sin contaminar el dominio de proyectos.
3. Inspeccionar la memoria Design DNA y otras ramas relevantes.
4. Probar consultas y persistencia en entorno aislado; comprobar idempotencia y replay.
5. Decidir adaptador de lectura para Plano Vivo y handoff con contrato explícito y sin duplicación.
