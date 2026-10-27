# ARKI — BIC-008: doble fecha y estado abierto de cada idea

Fecha de adopción del criterio: 2026-10-13.

## Regla obligatoria para cada ficha
Mostrar **ambas fechas** en columnas independientes:
1. **Fecha de la idea** (`idea_proposed_at`): primer registro comprobable de su formulación. Acompañar `idea_proposed_source` y `idea_date_confidence`. Si no existe evidencia, **UNKNOWN**; no reemplazarla por la fecha del primer commit.
2. **Fecha del commit** (`first_implementation_commit_at`): primer commit de implementación comprobado, con `sha` y `repo`. Si solo existe documentación o no se encontró implementación, **SIN COMMIT DE IMPLEMENTACIÓN VERIFICADO**. Guardar por separado `first_documentation_commit_at` cuando corresponda.
3. **Estado actual** (`idea_status`): `OPEN_CONCEPT`, `OPEN_IN_DEVELOPMENT`, `OPEN_AWAITING_VALIDATION`, `IMPLEMENTED_VERIFIED`, `FROZEN`, `REJECTED_WITH_EVIDENCE` o `UNKNOWN`. El estado OPEN no se deduce de que una rama siga existiendo; se justifica con pendientes concretos y evidencia. FROZEN tampoco equivale necesariamente a completado.
4. **Última actividad** (`last_evidence_at`), **fecha de cierre** (`closed_at`, si aplica), y **evidencia del cierre** (`closure_evidence`). No confundir último commit con cierre.
5. Todas las fechas incluyen zona horaria o UTC; si se conoce solo el día, no inventar hora.

## Tabla de visualización obligatoria
| Idea | Fecha en que surgió | Primer commit de implementación | Última evidencia | Estado actual | Evidencia / pendiente |
|---|---|---|---|---|---|
| ARKI-DRAW primitivas y SVG | UNKNOWN | 2026-09-27 23:45:50 UTC — `4d932c2c2` | UNKNOWN | OPEN_AWAITING_VALIDATION (estado de esta auditoría, no del producto) | Revisar CI y cierre de contrato |
| ARE contrato de representación | UNKNOWN | SIN COMMIT DE IMPLEMENTACIÓN EN ARE-001; doc: 2026-09-28 06:11:01 UTC — `e80bd3a21` | UNKNOWN | UNKNOWN | ARE-001 es contrato, no runtime |
| ARE-002 contratos inmutables | UNKNOWN | 2026-09-28 06:25:19 UTC — `f7bf872f0` | UNKNOWN | OPEN_AWAITING_VALIDATION (auditoría) | Verificar tests y main actual |
| ARE-003 proyección 2D | UNKNOWN | 2026-09-28 06:56:11 UTC — `faf8d4ee5` | UNKNOWN | OPEN_AWAITING_VALIDATION (auditoría) | Inspeccionar implementación específica y tests |
| AGK geometría operacional | UNKNOWN | 2026-09-30 22:56:16 -05:00 — `2cfb197de` (primer commit observado por búsqueda) | UNKNOWN | UNKNOWN | Fecha de implementación inicial no exhaustivamente verificada |

**Advertencia de estados:** `OPEN_AWAITING_VALIDATION` describe que *la ficha de recuperación aún requiere validación*, no afirma que la capacidad del producto siga abierta. Si no se ha demostrado estado real del producto, mostrar `UNKNOWN` en `product_status` y `OPEN_AWAITING_VALIDATION` en `catalog_review_status`.

## Campos canónicos JSON propuestos
```json
{
  "idea_id": "BIC-...",
  "idea_proposed_at": null,
  "idea_proposed_source": null,
  "first_documentation_commit_at": null,
  "first_implementation_commit_at": null,
  "first_implementation_sha": null,
  "last_evidence_at": null,
  "product_status": "UNKNOWN",
  "catalog_review_status": "OPEN_AWAITING_VALIDATION",
  "closed_at": null,
  "closure_evidence": null
}
```

## Protocolo
No afirmar que una idea fue concebida cuando se hizo el commit. No afirmar que una idea está cerrada por estar mergeada. Si el usuario proporciona fecha original de conversación, documento o handoff, asociar esa fuente y actualizar la columna **Fecha de la idea** sin alterar el SHA de implementación. Mantener ambas fechas visibles incluso cuando una sea UNKNOWN.
