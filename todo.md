# Project TODO

- [x] Panel autenticado de proyectos SICL con estado, versión y navegación de módulos.
- [x] Modelo persistente de proyectos y entidades SICL: fuentes, evidencia, requisitos, objetivos, restricciones y alternativas.
- [x] Validaciones explícitas en backend para referencias, versiones, direcciones y pertenencia al proyecto.
- [x] Capa tRPC como adaptador único entre la interfaz y los contratos de SICL.
- [x] Vista Council y comparaciones estrictamente read-only.
- [x] Flujo de Recommendations versionadas con razón y referencias analíticas explícitas.
- [x] Flujo de HumanReviews con actor, confirmación, versión observada y recommendation_version.
- [x] Flujo de preparación y registro de Decisions exclusivamente humanas con autoridad explícita.
- [x] Timeline de auditoría con eventos, revisiones y decisiones sin secretos de autenticación.
- [x] Autenticación integrada con Manus OAuth y autorización por proyecto.
- [x] Diseño visual Command Center elegante, sobrio, profesional y responsive.
- [x] Pruebas Vitest para invariantes de backend, read-only y autoridad humana.
- [x] Verificación visual y funcional en navegador en escritorio y móvil.
- [x] Checkpoint final reproducible antes de entregar.

## Auditoría de integración — pendientes añadidos

- [x] Integrar la capa tRPC con los contratos reales de SICL en `/home/ubuntu/SICL_0_2_1`, con fallback local explícito y aislado; la eliminación completa del modelo paralelo queda fuera de esta fase.
- [x] Renderizar en la UI la salida real de Council y comparaciones desde el endpoint read-only.
- [x] Completar el flujo web de evaluaciones y comparaciones trazables para habilitar Recommendations analíticas de extremo a extremo.
- [x] Implementar versionado real del ciclo de Recommendations, no solo `recommendationVersion: 1`.
- [x] Añadir paso separado de preparación de Decision antes del registro durable.
- [~] PENDING_FIXTURE — Ejecutar y documentar el flujo completo en navegador en escritorio y móvil cuando exista un proyecto canónico poblado.

## Integración aprobada con núcleo Python

- [x] Definir contrato HTTP versionado entre el núcleo Python y `sicl-web`.
- [x] Implementar servicio adaptador Python separado sin duplicar reglas de dominio.
- [x] Conectar tRPC al adaptador mediante un cliente anti-corrupción autenticado.
- [~] PENDING_EXTERNAL — Verificar que errores de dominio, conflictos de versión y autoridad se preservan extremo a extremo contra una instancia real del núcleo Python.
- [~] PENDING_EXTERNAL — Verificar flujo completo en escritorio y móvil después de la integración real.

## Corrección de integración — pendientes

- [x] Implementar autenticación server-to-server real para `coreHttpClient` mediante secreto de entorno y rechazo explícito.
- [x] Delegar Recommendation, HumanReview y Decision desde tRPC al adaptador Python real.
- [x] Añadir pruebas de autenticación rechazada, errores de dominio y conflictos de versión propagados.
- [x] Añadir pruebas Vitest para las tres mutaciones tRPC delegadas cuando `SICL_CORE_URL` está configurado.
- [x] Hacer explícito que el endpoint web delegado acepta solo Recommendations analíticas o respetar `source` y `based_on_kind` sin inferencias.
- [x] Probar propagación íntegra de errores 401, 409 y 422 desde el adaptador Python hacia tRPC mediante respuestas upstream contractuales y detalle preservado.
- [x] Hacer explícito `based_on_kind` en el contrato tRPC para Recommendations analíticas y validarlo sin hardcode implícito.
- [x] Añadir una prueba que verifique el valor exacto de `based_on_kind` enviado al adaptador Python.
- [x] Preparar un contenedor reproducible para alojar `sicl-core-http` con Python, almacenamiento persistente y configuración por secretos.

## Alojamiento Manus del núcleo Python

- [x] Determinar la ruta de alojamiento Manus compatible con un servicio Python persistente.
- [x] Preparar configuración de contenedor, persistencia SQLite y secretos server-to-server.
- [~] PENDING_EXTERNAL — Definir el registro de `SICL_CORE_URL` después del alojamiento real.
- [x] Validar readiness del servicio sin ejecutar un despliegue irreversible.

## Despliegue aprobado en Cloud Computer Manus

- [~] PENDING_EXTERNAL — Confirmar que el Cloud Computer está creado y adjunto a la sesión.
- [x] Preparar Dockerfile y contexto reproducible para `sicl-core-http`.
- [~] PENDING_EXTERNAL — Configurar `/data/sicl/` como almacenamiento persistente de SQLite.
- [~] PENDING_EXTERNAL — Configurar UFW para exponer únicamente SSH y HTTPS.
- [~] PENDING_EXTERNAL — Crear unidad systemd con reinicio automático del servicio.
- [~] PENDING_EXTERNAL — Configurar HTTPS y obtener la URL real del servicio.
- [~] PENDING_EXTERNAL — Registrar `SICL_CORE_URL` en el entorno server-side de `sicl-web`.
- [~] PENDING_EXTERNAL — Ejecutar verificación end-to-end de snapshots, Council y flujos humanos.
- [~] PENDING_EXTERNAL — Adjuntar el Cloud Computer Manus y ejecutar la instalación real de `/data/sicl/`.
- [~] PENDING_EXTERNAL — Verificar que `core.sqlite` persiste fuera del contenedor tras reinicio del servicio.
- [x] Preparar runbook corregido de alojamiento con nombres reales de variables, secuencia segura de UFW y HTTPS, y registro server-side de `SICL_CORE_URL`.
- [x] Hacer que el router falle cerrado en producción si falta `SICL_CORE_URL`, con prueba Vitest explícita.
- [x] Convertir el fallback TypeScript en modo local explícito mediante `SICL_ALLOW_LOCAL_CORE=true`; producción no lo habilita automáticamente.

## Auditoría de fidelidad UI–núcleo

- [x] Hacer que el cliente HTTP preserve cuerpo y código de error del adaptador, incluyendo 401/404/409/422.
- [x] Ampliar el contrato Council web con comparaciones, multi-comparaciones, tradeoffs, recomendaciones y diagnóstico canónicos.
- [x] Evitar que `multi_comparisons` se fusione silenciosamente con `comparisons` en el modo local explícito.
- [x] Eliminar fallback implícito de `recommendationVersion` a 1 en la interfaz.
- [x] Conectar la preparación explícita de Decision en el flujo visual antes del registro.
- [x] Renderizar en la UI la salida Council canónica y los eventos/auditoría completos.
- [x] Renderizar en la UI los campos canónicos completos de eventos: event_type, entity_type, entity_id, project_id, timestamp y datos seguros relevantes.
- [x] Mostrar registros completos y trazables de HumanReviews y Decisions en la vista de auditoría.
- [x] Añadir una prueba de adaptación que confirme Council y auditoría íntegros sin exponer secretos.
- [x] Definir y probar el tratamiento contractual del 404 en lecturas canónicas, sin descartar silenciosamente su envelope.
- [x] Añadir regresión dirigida que confirme separación entre `comparisons` y `multiComparisons`.
- [x] Renderizar detalles canónicos completos de comparaciones, multi-comparaciones, tradeoffs y recommendations.
- [x] Mostrar timestamps, versiones y authority basis seguro en HumanReviews y Decisions.
- [x] Añadir prueba de adaptación conjunta de Council canónico y auditoría filtrada.

