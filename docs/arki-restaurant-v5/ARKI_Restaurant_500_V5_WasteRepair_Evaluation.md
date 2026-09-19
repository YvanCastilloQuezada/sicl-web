# ARKI — v5.0 reparación geométrica automática acotada del restaurante

- Proyecto: RESTAURANT-500-20X40-001
- Alternativa original: RESTAURANT-A-SEPARATED-FLOWS
- Alternativa candidata: RESTAURANT-A-WASTE-REPAIR-01
- Estado: GEOMETRICALLY_RESOLVED_WITH_OPERATIONAL_UNKNOWN
- Geometría de residuos: GEOMETRICALLY_RESOLVED
- Zona nueva: 15 m²
- Rutas antes/después: 4 → 5
- Aperturas con residuos: 3

## Resultado

ARKI generó automáticamente una alternativa derivada del mismo CanonicalBuildingModel. La solución añade un recinto explícito de retorno de vajilla sucia y residuos entre la cocina, el soporte de servicio y la franja lateral independiente.

La reparación geométrica pasa porque la zona está contenida, no invade los comedores, tiene límites espaciales, una ruta propia y tres aperturas explícitas:

- cocina → zona de residuos;
- zona de residuos → soporte de servicio;
- zona de residuos → franja lateral de servicio.

## Comparación incremental

| Elemento | Antes | Después | Estado |
|---|---:|---:|---|
| Zona explícita de residuos | 0 | 1 | GEOMETRICALLY_RESOLVED |
| Área de residuos | no declarada | 15 m² | PASS geométrico |
| Ruta específica de residuos | 0 | 1 | PASS geométrico |
| Aperturas específicas | 0 | 3 | PASS geométrico |
| Capacidad operativa | UNKNOWN | UNKNOWN | pendiente |
| Protocolo de limpieza | UNKNOWN | UNKNOWN | pendiente |
| Frecuencia de retiro | UNKNOWN | UNKNOWN | pendiente |
| Cumplimiento RNE específico | UNKNOWN | UNKNOWN | pendiente |

## Reevaluación acotada

Se reevaluaron únicamente:

- CAP-RESTAURANT-WASTE;
- CAP-RESTAURANT-SERVICE;
- CAP-V4-RESTAURANT-WASTE;
- escenarios normal, hora pico y mantenimiento;
- contención geométrica;
- continuidad de ruta;
- conexiones de puertas.

Se conservaron sin reevaluación destructiva las afirmaciones de aforo, acceso público y evacuación vertical.

## Journey de residuos

- KITCHEN-N1 → WASTE-RETURN-N1: dirty return; controles: door and segregated room
- WASTE-RETURN-N1 → SERVICE-SIDE-LANE-N1: controlled removal; controles: service-only lane

La validez del journey queda **PARTIAL** porque todavía faltan evidencia de capacidad operativa, procedimiento de limpieza, frecuencia de retiro y revisión normativa específica.

## Gobernanza

- La alternativa original permanece intacta.
- La nueva alternativa es candidata, no decisión automática.
- HAZARD v5 permanece como candidato de investigación y no se activa como nueva entidad canónica.
- No se declara certificación profesional, cumplimiento legal ni documentación ejecutiva.

## Archivos

- [Plano reparado v5 N1](./ARKI_Restaurant_500_V5_WasteRepair_N1_Plan.svg)
- [Plano reparado v5 N2](./ARKI_Restaurant_500_V5_WasteRepair_N2_Plan.svg)
- [Evaluación v4 previa](./ARKI_Restaurant_500_V4_Incremental_Evaluation.md)

**HYPOTHESIS. Human Architect review required. No permit claim.**
