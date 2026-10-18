# SICL_MASTER_SPEC_v1
## Especificación maestra constitucional para revisión integral

**Estado:** Constitución de SICL 0.6 consolidada tras la resolución B-001 del Product Owner. Esta clasificación cierra las decisiones constitucionales de esta fase, pero no certifica el E2E remoto ni autoriza ampliar el Core Contract sin RFC y decisión explícita.

**Clasificación B-001:** APROBADO CON CAMBIOS. La constitución queda consolidada para SICL 0.6; la superficie HTTP, la implementación local y la evidencia E2E conservan estados independientes.

**Fecha:** 24 de agosto de 2026  
**Autor de consolidación:** Manus AI  
**Sistema:** Spatial Intelligence Command Language (SICL)

> **Regla de lectura:** este documento separa deliberadamente la constitución semántica de SICL, la implementación actual, las capacidades preparadas y las capacidades futuras. Un elemento descrito aquí no debe interpretarse como implementado solo por aparecer en la especificación.

---

## 1. Propósito del documento maestro

SICL necesita una única referencia para evitar que la visión, los prototipos, las decisiones de arquitectura y el código evolucionen como listas independientes de ideas. Esta especificación reúne el núcleo semántico, las fronteras de autoridad, el estado del MVP 0.6, la hoja de ruta de integración y las extensiones que deben esperar una decisión contractual.

La especificación tiene cinco funciones. Primero, define qué significa que una entidad o resultado pertenezca a SICL. Segundo, determina qué puede hacer el software y qué no puede inferir. Tercero, establece cómo se prueba la trazabilidad. Cuarto, registra las decisiones aún abiertas. Quinto, protege la visión futura —incluida la estética— de implementaciones prematuras que convertirían conceptos ambiguos en automatismos.

### 1.1 Estados normativos

| Estado | Significado |
|---|---|
| **Aprobado** | Decisión explícita que puede guiar implementación y pruebas. |
| **Implementado y probado** | Existe código y evidencia local suficiente para el alcance indicado. |
| **Preparado** | Existe contrato, documentación o contenedor, pero falta verificación en el entorno objetivo. |
| **Read-only** | Puede observarse o consultarse, pero no modifica el estado canónico. |
| **Propuesto** | Diseño razonable pendiente de aprobación o de contrato adicional. |
| **Bloqueado** | No puede cerrarse sin infraestructura, datos o decisión externa. |
| **Fuera de alcance** | No pertenece al MVP ni debe inferirse de él. |
| **Bloqueado por contrato** | Pertenece a la arquitectura o al mapa funcional de SICL, pero no puede operarse ni certificarse a través de la superficie HTTP v0.3 vigente. No equivale a fuera de SICL. |

---

## 2. Visión de SICL

SICL es una arquitectura de inteligencia espacial y decisional para trabajar con proyectos, objetos, edificios, sitios, ciudades, territorios y escenarios nacionales sin cambiar el núcleo semántico. Su función no es reemplazar al arquitecto ni producir una verdad automática. Su función es convertir información dispersa en un proceso explícito, trazable y revisable.

El flujo conceptual común es:

```text
Contexto → Fuentes → Evidencia → Objetivo → Restricciones y requisitos
        → Preferencias → Alternativas → Evaluaciones
        → Comparación         → Recommendation → Human Review → Decision
        → Auditoría → conocimiento institucional versionado
```

La escala cambia el contexto, no la autoridad. En SICL 1 se trabaja principalmente con objeto, edificio y sitio. En SICL 2 se trabaja con sector, distrito, ciudad, área metropolitana y región. En SICL 3 se trabaja con macroregión, país y escenarios temporales. En todos los casos, una recomendación sigue siendo una salida analítica y una decisión sigue siendo un acto humano autorizado.

### 2.1 Principios constitucionales

