# MiLukita Controller Lab — recuperación, exportación múltiple y código manual

**Fecha:** 28 de agosto de 2026.  
**Ruta:** `/touch-remote`.

| Capacidad | Estado | Salvaguarda |
|---|---|---|
| Reconexión WebSocket | Implementado | Al cerrarse el canal, muestra respaldo y cuenta regresiva de 3 s antes del reintento. El botón **Reconectar ahora** reinicia una única conexión controlada. El polling persistente se mantiene como fallback. |
| Exportación múltiple | Implementado | Casillas por perfil y “Seleccionar visibles” exportan solo los perfiles elegidos. El JSON continúa sin QR, URL, sesión, token, rol ni estado de red. |
| Código manual | Implementado | El servidor genera 8 dígitos criptográficamente, solo guarda SHA-256, exige autenticación y vencimiento de la sesión, permite un único celular y rota el token móvil al vincular. El evento guarda `REDACTED`, nunca el código. |

## Migración y validación

La migración `0039_panoramic_pride.sql` fue revisada y aplicada. Añade `manualLinkCodeHash` nullable para compatibilidad con sesiones históricas y un índice único; toda sesión nueva recibe valor hasheado.

| Verificación | Resultado |
|---|---|
| `pnpm check` | PASS |
| Pruebas focalizadas | PASS — 4 archivos, 23 pruebas |
| `pnpm test -- --run` | PASS — 98 archivos, 343 pruebas; 1 archivo y 4 pruebas omitidas |
| `pnpm build` | PASS — 6,81 s |
| QA visual 1280×720 | PASS — alternativa manual y controles de perfil visibles |

El enlace manual y la recuperación se validaron por contrato y UI; QR/código entre dispositivos físicos y una sesión WebSocket persistente real siguen pendientes de verificación física. MJP CORE no fue modificado.
