# ARKI — Asistente generativo gobernado

## Implementado

Se implementó la primera fase segura del documento `00000Mejoras.docx` sobre `ARKI-PARAMETRIC-RUNTIME`.

El asistente acepta lenguaje natural y crea propuestas parametrizadas para las plantillas nativas de ARKI. Actualmente reconoce, entre otros, encargos de estadio para 80.000 personas en Iquitos, hoteles con patio, viviendas, campus paisajísticos y encargos de paisaje. Cada resultado conserva el texto original, el proveedor aplicado, la razón, el nivel de riesgo, la plantilla relacionada y un identificador trazable.

El flujo es estrictamente:

`lenguaje natural → propuesta AI_PROPOSED → simulación antes/después → revisión humana → aceptar o rechazar → aplicar explícitamente`

La propuesta nunca modifica por sí sola el proyecto activo. La simulación calcula métricas antes/después y mantiene las alertas del generador nativo. La interfaz del runtime muestra el estado, el riesgo y los campos modificados.

El proveedor disponible en esta fase es `DETERMINISTIC_FIRST_PARTY`. Los proveedores remotos Anthropic/OpenAI no se declaran conectados ni se activan sin configuración explícita, secreto server-side, límites de costo, política de datos y pruebas de contrato.

## Salvaguardas

La herramienta sólo expone operaciones de propuesta, listado, explicación y simulación. No ejecuta código arbitrario, no muta Project State automáticamente, no aprueba decisiones, no publica modelos y conserva la revisión humana obligatoria. Los hosts Dynamo/Revit, Rhino/Grasshopper y Blender continúan fuera del servidor principal y requieren adaptadores autorizados.

## Módulos aún no activados

El documento también contiene colaboración CRDT/Yjs, streaming SSE, RAG con embeddings, recomendaciones proactivas, WebRTC físico, aplicación móvil, marketplace y pagos, analytics de terceros, comunidad, SDKs nativos, multi-tenancy con RLS, federación, fine-tuning, blockchain, cloud provisioning y certificación ISO/SOC. No se activaron automáticamente porque requieren infraestructura, credenciales, decisiones de privacidad/comercialización o revisión de seguridad independiente. No se simula que estén implementados.

## Validación

- TypeScript: PASS.
- Suite completa: **83 archivos / 366 pruebas PASS**.
- Build: PASS.
- `git diff --check`: PASS.
- Advertencia no bloqueante: chunks heredados superiores a 500 kB.
