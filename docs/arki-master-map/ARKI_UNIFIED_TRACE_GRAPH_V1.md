# ARKI — Unified Trace Graph V1

**Estado:** IMPLEMENTED_AS_LOCAL_READ_ONLY_PROJECTION / WINDOWS_E3_PENDING  
**Rama:** `feat/f7-f8-integral-closure`  
**Contrato:** `ARKI-UNIFIED-TRACE-GRAPH-1`  
**Autoridad:** este documento describe un contrato de intercambio y visualización; **no reemplaza** `docs/arki-master-map/ARKI_MASTER_MAP_STATE.json`, contratos FROZEN, decisiones canónicas ni pruebas CI.

## Propósito

Plano ARKI, Maqueta Viva, Gemelo Digital, Gemelo Predictivo y ARKI Autocorrectivo consultan una sola proyección trazable. No son cinco bases de datos ni cinco fuentes de verdad.

**Fuentes y precedencia:**

1. **Estado canónico:** `ARKI_MASTER_MAP_STATE.json` — F1–F10, estados, evidencia oficial declarada y registros FROZEN de alcance acotado.
2. **Inventario histórico:** `tools/maqueta-viva/assembly-registry.json` — piezas e ideas históricas; destino propuesto, no integración.
3. **Borrador local:** `localStorage` bajo `arki-maqueta-assembly-draft-v1` — colocaciones, dependencias declaradas, rutas de referencia/alternativa, justificaciones y eventos.
4. **Ideas locales:** `arki-maqueta-local-ideas-v1` — propuestas del navegador, no promoción al inventario.
5. **Expedientes autocorrectivos locales:** `arki-autocorrective-cases-v1` — propuestas, estados y recibos declarados, sin ejecución ni verificación automática.

## Proyección `ARKI-UNIFIED-TRACE-GRAPH-1`

`buildUnifiedTraceGraph()` crea una proyección nueva en memoria cada vez que se consulta. El botón **Exportar grafo JSON** descarga la instantánea completa. No escribe en los repositorios ni en las fuentes.

Campos principales:

- `schema`: `ARKI-UNIFIED-TRACE-GRAPH-1`.
- `generatedAt`: instante de proyección; **no** instante de actualización de las fuentes.
- `provenance`: esquemas y fechas de estado e inventario, esquema del borrador y del registro autocorrectivo.
- `authority`: `READ_ONLY_DERIVED_LOCAL_PROJECTION`.
- `capabilities`: indicadores explícitos `false` para `liveSync`, `realTwin`, `calibratedPrediction`, `autonomousCodeMutation` y `canonicalPromotion`.
- `nodes`: identidades, tipos, fuentes y atributos.
- `edges`: extremos, tipo, autoridad de la relación y escenario.
- `issues`: anomalías de conciliación para revisión; no defectos certificados.

**Tipos de nodos:** `PHASE`, `PROPOSED_STAGE`, `HISTORICAL_IDEA`, `HISTORICAL_COMPONENT`, `LOCAL_IDEA`, `FROZEN_RECORD`, `CORRECTIVE_CASE`, `LOCAL_DECISION`.

**Tipos de relaciones:** `PLACED_IN`, `ASSIGNED_TO` (base/alternative), `REQUIRES`, `BOUNDED_FREEZE_SCOPE`, `CORRECTIVE_SCOPE`, `RECORDS_DECISION`.

Las identidades están prefijadas (`phase:F1`, `piece:I-01`, `stage:F1:0`, `frozen:...`, `case:AC-1`, `decision:00001`) para evitar colisiones entre dominios. Los identificadores de eventos son ordinales **de la instantánea**, no IDs globales persistentes.

## Cómo se usa

1. Abrir `ARKI-MAQUETA-VIVA.cmd` después de actualizar la rama.
2. Elegir una de las cinco evoluciones y el alcance **TODO** o **F1–F10**.
3. Abrir **GRAFO TRAZABLE COMPARTIDO**. El panel muestra nodos, relaciones, decisiones, expedientes y alertas para el alcance.
4. Seleccionar una pieza en **Seguir pieza** para revisar su fase, procedencia, evidencia declarada y relaciones.
5. Si está colocada en una fase, pulsar **Abrir pieza en Maqueta** para examinarla en la vista vertebral.
6. Pulsar **Exportar grafo JSON** para conservar o analizar una instantánea local.

Las ideas y cambios FROZEN procedentes de fuentes se detectan **al regenerar el HTML con el lanzador**. Las ideas del navegador se incorporan al borrador local; no se suben ni se sincronizan solas. El grafo se recalcula desde la información disponible en ese momento.

## Invariantes y límites

- **NO EVIDENCIA = NO VERDE**. `declarationComplete` significa ficha local declarada completa; no significa CI verde, prueba ejecutada ni integración.
- Las diez fases, sus estados y los FROZEN se leen de la autoridad canónica y no se editan mediante el grafo.
- `REQUIRES` y `ASSIGNED_TO` son relaciones de borrador; no se infiere dependencia verificada ni ruta crítica temporal.
- Los resultados de Gemelo Predictivo son análisis heurísticos locales, no predicciones calibradas.
- Los casos autocorrectivos no modifican archivos, no llaman a GitHub, no fusionan PR ni autorizan ejecución desde el grafo.
- No hay sincronización viva con BIM/CAD/GitHub ni gemelo operacional real demostrado.
- La proyección exportada es **una instantánea**, no una fuente que se importe para sobrescribir autoridades.
- Las alertas por piezas en FROZEN o dependencias sin colocar son señales para revisión, no cambio de estado.

## Puertas de aceptación

| Puerta | Criterio | Estado |
|---|---|---|
| T1 | JavaScript de la plantilla compila | PASS en verificación estática |
| T2 | Cinco evoluciones muestran el mismo panel de grafo | PASS en simulación de ejecución con DOM sustituido |
| T3 | Dos piezas colocadas, dependencia, rutas base/alternativa y caso AC se proyectan sin IDs duplicados ni aristas huérfanas | PASS en simulación de ejecución |
| T4 | F6 sigue FROZEN y no se alteran las autoridades al proyectar | PASS en simulación de ejecución |
| T5 | Exportación JSON real en navegador Windows y ergonomía visual | PENDIENTE E3 |
| T6 | Sincronización operacional, simulación calibrada y ejecución correctiva autorizada | FUERA DE ALCANCE; NO DEMOSTRADO |

**Siguiente paso técnico:** validar T5 en Windows, verificar procedencia y reconciliación de fuentes, y definir adaptadores de lectura verificables por cada sistema externo antes de considerar sincronización o ejecución.
