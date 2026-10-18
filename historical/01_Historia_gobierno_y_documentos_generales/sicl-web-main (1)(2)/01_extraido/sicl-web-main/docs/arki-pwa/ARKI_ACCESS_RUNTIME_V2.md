# ARKI Access Runtime v2

## Adaptador espacial

Field Mode incorpora un adaptador WebXR opcional. Primero inspecciona `immersive-ar`; si existe, solicita una sesión con `local-floor` y ofrece `hit-test`, `dom-overlay` y `anchors` como capacidades opcionales. Si el navegador no soporta WebXR, conserva un modo degradado con cámara y orientación del dispositivo. La interfaz distingue cámara, inmersión, world tracking, hit-test y anclaje espacial. La detección de capacidad no se presenta como prueba de precisión ni de persistencia de anclajes.

## Login social

First Contact muestra el acceso ARKI/Manus existente y proveedores Google, Microsoft y Apple como opciones configurables. Los botones sociales se habilitan solamente cuando el administrador configura `VITE_SOCIAL_GOOGLE_AUTH_URL`, `VITE_SOCIAL_MICROSOFT_AUTH_URL` o `VITE_SOCIAL_APPLE_AUTH_URL`. La aplicación no inventa callbacks ni almacena credenciales; la integración real requiere un gateway OAuth autorizado que valide estado, nonce, cookies y callback antes de emitir la sesión ARKI.

## Project State

El procedimiento protegido `projects.saveInitialIntake` crea o actualiza el proyecto con control optimista de versión y escribe `initialIntake` en el snapshot canónico. El bloque conserva intención, ubicación, terreno, dimensiones, ocupantes y presupuesto; los datos no conocidos se guardan literalmente como `UNKNOWN`, con `provenance=USER_PROVIDED` y `epistemicStatus=UNVERIFIED`. Cada escritura genera el evento `INITIAL_INTAKE_PERSISTED`. Si existe un SICL Core remoto, el procedimiento se detiene hasta disponer del endpoint canónico de intake; no se emula una escritura remota.
