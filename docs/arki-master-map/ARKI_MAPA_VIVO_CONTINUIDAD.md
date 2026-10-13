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
