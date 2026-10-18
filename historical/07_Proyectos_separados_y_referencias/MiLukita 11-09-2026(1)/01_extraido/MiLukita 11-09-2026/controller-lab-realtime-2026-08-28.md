# MiLukita Controller Lab — WebSocket y consola configurable

**Fecha:** 28 de agosto de 2026.  
**Alcance:** Controller Lab, pantalla `/tv` vinculada y canal de comandos de presentación.

## Implementado y probado

El controlador móvil expone cuatro modos con una línea perimétrica neón, selector de modo, candado anti-toques, retorno y luz de conexión. Sus posiciones y colores se modifican únicamente desde `/touch-remote`, y se guardan dentro de perfiles locales del Controller Lab. El teclado combina una zona mayoritaria de teclas con un puntero táctil a la derecha. La ayuda explica cada modo, candado, retorno y señal de conexión.

Se añadió el endpoint WebSocket `/controller-realtime`. Usa un token móvil y un token de pantalla distintos, ambos validados por hash en servidor. El teléfono requiere una sesión QR autenticada antes de enviar un mensaje y la pantalla debe autenticar su token de pantalla. Los comandos se validan, persisten de forma idempotente, registran evento y se reenvían solo a pantallas que presenten el token correcto. La TV conserva el polling seguro de 750 ms como respaldo cuando el WebSocket no está disponible.

| Control | Estado | Límite |
|---|---|---|
| Sesión QR temporal | IMPLEMENTADO | Un solo celular vinculado; vencimiento 60–1.800 s |
| WebSocket Controller Lab | IMPLEMENTADO EN CÓDIGO | Requiere activar servicio persistente antes de declararlo operativo en producción |
| Roles USER/PRESENTER/OPERATOR | IMPLEMENTADO | Solo ADMIN asigna roles; usuario admin equivale a OPERATOR del Lab |
| Configuración visual | IMPLEMENTADO | Solo ocurre en Controller Lab; el mando embebido TV no permite cambiar color |
| Acceso a MJP CORE | BLOQUEADO | No se admiten comandos de RNG, resultados, reglas, wallet, ledger, settlement, créditos ni manifest |

## Evidencia

`pnpm check` aprobó. La regresión aprobó **98 archivos y 331 pruebas**, con **4 pruebas omitidas**; el build aprobó en **7,50 s**. Persistió una advertencia de tamaño para `vendor-three` (568,57 kB; 143,56 kB gzip), aislado del Controller Lab. La revisión visual móvil a 390×844 confirmó el borde neón, controles en esquinas y panel de configuración sin desbordamiento horizontal observable.

## Pendiente de validación externa

La activación de alojamiento persistente confirmada por el propietario debe completarse en el panel de publicación antes de declarar el WebSocket estable 24/7. Aún se requiere una prueba entre teléfono y pantalla reales para medir latencia, reconexión y hápticos en hardware.