## Hardening de integración — ejecución actual

- [x] Preservar el envelope 404 de lecturas canónicas y traducirlo a NOT_FOUND en tRPC.
- [x] Añadir regresión dirigida para separación entre comparisons y multiComparisons.
- [x] Renderizar detalles canónicos completos de comparaciones, multi-comparaciones, tradeoffs y recommendations.
- [x] Mostrar timestamps, versiones y authority basis seguro en HumanReviews y Decisions.
- [~] PENDING_FIXTURE — Verificar visualmente Council y Audit con datos canónicos poblados en escritorio y móvil.

## Correcciones detectadas antes del checkpoint

- [x] Preservar el body 404 real del adaptador en las lecturas canónicas, sin fabricar un envelope local.
- [x] Añadir pruebas Vitest específicas de 404 para cliente HTTP y router tRPC.
- [x] Mostrar authority basis también en HumanReviews dentro de Audit.
- [x] Añadir cobertura integrada de Council canónico, 404 contractual y auditoría filtrada mediante pruebas de adaptación coordinadas.

## Aclaración contractual del 404

- [x] Documentar y probar que el wrapper `CanonicalNotFound` es una frontera de tipos mínima y que `envelope` conserva sin transformación el cuerpo 404 upstream.
- [x] Añadir una prueba coordinada en un mismo escenario para Council canónico, lectura 404 y auditoría filtrada.

## Jerarquía SICL 1–3 — nueva ampliación aprobada para implementación

- [x] Definir un contrato mínimo de `spatial_scope` jerárquico para proyecto, ciudad/territorio y desarrollo nacional.
- [x] Definir un contrato mínimo de `temporal_scope` para escenarios 2030, 2040 y 2050 sin convertirlos en predicciones automáticas.
- [x] Mantener el mismo núcleo de entidades, evidencia, evaluación, recomendación y decisión a través de los tres niveles.
- [x] Añadir pruebas de normalización y compatibilidad retroactiva con snapshots SICL existentes.
- [x] Integrar la selección de escala y horizonte en el Command Center sin habilitar autoridad automática.
- [x] Documentar qué capacidades SICL 1–3 quedan representadas y cuáles siguen pendientes del núcleo Python remoto.

## Evaluación conceptual solicitada — sin código

- [x] Analizar la propuesta de conversación entre modelos y distinguir hechos, supuestos y afirmaciones no verificadas.
- [x] Evaluar su compatibilidad con SICL, especialmente separación entre análisis, ejecución y autoridad humana.
- [x] Clasificar qué partes son factibles ahora, cuáles requieren diseño adicional y cuáles deben rechazarse o corregirse.
- [x] Entregar opinión y recomendaciones sin modificar código ni infraestructura.

## Investigación de Operaciones — decisión arquitectónica basada en documentos 63 y 64

- [x] Comparar los documentos 63 y 64 y separar visión, capacidades factibles, prototipos y afirmaciones no demostradas.
- [x] Definir IO como capa analítica extensible de SICL, no como autoridad ni selector automático de decisiones.
- [x] Establecer contratos para métodos IO con entradas, unidades, restricciones, supuestos, factibilidad, salida, sensibilidad y procedencia.
- [x] Diseñar la hoja de ruta por etapas para transporte, asignación, colas, inventarios, CPM/PERT, simulación y MCDA.
- [x] Implementar solo el incremento IO que sea determinista, trazable y compatible con el Core Contract actual.
- [x] Verificar pruebas, documentación y límites de los métodos IO implementados.

## Correcciones de contrato IO antes del checkpoint

- [x] Documentar explícitamente la comparación entre documentos 63 y 64: visión, factibilidad, prototipos y afirmaciones no demostradas.
- [x] Uniformar el catálogo IO con restricciones, procedencia, estado de factibilidad y sensibilidad por método, y cubrirlo con regresiones.

## Cobertura adicional del catálogo IO

- [x] Verificar en Python restricciones, procedencia, estados de factibilidad y sensibilidad para cada método IO.
- [x] Verificar por HTTP/web que el endpoint read-only expone esos campos sin transformación; el adaptador Python real quedó cubierto y el cliente web conserva el contrato.

## Verificación del endpoint IO real

- [x] Probar el endpoint Python real `/v1/operations-research/methods` con los campos contractuales completos.
- [x] Verificar la integración web contra una respuesta real del adaptador IO, además del mock del cliente.

## Prueba web real contra adaptador IO

- [x] Ejecutar `fetchOperationsResearchMethods()` desde el cliente web contra el adaptador Python vivo sin mock de `fetch`.
- [x] Guardar evidencia reproducible de la prueba Node web↔Python y cerrar el pendiente solo con esa evidencia.

## Aportes del documento 65 — ampliación de producto y arquitectura

- [x] Comparar el documento 65 con el estado actual y separar visión, decisión arquitectónica y capacidades implementables.
- [x] Formalizar los roles Product Owner, Chief Architect y Implementation Engineer sin crear una jerarquía ficticia de autoridad dentro del software.
- [x] Convertir el flujo propuesta → contrato → autorización → implementación → pruebas → auditoría → release en un artefacto trazable del proyecto.
- [x] Preservar la visión de Spatial Entity multiescala sin reemplazar Project prematuramente ni romper SICL 1–3.
- [x] Formalizar referencias externas y escenarios como evidencia/contexto evaluable, no como doctrina ni hechos automáticos.
- [x] Añadir una mejora de producto distintiva que sea factible ahora y refuerce la trazabilidad del Command Center.
- [x] Verificar pruebas, documentación y límites de la ampliación del documento 65.

## Mejora de Recommendations derivada del documento 65

- [x] Hacer monotónico el `recommendationVersion` en el fallback local y cubrirlo con regresión, sin cambiar el flujo de autoridad humana.

## Capability Gate Ledger visible en Command Center

- [x] Definir el snapshot read-only local del Capability Gate Ledger con etapas, referencias y roles.
- [x] Integrar un módulo de gobernanza visible sin permitir avanzar gates desde la interfaz.
- [x] Añadir pruebas Vitest para lectura, orden secuencial y separación de autoridad.
- [x] Verificar visualmente el módulo en escritorio y móvil.

## Corrección del Ledger tras revisión de implementación

- [x] Definir un contrato local tipado para Capability Gate Ledger con etapas, roles y referencias, separado de Home.tsx.
- [x] Consumir ese contrato desde GovernanceModule en lugar de hardcodear las etapas dentro del componente.
- [x] Añadir pruebas Vitest del orden secuencial, roles esperados y ausencia de acciones de autoridad en la vista.

## Corrección semántica de Recommendations

- [x] Validar `basedOnKind` contra `comparisons` o `multiComparisons` de forma explícita en el fallback local.
- [x] Añadir regresión para aceptar una referencia MULTI_CRITERIA válida y rechazar una referencia cruzada.

## Regresión de Recommendations en router local

