# MiLukita Mapper — Manual del operador de campo

**Versión 1.0 · Uso operativo en sandbox**

> Mapper convierte observaciones del territorio real en WorldObjects trazables. No publica por sí solo: captura, documenta y envía expedientes a The Eye.

## Flujo recomendado

| Paso | Qué hacer | Resultado esperado |
|---|---|---|
| Preparar | Iniciar sesión, verificar HTTPS, GPS, cámara y rol Mapper | Dispositivo listo |
| Sesión | Crear una CaptureSession con territorio y responsable | Capturas agrupadas |
| Capturar | Registrar foto, coordenadas, precisión y nota | Objeto `CAPTURED` |
| Completar | Añadir Claims, Sources y Evidence | Expediente trazable |
| Revisar | Guardar versión y enviar a The Eye | Objeto `UNDER_REVIEW` |
| Offline | Continuar con `LOCAL_PENDING` y sincronizar después | Cola controlada |
| Conflicto | Comparar local/remota y solicitar decisión humana | Ninguna versión se pierde |

## Permisos y seguridad

La aplicación solicita GPS y cámara solamente después de una acción explícita. El entorno de producción requiere HTTPS. Si el permiso se deniega, abre el candado de la barra de direcciones, habilita el permiso y vuelve a intentarlo. Si no es posible, registra la incidencia y usa coordenadas o archivos manuales sin inventar precisión.

## CaptureSession

Crea una sesión por territorio, jornada o levantamiento coherente. No mezcles objetos de lugares distintos. La sesión sirve para ordenar datos y no cambia el workflow individual de cada WorldObject.

## Captura y expediente

Registra nombre, tipo, descripción, ubicación, precisión, fotografía, nota y fecha observada. Después completa Claims con afirmaciones concretas, Sources con institución o referencia y Evidence con documentos, enlaces o fotografías. Guarda una versión antes de enviar a The Eye.

## Trabajo sin conexión

Cuando aparece `OFFLINE`, los datos se mantienen localmente. `LOCAL_PENDING` significa que aún no se han enviado; `SYNCING` indica intento de envío; `SYNCED` confirma persistencia; `CONFLICT` requiere comparación; `SYNC_ERROR` requiere revisar red y reintentar. La sincronización no publica automáticamente.

## Mapas offline

Activa el modo de dibujo, traza un polígono pequeño, revisa la zona y acepta el consentimiento. El sistema limita teselas y almacenamiento. Limpia la zona si ya no es necesaria. Las teselas externas dependen del proveedor y no sustituyen una cartografía certificada.

## Preguntas frecuentes

**¿Puedo publicar desde Mapper?** No. La publicación requiere verificación de The Eye y autorización separada de Human Authority.

**¿Qué hago si el GPS es impreciso?** Registra el valor observado, repite la lectura si es seguro y deja una observación; no reemplaces el dato con una estimación.

**¿Qué hago ante un conflicto?** No sobrescribas. Compara local y remota y escala la decisión a The Eye/Human Authority.

## Soporte

Conserva el identificador del WorldObject, CaptureSession, dispositivo, navegador, hora, estado de red y mensaje visible. El soporte debe poder reproducir el incidente sin acceder a MJP CORE.

> Este manual guía el sandbox y el gate de campo. No certifica hardware, GPS, cámara, cartografía ni producción. MJP CORE permanece fuera de este dominio.