| Principio | Regla operativa |
|---|---|
| **Autoridad humana** | La IA y el sistema pueden analizar y recomendar; no pueden decidir por la autoridad responsable. |
| **Trazabilidad** | Todo resultado relevante debe poder remontarse a sus entradas, referencias, método, versión y estado. |
| **No inferencia peligrosa** | El sistema no inventa dirección de objetivos, coordenadas, validez legal, seguridad, pesos o datos faltantes. |
| **Estados explícitos** | La insuficiencia, incertidumbre o falta de factibilidad se registra como estado, no se oculta con un valor conveniente. |
| **Versionado** | Los cambios de proyecto, entidades, recomendaciones y eventos conservan su historia observable. |
| **Frontera canónica** | Cuando existe un Core remoto configurado, el adaptador web delega y falla cerrado si no puede hacerlo. |
| **Reversibilidad técnica** | Las decisiones de interfaz, estilo y transporte pueden cambiar sin alterar la semántica aprobada. |

---

## 3. Core Contract

El Core Contract es la frontera mínima que debe mantenerse estable aunque cambien la interfaz, el motor analítico, la base de datos o el proveedor de infraestructura. Define entidades, relaciones, estados, referencias, versionado, eventos y reglas de autoridad.

### 3.1 Entidades nucleares

| Entidad | Función sencilla | Estado en SICL 0.6 |
|---|---|---|
| **Project** | Contenedor de un caso de trabajo y su contexto espacial/temporal. | Implementado y probado localmente. |
| **Source** | Origen identificable de información. | Implementado y probado localmente. |
| **Evidence** | Afirmación o dato vinculado a una fuente y a un proyecto. | Implementado y probado localmente. |
| **Fact** | Información tratada como dato del caso, con procedencia explícita. | Distinción constitucional aprobada; no se crean entidades independientes en 0.6. |
| **Assumption** | Supuesto utilizado para poder analizar, sin presentarlo como hecho. | Distinción constitucional aprobada; no se crean entidades independientes en 0.6. |
| **Objective** | Lo que el proyecto intenta optimizar o alcanzar. | Implementado; la dirección es obligatoria para comparar. |
| **Constraint** | Condición que limita las alternativas. | Implementado y validado localmente. |
| **Requirement** | Necesidad que debe satisfacerse o revisarse. | Implementado y validado localmente. |
| **Preference** | Prioridad contextual declarada por una persona o equipo. | Implementado y probado localmente en Core Python, SQLite, revisión, export y HTTP v0.3; E2E remoto pendiente. |
| **Alternative** | Opción concreta que puede evaluarse. | Implementado y validado localmente. |
| **Evaluation** | Resultado de medir una alternativa respecto de un criterio. | Implementado con método, entradas, unidad y procedencia explícitos. |
| **Comparison** | Relación analítica entre evaluaciones y un objetivo con dirección explícita. | Implementado; no produce ganador sin datos y dirección suficientes. |
| **Recommendation** | Salida analítica que ayuda a deliberar. | Implementada y separada de Decision. |
| **HumanReview** | Revisión identificable de una recomendación o salida analítica. | Implementada con actor, versión y razón. |
| **Decision** | Acto durable de una autoridad humana. | Preparación y registro implementados localmente. |
| **Event** | Registro append-only a nivel de aplicación para reconstruir cambios y trazabilidad. | Implementado en el flujo local del Core; persistencia remota aún pendiente. |
| **Council** | Vista consolidada read-only de comparaciones, trade-offs, recomendaciones y auditoría. | Implementado como consulta read-only. |
| **Audit** | Proyección derivada de Events, HumanReviews y Decisions. | Aprobado como proyección; no es entidad canónica independiente en 0.6. |
| **Report** | Artefacto/exportación derivado y versionado. | Aprobado como artefacto; no es entidad persistente ni endpoint dedicado en 0.6. |

### 3.2 Invariantes obligatorias

Una comparación no puede asumir `MINIMIZE` cuando falta la dirección del objetivo. En ese caso debe devolver un estado explícito de insuficiencia y no crear una comparación válida. Una evaluación debe conservar, cuando estén disponibles, alternativa, criterio, valor, unidad, método, inputs, procedencia, versión del contrato y estado de factibilidad. Una referencia a una entidad inexistente debe rechazarse.

