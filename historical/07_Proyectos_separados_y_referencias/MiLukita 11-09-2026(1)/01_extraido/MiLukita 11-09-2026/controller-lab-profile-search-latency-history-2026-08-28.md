# MiLukita Controller Lab — descubrimiento de perfiles e historial de conexión

**Fecha:** 28 de agosto de 2026.  
**Ruta:** `/touch-remote`.

| Capacidad | Estado | Salvaguarda |
|---|---|---|
| Búsqueda y filtros de perfiles | Implementado | Busca por nombre, modo o clase de dispositivo; filtra entre todos, locales e importados. |
| Previsualización JSON | Implementado | Todo paquete se valida antes de abrir un diálogo con archivo, cantidad y lista de presets. La confirmación es explícita. |
| Protección de presets existentes | Implementado | Una importación nunca reemplaza presets existentes; si el límite local de 12 no deja espacio, se informa y se cancela. |
| Tendencia de latencia | Implementado | Conserva hasta 120 muestras de ping/pong (aprox. 6 minutos a 3 s) y presenta una línea compacta en el tooltip. |

## Validación

| Verificación | Resultado |
|---|---|
| `pnpm check` | PASS |
| Pruebas focalizadas | PASS — 4 archivos, 19 pruebas |
| `pnpm test -- --run` | PASS — 98 archivos, 339 pruebas; 1 archivo y 4 pruebas omitidas |
| `pnpm build` | PASS — 6,76 s |
| QA visual 1280×720 | PASS — búsqueda, filtros e intercambio JSON visibles |

El gráfico requiere una sesión WebSocket vinculada para mostrar pings reales. No infiere una conexión real ni sustituye una prueba entre teléfono y pantalla físicos. La importación no incluye token, QR, URL de sesión, rol o estado de conexión. MJP CORE queda fuera del alcance de esta funcionalidad.