- [x] Probar `recommendationCreate` en modo local aceptando una referencia `MULTI_CRITERIA` existente en `multiComparisons`.
- [x] Probar que `recommendationCreate` rechaza una referencia cruzada y conserva el mensaje contractual.

## Incremento analítico local controlado

- [x] Añadir captura explícita de Evaluation con alternativa, criterio, valor, unidad, método, inputs y provenance; sin cálculo automático ni autoridad.
- [x] Añadir captura explícita de Comparison con referencia a evaluations, objective y dirección; exigir dirección y estado de factibilidad; el estado es obligatorio y validado.
- [x] Exponer Evaluation→Comparison en Alternatives & Evaluation y mantener Council read-only.
- [x] Añadir pruebas Vitest de referencias, dirección obligatoria, estados de factibilidad (ausente e inválido) y separación de Recommendation.


## Ajuste operativo del adaptador Python

- [x] Asegurar que el Dockerfile de `sicl-core-http` ejecuta Uvicorn con `exec`, conserva `PORT` configurable y mantiene `PYTHONPATH` del núcleo; validación estática y suite Python aprobadas.


## Huecos detectados en la auditoría de continuidad

- [x] Añadir una prueba integrada local que cree Evaluation y Comparison y luego ejecute `recommendationCreate` sobre esa referencia, verificando trazabilidad y versión.
- [x] Verificar el versionado de Recommendations en el núcleo Python/adaptador HTTP canónico: se confirmó `Recommendation.entity_version` + `Project.entity_version`, pero no existe versionado monotónico de ciclos; la semántica nueva queda explícitamente pendiente de decisión contractual.
- [~] PENDING_FIXTURE — Ejecutar y documentar una verificación funcional de navegador del flujo Alternatives & Evaluation → Recommendation en escritorio y móvil cuando exista un proyecto de prueba poblado.

## Readiness de despliegue — auditoría de continuidad

- [x] Confirmar que los repositorios web y core están versionados, que el Dockerfile y runbook están preparados, y que no existe `SICL_CORE_URL` ni Docker disponible en el sandbox; por tanto no se fabrica una URL ni se declara desplegado el servicio remoto.

- [x] Documentar el protocolo reproducible de verificación Alternatives & Evaluation → Recommendation → Decision y sus condiciones de seguridad; la ejecución funcional poblada permanece pendiente.

## Corrección UI detectada durante continuidad

- [x] Separar el objetivo seleccionado para Evaluation del objetivo seleccionado para Comparison, evitando que un formulario sobrescriba silenciosamente al otro; regresión UI añadida.

- [x] Revalidar visualmente el Command Center en viewport móvil de 375×812 tras la corrección de Evaluation/Comparison; no se observan desbordamientos en la navegación inicial.

## Revisión conceptual del documento 67

- [x] Redactar y entregar documento independiente con apreciaciones, desacuerdos, mejoras y ruta de implementación hacia SICL 0.6; no modificar código como parte de esta revisión.

## Revisión conceptual del documento 68

- [x] Redactar y entregar documento externo con apreciaciones, desacuerdos, mejoras y recomendaciones de implementación para SICL 0.6; no modificar código.

## Protocolo de colaboración humana entre modelos

- [x] Documentar y adoptar el protocolo por el cual el usuario intermedia entre ChatGPT y Manus, con decisiones, validaciones y aprobaciones humanas explícitas.

## SICL 0.6 — Product Acceptance Contract aprobado

- [x] Formalizar el Product Acceptance Contract separado del Core Contract.
- [x] Auditar cada etapa del vertical slice contra la implementación actual.
- [x] Implementar únicamente las brechas locales necesarias para el vertical slice aprobado: Preferences explícitas, representación espacial contextual y reporte JSON filtrado.
- [x] Ejecutar pruebas de integridad y verificación visual del vertical slice: TypeScript, 64 pruebas web y viewport de escritorio/móvil.

## Decisión pendiente de contrato canónico

- [x] Decidir e incorporar `Preference` al Core Contract Python, SQLite, revisión y adaptador HTTP; la incorporación quedó completa y coordinada, no parcial.

## SICL Implementation Coordination Record — Ciclo 01

- [x] Preparar un único archivo de coordinación para la incorporación canónica de `Preference`, con análisis de impacto, elementos excluidos, riesgos y decisiones pendientes; no modificar el Core Python hasta validación arquitectónica.

## Revisión conceptual — estética y calidad arquitectónica

- [x] Redactar y entregar comentarios e ideas sobre los documentos 71 y 72; mantener bloqueada la programación estética hasta nueva validación arquitectónica.

## Ciclo 01 aprobado — Preference canónica

- [x] Incorporar `Preference` al Core Contract Python con justificación, domain, provenance, vigencia y estado explícitos.
- [x] Persistir `Preference` en SQLite y cargarla en `CoreProject` sin romper snapshots existentes.
- [x] Exponer y escribir `Preference` mediante el adaptador HTTP autenticado, tRPC y fallback web.
- [x] Añadir pruebas de contrato, persistencia, referencias, auditoría, seguridad e interoperabilidad; TypeScript y 60 pruebas web, suite Python y prueba HTTP canónica aprobadas.
- [x] Actualizar el Coordination Record del Ciclo 01 con estado IMPLEMENTADO Y VALIDADO LOCALMENTE tras la evidencia; E2E remoto permanece pendiente.

## Hardening final de Preference

- [x] Exigir que el replay idempotente de `Preference` coincida en proyecto, entidad, evento y payload completo; añadir regresión de conflicto.

## Readiness local previo al despliegue

- [x] Verificar el manejo server-side de `SICL_CORE_URL` y `SICL_CORE_SERVICE_TOKEN` sin exponer secretos.
- [x] Verificar que UPAO-001 esté disponible como caso de prueba reproducible sin poblar datos ficticios en producción.
- [x] Documentar el resultado y mantener bloqueados HTTPS, persistencia externa y E2E remoto.

## Trabajo local priorizado sin Cloud Computer

- [x] Diseñar Decision Conditions como estructura read-only, trazable y no predictiva.
- [x] Integrar Decision Conditions en el contrato local y la vista de análisis sin crear autoridad automática; cuando `SICL_CORE_URL` existe, la escritura local falla cerrado hasta disponer de endpoint canónico.
- [x] Preparar guía ejecutable de usuario para Product 0.6.
- [x] Preparar fixture sintético UPAO-001 reutilizable sin datos persistentes ni afirmaciones profesionales.
- [x] Revisar runbook y pruebas de estados remotos del frontend; Decision Conditions falla cerrado con SICL_CORE_URL hasta disponer de endpoint canónico.

- [x] Mostrar la lista read-only de Decision Conditions registradas en Alternatives & Evaluation para cerrar el ciclo de captura y revisión.

- [x] Definir contrato y alcance de un simulador de proyectos sintéticos como harness externo de validación, separado del Core y sin recomendaciones automáticas ni datos presentados como reales.

## Simulador de Proyectos — Fase A aprobada