Una Recommendation debe declarar qué tipo de análisis la fundamenta y referenciar una Comparison válida. Una Recommendation no crea una Decision. Una Decision exige actor, autoridad, alternativa o resultado seleccionado, razón y referencia al estado observado. Una nueva escritura no puede borrar ni modificar eventos anteriores. El replay idempotente exige coincidencia del tipo de evento, entidad, proyecto y payload completo.

### 3.3 Contrato HTTP y frontera web

El adaptador `sicl-core-http` expone el Core Python mediante HTTP v0.3 y normaliza el contrato externo en `snake_case`. El cliente tRPC actúa como adaptador anti-corrupción: preserva códigos y cuerpos de error, incluyendo 401, 404, 409 y 422, y no expone secretos al navegador.

Cuando `SICL_CORE_URL` está configurado, las escrituras canónicas deben dirigirse al Core remoto. El fallback local solo puede activarse de forma explícita mediante `SICL_ALLOW_LOCAL_CORE=true` fuera de producción. En producción, la ausencia del Core remoto debe producir fallo cerrado, no una escritura silenciosa en un modelo paralelo. La frase “integrado en el Core” significa aquí implementado y verificado localmente; no significa que la integración remota, la persistencia externa o el E2E poblado estén cerrados.

Decision Conditions se mantienen en modo read-only en la interfaz durante SICL 0.6. Su autoridad es exclusivamente explicativa y analítica: no pueden crear Decisions, seleccionar alternativas, promover Assumptions a Facts ni certificar validez profesional. La forma canónica y cualquier endpoint de escritura quedan postergados a un RFC específico. Su presencia visual no autoriza a crear una segunda semántica local ni a tratar una condición como decisión.

### 3.4 Decisiones constitucionales B-001 consolidadas

| Decisión | Resolución | Consecuencia para SICL 0.6 |
|---|---|---|
| **B-001.1 Fact / Assumption** | **APROBADO**: son categorías epistemológicamente diferentes; `UNKNOWN` y `CONFLICTING` son estados de conocimiento; no existe promoción automática. | Una eventual transición requiere nueva evidencia verificable y evento auditable. La forma técnica detallada no se implementa en esta fase. |
| **B-001.2 Audit / Report** | **APROBADO**: Audit es proyección derivada; Report es artefacto/exportación derivado y versionado. | No se crean entidades canónicas independientes ni endpoints HTTP dedicados en 0.6. Una conversión futura exige RFC. |
| **B-001.3 Decision Conditions** | **APROBADO**: read-only y autoridad explicativa/analítica. | No pueden crear Decisions ni seleccionar alternativas. La forma canónica se posterga a RFC específico. |
| **B-001.4 Alcance constitucional** | **APROBADO CON CAMBIOS**: 0.6 es el núcleo constitucional y operativo inicial, con distinción entre Core, HTTP, Web y E2E. | La integración remota está preparada, no certificada. Las capacidades no expuestas por HTTP v0.3 permanecen bloqueadas por contrato, no fuera de SICL. |

---

## 4. Arquitectura funcional por escala

### 4.1 SICL 1 — Proyecto, objeto, edificio y sitio

SICL 1 es la primera superficie de uso arquitectónico. Permite crear un proyecto, describir el sitio, registrar fuentes y evidencia, declarar objetivos, restricciones, requisitos y preferencias, registrar alternativas, capturar evaluaciones, construir comparaciones, presentar recomendaciones, registrar revisión humana, preparar una decisión y consultar la auditoría.

El resultado no es “el edificio correcto”. Es un expediente trazable en el que el arquitecto puede ver qué se sabe, qué se supone, qué falta, qué método se usó, qué alternativa fue recomendada y quién debe decidir.

**Estado:** el flujo local y el Command Center están implementados y probados para el alcance del MVP. El flujo remoto poblado y la persistencia tras reinicio continúan bloqueados por la falta de Cloud Computer.

### 4.2 SICL 2 — Ciudad y territorio

SICL 2 aplica el mismo núcleo a relaciones espaciales de mayor escala: sector, distrito, ciudad, área metropolitana y región. Puede organizar alternativas de intervención territorial, comparar criterios urbanos, registrar fuentes y escenarios y producir recomendaciones trazables.

