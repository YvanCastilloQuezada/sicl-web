# Scheduler

## Lifecycle

La programación sigue `DRAFT → APPROVED → PUBLISHED`. `server/schedulerEngine.ts` genera propuestas in-memory, detecta parámetros inválidos y solapamientos, valida requisitos de ruleset, RTP, experiencia, contingencia, contenido, TV, móvil y recursos, y exige actor humano para aprobar y publicar.

## Bloques

Cada bloque contiene apertura, juego, resultado y transición. Cada evento propuesto incluye `eventId`, `gameId`, `experienceId`, inicio, fin y duración. El Scheduler no abre rondas ni modifica la base de resultados; prepara una propuesta para el flujo operativo existente.

## Bloqueos

Una propuesta con validaciones `BLOCKED` no puede aprobarse. Los campos no medidos producen `WARNING`, no una aprobación silenciosa. La API mantiene permisos administrativos para las operaciones de programación.

## Persistencia futura

La persistencia de `PROGRAM` y `BLOCK` aún no existe como tablas dedicadas. Antes de agregarla se requiere migración de staging, revisión de índices, idempotencia y plan de rollback.
