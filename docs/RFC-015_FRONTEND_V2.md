# RFC-015 — Frontend v2 funcional de ARKI / SICL

**Estado:** FASE A IMPLEMENTED — Evidence, Source, Evaluation y Comparison; layout alineado con Home

**Criterio rector:** funcionalidad mínima, no estética.

**Sistema:** ARKI — Sistema de Inteligencia de Diseño Espacial Multiescala.

**Lenguaje formal:** SICL — Spatial Intelligence Command Language.

**Base:** `sicl-web@main@17422b2922918512dc5f93bb8371e57f0038d54a`.

**Rama documental:** `docs/rfc-015-frontend-v2`.

> El Frontend v2 es un vehículo operativo para usar el Core. No es el producto final. Debe ser simple, directo y funcional. La belleza, el branding y las visualizaciones avanzadas quedan para una etapa posterior con otra IA.

## 1. Objetivo y alcance

RFC-015 define el contrato funcional para que una persona pueda operar desde el navegador las entidades del Core ARKI 2.1. El objetivo es cubrir crear, listar y ver detalles de las entidades, usando datos del Core real y la superficie HTTP `/v1/...` existente.

El frontend v2 debe priorizar **mínimo esfuerzo y máxima funcionalidad**. Cada página puede ser una tabla simple con un formulario básico y una vista de detalle. No se busca un producto visual definitivo. Las páginas de Fase A reutilizan ahora un shell compartido con el mismo header, sidebar, paleta, tipografía y spacing del Command Center de Home.

Esta orden solo autoriza documentación. No autoriza React, CSS, componentes, endpoints, entidades, cambios de contrato, despliegue ni migración de datos.

El frontend definitivo se hará después con otra IA. Por tanto, RFC-015 no debe introducir pretensiones de diseño de producto final.

## 2. Principio rector

> **Mínimo esfuerzo, máxima funcionalidad. La belleza viene después.**

La implementación futura debe preferir componentes nativos o compartidos simples, formularios claros, tablas legibles y mensajes de error útiles. No debe invertir esfuerzo en animaciones, branding, gráficos elaborados o efectos visuales mientras falten páginas operativas.

La interfaz tampoco debe ocultar límites del contrato. Si una operación no existe, es read-only o está bloqueada, la página debe mostrarlo explícitamente.

Las invariantes constitucionales permanecen vigentes: `Recommendation ≠ Decision`, `HumanReview ≠ Decision`, Decision requiere autoridad humana y el navegador nunca recibe secretos server-side.

## 3. Estado actual del frontend v1

El frontend v1 tiene Command Center, autenticación, layout de dashboard, navegación entre módulos, temas claro/oscuro/sistema y adaptación técnica del gateway server-side hacia `/v1/...`.

Sus módulos visibles principales son Project, Context, Objectives, Alternatives, Council, Decision & Audit y Governance. También conserva los flujos existentes y las pruebas Vitest del repositorio.

La limitación principal es de cobertura de interfaz: el Core 2.1 tiene entidades que todavía no tienen página funcional en `sicl-web`. La brecha se resolverá por fases, sin presentar mocks como datos reales.

## 4. Entidades operables por Frontend v2

Cada entidad tendrá, como mínimo, operaciones de **crear cuando el contrato lo permita, listar y ver detalle**. `Editar` solo aparecerá si existe una operación autorizada y semánticamente segura. Los endpoints indicados son la superficie canónica prevista; si el endpoint aún no existe en el despliegue, la UI debe mostrar `BLOQUEADO POR CONTRATO`.

