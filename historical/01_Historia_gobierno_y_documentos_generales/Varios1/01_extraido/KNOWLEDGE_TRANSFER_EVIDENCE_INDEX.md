# KNOWLEDGE TRANSFER EVIDENCE INDEX

| ID | Afirmación | Fuente primaria | Evidencia secundaria | Clasificación |
|---|---|---|---|---|
| E-001 | Mapper captura territorio y evidencia | `client/src/components/TerritorialFieldTools.tsx` | `docs/12_MAPPER_ANALYSIS.md` | IMPLEMENTED/PARTIAL |
| E-002 | The Eye separa Claims, Sources y Evidence | `server/territorialTrust.ts` | `docs/13_THE_EYE_ANALYSIS.md` | IMPLEMENTED/PARTIAL |
| E-003 | VERIFIED no equivale a PUBLISHED | `shared/territorialTrust.ts` | `docs/07_MILUKITA_STATE_MACHINES.md` | DOCUMENTED/IMPLEMENTED |
| E-004 | Runtime usa conocimiento publicado | `server/territorialTrust.ts` | `docs/14_WORLD_ENGINE_ANALYSIS.md` | IMPLEMENTED/PARTIAL |
| E-005 | Human Authority conserva decisión final | `shared/territorialTrust.ts` | `docs/20_AUDIT_GOVERNANCE_ANALYSIS.md` | DOCUMENTED/REQUIRES_HUMAN |
| E-006 | QR no es autorización | `shared/circularQr.ts` | `docs/16_QR_LSTAR_ANALYSIS.md` | IMPLEMENTED/DOCUMENTED |
| E-007 | Copilot no publica ni verifica verdad | `client/src/components/TerritorialPilotConsole.tsx` | `docs/11_LUKA_COPILOT_ANALYSIS.md` | IMPLEMENTED/PARTIAL |
| E-008 | MJP CORE está aislado | `shared/mjpCoreIsolation.test.ts` | `docs/21_MJP_CORE_DEPENDENCY_MAP.md` | PROTECTED |
| E-009 | AR tiene carga GLB y fallback | `client/src/pages/LukitaARStagePage.tsx` | `docs/15_LUKA_AR_ANALYSIS.md` | PARTIAL/SIMULATED |
| E-010 | Remote TV es UI y no prueba receptor | `client/src/pages/TouchRemotePage.tsx` | `docs/17_TV_REMOTE_ANALYSIS.md` | UI_ONLY/EXTERNAL_REQUIRED |
| E-011 | Auditoría usa snapshots, hashes y decisiones | `server/territorialTrust.ts` | `docs/20_AUDIT_GOVERNANCE_ANALYSIS.md` | PARTIAL |
| E-012 | Migración necesita secretos y servicios externos | `docs/25_MIGRATION_REQUIREMENTS.md` | `KNOWLEDGE_TRANSFER_GAP_REPORT.md` | EXTERNAL_REQUIRED |

## Regla de evidencia

La presencia de un archivo o test demuestra que existe una implementación o contrato en el repositorio; no demuestra que la capacidad funcione en todos los dispositivos, que los datos sean verdaderos, que exista producción o que una dependencia externa esté configurada. Estas inferencias requieren evidencia adicional y se clasifican como NOT_VERIFIED, REQUIRES_HUMAN o EXTERNAL_REQUIRED.
