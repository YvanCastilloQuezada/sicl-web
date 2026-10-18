# MiLukita — Matriz de compatibilidad de plataformas

**Orden 44 · Estado:** diagnóstico. La matriz no certifica hardware no disponible y no implementa fallbacks nuevos.

## Resumen de evidencia

La cobertura automatizada disponible es Chromium mediante Playwright. Incluye viewport de escritorio, tablet y celular emulado, cambio de modo TV, persistencia de tema y descarga PNG en overlay. Esto no equivale a certificación de Safari iOS, Android TV, Google TV, WebView o Smart TV física.

| Plataforma | Abrir MiLukita | TV/modo | QR/evento | Interacción | Imagen/descarga | Pérdida/recuperación | Estado |
|---|---|---|---|---|---|---|---|
| Chrome Windows | E2E/preview parcial | Selector y overlay cubiertos | Contrato QR cubierto; cadena visual parcial | Rutas existentes | PNG cubierto en Chromium | UI de contingencia cubierta | Automatizado parcial |
| Chrome Android | No probado en dispositivo físico | No certificado | No certificado físico | No certificado físico | No certificado físico | No certificado físico | NO CERTIFICADO — LIMITACIÓN DEL ENTORNO |
| Safari iOS | No probado | No certificado | No certificado | No certificado | `canvas`/descarga no certificada | No certificado | NO CERTIFICADO — LIMITACIÓN DEL ENTORNO |
| Chrome Android TV | No probado en hardware | No certificado | No certificado | Control remoto no probado | Descarga no certificada | No certificado | NO CERTIFICADO — LIMITACIÓN DEL ENTORNO |
| Android TV WebView | No probado | No certificado | No certificado | Focus remoto no probado | No certificado | No certificado | NO CERTIFICADO — LIMITACIÓN DEL ENTORNO |
| Google TV | No probado | No certificado | No certificado | Focus remoto no probado | No certificado | No certificado | NO CERTIFICADO — LIMITACIÓN DEL ENTORNO |
| Smart TV propietario | No probado | No certificado | No certificado | No certificado | No certificado | No certificado | NO CERTIFICADO — LIMITACIÓN DEL ENTORNO |

## Descarga de imágenes

El flujo actual genera la imagen desde un canvas del navegador y activa una descarga local con un mecanismo HTML/Blob verificado por E2E Chromium. La prueba existente espera el evento `download` y valida el nombre `mjp-manifest-*.png`; no prueba Safari iOS ni Android TV. No se dispone de evidencia suficiente para afirmar que `canvas.toDataURL`, `Blob`, Object URL, atributo `download`, MIME, apertura en pestaña o compartir funcionen igual en todos los navegadores.

## Requisitos de prueba física

Cada ejecución debe registrar fabricante/modelo, sistema operativo, navegador o WebView, versión, resolución, orientación, red, URL, evidencia visual, consola, resultado y observaciones. Chrome desktop emulado debe permanecer etiquetado como automatización y nunca como Android TV.

## Hallazgos

| ID | Prioridad | Problema → evidencia → impacto → solución futura → dependencia → prioridad |
|---|---|---|---|---|---|
| PLAT-01 | P1 | Safari iOS no certificado → no existe ejecución física → descarga, PWA y gestos pueden fallar → ejecutar matriz en iPhone/iPad y definir fallback soportado → hardware Apple → alta |
| PLAT-02 | P1 | Android TV no certificado → no existe prueba de foco/control remoto → usuario puede quedar sin navegación → probar Android TV/Google TV/WebView separados → hardware TV → alta |
| PLAT-03 | P2 | Descarga validada solo en Chromium → E2E usa `waitForEvent(download)` → no garantiza guardar/compartir en iOS → probar Blob, MIME, gesto y share/save → navegador objetivo → media |
| PLAT-04 | P3 | No hay evidencia en Smart TV propietario → fabricantes difieren en WebView y navegador → comportamiento incierto → seleccionar matriz mínima por marca → QA físico → baja |

**Conclusión:** `pnpm` y responsive no certifican estas plataformas. El estado correcto es **NO CERTIFICADO — LIMITACIÓN DEL ENTORNO**.

## Actualización posterior — descarga multiplataforma

La captura local ahora usa `shared/downloadCompat.ts`. En navegadores con `HTMLAnchorElement.download` se utiliza un enlace temporal con Blob y revocación diferida; en Safari iOS o navegadores sin soporte confiable se intenta abrir el Blob en una pestaña y, si el navegador bloquea esa apertura, se navega al recurso para que el usuario pueda guardarlo desde el menú nativo. La URL temporal permanece disponible 30 segundos para evitar que Safari o un WebView la pierdan antes de completar la acción.

Se añadieron pruebas de detección de Safari iOS, exclusión de Chromium iOS, estrategia de enlace en Android TV y fallback de pestaña/navegación. Estas pruebas son unitarias: **no certifican hardware físico**. La certificación de Safari iOS y Android TV todavía requiere ejecutar el flujo con dispositivos reales, registrar modelo/versión/red y comprobar guardar o compartir manualmente.

**Estado actualizado:** compatibilidad técnica con fallback implementada; certificación física Safari iOS/Android TV permanece NO CERTIFICADA.

## Evidencia de esta ejecución

Se inspeccionaron `/tv`, `/lukita-3d` y `/overlay/demo-round` en Chromium emulado a 1280×720 y `/tv`/`/lukita-3d` a 390×844. La navegación, el selector de modo TV, el panel de revisión y los controles principales se presentan sin overflow visible en esas capturas. Esta evidencia es de preview/emulación y **no equivale a una auditoría de hardware físico**.

El entorno disponible no incluye un iPhone/iPad con Safari iOS ni un dispositivo Android TV/Google TV con control remoto. En consecuencia, no se emiten certificados físicos ni resultados PASS para esas plataformas. La compatibilidad de descarga queda en estado `IMPLEMENTACIÓN CON FALLBACK / CERTIFICACIÓN FÍSICA PENDIENTE`.

## Actualización posterior — descarga y flujo multiplataforma

La descarga de imágenes del visor y del panel de estadísticas usa Blob y un fallback de navegación/apertura cuando el navegador no soporta `HTMLAnchorElement.download`, una ruta compatible con Safari iOS y navegadores de Android TV que no ofrecen descarga tradicional. Se añadieron pruebas unitarias para Safari iOS, Android TV y fallback.

La revisión responsive emulada del navegador sandbox fue satisfactoria para layout y disponibilidad del control, pero **no certifica hardware físico**. Safari iOS real requiere prueba en iPhone/iPad; Android TV requiere prueba en un dispositivo o emulador oficial con control remoto y almacenamiento accesible. No se deben afirmar compatibilidad ni descarga certificadas hasta ejecutar esas pruebas.
