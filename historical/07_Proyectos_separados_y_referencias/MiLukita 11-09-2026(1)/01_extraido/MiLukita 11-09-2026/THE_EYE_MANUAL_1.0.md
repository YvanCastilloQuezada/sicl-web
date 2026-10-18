# The Eye — Manual del auditor de confianza

**Versión 1.0 · Uso operativo en sandbox**

> The Eye revisa si la información capturada tiene evidencia, coherencia y trazabilidad suficientes. No transforma un score en verdad absoluta y no sustituye a Human Authority.

## Flujo de verificación

| Paso | Qué revisar | Decisión posible |
|---|---|---|
| Recepción | Objetos `UNDER_REVIEW` y prioridad | Abrir expediente |
| Identidad | WorldObject, sesión y versión | Confirmar alcance |
| Evidencia | Claims, Sources, Evidence y assets | Aceptar o pedir más |
| Matriz | Existencia, ubicación, identidad, contenido, fuente, actualidad, evidencia y consistencia | Valorar soporte |
| Confianza | Factores explicables y limitaciones | Documentar criterio |
| Conflicto | Local frente a remota | Resolver o escalar |
| Decisión | Aprobar, rechazar o solicitar evidencia | Registrar razón |
| Publicación | Versión exacta verificada | Human Authority autoriza |

## Recepción de objetos

Abre la cola de verificación y usa filtros por estado, tipo, CaptureSession, sincronización y evidencia. Selecciona un expediente y confirma qué versión estás revisando. No mezcles información de otro WorldObject.

## Evidence Matrix

Examina ocho dimensiones: existencia, ubicación, identidad, contenido, fuente, actualidad, evidencia y consistencia. En cada dimensión pregunta qué hecho se observa, qué fuente lo respalda, cuándo se obtuvo y si existe contradicción. Solicita evidencia adicional cuando una dimensión crítica no sea reproducible.

## Confidence Score

El score resume señales como fuentes, evidencias, Claims, precisión GPS, estado y revisión humana. Es un indicador explicable del expediente, no una afirmación matemática de verdad. Registra los factores y la razón de la decisión; nunca apruebes únicamente por el número.

## Conflictos y resoluciones

Cuando existen versiones divergentes, compara campos, versiones, fecha, actor y evidencia. Puedes mantener local, mantener remota, combinar de forma explícita o marcar `DISPUTED`. La resolución conserva ambas versiones, registra actor y razón y no debe usar `last-write-wins` silencioso.

## Decisiones

**Aprobar** cuando la evidencia es suficiente y coherente: el objeto pasa a `VERIFIED`. **Rechazar** cuando la información es incorrecta o no confiable: registra una razón concreta. **Solicitar evidencia** cuando falta soporte: el Mapper debe completar el expediente. **Marcar conflicto** cuando fuentes o versiones se contradicen.

## Publicación y Runtime

`VERIFIED` no significa `PUBLISHED`. Human Authority revisa la versión exacta y decide autorizar o retener. Runtime solo consume la versión con `publicationStatus = PUBLISHED`. Ningún agente ni The Eye puede modificar RNG, RTP, wallet, ledger, settlement, reglas o MjpTvManifest.

## Auditoría

Revisa quién creó el objeto, qué versión fue revisada, qué Claims y Evidence se consultaron, qué conflicto se resolvió, qué actor decidió y qué versión fue publicada. Usa el Audit Log como fuente de trazabilidad y conserva los identificadores públicos.

## Preguntas frecuentes

**¿Un score alto autoriza publicar?** No. Solo ayuda a explicar el expediente; la publicación requiere Human Authority.

**¿Qué hago si una fuente contradice otra?** Conserva las dos, solicita evidencia o marca el expediente como disputado. No ocultes la contradicción.

**¿Puedo editar silenciosamente una versión verificada?** No. Toda edición crea una nueva versión y vuelve a requerir revisión.

## Soporte

Para escalar un incidente, conserva WorldObject, versión, CaptureSession, operador, hora, navegador, estado de red, decisión y hash de evidencia. The Eye opera dentro del dominio territorial y no tiene acceso al MJP CORE.

> Este manual guía el sandbox y el gate de campo. No certifica hardware, GPS, cámara, cartografía, decisiones jurídicas ni producción. MJP CORE permanece fuera de este dominio.
