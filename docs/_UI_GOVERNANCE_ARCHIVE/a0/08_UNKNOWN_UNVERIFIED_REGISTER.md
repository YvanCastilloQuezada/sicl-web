# A0 — Registro de UNKNOWN_UNVERIFIED

La clasificación dominante de A0 es `UNKNOWN_UNVERIFIED`: 1336 de 1336 ocurrencias de control. Esto no significa que todas estén rotas. Significa que el inventario fuente no contiene suficiente evidencia de ejecución para afirmar que funcionan en las condiciones reales del producto.

Los motivos principales son la falta de una prueba E2E completa por ruta, la falta de una matriz de permisos y persistencia por acción, la presencia de handlers cuyo efecto depende de tRPC, WebSocket, almacenamiento del navegador o APIs del dispositivo, y la imposibilidad de deducir el estado final a partir del JSX.

Esta clasificación debe mantenerse hasta ejecutar la matriz de pruebas. No se debe convertir automáticamente en `FUNCTIONAL` por pasar TypeScript o build.
