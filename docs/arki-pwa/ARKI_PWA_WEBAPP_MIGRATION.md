# ARKI WebApp / PWA — migración consolidada

ARKI se entrega como una única aplicación web instalable, no como un programa paralelo. El manifiesto define `/arki` como entrada, modo standalone, identidad visual, categorías y alcance global. El shell se registra mediante `main.tsx` únicamente en producción para no interferir con HMR durante desarrollo.

El service worker usa una estrategia de shell y caché progresiva: precachea la entrada, manifiesto, pantalla offline e icono; cachea recursos GET del mismo origen después de cargarlos; sirve la interfaz desde caché cuando la navegación falla; y excluye `/api/`, `/trpc/` y `/oauth/`. Por tanto, no se cachean respuestas de identidad, sesiones, mutaciones, datos canónicos ni operaciones protegidas.

La interfaz incluye aviso de instalación mediante `beforeinstallprompt`, aviso de actualización, estado offline y una acción de recarga. Las capacidades locales —preview geométrico, 3D, Field Mode y caché de interfaz— pueden continuar cuando sea razonable. La autenticación, permisos, Project State canónico, persistencia, decisiones humanas y sincronización siguen dependiendo del servidor.

La PWA no equivale a una aplicación nativa ni garantiza acceso a WebXR, cámara, GPS o anclaje en todos los dispositivos. La compatibilidad se debe verificar por capability detection y pruebas físicas.
