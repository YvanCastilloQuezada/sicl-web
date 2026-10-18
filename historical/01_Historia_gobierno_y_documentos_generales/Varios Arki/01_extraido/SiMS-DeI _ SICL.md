# SiMS-DeI / SICL

## Guion de presentación y procedimiento de evaluación de RFC-020

**Fecha:** 16 de septiembre de 2026  
**Estado del proyecto:** RFC-019 aprobado, implementado y verificado  
**Audiencia:** Product Owner, arquitectos, revisores técnicos y equipo de implementación

---

## 1. Propósito de la presentación

Esta presentación tiene dos objetivos. El primero es explicar el estado actual de SiMS-DeI y SICL después de la aprobación de PO-012. El segundo es definir cómo debe evaluarse RFC-020 —Feasibility Filtering— sin confundir una propuesta técnica con una autorización de implementación.

La regla de gobierno es explícita: **RFC-019 está aprobado e implementado; RFC-020, RFC-021 y RFC-022 siguen siendo propuestas**. Por tanto, esta fase puede producir análisis, criterios de aceptación, prototipos aislados y una recomendación para el Product Owner, pero no puede modificar el Core, el contrato HTTP, el frontend ni la infraestructura.

> La evaluación de RFC-020 no autoriza su implementación. La decisión de implementación corresponde exclusivamente al Product Owner.

---

# Parte I — Cómo proceder con RFC-020

## 2. Punto de partida

RFC-019 establece el catálogo espacial canónico de once escalas:

```text
PAIS
→ MACRO_REGION
→ REGION
→ PROVINCIA_METROPOLI
→ DISTRITO_CIUDAD
→ ZONA_BARRIO_SECTOR
→ PARCELA_SITIO
→ EDIFICACION
→ SISTEMA
→ ESPACIO
→ OBJETO
```

La implementación de RFC-019 fue verificada con la suite completa del Core, pruebas HTTP, migración de bases de demostración, actualización contractual y validaciones de compilación. Las bases de demostración fueron migradas de forma trazable y los eventos históricos no fueron eliminados ni reescritos.

Este resultado permite evaluar RFC-020 sobre una base espacial estable. Sin embargo, RFC-020 no debe asumir que una escala espacial determina automáticamente la factibilidad de una alternativa. La escala aporta contexto; no sustituye los datos, restricciones, autoridad ni evidencia necesarios para evaluar factibilidad.

## 3. Alcance propuesto de RFC-020

RFC-020 propone añadir una capa explícita de factibilidad al motor multiobjetivo. Su alcance preliminar contiene cuatro elementos:

1. **FeasibilityState**, para representar el estado de una alternativa respecto de las restricciones conocidas.
2. **FeasibilityResult**, para conservar el resultado, las restricciones evaluadas, la evidencia y la procedencia.
3. **pareto_front con factibilidad**, para distinguir el frente geométrico u objetivo del conjunto de alternativas que cumplen las restricciones.
4. **feasible_pareto_front**, para producir un frente Pareto filtrado por factibilidad.

También se contempla una futura superficie CLI y HTTP. Esa superficie no debe implementarse hasta que el contrato de RFC-020 haya sido aprobado.

## 4. Preguntas que la evaluación debe resolver

La evaluación de RFC-020 debe responder, como mínimo, a las siguientes preguntas:

### 4.1 Semántica

- ¿Qué significa exactamente `FEASIBLE`?
- ¿Qué diferencia existe entre `INFEASIBLE`, `UNKNOWN` e `INSUFFICIENT_DATA`?
- ¿Una alternativa con una restricción no evaluable puede aparecer en el frente factible?
- ¿La factibilidad se determina por alternativa, por evaluación, por proyecto o por escenario?
- ¿Puede una alternativa ser factible en una escala y desconocida en otra?

### 4.2 Epistemología

- ¿Qué evidencia respalda cada resultado?
- ¿Cómo se distingue un hecho observado de una suposición o una preferencia?
- ¿Qué ocurre cuando dos fuentes producen resultados contradictorios?
- ¿La ausencia de evidencia produce `UNKNOWN` o `INSUFFICIENT_DATA`?
- ¿El motor puede inferir factibilidad normativa? La respuesta constitucional debe ser no.

### 4.3 Autoridad

