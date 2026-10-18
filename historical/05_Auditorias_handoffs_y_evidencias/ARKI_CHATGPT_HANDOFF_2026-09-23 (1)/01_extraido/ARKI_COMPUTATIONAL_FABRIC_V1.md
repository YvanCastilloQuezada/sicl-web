# ARKI Computational Fabric v1.0

## Declaración de arquitectura

**ARKI** deja de definirse únicamente como un generador paramétrico o como una interfaz BIM. Su arquitectura objetivo es una **Computational Fabric**: una plataforma que combina conocimiento disciplinar, cómputo verificable, razonamiento, generación, evaluación y aprendizaje controlado para producir y mantener modelos técnicos trazables.

> **ARKI = Architectural Intelligence + Knowledge Fabric + Computation Fabric.**

La interfaz de Archi es la estación de trabajo visible. La Computational Fabric es el sistema interno que transforma requisitos, reglas, geometría, costos, tiempos y evidencia técnica en decisiones y entregables auditables.

## Principio rector

ARKI no debe copiar la estructura de una aplicación BIM existente. Debe utilizar IFC como **lenguaje de interoperabilidad y contrato de intercambio**, mientras conserva una ontología y un motor propios.

El estándar IFC 4.3 organiza los datos específicos por dominios y disciplinas. Esta separación es compatible con la visión de ARKI porque permite conectar una base común de proyecto con especializaciones de arquitectura, estructuras, instalaciones, transporte, infraestructura y otros dominios [1].

## Modelo conceptual

```text
                         ARKI
              ARCHITECTURAL INTELLIGENCE
                              │
             ┌────────────────┴────────────────┐
             │                                 │
       KNOWLEDGE FABRIC                 COMPUTATION FABRIC
             │                                 │
       Arquitectura                         Math
       Estructuras                          Geometry
       Eléctrica                            FEM
       Sanitaria                             Networks
       Mecánica                              Fluids
       HVAC                                  Optimization
       Geotecnia                             Simulation
       Hospitales                            Statistics
       Aeropuertos                           Physics
       Ferrocarriles                         Search
       Puertos                               Solvers
             │                                 │
             └────────────────┬────────────────┘
                              │
                         REASONING
                              │
                         GENERATION
                              │
                         EVALUATION
                              │
                          LEARNING
```

## 1. Knowledge Fabric

La **Knowledge Fabric** almacena y relaciona conocimiento disciplinar, normativo, constructivo y operativo. No es una colección plana de documentos. Cada conocimiento debe conservar su fuente, jurisdicción, versión, disciplina, aplicabilidad, nivel de confianza y relación con entidades del modelo.

Sus unidades principales son:

| Unidad | Función |
|---|---|
| Requisito | Capturar lo que el proyecto debe cumplir. |
| Regla | Expresar una condición verificable. |
| Entidad | Representar un elemento, sistema, espacio o activo. |
| Relación | Conectar elementos, disciplinas, fases y responsabilidades. |
| Evidencia | Registrar cálculo, fuente, prueba, captura o aprobación. |
| Decisión | Conservar la razón de una elección técnica. |
| Catálogo | Definir familias, materiales, equipos, sistemas y tipologías. |
| Norma | Asociar exigencias regulatorias al contexto correcto. |

El catálogo corporativo de Archi —incluyendo arquitectura, estructuras, MEP, hospitales, aeropuertos, ferrocarriles y puertos— debe evolucionar hacia esta estructura, sin exigir que todas las disciplinas se implementen en una sola entrega.

## 2. Computation Fabric

La **Computation Fabric** contiene los operadores matemáticos y simuladores que transforman entidades y parámetros en resultados. Cada operador debe indicar sus entradas, unidades, hipótesis, método, versión, tolerancia y salida.

