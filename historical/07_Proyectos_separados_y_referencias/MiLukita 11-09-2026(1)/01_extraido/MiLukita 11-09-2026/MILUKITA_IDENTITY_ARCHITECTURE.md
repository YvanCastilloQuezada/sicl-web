# MiLukita Identity Architecture

## Estado

**Implementado parcialmente / Free foundation disponible / Premium preparado / Regulated bloqueado.** Esta documentación describe la implementación real; no convierte arquitectura preparada en operación productiva.

## Data Model Map

| Concepto | Tabla reutilizada o creada | Estado |
|---|---|---|
| Usuario base OAuth | `users` | Reutilizado |
| Milukita ID | `milukita_identities` | Implementado |
| Dispositivo separado de persona | `milukita_devices` | Implementado |
| Sesión de identidad/participación | `milukita_sessions` | Implementado |
| Contexto de evento QR | `milukita_event_contexts` | Implementado como persistencia contextual |
| ParticipationSession | `milukita_participation_sessions` | Implementado como entidad de sesión |
| Consentimientos | `milukita_consents` | Implementado |
| Analítica | `product_analytics_events` | Reutilizado; vocabulario adaptado mediante `funnelEvent` |
| Auditoría | `operational_events` | Reutilizado |
| Planes/suscripciones | `virtual_plan_enrollments`, placeholders existentes | Premium preparado, no activado |

`users.id` sigue siendo la relación interna. El identificador público de MiLukita es `milukita_identities.publicId`; no se utiliza email, teléfono ni dispositivo como identidad primaria.

## Flujo autorizado

`QR contextual → sesión pública/identidad → Milukita ID → sesión → elegibilidad server-side → ParticipationSession → APIs autorizadas de MJP CORE`.

Ningún agente obtiene acceso directo a las tablas protegidas de MJP CORE. Los fallos de Identity, QR, Analytics, Lukita o Premium no deben detener el núcleo.

## Límites

La autenticación efectiva existente continúa siendo Manus OAuth. No se inventó OTP real ni se conectó un proveedor de SMS/email. Premium permanece `DISABLED`, pagos `NOT_CONFIGURED` y la capa de dinero real/regulada `BLOCKED`. La arquitectura de consentimiento, dispositivo y sesión está preparada; la revisión profesional y las pruebas de staging persistente aún son necesarias.
