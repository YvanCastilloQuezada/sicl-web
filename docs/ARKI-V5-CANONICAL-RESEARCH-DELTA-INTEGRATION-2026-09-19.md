# ARKI / ARQUI — Integración de la delta de investigación v5.0

## Estado

`V5_RESEARCH_DELTA = INTEGRATED / INCREMENTAL`

`WASTE_GEOMETRIC_REPAIR = IMPLEMENTED / PROVEN`

`HAZARD_PRIMITIVE = CANDIDATE / NOT_IMPLEMENTED`

`HUMAN_AUTHORITY = PRESERVED`

`CONSTRUCTION_DOCUMENTATION = NOT_GENERATED`

`RNE_WASTE_COMPLIANCE = UNKNOWN`

## Fuente

Workbook: `ARKI_ARQUI_Canonical_Research_Delta_v5.0.xlsx`

SHA-256: `dc393966334570e9bc973ba1d6f96f0b3a915866ad9c2c3765eb7cec5249a8ba`

La delta v5.0 es incremental sobre v3.0 y v4.0. No elimina ni depreca conocimiento anterior. Integra los stress tests de industria, logística, food processing/cold chain, healthcare y laboratorio/biosafety como conocimiento candidato trazable.

## Implementación realizada

Se extendió el almacén K4 existente con unidades source-derived v5, sin crear un segundo motor de conocimiento. Se implementaron vistas derivadas para journey validity y reevaluación acotada después de mutaciones. El candidato `HAZARD` no se activó como nueva entidad canónica porque el workbook lo clasifica como decisión de investigación pendiente.

Para el restaurante de 500 comensales se implementó una reparación geométrica controlada. El motor genera una alternativa derivada, `RESTAURANT-A-WASTE-REPAIR-01`, sin mutar la alternativa original. La alternativa agrega un recinto de 15 m² para retorno de vajilla sucia y residuos, una ruta específica y tres aperturas conectando cocina, zona de residuos, soporte y franja lateral de servicio.

## Resultado de validación

La reparación geométrica obtiene:

| Control | Resultado |
|---|---|
| Zona explícita de residuos | PASS |
| Contención en lote | PASS |
| No solape con comedores | PASS |
| Continuidad de ruta | PASS |
| Conexiones de puertas | PASS |
| Inmutabilidad de alternativa original | PASS |
| Capacidad operativa de residuos | UNKNOWN |
| Cumplimiento RNE específico | UNKNOWN |
| Estado global | GEOMETRICALLY_RESOLVED_WITH_OPERATIONAL_UNKNOWN |

La solución es una **alternativa candidata**. No constituye aprobación del arquitecto, certificación sanitaria, cumplimiento normativo ni documentación para licencia.

## Pruebas

La validación focalizada de la delta v5, la reparación geométrica y la evaluación del restaurante pasó con 13 pruebas. La regresión completa del repositorio, el typecheck, build y `git diff --check` deben ejecutarse antes de cerrar el commit.

## Guardrails preservados

- Una sola geometría canónica; múltiples vistas y alternativas derivadas.
- No se creó un segundo motor de geometría o de capacidades.
- `UNKNOWN` y `NOT_EVALUATED` no se convierten en `PASS`.
- La precisión geométrica no supera la precisión de la evidencia disponible.
- La alternativa original queda preservada.
- La autoridad profesional humana permanece obligatoria.
- No hay claims de permiso, certificación ni documentación ejecutiva.