**Estado:** el contrato mínimo de `spatial_scope` está definido y existe compatibilidad de normalización con snapshots existentes. La operación urbana completa, los datos geoespaciales, GIS y los métodos de agregación territorial todavía requieren contratos y validación adicionales.

### 4.3 SICL 3 — Desarrollo nacional y escenarios

SICL 3 permite estructurar macroregiones, país y escenarios como 2030, 2040 y 2050. Un horizonte temporal es un marco explícito para analizar, no una predicción automática. El mismo núcleo debe conservar fuentes, supuestos, evaluaciones, recomendaciones y decisiones.

**Estado:** el contrato mínimo de `temporal_scope` está preparado. La operación nacional, la modelación de escenarios, la incertidumbre, la agregación colectiva y la validación política o institucional están pendientes de contratos específicos.

### 4.4 Investigación de Operaciones

Investigación de Operaciones es una capa analítica extensible, no una autoridad. Cada método debe declarar entradas, unidades, restricciones, supuestos, procedencia, estado de factibilidad, salida, sensibilidad y versión. El catálogo y el endpoint read-only fueron verificados en el alcance local disponible.

No se debe interpretar la presencia de un método como garantía de validez profesional. La factibilidad computacional, la calidad de los datos y la validez del modelo deben permanecer visibles y sujetas a revisión.

---

## 5. Cierre de expansión conceptual

Esta versión revisada congela la expansión conceptual del MVP. No se incorporan ahora nuevas entidades, AestheticProfile, Digital Twin, IoT, BIM, agentes autónomos, optimización geométrica, Monte Carlo, planificación nacional ni un nuevo motor de IA. Esas capacidades pueden permanecer como investigación o propuestas, pero no modifican el Core Contract ni el alcance de SICL 0.6 sin un RFC aprobado y una decisión explícita del Product Owner.

SICL 0.6 debe concentrarse en demostrar que el núcleo ya definido funciona con trazabilidad, estados explícitos, autoridad humana y persistencia verificable.

## 6. RFC consolidados

Los siguientes RFC son contratos de trabajo dentro de esta versión maestra. Los RFC etiquetados como propuestos no deben implementarse sin una decisión explícita.

| RFC | Tema | Decisión o propuesta | Estado |
|---|---|---|---|
| RFC-001 | Alcance de SICL 0.6 | Entregar un vertical slice trazable desde Evidence hasta Decision humana. | Implementado y probado localmente. |
| RFC-002 | Evidencia y procedencia | Separar fuente, evidencia, hecho y supuesto; no ocultar procedencia. | Implementado en el contrato y UI local. |
| RFC-003 | Evaluación y comparación | Exigir criterio, método, unidad, inputs, dirección y factibilidad explícitos. | Implementado y probado. |
| RFC-004 | Recommendation–Decision | Recommendation describe; HumanReview revisa; Decision requiere autoridad humana. | Implementado y probado localmente. |
| RFC-005 | Preference | Preference es prioridad contextual, no norma, ley, peso universal ni restricción automática. | Integrado en Core Python y web. |
| RFC-006 | Decision Conditions | Condiciones declarativas explicativas y read-only, sin autoridad decisoria. | Aprobado para 0.6 como consulta; forma canónica y escritura postergadas a RFC posterior. |
| RFC-007 | Core remoto | tRPC delega al Core Python con bearer server-to-server y falla cerrado sin URL/configuración válida. | Preparado y probado localmente; E2E remoto pendiente. |
| RFC-008 | Simulador Fase A | Harness externo, determinista, con fixtures sintéticos y SQLite temporal. | Implementado y probado; Core commit `25e53d0`. |
| RFC-009 | Persistencia y eventos | Snapshot más eventos append-only a nivel de aplicación; no se denomina Event Sourcing. | Implementado localmente; verificación externa pendiente. |
| RFC-013 | Audit / Report | Audit como proyección derivada; Report como artefacto/exportación derivado y versionado. | Aprobado constitucionalmente; sin entidades ni endpoints dedicados en 0.6. |
| RFC-014 | Fact / Assumption | Diferencia epistemológica, estados de conocimiento explícitos y no promoción automática. | Aprobado constitucionalmente; forma técnica detallada postergada. |
| RFC-010 | Escala espacial/temporal | `spatial_scope` y `temporal_scope` amplían contexto sin cambiar autoridad ni núcleo semántico. | Contrato mínimo implementado; capacidades superiores pendientes. |
| RFC-011 | Estética arquitectónica | Tratar estética como dominio futuro de Preference, Criterion, Evaluation, Evidence, incertidumbre y revisión humana; no crear score universal de belleza. | Propuesto, no implementado. |
| RFC-012 | Simulación avanzada | Monte Carlo, sensibilidad, optimización y escenarios complejos solo después de cerrar contratos de incertidumbre y gobernanza. | Postergado. |

