# RFC-015 — Frontend v2 de SiMS-DeI / SICL

**Estado:** DEFINITION ONLY — NO IMPLEMENTATION

**Sistema:** SiMS-DeI — Sistema de Inteligencia de Diseño Espacial Multiescala

**Lenguaje formal:** SICL — Spatial Intelligence Command Language

**Frontend base:** `sicl-web@main@76550a6e`

**Rama documental:** `docs/rfc-015-frontend-v2`

**Fecha:** 15 de septiembre de 2026

> Este RFC define la evolución UX/UI del frontend para reflejar el Core SiMS-DeI 2.1. No autoriza implementación en esta fase. La interfaz debe visualizar información, trazabilidad y autoridad humana; nunca debe convertir una recomendación en una decisión.

## 1. Objetivo y alcance

RFC-015 define el contrato funcional, visual y de navegación para el Frontend v2. Su objetivo es que un arquitecto pueda explorar las entidades, estados, relaciones y evidencias del Core sin perder la distinción entre hechos, supuestos, análisis, recomendaciones y decisiones humanas.

El alcance incluye la arquitectura de información, los módulos de interfaz, los componentes compartidos, la visibilidad de estados de conocimiento, la navegación, la identidad visual, el placeholder del copiloto, los criterios de pruebas E2E y las fases de implementación propuestas.

El alcance no incluye código React, cambios en `sicl-web`, modificaciones al Core Python, nuevas entidades del dominio, nuevos endpoints ni despliegues. Este documento permanece como contrato de diseño hasta que una orden posterior autorice una fase de implementación.

La superficie canónica de datos será el contrato HTTP `/v1/...` aprobado e implementado por el Core. El frontend no inventará estados ni rellenará silenciosamente datos ausentes. Cuando una operación no exista o esté bloqueada por contrato, la interfaz lo mostrará explícitamente.

## 2. Estado actual del frontend v1

El frontend v1 dispone de un Command Center con navegación de módulos y una integración técnica del cliente server-side hacia la superficie `/v1/...`. Conserva autenticación, layout de dashboard, temas claro/oscuro/sistema, navegación reactiva y pruebas Vitest existentes.

Los módulos visibles actuales cubren principalmente Project, Context, Objectives, Alternatives, Council, Decision & Audit y Governance. La adaptación RFC-002 Phase D conecta el gateway web con envelopes canónicos, snapshot, historial, Preference, HumanReview, Council read-only y la delegación de decisiones.

La v1 no presenta una interfaz completa para todas las capacidades del Core 2.1. Evidence, Source, Evaluation, Comparison, Simulation, Design Intelligence, Planning Instruments, Regulatory Intelligence, Multiscale Relations, Design Generation, Institutional Memory, Multi-Actor y Temporal Cycles carecen de módulos de usuario equivalentes.

La brecha principal es de representación, no necesariamente de capacidad del backend. El Core puede exponer entidades que el usuario todavía no puede consultar o administrar desde una vista dedicada. RFC-015 propone cerrar esa brecha por fases y conservar los límites constitucionales durante la transición.

La v1 tampoco debe ocultar la procedencia de los datos. Cada vista futura deberá diferenciar datos observados, datos derivados, supuestos, evaluaciones expertas, recomendaciones y decisiones registradas por autoridad humana.

## 3. Principios constitucionales de la interfaz

1. **Recommendation no es Decision.** Una tarjeta de recomendación puede explicar alternativas y trade-offs, pero no puede activar por sí misma una decisión.
2. **HumanReview no es Decision.** La revisión humana es una etapa explícita y trazable previa a una decisión cuando el contrato la exige.
3. **La autoridad humana permanece visible.** Actor, rol, autoridad, motivo y timestamp deben aparecer en cualquier pantalla de decisión.
4. **Fact no es Assumption.** El color, icono, etiqueta y texto de ayuda deben evitar que un supuesto parezca una observación verificada.
5. **La evidencia tiene fuente.** Evidence debe enlazar con Source, método, fecha, estado y referencia durable cuando estén disponibles.
6. **Los eventos son append-only.** El frontend puede mostrar el historial, pero no editar eventos históricos.
7. **Read-only significa read-only.** Council, Design Principles y catálogos declarados como lectura no deben mostrar controles de escritura.
8. **Sin autoridad implícita.** Un agente, copiloto, cálculo o recomendación no puede aparecer como autor de una Decision.
9. **Sin fallback silencioso.** El usuario debe saber si los datos provienen del Remote Core, de un entorno local explícito o si la operación está bloqueada.
10. **La ausencia es información.** UNKNOWN, CONFLICTING e INSUFFICIENT son estados visibles, no espacios vacíos disfrazados.

