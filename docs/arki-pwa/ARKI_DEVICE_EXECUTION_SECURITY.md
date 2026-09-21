# ARKI — Ejecución local en dispositivos y seguridad

Ejecutar parte del código en el teléfono puede reducir latencia, mejorar disponibilidad offline y evitar enviar imágenes o geometría innecesariamente. No es automáticamente inseguro, pero el dispositivo del usuario debe considerarse **entorno no confiable**: el JavaScript puede inspeccionarse, modificarse, depurarse o ejecutarse fuera de la aplicación prevista.

Por ese motivo, la ejecución local de ARKI no debe contener secretos, claves privadas, credenciales, tokens permanentes, reglas de autorización definitivas ni decisiones que deban ser inmutables. El navegador puede proponer geometría, detectar superficies, calcular previews y preparar evidencias; el servidor/SICL Core debe seguir siendo la autoridad para identidad, permisos, persistencia canónica, publicación, auditoría, facturación y decisiones protegidas. Toda entrada recibida desde el móvil debe validarse nuevamente en servidor y asociarse al proyecto y usuario autorizados.

El adaptador ARKI usa WebXR cuando está disponible y falla de manera explícita a cámara/orientación cuando no. El botón **Reiniciar detección** cierra la sesión actual, libera el hit-test source y el reference space, limpia el estado de superficie/anclaje y vuelve a solicitar capabilities y sesión después de una breve pausa. Esto permite recuperarse de sesiones atascadas sin ocultar el resultado: `FOUND` significa que el runtime entregó una pose de hit-test; no significa que el anclaje sea persistente, métrico o apto para construcción.

La validación de Android moderno, Android antiguo e iPhone compatible requiere dispositivos físicos, permisos reales y HTTPS. El entorno local no debe declarar ese resultado por simulación de navegador.
