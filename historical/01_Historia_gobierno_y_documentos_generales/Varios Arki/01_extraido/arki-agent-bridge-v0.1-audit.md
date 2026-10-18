# Auditoría técnica de ARKI Agent Bridge v0.1

**Fecha de auditoría:** 2026-09-25  
**Alcance:** contenido completo de `arki-agent-bridge-v0.1.zip`, extraído en un directorio temporal.  
**Límite aplicado:** no se modificó ARKI, no se modificó el ZIP, no se publicaron servicios y no se usaron credenciales.

## Conclusión ejecutiva

La semilla implementa una capa mínima para construir una orden gobernada, crear una tarea Manus, enviar mensajes posteriores y recuperar detalle e historial. También contiene la rutina criptográfica compatible con la documentación oficial de webhooks de Manus. Sin embargo, la integración no constituye todavía una comunicación bidireccional autónoma ChatGPT/OpenAI ⇄ Manus.

El único test existente pasa, y todos los módulos revisados tienen sintaxis válida. Esa evidencia no demuestra un flujo real contra Manus: no se ejecutó una prueba end-to-end porque el archivo no contiene credenciales y no se solicitaron. Tampoco existe persistencia, cola, audit log, correlación duradera de eventos, deduplicación de webhooks, autenticación de los endpoints entrantes ni un runtime del lado OpenAI/ChatGPT capaz de recibir resultados y decidir el siguiente paso.

El riesgo más importante observado es de seguridad: cuando `MANUS_WEBHOOK_PUBLIC_KEY_PEM` no está configurada, el servidor omite completamente la verificación y acepta cualquier JSON en `/webhooks/manus`. La variable aparece como opcional en `.env.example`, por lo que una configuración incompleta puede convertir el receptor en un endpoint de confianza falsa.

## BRIDGE VERSION:

**v0.1.0**, según `package.json` y la respuesta de `/health`.

## FILES REVIEWED:

Se revisaron los ocho archivos presentes en el archivo comprimido:

| Archivo | Contenido revisado |
|---|---|
| `README.md` | Alcance, límites, seguridad declarada, rutas y frontera v0.1/v0.2 |
| `package.json` | Metadatos, módulo ESM, scripts y runtime requerido |
| `.env.example` | Variables de API, puerto y verificación de webhooks |
| `src/manus.mjs` | Cliente HTTP para Manus API v2 |
| `src/protocol.mjs` | Construcción de órdenes y texto de DECISION LOCK |
| `src/server.mjs` | Servidor HTTP, rutas Manus y receptor de webhooks |
| `src/webhook-security.mjs` | Verificación RSA-SHA256 y ventana temporal |
| `tests/protocol.test.mjs` | Test unitario de `buildOrder` |

No hay `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, base de datos, migraciones, archivos de despliegue, configuración de CI, documentación OpenAI, servidor MCP, worker, cola o almacenamiento persistente.

## ARCHITECTURE FOUND:

La arquitectura encontrada es un servidor HTTP Node.js sin framework y sin estado persistente. El proceso expone `/health`, tres operaciones de tarea bajo `/manus/tasks`, y `/webhooks/manus`. Cada operación crea un `ManusClient` y llama directamente a `https://api.manus.ai/v2` mediante `fetch`.

El flujo previsto es lineal:

```text
Cliente externo autorizado por la red
        |
        v
Bridge HTTP -- buildOrder --> Manus API v2 -- tarea asíncrona --> Manus webhook o consulta
        |
        +--> devuelve la respuesta HTTP al llamador
```

El webhook solo analiza el evento y devuelve un resumen. No lo guarda, no publica el resultado hacia OpenAI/ChatGPT y no crea un siguiente mensaje. Por tanto, el lado ChatGPT/OpenAI no está incluido en el artefacto.

## IMPLEMENTED:

Las siguientes capacidades tienen código presente, pero no deben interpretarse como validación end-to-end:

1. **Cliente Manus API v2 — IMPLEMENTED.** `src/manus.mjs` define llamadas a `task.create`, `task.sendMessage`, `task.listMessages`, `task.detail`, `webhook.create` y `webhook.publicKey`, usando `x-manus-api-key` desde `MANUS_API_KEY`.
2. **Creación de tareas — IMPLEMENTED.** `POST /manus/tasks` llama a `buildOrder` y a `task.create`. Pasa `project_id` y, si están presentes, opciones de conectores y skills.
3. **Mensajes a tareas existentes — IMPLEMENTED.** `POST /manus/tasks/:task_id/messages` llama a `task.sendMessage` con texto.
4. **Recuperación básica — IMPLEMENTED.** `GET /manus/tasks/:task_id` solicita `task.detail` y `task.listMessages` y devuelve ambos resultados juntos.
5. **Protocolo textual de órdenes — IMPLEMENTED.** `buildOrder` exige `decision_id`, `project`, `context`, `why`, `objective`, `execution` y `acceptance`, y serializa además `preserve`, `do_not_touch` y `validation` cuando existen.
6. **DECISION LOCK textual — IMPLEMENTED.** La orden contiene instrucciones explícitas para no reconfirmar la misma decisión y detenerse ante decisiones nuevas de tipo destructivo, de seguridad, de datos, arquitectónico o fuera de alcance.
7. **Verificación criptográfica compatible — IMPLEMENTED.** `verifyManusWebhook` reconstruye `{timestamp}.{url}.{sha256_hex(body)}` y usa RSA-SHA256 con la firma en Base64.
8. **Gestión básica de secretos — IMPLEMENTED.** El código no contiene una clave; la obtiene del entorno y `.env.example` deja el valor vacío.
9. **Endpoint de salud — IMPLEMENTED.** `/health` devuelve versión y estado básico.

## VERIFIED:

La siguiente evidencia se comprobó directamente durante esta auditoría:

1. **Build/test del protocolo — VERIFIED.** `npm test` pasó: 1 test, 1 aprobado, 0 fallos.
2. **Sintaxis — VERIFIED.** `node --check` pasó para todos los módulos de `src/` y `tests/`.
3. **Inicio y health — VERIFIED.** El servidor inició en Node.js y `GET /health` respondió HTTP 200 con `version: "0.1.0"`.
4. **Recepción sin firma cuando falta la clave — VERIFIED.** Una petición JSON válida a `/webhooks/manus` respondió HTTP 200 sin `MANUS_WEBHOOK_PUBLIC_KEY_PEM`. Esto confirma el riesgo descrito en `SECURITY ISSUES`.
5. **Contrato documental básico — VERIFIED por comparación estática.** Las rutas y el encabezado de API usados en el cliente coinciden con la documentación oficial consultada para `task.create`, `task.sendMessage`, `task.detail`, `task.listMessages`, `webhook.create` y `webhook.publicKey` [1] [2] [3] [4] [5] [6].

No se verificó una llamada real contra Manus, una firma válida producida por Manus ni una entrega pública de webhook.

## MISSING:

1. **Orquestador del lado OpenAI/ChatGPT — MISSING.** No hay proceso que reciba el resultado Manus, lo entregue a un modelo OpenAI o active el siguiente ciclo.
2. **Canal de retorno — MISSING.** El webhook no envía datos a ChatGPT/OpenAI, a un endpoint de conversación, a una cola ni a un sistema de mensajes.
3. **Persistencia — MISSING.** No hay base de datos, almacenamiento de tareas, estado de decisiones, historial de eventos ni recuperación tras reinicio.
4. **Audit log — MISSING.** No se guardan la orden original, la identidad de quien la emitió, respuestas, eventos, hashes, timestamps ni transiciones de estado.
5. **Idempotencia y deduplicación — MISSING.** No hay `event_id` almacenado, clave de idempotencia, tabla de eventos procesados ni protección contra procesamiento duplicado.
6. **Autenticación del Bridge — MISSING.** Las rutas `/manus/tasks` no exigen autenticación propia. Cualquier proceso que alcance el puerto puede intentar crear tareas, enviar mensajes o leer tareas.
7. **Enforcement de HUMAN AUTHORITY — MISSING.** `decision_id` y DECISION LOCK son texto de prompt. No existe una política ejecutable que valide propietario, alcance, permisos, estado de decisión o escalamiento.
8. **Validación robusta de entradas — MISSING.** No se valida esquema, tipos, longitud, tamaño máximo del cuerpo, formato de `task_id` ni contenido de `body.content`.
9. **Manejo de estados Manus — MISSING.** No se interpreta `running`, `stopped`, `waiting` o `error`, ni se distingue una pregunta del agente de una confirmación de acción. La documentación de `task.listMessages` exige esa distinción [4].
10. **Paginar historial — MISSING.** `listMessages` fija solo `limit` y no usa `order`, `cursor`, `has_more` ni `next_cursor`.
11. **Entrega fiable — MISSING.** No hay reintentos con backoff, timeouts, cancelación, circuit breaker, cola ni límite de concurrencia.
12. **Operación segura — MISSING.** No hay TLS propio, autorización por ruta, rate limiting, límites de payload, logs estructurados ni métricas.
13. **Pruebas de seguridad e integración — MISSING.** Solo hay un test de texto; faltan pruebas de firma, timestamp, URL canónica, replay, entradas inválidas, autenticación, errores HTTP y ciclo completo.
14. **Configuración de webhook completa — MISSING.** Aunque existe `createWebhook` en el cliente, no hay ruta o procedimiento operativo que registre el endpoint, cachee la clave pública y valide la configuración.
15. **Contrato estructurado de resultados — MISSING.** No se usa `structured_output_schema` ni un esquema estable para que el lado OpenAI consuma resultados sin depender de texto libre.

## BLOCKED:

1. **Prueba end-to-end contra Manus — BLOCKED.** No se realizó porque no hay credenciales en el archivo y no se solicitaron, conforme al alcance de la auditoría.
2. **Prueba real de entrega de webhook — BLOCKED.** El servidor de esta auditoría solo estuvo disponible localmente; no se registró una URL pública HTTPS ni se conectó a Manus.
3. **Automatización ChatGPT/OpenAI específica — BLOCKED por ausencia del componente.** No puede verificarse ni ejecutarse una continuación automática porque v0.1 no incluye runtime, credenciales, endpoint de retorno ni política de autoridad del lado OpenAI.

## SECURITY ISSUES:

### Severidad alta

- **Verificación opcional de webhooks.** En `src/server.mjs`, si `MANUS_WEBHOOK_PUBLIC_KEY_PEM` está vacía, el bloque de verificación se omite y el JSON se acepta. La firma debe ser obligatoria en un receptor de producción. La documentación oficial de Manus describe la firma RSA-SHA256 y la comprobación de timestamp de cinco minutos [5].
- **Endpoints entrantes sin autenticación.** El Bridge no protege creación de tareas, mensajes ni lectura de resultados. La API key saliente no autentica al llamador del Bridge.
- **Ausencia de control de replay persistente.** La ventana de cinco minutos reduce repeticiones antiguas, pero el mismo evento firmado puede repetirse dentro de la ventana porque no se registra ningún identificador ni hash procesado.

### Severidad media