- [x] Definir contrato externo del harness y su separación respecto del Core canónico.
- [x] Implementar modelo versionado de casos sintéticos y semilla determinista.
- [x] Añadir dos fixtures iniciales SICL 1, marcados explícitamente como sintéticos.
- [x] Implementar runner externo contra SQLite temporal sin persistir datos en producción.
- [x] Validar invariantes de trazabilidad, referencias, estados y autoridad humana.
- [x] Generar reporte y evidencia reproducible del simulador.
- [x] Documentar límites de Fase A y actualizar la hoja de ruta SICL 1–3.

## Release Candidate local — tareas aprobadas

- [x] Endurecer el simulador validando que todos los nombres de expected_invariants tengan checks ejecutados.
- [x] Completar una matriz reproducible de verificación de la Fase A.
- [x] Preparar una prueba HTTP local completa contra el adaptador Python temporal.
- [x] Revisar estáticamente Dockerfile y contexto de despliegue sin simular la construcción remota.
- [x] Preparar el paquete UPAO-001 sintético y el guion E2E poblado para Cloud Computer.
- [x] Crear la tabla de criterios y evidencias del Release Candidate.

## Mejoras secundarias sin Cloud Computer

- [x] Crear un verificador unificado del Release Candidate que ejecute los checks locales y emita un estado agregado.
- [x] Generar un manifiesto reproducible del Release Candidate con commits, versiones y hashes de evidencia.
- [x] Añadir una matriz de fallos esperados del adaptador HTTP para 401, 404, 409 y 422, sin probar infraestructura remota.
- [x] Documentar explícitamente qué resultados locales no autorizan una declaración de despliegue o validez profesional.

## Auditoría consolidada del proyecto

- [x] Inventariar avances de SICL por tema y localizar sus evidencias.
- [x] Contrastar estados declarados con código, pruebas, documentación y commits.
- [x] Redactar un único documento de auditoría consolidada con estados y límites.
- [x] Verificar la auditoría, marcarla en todo.md y entregarla al Product Owner.

## Avance porcentual y cronograma ejecutivo

- [x] Calcular el porcentaje de tareas completadas y explicar sus limitaciones.
- [x] Construir una métrica ponderada por fases para no sobreestimar el avance.
- [x] Clasificar pendientes por dependencia, prioridad y criterio de salida.
- [x] Redactar un cronograma ejecutivo de despliegue y validación E2E.
- [x] Verificar y entregar el documento de avance y hoja de ruta.

## Guía funcional SICL 1–3 para arquitectos

- [x] Definir el núcleo funcional común y las diferencias entre SICL 1, SICL 2 y SICL 3.
- [x] Explicar cada funcionalidad con entradas, proceso, resultado y límite de autoridad.
- [x] Redactar ejemplos sencillos y el flujo completo de trabajo arquitectónico.
- [x] Verificar la guía contra la implementación real y entregar el documento.

## Paquete de comprensión SICL para arquitectos

- [x] Preparar diccionario visual y mocking esquemático del flujo Command Center.
- [x] Preparar matriz de decisiones, roles y límites de autoridad.
- [x] Preparar diccionario de datos de entrada y procedencia.
- [x] Preparar preguntas frecuentes para arquitectos.
- [x] Preparar plan de implementación por fases con entregables y estados.
- [x] Verificar y entregar el paquete consolidado sin confundir mockup con funcionalidad implementada.

## Mockups estáticos conceptuales de SICL

- [x] Definir el conjunto inicial de pantallas y su narrativa visual.
- [x] Generar mockups estáticos coherentes para el flujo arquitectónico.
- [x] Revisar que las pantallas no prometan capacidades no implementadas.
- [x] Registrar y entregar el paquete visual al Product Owner.

## Mockups deterministas — ruta aprobada

- [x] Crear layouts estáticos deterministas para Proyecto/Contexto, Objetivos/Condiciones, Alternativas/Evaluación y Recomendación/Decisión.
- [x] Exportar los cuatro layouts a imágenes independientes y conservar fuentes editables.
- [x] Verificar legibilidad, coherencia visual y etiqueta conceptual.
- [x] Entregar el paquete visual completo actualizado.

## Documentos Word para arquitectos

- [x] Convertir la Guía funcional SICL 1–3 a DOCX profesional.
- [x] Convertir el Paquete de comprensión SICL para arquitectos a DOCX profesional.
- [x] Convertir la Hoja de ruta ejecutiva SICL 0.6 a DOCX profesional.
- [x] Convertir la Auditoría consolidada SICL 0.6 a DOCX profesional.
- [x] Verificar contenido, tablas, legibilidad y notas de estado de los cuatro DOCX.

## SICL Master Specification v1

- [x] Inventariar las fuentes normativas, técnicas y de evidencia para el documento maestro.
- [x] Consolidar visión, Core Contract, roadmap, RFC, aceptación y decisiones pendientes.
- [x] Integrar la capacidad futura de estética con límites explícitos.
- [x] Verificar coherencia, estados y referencias del documento maestro.
- [x] Entregar `SICL_MASTER_SPEC_v1.md` como artefacto único para revisión integral.

## Revisión independiente del Master Spec v1

- [x] Contrastar la crítica sobre aprendizaje institucional, Preference y Decision Conditions con el documento actual.
- [x] Sustituir lenguaje ambiguo de aprendizaje autónomo por conocimiento o memoria institucional versionada.
- [x] Precisar estados de Preference integrado y Decision Conditions read-only/futura escritura canónica.
- [x] Añadir una declaración de congelación de expansión conceptual y no implementar estética.
- [x] Verificar consistencia final del Master Spec revisado y entregar una nota de cambios.

## Auditoría técnica del estado real SICL contra Master Spec v1
- [x] Inventariar código, documentación, pruebas y evidencias del estado real.
- [x] Auditar cada entidad y la frontera Core–motores–representación.
- [x] Ejecutar pruebas necesarias y registrar discrepancias sin corregirlas.
- [x] Redactar `SICL_STATE_AUDIT_v1.md` con estados, riesgos y decisiones requeridas.
- [x] Verificar la auditoría, registrar pendientes y entregar el artefacto.

## Ciclo de integración y aceptación operativa

- [x] Construir matriz de bloqueadores A/B/C/D contra SICL_STATE_AUDIT_v1.
- [x] Ejecutar y probar únicamente correcciones de clase A, sin cambiar contratos.
- [x] Intentar la cadena E2E completa y demostrar éxito o bloqueo real.
- [x] Redactar `SICL_NEXT_CYCLE_REPORT_v1.md` con evidencia, discrepancias y decisiones requeridas.
- [x] Verificar y entregar el reporte único del ciclo.

## Paquete de ejecución remota SICL

- [x] Separar bloqueo técnico y bloqueo constitucional en el paquete remoto.
- [x] Documentar precondiciones, variables, archivos y orden exacto de despliegue.
- [x] Documentar pruebas, evidencias, criterios PASS/FAIL y prohibiciones.
- [x] Verificar que no contiene valores inventados ni cambios de contrato.
- [x] Entregar `SICL_REMOTE_EXECUTION_PACKAGE_v1.md` y detener el ciclo.

## Readiness Check final
- [x] Verificar archivos, contratos, endpoints y configuración local.
- [x] Verificar pruebas y flujo preparado sin declarar E2E remoto.
- [x] Clasificar discrepancias como A/B/C/D y listar intervención requerida.
- [x] Redactar y verificar `SICL_READINESS_CHECK_v1.md`.
- [x] Detener el ciclo y entregar el reporte de readiness.

