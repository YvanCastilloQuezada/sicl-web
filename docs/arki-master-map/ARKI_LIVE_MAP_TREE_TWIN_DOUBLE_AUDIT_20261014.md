# ARKI — Reconciliación Mapa Vivo / Árbol Vivo / Árbol Gemelo Digital

Fecha: 2026-10-14. Estado: **AUDITORÍA ESTÁTICA DOBLE / SIN EJECUCIÓN E3 / SIN MERGE**.

## Alcance y fuentes

- `feat/arbol-vivo-autoensamblaje-20261011` @ `a589edad859569d2fc6349e6e6089b666774ddeb`.
- `feat/arki-autonomy-orchestrator-20261013` @ `ec02c8cea4d7bcdb53707eaad995f5e3d333acc6`.
- `sicl-core/feat/ace88-core-service-auth`: autorización ACE88 y un generador observacional de mapa añadido recientemente.
- Fuentes primarias: `docs/arki-master-map/ARKI_MASTER_MAP_LIVE.md`, `ARKI_MASTER_MAP_STATE.json`, `tools/maqueta-viva/ARBOL-GEMELO-DIGITAL.md`, `arki-arbol-vivo-auto.cjs`, `arki-map-adn-bridge.cjs`, `arki-assembly-planner.cjs`, `arki-autonomy-{orchestrator,memory,macro-orders}.cjs`, `arki-adn-mejora-continua.cjs`.

## Pasada 1: inventario y autoridad

1. **Mapa Maestro Vivo ya existe** y se autodeclara punto canónico de continuidad multirrepositorio. No crear otro.
2. **Árbol Vivo** contiene fases F1–F10, inventario y ordenamiento topológico con avisos de ciclos y dependencias desconocidas. Su prioridad es heurística, no rendimiento medido.
3. **Árbol Gemelo Digital** expone Árbol, Cerebro relacional y proyección 3D conceptual; no equivale a geometría AGK ni simulación física.
4. **Puente Mapa–ADN** es de solo lectura, requiere SHA fuente y no promociona capacidades.
5. El estado maestro contiene `updated_at=2026-10-07`, F1–F4/F9/F10 por reconciliar, F6 FROZEN documental, F7/F8 en progreso. Es un snapshot histórico, no verificación al 14/10.
6. **Riesgo de duplicación:** `sicl-core/tools/arki_mapa_vivo.py` añadido en octubre 2026. No integrarlo ni extenderlo como autoridad. Proponer eliminación controlada después de comprobar referencias y pruebas; no eliminar sin análisis de impacto.

## Pasada 2: contratos, ramas y seguridad

1. GitHub compare: `feat/arki-autonomy-orchestrator-20261013` respecto de `feat/arbol-vivo-autoensamblaje-20261011` está **DIVERGED**, 9 commits adelante y 1 atrás. Diferencias visibles incluyen seis archivos de orquestación/memoria/pruebas y un workflow modificado. En comparación inversa aparece `00_START.md` modificado. **No fast-forward ni merge automático.**
2. `arki-autonomy-orchestrator.cjs` devuelve `mode=PLAN_ONLY`, `execution=NOT_EXECUTED`, `canonicalMutation=false`.
3. `arki-autonomy-memory.cjs` valida cadena SHA-256 de eventos pero declara `storage=NOT_PERSISTED_BY_THIS_MODULE`. Un hash encadenado no demuestra persistencia ni autenticidad externa.
4. `arki-autonomy-macro-orders.cjs` admite `AUDIT_AND_PLAN` y `REASSESS`; devuelve `PLAN_AND_JOURNAL_ONLY`, no ejecuta correcciones.
5. `arki-adn-mejora-continua.cjs` propone objetivos hipotéticos y exige recibo externo para evaluación. No es prueba de mejora real ni aprendizaje validado.
6. `arki-assembly-planner.cjs` detecta ciclos, faltantes y bloqueos propagados. **No duplicar este algoritmo** en otro lenguaje sin justificación.
7. El acoplamiento real del gate ACE88 con el flujo de promoción del Árbol Vivo no está demostrado en esta revisión.
8. No se ejecutaron suites locales, E3 Windows, CI de ambos HEAD, restauración de journal ni pruebas criptográficas integradas; todas esas verificaciones siguen pendientes.

## Dictamen de no duplicación

- **Autoridad de estructura:** `sicl-web/docs/arki-master-map/ARKI_MASTER_MAP_STATE.json` bajo sus controles de evidencia; no replicar estado canónico en Core.
- **Presentación:** Maqueta/Árbol/Gemelo existentes en `sicl-web`.
- **Planificación y memoria:** reutilizar módulos de `tools/maqueta-viva`; primero conciliar ramas y validar pruebas.
- **Autorización criptográfica:** ACE88 en `sicl-core`, con adaptador mínimo, explícito y fail-closed cuando corresponda.
- **Geometría:** AGK único; no presentar vista isométrica como runtime AGK.
- **Prototipo Python redundante:** cuarentena documental; retirar solo mediante PR separado y prueba de no consumidores.

## Secuencia ejecutable de cierre

1. Obtener logs CI y diferencias exactas de workflow y `00_START.md` de las ramas divergentes.
2. Preparar rama de integración **sin merge directo a main**, conservando el `00_START.md` más completo y las seis piezas nuevas de autonomía; resolver manualmente divergencias.
3. Ejecutar pruebas Node de `tools/maqueta-viva`, pruebas E3 y casos adversariales: ciclo, dependencia faltante, FROZEN, evidencia falsa, replay, corrupción de memoria, persistencia tras reinicio.
4. Diseñar contrato de adaptador Web→Core ACE88 con SHA exacto, propuesta, identidad, nonce, expiración y respuesta verificable; nunca transformar un clic local `AUTORIZO` en firma.
5. Registrar estado por fase con recibos y no promover `UNKNOWN` a `PASS`.
6. Solo entonces abrir PR y solicitar revisión independiente y autorización.

## Resultado

**RECONCILIATION_REQUIRED / NO_DUPLICATE_IMPLEMENTATION / NO_CANONICAL_MUTATION / SECURITY_FREEZE_PENDING.**

Este documento registra análisis estático, no ejecución ni certificación.
