# 08 — Modelo de datos

## Núcleo de identidad

`users` representa usuarios autenticados y su rol base. `milukita_identities` representa identidad pública/estado de verificación. `milukita_devices` y `milukita_sessions` representan dispositivos y sesiones. Consentimientos, contexto de evento y participación se almacenan por separado.

## Territorial Trust

`WorldObject` es la unidad territorial principal. Claims, Sources y Evidence se relacionan con el objeto. Assets guardan solo metadata y referencia S3; los bytes no deben almacenarse en la base. CaptureSession agrupa capturas. Snapshots conservan estados históricos. VerificationReview registra decisiones The Eye. OfflineCapture conserva payload local, versión base y conflictos. AuditEvents encadena operaciones.

## Controller/TV

Controller sessions y commands registran vínculo, rol, modo y comandos. Shared profiles/presets guardan configuración; no deben contener secretos del núcleo. TV contracts/manifests proyectan estado o describen capacidades.

## Autoría y eliminación

Crear/modificar/eliminar depende del procedimiento server-side y del rol. Runtime debe leer únicamente objetos publicados. Assets tienen scopes `ADMIN_ONLY`, `REVIEW_ONLY` o `PUBLISHED_RUNTIME`. Todo cambio territorial relevante debe producir audit event y, cuando corresponde, snapshot.

**Fuente:** `drizzle/schema.ts`, `server/territorialTrust.ts`, `shared/territorialTrust.ts`.
