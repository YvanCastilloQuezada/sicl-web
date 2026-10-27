# ARKI_HANDOFF — Entrada para nuevos chats y agentes

**ESTADO: BASE DOCUMENTAL; no asumir actualidad automática.** La versión generada más reciente debe consultarse como artefacto de la ejecución exitosa de **ARKI Continuity Snapshot** en GitHub Actions.

## Qué es ARKI

ARKI/ARQUI es un proyecto de arquitecto inteligente multiescala (objeto → territorio), 3D-First, con AGK unificado, razonamiento espacial, conocimiento y aprendizaje con evidencia. La visión no implica implementación completada.

## Ley de reutilización

Antes de construir una capacidad, auditar y reutilizar las existentes; no duplicar fuentes de verdad. SICL Core y los contratos FROZEN permanecen protegidos. Una propuesta o simulación no se convierte en hecho por aparecer en la interfaz.

## Estado y próximos pasos

- Repositorio: `YvanCastilloQuezada/sicl-web`.
- Rama de trabajo histórica: `feat/arbol-vivo-precedencias-seguras-20261010`.
- `sicl-core/main` contiene módulos de memoria, conocimiento, derivación y persistencia; su existencia no demuestra integración ni validación operativa.
- El prototipo `arki-living-memory.cjs` no es memoria canónica.
- Auditorías históricas sin revalidación actual, ruta crítica UNKNOWN y promoción canónica BLOCKED hasta que exista evidencia vigente.
- Próxima tarea: reconciliar memoria y Event Store existentes con continuidad operativa, sin duplicar el sistema de Core.

## Documentos de entrada, en orden

1. Artefacto generado de ARKI Continuity Snapshot (fecha, SHA observado y límites epistemológicos).
2. `tools/maqueta-viva/ARKI-STRATEGIC-AUDIT-MEMORY.md`.
3. `tools/maqueta-viva/ARKI_AUDIT_INDEX.json`.
4. `tools/maqueta-viva/ARKI-MEMORY-REUSE-AUDIT.md`.
5. `tools/maqueta-viva/ARKI-MEMORY-REUSE-LAW.md`.

## Automatización y límites

`.github/workflows/arki-continuity.yml` genera el handoff y lo publica como artefacto de revisión. Es de solo lectura: no intenta hacer commits ni push automáticos a `main`, que está protegida y requiere PR. La generación de este archivo no equivale a validar CI, Core, E3, arquitectura ni despliegue. Los eventos de Core, auditorías externas y decisiones aún no se ingieren automáticamente.

Nunca confundir generación de resumen con memoria viva completa. No promover conocimiento, ejecutar tareas ni alterar Core/FROZEN automáticamente.