## Resolución autorizada A-001

- [x] Inspeccionar la estrategia real de imagen en Dockerfile, systemd y runbook.
- [x] Aplicar una etiqueta explícita y trazable sin introducir registro nuevo ni cambiar contratos.
- [x] Ejecutar validaciones de sintaxis, coherencia de etiquetas, salud HTTP, compileall y diff check.
- [x] Crear `SICL_A001_RESOLUTION.md` con evidencia y estado final.
- [x] Entregar solo el resultado A-001 y detener el ciclo.

## Matriz operacional de aceptación SICL 0.6

- [x] Verificar checkout 2ef49aba2136, higiene Git y referencias únicas de `release-0.6`.
- [x] Mapear entidades, operaciones, endpoints, eventos, versiones, snapshots, pruebas y autoridad.
- [x] Marcar etapas no demostrables como BLOQUEADO POR CONTRATO sin inventar soluciones.
- [x] Redactar `SICL_0_6_ACCEPTANCE_MATRIX_v1.md` como matriz ejecutable del futuro E2E.
- [x] Verificar la matriz y entregar únicamente hechos, discrepancias nuevas, intervención requerida y próxima acción.

## Fase constitucional B-001 — SICL 0.6
- [x] Contrastar Master Spec, State Audit, Acceptance Matrix, Core Contract y HTTP v0.3. (Completed in the following B-001 review.)
- [x] Registrar Fact/Assumption como decisión conceptual APROBADA. (Completed through B-001 consolidation.)
- [x] Analizar Audit/Report sin resolver la decisión. (Completed through B-001 review.)
- [x] Analizar Decision Conditions y mantenerla read-only. (Completed through B-001 review.)
- [x] Delimitar el alcance constitucional exacto de SICL 0.6 y la brecha BLOQUEADO POR CONTRATO. (Completed through B-001 consolidation.)
- [x] Redactar y verificar `SICL_CONSTITUTIONAL_REVIEW_0.6.md`. (Completed in B-001.)
- [x] Entregar el documento y detener la fase hasta clasificación del Product Owner. (Completed in B-001.)

## Revisión constitucional B-001
- [x] Contrastar Master Spec, State Audit, Acceptance Matrix, Core Contract y HTTP v0.3.
- [x] Analizar Fact/Assumption, Audit/Report, Decision Conditions y alcance 0.6 sin resolver decisiones pendientes.
- [x] Redactar `SICL_CONSTITUTIONAL_REVIEW_0.6.md` con estados y preguntas cerradas.
- [x] Verificar que no autoriza implementación ni amplía el alcance.
- [x] Entregar el documento y detener la fase constitucional.

## Consolidación constitucional B-001 autorizada por Product Owner
- [x] Registrar las decisiones aprobadas sobre Fact/Assumption, Audit/Report, Decision Conditions y alcance de SICL 0.6.
- [x] Consolidar B-001 en `SICL_MASTER_SPEC_v1.md` sin modificar código, entidades, endpoints, SQLite, eventos ni Core Contract.
- [x] Diferenciar Constitución, Core Contract, superficie HTTP, implementación local, estado E2E, roadmap/RFC y capacidades bloqueadas por contrato.
- [x] Mantener explícito que BLOQUEADO POR CONTRATO no significa FUERA DE SICL.
- [x] Verificar que la consolidación no autoriza infraestructura, E2E ni ampliación contractual.
- [x] Entregar la versión constitucional consolidada y detenerse para la siguiente revisión arquitectónica.

## Revisión arquitectónica documental posterior a B-001 autorizada
- [x] Contrastar Constitución, Core Contract, HTTP, implementación, pruebas, roadmap/RFC y E2E.
- [x] Elaborar diagnóstico de arquitectura documental: separaciones correctas y mezclas.
- [x] Construir matriz Constitución → Core → HTTP → Web → Implementación → Test → E2E.
- [x] Identificar inconsistencias documentales con severidad, capa correcta y recomendación.
- [x] Proponer estructura documental de SICL 0.6 y relación entre artefactos.
- [x] Proponer la estructura de `SICL_MASTER_SPEC_v2` sin redactar todavía v2 completa.
- [x] Verificar que no se modifique código, contrato, infraestructura ni se declare E2E.
- [x] Entregar únicamente el diagnóstico y las propuestas documentales; esperar nueva autorización.

## A-002 — Auditoría ejecutable y freeze de SICL 0.6 autorizados
- [x] Auditar cruzadamente documentos, Core Python, SQLite, tRPC, Web, HTTP v0.3, pruebas, simuladores y adaptadores.
- [x] Construir una matriz maestra única de verdad con estados, evidencia, dependencias y bloqueos.
- [x] Registrar discrepancias especificadas/no implementadas, implementadas/no especificadas, parciales, verificadas, expuestas, bloqueadas, preparadas y fuera de alcance.
- [x] Proponer `SICL_0_6_FREEZE` con alcance, estado, faltantes y prohibiciones.
- [x] Ordenar backlog P0/P1/P2/FUTURE con criterios de aceptación y evidencia requerida.
- [x] Identificar tests faltantes para VERIFIED y E2E VERIFIED sin escribirlos.
- [x] Definir Release Gate READY → RELEASE CANDIDATE → E2E VERIFIED.
- [x] Verificar que A-002 no modifique código, contratos, infraestructura ni Master Spec v2.
- [x] Entregar únicamente la auditoría A-002 y marcar A-002 COMPLETE — AWAITING PRODUCT OWNER.

## Bug de preview — SICL_CORE_URL ausente
- [x] Corregir el error de preview `/` cuando no existe `SICL_CORE_URL`, manteniendo fallo cerrado en producción.
- [x] Revisar la detección de entorno y el uso de `SICL_ALLOW_LOCAL_CORE` en router, env y scripts de desarrollo.
- [x] Añadir o actualizar una prueba Vitest que cubra preview/local explícito y producción sin URL.
- [x] Verificar la página en preview y guardar checkpoint reproducible.


## Suplemento 528 — ARKI Multi-Agent Professional System
- [x] Preservar KR-6.2 sin sobrescribirlo.
- [x] Consolidar AGENT-BRIEF, AGENT-PARTI, AGENT-REGULATION y AGENT-COST.
- [x] Registrar Superpowers, Red Team, Contradiction Hunter y Cross-project Transfer con estados conservadores.
- [x] Crear familias Direction/Coordination, Architecture, Engineering/Performance, Professional Feasibility, Production/Real World y Critical Intelligence/Learning.
- [x] Registrar contratos de Project State único, comunicaciones estructuradas, autoridad humana y adaptadores externos.
- [x] Generar y verificar `docs/arki-kr63/ARKI_Canonical_Knowledge_and_Reasoning_v6.3_MULTI_AGENT.xlsx`.
- [x] Registrar explícitamente que A00–A59 no fueron enumerados literalmente en la orden recibida; no se inventaron nombres.
- [x] Mantener límites: no declarar multi-agent intelligence demonstrated por la existencia del Registry.

