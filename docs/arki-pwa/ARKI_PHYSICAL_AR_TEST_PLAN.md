# ARKI — Protocolo de pruebas físicas AR/WebXR

## Estado

La compatibilidad física real no puede declararse desde un navegador de escritorio ni desde el sandbox. El código incorpora detección de capacidades, hit-test opcional, anclaje, fallback 3D y reinicio manual; el cierre de este gate requiere dispositivos físicos y HTTPS.

## Matriz mínima

| Grupo | Dispositivo | Evidencia requerida |
|---|---|---|
| Android moderno | Chrome/Android con ARCore | `immersive-ar`, hit-test, orientación, anclaje y recuperación |
| Android antiguo | Navegador compatible sin WebXR completo | Fallback de cámara/orientación y visor 3D, sin pantalla bloqueada |
| iPhone compatible | Safari/iOS con capacidades disponibles | Cámara, orientación, degradación controlada y retorno al visor 3D |

## Procedimiento

1. Abrir el dominio HTTPS desde el QR permanente y conceder cámara, orientación y ubicación solo cuando el usuario lo solicite.
2. Iniciar Field Mode y registrar el catálogo de capabilities detectado sin guardar imágenes ni coordenadas sensibles por defecto.
3. Mover el dispositivo hasta que aparezca el indicador de detección de superficies.
4. Ejecutar hit-test sobre una superficie horizontal y colocar dos estacas virtuales de calibración.
5. Confirmar que el anclaje permanece estable durante 30 segundos y después girar el dispositivo 180 grados.
6. Pulsar **Reiniciar detección** y comprobar que la sesión vuelve a un estado utilizable.
7. Repetir con conectividad intermitente y comprobar que los datos de intake se encolan localmente y se sincronizan al recuperar conexión.
8. En dispositivos sin AR, comprobar que el visor 3D alternativo abre sin bloquear el arranque.

## Criterios de aprobación

Se requiere evidencia de video o capturas, modelo de dispositivo, sistema operativo, navegador, permisos concedidos, capabilities reportadas, resultado de hit-test/anclaje, latencia percibida, recuperación y errores de consola. Hasta recopilarla, el estado correcto es `PENDING_PHYSICAL_DEVICE_EVIDENCE`, no `PASS`.
