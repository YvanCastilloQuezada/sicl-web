# ARKI — Gemelo digital: puerta de viabilidad con datos reales (GDT-01)

**Fecha:** 2026-10-08  
**Rama:** `feat/f7-f8-integral-closure`  
**Dictamen:** **NO APTO TODAVÍA PARA GEMELO DIGITAL OPERATIVO**. Existe base parcial para auditar estados de proyecto, pero no evidencia suficiente para afirmar gemelo físico, reproducción de operación ni simulación calibrada.  
**Invariantes:** F1–F10, roadmap, FROZEN, Core, D-2, AGK y autoridades **sin modificación**. Ningún resultado visual promueve una pieza.

## 1. Datos reales inspeccionados

| Fuente | Evidencia constatada | Límite |
|---|---|---|
| `docs/arki-master-map/ARKI_MASTER_MAP_STATE.json` | Diez IDs de fase F1–F10; estados y etiquetas de evidencia; `updated_at=2026-10-07`. | No contiene eventos físicos con `occurredAt`, ni identificadores de activos construidos. |
| Git: `17c5bab905f9dd2c939fbc03a441e3a76533fa54` | Blob de estado `2ae60e4b4b4273409a1bcf55a4e89a2d4cd3b455`. | El SHA del blob identifica el contenido del archivo, no certifica un evento de dominio. |
| Git: `bc10c8e22d703ddce8c3b3eaca51304bd093b688` | Blob de estado `c7595bfa7517edbc5d2506fc9a9581e289885765`. | El contenido del estado cambió entre cortes, pero **los diez estados de fase y sus etiquetas de evidencia permanecieron iguales**. |
| `server/arkiProfessionalState.ts` | Tipos `Baseline0`, `SourceClaim`, `CoordinatedProfessionalState`; identidad de proyecto, checksum de fuentes, `receivedAt`, `provenance`, fingerprints. | Es un contrato implementado; no demuestra que un modelo RVT real se haya extraído y validado. |
| `server/arkiF9ConstructionLineage.ts` | Contrato de observación `F9FieldObservation` con `observationId`, `capturedAt`, `sourceRef`, `provenance`, `semanticIds` y revisión. | No se ha demostrado un flujo de campo real E2E con identidad física estable y observaciones verificadas. |
| `server/arkiProjectEconomicTwin.ts` | Línea base económica con `effectiveDate`, cantidades, precios y `provenance`, con cálculo de diferencias. | Un cálculo de costes condicionado no prueba un gemelo físico sincronizado ni calibrado. |
| Estado F7/F8/F9 del proyecto | `CODE_COMMITTED_EXECUTION_VERIFICATION_PENDING`; datos S10 y RVT pendientes de extracción/validación. | No utilizar como si ya fueran fuentes operativas verificadas. |

**Observación real:** los dos cortes Git comparados conservan los diez estados oficiales. No corresponde inventar un evento de cambio de fase para producir una línea de tiempo llamativa.

## 2. Cuatro puertas de viabilidad

| Puerta | Condición exigible | Resultado |
|---|---|---|
| **GDT-01A Identidad** | `projectId`, `assetId` persistente, identidad semántica, mapeo D-2/AGK/elemento físico; detección de duplicados. | **PARCIAL**: F1–F10 identificables; activos físicos y correspondencia con RVT/obra **NO DEMOSTRADOS**. |
| **GDT-01B Tiempo y eventos** | `eventId` único; `occurredAt` con zona; `recordedAt` separado; fuente; secuencia, idempotencia, correcciones sin reescritura. | **NO DEMOSTRADO** con observaciones físicas reales. Git ofrece tiempo de confirmación, no de ocurrencia. |
| **GDT-01C Procedencia** | `sourceId`, checksum de archivo, versión, actor/canal, firma o cadena de custodia cuando aplique; fail-closed. | **PARCIAL**: Git SHA y contratos de fingerprints; custodia y procedencia física **NO DEMOSTRADAS**. |
| **GDT-01D Replay** | Reconstruir estado en instante T desde eventos inmutables; cotejar con una observación independiente; rechazar alteración/reordenación. | **PENDIENTE DE EJECUCIÓN** para historial Git; **NO DEMOSTRADO** para activos/operación real. |

**Regla:** una reconstrucción de snapshots Git de F1–F10 es una **línea de tiempo auditable del proyecto**, no una reproducción histórica de un edificio.

## 3. Ejecutor verificable (solo lectura)

`tools/maqueta-viva/Verify-ARKI-TwinTimeline.mjs`:

- Lee hasta **35 commits de primer padre** que modificaron el estado canónico, directamente de la historia Git local.
- Extrae el estado de F1–F10 de cada commit, conservando `commit SHA`, checksum SHA-256 del contenido y hora de confirmación Git.
- Emite observaciones derivadas únicamente cuando un estado de fase o su evidencia cambia; establece cadena SHA-256 y checkpoints.
- Reconstruye el estado mediante replay y compara cada checkpoint con su snapshot de origen.
- Identifica explícitamente `domainOccurredAt: null` y **no genera** eventos de campo ni activos físicos ficticios.
- No escribe en el repositorio ni altera el roadmap. La salida JSON opcional es un **informe de auditoría**, no un ledger canónico.
- Incluye autoprueba con datos sintéticos para verificar integridad, rechazo de manipulación y rechazo de identidades incompletas; **la autoprueba no cuenta como prueba con datos reales**.

Ejecutar desde `C:\ARKI\repos\sicl-web`:

```powershell
node .\tools\maqueta-viva\Verify-ARKI-TwinTimeline.mjs --self-test
node .\tools\maqueta-viva\Verify-ARKI-TwinTimeline.mjs --out "$env:LOCALAPPDATA\ARKI\MaquetaViva\twin-temporal-gate.json"
```

**Evidencia pendiente:** capturar salida exacta de Windows, `snapshots`, `observedChanges`, `replayCheckpoints`, `historicalReplay` y errores. No afirmar PASS hasta ejecutar el script contra la copia local y revisar el resultado.

## 4. Siguiente espécimen físico necesario

La próxima puerta requiere un único activo real (por ejemplo un recinto, equipo o elemento constructivo) con:

1. Identidad persistente y mapeo de origen `RVT elementId / IFC GlobalId / D-2 semanticId / AGK objectId` **solo si se pueden verificar**.
2. Dos o más observaciones reales fechadas, con `occurredAt`, `recordedAt`, `sourceRef`, hash del archivo y responsable/canal.
3. Una transformación reproducible de evento a estado, con replay en dos tiempos y cotejo contra evidencia independiente.
4. Conflictos, cambios de identidad y datos ausentes tratados como `UNKNOWN`, no como hechos ni como `VERIFIED`.

Sin este espécimen, no aprobar sincronización con obra, simulación operativa ni decisiones automatizadas. El roadmap de F1–F10 **permanece intacto**.

## 5. Veredicto y clasificación

- **Código del verificador:** `IMPLEMENTED_NOT_YET_EXECUTED_ON_WINDOWS`.
- **Identidad de fases Git:** `OBSERVED_IN_TWO_REAL_COMMITS`.
- **Eventos de dominio reales:** `NOT_DEMONSTRATED`.
- **Procedencia de repositorio:** `GIT_COMMIT_AND_BLOB_PRESENT`; auditoría de hash/replay `AWAITING_EXECUTION`.
- **Gemelo digital físico confiable:** `NOT_READY`.
- **Promoción canónica:** `FORBIDDEN` sin autoridad y evidencia.

**NO EVIDENCIA = NO VERDE.**