| Entidad | Operaciones mínimas | Endpoint REST asociado | Complejidad UI |
|---|---|---|---|
| Project | Crear, listar, ver detalle | `POST/GET /v1/projects`, `GET /v1/projects/{id}` | baja |
| Stage | Crear o cambiar estado, listar, ver | `POST /v1/projects/{id}/commands`, snapshot | baja |
| Objective | Crear, listar, ver | `POST /v1/projects/{id}/commands`, snapshot | baja |
| Constraint | Crear, listar, ver | `POST /v1/projects/{id}/commands`, snapshot | baja |
| Role | Crear, listar, ver | `POST /v1/projects/{id}/commands`, snapshot | baja |
| Fact | Crear, listar, ver | `POST /v1/projects/{id}/commands`, snapshot | baja |
| Assumption | Crear, listar, ver | `POST /v1/projects/{id}/commands`, snapshot | baja |
| Evidence | Crear, listar, ver | `POST/GET /v1/projects/{id}/evidence` | media |
| Source | Crear, listar, ver | `POST/GET /v1/sources` o ruta de Evidence | baja |
| Alternative | Crear, listar, ver | `POST /v1/projects/{id}/commands`, snapshot | baja |
| Evaluation | Crear, listar, ver | `POST/GET /v1/projects/{id}/evaluations` | media |
| Comparison | Crear, listar, ver | `POST/GET /v1/projects/{id}/comparisons` | media |
| Recommendation | Listar, ver detalle | Council/recommendation `/v1/...` disponible | media |
| HumanReview | Crear, listar, ver | `POST /v1/projects/{id}/human-review` | media |
| Decision | Crear con autoridad, listar, ver | `POST /v1/projects/{id}/decision` | media |
| SiteObservation | Crear, listar, ver | Site Intelligence `/v1/...` | media |
| Simulation | Crear, listar, ver | `POST/GET /v1/projects/{id}/simulations` | media |
| DesignPrinciple | Listar, ver | `GET /v1/design-principles` | baja |
| PlanningInstrument | Crear, listar, ver | `POST/GET /v1/planning-instruments` | media |
| Regulation | Crear, listar, ver | `POST/GET /v1/regulations` | media |
| NormativeInterpretation | Crear, listar, ver | `POST/GET /v1/normative-interpretations` | media |
| NormativeSnapshot | Crear/congelar, listar, ver | `POST/GET /v1/normative-snapshots` | media |
| ScaleRelation | Crear, listar, ver | `POST/GET /v1/projects/{id}/scale-relations` | media |
| GeneratedAlternative | Generar, listar, ver, promover | `POST/GET /v1/projects/{id}/generations` | media |
| InstitutionalMemory | Crear versión, listar, ver, aplicar | `POST/GET /v1/institutional-memory` | alta |
| Actor | Crear, listar, ver | `POST/GET /v1/projects/{id}/actors` | baja |
| ActorPosition | Crear, listar, ver | `POST/GET /v1/projects/{id}/positions` | media |
| TemporalCycle | Crear, listar, ver | `POST/GET /v1/projects/{id}/temporal-cycles` | media |
| ScenarioBranch | Crear, listar, ver | `POST/GET /v1/projects/{id}/scenario-branches` | media |
| Event | Listar, ver detalle | `GET /v1/projects/{id}/history` | baja |

La tabla no autoriza endpoints nuevos. Es una matriz de trabajo para conectar la UI únicamente con rutas realmente implementadas y aprobadas.

## 5. Módulos UI simplificados

Cada módulo será una página funcional con el mismo patrón:

1. Tabla simple con las entidades.
2. Botón **Crear** cuando exista una operación de escritura.
3. Formulario básico con validación server-side y client-side mínima.
4. Click en una fila para abrir detalle.
5. Botón **Editar** únicamente si aplica al contrato.
6. Estado de carga, error, vacío y operación bloqueada.

### 5.1 Proyecto

Lista de proyectos, creación, detalle, scopes y Stage.

### 5.2 Contexto / Sitio

SiteObservation, ubicación, método, fecha, estado y fuente.

### 5.3 Evidencia

Evidence y Source en tablas relacionadas; detalle con procedencia.

### 5.4 Objetivos y limitaciones

Objective, Constraint y Requirement cuando exista en el contrato.

### 5.5 Preferencias

Registro y consulta de Preference como entidad distinta de Decision.

### 5.6 Alternativas

Alternative y GeneratedAlternative; promoción humana visible.

### 5.7 Evaluaciones

Evaluation por método o agente, con valor y explicación.

### 5.8 Comparaciones

Comparison entre alternativas y objetivos.

### 5.9 Simulación