- **Sin límites de cuerpo ni rate limiting.** `read` acumula todo el cuerpo en memoria y el proceso no limita tamaño, frecuencia ni concurrencia.
- **Errores internos expuestos.** El catch global devuelve `e.message` directamente al cliente. Esto puede revelar detalles de validación, red o proveedores.
- **Errores de API normalizados como HTTP 500.** No se preservan códigos de autenticación, rate limit, conflicto o error transitorio, lo que dificulta reintentos correctos.
- **URL firmada dependiente de configuración.** La firma utiliza `MANUS_WEBHOOK_PUBLIC_URL` si existe, y si no construye una URL local con `http://` y el encabezado `Host`. Detrás de un proxy HTTPS, una configuración incorrecta puede rechazar firmas válidas o aceptar una ruta operacionalmente mal definida.
- **No hay protección de acceso por proyecto o tarea.** Un `task_id` no se vincula a un propietario, `decision_id` o contexto almacenado por el Bridge.

### Aspectos positivos comprobados

- La clave Manus no está incluida en el ZIP.
- El código usa el cuerpo crudo para verificar la firma antes de parsear el JSON.
- El control temporal de cinco minutos coincide con la guía oficial de webhooks [5].
- El README prohíbe comprometer `MANUS_API_KEY` y declara que no existe endpoint de deploy/publicación.

## MANUS API INTEGRATION STATUS:

**IMPLEMENTED**, con alcance limitado. El adaptador usa el endpoint base correcto y las operaciones básicas documentadas. La cobertura es suficiente para crear una tarea, continuar una conversación y leer estado/historial. No hay evidencia de ejecución real contra Manus. La recuperación tampoco implementa el ciclo recomendado completo: no pagina mensajes, no interpreta estados de espera, no maneja confirmaciones de acciones y no obtiene ni resuelve de forma estructurada los resultados.

La documentación actual indica que `task.detail` puede devolver `stopped` mientras continúan trabajos en segundo plano y que la ausencia de `has_running_background_jobs` no debe tratarse como `false` [3]. v0.1 no contiene esa lógica de decisión.

## WEBHOOK STATUS:

**IMPLEMENTED** como receptor HTTP y como rutina de firma, pero **MISSING** como integración operativa segura y durable. El endpoint devuelve un resumen del evento, pero no persiste ni dispara ninguna acción. La verificación criptográfica está condicionada a una variable opcional; por eso la configuración predeterminada no es segura. La protección de replay es parcial: existe ventana temporal, pero falta deduplicación persistente.

## OPENAI/CHATGPT SIDE STATUS:

**MISSING.** No existe código OpenAI, cliente de modelo, worker, endpoint de retorno, conversación asociada, servidor MCP, cola ni runtime persistente. El propio README reconoce que la conversación específica de ChatGPT no puede despertarse desde un webhook y que esa capacidad quedó fuera de v0.1.

## HUMAN AUTHORITY STATUS:

**IMPLEMENTED** únicamente como texto de protocolo: la orden transporta `decision_id`, alcance, preservación, exclusiones y DECISION LOCK.  
**MISSING** como control técnico: no se autentica a Yvan, no se firma la decisión, no se almacena el mandato, no se comprueba que un evento corresponda a la decisión original y no existe máquina de estados para escalar solo las categorías materiales.

Por ello, el Bridge actualmente puede transmitir una instrucción con intención de autoridad, pero no puede demostrar técnicamente quién la autorizó ni impedir que un cliente de red inyecte otra.

## WHAT CURRENTLY REQUIRES YVAN:

Yvan todavía debe copiar o transmitir manualmente la orden al entorno Manus y devolver manualmente el resultado a ChatGPT/OpenAI. También tendría que intervenir para responder preguntas, confirmar acciones que Manus marque como `waiting`, revisar errores, decidir ante cambios de alcance y aportar las credenciales o la configuración pública necesarias para cualquier prueba real.

El Bridge reduce parte de la escritura manual si un cliente externo ya puede llamar a sus endpoints, pero v0.1 no elimina el papel de mensajero. Tampoco puede sustituir la autoridad humana en decisiones materiales, y no debería hacerlo.

## WHAT CAN ALREADY BE AUTOMATED:

**IMPLEMENTED:** construir una orden con formato gobernado; enviarla a `task.create`; enviar un seguimiento textual a una tarea conocida; consultar detalle e historial; recibir y verificar una firma cuando la clave está correctamente configurada.