## Adaptadores nativos OSS — investigación y frontera de activación
- [x] Investigar fuentes oficiales y comparar pilas gratuitas para CAD, BIM, GIS, mallas y publicación profesional.
- [x] Implementar `server/arkiNativeAdapters.ts` con registro, selección, validación de envelopes y manifiesto de pérdidas.
- [x] Exponer catálogo read-only mediante `nativeAdapters.registry` y registrar la capacidad en Control Center.
- [x] Documentar licencias, formatos, límites, DWG no demostrado y gates de activación en `docs/arki-enterprise/ARKI_NATIVE_ADAPTERS_OSS_RESEARCH.md`.
- [x] Validar con 3 pruebas focalizadas, `pnpm check`, `pnpm build` y `git diff --check`.
- [x] Mantener `PENDING_EXTERNAL`: workers nativos aislados, SBOM, fixtures reales, round-trip y revisión humana antes de elevar madurez a `DEMONSTRATED`.

## Activación real de workers OSS — demostración local
- [x] Crear entorno virtual aislado fuera del repositorio con IfcOpenShell 0.8.5, ezdxf 1.4.4, Shapely 2.1.2, CairoSVG 2.9.1, python-docx 1.2.0 y cadquery-ocp 8.0.1.
- [x] Implementar worker `tools/arki_exchange_worker.py` para generar IFC4, DXF R2018, GeoJSON, GeoPackage, STEP e IGES.
- [x] Validar por lectura real los seis formatos con `tools/test_arki_exchange_worker.py`.
- [x] Integrar y probar la invocación TypeScript mediante `executeOssWorker` y `tools/test_arki_adapter_runner.ts`.
- [x] Confirmar `pnpm check`, `pnpm build`, suite Vitest completa (50 archivos / 248 pruebas) y `git diff --check`.
- [x] Mantener límite epistemológico: fixtures sintéticos PASS no equivalen a exportación de un proyecto ARKI real, round-trip multi-proveedor, DWG ni certificación profesional.

## Runtime paramétrico propio — ARKI-PARAMETRIC-RUNTIME-1.0
- [x] Investigar Dynamo/Revit, Grasshopper/Rhino/Compute, Blender Geometry Nodes, CPython/Pydantic/NumPy/Numba y WebSockets/NATS/Redis/Ray/Dask con fuentes oficiales.
- [x] Implementar contrato propio de grafos paramétricos con `inspect`, `validate`, `execute` y `export` como capacidades separadas.
- [x] Implementar catálogo e inspección gobernada de `.dyn`, `.dyf`, `.gh`, `.ghx`, `.blend` y `ARKI_GRAPH`, preservando hashes y dependencias declaradas.
- [x] Implementar worker CPython bounded con operaciones allow-listed, rechazo de ciclos/código arbitrario, hash de ejecución y respuesta soft-realtime.
- [x] Exponer catálogo público y ejecución protegida vía tRPC; registrar capacidad en Control Center.
- [x] Validar con 4 pruebas focalizadas de runtime, suite completa de 51 archivos / 252 pruebas, TypeScript PASS, build PASS y `git diff --check`.
- [x] Mantener `EXTERNAL_HOST_REQUIRED` para ejecución real en Revit/Dynamo, Rhino/Grasshopper/Compute y Blender; no declarar hard real-time.

## Parametric Files UI — subida y gestión desde navegador
- [x] Crear ruta `/parametric-files` con DashboardLayout y acceso lateral `ARKI · Parametric Files`.
- [x] Implementar drag-and-drop y selector para `.dyn`, `.dyf`, `.gh`, `.ghx`, `.blend` y `.json`.
- [x] Añadir endpoint protegido `parametricRuntime.upload` con almacenamiento seguro, checksum, inspección y manifiesto.
- [x] Mostrar biblioteca de sesión, búsqueda, estados, dependencias, host requerido, checksum, copia, apertura del original y retiro de la vista.
- [x] Mantener límites: el navegador no ejecuta contenido; hosts Dynamo/Revit, Rhino/Grasshopper y Blender siguen siendo gates externos.
- [x] Validar TypeScript PASS, suite focalizada PASS, build PASS, smoke route HTTP 200 y `git diff --check` PASS.

## Persistencia y realtime paramétrico — cierre de fase
- [x] Crear `parametric_files` y aplicar la migración SQL en la base de datos del proyecto.
- [x] Asociar cada archivo a propietario y `projectId`; listar y archivar lógicamente mediante procedimientos protegidos.
- [x] Conectar el panel web al proyecto activo y cargar la biblioteca persistente.
- [x] Implementar `/ws/parametric` con eventos de subida, validación, revisión y finalización.
- [x] Implementar `parametricHostWorkers.ts` como frontera HTTPS/tokenizada para Dynamo/Revit, Rhino/Grasshopper y Blender.
- [x] Añadir benchmark de 100 iteraciones: media 41.09 ms, p95 45.79 ms, p99 56.74 ms, carga local PASS.
- [x] Validar TypeScript PASS, suite completa 52 archivos / 253 pruebas PASS, build PASS y `git diff --check` PASS.
- [x] Mantener `PENDING_EXTERNAL` para hosts reales, colas durables, mTLS, observabilidad bajo concurrencia y revisión profesional.

## ARKI-PARAMETRIC-RUNTIME — cierre seguro 2026-09-21
- [x] Crear página propia con preview geométrico SVG determinista, sliders, tutorial y ejercicio evaluable.
- [x] Persistir sesiones por propietario y proyecto, con parámetros, preview, progreso y puntaje.
- [x] Crear formato gobernado `ARKI-ARK-1.0` para propuestas volumétricas trazables.
- [x] Permitir exportación local de paquete `.ark` + `.dyn` + `.ghx`.
- [x] Implementar lectura y asimilación de `.ark` como propuesta, preservando provenance, UNKNOWNs y revisión humana.
- [x] Mantener separación entre el motor único y hosts externos Dynamo/Revit/Rhino/Grasshopper.
- [x] Generar migración `drizzle/0003_jazzy_colossus.sql` y aplicar tabla `arki_command_sessions`.
- [x] Validar: `pnpm check` PASS; 53 test files / 257 tests PASS; `pnpm build` PASS; ruta `/arki-parametric-runtime` HTTP 200; `git diff --check` PASS.
- [~] PENDING_EXTERNAL: ejecutar `.dyn` en Dynamo/Revit autorizado y producir `.rvt` nativo; requiere host autorizado no disponible localmente.
- [~] PENDING_EXTERNAL: ejecutar `.ghx` en Rhino/Grasshopper autorizado y producir `.gh` nativo; requiere host autorizado no disponible localmente.
- [~] PENDING_EXTERNAL: activar endpoints reales de host, colas durables y benchmarks de carga externos; requiere infraestructura externa.
- [x] No se afirma que los binarios nativos profesionales hayan sido generados localmente.