---

## 7. Pruebas de aceptación

El Product Acceptance Contract de SICL 0.6 define los criterios para declarar funcional el MVP. La evidencia local cubre la semántica y el comportamiento del software en entorno temporal; la aceptación completa exige además ejecución remota y verificación poblada.

| Grupo | Criterio de aceptación | Evidencia actual |
|---|---|---|
| Semántica | Objetivos sin dirección no producen ganador ni comparación válida. | Regresiones Python y web. |
| Métodos | Métodos desconocidos devuelven `UNKNOWN_METHOD`. | Catálogo cerrado y pruebas. |
| Evaluación | Método, inputs, criterio, dirección, unidad y versión quedan registrados cuando corresponda. | Core Contract y pruebas de round-trip. |
| Factibilidad | Rendimiento y factibilidad son dimensiones separadas; la ausencia se expresa como `UNKNOWN`. | Modelo, SQLite y regresiones. |
| Referencias | Referencias inexistentes o cruzadas se rechazan. | Pruebas de dominio, router y HTTP. |
| Recommendation | Una recomendación sin comparación válida no se presenta como resultado automático. | Regresión integrada Evaluation→Comparison→Recommendation. |
| Decision | No existe Decision automática; se exige revisión y autoridad humana. | Pruebas y UI. |
| Inmutabilidad | Un guardado posterior no modifica eventos previos. | Hardening de replay y pruebas locales. |
| Seguridad | Secretos no llegan al navegador ni a los logs seguros. | Cliente server-side, safe audit y pruebas. |
| Reproducibilidad | El repositorio, simulador y verificador se ejecutan desde commits identificables. | Release Candidate y manifiesto. |
| Persistencia | El estado sobrevive al reinicio del servicio remoto. | Pendiente de Cloud Computer. |
| Integración | Errores 401/404/409/422 se preservan extremo a extremo. | Smoke test local; remoto pendiente. |
| Navegador | El flujo poblado se verifica en escritorio y móvil contra el Core canónico. | Pendiente de infraestructura y datos. |

**Regla de aceptación:** un `PASS` local no declara producción, disponibilidad remota, validez legal, seguridad profesional ni corrección arquitectónica de una alternativa. La aceptación del MVP solo procede cuando también se cumplan los criterios de despliegue, persistencia y E2E.

---

## 8. Roadmap ejecutivo

| Fase | Objetivo | Dependencia | Criterio de salida |
|---|---|---|---|
| 0 | Adjuntar e inspeccionar Cloud Computer. | Cuenta y máquina disponibles. | Máquina accesible, recursos y sistema identificados. |
| 1 | Instalar código y dependencias del Core. | Fase 0. | Servicio construible y configuración validada. |
| 2 | Configurar `/data/sicl/` y SQLite persistente. | Almacenamiento real. | Ruta externa montada y permisos verificados. |
| 3 | Ejecutar `sicl-core-http` con systemd/Docker. | Fases 1–2. | Health check y reinicio automático verificados. |
| 4 | Configurar firewall con exposición mínima. | Servicio estable. | SSH y HTTPS permitidos; puertos innecesarios cerrados. |
| 5 | Obtener dominio y HTTPS. | Dominio controlado y DNS. | Certificado válido y endpoint accesible por HTTPS. |
| 6 | Registrar `SICL_CORE_URL` y token server-side. | Endpoint HTTPS real. | tRPC delega; navegador nunca recibe el token. |
| 7 | Ejecutar E2E con UPAO-001 sintético. | Integración real. | Flujo completo y errores contractuales documentados. |
| 8 | Verificar reinicio, navegador y aceptación. | Fase 7. | Persistencia, escritorio, móvil y criterios de aceptación cerrados. |

