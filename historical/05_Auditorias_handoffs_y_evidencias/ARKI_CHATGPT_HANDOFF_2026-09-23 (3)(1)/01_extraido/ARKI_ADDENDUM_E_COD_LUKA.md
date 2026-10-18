# ARKI — Addendum E: Integración con el Cuaderno de Obra Digital

**Versión:** 1.0  
**Estado:** Registrado como alcance futuro; no implementado  
**Dependencias:** UI-3, UI-4, backend persistente, módulo de campo y autorización del OECE  
**Separación:** Este addendum no modifica UI-2 ni UI-3A.

## 1. Propósito

El Addendum E define la integración futura entre el modelo semántico de ARKI, el agente inteligente ARKI/Luka y el Cuaderno de Obra Digital o Cuaderno de Incidencias administrado por el OECE. Su objetivo es conectar eventos de obra, evidencias, elementos BIM, metrados, costos y consultas técnicas con los registros contractuales de la ejecución.

El sistema debe distinguir entre **capturar y preparar información** y **escribir automáticamente en el sistema estatal**. La primera capacidad puede desarrollarse sin una API estatal. La segunda requiere un canal oficial, autorización y cumplimiento de los requisitos aplicables.

## 2. Capacidades objetivo

El modo de obra de ARKI podrá usar el celular para capturar fotografías, videos, voz, ubicación y observaciones. Luka podrá aportar visión artificial, OCR, lectura de planos, reconocimiento de ambientes y asistencia contextual cuando exista código verificable para esas capacidades.

La captura deberá asociarse a una obra, usuario, fecha, hora, ubicación y elemento del modelo. La asociación podrá realizarse mediante selección en plano, QR, identificación visual o realidad aumentada, según la capacidad implementada y verificada.

ARKI podrá generar un asiento prellenado con título, tipo, descripción, elemento afectado, partida, metrado, ubicación, evidencia y referencias técnicas. El residente o supervisor deberá revisar el contenido y conservar la responsabilidad de firmarlo y presentarlo.

Cuando exista API o convenio oficial, se podrá habilitar sincronización bidireccional. Esa fase no se considera disponible actualmente.

## 3. Fases

### Fase 0 — Investigación y preparación institucional

Se documentarán los requisitos normativos y técnicos vigentes, se contactará al OECE para conocer los canales oficiales de interoperabilidad y se identificarán constructoras o entidades para un piloto. No se realizará scraping ni automatización no autorizada del sistema estatal.

### Fase 1 — Captura móvil y preparación de asientos

Se implementará una PWA o aplicación móvil para capturar evidencia geolocalizada, vincularla al modelo y generar un asiento prellenado para revisión y carga manual en el COD. Esta fase no requiere escritura automática en el COD.

### Fase 2 — Panel de control

Se mostrará la relación entre asientos, elementos BIM, partidas, metrados y avance programado. La información podrá provenir de carga manual, archivos autorizados o datos públicos de consulta. La trazabilidad deberá conservar origen, usuario, timestamp y hash cuando corresponda.

### Fase 3 — Integración bidireccional oficial

Se habilitará lectura y escritura automática únicamente mediante API, convenio o mecanismo oficial autorizado por el OECE. La integración deberá incluir autenticación, autorización, firma, reintentos, idempotencia, auditoría e invalidación de sincronizaciones.

### Fase 4 — Certificación y operación institucional

Se preparará ARKI para un proceso de validación, certificación o reconocimiento que corresponda. Esta fase depende de decisiones externas al proyecto.

## 4. RFIs y consultas técnicas

ARKI podrá generar un RFI o consulta técnica cuando una captura, clash, discrepancia del modelo, medición o lectura de plano requiera aclaración. El RFI debe incluir pregunta, contexto, elementos afectados, documentación de respaldo, impacto estimado en costo/plazo y estado de respuesta.

La generación asistida no equivale a una decisión contractual. Toda respuesta deberá conservar autor, fecha, fundamento y documento de respaldo.

## 5. Trazabilidad y seguridad

Cada evidencia y asiento preparado debe conservar como mínimo identificador determinista, obra, usuario, timestamp, ubicación cuando exista, fuente, hash, relaciones BIM y estado de validación. El sistema debe impedir que una edición posterior borre la historia anterior.

Las funciones de firma digital, identidad RENIEC y presentación oficial deben delegarse al flujo autorizado por el sistema estatal hasta que exista una integración formal aprobada.

## 6. Estado actual y limitaciones

No existe en el repositorio actual código verificable de Luka para visión, OCR, realidad aumentada, voz o cámara. Por ello, esas capacidades permanecen **FUTURE REFERENCE / NOT IMPLEMENTED**.

No se ha identificado una API pública documentada para escritura de terceros en el COD durante la revisión actual. Esta conclusión no demuestra que una API privada o futura no exista; debe confirmarse directamente con el OECE.

ARKI no debe declarar integración automática con el COD hasta contar con código, pruebas, autorización y evidencia de extremo a extremo.

## 7. Criterios para abrir la implementación

La apertura del Addendum E requiere: contrato propio por fase, ADR de integración, backend persistente, modelo semántico interactivo, almacenamiento de evidencias, política de seguridad, pruebas de trazabilidad y definición del canal oficial de interoperabilidad.

## Referencias

[1]: https://www.gob.pe/institucion/oece/normas-legales/7281401-017-2025-oece-cd "Directiva N.° 017-2025-OECE-CD"

[2]: https://www.gob.pe/10601-acceder-al-cuaderno-de-incidencias-de-obra "Acceder al cuaderno de incidencias de obra"

[3]: https://www.gob.pe/institucion/oece "Organismo Especializado para las Contrataciones Públicas Eficientes"
