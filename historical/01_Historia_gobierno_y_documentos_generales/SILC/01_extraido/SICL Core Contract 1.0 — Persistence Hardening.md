# SICL Core Contract 1.0 — Persistence Hardening

## Dictamen

La auditoría detectó un riesgo importante en el primer adaptador: `INSERT OR REPLACE` podía borrar y recrear filas al guardar una entidad existente. Aunque los tests básicos pasaban, esa operación podía afectar claves referenciales y ocultar una mutación semántica.

La política corregida es conservadora:

> Guardar dos veces el mismo payload es idempotente. Guardar un payload diferente bajo el mismo ID se rechaza hasta que exista un protocolo explícito de actualización y versionado.

## Correcciones

| Riesgo | Corrección |
|---|---|
| `INSERT OR REPLACE` destructivo | Eliminado del adaptador Core Contract. |
| Cambio implícito de entidad | `ContractError` si el mismo ID recibe payload diferente. |
| Replay de evento idéntico | Aceptado como operación idempotente. |
| Replay de evento conflictivo | Rechazado mediante `ContractError`. |
| `UPDATE` de eventos | Rechazado mediante trigger SQLite. |
| `DELETE` de eventos | Rechazado mediante trigger SQLite. |
| Event Sourcing accidental | No implementado; snapshots y eventos siguen siendo conceptos separados. |

## Verificación

La suite completa contiene **45 tests passing** después de la auditoría por entidad. Incluye:

1. Round-trip del grafo contractual.
2. Foreign keys para referencias principales.
3. Rechazo de actualización y eliminación de eventos.
4. Guardado idempotente del mismo agregado.
5. Rechazo de mutación sin protocolo de actualización.
6. Replay idempotente de un evento idéntico.
7. Rechazo de replay conflictivo.
8. Persistencia legacy 0.2.5 sin regresiones.
9. Rechazo de referencias cruzadas durante actualizaciones.

## Protocolo de actualización

El adaptador ya implementa una operación explícita `update_entity` que:

- comprueba la versión esperada;
- incrementa `entity_version` exactamente una vez;
- actualiza `updated_at`;
- persiste el nuevo snapshot en una transacción;
- añade un evento `UPDATED` inmutable;
- rechaza concurrencia perdida;
- no permite cambiar de Project;
- rechaza referencias actualizadas hacia otro Project;
- conserva el payload anterior en el evento y no sobrescribe el historial.

Las escrituras ordinarias siguen siendo idempotentes: el mismo payload no genera una nueva mutación, mientras que un payload diferente debe pasar por `update_entity`. Esta separación evita que `save` se convierta en un update implícito.

## Decisión sobre Event Sourcing

No se adopta Event Sourcing en esta fase. La evidencia actual solo justifica **snapshot + event log protegido**. Event Sourcing requeriría que todos los cambios relevantes fueran eventos suficientes para reconstruir el agregado, además de una estrategia de replay, versionado de eventos y migración de esquemas.

La decisión queda abierta para un ADR independiente, no escondida dentro del adaptador.