El tiempo de ejecución no se fija por adelantado. Dependerá de la máquina, dominio, DNS, credenciales y estado del servicio. No debe usarse una estimación de minutos como criterio de aceptación.

---

## 9. Decisiones pendientes del Product Owner

Estas decisiones no deben inferirse del código actual:

| Decisión | Opciones | Recomendación técnica provisional |
|---|---|---|
| Múltiples Objectives | No soportar en 0.6 / soportar después con contrato. | Mantener Objective único en el MVP. |
| Dominancia entre alternativas | No / Pareto u otra relación explícita. | Postergar hasta definir semántica y visualización. |
| Agregación colectiva | No / reglas de grupo y autoridad. | Postergar; exige gobernanza y trazabilidad de participantes. |
| Pesos | No / pesos por Preference / pesos por método. | No introducir pesos universales implícitos. |
| AestheticProfile | No en 0.6 / contrato futuro. | Mantenerlo únicamente como RFC futuro; no entra al Core Contract 0.6. |
| GIS/BIM | No en 0.6 / integración posterior. | Mantenerlo fuera del alcance operativo de 0.6; no inferir geometría, legalidad ni capacidades GIS operativas. |
| Simulación avanzada | No / Monte Carlo / sensibilidad. | Postergar hasta cerrar incertidumbre, semillas y criterios de interpretación. |
| Versionado de ciclos de Recommendation | Usar entidad/versiones actuales / nuevo contrato monotónico. | Decidir antes de declarar versionado de ciclos como completo. |
| Eventos | Append-only de aplicación / garantías más fuertes. | Mantener el modelo actual y verificarlo en persistencia remota. |

---

## 10. Capacidad futura de estética

La estética es una dimensión legítima del trabajo arquitectónico, pero no debe reducirse prematuramente a una puntuación universal de belleza. El futuro dominio estético debe permitir registrar preferencias perceptuales, criterios, referencias visuales o materiales, evaluaciones compuestas, incertidumbre y revisión humana.

Una futura `AestheticProfile` podría especializar `Preference`, pero no debe convertirse automáticamente en una ley, un peso, una clasificación objetiva o una certificación. Una evaluación estética tendría que declarar quién evalúa, qué se observa, con qué referencia, bajo qué contexto y con qué limitaciones. La interfaz debería mostrar desacuerdos y perspectivas, no ocultarlos dentro de un número aparentemente científico.

### 10.1 Lo que sí podría incorporarse en el futuro

| Capacidad | Condición previa |
|---|---|
| Perfil estético contextual | Contrato de Preference especializado y alcance explícito. |
| Criterios de materialidad, luz o integración | Definiciones observables y procedencia de referencias. |
| Evaluación perceptual multi-actor | Roles, desacuerdos, consentimiento y auditoría. |
| Comparación estética | Método declarado, unidad o escala explicada y ausencia de falsa objetividad. |
| Apoyo de IA multimodal | Evidencia visual identificable, incertidumbre y revisión humana obligatoria. |

### 10.2 Lo que no debe hacerse

No debe construirse un `beauty_score` universal, una clasificación automática de arquitectos o proyectos, una inferencia estética presentada como hecho, ni una recomendación que convierta una preferencia cultural o personal en obligación normativa sin autorización.

---

## 11. Estado de implementación consolidado

