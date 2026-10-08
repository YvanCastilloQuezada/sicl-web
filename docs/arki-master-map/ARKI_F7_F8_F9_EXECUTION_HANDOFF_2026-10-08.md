# ARKI — F7 → F8 → F9 | Handoff de ejecución

**Corte:** 2026-10-08 · **Rama:** `feat/f7-f8-integral-closure` · **Estado:** IMPLEMENTED_PARTIAL / EXECUTION_VERIFICATION_PENDING

## Autoridad y alcance

- F6: `FROZEN` en su frontera demostrada; no reabrir ni reescribir contratos.
- F7: `IN_PROGRESS`, `IMPLEMENTATION_PRESENT_EXECUTION_VERIFICATION_PENDING`.
- F8: `IN_PROGRESS`, `DERIVED_DOSSIER_CONTRACT_IMPLEMENTED_EXECUTION_VERIFICATION_PENDING`.
- F9: `RECONCILIATION_REQUIRED`, `NOT_YET_RECONCILED`.
- D-2 = autoridad semántica, AGK = autoridad geométrica operacional, Core = autoridad de estado canónico.
- Ningún borrador de Maqueta Viva ni contrato F9 constituye una aceptación profesional, autorización de obra o integración canónica.

## Cambios de este corte

### F7 — integridad de entrada

`server/arkiProfessionalState.ts` ahora comprueba la huella de `BASELINE_0` antes de construir el estado coordinado y rechaza IDs duplicados de proyecciones e incidencias. Esto impide aceptar sin aviso una línea base alterada después de su creación.

**Pruebas añadidas:** línea base alterada, proyecciones duplicadas, incidencias duplicadas.

### F8 — dossier trazable

`server/arkiTechnicalDossier.ts` ahora exige un F7 internamente consistente, ID de expediente, IDs únicos de artefactos y comprueba la integridad del expediente y su pertenencia al proyecto al verificar la cadena de procedencia.

**Pruebas añadidas:** artefactos duplicados, estado F7 alterado, expediente alterado.

### F9 — contrato de campo acotado

`server/arkiF9ConstructionLineage.ts` establece un candidato de línea base de obra derivado de F7 aceptado y F8 con procedencia verificada. Exige referencia de liberación profesional declarada. Admite lotes de observaciones de obra con identidad, fecha, fuente, procedencia y referencia al mismo proyecto/baseline. Las discrepancias quedan en revisión; ninguna observación escribe al Core, AGK, D-2 o F8.

**Pruebas añadidas:** rechazo de F7 no aceptado, F8 alterado, liberación ausente, duplicados, procedencia ajena, revisión sin evidencia e integridad de lotes.

**No demostrado:** importación de expediente profesional real, autenticidad de firmas, captura física, precisión AR/GPS, replanteo, as-built validado, sincronización remota, aceptación de especialista o ejecución E2E real de F9. No declarar F9 implementada integralmente.

## Puertas para continuar

| Frente | Próxima prueba decisiva | Estado |
|---|---|---|
| F7 | Ejecutar suite exacta y un espécimen profesional real; contrastar BASELINE_0, geometría, disciplinas y evidencia | PENDING |
| F8 | Generar expediente desde F7 aceptado; contrastar artefactos reales y firma profesional | PENDING |
| F9 | Reconciliar fuentes existentes de obra y campo; validar captura y correspondencia design→field→review sin mutación automática | PENDING |
| Maqueta Viva | CI offline smoke, observador GitHub mock y captura E3 Windows con flujo F1–F10/vertebral/espinas | PENDING |

## Regla de avance

`CLAIM != IMPLEMENTED != EXECUTED != VERIFIED != FROZEN`.

No se cambia `roadmap.phases[].status` por este corte. Si CI falla, diagnosticar y corregir antes de afirmar verde. El trabajo continúa en la rama, no en `main`.
