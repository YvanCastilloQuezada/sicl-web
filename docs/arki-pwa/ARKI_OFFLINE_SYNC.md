# ARKI — Sincronización offline avanzada

ARKI guarda temporalmente el **intake inicial del proyecto** en una cola durable del dispositivo cuando la conexión no está disponible. La cola usa IndexedDB y emplea localStorage como fallback para navegadores antiguos. Cada operación conserva un identificador, timestamp, orden, número de intentos, próxima ventana de reintento y último error.

Al recuperar conectividad, el gestor global ejecuta las operaciones en orden: crea el proyecto y después persiste el intake con control optimista de versión. Los errores se reintentan con backoff exponencial hasta ocho intentos; los elementos que alcanzan el límite no se eliminan y quedan visibles para revisión. El service worker emite una señal opcional de Background Sync, pero la operación autenticada se ejecuta en la aplicación abierta para conservar las credenciales y la autoridad del usuario.

El service worker únicamente cachea el shell y recursos GET de la aplicación. No cachea `/api/`, `/trpc/`, `/oauth/` ni datos de proyecto. El intake offline contiene datos declarados por el usuario y permanece marcado `USER_PROVIDED` y `UNVERIFIED`; no se promueve automáticamente a evidencia, recomendación o decisión.

La optimización del bundle separa los proveedores de React, datos, UI, gráficos y 3D. Las páginas y visores 3D se cargan bajo demanda. En esta validación se obtuvieron 57 archivos de prueba y 273 pruebas exitosas; los artefactos 3D dejan de formar parte del arranque normal, aunque sus chunks individuales siguen siendo grandes y pueden optimizarse más en una fase posterior.

## Límite multidispositivo

La cola y el fallback 3D se pueden probar automáticamente en navegadores de escritorio. La compatibilidad física de cámara, WebXR, hit-test, orientación y anclaje sigue requiriendo Android moderno, Android antiguo e iPhone reales sobre HTTPS. Esa evidencia no se declara por inferencia ni por una prueba simulada.
