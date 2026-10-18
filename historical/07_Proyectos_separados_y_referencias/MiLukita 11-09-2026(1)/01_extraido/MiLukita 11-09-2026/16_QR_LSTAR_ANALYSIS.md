# 16 — QR y L★

## L★

L★ es una entrada visual de marca. Puede actuar como acceso al QR Lab, Portal o centro de compartir según la ruta/configuración. Un tap/long press es una interacción UI; no debe confundirse con login, autorización o publicación.

## Tipos

- **QR público:** URL sin credenciales para una superficie pública.
- **QR contextual:** contiene contexto/entrada, no autoridad.
- **QR de experiencia:** deep link a AR, TV o Portal.
- **QR de sesión:** vincula un dispositivo/sesión y requiere expiración, revocación y controles server-side.
- **QR Lab:** editor de forma, color, logo, plantilla y exportación.
- **Share Center:** Web Share, correo, WhatsApp o fallback de enlace/descarga.

## Seguridad

Payloads no deben contener contraseñas, JWT, tokens privados ni secretos. Un QR no autoriza por sí mismo. Sesión/rol se validan server-side.

## Estado real

El generador circular, color, logo, presets y exportación existen en frontend. La revocación de todos los QR y la administración de campañas requieren API/persistencia adicional. Escaneo en TV/celular y compatibilidad de cámara son EXTERNAL_REQUIRED.

**Fuentes:** `client/src/pages/QrGeneratorPage.tsx`, `client/src/lib/customQrGenerator.ts`, `shared/circularQr.ts`.