| Área | Estado actual | Qué falta para declararla completa |
|---|---|---|
| Core Python | Implementado y probado localmente. | Ninguna corrección local crítica conocida; falta entorno remoto. |
| Preference | Integrado en modelo, SQLite, review, export y HTTP v0.3. | E2E remoto y persistencia externa. |
| Evaluations/Comparisons | Captura trazable y dirección obligatoria. | Verificación poblada contra Core remoto. |
| Recommendation/Review/Decision | Separación humana implementada. | E2E remoto y revisión en navegador con datos. |
| Decision Conditions | Read-only con autoridad explicativa/analítica; escritura postergada a RFC. | No se implementa escritura en 0.6. |
| Council/Audit | Council read-only; Audit como proyección derivada. | Navegador con datos canónicos y servicio remoto; no se crea entidad Audit. |
| Investigación de Operaciones | Catálogo y endpoint read-only cubiertos. | Métodos analíticos adicionales y validación profesional específica. |
| Simulador Fase A | Harness externo, determinista y sintético. | Fixtures adicionales y ejecución contra servicio remoto. |
| Command Center | Funcional localmente y responsive. | Verificación poblada en navegador. |
| Seguridad | Bearer server-to-server y fallo cerrado preparados. | HTTPS y revisión de logs en infraestructura real. |
| Documentación | Guías, auditoría, roadmap y este documento maestro. | Mantener separación constitucional/contractual y continuar con revisión arquitectónica posterior; no implica certificación E2E. |

---

## 12. Fuentes internas auditadas

Las afirmaciones de esta especificación se consolidaron a partir de los siguientes artefactos del repositorio y del proyecto web:

1. [Product Acceptance Contract SICL 0.6](PRODUCT_ACCEPTANCE_CONTRACT_SICL_0_6.md)
2. [Release Candidate SICL 0.6](RELEASE_CANDIDATE_SICL_0_6.md)
3. [Auditoría consolidada SICL 0.6](AUDITORIA_CONSOLIDADA_SICL_0_6.md)
4. [Hoja de ruta ejecutiva SICL 0.6](ROADMAP_EJECUTIVA_SICL_0_6.md)
5. [Guía funcional SICL 1–3 para arquitectos](GUIA_FUNCIONAL_SICL_1_3_PARA_ARQUITECTOS.md)
6. [Paquete de comprensión SICL para arquitectos](PAQUETE_COMPRENSION_SICL_PARA_ARQUITECTOS.md)
7. [Simulador de Proyectos Fase A](SIMULATOR_PHASE_A.md)
8. [Runbook de Cloud Computer](deploy/CLOUD_COMPUTER_RUNBOOK.md)
9. `/home/ubuntu/sicl-web/client/src/pages/Home.tsx`
10. `/home/ubuntu/sicl-web/server/routers.ts`

---

## 13. Estado constitucional posterior a B-001

El Product Owner resolvió B-001 como sigue: Fact/Assumption **APROBADO**; forma técnica detallada Fact/Assumption **APROBADA para postergación**; Audit **APROBADO como proyección derivada**; Report **APROBADO como artefacto/exportación derivado y versionado**; cambio futuro de Audit/Report a entidades **APROBADO únicamente mediante RFC previo**; Decision Conditions **APROBADO como read-only** y con autoridad exclusivamente explicativa/analítica; forma canónica de Decision Conditions **POSTERGADA a RFC**; alcance de SICL 0.6 **APROBADO CON CAMBIOS**; brecha HTTP **APROBADA como BLOQUEADO POR CONTRATO**; capacidades avanzadas **FUERA DE ALCANCE**; y este Master Spec **APROBADO CON CAMBIOS** como constitución consolidada, sujeto a una revisión arquitectónica posterior de su estructura documental.

Esta consolidación no autoriza crear entidades, endpoints, migraciones, eventos nuevos, infraestructura, E2E remoto, estética operativa, agentes, BIM, Digital Twin, IoT, Monte Carlo, optimización avanzada, GIS operativo ni agregación territorial/nacional avanzada. Tampoco convierte un PASS local en certificación remota o profesional.

La siguiente revisión recomendada es auditar la separación interna del Master Spec entre Constitución, Core Contract, superficie HTTP, estado de implementación, estado E2E, roadmap y RFC. Esa revisión será documental y no debe interpretarse como autorización para ampliar el sistema.

### 13.1 Referencia de decisión

La resolución se basa en `docs/SICL_CONSTITUTIONAL_REVIEW_0.6.md` y en la respuesta del Product Owner recibida el 24 de agosto de 2026. La respuesta original debe conservarse como evidencia de decisión, sin sustituir el texto normativo consolidado.
