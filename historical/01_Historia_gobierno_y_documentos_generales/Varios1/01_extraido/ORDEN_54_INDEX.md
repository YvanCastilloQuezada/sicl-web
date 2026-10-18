# ORDEN 54 — Índice de ingeniería inversa

## Documento principal

- [Informe completo de ingeniería inversa](ORDEN_54_INGENIERIA_INVERSA_MILUKITA.md)
- [Inventario de archivos](30_MILUKITA_FILE_INVENTORY.md)

## Entregables canónicos

1. [Resumen ejecutivo](01_MILUKITA_EXECUTIVE_SUMMARY.md)
2. [Definición](02_MILUKITA_DEFINITION.md)
3. [Organigrama](03_MILUKITA_ORGANIGRAM.md)
4. [Arquitectura maestra](04_MILUKITA_MASTER_ARCHITECTURE.md)
5. [Mapa de módulos](05_MILUKITA_MODULE_MAP.md)
6. [Flujos](06_MILUKITA_USER_FLOWS.md)
7. [Máquinas de estado](07_MILUKITA_STATE_MACHINES.md)
8. [Modelo de datos](08_MILUKITA_DATA_MODEL.md)
9. [Mapa de APIs](09_MILUKITA_API_MAP.md)
10. [Mapa de eventos](10_MILUKITA_EVENT_MAP.md)
11. [LUKA Copilot](11_LUKA_COPILOT_ANALYSIS.md)
12. [Mapper](12_MAPPER_ANALYSIS.md)
13. [The Eye](13_THE_EYE_ANALYSIS.md)
14. [World Engine](14_WORLD_ENGINE_ANALYSIS.md)
15. [LUKA AR](15_LUKA_AR_ANALYSIS.md)
16. [QR y L★](16_QR_LSTAR_ANALYSIS.md)
17. [TV/Remote](17_TV_REMOTE_ANALYSIS.md)
18. [Agentes](18_AI_AGENTS_ANALYSIS.md)
19. [Seguridad/RBAC](19_SECURITY_RBAC_ANALYSIS.md)
20. [Auditoría/Governance](20_AUDIT_GOVERNANCE_ANALYSIS.md)
21. [Mapa MJP CORE](21_MJP_CORE_DEPENDENCY_MAP.md)
22. [Dependencias](22_DEPENDENCY_MAP.md)
23. [Contradicciones](23_CONTRADICTIONS_REPORT.md)
24. [Estado de implementación](24_IMPLEMENTATION_STATUS.md)
25. [Requisitos de migración](25_MIGRATION_REQUIREMENTS.md)
26. [ADN MiLukita](26_MILUKITA_DNA.md)
27. [Manual de handover IA](27_MILUKITA_AI_HANDOVER.md)
28. [Invariantes](28_MILUKITA_INVARIANTS.md)
29. [Matriz de recuperación](29_MILUKITA_RECOVERY_MATRIX.md)

## Evidencia previa

- [Mapa de realidad anterior](ORDEN_48_MAPA_REALIDAD_AUDITORIA.md)
- [Reproducción de fallos públicos](orden52_public_failure_reproduction.md)
- [Hallazgos visuales](orden53_visual_findings.md)
- [Pruebas P0 de aislamiento](../shared/mjpCoreIsolation.test.ts)
- [Implementación Territorial Trust](../server/territorialTrust.ts)

## Clasificación final

Este paquete documenta; no modifica código ni despliega. Todo estado externo (hardware, HTTPS, DNS, WebXR, Cast/DLNA, permisos, S3 publicado y primera muestra de campo) queda marcado `EXTERNAL_REQUIRED`, `NO_VERIFIED` o `REQUIRES_HUMAN` donde corresponde.