- ¿Quién puede declarar una restricción satisfecha?
- ¿El motor produce una evaluación o una decisión?
- ¿El estado de factibilidad puede cambiar una Recommendation?
- ¿Puede bloquear una Decision sin HumanReview explícito?

La respuesta propuesta es que el motor puede **informar y filtrar técnicamente**, pero nunca aprobar una alternativa ni crear una decisión humana.

### 4.4 Compatibilidad

- ¿El resultado actual de `pareto_front` cambia para clientes existentes?
- ¿El filtro será opt-in o predeterminado?
- ¿Cómo se conserva la diferencia entre frente bruto y frente factible?
- ¿Cómo se versiona la respuesta HTTP?
- ¿Qué ocurre si un cliente antiguo no conoce `FeasibilityState`?

## 5. Modelo conceptual propuesto para discusión

El siguiente modelo debe tratarse como propuesta de evaluación, no como contrato aprobado:

```text
FeasibilityState
├── FEASIBLE
├── INFEASIBLE
├── UNKNOWN
└── INSUFFICIENT_DATA
```

Una posible estructura de resultado sería:

```json
{
  "alternative_id": "ALT-001",
  "state": "FEASIBLE",
  "checked_constraints": ["COST-001", "AREA-001"],
  "failed_constraints": [],
  "unknown_constraints": [],
  "evidence_ids": ["EVID-001"],
  "assumption_ids": [],
  "evaluated_at": "2026-09-16T00:00:00Z",
  "evaluated_by": "ACTOR-001",
  "authority": "technical-evaluation",
  "method": "constraint_filter_v1"
}
```

Este ejemplo no debe incorporarse al Core hasta que se aprueben el nombre de la entidad, sus campos, sus estados, la autoridad requerida y su compatibilidad contractual.

## 6. Regla de filtrado propuesta

La evaluación debe comparar dos conjuntos distintos:

```text
pareto_front
    = alternativas no dominadas según los objetivos

feasible_pareto_front
    = alternativas no dominadas que además cumplen el criterio de factibilidad
```

La separación es esencial. Una alternativa puede ser Pareto-eficiente y, al mismo tiempo, ser inviable por una restricción dura. El sistema debe mostrar ambas condiciones sin ocultar información.

La política propuesta para discusión es:

- `FEASIBLE`: puede entrar en `feasible_pareto_front`.
- `INFEASIBLE`: queda excluida del frente factible, pero permanece visible en el resultado bruto y en la auditoría.
- `UNKNOWN`: no entra automáticamente en el frente factible.
- `INSUFFICIENT_DATA`: no entra automáticamente en el frente factible.

Esta política evita convertir la falta de información en una aprobación implícita.

## 7. Proceso de evaluación antes de pedir aprobación

### Etapa A — Congelar el problema

Redactar una versión evaluable de RFC-020 con:

- objetivo;
- no objetivos;
- entidades afectadas;
- estados propuestos;
- invariantes constitucionales;
- relación con `Alternative`, `Evaluation`, `Constraint`, `Comparison` y `Recommendation`;
- relación con las once escalas de RFC-019;
- impacto en el Core Contract;
- impacto en CLI y HTTP;
- compatibilidad hacia atrás;
- estrategia de migración, si es necesaria.

### Etapa B — Prueba aislada

Construir un prototipo fuera de `main` y fuera del contrato productivo. El prototipo debe usar datos sintéticos y debe demostrar:

- una alternativa factible;
- una alternativa no factible;
- una alternativa con datos insuficientes;
- una alternativa con estado desconocido;
- dos restricciones contradictorias;
- una frontera Pareto bruta;
- una frontera Pareto factible;
- trazabilidad hasta las restricciones y evidencias.

El prototipo no debe crear entidades persistentes en el Core ni modificar endpoints existentes.

### Etapa C — Casos límite

Evaluar, como mínimo:

1. No existen restricciones.
2. Todas las restricciones son blandas.
3. Existe una restricción dura incumplida.
4. Falta el valor de una restricción.
5. Hay evidencia conflictiva.
6. La alternativa pertenece a `edificacion`.
7. La alternativa pertenece a `sistema`.
8. Dos alternativas tienen los mismos objetivos, pero distinta factibilidad.
9. Una alternativa es dominada en objetivos, pero es la única factible.
10. Todas las alternativas resultan no factibles.

