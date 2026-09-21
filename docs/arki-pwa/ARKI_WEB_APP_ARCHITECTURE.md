# ARKI Web App — arquitectura PWA y First Contact

## Estado

La aplicación existente evoluciona a **ARKI Web App** sin crear un producto paralelo. El mismo `Project State`, Command Resolver, catálogo canónico, Parametric Runtime, Escuela y operaciones siguen siendo las superficies existentes de ARKI.

## Capas de datos

| Capa | Uso | Regla |
|---|---|---|
| Client | Estados visuales, controles, preview, permisos explícitos | No constituye persistencia profesional por sí sola |
| Server | tRPC, sesión, Project State, archivos y decisiones | Fuente de verdad para operaciones protegidas |
| Cache | Recursos estáticos PWA y fallback offline | Nunca cachea indiscriminadamente `/api`, tRPC o datos sensibles |
| Local storage | Preferencias, First Contact completado, ancho del panel | No equivale a una cuenta ni a autorización |
| Project persistence | Sesiones, archivos y decisiones asociadas a proyecto | Requiere operación explícita y permisos apropiados |

## PWA

`manifest.webmanifest`, `arki-icon.svg`, `sw.js` y `offline.html` preparan instalación, actualización y fallback. El service worker usa una estrategia network-first para navegación y cache-first con actualización en segundo plano para recursos GET del mismo origen. Las rutas API y tRPC quedan fuera de la caché.

## First Contact

`ArkiFirstContact` aparece primero en `/` y `/arki`, pregunta intención antes de solicitar un proyecto y ofrece construcción, profesional, Parametric, Escuela y demo. Permite texto libre, conserva `UNKNOWN` cuando no hay suficiente contexto y redirige solicitudes claramente ajenas sin desarrollar una conversación generalista. El estado de UX (`INTRO`, `LISTENING`, `GUIDING`, `MINIMIZED`, `SLEEP`) permanece separado de `EXPLORE`, `APPLY` y `DECIDE`.

La persistencia o el acceso a funcionalidades protegidas pueden solicitar identidad más adelante. El bypass temporal de interfaz continúa controlado exclusivamente por `TEMPORARY_DIRECT_ACCESS`; la autenticación real del backend no se modifica.

## Parametric y Field Mode

ARKI Parametric continúa reutilizando `/arki-parametric-runtime` como entrada independiente y ya no depende visualmente del panel lateral para su primera apertura. Field Mode vive en `/field` y solo pide cámara o ubicación después de una acción explícita. Esta fase distingue `CAMERA_OVERLAY`, `AR_PLACEMENT`, `WORLD_TRACKING` y `SPATIAL_ANCHORING`; la implementación actual declara `NORMAL_MODE` y `AR_PENDING_EXTERNAL`, no un anclaje espacial ficticio.

## Preparado, no afirmado

Los botones de proveedores sociales y los workers propietarios Dynamo/Revit/Rhino/Grasshopper requieren configuración externa. No se declaran conectados por el mero hecho de preparar la interfaz o los contratos.
