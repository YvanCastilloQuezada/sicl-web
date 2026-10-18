# MiLukita Controller Lab — etiquetas, picos y carga asistida

**Fecha:** 28 de agosto de 2026.  
**Ruta de control:** `/touch-remote`.  
**Ruta de TV para pruebas:** `/tv`.

| Capacidad | Estado | Salvaguarda |
|---|---|---|
| Etiquetas personalizadas | Implementado | Cada perfil admite hasta ocho etiquetas locales de 20 caracteres. La búsqueda general y un selector de etiquetas pueden combinarlas con el filtro de procedencia. |
| Pico de latencia | Implementado | Cada muestra del gráfico ofrece foco y puntero; muestra ping exacto y texto accesible. La línea colorea los tramos conforme a las muestras reales. |
| Toasts al arrastrar archivo | Implementado | El soltar un JSON válido comunica que debe revisarse antes de importar; el error muestra el motivo de validación. No se produce guardado automático. |

## Validación

| Verificación | Resultado |
|---|---|
| `pnpm check` | PASS |
| Pruebas focalizadas | PASS — 4 archivos, 21 pruebas |
| `pnpm test -- --run` | PASS — 98 archivos, 341 pruebas; 1 archivo y 4 pruebas omitidas |
| `pnpm build` | PASS — 6,90 s |
| QA visual 1280×720 | PASS — zona de arrastre, búsqueda, filtros y selector de etiquetas visibles |

Las rutas de preview se validaron en sandbox: `https://3000-i2iir7cc4y7kro7s9cjv5-72fa419e.us4.manus.computer/touch-remote` y `https://3000-i2iir7cc4y7kro7s9cjv5-72fa419e.us4.manus.computer/tv`. El historial de ping requiere una sesión WebSocket real. MJP CORE no fue modificado.
