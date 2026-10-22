# ARKI — Actualización continua de memoria (diseño y puertas de implementación)

## Qué existe en esta rama
- `arki-living-memory.cjs`: módulo experimental en Node que recibe eventos declarados, rechaza IDs repetidos, conserva entradas anteriores y deriva una vista agrupada por asunto.
- `arki-living-memory.test.cjs`: pruebas sintéticas; pendientes de ejecución en entorno del usuario.
- **No existe aún:** escucha de webhooks, conexión con CI, ingesta de auditorías, persistencia durable del registro, verificación independiente de firmas o SHA, actualización automática del HTML o integración con planificador.
- El `previousHash` del prototipo es un enlace calculado a partir del evento anterior, **no** es prueba criptográfica de inmutabilidad ni autenticidad. `VERIFIED` es un estado aportado por el emisor, **no** validación independiente.

## Flujo objetivo

1. Detectar un evento desde GitHub/CI, informe de auditoría, decisión humana o experimento. Preferir eventos firmados o recuperados directamente desde API con identificadores de origen.
2. Registrar evento con ID idempotente, timestamp, fuente, SHA, alcance, evidencia y nivel de confianza. No sobrescribir el historial.
3. Verificar autenticidad y contenido en un verificador separado. El resultado se registra como un **nuevo evento**, sin reescribir la afirmación original.
4. Reconciliar hechos nuevos con decisiones, auditorías y hallazgos; mantener contradicciones y desconocidos explícitos.
5. Recalcular vistas derivadas: capacidades, tareas, dependencias, bloqueos, riesgos y próximos pasos.
6. Publicar un snapshot versionado con SHA de corte, índice de fuentes, pruebas y fecha; Plano Vivo debe mostrar cuándo se actualizó y cuándo quedó desfasado.
7. Exportar handoff Markdown/JSON. El nuevo chat debe verificar estado remoto antes de ejecutar.

## Política de actualización

- Commits y CI: ingestión por webhook/acción programada **solo cuando esté implementada y autorizada**.
- Auditorías: incorporar documento completo o referencia verificable, extraer hallazgos estructurados, revisión humana o por Equipo Rojo según criticidad.
- Decisiones: requerir autorización expresa y conservar el estado anterior.
- Eventos contradictorios: marcar CONFLICTED; nunca resolver automáticamente por antigüedad o por tono del auditor.
- FROZEN y promociones: bloqueados hasta contrato y autorización correspondiente.
- Fallos de ingestión: cola reintentable, deduplicación, reporte de cobertura y alerta de desfase.

## Criterios de aceptación de la siguiente etapa

- Tests de reintentos, duplicados, orden temporal, corrupción del historial, eventos maliciosos y dos auditores contradictorios.
- Verificación de procedencia independiente de etiquetas autodeclaradas.
- Persistencia y replay reproducible desde cero.
- Prueba E2E: un evento de prueba en GitHub actualiza el snapshot, Plano Vivo y handoff, sin modificar Core ni FROZEN.
- La ausencia de eventos no debe reportarse como 'todo actualizado': comprobar marca de agua y cobertura.
