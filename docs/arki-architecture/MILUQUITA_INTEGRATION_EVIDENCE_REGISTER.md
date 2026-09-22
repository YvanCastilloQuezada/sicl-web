# ARKI — Registro de evidencia de integración Miluquita

**Fecha de auditoría:** 2026-09-22  
**Repositorio inspeccionado:** `YvanCastilloQuezada/milukita`  
**Commit inspeccionado:** `37d03d1b540a698716e243958423127bcf9ff15c`  
**Estado Git:** `main`, sincronizado con `origin/main`, worktree limpio.

## Resultado de la inspección

La copia pública inspeccionada contiene documentación de gobernanza, contratos de automatización, órdenes de trabajo y evidencia histórica. No contiene un workspace estructurado de producto, código de aplicación, rutas WebXR, componentes de cámara/GPS, service worker, API ejecutable, esquema de persistencia ni módulos de realidad aumentada. Las búsquedas de código para `WebXR`, `immersive-ar`, `hit-test`, `anchor`, `getUserMedia`, `geolocation`, `service worker`, `PWA`, `WebRTC`, `world engine` y rutas de servidor no produjeron evidencia ejecutable.

Por tanto, la afirmación correcta no es que ARKI haya incorporado una implementación AR de Miluquita. La afirmación correcta es: **ARKI incorporó los contratos de gobernanza y construyó un adaptador Bridge defensivo, mientras que la implementación de producto de Miluquita permanece no recuperada**.

## Evidencia incorporada

| Evidencia | Estado | Uso en ARKI |
|---|---|---|
| `docs/automation/HUMAN_GATES.md` | PRESENTE | Base para P0/P1/P2/P3 y fail-closed de operaciones sensibles |
| `docs/automation/DECISION_EVENT_SCHEMA.md` | PRESENTE | Base para eventos de decisión, gates y trazabilidad |
| `docs/automation/README.md` | PRESENTE | Regla de no reconstruir producto por conjetura |
| `AGENTS.md` | PRESENTE | Invariantes `CREATE != PUBLISH`, autoridad humana y validación física |
| `docs/work-orders/C-001_REALITY_MAP_MACHINE_READY.md` | `BLOCKED` | Se conserva como dependencia de recuperación, no como capacidad AR |
| Bridge ARKI-SFB-1.0 | IMPLEMENTADO EN ARKI | Transporte autenticado de observaciones; no es Core ni motor paralelo |

## Hallazgos de integridad

`git fsck --full` de Miluquita no reportó objetos corruptos. El repositorio no presentó archivos grandes inesperados, archivos `.env`/secretos/token/key, ejecutables de producto ni bytes nulos en los archivos de trabajo. La prueba de integridad de ARKI puede mostrar objetos Git colgantes históricos; eso no equivale a corrupción del árbol actual y requiere una decisión de limpieza separada, que no forma parte de esta integración.

## Límites que permanecen explícitos

`C-000` debe recuperar el workspace canónico de Miluquita antes de afirmar capacidades ejecutables de ese proyecto. `C-001` debe construir el Reality Map en modo de sólo lectura. La validación de cámara, hit-test, anclaje, precisión y compatibilidad física sigue siendo `PHYSICAL_VALIDATION_REQUIRED`. Ningún dispositivo de campo puede recibir el token de servicio de SICL Core, confirmar hechos, aprobar decisiones o publicar versiones.

## Referencias

- `server/arkiSpatialFieldBridge.ts`
- `server/arkiSpatialFieldBridge.test.ts`
- `docs/arki-architecture/ARKI_SPATIAL_FIELD_BRIDGE_API_SPEC_V1.md`
