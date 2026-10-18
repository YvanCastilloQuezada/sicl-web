# 17 — TV / Remote TV

## LUKA TV

La aplicación contiene superficies de emisión, canales, preview y navegación espacial. Los contratos describen manifest, show state y proyección. El manifest de MJP CORE conserva autoridad sobre lo que pertenece al núcleo.

## Remote TV / Controller Lab

El Controller Lab ofrece modos Game Pad, Trackpad, Keyboard y AR/TV, perfiles, color, orientación, feedback y pairing. WebSocket/session contracts modelan la comunicación. Esto es un controlador de interfaz y laboratorio; no prueba que un TV real reciba o ejecute cada comando.

## Protocolos

WebSocket requiere servidor/cliente compatible, pairing, expiración, latencia y receptor. Google Cast, DLNA/UPnP y Samsung/Tizen son dependencias externas; deben clasificarse EXTERNAL_REQUIRED hasta la prueba con hardware.

## Límites

Un comando de canal, volumen o navegación no puede cambiar RNG, RTP, wallet, ledger, settlement, reglas ni MjpTvManifest. El TV puede proyectar estado; no se convierte en autoridad del núcleo.

## Estado

UI y simuladores: VISUAL/SIMULATED o IMPLEMENTED parcial. Receptor real, interoperabilidad, latencia y cinco dispositivos físicos: NO_VERIFICADO/EXTERNAL_REQUIRED.
