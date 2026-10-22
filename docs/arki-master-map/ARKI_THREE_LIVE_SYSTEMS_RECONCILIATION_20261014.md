# ARKI — Reconciliación de los tres sistemas vivos (2026-10-14)

Estado: INSPECCIÓN ESTÁTICA / SIN PRUEBAS DE RUNTIME / SIN PROMOCIÓN CANÓNICA.

## Dictamen: reutilizar antes de desarrollar

No crear otro Árbol Vivo, otro Gemelo, otro Mapa Vivo, otro ADN ni otro orquestador. La interfaz existente `maqueta-viva.template.html` contiene `arkiDependencyTopology()`, `arkiConstructionWaves()`, `arkiDecisionDocket()`, `arkiProposalExperiment()` y `scopedPredictivo()`. El puente `arki-map-adn-bridge.cjs` lee estado del Mapa Maestro. `arki-autonomy-orchestrator.cjs` solo planifica (`PLAN_ONLY`). `arki-adn-mejora-continua.cjs` propone A1/A2 hipotéticas y no ejecuta ensayos. El documento `ARBOL-GEMELO-DIGITAL.md` describe `twinThreeAlternatives()` A/B/C documentales, pero esa función NO está presente en la plantilla HTML inspeccionada en la rama de autonomía. Esta divergencia debe resolverse por historia Git y pruebas, no suponiendo funcionalidad.

## Propiedad de datos y responsabilidades

| Dominio | Autoridad propuesta | Rol |
|---|---|---|
| Mapa Maestro Vivo | `docs/arki-master-map/ARKI_MASTER_MAP_STATE.json` + fuentes verificadas | Fases, roadmap, evidencias y reconciliación. No interpretar JSON histórico como estado runtime |
| Árbol Vivo | Estado y contratos de `maqueta-viva.template.html` | Capacidades, ramas, antecedentes, selección y bandeja del propietario |
| Árbol Gemelo Digital | Observación/snapshots y escenario aislado de la misma fuente | Comparar alternativas sin mutar el árbol |
| ADN-MC / Delta 6.2 | `arki-adn-mejora-continua.cjs` + autoridad de aprendizaje existente | Detectar déficits y evaluar nueva evidencia; hipótesis no equivalen a aprendizaje |
| Orquestador | `arki-autonomy-orchestrator.cjs` | Coordinar investigación y propuestas; ejecución aún no demostrada |
| ACE88/Core | Contrato de autoridad del Core | Única vía de promoción autorizada según alcance |

## Reconciliación necesaria

1. Resolver discrepancia entre `twinThreeAlternatives()` documentado y la plantilla real, buscando implementación en historia Git antes de escribir una nueva.
2. Mantener `arkiProposalExperiment()` como cálculo documental existente; evitar atribuir sus cuatro ensayos de hitos a simulación real AGK o a todas las ideas.
3. Adaptar `arki-twin-three-alternatives.cjs` únicamente como contrato de presentación/validación de resultados, **no como segundo simulador**. No conectarlo hasta determinar contrato común de escenarios y evidencia.
4. Usar `arkiDependencyTopology()` y `arkiConstructionWaves()` como ruta de precedencias de UI. La cobertura de dependencias del registro de 51 elementos no puede sustituir dependencias guardadas en `reviews[id]`; reconciliar ambos orígenes.
5. Vincular cada propuesta con ideaId, fase, baseline, tres alternativas, recibos y revisión PO; medir únicamente lo realmente ensayado.
6. Mostrar al PO métricas simples, origen, incertidumbre y tres alternativas, dejando ejecución y promoción bloqueadas hasta autorización específica y pruebas.
7. Ejecutar tests de Node, E3 Windows, CI y Red Team sobre SHA exacto; luego verificar persistencia, replay y reinicio. No declarar cierre antes de evidencias.

## Reglas invariables

Un solo AGK, 3D-First, FROZEN, cero deudas; no inventar resultados, antecedentes ni capacidades. ARKI propone y coordina; PO elige. La autorización general de desarrollo no sustituye autorización específica de una alternativa ni la firma ACE88 aplicable.

**Resultado de esta auditoría:** el trabajo principal es de integración y reconciliación. Ningún merge, ejecución de experimentos ni cambio canónico se realizó aquí.