## 4. Entidades que Frontend v2 debe reflejar

La siguiente tabla define la representación mínima esperada. Los componentes concretos se decidirán durante la implementación, pero ninguna entidad debe perder su semántica.

| Entidad | Representación mínima | Regla de autoridad |
|---|---|---|
| Project | Identidad, nombre, scopes y versión | No decide |
| Stage | Estado del ciclo del proyecto | Transición según contrato |
| Objective | Meta, dirección, valor y trazabilidad | No es restricción |
| Constraint | Límite, operador, valor y estado | No se relaja visualmente |
| Role | Rol asignado a un actor | No equivale automáticamente a autoridad decisional |
| Fact | Afirmación observada y fuente | No editable como Assumption |
| Assumption | Hipótesis, base y confianza | No puede presentarse como Fact |
| Evidence | Registro de soporte verificable | Requiere procedencia |
| Source | Origen de una afirmación o evidencia | Debe poder consultarse |
| Alternative | Opción de diseño o acción | No es Recommendation |
| Evaluation | Valoración explicada y trazable | No decide |
| Comparison | Relación analítica entre alternativas | Read-only si el contrato así lo define |
| Recommendation | Resultado analítico o consejo | Nunca crea Decision automáticamente |
| HumanReview | Revisión explícita de una persona | Precede a Decision cuando aplica |
| Decision | Registro humano con actor y autoridad | Solo autoridad humana |
| SiteObservation | Observación contextual del sitio | No infiere normativa sin fuente |
| Simulation | Ejecución reproducible de método | No es predicción cierta |
| DesignPrinciple | Principio de diseño consultable | Read-only en su catálogo |
| PlanningInstrument | Instrumento de planificación | Requiere estado y procedencia |
| Regulation | Registro de fuente normativa | No es asesoría jurídica |
| NormativeInterpretation | Interpretación con disclaimer | No sustituye revisión profesional |
| NormativeSnapshot | Versión congelada del corpus normativo | No se modifica históricamente |
| ScaleRelation | Relación entre escalas espaciales | Debe mostrar origen y destino |
| GeneratedAlternative | Alternativa generada por método | Requiere promoción humana |
| InstitutionalMemory | Conocimiento institucional versionado | Aplicación explícita y auditable |
| Actor | Persona o participante identificado | No implica autoridad por sí solo |
| ActorPosition | Posición, intereses y condiciones de actor | No es Decision |
| TemporalCycle | Ciclo o periodo temporal | Debe mostrar fechas y estado |
| ScenarioBranch | Rama de escenario | No es hecho observado |
| Event | Registro histórico append-only | No editable ni eliminable |

## 5. Módulos UI propuestos

### 5.1 Proyecto

Actualizar el módulo existente para mostrar `spatial_scope`, `temporal_scope`, versión observada, Stage, identidad del proyecto y enlaces a escalas relacionadas. Debe mostrar el estado de conectividad del Remote Core sin revelar tokens.

### 5.2 Contexto / Sitio

Actualizar la vista para SiteObservation, ubicación, método de captura, timestamp, estado de conocimiento, respuesta fuente y enlace de evidencia. No debe inferir zonificación ni presentar una interpretación normativa como observación.

### 5.3 Evidencia

Nuevo módulo para listar, crear cuando el endpoint esté autorizado, consultar y relacionar Evidence con Source. La interfaz deberá mostrar hash, estado, fecha, método y referencias verificables.

### 5.4 Fuentes

Nuevo módulo de catálogo y detalle para Source. Debe permitir navegar desde una afirmación, evidencia, regulación o interpretación hasta su origen declarado.

### 5.5 Objetivos y limitaciones

Actualizar la vista de Objective y Constraint. El usuario debe distinguir objetivos cuantitativos de restricciones duras, estados incompletos y relaciones con escalas o escenarios.

