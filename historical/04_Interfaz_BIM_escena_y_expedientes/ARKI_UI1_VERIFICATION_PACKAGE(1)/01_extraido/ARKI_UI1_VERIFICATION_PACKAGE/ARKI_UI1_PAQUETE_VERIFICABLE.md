# ARKI — Paquete verificable UI-1

**Fecha:** 22 de septiembre de 2026  
**Objetivo:** Entregar evidencia reproducible de la UI-1, no solo una afirmación de estado.

## Veredicto de alcance

La UI-1 queda en **IMPLEMENTED / VERIFIED en compilación y dominio / PENDING E2E formal automatizado**. La navegación manual del preview fue observada: gateway, entrada Usuario/Proyecto, shell, generación y contenido constructivo. No se declara autenticación productiva, exportación RVT/RFA ni aprobación legal.

## Archivos UI

- `client/src/App.tsx`
- `client/src/components/ArkiGateway.tsx`
- `client/src/components/ArkiWorkspaceShell.tsx`
- `client/src/pages/Home.tsx`
- `client/src/index.css`

## Artefactos de gobernanza

- `ARKI_ADR_TRANSICION_HOME_SHELL.md`
- `ARKI_MAPA_ACCESOS_PERFILES.md`
- `ARKI_MATRIZ_MODULOS_ROLES_ESTADO.md`
- `ARKI_BLOQUE_B_INVENTARIO_EXPORTACION.md`
- `ARKI_BLOQUE_C_WIREFLOWS_PRUEBAS.md`
- `ARKI_CONTRATO_UI_BIM_CORPORATIVO_V2.md`
- `ARKI_DECISION_BLOQUE_A_DEEPSEEK.md`

## Evidencia de compilación y dominio

El output original completo está en `evidence/terminal_full_output.txt`. El comando fue:

```bash
pnpm check && pnpm build
for f in scripts/test-constructive.ts scripts/test-professional.ts scripts/test-technical-dossier.ts scripts/test-serialization.ts scripts/test-wall-coherence.ts scripts/test-budget-reconciliation.ts scripts/test-recalculation.ts; do pnpm tsx "$f"; done
```

Resultado real: código de salida `0`.

Resumen observado:

| Área | Resultado |
|---|---:|
| TypeScript | PASS |
| Build Vite + server | PASS |
| Constructivo | 16 muros, 16 espacios, 72 columnas, 16 vigas, 4 losas, 72 cimentaciones, 320 ventanas, presupuesto S/ 4,672,910, duración 93 días |
| Profesional | 3 periodos, 480 clashes, 2 documentos CDE, 2 importaciones S10 |
| Expediente | readiness 50%, 7 especificaciones, 164 encofrados, 4 hallazgos RNE, 6 secciones |
| Serialización | PASS, round-trip completo |
| Coherencia de muros | PASS, 16 muros |
| Presupuesto | PASS, 60 partidas y reconciliación total |
| Recálculo | PASS, determinismo y cambios de mampara verificados |

## Limitaciones honestas

La suite de dominio no sustituye una suite E2E automatizada de navegador. Los perfiles locales no son autenticación. Las vistas 2D/3D son conceptuales. Clashes, CDE, aprobaciones y S10 son locales o referenciales. Revit/RVT/RFA y BCF productivo siguen pendientes.

## Regla para DeepSeek

El paquete permite revisar código, decisiones, matriz, wireflows y outputs reales. El veredicto formal de UI-1 debe distinguir `IMPLEMENTED`, `VERIFIED`, `E2E VERIFIED`, `PARTIAL` y `FUTURE REFERENCE`.
