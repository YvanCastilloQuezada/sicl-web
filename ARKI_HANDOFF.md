# ARKI_HANDOFF — Entrada obligatoria para nuevos chats y agentes

**ESTADO: BOOTSTRAP — pendiente de primera ejecución del workflow.** No atribuir actualidad ni validación automática a este archivo hasta que se regenere.

## Qué es ARKI

ARKI/ARQUI es un proyecto de arquitecto inteligente multiescala (objeto → territorio), 3D-First, AGK unificado, razonamiento espacial, conocimiento y aprendizaje con evidencia. La visión no implica implementación completada.

## Ley de reutilización

Antes de construir una capacidad, auditar y reutilizar las existentes; no duplicar fuentes de verdad. Core y FROZEN protegidos.

## Estado y próximos pasos

- Repositorio: `YvanCastilloQuezada/sicl-web`.
- Rama experimental: `feat/arbol-vivo-precedencias-seguras-20261010`.
- `sicl-core/main` contiene `src/sicl/memory.py`, `src/sicl/design_knowledge.py`, `src/sicl/derivation.py` y `src/sicl/repository.py` con operaciones de eventos y memoria. Existencia de código no equivale a validación de integración.
- El prototipo `arki-living-memory.cjs` queda aislado; no es memoria canónica.
- Auditorías históricas sin revalidación actual, ruta crítica UNKNOWN, promoción canónica BLOCKED.
- Próxima tarea: reconciliar memoria y Event Store existentes con continuidad operativa, construir integración verificada sin duplicación.

## Documentos de entrada, en orden

1. `ARKI_HANDOFF.md` (este archivo).
2. `tools/maqueta-viva/ARKI-STRATEGIC-AUDIT-MEMORY.md`.
3. `tools/maqueta-viva/ARKI_AUDIT_INDEX.json`.
4. `tools/maqueta-viva/ARKI-MEMORY-REUSE-AUDIT.md`.
5. `tools/maqueta-viva/ARKI-MEMORY-REUSE-LAW.md`.

## Automatización y límites

`.github/workflows/arki-continuity.yml` está configurado para regenerar el handoff con commits observados en esta rama (push, manual y cada seis horas). **No hay evidencia todavía de ejecución exitosa**. Los eventos de Core, auditorías externas, CI y decisiones aún no se ingieren automáticamente. Verificar el SHA remoto y el resultado del workflow antes de usar este archivo como estado actual.

No confundir generación de resumen con memoria viva completa. Nunca promover automáticamente conocimiento, ejecutar tareas ni alterar Core/FROZEN.
