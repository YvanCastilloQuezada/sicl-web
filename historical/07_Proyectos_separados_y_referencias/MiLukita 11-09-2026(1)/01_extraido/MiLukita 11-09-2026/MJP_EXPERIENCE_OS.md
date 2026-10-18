# MJP Experience OS

## Propósito

MJP Experience OS es la capa de orquestación de entretenimiento que organiza programas, bloques, eventos, experiencias y pantallas. No reemplaza al Game Core ni decide resultados. Su función es hacer que una ronda verificable pueda presentarse de forma coherente en TV, celular, overlay/OBS y panel operativo.

## Autoridad

| Capa | Responsabilidad | Puede modificar resultados o reglas |
| --- | --- | --- |
| Game Core | Rondas, tickets virtuales, cierre, sorteo, liquidación y reglas | Sí, únicamente dentro de sus invariantes y operaciones autorizadas |
| Event Engine | Proyección de una ronda a estado de evento | No |
| Experience Engine | Fases, plantillas, copy, modos de pantalla y transición | No |
| Scheduler | Propuestas de programas y bloques | No; requiere aprobación |
| Broadcast/Manifest | Distribución pública del estado autoritativo | No |
| Second Screen | Interacción contextual y acceso móvil | No |
| Verification | Evidencia reproducible del resultado | No |
| Autonomy | Orquestación supervisada, watchdog y contingencia | No |
| Human Control Room | Pausa, modo degradado, aprobación y Kill Switch | No modifica históricos |

## Flujo operativo

`PROGRAM → BLOCK → EVENT → EXPERIENCE → TV → QR → MOBILE → INTERACTION → LOCK → DRAW → RESULT → VERIFY → PUBLISH → NEXT EVENT`.

El estado oficial proviene siempre del servidor. TV, móvil, avatar y contenido son consumidores o presentadores. En contingencia se conserva el último estado confirmado y se evita inventar resultados.

## Implementación vigente

La primera integración de Orden 25 reutiliza `shared/eventEngine.ts`, `shared/experienceEngine.ts`, `server/schedulerEngine.ts`, `server/broadcast.ts`, `shared/tvManifest.ts`, `server/eventStore.ts`, `shared/contingencyEngine.ts` y `server/autonomy.ts`. El manifest ahora incorpora contexto de experiencia, plantilla, fase y modo móvil/TV. El QR firmado incluye contexto de evento/experiencia y una sesión efímera, sin activar dinero real.

## Límites

La persistencia completa de `PROGRAM/BLOCK/EXPERIENCE` y la concurrencia en una base staging requieren migraciones y una URL de staging aislada. Hasta entonces, los contratos de Scheduler y Experience Engine pueden probarse en memoria y la publicación sigue requiriendo aprobación humana.