### Etapa D — Revisión constitucional

Antes de presentar una solicitud de aprobación, confirmar que RFC-020:

- no transforma una Recommendation en Decision;
- no elimina alternativas ni eventos históricos;
- no infiere normativa;
- no convierte `UNKNOWN` en `FEASIBLE`;
- conserva actor, autoridad, fuente y timestamp;
- no introduce aprobación automática;
- no modifica la separación Fact / Assumption / Preference;
- no depende de RFC-021 ni RFC-022 para funcionar correctamente.

### Etapa E — Decisión del Product Owner

El paquete para PO-013 debe incluir:

- RFC-020 revisado;
- resultados del prototipo;
- casos límite;
- propuesta de contrato;
- análisis de compatibilidad;
- riesgos;
- plan de implementación;
- criterios de aceptación;
- decisión solicitada: aprobar, devolver para revisión o rechazar.

Hasta esa decisión, el estado permanece `PROPOSED`.

## 8. Criterios de aceptación sugeridos para PO-013

RFC-020 solo debería considerarse listo para aprobación si cumple estos criterios:

1. Los cuatro estados tienen definiciones no ambiguas.
2. La ausencia de datos no produce factibilidad positiva.
3. `pareto_front` y `feasible_pareto_front` son resultados distinguibles.
4. Las alternativas no factibles siguen siendo auditables.
5. Cada estado puede remontarse a restricciones, evidencias, supuestos, actor y autoridad.
6. El filtro no genera recomendaciones humanas ni decisiones.
7. La escala espacial se conserva como contexto y no como inferencia.
8. Se define el comportamiento ante conflictos y datos insuficientes.
9. Existe una estrategia de compatibilidad para clientes actuales.
10. Se han probado los casos límite con datos sintéticos.

---

# Parte II — Guion de presentación del estado del proyecto

## Diapositiva 1 — Título

**SiMS-DeI / SICL: estado del baseline y próximos gates de Product Owner**

**Mensaje del presentador:**

> Esta sesión presenta el estado real del sistema después de RFC-019 y separa con claridad lo implementado, lo propuesto y lo bloqueado. El objetivo no es anunciar nuevas implementaciones, sino establecer la siguiente decisión de gobierno.

## Diapositiva 2 — Qué es SiMS-DeI

SiMS-DeI es el sistema superior de inteligencia de diseño espacial multiescala. SICL es su lenguaje formal para registrar entidades, relaciones, evaluaciones, recomendaciones y acciones auditables.

La autoridad humana permanece fuera del motor automático. El sistema puede organizar evidencia, ejecutar evaluaciones y presentar alternativas, pero no convierte una recomendación en una decisión.

**Mensaje clave:**

> SiMS-DeI ayuda a estructurar decisiones de diseño; no reemplaza al arquitecto, al responsable institucional ni a la autoridad competente.

## Diapositiva 3 — Principios que no cambian

Los siguientes invariantes siguen vigentes:

- `Recommendation ≠ Decision`.
- `HumanReview ≠ Decision`.
- Una `Decision` requiere `HumanReview`, actor y autoridad.
- `Fact ≠ Assumption ≠ Preference`.
- Los eventos son append-only.
- La normativa no se infiere automáticamente.
- La factibilidad técnica no equivale a autorización humana.
- La escala debe declararse explícitamente.

**Mensaje del presentador:**

> RFC-019 amplía la precisión espacial, pero no cambia la constitución del sistema.

## Diapositiva 4 — PO-012: RFC-019 aprobado

**Estado:** aprobado, implementado y verificado.

RFC-019 actualiza `SpatialScope` de nueve a once escalas. Añade `macro_region` y `sistema`, y renombra tres valores heredados:

```text
edificio          → edificacion
ciudad_distrito   → distrito_ciudad
barrio_sector     → zona_barrio_sector
```

La migración fue trazable, reversible cuando era posible y compatible con el Event Log.

**Resultado de verificación:**

```text
Suite del Core: 214/214 PASS
Pruebas HTTP RFC-019: PASS
Migración de ejemplos: PASS
Compilación: PASS
git diff --check: PASS
```

## Diapositiva 5 — La jerarquía espacial aprobada

