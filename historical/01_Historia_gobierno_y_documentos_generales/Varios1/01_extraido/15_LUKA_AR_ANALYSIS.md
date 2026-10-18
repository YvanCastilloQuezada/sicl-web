# 15 — LUKA AR / WebAR

## Entrada

La entrada puede proceder del Portal, QR o ruta directa `lukita-ar-stage`; los parámetros de entrada son contexto de navegación, no autorización.

## Runtime

La página usa Three.js y addons cargados bajo demanda, GLTFLoader, controles y fallback visual. Puede cargar un GLB remoto o seleccionado localmente y mostrar placeholder/referencia visual. El contrato de AR debe mantenerse separado de la publicación territorial.

## Permisos

Cámara y ubicación requieren contexto seguro y permiso explícito. WebXR requiere navegador/dispositivo compatible y detección de plano. El rechazo debe producir recuperación guiada, no una afirmación de AR funcionando.

## GLB/GLTF

El archivo debe ser válido, autocontenido o tener dependencias accesibles, con buffers/texturas correctos, tamaño y compresión adecuados. Un asset inválido o un header/cache incorrecto causa fallback aunque el código del loader sea correcto.

## Estado real

Three.js, loader, placeholder, selección local y feedback de carga: IMPLEMENTADO PARCIAL. WebXR real, calibración, rendimiento, iluminación, cámara y modelo definitivo: EXTERNAL_REQUIRED/NO_VERIFICADO.

## Prohibiciones

AR no publica WorldObjects, no verifica claims, no cambia MJP CORE y no debe presentar datos no publicados como realidad oficial.