| Dominio | Responsabilidad inicial |
|---|---|
| Math | Unidades, redondeos, conversiones y funciones base. |
| Geometry | Curvas, superficies, sólidos, intersecciones y tolerancias. |
| FEM | Predimensionamiento y análisis estructural preliminar. |
| Networks | Redes sanitarias, eléctricas, telecomunicaciones y seguridad. |
| Fluids | Caudales, presiones, HVAC, gases medicinales y agua. |
| Optimization | Alternativas, restricciones, costos, plazos y objetivos. |
| Simulation | Escenarios de obra, energía, circulación y operación. |
| Statistics | Incertidumbre, rangos, sensibilidad y datos históricos. |
| Physics | Comportamiento físico y validaciones de plausibilidad. |
| Search | Recuperación de familias, normas, precedentes y soluciones. |
| Solvers | Resolución numérica con estados de convergencia y error. |

La Fabric no debe ocultar resultados detrás de una afirmación genérica de inteligencia artificial. Debe devolver resultados reproducibles, rangos de validez y evidencia.

## 3. Reasoning

La capa de **Reasoning** coordina Knowledge Fabric y Computation Fabric. Su función no es reemplazar al especialista, sino:

1. Interpretar requisitos y restricciones.
2. Seleccionar reglas y operadores aplicables.
3. Detectar información faltante o contradictoria.
4. Proponer alternativas explicables.
5. Solicitar aprobación cuando una decisión tenga impacto técnico, económico o normativo.
6. Registrar qué evidencia respalda cada conclusión.

Toda conclusión importante debe poder responder: **qué se decidió, con qué datos, mediante qué método, bajo qué norma y con qué limitaciones**.

## 4. Generation

La capa de **Generation** convierte decisiones y parámetros en artefactos de proyecto:

- Familias paramétricas.
- Muros, puertas, ventanas, columnas, vigas, losas y espacios.
- Sistemas MEP y redes.
- Alternativas de planta, corte y modelo 3D.
- Metrados, costos y programación 4D.
- Expediente técnico y documentación.
- Exportaciones IFC y otros formatos gobernados.
- Información de operación y mantenimiento.

La generación debe conservar trazabilidad entre parámetro, geometría, material, cantidad, costo, actividad y documento.

## 5. Evaluation

La capa de **Evaluation** valida cada resultado antes de promoverlo:

| Evaluación | Pregunta |
|---|---|
| Geométrica | ¿La geometría es coherente y válida? |
| Semántica | ¿El elemento tiene categoría, tipo y relaciones correctas? |
| Constructiva | ¿El sistema puede construirse según las reglas declaradas? |
| Cuantitativa | ¿Los metrados coinciden con la geometría? |
| Económica | ¿El costo se reconcilia con cantidades y precios? |
| Temporal | ¿La secuencia y duración son plausibles? |
| Normativa | ¿Se aplicaron las reglas correctas para la jurisdicción? |
| Interdisciplinar | ¿Existen clashes o contradicciones? |
| Interoperabilidad | ¿El intercambio IFC conserva identidad y relaciones? |
| Evidencia | ¿El resultado puede ser auditado y reproducido? |

Los estados deben mantenerse separados: **CONCEPTUAL, IMPLEMENTED, VERIFIED y E2E VERIFIED**.

## 6. Learning

La capa de **Learning** no modifica automáticamente el conocimiento canónico. Aprende de:

- Decisiones aprobadas.
- Resultados evaluados.
- Cambios de proyecto.
- Errores detectados.
- Preferencias de usuarios y especialistas.
- Rendimientos reales de obra y mantenimiento.

Todo aprendizaje debe entrar como propuesta versionada, con revisión humana y posibilidad de reversión. La plataforma no debe convertir una inferencia estadística en norma ni en cálculo firmado.

## 7. Relación con IFC 4.3

IFC debe ocupar el lugar de **intercambio, coordinación y preservación de identidad**, no el de núcleo completo de razonamiento de ARKI.

| ARKI Computational Fabric | IFC 4.3 |
|---|---|
| Entidades y relaciones propias | Entidades IFC interoperables |
| Familias y reglas paramétricas | Tipos, propiedades, materiales y relaciones IFC |
| Geometría computacional | Representaciones geométricas IFC |
| Espacios y zonas | `IfcSpace`, zonas y relaciones espaciales |
| Sistemas MEP | Sistemas, distribución y puertos IFC |
| Costos y planificación | Recursos, costos, tareas y relaciones IFC |
| Evidencia y trazabilidad | Propiedades, documentos y referencias externas |
| Solvers y simulaciones | Resultados vinculados, no necesariamente definidos por IFC |
| Razonamiento | Capa propia de ARKI |
| Aprendizaje | Capa propia gobernada de ARKI |