Formulario de parámetros, ejecución autorizada y resultado reproducible.

### 5.10 Diseño

Listado simple de DesignPrinciple; inicialmente puede ser read-only.

### 5.11 Planificación

PlanningInstrument con tipo, estado, versión y fuente.

### 5.12 Normativa

Regulation, NormativeInterpretation y NormativeSnapshot con disclaimer visible.

### 5.13 Multiescala

ScaleRelation con origen, destino y tipo de relación.

### 5.14 Generación

GeneratedAlternative, método, inputs, estado y promoción.

### 5.15 Memoria

InstitutionalMemory, versión, confianza, revocación y aplicación explícita.

### 5.16 Actores

Actor y ActorPosition separados, con roles, intereses y condiciones.

### 5.17 Ciclos

TemporalCycle y ScenarioBranch con fechas, estado y stance.

### 5.18 Consejo / Recomendación

Recommendation y análisis. No debe mostrar botón directo de Decision.

### 5.19 Decisión y auditoría

HumanReview, Decision y Event history. La decisión exige actor y autoridad.

### 5.20 Gobernanza

Estados del contrato, invariantes, límites y decisiones del Product Owner.

## 6. Estados de conocimiento visibles

Los estados se mostrarán solo con etiquetas sencillas y color semántico:

| Estado | Etiqueta | Color |
|---|---|---|
| UNKNOWN | UNKNOWN | gris |
| CONFLICTING | CONFLICTING | rojo |
| INSUFFICIENT | INSUFFICIENT | amarillo |
| OBSERVED | OBSERVED | verde |

El color siempre irá acompañado de texto. No se necesita una visualización elaborada. El detalle debe explicar qué falta, qué entra en conflicto o qué fuente respalda el estado.

Un estado OBSERVED no concede autoridad decisional. Un estado UNKNOWN no debe rellenarse con una inferencia silenciosa.

## 7. Navegación mínima

La navegación será una sidebar con todos los módulos. Se prioriza que cada página sea accesible y tenga una ruta de regreso al proyecto.

No se requiere búsqueda avanzada. No se requieren breadcrumbs complejos. Puede existir un breadcrumb simple si ayuda a volver al proyecto.

El header mostrará `ARKI` y `2.1`. No se requiere branding visual, logotipo nuevo ni sistema de diseño definitivo.

## 8. Paleta visual mínima

La paleta será blanco y negro, con colores reservados para estados de conocimiento y errores. Se usará la tipografía del sistema sans-serif por defecto.

No se requiere iconografía custom. No se requieren animaciones. No se requieren gradientes, ilustraciones, motion design ni componentes visuales de marca.

El modo claro, oscuro y sistema existente podrá conservarse, pero no se ampliará la estética para esta fase. La legibilidad y el contraste son suficientes.

## 9. Lo que no incluye Frontend v2 funcional

Esta versión no incluye animaciones, branding visual, gráficos complejos, visualización Pareto avanzada, mapas, visualizaciones 3D, copiloto conversacional, onboarding guiado ni manual interactivo.

El Copiloto RFC-014 se mantiene como placeholder documental, no como implementación. El frontend definitivo se realizará posteriormente con otra IA.

## 10. Fases de implementación propuestas

### Fase A — Entidades base

Evidence, Source, Evaluation y Comparison. Crear, listar y detalle donde existan endpoints. Actualizar Project, Contexto, Objective y Constraint.

### Fase B — Entidades analíticas

Simulation, MultiobjectiveResult y DesignPrinciple. Mostrar inputs, resultados, método y limitaciones sin gráficos complejos.

### Fase C — Entidades de dominio

PlanningInstrument, Regulation, NormativeInterpretation, NormativeSnapshot y ScaleRelation. Incluir fuentes y disclaimer normativo.

### Fase D — Entidades 2.1

GeneratedAlternative, InstitutionalMemory, Actor, ActorPosition, TemporalCycle y ScenarioBranch.

### Fase E — Verificación E2E funcional

Recorrer Project → Evidence → Objective → Alternative → Evaluation → Comparison → Recommendation → HumanReview → Decision → Audit. Comprobar datos del Core real, autoridad humana y ausencia de secretos.

