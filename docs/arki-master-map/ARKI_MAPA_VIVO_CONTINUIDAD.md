# ARKI — MAPA VIVO DE CONTINUIDAD

> BOOTSTRAP — 2026-10-13. Este archivo inicial será reemplazado por el generador automático cuando GitHub Actions ejecute correctamente. **NO declarar automatización verificada hasta comprobar el workflow.**

## Punto de entrada del próximo chat
ARKI/ARQUI = arquitectura cognitiva de dominio del entorno construido; sistema multiescala 3D-First con Core/D-2/AGK como autoridad canónica, razonamiento, memoria, representación y Human Authority. No duplicar Event Store ni estados canónicos. NO EVIDENCE = NO GREEN.

## Prioridad P0 del propietario
**Continuidad histórica permanente** antes de seguir ampliando módulos, autoevaluación o automejora. Cada decisión, avance, bloqueo y evidencia debe alimentar el mapa, y el siguiente chat debe comenzar leyendo este archivo y el ledger.

## Fuentes
1. `docs/arki-master-map/ARKI_CONTINUITY_EVENTS.jsonl`: bitácora de decisiones y acciones declaradas; no reemplaza Event Store Core.
2. `tools/maqueta-viva/arki-continuity-snapshot.cjs`: generador desde bitácora + últimos commits Git.
3. `.github/workflows/arki-continuity-map.yml`: regeneración en push de la rama de trabajo y por disparo manual; **ejecución aún no verificada**.
4. `docs/arki-master-map/ARKI_M10_001_MACROORDERS.md`: ruta de macroórdenes.
5. `docs/arki-master-map/ARKI_BOLSA_IDEAS_CRONOLOGIA_BIC_007.md` y `ARKI_BOLSA_IDEAS_DOBLE_FECHA_ESTADO_BIC_008.md`: genealogía y fechas.

## Estado actual
- Bolsa de Ideas: 44 de 189 ramas no-main comparadas, 145 pendientes.
- Pulso de salud read-only en `feat/arki-live-readonly-pulse-20261013`: código y tests escritos; CI no verificado.
- Automatización de continuidad: código y workflow escritos; **no ejecutado ni validado en este reporte**.
- Core/D-2/AGK, CI exacto y despliegue: NOT_VERIFIED.
- Prohibido confundir documento de continuidad con memoria arquitectónica canónica.

## Pendientes inmediatos
- Ejecutar workflow y comprobar que actualiza este mapa sin bucle.
- Incorporar eventos de cada decisión futura a JSONL con fuente y fecha; no asumir que ChatGPT escribe automáticamente sin ejecutar herramienta.
- Verificar que un chat nuevo puede recuperar y leer este archivo.
- Extender captura de eventos a otros repos y al Core respetando ownership.

## Reconciliación documental — 2026-10-17

> Actualización documental manual en rama de auditoría, basada en la bitácora existente y GitHub. **No es una ejecución del generador, una promoción canónica ni una certificación de CI.** El generador oficial podrá reemplazar este bloque cuando se ejecute y verifique.

- **Rama fuente inspeccionada:** `feat/arki-integration-genealogy-20261013`; HEAD `b0a37f1b3f063b66c6f0fcf1ac2cc8ebb4c17ea4` (commit del 2026-10-14 01:18:01 UTC). Sin commits posteriores al corte de revisión del 2026-10-15.
- **Bitácora documental:** `ARKI_CONTINUITY_EVENTS.jsonl` en esta rama de auditoría incluye `CONT-20261014-011` (dos commits previamente identificados) y `CONT-20261014-012` (bloqueo de CI anterior a ejecutar pasos). No se agregan eventos duplicados en esta revisión.
- **IMPLEMENTED:** lanzador Ubuntu de validación local, generador del mapa y workflow presentes en la rama fuente. Su presencia no acredita operación.
- **EXECUTED:** los runs de GitHub Actions `38494969069` (ARKI Continuity Map) y `38494969097` (SICL Web CI) terminaron en `failure`; sus jobs muestran `runner_id=0` y cero pasos. No hay evidencia de ejecución de las suites.
- **VERIFIED:** identidad del SHA remoto, existencia de los archivos de continuidad, estados y metadatos de esos runs y situación del PR #59 (abierto, borrador, sin fusionar), consultados en GitHub el 2026-10-17.
- **UNKNOWN:** causa exacta de la falta de runner, validación local por SHA en ARKI-02 y aptitud para promoción canónica.
- **BLOQUEOS:** recuperar CI o evidencia local atribuible al SHA exacto; validar el generador y regenerar determinísticamente el mapa antes de fusionar el PR #59.

**Límites:** ninguna modificación de Core, D-2, AGK, FROZEN o Event Store canónico. No se atribuye aprobación del propietario ni resultado de prueba inexistente.

**Evidencia:** [commit fuente](https://github.com/YvanCastilloQuezada/sicl-web/commit/b0a37f1b3f063b66c6f0fcf1ac2cc8ebb4c17ea4) · [run de continuidad](https://github.com/YvanCastilloQuezada/sicl-web/actions/runs/38494969069) · [run CI](https://github.com/YvanCastilloQuezada/sicl-web/actions/runs/38494969097) · [PR #59](https://github.com/YvanCastilloQuezada/sicl-web/pull/59).
