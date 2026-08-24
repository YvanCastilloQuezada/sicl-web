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
- [ ] Verificación visual y funcional en navegador en escritorio y móvil.
- [ ] Checkpoint final reproducible antes de entregar.

## Auditoría de integración — pendientes añadidos

- [x] Integrar la capa tRPC con los contratos reales de SICL en `/home/ubuntu/SICL_0_2_1`, con fallback local explícito y aislado; la eliminación completa del modelo paralelo queda fuera de esta fase.
- [x] Renderizar en la UI la salida real de Council y comparaciones desde el endpoint read-only.
- [x] Completar el flujo web de evaluaciones y comparaciones trazables para habilitar Recommendations analíticas de extremo a extremo.
- [x] Implementar versionado real del ciclo de Recommendations, no solo `recommendationVersion: 1`.
- [x] Añadir paso separado de preparación de Decision antes del registro durable.
- [ ] Ejecutar y documentar el flujo completo en navegador en escritorio y móvil.

## Integración aprobada con núcleo Python

- [x] Definir contrato HTTP versionado entre el núcleo Python y `sicl-web`.
- [x] Implementar servicio adaptador Python separado sin duplicar reglas de dominio.
- [x] Conectar tRPC al adaptador mediante un cliente anti-corrupción autenticado.
- [ ] Verificar que errores de dominio, conflictos de versión y autoridad se preservan extremo a extremo contra una instancia real del núcleo Python.
- [ ] Verificar flujo completo en escritorio y móvil después de la integración real.

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
- [ ] Definir el registro de `SICL_CORE_URL` después del alojamiento real.
- [x] Validar readiness del servicio sin ejecutar un despliegue irreversible.

## Despliegue aprobado en Cloud Computer Manus

- [ ] Confirmar que el Cloud Computer está creado y adjunto a la sesión.
- [x] Preparar Dockerfile y contexto reproducible para `sicl-core-http`.
- [ ] Configurar `/data/sicl/` como almacenamiento persistente de SQLite.
- [ ] Configurar UFW para exponer únicamente SSH y HTTPS.
- [ ] Crear unidad systemd con reinicio automático del servicio.
- [ ] Configurar HTTPS y obtener la URL real del servicio.
- [ ] Registrar `SICL_CORE_URL` en el entorno server-side de `sicl-web`.
- [ ] Ejecutar verificación end-to-end de snapshots, Council y flujos humanos.
- [ ] Adjuntar el Cloud Computer Manus y ejecutar la instalación real de `/data/sicl/`.
- [ ] Verificar que `core.sqlite` persiste fuera del contenedor tras reinicio del servicio.
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
- [ ] Verificar visualmente Council y Audit con datos canónicos poblados en escritorio y móvil.

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
- [ ] Ejecutar y documentar una verificación funcional de navegador del flujo Alternatives & Evaluation → Recommendation en escritorio y móvil cuando exista un proyecto de prueba poblado.

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
