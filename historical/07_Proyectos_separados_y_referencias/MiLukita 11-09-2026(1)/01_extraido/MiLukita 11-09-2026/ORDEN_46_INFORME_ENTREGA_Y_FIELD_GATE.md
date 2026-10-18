# Informe de entrega y preparación Field Gate

**Proyecto:** MiLukita / Ruleta Perú Online  
**Orden:** 46  
**Fecha:** 2026-09-01  
**Estado de la evidencia:** sandbox/preview; no sustituye la certificación física.

## Enlaces verificables

| Entregable | Enlace |
|---|---|
| Mapper + The Eye | https://3000-i2iir7cc4y7kro7s9cjv5-72fa419e.us4.manus.computer/mapper |
| The Eye | https://3000-i2iir7cc4y7kro7s9cjv5-72fa419e.us4.manus.computer/the-eye |
| QR Studio operativo de revisión | https://3000-i2iir7cc4y7kro7s9cjv5-72fa419e.us4.manus.computer/generador-qr |
| Visor QR circular de revisión visual | https://3000-i2iir7cc4y7kro7s9cjv5-72fa419e.us4.manus.computer/qr-circular-lukita |

## Cambios implementados en la orden 46

El generador QR permite guardar y cargar plantillas favoritas de color, fondo, módulos, etiqueta, variante y logotipo local. El botón de favorito conserva la configuración en el navegador; el payload, la autoridad, la ronda y la firma permanecen fuera de la capa visual y no se editan desde este módulo.

El Field Voice Copilot muestra una transición breve y un mensaje de confirmación al cancelar. La cancelación detiene el reconocimiento/procesamiento pendiente, limpia el progreso y no persiste una observación parcial. La observación manual continúa disponible.

La galería protegida de evidencias S3 incorpora vista ampliada y controles anterior/siguiente que recorren únicamente el conjunto filtrado sin descargar el archivo automáticamente.

## QR entregado

El archivo SVG entregado corresponde al QR redondo visible en QR Studio y conserva módulos circulares, patrones de búsqueda circulares, color de módulos y marca central. El archivo PNG es una rasterización de la previsualización generada por la interfaz. Ambos son **artefactos de revisión**: el payload visible está marcado `REVIEW_ONLY` y no es un QR autoritativo emitido por MJP CORE.

## ¿Estamos listos para salir al campo?

**Respuesta sincera: listos para iniciar una prueba piloto controlada, no para declarar producción.** El software está listo para el Field Gate porque Mapper/The Eye, CaptureSession, offline queue, sincronización, resolución de conflictos, evidencias, filtros, exportaciones y auditoría están disponibles en sandbox/preview. La primera salida debe tratarse como una muestra de validación, con datos reales pero sin publicación automática.

Antes de afirmar que el sistema está certificado, todavía deben ejecutarse en Android/iOS reales y bajo HTTPS: permisos GPS y cámara, precisión observada, captura fotográfica, pérdida y recuperación de conectividad, descarga y lectura de mapas offline, lectura del QR desde la pantalla objetivo, reproducción del flujo de voz y sincronización posterior. También deben conservarse los reportes del protocolo físico, hashes de auditoría y decisiones de Human Authority.

## Límites y controles

No se ejecutó publicación, pago, participación, modificación de RNG, Wallet, Rules, ledger, settlement ni ninguna ruta de MJP CORE. The Eye recomienda y revisa; solo Human Authority puede aprobar publicación. La ruta `/qr-circular-lukita` es exclusivamente visual y no debe usarse como QR operativo de una ronda.

## Criterio de salida recomendado

Se puede salir al campo con dos dispositivos registrados, consentimiento para ubicación/cámara, una sesión CaptureSession nueva, red inicialmente disponible y un operador que pueda conservar evidencias. No se debe publicar la primera muestra hasta que The Eye y Human Authority revisen el expediente, verifiquen la procedencia de las evidencias y confirmen la cadena SHA-256.