### 5.6 Preferencias

Nuevo módulo para registrar Preference como entidad distinta. La pantalla debe mostrar confirmación de persistencia y el evento correspondiente, sin convertir la preferencia en una decisión.

### 5.7 Alternativas

Actualizar la vista para Alternative y GeneratedAlternative. Las alternativas generadas deben estar marcadas como generadas y requerir promoción humana antes de adquirir un estado de alternativa adoptada.

### 5.8 Evaluaciones

Nuevo módulo para Evaluation, con agente o método, valores, explicación, inputs y procedencia cuando estén disponibles. Debe impedir que el usuario confunda una evaluación con una recomendación.

### 5.9 Comparaciones

Nuevo módulo para Comparison. Debe mostrar dimensiones comparadas, alternativas participantes, objetivos relacionados y limitaciones de los datos.

### 5.10 Simulación

Nuevo módulo para Simulation. Debe mostrar método, parámetros, hash de inputs, resultado, estado y reproducibilidad. El resultado no debe ser presentado como una Decision.

### 5.11 Diseño

Nuevo módulo de DesignPrinciple, inicialmente de consulta. Debe distinguir catálogo de principios, aplicación contextual y decisión humana.

### 5.12 Planificación

Nuevo módulo para PlanningInstrument, tipos, estado, versión, source y vínculos con el proyecto. Debe señalar claramente instrumentos vacíos o no cargados.

### 5.13 Normativa

Nuevo módulo para Regulation, NormativeInterpretation y NormativeSnapshot. Debe incluir el disclaimer visible de responsabilidad técnica y no certificación legal.

### 5.14 Multiescala

Nuevo módulo para ScaleRelation y el mapa de nueve escalas. Debe permitir comprender relación espacial y temporal sin asumir propagación automática de decisiones.

### 5.15 Generación

Nuevo módulo para GeneratedAlternative. Debe mostrar el método generativo, estado, inputs, output y control de promoción humana.

### 5.16 Memoria institucional

Nuevo módulo para InstitutionalMemory, versiones, confianza, anonimización, revocación y aplicación explícita. La memoria no debe actuar como autoridad autónoma.

### 5.17 Actores

Nuevo módulo para Actor y ActorPosition. Debe separar identidad, rol, posición, intereses, condiciones y autoridad decisional.

### 5.18 Ciclos temporales

Nuevo módulo para TemporalCycle y ScenarioBranch. Debe mostrar fechas, stance, hipótesis y relaciones entre ramas sin confundir escenarios con hechos.

### 5.19 Consejo / Recomendación

Actualizar el módulo Council para presentar síntesis analítica, evaluaciones y Recommendation. Debe mostrar un control separado para iniciar HumanReview, nunca un botón directo de Decision desde la recomendación.

### 5.20 Decisión y auditoría

Actualizar Decision & Audit para exigir HumanReview, actor, role/authority y reason cuando el contrato lo requiera. El historial debe ser consultable y append-only.

### 5.21 Gobernanza

Actualizar Governance para presentar invariantes, estados de contrato, fuentes, decisiones del Product Owner y límites del sistema. No debe permitir cambiar la constitución desde una vista operativa.

## 6. Sistema de componentes

El sistema visual debe usar componentes compartidos y consistentes, evitando crear una interfaz distinta para cada entidad.

| Necesidad | Componente propuesto | Uso |
|---|---|---|
| Resumen | Card | Identidad y métricas principales |
| Colección | Tabla | Listados filtrables y ordenables |
| Edición | Formulario | Operaciones permitidas por contrato |
| Confirmación | Modal | Acciones críticas y autoridad explícita |
| Estado | Badge | UNKNOWN, CONFLICTING, INSUFFICIENT, OBSERVED |
| Relación | Graph panel | Escalas, fuentes y dependencias |
| Historial | Timeline | Event append-only y trazabilidad |
| Métrica | Chart | Evaluaciones, comparaciones y simulaciones |
| Contexto | Breadcrumb | Ubicación dentro del proyecto |
| Asistencia | Panel lateral | Placeholder RFC-014, sin ejecución automática |

