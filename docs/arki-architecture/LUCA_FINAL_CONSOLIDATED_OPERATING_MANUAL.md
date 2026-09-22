# LUCA — Consolidado final operativo

## 1. Propósito

LUCA es la inteligencia operativa de MiLukita. Su especialidad es la georreferenciación, la visión de campo, la publicidad espacial, la interoperabilidad entre dispositivos, la conversación y la presentación audiovisual. No reemplaza a ARKI: LUCA opera el territorio, la campaña, el dispositivo y la experiencia del usuario; ARKI opera la arquitectura, BIM, razonamiento de proyecto y coordinación transversal.

Ambos pertenecen al mismo propietario y comparten contratos, seguridad, trazabilidad y ciertos asistentes. Cada producto conserva su propio Core, base de datos, credenciales, identidad y estado canónico.

## 2. Nombre del coordinador

El coordinador entre ambos productos se llama **AR-LU Federated Orchestrator v1.0**. No es un tercer cerebro. Es un control plane que selecciona asistentes, conserva provenance, crea handoffs y los deja en revisión humana cuando una acción cambia estado, publica contenido o conecta un proveedor.

## 3. Formato común Delta 6.2

LUCA usa `DELTA-6.2-FEDERATED-KNOWLEDGE-1.0`, el mismo formato estructural de ARKI. Cada registro contiene `recordId`, producto, dominio, título, afirmación, tipo, estado epistemológico, provenance, commit de origen, archivo de origen, dependencias, confianza y gate humano.

La estructura es compartida, pero los datos no se mezclan automáticamente. `SHARED` contiene contratos comunes. `ARKI` contiene conocimiento arquitectónico y de ingeniería. `LUCA` contiene georreferenciación, visión, marketing espacial, dispositivos, experiencia y operación territorial. Todo lo que LUCA aprenda comienza en `STAGED` y no se convierte en conocimiento canónico sin revisión.

## 4. Conocimiento inicial único de LUCA

LUCA inicia con cinco registros propios: georreferenciación contextual, visión artificial y OCR, publicidad espacial, interoperabilidad de dispositivos y gobierno de no mutación del Core. Estos registros son una semilla operativa, no una afirmación de aprendizaje completo. La biblioteca puede crecer mediante fuentes trazables, pero no debe descargar o canonizar libros sin revisar derechos, licencia y procedencia.

## 5. Cómo funciona sin intervención rutinaria

El modo normal es `AUTONOMOUS_STAGING`. LUCA puede ingerir fuentes autorizadas, clasificar observaciones, enriquecer candidatos, validar estructura, preparar campañas, preparar escenas AR, preparar guiones, preparar QR y crear propuestas. Cada ciclo produce un `cycleId`, una traza y un estado.

La cadena estándar es:

```text
INGEST → CLASSIFY → ENRICH → VALIDATE → STAGE → PROPOSE → WAIT_HUMAN_GATE → PUBLISH_OR_FREEZE
```

La operación autónoma termina en `STAGE` o `WAIT_HUMAN_GATE` cuando una acción es pública, financiera, legal, destructiva, cambia autoridad, conecta un proveedor o muta un Core. En esos casos el sistema conserva la propuesta y la envía a la bandeja AR-LU. El propietario sólo necesita revisar decisiones excepcionales; no necesita dirigir cada ciclo rutinario.

## 6. Comandos operativos

Para iniciar un ciclo de conocimiento se usa el contrato `runLucaAutonomousCycle` con un identificador, modo, lista de fuentes y acción `INGEST_KNOWLEDGE`. Para una observación de campo se usa `REVIEW_FIELD`. Para preparar publicidad se usa `PREPARE_CAMPAIGN`. Para preparar una emisión se usa `PREPARE_TV`. `PUBLISH` nunca publica directamente: queda en `WAIT_HUMAN_GATE`.

