# 29 — Matriz de recuperación

| Elemento | Existe | Fuente | Implementado | Testeado | Recuperable | Dependencias | Riesgo | Estado |
|---|---:|---|---|---|---|---|---|---|
| Portal | Sí | `Home.tsx`, `App.tsx` | UI | parcial | Sí | assets/router | divergencia visual | PARTIAL |
| QR Lab | Sí | `QrGeneratorPage.tsx` | parcial | sí | Sí | QR/Web Share | payload/cámara | PARTIAL |
| L★ | Sí | Home/QR | UI | parcial | Sí | asset/deep link | función ambigua | PARTIAL |
| WorldObject | Sí | schema/server | sí | sí | Sí | DB/audit | migración | IMPLEMENTED |
| Claims/Sources/Evidence | Sí | schema/server | sí | sí | Sí | DB/S3/RBAC | calidad humana | IMPLEMENTED |
| CaptureSession | Sí | schema/server/UI | sí | sí | Sí | auth/offline | uso móvil | IMPLEMENTED |
| Offline queue | Sí | schema/server/SW | parcial | sí | Sí | browser/cache | pérdida/caché | PARTIAL |
| Conflict resolution | Sí | server/UI/tests | sí | sí | Sí | Eye/HA | decisión humana | IMPLEMENTED |
| Publication gate | Sí | server trust | sí | sí | Sí | HA | configuración RBAC | IMPLEMENTED |
| LUKA AR | Sí | `LukitaARStagePage.tsx` | prototipo | parcial | Sí | Three/GLB/WebXR | dispositivo | EXTERNAL_REQUIRED |
| Controller Lab | Sí | `TouchRemotePage.tsx` | parcial | parcial | Sí | WS/receptor | maqueta/TV | SIMULATED/PARTIAL |
| LUKA TV | Sí | TV pages/contracts | parcial | parcial | Sí | Cast/DLNA | hardware | EXTERNAL_REQUIRED |
| Voice Copilot | Sí | pilot/voice | parcial | focal | Sí | mic/voice | precisión | NOT_VERIFIED |
| Audit chain | Sí | server/audit | sí | sí | Sí | DB/hash | writes externos | IMPLEMENTED |
| MJP boundary | Sí | isolation tests | sí | sí | Sí | shared contracts | regresión | PROTECTED |
| Domain/HTTPS | parcial | deployment metadata | externo | no físico | sí | DNS/TLS | cache/provider | EXTERNAL_REQUIRED |

La matriz no afirma que un elemento de UI tenga el mismo nivel de recuperación que una tabla o un contrato server-side.
