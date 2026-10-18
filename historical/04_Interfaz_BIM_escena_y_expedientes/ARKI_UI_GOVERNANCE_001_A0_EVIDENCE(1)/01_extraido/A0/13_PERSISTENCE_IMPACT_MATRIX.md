# A0 — Matriz de impacto y persistencia

| Clase de acción | Efecto esperado a verificar | Fuente de verdad | Rollback requerido | Estado A0 |
|---|---|---|---|---|
| Navegación o cambio de vista | Estado local o URL cambia sin mutar Core | Browser state / URL | Volver a vista anterior | UNKNOWN_UNVERIFIED |
| Cambio de parámetro | Preview y métricas se recalculan | Modelo local o endpoint | Restaurar snapshot | UNKNOWN_UNVERIFIED |
| Generación | Propuesta queda identificada y versionada | Project State | Revertir propuesta | UNKNOWN_UNVERIFIED |
| Aprobación/rechazo | Gate humano y transición trazable | Project State/Core | Reabrir o restaurar versión | UNKNOWN_UNVERIFIED |
| Importación/subida | Archivo validado, checksum y biblioteca | Storage + metadata | Archivar/restaurar | UNKNOWN_UNVERIFIED |
| Exportación | Archivo descargable coincide con versión observada | Export artifact | No aplica; conservar hash | UNKNOWN_UNVERIFIED |
| Publicación o sincronización | Estado externo cambia solo con autoridad | Servicio externo | Rollback o revocación | BLOCKED_PENDING_EVIDENCE |