Duración estimada de cada fase: 3–5 días. Es una estimación de planificación, no una autorización de ejecución.

## 11. Criterios de aceptación funcional

El Frontend v2 funcional será aceptable cuando:

- Cada entidad tenga una página o una vista claramente identificable.
- Cada entidad tenga crear, listar y detalle cuando el contrato lo permita.
- Las operaciones bloqueadas indiquen `BLOQUEADO POR CONTRATO`.
- Los estados UNKNOWN, CONFLICTING, INSUFFICIENT y OBSERVED sean visibles.
- Los datos provengan del Core real y no de mocks silenciosos.
- El usuario pueda recorrer el flujo Evidence → Decision cuando las rutas estén desplegadas.
- Recommendation no cree Decision.
- HumanReview aparezca separado de Decision.
- Decision exija actor, authority y revisión humana cuando corresponda.
- Event history sea solo lectura.
- No haya tokens ni secretos en HTML, Local Storage o respuestas públicas del navegador.
- La interfaz sea simple, incluso si es visualmente fea.
- Es feo pero funcional: la apariencia no puede bloquear la operación del Core.

## 12. Fase A implementada

La Fase A añade páginas operativas para `/evidence`, `/evaluations` y `/comparisons`. Las páginas consumen el cliente REST tipado y la superficie canónica `/v1` del Core; no usan datos simulados en producción.

Evidence y Source se muestran en tablas separadas, con formularios de creación y detalle seleccionado. Evaluations permite crear, listar y filtrar por alternative u objective. Comparisons permite crear una comparación con al menos dos alternativas y listar sus resultados.

El componente `KnowledgeState` hace visibles `UNKNOWN`, `CONFLICTING`, `INSUFFICIENT` y `OBSERVED` con texto y color semántico. Los errores HTTP se muestran explícitamente: 400 como datos inválidos, 404 como no encontrado, 409 como conflicto y 422 como datos incompletos.

Los nuevos accesos de navegación son Evidence, Evaluations y Comparisons. La fase no altera entidades del Core, no añade endpoints y no modifica el backend tRPC existente.

## 13. Referencias

- RFC-001 a RFC-014.
- ARKI 2.0 — Master Architecture.
- User Manual de ARKI y SICL.
- Glosario de ARKI y SICL.
- CO-003 — Frontend v2 funcional, no definitivo.

**FIN DEL RFC-015 — FUNCTIONAL DEFINITION ONLY**


## 13. Estilos de tema de Fase A

`PhaseAPageLayout` es el shell visual compartido por Evidence, Evaluations y Comparisons. Sus superficies usan los tokens semánticos del sistema (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary` y `text-primary-foreground`) en lugar de estilos nativos del navegador o colores fijos incompatibles con el modo oscuro.

Los formularios nuevos deben:

1. Mantener el contenedor `form` como tarjeta (`bg-card`, `border-border`, padding y sombra discreta).
2. Aplicar a cada `label` texto visible y peso medio.
3. Usar en `input`, `select` y `textarea` `bg-background`, `border-input`, `text-foreground`, `placeholder:text-muted-foreground` y un anillo de foco `ring-ring`.
4. Usar botones de acción con `bg-primary` y `text-primary-foreground`, sin depender de los estilos HTML por defecto.
5. Mantener tablas con `border-border`, encabezados `text-muted-foreground` y celdas legibles.

La paleta clara conserva el fondo `#f4f1ea`, tarjetas `#fbfaf6`, texto `#1d2925`, primario `#385348` y acento `#d07b4a` definidos por Home. El modo oscuro resuelve los mismos tokens mediante las variables de `.dark`: fondo `#17221e`, tarjetas `#21302a`, texto `#edf2ec`, bordes `#425249` y acento `#e0a078`. Esta estrategia mantiene contraste y coherencia sin duplicar lógica de negocio ni crear un tema paralelo.

Las pruebas de `phase-a-theme.test.tsx` renderizan las tres páginas en ambos temas y verifican que el layout aplica las clases semánticas y que los campos permanecen presentes y accesibles.