```text
PAIS
  ↓
MACRO_REGION
  ↓
REGION
  ↓
PROVINCIA_METROPOLI
  ↓
DISTRITO_CIUDAD
  ↓
ZONA_BARRIO_SECTOR
  ↓
PARCELA_SITIO
  ↓
EDIFICACION
  ↓
SISTEMA
  ↓
ESPACIO
  ↓
OBJETO
```

**Aclaración:** la jerarquía describe el catálogo espacial. No crea objetivos, restricciones, recomendaciones ni decisiones por sí sola.

## Diapositiva 6 — Qué se migró

Se migraron tres bases de demostración:

```text
sicl-examples.sqlite
sicl-examples-v2.sqlite
sims-dei-10.sqlite
```

En cada base se migraron tres proyectos:

```text
BUILD-001
BARRIO-001
CIUDAD-001
```

Se generaron backups y nueve eventos `SCOPE_MIGRATED` en total. Los eventos históricos originales no fueron editados ni eliminados.

## Diapositiva 7 — Estado general de RFC-001 a RFC-019

| RFC | Tema | Estado actual |
|---|---|---|
| RFC-001 | Modelo multiescala | Implementado; refinado por RFC-019 |
| RFC-002 | Contrato HTTP y Evidence | Implementado |
| RFC-003 | Corpus regulatorio | Implementado según baseline vigente |
| RFC-004 | Capacidad relacionada | Implementado según baseline vigente |
| RFC-005 | Evaluation / Comparison HTTP | Implementado |
| RFC-006 | Simulación | Implementado; incluye Monte Carlo |
| RFC-007 | Capacidad del Core | Implementado según baseline vigente |
| RFC-008 | Capacidad del sistema | Implementado según baseline vigente |
| RFC-009 | Relaciones multiescala | Implementado; actualizado por RFC-019 |
| RFC-010 | Design Generation | Implementado |
| RFC-011 | Institutional Memory | Implementado |
| RFC-012 | Multi-Actor Model | Implementado |
| RFC-013 | Temporal Cycles | Implementado |
| RFC-013.1 | Temporal Evolution | Implementado en rama RFC-019 de trabajo previa a integración |
| RFC-014 | User Copilot | Documentado |
| RFC-015 | Frontend v2 | Implementado como frontend funcional |
| RFC-016 | Source HTTP | Implementado |
| RFC-016.1 | Design Generation Extended | Implementado |
| RFC-017 | Contract Versioning Policy | Documentado |
| RFC-018 | RFC Process | Documentado |
| RFC-019 | Multiscale Refinement | Aprobado, implementado y verificado |

**Nota de gobierno:** la tabla distingue implementación técnica, documentación y aprobación de Product Owner. No todos los RFC documentales representan una capacidad runtime.

## Diapositiva 8 — PO-013: RFC-020 propuesto

**RFC-020 — Feasibility Filtering**

Estado: `PROPOSED`.  
Decisión: pendiente de aprobación.  
Dependencia: RFC-019 implementado.

Alcance planteado:

- `FeasibilityState`;
- `FeasibilityResult`;
- `pareto_front` con información de factibilidad;
- `feasible_pareto_front`;
- comandos CLI;
- endpoints HTTP.

**Mensaje del presentador:**

> RFC-020 es el siguiente candidato lógico para evaluación porque RFC-019 ya estabilizó el contexto espacial. Aun así, lo que está autorizado ahora es analizarlo, no implementarlo.

## Diapositiva 9 — Qué problema intenta resolver RFC-020

El frente Pareto responde a una pregunta de objetivos: qué alternativas no están dominadas según los criterios definidos.

La factibilidad responde a otra pregunta: qué alternativas satisfacen las restricciones conocidas con datos suficientes.

Estas preguntas no deben mezclarse. Una alternativa puede ser óptima en objetivos y no factible. Otra puede ser menos atractiva en el frente bruto, pero ser la única que cumple las restricciones duras.

**Mensaje clave:**

> La factibilidad filtra información técnica; no selecciona una alternativa por autoridad humana.

## Diapositiva 10 — Estados propuestos por RFC-020

```text
FEASIBLE
INFEASIBLE
UNKNOWN
INSUFFICIENT_DATA
```

