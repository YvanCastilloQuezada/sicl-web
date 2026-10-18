# SICL Core Contract 1.0 — Import Apply Readiness

## Dictamen

`LegacyImportService.import_snapshot` es adecuado para **validación y construcción aislada** de un agregado 1.0 mediante mappings explícitos. No recomiendo conectar todavía un `import apply` directamente a `repository.save`, porque eso no garantizaría por sí solo una importación repetible y auditable.

## Lo que ya está protegido

| Control | Estado |
|---|---|
| Mapping explícito de entidades | Cumplido |
| Relaciones por IDs, no por posición | Cumplido |
| Dirección de Objective obligatoria | Cumplido |
| Metadata de Evaluation obligatoria | Cumplido |
| Evidencia explícita para Evaluation | Cumplido |
| Rechazo de fuentes legacy inexistentes | Cumplido |
| Construcción sin escritura implícita | Cumplido |

## Lo que falta antes de `import apply`

La importación actual crea timestamps y versiones nuevas al construir el agregado. Una segunda ejecución equivalente no puede tratarse automáticamente como el mismo snapshot sin definir una identidad de importación y una política de comparación canónica. Además, `repository.save` no emite por sí solo un evento semántico que indique qué snapshot legacy, mapping y resultado fueron aplicados.

Por tanto, `import apply` debe esperar hasta definir:

1. un `import_id` o fingerprint determinista del snapshot y mapping;
2. un evento inmutable `LEGACY_IMPORT_APPLIED` con origen, versión de contrato y resultado;
3. una política de replay idéntico frente a mapping conflictivo;
4. una transacción única para snapshot, source links y evento;
5. rechazo de aplicar sobre un Project existente con contenido distinto;
6. prueba de rollback sin Project parcial ni evento parcial.

## Decisión

Se mantiene `import validate` como operación segura y se pospone `import apply`. Esto no es una carencia accidental: es la decisión correcta para impedir que una herramienta de migración aparentemente explícita introduzca duplicados, sobrescriba snapshots o fabrique una falsa trazabilidad de origen.

La prioridad siguiente no es implementar perfiles. Es cerrar el contrato de identidad de importación y después construir `import apply` como operación transaccional separada.