**MISSING:** seleccionar automáticamente la siguiente acción, persistir el estado, entregar resultados a ChatGPT/OpenAI, contestar preguntas de Manus con reglas autorizadas, deduplicar webhooks y producir evidencia auditable. Esas ausencias impiden afirmar que exista automatización bidireccional.

## RECOMMENDED V0.2 ARCHITECTURE:

La v0.2 debería separar explícitamente cuatro componentes:

1. **Gateway autenticado del Bridge.** Debe aceptar únicamente llamadas autenticadas por el runtime autorizado del lado OpenAI y aplicar validación de esquema, límites de tamaño, rate limiting y autorización por tarea/proyecto.
2. **Orquestador persistente.** Debe mantener una máquina de estados por `decision_id` y `task_id`. Debe crear tareas, recibir eventos, consultar el estado definitivo cuando corresponda, paginar mensajes y decidir si el siguiente paso es automático o requiere HUMAN_DECISION_REQUIRED.
3. **Almacén transaccional y audit log.** Debe guardar órdenes inmutables, identidad de autoridad, eventos recibidos, hashes de payload, deduplicación, respuestas, resultados, errores, timestamps y transiciones. Los eventos de webhook deben procesarse de forma idempotente.
4. **Adaptador OpenAI/ChatGPT.** Debe convertir resultados Manus a un contrato estructurado y devolverlos al runtime autorizado del lado OpenAI. No debe intentar “despertar” una conversación sin una interfaz o runtime explícitamente soportado.

El receptor Manus debe requerir siempre firma válida, usar una clave pública cacheada con procedimiento de rotación, verificar timestamp, registrar un identificador o hash de evento y devolver 2xx solo después de aceptar el evento de manera segura. Los estados `waiting`, `stopped`, `error` y los trabajos de fondo deben tratarse según el contrato de Manus, sin confirmar automáticamente acciones no reconocidas [4].

La frontera de seguridad debe mantener al Bridge desacoplado de ARKI. El Bridge puede transportar `project` y `do_not_touch`, pero no debe copiar ni modificar código de ARKI ni convertirse en fuente de verdad del producto.

## EXACT NEXT STEP:

Antes de implementar v0.2, producir una especificación técnica bloqueada por decisiones que defina: el runtime autorizado del lado OpenAI, el contrato de retorno, el modelo de persistencia, la política ejecutable de HUMAN AUTHORITY, el esquema de autenticación entre componentes, la semántica de idempotencia y las categorías exactas de escalamiento. Después de esa especificación, implementar primero el almacén de estado y el receptor de webhook seguro con pruebas; dejar la conexión real y las credenciales para una validación end-to-end separada.

## READY TO BUILD V0.2:

**NO.** La semilla es una base útil para v0.2, pero faltan decisiones arquitectónicas materiales y controles de seguridad fundamentales. No se recomienda iniciar una implementación autónoma sobre la base actual sin cerrar esas definiciones y sin convertir la verificación de firma, autenticación del Bridge, persistencia y audit log en requisitos obligatorios.

## References

[1]: https://open.manus.ai/docs/v2/task.create "Manus API v2 task.create"
[2]: https://open.manus.ai/docs/v2/task.sendMessage "Manus API v2 task.sendMessage"
[3]: https://open.manus.ai/docs/v2/task.detail "Manus API v2 task.detail"
[4]: https://open.manus.ai/docs/v2/task.listMessages "Manus API v2 task.listMessages"
[5]: https://open.manus.ai/docs/v2/webhooks-security "Manus API v2 Webhook Security"
[6]: https://open.manus.ai/docs/v2/webhook.publicKey "Manus API v2 webhook.publicKey"
[7]: https://open.manus.ai/docs/v2/webhook.create "Manus API v2 webhook.create"
[8]: https://open.manus.ai/docs/v2/authentication "Manus API v2 Authentication"
