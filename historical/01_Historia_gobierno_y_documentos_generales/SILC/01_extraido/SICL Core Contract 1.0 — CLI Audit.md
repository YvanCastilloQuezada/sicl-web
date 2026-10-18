# SICL Core Contract 1.0 — CLI Audit

## Dictamen

Se implementó la primera superficie CLI de Core Contract 1.0 en modo seguro. La CLI está separada del runtime legacy y solo permite inspección, revisión y validación de mappings.

## Comandos implementados

| Comando | Estado | Escritura |
|---|---|---|
| `project show <project_id>` | Implementado | No |
| `review <project_id>` | Implementado | No |
| `events list <project_id>` | Implementado | No |
| `import validate <snapshot> <mapping>` | Implementado | No |
| `import apply` | No habilitado | Pendiente de transacción |
| `decision record` | No habilitado | Pendiente de confirmación y evento atómico |

## Protecciones

La CLI no importa automáticamente desde SQLite legacy, no infiere relaciones, no selecciona ganadores en TradeOff, no crea Recommendations desde datos insuficientes y no crea Decisions desde Recommendations. `review` expone `decision_authority=HUMAN`.

## Resultado de pruebas

La suite completa produjo **71 tests passing**. Se verificaron la revisión read-only, la validación de importación sin creación de base de datos, el aislamiento de imports y la compatibilidad del vertical slice UPAO-001.

## Decisión

La CLI no debe habilitar escrituras hasta que exista una operación transaccional que combine validación, versión esperada, snapshot, actor humano y evento inmutable. La superficie read-only sí está lista para una revisión controlada.