La implementación debe priorizar un adaptador IFC gobernado, con mapeos explícitos y pruebas de round-trip. No se debe afirmar interoperabilidad completa por producir un archivo con extensión `.ifc`.

## 8. Contrato de datos objetivo

Cada resultado computacional debe poder expresarse conceptualmente mediante el siguiente contrato:

```ts
type ArkiComputationResult<T> = {
  result: T;
  method: string;
  methodVersion: string;
  inputs: Array<{ id: string; value: unknown; unit?: string }>;
  assumptions: string[];
  constraints: string[];
  tolerances: Record<string, number>;
  evidence: Array<{ type: string; uri?: string; checksum?: string }>;
  warnings: string[];
  status: "CONCEPTUAL" | "IMPLEMENTED" | "VERIFIED" | "E2E_VERIFIED";
};
```

Este contrato es conceptual en v1.0. No debe incorporarse al motor de producción hasta que exista un ADR, pruebas de serialización y compatibilidad con los contratos canónicos actuales.

## 9. Impacto en los 16 módulos

La nueva arquitectura no elimina los 16 módulos; les asigna una función dentro de la Fabric:

| Módulo | Papel en Computational Fabric |
|---|---|
| Data | Requisitos, fuentes, contexto y entradas. |
| Biblioteca | Knowledge Fabric, catálogos y familias. |
| Proyectos | Identidad, versiones, permisos y snapshots. |
| Generador | Generation paramétrica. |
| Modelo BIM | Entidades, relaciones y coordinación. |
| Planta | Geometry y representación 2D. |
| Corte | Lectura vertical, niveles y validaciones. |
| 3D | SceneModel, coordinación espacial y selección. |
| Metrados | Cómputo cuantitativo verificable. |
| PRESUP-5D | Costos, partidas, precios y reconciliación. |
| GASTOS | Ejecución económica y control contractual. |
| 4D | Secuencia, planificación y avance. |
| Clashes | Evaluation interdisciplinar. |
| EXP-TEC | Documentación, evidencias y entregables. |
| O-M | Operación, mantenimiento y ciclo de vida. |
| ADM | Gobierno, usuarios, permisos, auditoría y configuración. |

## 10. Roadmap propuesto

### CF-0 — Contrato y gobierno

Definir ADR de Computational Fabric, vocabulario canónico, estados, unidades, evidencia y relación con los contratos existentes.

### CF-1 — Knowledge Fabric mínima

Convertir catálogos, familias, normas y reglas actuales en registros versionados con fuente y aplicabilidad.

### CF-2 — Computation Fabric geométrica

Separar unidades, geometría, tolerancias, relaciones y operadores de cuantificación del código de presentación.

### CF-3 — Reasoning auditable

Crear un orquestador que seleccione reglas y operadores, exija datos faltantes y produzca decisiones trazables.

### CF-4 — Generation + Evaluation

Unificar generación de elementos, metrados, costos, 4D, clashes y expediente con pruebas de reconciliación.

### CF-5 — IFC 4.3 gobernado

Implementar exportación e importación por dominios, fixtures reales, validación de identidad y round-trip productivo.

### CF-6 — Learning controlado

Incorporar aprendizaje de proyectos aprobados, siempre versionado, explicable y sujeto a revisión profesional.

## Decisión de producto

Esta arquitectura se registra como **dirección estratégica aprobada para evaluación**, no como afirmación de que todas sus capacidades ya existan en el producto. El siguiente paso correcto es redactar un ADR y un contrato técnico de **CF-0**, sin modificar todavía el motor BIM ni declarar capacidades externas implementadas.

## Referencia

[1] buildingSMART International, *Industry Foundation Classes (IFC) 4.3 — Domain specific data schemas*, capítulo 7: <https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/chapter-7/index.html>