## .ark canónico y ciclo de interpretación — cierre 2026-09-21
- [x] Extender `ARKI-ARK-1.0` con manifest, project, geometry, semantics, provenance, requirements, objectives, constraints, preferences, alternatives, evaluations, unknowns, conflicts, decisions, history y externalArtifacts.
- [x] Distinguir entidades y relaciones OBSERVED frente a INFERRED sin promover inferencias a hechos.
- [x] Implementar interpretación local con observados, inferidos, UNKNOWNs, conflictos, déficits, oportunidades y próximos pasos.
- [x] Preservar el ciclo IMPORT → INTERPRET → revisión humana → ASSIMILATE sin convertir automáticamente una geometría en decisión arquitectónica.
- [x] Validar nuevamente TypeScript, build, suite completa de 53 archivos / 257 pruebas y `git diff --check`.
- [x] PENDING_EXTERNAL: evaluación normativa, selección de alternativas y decisión requieren proyecto poblado, evidencia y autoridad humana.

## Comandos canónicos compartidos — cierre 2026-09-21
- [x] Reutilizar directamente `client/src/content/commands-catalog.json` en ARKI-PARAMETRIC-RUNTIME.
- [x] Mostrar el subconjunto contextual: `/PROJECT OPEN`, `/PROJECT SET SCOPE`, `/OBJECTIVE SET`, `/CONSTRAINT SET`, `/EVIDENCE ADD`, `/HUMAN REVIEW`, `/INTERPRET REVIEW`, `/ALTERNATIVE PROMOTE`, `/MULTIOBJECTIVE` y `/DECISION RECORD`.
- [x] Mantener nombres, sintaxis y semántica canónicos sin crear un segundo catálogo o motor.
- [x] Añadir al preview el comando, sintaxis, proyecto, artefacto, geometría y provenance activos.
- [x] Mantener `/ALTERNATIVE PROMOTE` y `/DECISION RECORD` como acciones controladas por Human Authority, sin ejecución automática.
- [x] Documentar la integración en `ARKI_OPERATIONS_MANUAL.md`.
- [x] Validar TypeScript, build, suite completa de 53 archivos / 257 pruebas y `git diff --check`.

## Runtime estable y búsqueda de parámetros — 2026-09-21
- [x] Añadir barra de búsqueda para filtrar parámetros por nombre, clave, unidad y descripción.
- [x] Añadir barra de comandos persistente en ARKI-PARAMETRIC-RUNTIME con resolver canónico compartido.
- [x] Añadir atajo `Ctrl+Y` / `Cmd+Y` para enfocar la barra de comandos del runtime.
- [x] Añadir encabezado y pie de página personalizados al PDF de decisión humana aprobada, con proyecto y fecha actual.
- [x] Diagnosticar la pantalla blanca: el servidor entregaba HTML, pero el arranque quedaba esperando módulos críticos y solo mostraba el fallback.
- [x] Corregir el arranque con fallback estático de recuperación y convertir Home, Dashboard, CommandBar y Parametric Runtime en imports directos críticos.
- [x] Validar `pnpm check`, `pnpm build`, suite focalizada de 54 archivos / 262 pruebas y `git diff --check`.
- [x] Verificar visualmente el build estático: Home y `/arki-parametric-runtime` montan correctamente y muestran búsqueda, comandos y Ctrl+Y.
- [~] PENDING_EXTERNAL: actualizar el dominio publicado mediante el flujo de publicación WebDev; no existe una herramienta de publicación disponible en esta sesión.

## Corpus paramétrico didáctico — cierre 2026-09-21
- [x] Generar un ejemplo numerado por cada uno de los 67 comandos del catálogo canónico.
- [x] Incluir en cada ejemplo sintaxis, valores concretos, modo operativo, objetivo, provenance, UNKNOWNs y límite de ejecución.
- [x] Generar el paquete especial de `/GENERATE DESIGN` con `.ark`, `.dyn` y `.ghx` intercambiables.
- [x] Integrar el manifiesto en ARKI-PARAMETRIC-RUNTIME y mostrar los primeros ejemplos como biblioteca didáctica.
- [x] Crear README y documentación del corpus, diferenciando ejemplo repetible de ejecución real.
- [x] Crear `tools/validate_parametric_examples.mjs` y verificar 67/67 ejemplos, IDs únicos, archivos presentes y paquete geométrico completo.
- [x] Validar build de producción y mantener la autoridad humana y los límites de hosts externos.

## ARKI_ACCESS_EXPERIENCE_V1 — precedencia ejecutiva 2026-09-21
- [x] `pasted_content_536.txt` y las dos propuestas anteriores de First Contact/AR quedan documentadas como `SUPERSEDED_BY: ARKI_ACCESS_EXPERIENCE_V1` y `DO_NOT_EXECUTE_SEPARATELY`.
- [x] Se conserva y reutiliza el trabajo válido de PWA, First Contact, Parametric Runtime y Field Mode.
- [x] Se completa la macroorden consolidada sobre una sola aplicación ARKI Web App, sin crear una aplicación paralela.
- [x] Se mantienen un solo Project State, Command Resolver, catálogo canónico, historial y modelo de autoridad humana.

## Access Runtime v2 — AR espacial, autenticación y Project State
- [x] Añadir adaptador WebXR con detección `immersive-ar`, `local-floor`, `hit-test`, `dom-overlay` y estado degradado de cámara/orientación.
- [x] Mantener límites epistemológicos: capacidad del dispositivo no equivale a precisión, tracking validado ni anclaje persistente.
- [x] Exponer catálogo público `spatialAr.catalog` con revisión humana obligatoria.
- [x] Añadir opciones Google, Microsoft y Apple condicionadas a URLs OAuth configuradas; preservar Manus OAuth con nonce/state y no almacenar credenciales.
- [x] Implementar `projects.saveInitialIntake` con control optimista de versión, evento `INITIAL_INTAKE_PERSISTED`, provenance `USER_PROVIDED` y `UNKNOWN` literal.
- [x] Validar 55 archivos / 264 pruebas PASS, TypeScript PASS, build PASS, diff PASS y Field Mode renderizado en navegador.
- [x] Mantener `PENDING_EXTERNAL`: gateway/callback social autorizado, SICL Core intake remoto, hardware WebXR, precisión de tracking y anclaje espacial persistente.

## AR espacial móvil — compatibilidad y superficies
- [x] Revisar MiLukita: su repositorio actual no contiene una solución AR ejecutable; C-001 está `BLOCKED` y exige separar evidencia de diseño y marcar requisitos físicos.
- [x] Adoptar ese principio en ARKI: WebXR opcional, detección explícita de capacidad, fallback cámara/orientación y no declarar precisión sin dispositivo real.
- [x] Implementar indicador animado `DETECTING` mientras se solicita hit-test y el usuario mueve el teléfono.
- [x] Implementar hit-test real sobre `viewer` + `local-floor`, estado `FOUND` cuando aparece una pose de superficie y botón de intento de anclaje mediante `createAnchor` cuando el dispositivo lo expone.
- [x] Mostrar estados `CHECKING_CAPABILITIES`, `IMMERSIVE_AR_RUNNING`, `NO_HIT_TEST`, `CAMERA_ORIENTATION_FALLBACK` y `AR_UNAVAILABLE`.
- [x] Validar TypeScript PASS, build PASS, 55 archivos / 264 pruebas PASS, diff PASS.
- [x] Mantener `PHYSICAL_VALIDATION_REQUIRED`: no se declara compatibilidad universal ni anclaje validado sin pruebas en teléfonos reales.