Cada componente de escritura debe declarar su estado de carga, éxito, error, autorización requerida y respuesta del Remote Core. Los botones no disponibles deben explicar si la causa es contrato, permiso, estado del proyecto o ausencia de evidencia.

Las tablas deberán soportar estados vacíos informativos, paginación o carga progresiva cuando sea necesario, filtros por estado epistemológico y enlaces a fuentes.

Los formularios deben validar tipos y campos requeridos antes de enviar. La validación visual no reemplaza la validación server-side del Core.

Los modales de acciones humanas deben mostrar un resumen de payload, actor autenticado, autoridad declarada y consecuencias antes de confirmar.

## 7. Estados de conocimiento visibles

Los estados se mostrarán con color, texto, icono accesible y explicación textual. Nunca se dependerá solo del color.

| Estado | Color base | Significado | Conducta UI |
|---|---|---|---|
| UNKNOWN | Gris | No existe conocimiento suficiente | Mostrar qué falta |
| CONFLICTING | Rojo | Existen afirmaciones incompatibles | Mostrar conflicto y fuentes |
| INSUFFICIENT | Amarillo | Hay datos, pero no bastan para concluir | Mostrar limitación |
| OBSERVED | Verde | Dato observado con soporte | Mostrar fuente y timestamp |

Los estados de conocimiento no son estados de autorización. Un dato OBSERVED no concede autoridad para decidir. Un dato UNKNOWN no debe impedir consultar el contexto, pero sí debe advertir cuando una operación requiere mayor información.

## 8. Navegación

La navegación principal será una sidebar persistente con módulos agrupados por ciclo de trabajo: Proyecto, Contexto, Evidencia, Análisis, Generación, Planificación, Normativa, Escalas, Actores, Tiempo, Consejo, Decisión y Gobernanza.

La sidebar deberá indicar el módulo activo con `aria-current`, contraste suficiente y una etiqueta visual. Los módulos bloqueados por contrato deberán diferenciarse de los módulos sin datos.

La búsqueda global permitirá localizar proyectos, entidades, eventos, fuentes y comandos documentados. Los resultados deberán indicar tipo, proyecto, versión y estado epistemológico.

Breadcrumbs mostrarán `SiMS-DeI / Proyecto / Módulo / Entidad`. El usuario siempre tendrá una ruta de regreso al proyecto y al Command Center.

Las rutas profundas deberán ser reproducibles mediante URL cuando la seguridad y el contrato lo permitan. La interfaz no debe colocar secretos, tokens o credenciales en la URL, HTML, Local Storage ni estado público.

## 9. Referencia visible a SiMS-DeI

El header debe mostrar el nombre **SiMS-DeI**, el lenguaje formal **SICL** y la versión de producto **2.1**. La versión visible describe el baseline del sistema y no sustituye la versión del contrato de cada respuesta.

El mapa de nueve escalas debe estar disponible como vista de referencia. Cada escala deberá mostrar nombre, nivel, propósito, entidades relevantes y relaciones permitidas, sin implicar que toda capacidad está habilitada para escritura.

## 10. Paleta visual

La paleta debe priorizar legibilidad profesional para arquitectos y revisión de datos. Se propone una base neutra de fondo claro, carbón para texto, azul profundo para navegación y acentos semánticos para estados.

- Gris: UNKNOWN y metadatos no concluyentes.
- Rojo: CONFLICTING, errores o bloqueos.
- Amarillo: INSUFFICIENT y advertencias.
- Verde: OBSERVED y operaciones confirmadas.
- Azul: navegación, fuentes y acciones informativas.
- Violeta: análisis y recomendaciones, sin usarlo para autoridad.

La tipografía debe ser sans-serif legible, con jerarquía clara entre título, entidad, estado y procedencia. Los datos críticos deberán conservar suficiente tamaño y contraste en pantallas de escritorio y móvil.

La iconografía será lineal, consistente y acompañada de texto en acciones críticas. Un icono de recomendación no debe parecer un sello de aprobación decisional.

El modo claro, oscuro y sistema existente se preservará. Los estados semánticos deberán mantener contraste adecuado en los tres modos.

## 11. Copiloto integrado

RFC-015 reserva un panel placeholder para el Copiloto definido en RFC-014. Durante la Fase 1 del frontend v2 no se implementará el copiloto.

