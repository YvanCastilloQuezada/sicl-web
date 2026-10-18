# ARKI-CAD-001B — ABB-001 Adapter Benchmark Plan

**Estado:** `NOT_EXECUTED / BLOCKED_PENDING_HUMAN_AUTHORITY`

## Objetivo

Comparar un lector primario candidato con una referencia independiente sobre el Source Freeze de ABB-001, sin modificar las fuentes y sin generar BIM automáticamente.

## Corpus mínimo

El corpus debe incluir los cinco DWG congelados de ABB-001, los PDFs de arquitectura original y modificada, y fixtures adicionales que cubran capas, layouts, bloques, textos, cotas, unidades, coordenadas, referencias externas, entidades proxy, objetos verticales, archivos grandes y archivos corruptos controlados.

## Pruebas obligatorias

| Grupo | Evidencia requerida |
|---|---|
| Integridad | Hash original, hash de salida y cadena de provenance |
| Lectura | Conteo y tipos de entidades, capas, bloques, layouts, unidades y handles |
| Geometría | Extensiones, segmentos, curvas, sólidos y tolerancias documentadas |
| Semántica | Ninguna promoción automática a muro, puerta, espacio o MEP |
| Round-trip | Lectura → escritura → lectura, con pérdidas clasificadas |
| Determinismo | Repetición con la misma release y comparación semántica y byte a byte |
| Seguridad | Corrupción, límites de tamaño, timeout, memoria y proceso aislado |
| Interdisciplina | Correspondencia documental entre arquitectura, estructura, sanitarias y eléctricas |
| Revisión | Toda discrepancia material queda como conflicto o decisión humana |

## Criterios de salida

El benchmark produce `PASS`, `PASS_WITH_LOSS_DECLARED`, `BLOCKED`, `UNKNOWN` o `FAIL`. Ningún `UNKNOWN` se convierte en éxito. La reconstrucción BIM sólo puede abrirse si se cumple el criterio de aceptación aprobado por el Product Owner.

## Estado

El benchmark no se ejecutó en ARKI-CAD-001B. No se instalaron SDKs ni se compraron licencias. El archivo `ARKI_ABB001_ADAPTER_EXPERIMENT.json` permanece `NOT_EXECUTED`.
