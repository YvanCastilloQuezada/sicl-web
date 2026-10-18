# Verificación de rutas Orden 46

Fecha de verificación: 2026-09-01.

La URL base de preview verificada es `https://3000-i2iir7cc4y7kro7s9cjv5-72fa419e.us4.manus.computer`.

| Interfaz | URL verificada | Resultado observado |
|---|---|---|
| Mapper + The Eye | `/mapper` | Carga en navegador y muestra la superficie territorial autenticada. Se observan `Nuevo WorldObject`, sincronización, cola offline, CaptureSession, importación CSV/GeoJSON, RBAC, filtros, exportaciones, galería, Field Voice Copilot y protocolo físico. La sesión verificada mostró rol HUMAN_AUTHORITY por rol admin y 0 objetos/evidencias/reportes; no se inventan datos. |
| The Eye | `/the-eye` | Ruta integrada al mismo `TerritorialTrustPage`; requiere autenticación y permisos territoriales para acciones sensibles. La separación Mapper/The Eye se muestra en la interfaz y en el RBAC. |
| QR Studio | `/generador-qr` | Carga en navegador. Expone QR redondo/cuadrado, colores de acento/fondo/módulos, presets, favorito, logo central, descargas SVG/PNG, compartir QR redondo, simulación de escaneo y marco exportable. El payload visible está marcado `REVIEW_ONLY`. |
| QR circular | `/qr-circular-lukita` | Ruta registrada como `CircularQrPreviewPage`; requiere verificación visual independiente si se necesita certificar cada botón de esa variante. |

Límites: esta evidencia comprueba accesibilidad y controles visibles en preview; no certifica permisos GPS/cámara/micrófono, Web Share, escaneo de cámara, offline físico ni conectividad desde una red externa. No se realizó publicación, autorización ni modificación de MJP CORE.


La previsualización visual confirmó un QR circular con módulos circulares, patrones de búsqueda circulares y marca central L; la pantalla muestra los controles `Descargar QR SVG`, `Descargar QR PNG`, `Compartir QR redondo`, `Marco SVG`, `Marco PNG`, simulador de lectura y selector de forma round/square. La versión verificada actual es `/generador-qr`; la pantalla `/qr-circular-lukita` es una variante separada registrada en el enrutador.


La ruta `/qr-circular-lukita` carga y muestra tres variantes visuales con botones SVG/PNG, pero su propio aviso la clasifica como `Preview / Review — no es un QR operativo`; usa payload de demostración `REVIEW_ONLY`, no está firmado y no concede participación. Por ello, el enlace operativo para configurar QR es `/generador-qr`, mientras que `/qr-circular-lukita` es solo revisión artística.


En la verificación del 2026-09-01, `/generador-qr` expone y permite accionar `Descargar QR SVG`, `Descargar QR PNG`, `Compartir QR redondo`, `Marco SVG` y `Marco PNG`. La descarga SVG produjo archivos locales `milukita-live.svg` y copias numeradas en el navegador. La ruta `/qr-circular-lukita` se mantiene explícitamente como preview `REVIEW_ONLY`, no como QR autoritativo.