El placeholder puede explicar que la capacidad futura traducirá lenguaje natural a comandos SICL bajo confirmación humana. No deberá ejecutar comandos, modificar entidades ni producir una recomendación automática.

Cuando se implemente RFC-014, el panel deberá mostrar fuentes, comando propuesto, nivel del copiloto, estado de confirmación y resultado del Core. La interfaz deberá conservar la separación entre sugerencia y operación ejecutada.

## 12. Tests E2E

La estrategia propuesta utiliza Playwright o Cypress. La elección final queda pendiente de la fase de implementación y de la infraestructura del repositorio.

La cobertura mínima debe incluir autenticación, creación de Project, consulta de scopes, registro de Preference, consulta de Evidence y Source, lectura de Evaluation y Comparison, consulta de Simulation, recorrido de Recommendation, HumanReview y Decision, y visualización de Audit.

Los tests deberán comprobar expresamente que una Recommendation no crea una Decision, que una Decision exige autoridad humana, que HumanReview aparece como paso separado y que el navegador no recibe `SICL_CORE_SERVICE_TOKEN`.

También deberán comprobar estados UNKNOWN, CONFLICTING, INSUFFICIENT y OBSERVED, persistencia de filtros, navegación directa, responsive layout y comportamiento de los modos de tema.

Los flujos E2E deben ejecutarse contra el Remote Core configurado cuando se declare un release. Un fallback local solo puede usarse en desarrollo explícito y debe aparecer etiquetado como tal.

## 13. Fases de implementación propuestas

### Fase A — Entidades base

Implementar Evidence, Source, Evaluation y Comparison en vistas de consulta y escritura donde el contrato ya lo permita. Actualizar Project con scopes y mejorar Contexto/Sitio.

### Fase B — Entidades analíticas

Implementar Simulation, MultiobjectiveResult y DesignPrinciple. Priorizar transparencia de métodos, inputs, estados y limitaciones.

### Fase C — Entidades de dominio

Implementar PlanningInstrument, Regulation, NormativeInterpretation, NormativeSnapshot y ScaleRelation. Incluir disclaimers normativos y trazabilidad de fuentes.

### Fase D — Entidades 2.1

Implementar GeneratedAlternative, InstitutionalMemory, Actor, ActorPosition, TemporalCycle y ScenarioBranch. Mantener promoción, aplicación y autoridad explícitas.

### Fase E — Tests E2E y pulido

Completar pruebas E2E, accesibilidad, responsive behavior, estados vacíos, manejo de errores, seguridad de secretos, rendimiento y consistencia visual.

Ninguna fase deberá comenzar si el endpoint, schema y autoridad requerida no están definidos. La UI no debe crear contratos implícitos para llenar una pantalla.

## 14. Referencias

- RFC-001 — Multiscale Model.
- RFC-002 — Evidence HTTP.
- RFC-003 — Regulatory Corpus Model.
- RFC-004 — Design Intelligence Scope.
- RFC-005 — Evaluation / Comparison HTTP.
- RFC-006 — Simulation Contract.
- RFC-007 — Multiobjective Contract.
- RFC-008 — Planning Instruments Model.
- RFC-009 — Multiscale Relations and Objective Propagation.
- RFC-010 — Design Generation.
- RFC-011 — Institutional Memory.
- RFC-012 — Multi-Actor Model.
- RFC-013 — Temporal Cycles.
- RFC-014 — User Copilot.
- SiMS-DeI 2.0 — Master Architecture.
- User Manual de SiMS-DeI y SICL.
- Glosario de SiMS-DeI y SICL.

## 15. Criterios de aceptación del RFC

RFC-015 se considera documentalmente completo cuando cubre las treinta entidades solicitadas, los módulos UI propuestos, los componentes compartidos, los estados de conocimiento, la navegación, la referencia de SiMS-DeI, la paleta visual, el placeholder de RFC-014, la estrategia E2E, las cinco fases y las referencias.

La aceptación de este RFC no autoriza implementación. Una futura orden deberá seleccionar la fase, confirmar los endpoints disponibles, definir el alcance de cambios en `sicl-web`, actualizar los tests y declarar el criterio de release.

**FIN DEL RFC-015 — DEFINITION ONLY**
