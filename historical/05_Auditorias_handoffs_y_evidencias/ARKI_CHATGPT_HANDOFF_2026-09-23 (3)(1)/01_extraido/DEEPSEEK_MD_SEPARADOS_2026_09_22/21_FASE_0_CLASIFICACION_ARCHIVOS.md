# Fase 0 — Clasificación de archivos

**Baseline:** c62183a5904f02aa0a935572454a5a35f9d167aa

| Categoría | Criterio | Archivos |
|---|---|---|
| Producto | archivo del árbol de trabajo | `client/src/components/ArkiNavigator.tsx` |
| Producto | archivo del árbol de trabajo | `client/src/components/ArkiWorkspaceShell.tsx` |
| Producto | archivo del árbol de trabajo | `client/src/contexts/ProjectContext.tsx` |
| Producto | archivo del árbol de trabajo | `client/src/index.css` |
| Producto | archivo del árbol de trabajo | `client/src/modules/GeneratorModule.tsx` |
| Producto | archivo del árbol de trabajo | `scripts/test-navigator-layout.ts` |
| Producto | archivo del árbol de trabajo | `scripts/test-no-inherited-cleanup.ts` |
| Contrato | archivo del árbol de trabajo | `ARCHI_CONTROLES_FUNCIONALES_16_MODULOS.md` |
| Contrato | archivo del árbol de trabajo | `ARKI_ADDENDUM_E_COD_LUKA.md` |
| Contrato | archivo del árbol de trabajo | `ARKI_AUDITORIA_ACTUAL_DEEPSEEK.md` |
| Contrato | archivo del árbol de trabajo | `ARKI_CONTRATO_UI3A_CANVAS_CONTEXT_PANEL_V2.md` |
| Contrato | archivo del árbol de trabajo | `ARKI_CONTRATO_UI3A_CANVAS_SELECCION.md` |
| Contrato | archivo del árbol de trabajo | `ARKI_DEEPSEEK_CURRENT_AUDIT.zip` |
| Contrato | archivo del árbol de trabajo | `ARKI_DEEPSEEK_CURRENT_AUDIT/` |
| Contrato | archivo del árbol de trabajo | `ARKI_FLUJO_TRABAJO_Y_PANELES.md` |
| Contrato | archivo del árbol de trabajo | `ARKI_PROTOCOLO_DESBLOQUEO_TEMPORAL_Y_REBLOQUEO.md` |
| Contrato | archivo del árbol de trabajo | `ARKI_ROADMAP_CORPORATIVO_V1.md` |
| Contrato | archivo del árbol de trabajo | `ARKI_VEREDICTO_CONTRATO_UI3A_V2.md` |
| Contrato | archivo del árbol de trabajo | `ARKI_VEREDICTO_REVISION_UI3A.md` |
| Traspaso | archivo del árbol de trabajo | `DEEPSEEK_HANDOFF_2026_09_22.zip` |
| Traspaso | archivo del árbol de trabajo | `DEEPSEEK_HANDOFF_2026_09_22.zip.sha256` |
| Traspaso | archivo del árbol de trabajo | `DEEPSEEK_HANDOFF_2026_09_22/` |
| Traspaso | archivo del árbol de trabajo | `DEEPSEEK_MD_SEPARADOS_2026_09_22/` |
| Evidencia | archivo del árbol de trabajo | `FASE_0_AUDITORIA_REAL_2026-09-23.md` |
| Evidencia | archivo del árbol de trabajo | `FASE_0_CLASIFICACION_ARCHIVOS.md` |
| Evidencia | archivo del árbol de trabajo | `UI3A_DIFF.patch` |
| Evidencia | archivo del árbol de trabajo | `UI3A_EVIDENCE.zip` |
| Evidencia | archivo del árbol de trabajo | `UI3A_EVIDENCE.zip.sha256` |
| Evidencia | archivo del árbol de trabajo | `UI3A_MANIFEST.json` |
| Evidencia | archivo del árbol de trabajo | `UI3A_VERIFICATION_REPORT.md` |
| Producto | archivo del árbol de trabajo | `client/src/canvas/` |
| Evidencia | archivo del árbol de trabajo | `evidence/` |
| Producto | archivo del árbol de trabajo | `scripts/create-ui3a-manifest.sh` |
| Producto | archivo del árbol de trabajo | `scripts/run-fase0-audit.sh` |
| Producto | archivo del árbol de trabajo | `scripts/test-bim-selection.ts` |
| Producto | archivo del árbol de trabajo | `scripts/test-canvas-mount.ts` |
| Producto | archivo del árbol de trabajo | `scripts/test-context-panel.ts` |
| Producto | archivo del árbol de trabajo | `scripts/test-selection-info.ts` |
| Producto | archivo del árbol de trabajo | `scripts/test-wall-door-canvas.ts` |
| Producto | archivo del árbol de trabajo | `shared/arkiBimSelection.ts` |
| Producto | archivo del árbol de trabajo | `shared/arkiContextPanel.ts` |

## Recomendación

Los archivos bajo `client/src/`, `shared/` y `scripts/` deben revisarse como cambios de producto. Los documentos, contratos y paquetes deben permanecer separados del commit funcional o incorporarse en commits documentales independientes. Los ZIP, capturas generadas y logs deben permanecer fuera del commit de producto o entrar en un directorio de evidencia con una política explícita.

**Aprobación PO:** pendiente.
