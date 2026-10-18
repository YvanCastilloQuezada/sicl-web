# 06 — Flujos de usuario

## Usuario público

`Portal → Entrar al mundo / Ver TV / L★ → QR, AR o Controller`. La UI puede iniciar una experiencia; no concede autoridad territorial ni de núcleo.

## Mapper

`Login → Mapper entry → permisos GPS/cámara → CaptureSession → WorldObject → Claims/Observations → Evidence/Assets → local queue si offline → sync → revisión`.

## The Eye

`Login → The Eye entry → lista de expedientes → comparación de versiones → Claims/Sources/Evidence → decisión → auditoría → Human Authority`.

## Human Authority

`Expediente verificado → comprobar evidencia/fuente/score → publicar o rechazar → audit event → runtime únicamente si PUBLISHED`.

## QR

`QR Lab → elegir payload/forma/color/logo → previsualizar → descargar/compartir → escanear → deep link`. El payload debe ser público y sin secretos.

## AR

`Entrada → tutorial/loader → permisos → cargar GLB o placeholder → detectar plano/colocar → interacción → retorno`. Cámara, plano y GLB final requieren dispositivo compatible.

## TV/Controller

`QR/sesión → pairing → rol → modo Game Pad/Trackpad/Keyboard/AR → comandos → feedback → cierre/expiración`. La presencia del comando en UI no prueba que un TV real lo ejecute.

## Offline

`captura local → estado OFFLINE/PENDING_SYNC → reconexión → comparación baseVersion → SYNCED o CONFLICT → resolución humana → auditoría`.