## Reinicio AR y seguridad de ejecución móvil
- [x] Añadir botón `Reiniciar detección` durante una sesión WebXR activa.
- [x] El reinicio cierra la sesión, libera hit-test/reference-space, limpia superficie/anclaje y vuelve a comprobar capabilities.
- [x] Añadir `Reintentar AR` cuando el runtime queda en fallback o no disponible.
- [x] Documentar que el código en el teléfono es inspeccionable y no confiable: no incluir secretos, autorización definitiva ni tokens permanentes.
- [x] Mantener servidor/SICL Core como autoridad para identidad, permisos, persistencia, publicación y auditoría.
- [x] Validar TypeScript PASS, build PASS, 55 archivos / 264 pruebas PASS y diff PASS.
- [x] La prueba física Android moderno/antiguo/iPhone queda `PHYSICAL_VALIDATION_REQUIRED`; el navegador sandbox no sustituye dispositivos reales.

## Fallback 3D local para dispositivos sin AR
- [x] Reutilizar el visor 3D existente `/spatial?mode=3d` basado en Three.js/React Three Fiber.
- [x] Añadir en Field Mode el botón `Abrir visualización 3D alternativa`.
- [x] Mantener la misma `SpatialRepresentation` canónica para 2D, 3D y AR; no crear geometría paralela.
- [x] Conservar órbita, paneo, zoom, reset de cámara, selección de masas y métricas.
- [x] Documentar degradación progresiva: WebXR → cámara/orientación → 3D local → 2D/métricas.
- [x] Validar `pnpm check`, build, suite completa de 264 pruebas y `git diff --check` PASS.
- [x] Mantener el límite: 3D local no equivale a tracking espacial ni anclaje físico.

## ARKI WebApp / PWA — migración consolidada
- [x] Mantener una única aplicación ARKI con manifest instalable, start URL `/arki`, scope global y modo standalone.
- [x] Registrar service worker solo en producción para evitar interferencias con el desarrollo/HMR.
- [x] Mejorar cache del shell y fallback offline; no cachear `/api/`, `/trpc/` ni `/oauth/`.
- [x] Añadir aviso de instalación, estado offline y actualización controlada del service worker.
- [x] Preservar autenticación, Project State, decisiones, permisos y persistencia canónica en servidor.
- [x] Documentar límites: PWA no equivale a app nativa ni garantiza WebXR/cámara/GPS en todos los equipos.
- [x] Validar TypeScript PASS, build PASS, 55 archivos / 264 pruebas PASS, validación estática PWA PASS, HTTP smoke PASS y `git diff --check` PASS.

## ARKI THREE-LAYER ARCHITECTURE v1 — cierre local verificado
- [x] Clasificar responsabilidades reales en EDGE, BRAIN, CORE/TRUST y CROSS-CUTTING con mapa forense de dependencias, riesgos y decisión de no mover masivamente archivos.
- [x] Implementar contrato `server/arkiThreeLayerArchitecture.ts` con ownership, dependencias permitidas, autoridad, estados epistémicos, aislamiento y observabilidad acotada.
- [x] Exponer `architecture.contract`, `architecture.layers` y `architecture.verticalProof` como endpoints read-only sin crear motor paralelo.
- [x] Reutilizar Unified Motor, SICL Core, resolver canónico y Project State existentes.
- [x] Cubrir contract tests A–G: preview no muta Core, candidato no es decisión, Core valida/autoriza, permisos inválidos se rechazan, UNKNOWN no se promueve, Human Authority es obligatoria y fallos se aíslan.
- [x] Ejecutar prueba vertical USER → EDGE → PARAMETRIC_EXPLORE → BRAIN_ANALYSIS → USER_APPLY → COMMAND_RESOLUTION → CORE_VALIDATION → PROJECT_STATE → HISTORY → CLOSE → REOPEN.
- [x] `pnpm check` PASS; suite completa 56 archivos / 271 tests PASS; `pnpm build` PASS; `git diff --check` PASS.
- [x] Preview de producción 4176: Home monta, First Contact visible, `/arki-parametric-runtime` monta, 67 ejemplos y controles visibles, consola sin errores.
- [x] Diagnóstico del dev server: tras muchas recargas el navegador recibió `Too many requests`; preview limpio de producción fue la evidencia válida y no mostró el fallo.
- [x] Sentinel, Red, motores nuevos, comandos nuevos, aprendizaje autónomo, integraciones externas y despliegue productivo permanecen NOT_IMPLEMENTED/PENDING_EXTERNAL según alcance autorizado.

## Offline Sync + Mobile Performance — 2026-09-21
- [x] Cola durable en IndexedDB con fallback localStorage para intake inicial.
- [x] Reintentos exponenciales, máximo de 8 intentos y retención de errores sin perder datos.
- [x] Integración con First Contact: el intake se guarda localmente cuando no hay conexión y se crea/sincroniza al volver online.
- [x] Indicador visible de estado offline, sincronización, errores y operaciones pendientes.
- [x] Señal opcional de Background Sync en el service worker; APIs y datos sensibles nunca se cachean.
- [x] Caché PWA versionada como `arki-static-v3-offline-sync`.
- [x] Particionado Rollup adicional para vendor React, datos, UI, gráficos y 3D; los visores 3D siguen bajo demanda.
- [x] Validación: `pnpm check` PASS; 57 archivos / 273 tests PASS; build PASS; manifest y service worker PASS; diff limpio.
- [~] PENDING_PHYSICAL_DEVICE_EVIDENCE: el harness y protocolo están documentados; las pruebas reales en Android moderno, Android antiguo e iPhone requieren esos dispositivos.

## Security Hardening v1 — 2026-09-21
- [x] Añadir headers: `nosniff`, `SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Resource-Policy`, `Origin-Agent-Cluster` y HSTS bajo HTTPS.
- [x] Añadir CSP estricta en producción con `script-src 'self'`, `object-src 'none'`, `frame-ancestors 'self'`, `form-action 'self'` y endpoint de reportes; desarrollo conserva `Report-Only` para HMR.
- [x] Añadir guardia de origen para mutaciones HTTP; permitir host actual, `ARKI_ALLOWED_ORIGINS` y clientes sin header Origin.
- [x] Añadir rate limiting en memoria para OAuth, Core y tRPC con `429` y `Retry-After`.
- [x] Endurecer WebSocket paramétrico: maxPayload 16 KiB, 1 canal/socket, 50 suscriptores/canal, 30 mensajes/minuto, validación de origen y ping.
- [x] Mantener intactos `protectedProcedure`, `adminProcedure` y el acceso temporal de interfaz; no se debilitó autenticación backend.
- [x] Crear panel `/security-events` protegido por `adminProcedure`, con eventos CSP, rate limit, origen y WebSocket en ring buffer de 500 registros.
- [x] Crear `server/security.test.ts` y actualizar `docs/arki-enterprise/ARKI_SECURITY_HARDENING.md`.
- [x] Validar: `pnpm check` PASS; 58 archivos / 277 tests PASS; build PASS; header `Content-Security-Policy` verificado en producción; ruta `/security-events` HTTP 200; diff limpio.
- [~] PENDING_PRODUCTION_SECURITY: rate limiting distribuido, WAF/DDoS, SAST/DAST, rotación de secretos, backups cifrados y pentest profesional requieren infraestructura y operación de producción.
