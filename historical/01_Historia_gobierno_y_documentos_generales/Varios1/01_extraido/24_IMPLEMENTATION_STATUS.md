# 24 — Estado de implementación

| Estado | Significado | Ejemplos |
|---|---|---|
| IMPLEMENTED | Código/persistencia/procedimiento verificable | WorldObject CRUD, RBAC territorial, snapshots, audit events |
| PARTIAL | Existe una parte, faltan integración o gates | QR Lab, AR, Voice Copilot, Controller Lab |
| SIMULATED | Preview, fixture o interfaz sin efecto externo demostrado | TV receiver, Cast/DLNA, ciertos demos |
| PENDING | Requiere trabajo posterior | Revisión visual completa, integraciones físicas |
| BLOCKED | No puede avanzar sin dependencia/decisión | Publicación sin Human Authority o hardware ausente |
| EXTERNAL_REQUIRED | Depende de dispositivo/proveedor/red/dominio | GPS, cámara, WebXR, Cast, DNS, QR físico |
| REQUIRES_HUMAN | Depende de aprobación/juicio humano | source review, publication, field gate |
| NOT_VERIFIED | Código existe pero no se observó el flujo requerido | compatibilidad de navegador, producción real |
| DEPRECATED | Superficie que no debe tratarse como fuente vigente | aliases estáticos o páginas antiguas si el router ya las reemplaza |

## Dictamen por dominio

Territorial backend: IMPLEMENTED. Territorial field UX: PARTIAL/EXTERNAL_REQUIRED. QR: PARTIAL. AR: PARTIAL/EXTERNAL_REQUIRED. Controller/TV: SIMULATED/PARTIAL. MJP CORE boundary: IMPLEMENTED as contract/tests. Public production: NOT_VERIFIED until release smoke test.
