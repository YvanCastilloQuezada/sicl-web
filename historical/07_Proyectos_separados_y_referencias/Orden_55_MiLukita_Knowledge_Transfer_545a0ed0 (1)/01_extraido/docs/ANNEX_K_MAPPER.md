# 12 — Análisis de Mapper

## Propósito
Mapper captura realidad territorial para producir objetos, claims, observaciones y evidencia que posteriormente pueden ser revisados.

## Puede hacer

Crear/editar WorldObjects en estados permitidos, abrir CaptureSession, registrar coordenadas y precisión, adjuntar Claims/Evidence, subir assets con hash, trabajar con cola offline, sincronizar y consultar historial permitido.

## No puede hacer

No puede verificar definitivamente, publicar, saltar el gate Human Authority, resolver conflictos reservados a Eye/HA, ni modificar MJP CORE. No debe tratar una observación o foto como verdad publicada.

## Dependencias

Auth/RBAC, GPS, cámara, HTTPS, S3, Service Worker, DB, resolución de conflictos y dispositivo móvil.

## Estado

Backend: IMPLEMENTADO. UI de campo: IMPLEMENTADO PARCIAL según la ruta. Captura física y permisos reales: EXTERNAL_REQUIRED. Calidad de UX contra maqueta: NO_VERIFICADO en cada versión pública.

**Fuentes:** `server/territorialTrust.ts`, `TerritorialFieldTools.tsx`, `TerritorialTrustPage.tsx`, `drizzle/schema.ts`.
