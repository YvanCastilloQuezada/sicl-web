# Orden 48 — requisitos externos y límites

Fuente: `/home/ubuntu/upload/pasted_content_48.txt`, documento entregado por el propietario.

La orden exige mantener MJP CORE absolutamente intacto, no desplegar todavía, no integrar TV todavía y no hacer búsqueda/reemplazo indiscriminado de nombres. Solicita implementar ahora —por autorización B posterior— únicamente: hash SHA-256 visible en informes y QR, panel de diagnóstico de GPS/cámara/micrófono y modo offline básico con Service Worker para QR y galería S3.

El informe de auditoría requerido debe separar ruta existente de funcionalidad y clasificar cada elemento como IMPLEMENTED, PARTIAL, MOCK, SIMULATED, NOT_IMPLEMENTED, NOT_VERIFIED, EXTERNAL_REQUIRED, REQUIRES_HUMAN o BLOCKED. Debe cubrir Portal, Mapper, The Eye, QR/L★, TV, portada LUKA, matriz general y bloqueadores reales.

La distinción de seguridad obligatoria es `QR → abre URL`, no `QR → concede autorización`. Toda acción sensible debe seguir AUTHENTICATION → RBAC → CAPABILITY → ACTION. El QR de Mapper o The Eye no puede conceder publicación, verificación, resolución de conflictos, Human Authority ni administración.

El documento también exige identificar por separado la realidad de Cast, DLNA/UPnP, Tizen, webOS, Android TV, Bluetooth, Wi-Fi, WebSocket, QR pairing y TV receiver, sin integrar esas tecnologías en esta orden.

Estado de conflicto: la prohibición general `NO IMPLEMENTAR TODAVÍA` fue dejada sin efecto únicamente para las tres mejoras por autorización B explícita del propietario. La auditoría del sistema sigue siendo obligatoria y no autoriza otras funciones.
