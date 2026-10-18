# Second Screen y QR contextual

## Contrato

La pantalla secundaria se abre desde un QR firmado por MJP Core. El payload conserva `broadcastId`, `roundId`, `eventId`, `experienceId`, `rulesetVersion`, `openAt`, `closeAt`, `expiresAt`, `verifyUrl`, `sessionToken` efímero y firma HMAC-SHA-256. La URL contextual lleva la experiencia, pero no convierte al móvil en fuente de verdad.

## Reglas de seguridad

El QR solo se genera durante una ronda `open`. La firma cubre los datos canónicos; cualquier alteración del identificador, juego, ventana, URL, experiencia o token invalida el payload. La validación exige versión soportada, firma correcta y ventana temporal válida. Un QR expirado no debe abrir una experiencia inválida.

## Estados sincronizados

TV y móvil consumen el manifest común para `countdown`, `status`, `LOCKED`, `DRAWING`, `RESULT_VERIFIED`, transición y contingencia. El servidor mantiene la autoridad; el cliente puede mostrar estado de carga, desconexión o último manifest confirmado.

## Latencia

El contrato admite medir, cuando se instrumenten los beacons correspondientes, `server_timestamp`, `event_timestamp`, `tv_received_timestamp` y `mobile_received_timestamp`. Hasta que existan datos persistidos completos, las métricas deben mostrarse como `NOT MEASURED`, nunca como cero inventado.

## Política virtual

El QR no crea dinero real, no procesa pagos, no ejecuta retiros y no habilita conversión. La interacción puede ser de entretenimiento o participación con créditos virtuales, según el estado y reglas de la ronda.
