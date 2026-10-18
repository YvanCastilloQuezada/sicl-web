# 07 — Máquinas de estado

## WorldObject

`DRAFT → CAPTURED → UNDER_REVIEW → VERIFIED → PUBLISHED`; ramas `EVIDENCE_REQUIRED`, `DISPUTED`, `REJECTED`, `ARCHIVED`, `OUTDATED`. El backend aplica `canTransitionWorldObject` y bloquea ediciones en estados protegidos.

## Publicación

`UNPUBLISHED → PUBLISHED`; publicationStatus se mantiene separado del status epistemológico. **VERIFIED ≠ PUBLISHED**.

## CaptureSession

`DRAFT → ACTIVE → PAUSED → COMPLETED → ARCHIVED`.

## OfflineCapture

`OFFLINE → PENDING_SYNC → SYNCED`; divergencia de versión conduce a `CONFLICT`; rechazo queda `REJECTED`.

## Revisión

`REQUEST_EVIDENCE`, `VERIFY`, `DISPUTE`, `REJECT`, `ARCHIVE`; la transición depende del rol Eye Reviewer y de las reglas de estado.

## Identidad/sesión

Las tablas de identidad y sesión distinguen estado de verificación, dispositivo, expiración y cierre. El detalle exacto depende de las columnas de `drizzle/schema.ts` y de los procedimientos de auth.

## QR

Disponibilidad, payload, targetUrl, verifyUrl, firma y expiración son datos distintos. Un QR puede ser visualmente circular sin modificar su payload.

## AR

La UI separa inicialización, carga de módulo, carga de modelo, placeholder/fallback y estado interactivo. Esto no equivale a una máquina WebXR completa verificada en hardware.
