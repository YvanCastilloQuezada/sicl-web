# 05 — Mapa de módulos

| Módulo | Fuente | Clasificación | Dependencia principal |
|---|---|---|---|
| Portal | `Home.tsx`, `App.tsx` | IMPLEMENTED UI | assets, router, theme |
| QR Lab | `QrGeneratorPage.tsx`, `customQrGenerator.ts` | IMPLEMENTED parcial | QR library, Web Share, localStorage |
| L★ | `Home.tsx`, QR routes | IMPLEMENTED UI | deep link/route |
| Identity | `milukitaIdentities`, auth | IMPLEMENTED | OAuth, DB |
| Mapper | `TerritorialFieldEntryPage.tsx`, `TerritorialTrustPage.tsx` | IMPLEMENTED parcial | auth, GPS, camera, S3 |
| The Eye | territorial review surface | IMPLEMENTED parcial | auth, evidence, RBAC |
| World Engine | `territorialTrust.ts` | IMPLEMENTED backend | DB, audit, snapshots |
| Field Gate | `fieldGateReports.ts`, docs | IMPLEMENTED protocol | devices, HTTPS, human |
| LUKA AR | `LukitaARStagePage.tsx` | PROTOTYPE | Three, GLB, WebXR |
| Controller Lab | `TouchRemotePage.tsx` | SIMULATED/PARCIAL | sessions, WebSocket, receiver |
| LUKA TV | TV pages/contracts | SIMULATED/PARCIAL | Cast/DLNA, receiver |
| Voice Copilot | pilot console/voice APIs | PARCIAL | browser speech, audio permission |
| Agents | `agentRegistry.ts`, agent modules | CONTRACTUAL/PARCIAL | contracts, tests |
| MJP CORE | rules/RNG/wallet/manifest | PROTECTED | core boundaries |

No debe deducirse implementación productiva solo por el nombre del módulo o por una pantalla visible.
