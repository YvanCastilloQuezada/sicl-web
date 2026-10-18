# 01 — MiLukita: resumen ejecutivo

## Dictamen
MiLukita es un ecosistema fullstack en desarrollo que combina identidad, experiencias LUKA, QR, AR/WebXR, TV, Controller Lab, captura territorial y gobernanza. La base de datos, los contratos y varios servicios territoriales existen; no todas las maquetas, integraciones externas ni experiencias visuales equivalen a operación productiva.

## Estado real

| Área | Estado | Evidencia |
|---|---|---|
| Territorial Trust | IMPLEMENTED | `server/territorialTrust.ts`, `shared/territorialTrust.ts` |
| Mapper/The Eye | IMPLEMENTED backend; UX variable | `TerritorialTrustPage.tsx`, RBAC y tests |
| QR Lab | IMPLEMENTED parcial | `QrGeneratorPage.tsx`, `customQrGenerator.ts` |
| LUKA AR | PROTOTIPO IMPLEMENTED | `LukitaARStagePage.tsx`, Three.js, GLB/fallback |
| Controller/TV | SIMULADO/PARCIAL | `TouchRemotePage.tsx`, contratos de sesión |
| MJP CORE | PROTEGIDO | `shared/mjpCoreIsolation.test.ts` |
| Campo real | EXTERNAL_REQUIRED | permisos, Android/iOS, GPS, cámara, micrófono, offline |

## Conclusión
El estado defendible es **CODE_READY_WITH_EXTERNAL_GATES**, no `PRODUCTION READY`. La publicación, la verificación humana territorial y el primer Field Gate son decisiones separadas del hecho de que el código compile.

## Riesgos principales

La divergencia entre rutas, cache del Service Worker, assets GLB, maquetas y superficies administrativas puede producir una experiencia aparentemente vacía o funcionalmente irrelevante. QR no equivale a autorización; UI no equivale a integración; test no equivale a producción.

## Invariantes

MJP CORE no se modifica. `VERIFIED` no equivale a `PUBLISHED`. Solo Human Authority publica. Runtime consume únicamente datos publicados. LUKA/Copilot no verifica verdad, no publica y no resuelve conflictos.

**Fuentes:** [Informe de ingeniería inversa](ORDEN_54_INGENIERIA_INVERSA_MILUKITA.md), [aislamiento P0](../shared/mjpCoreIsolation.test.ts), [trust territorial](../server/territorialTrust.ts).
