# AR-LU Federated Orchestrator

## Nombre oficial

El director federado de ambos productos se denomina **AR-LU Federated Orchestrator** (`AR-LU-ORCHESTRATOR-1.0`). Los directores internos de cada asistente mantienen sus nombres propios. AR-LU es el control plane que coordina handoffs, no un nuevo Core ni una autoridad paralela.

## Auditoría persistente

Cada handoff se registra en `federated_assistant_handoffs` con identificador, propietario, producto y asistente de origen, destino, solicitud, commit, evidencia, traza, estado, nota de revisión, revisor y fechas. Los estados válidos son `CANDIDATE`, `HUMAN_REVIEW`, `APPROVED`, `REJECTED` y `FROZEN`.

La creación de un handoff invoca el director AR-LU y guarda su traza real. La revisión sólo permite aprobar, rechazar o congelar desde un procedimiento protegido y con autoridad humana del propietario. Un handoff aprobado no escribe automáticamente en el Core de ARKI ni en el Core de LUCA.

## Bandeja visual

La bandeja permite filtrar por estado, seleccionar un handoff, revisar evidencia y traza, y ejecutar las tres decisiones humanas. La interfaz muestra explícitamente `Core write: forbidden`, `Secret transfer: forbidden` y `Human authority: final`.

## Adaptadores

### Voz y campo

`probeVoiceFieldAdapter` detecta contexto seguro HTTPS, cámara/micrófono, geolocalización y reconocimiento de voz. Devuelve capacidades observables, pero conserva `PERMISSION_REQUIRED` hasta que el usuario conceda permisos. La captura de campo debe conservar provenance y no publica por sí sola.

### Dispositivos

`createDeviceInteroperabilityAdapter` usa capacidades reales del navegador para BroadcastChannel, WebRTC o WebSocket y exige contexto seguro, gesto del usuario y pairing auditado. Cast y receptores vendor permanecen `HOST_REQUIRED` hasta disponer del receptor autorizado.

### Distribución

`prepareDistributionAdapter` valida checksum y metadatos para Social, OTT, CDN o QR. No entrega credenciales al cliente ni publica automáticamente. Sin aprobación, sólo prepara `PREVIEW_ONLY`; con aprobación explícita, queda `QUEUED_FOR_HUMAN_APPROVAL` y todavía requiere el proveedor externo.

## Límites

Los adaptadores son reales en detección, preparación, permisos y validación, pero no se afirma conexión productiva con proveedores no configurados. No se transfieren secretos, tokens, wallets, ledger, RNG, RTP, settlement ni autoridad de publicación. La conexión externa requiere host, credenciales server-side, contrato de proveedor y pruebas físicas.
