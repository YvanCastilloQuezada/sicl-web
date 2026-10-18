

## Reproducción pública — 2026-09-01

La ruta `https://ruletaperu-dnzxnqyn.manus.space/portal` responde por HTTPS y el contenido extraído contiene el emblema, título y botones, pero la captura visual aparece casi completamente vacía salvo el fondo oscuro y el footer. Esto indica una discrepancia crítica entre DOM/hidratación y render visual.

La ruta `https://ruletaperu-dnzxnqyn.manus.space/lukita-ar-stage?entry=portal` responde con `Cargando experiencia MiLukita…` y no progresa en la revisión de sandbox. El problema debe tratarse como bloqueo funcional, no como detalle estético. No se debe declarar listo para campo hasta corregirlo y repetir la prueba en el dominio público.


## Reproducción adicional

En la versión pública actual, el Portal responde y muestra el contenido mínimo. LUKA AR sí termina cargando la interfaz y el tutorial, pero muestra `AR NOT SUPPORTED` en sandbox y declara `Fallback 3D activo · el GLB por defecto no pudo cargarse`. La ruta no está bloqueada por loader infinito; el fallo real es la carga del asset GLB por defecto y la ausencia de WebXR en el entorno de prueba. Debe corregirse/verificarse el asset y probarse en un dispositivo compatible antes de campo.


## Correcciones aplicadas después de la reproducción

Se incrementó el caché del Service Worker a `multi-juegos-piloto-v3` y se eliminó la escritura de cualquier respuesta de navegación bajo la clave raíz `/`, evitando que una página antigua suplante a otra ruta. La portada ya no usa opacidad global para la transición, por lo que una captura durante el cambio no puede dejar todo el contenido invisible.

LUKA AR ahora presenta la imagen de referencia de Lukita como placeholder visual independiente mientras el GLB se valida; además, el estado de error explica que el candidato no está disponible y ofrece reintentar o cargar otro GLB. Esto mejora el comportamiento reversible, pero no convierte el fallback en WebXR ni reemplaza el Character Foundation aprobado.

Validación local posterior: TypeScript PASS, Vitest PASS y build PASS. La versión pública debe actualizarse únicamente mediante el flujo de publicación administrado; no se declara corregida en producción hasta repetir la comprobación pública después de Publish.


## Verificación local posterior

La revisión móvil local muestra el Portal con emblema, hero, título y botones visibles. En LUKA AR, el tutorial responde al botón `Siguiente` y el estado cambió a `GLB candidato cargado por defecto · no sustituye al maestro` tras cambiar al asset con padding JSON válido. El entorno sigue mostrando `AR NOT SUPPORTED`, lo cual es una limitación del navegador de sandbox, no una autorización para declarar WebXR físico validado.


## Revisión adicional de rutas públicas

`/mapper` quedó atrapado en `Cargando experiencia MiLukita…` durante la reproducción pública, por lo que no debe declararse operativo aunque la ruta HTTP responda.

`/the-eye` sí muestra un flujo de autenticación, pero en sandbox no es posible continuar sin una sesión válida. La pantalla pública actual es genérica y no prueba el módulo de revisión; el acceso requiere una prueba con credenciales/autorización Human Authority.


## Corrección aplicada y validación

Se separaron `/mapper` y `/the-eye` del alias directo al dashboard monolítico: ahora muestran una entrada móvil de Field Gate con branding, rol, explicación de permisos, retorno al portal y login seguro; después de autenticar, conservan la vista administrativa y sus RBAC. `/mapper-the-eye` continúa como acceso administrativo directo.

También se corrigió el Service Worker para evitar HTML obsoleto y se reforzó LUKA AR con GLB corregido, placeholder visual y reintento accionable. Validación local de esta iteración: TypeScript sin errores, 135 archivos de prueba aprobados y 482 pruebas aprobadas, 4 omitidas; build PASS. La certificación WebXR, GPS, cámara, micrófono y captura real sigue pendiente de hardware y HTTPS público actualizado.


## Verificación posterior al checkpoint 226390f8

El entorno local sí muestra la entrada de campo y `/mapper` autenticado muestra el dashboard. Sin embargo, el dominio público continúa devolviendo el login genérico de `DashboardLayout` tanto en `/mapper` como en `/mapper?build=226390f8`. Esto indica que la versión pública observada no está sirviendo todavía el bundle de la corrección o que existe una caché de despliegue externa al Service Worker. No se debe declarar corregida la experiencia pública hasta repetir esta verificación tras una publicación efectiva.
