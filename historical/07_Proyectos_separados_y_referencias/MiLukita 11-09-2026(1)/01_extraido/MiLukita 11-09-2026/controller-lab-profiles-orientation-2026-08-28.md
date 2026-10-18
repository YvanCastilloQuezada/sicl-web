# MiLukita Controller Lab — perfiles, orientación y onboarding

**Fecha:** 28 de agosto de 2026.  
**Alcance revisado:** `/touch-remote`, contrato de perfiles y procedimientos `controller.shareProfile` / `controller.importProfile`.

| Elemento | Estado | Evidencia |
|---|---|---|
| Orientación horizontal, vertical y automática | Implementado y verificado visualmente | Selector accesible; horizontal es el valor inicial. El modo automático escucha cambio de viewport y `screen.orientation` cuando el navegador lo expone. |
| Tamaño de puntero del Mini Teclado | Implementado y verificado visualmente | Slider accesible de 20 % a 45 %, persistido en perfiles locales y compartibles. |
| Perfiles compartibles por código corto | Implementado y probado por contrato | Código criptográfico `MLXXXXXXXX`, vigencia de siete días, validación estricta de preferencias visuales y auditoría de crear/importar. |
| Exclusión de credenciales | Implementado y probado por contrato | El schema no admite tokens, QR, URLs de sesión ni identificadores de usuarios; la auditoría declara `containsSessionTokens: false` y `coreAccess: NONE`. |
| Onboarding interactivo | Implementado y verificado visualmente | Cinco pasos no bloqueantes, navegación Anterior/Siguiente/Finalizar, Saltear, diálogo accesible y finalización guardada localmente. |
| MJP CORE | Preservado | Los cambios se limitan a configuración de Controller Lab y no modifican RNG, reglas, resultados, RTP, wallet, ledger, settlement, credits ni `MjpTvManifest`. |

## Validación ejecutada

| Verificación | Resultado |
|---|---|
| `pnpm check` | PASS |
| Pruebas focalizadas Controller Lab | PASS — 4 archivos, 14 pruebas |
| `pnpm test -- --run` | PASS — 98 archivos, 334 pruebas; 1 archivo y 4 pruebas omitidas |
| `pnpm build` | PASS — 6,81 s |
| Captura `/touch-remote` a 1280×720 | PASS; sin desbordamiento horizontal visible |
| Captura `/touch-remote` a 390×844 | PASS; sin desbordamiento horizontal visible |

## Límites conocidos

La generación e importación de códigos requiere autenticación y la confirmación de intercambio real entre dos cuentas no se ejecutó en esta revisión de sandbox. El canal WebSocket continúa implementado en código con fallback persistido; no hay evidencia nueva de operación 24/7, disponibilidad en hosting persistente ni validación con teléfono y TV físicos.

El build conserva la advertencia no bloqueante de un chunk `vendor-three` superior a 500 kB, aislado del Controller Lab.
