# Evidencia de QA del Control Room

- URL revisada: https://3000-i2iir7cc4y7kro7s9cjv5-72fa419e.us4.manus.computer/control-room
- La página cargó en el navegador Sandbox y mostró el estado operativo, Identity & Participation, Event log y paneles diferidos.
- El entorno mostró una sesión sin datos persistidos de dispositivos/sesiones y el panel indicó NO DATA / NOT MEASURED donde correspondía; no se formularon claims.
- La sección de eventos mostró polling de WATCHDOG_HEALTH y controles de búsqueda/exportación.
- Se observó que los paneles constitucionales se cargan al acercarse mediante deferred loading, por lo que el PDF constitucional requiere desplazamiento adicional y una sesión administrativa para probar el endpoint protegido.
- Esta evidencia es QA de navegador Sandbox; no certifica Smart TV, Android TV, iOS físico, lectores de pantalla ni escaneo QR físico.

## Prueba PDF administrativa

En la sesión de navegador disponible se abrió el modal de confirmación de revisión documental sin confirmar la decisión. El modal mostró la opción `Descargar resumen PDF`. Al activarla, el navegador abrió el PDF firmado mediante una URL segura de almacenamiento. El documento visible mostró el contrato `MILUKITA-MASTER-REALIGNMENT-01`, modo `CONSOLIDATION_FREEZE`, decisión documental `HUMAN_APPROVED`, alcance exclusivamente documental y límites sobre MJP CORE, agentes, distribución externa, resultados, RNG, RTP, wallet, ledger, settlement y dinero real. La prueba confirma generación y apertura del PDF; no confirma la aprobación ni una autorización productiva.

## QA reproducible TV/QR

Se capturaron `/tv` y `/generador-qr` en 1280×720 y 390×844. En TV se observan las dos opciones de visualización, `Ver transmisión en vivo` y `Ver en línea`; en móvil el contenido se adapta a una columna sin overflow visible en el viewport inicial. El generador QR carga con controles de destino TV en vivo/TV en línea y mantiene el aviso `REVIEW_ONLY`.

La ruta `/overlay` sin `:roundId` devuelve 404, lo cual es esperado porque el contrato de la ruta requiere un identificador de ronda. El overlay completo debe verificarse desde una ronda seleccionada en Control Room; no se inventó un identificador ni se creó una ronda de prueba.

Resultado: QA visual reproducible en navegador Sandbox PASS para TV y QR en desktop/móvil; certificación en Samsung Tizen, LG webOS, Android/Google TV, iOS/Android físicos y escaneo real permanece NO VERIFICABLE en este entorno.

## Reejecución

En la segunda ejecución se repitieron las capturas de `/tv` y `/generador-qr` a 390×844. Ambas rutas cargaron correctamente; TV mantuvo las opciones `Ver transmisión en vivo` y `Ver en línea`, y QR Studio mantuvo la presentación personalizada con la etiqueta `REVIEW_ONLY`. La captura es emulación de viewport en navegador y no equivale a prueba de hardware ni de escaneo óptico.
