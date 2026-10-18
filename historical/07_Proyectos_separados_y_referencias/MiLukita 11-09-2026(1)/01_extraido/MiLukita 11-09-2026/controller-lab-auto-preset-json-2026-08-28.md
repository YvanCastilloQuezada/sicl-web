# MiLukita Controller Lab — recomendación, detalle de red y presets JSON

**Fecha:** 28 de agosto de 2026.  
**Ruta:** `/touch-remote`.

| Capacidad | Estado | Límite de seguridad |
|---|---|---|
| Recomendación de preset | Implementado | Compara la relación ancho/alto del viewport con presets representativos que conservan la misma orientación y sugiere el más próximo. La aplicación sigue siendo decisión explícita del usuario. |
| Tooltip de latencia | Implementado | Muestra ping en milisegundos cuando existe ping/pong WebSocket, el estado de respaldo y recomendaciones de red proporcionales. No promete rendimiento ni disponibilidad. |
| Exportar presets JSON | Implementado | Exporta solo preferencias: nombre, color, layout, feedback, modo, controles, orientación, trackpad, icono y clase de dispositivo. Excluye token, QR, URL de sesión, roles y estado de conexión. |
| Importar presets JSON | Implementado | Solo acepta el formato versionado `milukita-controller-presets` v1, máximo 512 kB y valida estrictamente campos, colores, posiciones y rango del trackpad. |

## Validación

| Verificación | Resultado |
|---|---|
| `pnpm check` | PASS |
| Pruebas focalizadas | PASS — 4 archivos, 18 pruebas |
| `pnpm test -- --run` | PASS — 98 archivos, 338 pruebas; 1 archivo y 4 pruebas omitidas |
| `pnpm build` | PASS — 6,53 s |
| QA visual 1280×720 | PASS — accesos a simulación, exportación e importación visibles |

El tooltip y los umbrales se validaron por contrato y renderizado. La medición de ping real y la selección de archivos deben comprobarse en una sesión autenticada con dispositivo y red física. La funcionalidad se limita a presentación; MJP CORE permanece sin cambios.
