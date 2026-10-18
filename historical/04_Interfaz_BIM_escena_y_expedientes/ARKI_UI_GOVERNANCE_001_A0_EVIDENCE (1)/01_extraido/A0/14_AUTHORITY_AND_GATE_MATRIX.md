# A0 — Autoridad y gates

Las acciones que puedan alterar Core, Project State, publicar artefactos, firmar, sincronizar, eliminar o conceder acceso deben declarar autoridad y gate antes de ejecutarse. En A0 ninguna de esas acciones se ejecutó.

| Acción | Autoridad esperada | Gate humano | Evidencia mínima | Estado A0 |
|---|---|---|---|---|
| Crear propuesta | Usuario autenticado o proyecto de prueba | No mutar Core automáticamente | Proposal ID y versión | UNKNOWN_UNVERIFIED |
| Aprobar propuesta | Responsable humano | Sí | Actor, timestamp, razón, versión | BLOCKED_PENDING_EVIDENCE |
| Rechazar/congelar | Responsable humano | Sí | Actor, razón y transición | BLOCKED_PENDING_EVIDENCE |
| Exportar | Usuario con proyecto visible | Según tipo de archivo | Hash y versión observada | UNKNOWN_UNVERIFIED |
| Publicar/sincronizar | Owner o rol explícito | Sí | Payload y respuesta externa | BLOCKED_PENDING_EVIDENCE |
| Firmar expediente | Profesional habilitado | Sí, fuera de ARKI | Firma verificable | OUT_OF_SCOPE |