| Estado | Significado propuesto | ¿Entra automáticamente al frente factible? |
|---|---|---:|
| `FEASIBLE` | Cumple las restricciones evaluadas | Sí |
| `INFEASIBLE` | Incumple al menos una restricción aplicable | No |
| `UNKNOWN` | No puede determinarse el resultado | No |
| `INSUFFICIENT_DATA` | Faltan datos necesarios para evaluar | No |

La diferencia entre `UNKNOWN` e `INSUFFICIENT_DATA` debe definirse formalmente durante la evaluación.

## Diapositiva 11 — Qué no puede hacer RFC-020

RFC-020 no puede:

- aprobar una alternativa;
- registrar una `Decision`;
- sustituir `HumanReview`;
- inferir cumplimiento normativo;
- transformar una preferencia en una restricción;
- borrar alternativas no factibles;
- ocultar alternativas con datos insuficientes;
- convertir incertidumbre en factibilidad;
- crear autoridad automática.

## Diapositiva 12 — Proceso recomendado para RFC-020

1. Congelar la semántica de los cuatro estados.
2. Definir la relación entre `Constraint`, `Evaluation`, `Evidence` y `Alternative`.
3. Ejecutar un prototipo aislado con datos sintéticos.
4. Probar casos límite y conflictos.
5. Revisar trazabilidad y autoridad humana.
6. Diseñar el impacto en CLI y HTTP.
7. Publicar una revisión de RFC-020 para PO-013.
8. Esperar la decisión formal antes de modificar el Core.

**Mensaje del presentador:**

> La salida de esta fase debe ser una recomendación de gobierno: aprobar, devolver para revisión o rechazar. No debe ser un commit de producción.

## Diapositiva 13 — PO-014: RFC-021 propuesto

**RFC-021 — Decision Variables by Scale**

Estado: `PROPOSED`.  
Decisión: pendiente de aprobación.  
Dependencia: RFC-019 implementado.

Condiciones ya identificadas:

- `ProjectVariable` no crea automáticamente `Objective` ni `Constraint`;
- editar una variable conserva trazabilidad;
- `SuggestedVariable ≠ ProjectVariable`;
- `normative_reference` es informativa;
- unicidad por `project_id + normalized_key`;
- actor y autoridad son obligatorios.

RFC-021 permanece bloqueado hasta aprobación expresa.

## Diapositiva 14 — PO-015: RFC-022 propuesto

**RFC-022 — Frontend Guided Interface**

Estado: `PROPOSED`.  
Decisión: pendiente de aprobación.  
Dependencias: RFC-019 y RFC-021.

La propuesta plantea:

- formularios guiados en lugar de comandos escritos;
- 11 escalas espaciales;
- catálogos tipados;
- validaciones y tooltips en ocho idiomas;
- trazabilidad visible;
- `FeasibilityBadge`;
- `ParetoChart` y `EventTimeline`;
- CommandBar opcional para usuarios avanzados.

La propuesta no elimina la autoridad humana ni cambia el Core. Sin embargo, su implementación debe esperar porque depende de decisiones de modelo y variables todavía no aprobadas.

## Diapositiva 15 — Dependencias entre RFCs

```text
RFC-019 — aprobado e implementado
        │
        ├── RFC-020 — propuesto, pendiente de aprobación
        │
        └── RFC-021 — propuesto, pendiente de aprobación
                         │
                         └── RFC-022 — propuesto, depende de RFC-021
```

RFC-020 y RFC-021 pueden evaluarse conceptualmente en paralelo, pero no deben implementarse sin aprobación. RFC-022 debe permanecer en diseño mientras no se congele el modelo de variables y sus catálogos.

## Diapositiva 16 — Estado de gobierno

| Elemento | Estado | Acción permitida |
|---|---|---|
| RFC-019 | Aprobado y cerrado | Mantener, integrar y verificar |
| RFC-020 | Propuesto | Evaluar y preparar decisión PO-013 |
| RFC-021 | Propuesto | Revisar semántica y dependencias |
| RFC-022 | Propuesto | Mantener diseño; no implementar |
| Frontend | Funcional | No modificar por RFC-022 sin aprobación |
| Producción | Sin cambio autorizado | No desplegar cambios derivados |

## Diapositiva 17 — Decisiones que se solicitan al Product Owner

Para RFC-020 se solicita una decisión futura sobre:

