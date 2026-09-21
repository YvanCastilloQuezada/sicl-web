# ARKI — Modo 3D alternativo para dispositivos sin AR

Field Mode ahora ofrece **Abrir visualización 3D alternativa**. El botón dirige al visor espacial 3D existente en `/spatial?mode=3d`, que reutiliza la misma `SpatialRepresentation` canónica que consumen el visor 2D y la experiencia AR. No se crea una geometría paralela ni se envía la cámara al servidor.

El visor utiliza renderizado local con React Three Fiber/Three.js y controles de órbita. Permite rotar, desplazar, acercar/alejar, reiniciar la cámara y seleccionar masas para inspeccionar sus identificadores y alturas. Si WebGL/3D falla, conserva el fallback 2D y las métricas textuales; no inventa geometría.

La selección progresiva queda así: WebXR immersive-ar con hit-test y anclaje cuando el dispositivo lo expone; cámara/orientación en modo degradado; visor 3D local para inspección espacial sin AR; y vista 2D/métricas como último nivel. La capacidad 3D no equivale a tracking espacial ni a anclaje en el terreno.