Cada handoff se registra en `federated_assistant_handoffs`. La bandeja permite aprobar, rechazar o congelar. `APPROVED` significa que la propuesta pasó el gate humano; no significa que un proveedor externo esté conectado ni que una autoridad profesional haya firmado un resultado.

## 7. Capacidades que LUCA recibe de ARKI

LUCA reutiliza los contratos de seguridad MANIAC, provenance, auditoría, detección de contradicciones, consecuencia, valor de información, aprendizaje por etapas, revisión de fuentes, protección contra alucinaciones, control de dispositivos, voz/campo y gobierno humano. Puede solicitar razonamiento arquitectónico de ARKI, pero recibe una respuesta trazable y acotada. No obtiene acceso directo a secretos ni al Core de ARKI.

## 8. Adaptadores preparados

El adaptador de voz/campo detecta HTTPS, cámara, micrófono, geolocalización y reconocimiento de voz. En Manus funciona con permisos del navegador y queda en `PERMISSION_REQUIRED` cuando corresponde. El adaptador de dispositivos usa capacidades reales del navegador como BroadcastChannel, WebRTC y WebSocket. Requiere contexto seguro, gesto del usuario, pairing auditado y un receptor identificado.

El adaptador de distribución valida checksum, metadatos y proveedor. En Manus funciona en modo de preparación y preview. Mañana, en el servidor Ubuntu, se podrán conectar credenciales server-side y proveedores sandbox sin cambiar el contrato. La publicación seguirá requiriendo revisión y no debe exponerse ninguna credencial al navegador.

## 9. ARKI-TV

`ARKI-TV-1.0` queda creado y congelado en ARKI y LUCA. ARKI-TV es el canal para explicar proyectos, revisar BIM, presentar decisiones, mostrar resultados de campo y combinar asistentes. Puede incluir a ARKI, LUCA, ARKI-BIM, ARKI-FIELD y ARKI-COST como presentadores.

El estado `FROZEN` significa que la arquitectura está preservada y no debe activarse como canal público todavía. No significa rechazo. Sus invariantes son: no publicación sin aprobación, no mutación de Core, no transferencia de secretos y autoridad humana final. Para activarla se necesitarán proveedor audiovisual, identidad de emisión, política de contenidos, pruebas físicas y revisión profesional.

## 10. Seguridad

LUCA no puede aprobar resultados financieros, alterar juegos, cambiar RNG, editar ledger, cambiar permisos, publicar campañas públicas, borrar auditoría ni mutar un Core. La separación entre el negocio publicitario de LUCA y los componentes históricos de juegos permanece explícita. El modo autónomo no elimina autenticación ni reemplaza la revisión humana.

## 11. Ejecución en Manus y migración al servidor Ubuntu

En Manus se pueden probar la interfaz, la bandeja, la persistencia, los contratos Delta, la simulación, la captura de permisos y la interoperabilidad disponible en el navegador. La conexión real a proveedores externos, el pairing físico estable, las pruebas multidispositivo y la distribución sandbox deben ejecutarse en el servidor Ubuntu cuando esté disponible.

La migración recomendada es conservar el mismo contrato y trasladar únicamente configuración server-side: URL del proveedor, credenciales, almacenamiento, workers y observabilidad. No se debe copiar ningún secreto al repositorio ni al cliente. Primero se ejecuta en sandbox, después se prueban fallos, luego se habilita producción mediante un gate explícito.

## 12. Resultado esperado

LUCA queda preparada para trabajar de forma autónoma en tareas rutinarias de staging, aprendizaje controlado, campo, campañas y experiencia. ARKI-LU Orchestrator mantiene el vínculo entre ambos. El sistema no promete autonomía productiva total hasta probar proveedores reales, dispositivos físicos, recuperación distribuida y operación prolongada.

**Estado final:** contrato operativo implementado, conocimiento Delta 6.2 particionado, ARKI-TV congelado, adaptadores preparados, publicación externa bloqueada hasta disponer de servidor y gates.