1. Definición final de `FEASIBLE`, `INFEASIBLE`, `UNKNOWN` e `INSUFFICIENT_DATA`.
2. Tratamiento de restricciones duras y blandas.
3. Política para datos faltantes y evidencia conflictiva.
4. Diferencia contractual entre frente bruto y frente factible.
5. Autoridad requerida para declarar o revisar factibilidad.
6. Compatibilidad con clientes actuales.
7. Autorización explícita para implementación.

No se solicita todavía autorización para RFC-021 ni RFC-022.

## Diapositiva 18 — Riesgos si se implementa RFC-020 prematuramente

La implementación sin definición cerrada podría:

- ocultar alternativas válidas por falta de datos;
- convertir incertidumbre en una clasificación falsa;
- mezclar evaluación técnica con decisión humana;
- introducir cambios incompatibles en el contrato HTTP;
- crear una falsa interpretación normativa;
- generar una dependencia artificial con RFC-021;
- obligar a rehacer el frontend de RFC-022.

La evaluación aislada reduce estos riesgos antes de modificar el baseline.

## Diapositiva 19 — Próximos pasos recomendados

### Paso 1
Cerrar una versión revisada de RFC-020 con semántica, invariantes y casos límite.

### Paso 2
Construir un prototipo no productivo de `feasible_pareto_front`.

### Paso 3
Ejecutar la matriz de escenarios sintéticos y conservar las salidas.

### Paso 4
Realizar revisión constitucional y de compatibilidad.

### Paso 5
Presentar el paquete a Product Owner como solicitud PO-013.

### Paso 6
Solo después de aprobación, crear una rama de implementación dedicada.

## Diapositiva 20 — Cierre

**Conclusión:** RFC-019 deja estabilizado el lenguaje espacial del Core. RFC-020 es el siguiente candidato de evaluación porque añade una distinción útil entre optimalidad y factibilidad. No obstante, la evaluación debe preservar la incertidumbre, la trazabilidad y la autoridad humana.

**Estado final que debe comunicarse:**

```text
RFC-019: APROBADO / IMPLEMENTADO / VERIFICADO
RFC-020: PROPUESTO / PENDIENTE DE APROBACIÓN
RFC-021: PROPUESTO / PENDIENTE DE APROBACIÓN
RFC-022: PROPUESTO / PENDIENTE DE APROBACIÓN
```

**Frase final del presentador:**

> El sistema está listo para evaluar RFC-020, no para implementarlo automáticamente. El siguiente acto de autoridad es una decisión del Product Owner sobre la semántica y el contrato de factibilidad.

---

# Anexo A — Resumen ejecutivo para enviar después de la presentación

RFC-019 fue aprobado mediante PO-012 y se encuentra implementado y verificado. Su resultado es un catálogo espacial canónico de once escalas, con migración trazable de los datos existentes, actualización del contrato y cobertura de pruebas.

RFC-020 puede pasar ahora a una etapa formal de evaluación. Esa etapa debe producir una especificación revisada, un prototipo aislado, una matriz de casos límite, una revisión constitucional y una solicitud de decisión para PO-013. No debe modificar el Core ni el contrato productivo.

RFC-021 continúa propuesto y conserva las condiciones establecidas por PO-014. RFC-022 continúa propuesto y depende de RFC-019 y RFC-021. Ninguno de estos dos RFCs debe implementarse como consecuencia automática de la aprobación de RFC-019.

# Anexo B — Decisiones de Product Owner vigentes

| Decisión | Tema | Estado |
|---|---|---|
| PO-012 | RFC-019 Multiscale Refinement | Aprobado y cerrado — 16 sep 2026 |
| PO-013 | RFC-020 Feasibility Filtering | Pendiente de aprobación; RFC propuesto |
| PO-014 | RFC-021 Decision Variables by Scale | Pendiente de aprobación; RFC propuesto |
| PO-015 | RFC-022 Frontend Guided Interface | Pendiente de aprobación; RFC propuesto |

# References

[1]: https://github.com/YvanCastilloQuezada/sicl-core "Repositorio SICL Core"
[2]: https://github.com/YvanCastilloQuezada/sicl-web "Repositorio SICL Web"
[3]: https://siclcc-cxip7sy.manus.space/ "Dominio público configurado de SiMS-DeI"
