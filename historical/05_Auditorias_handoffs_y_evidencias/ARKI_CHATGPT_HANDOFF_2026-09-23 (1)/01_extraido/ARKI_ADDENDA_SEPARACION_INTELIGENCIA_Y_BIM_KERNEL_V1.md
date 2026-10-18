# ARKI — Addenda de separación entre Inteligencia Arquitectónica y BIM Kernel

**Versión:** 1.0  
**Fecha:** 23 de septiembre de 2026  
**Destinatario:** DeepSeek  
**Ejecución:** Manus, únicamente después de contrato y aprobación del Product Owner

## 1. Propósito

Esta addenda corrige una posible mezcla conceptual. ARKI tiene una dirección de inteligencia arquitectónica, pero esa dirección no equivale a tener construido un BIM authoring system profesional. Las capacidades cognitivas y los núcleos de infraestructura deben diseñarse, implementarse y verificarse como capas relacionadas, pero independientes.

La regla principal es:

> **ARKI Intelligence explica, razona, genera, calcula, aprende bajo control y dialoga. El BIM Kernel representa, modifica, relaciona, documenta, coordina, intercambia y escala el proyecto.**

Una capacidad sólo puede declararse `IMPLEMENTED`, `VERIFIED` o `E2E_VERIFIED` cuando exista código, prueba y output reproducible. Una arquitectura escrita no es evidencia de una capacidad operativa.

## 2. Capa A — Capacidades de inteligencia de ARKI

Estas seis capacidades describen el comportamiento inteligente objetivo. No son módulos BIM ni sustituyen los kernels técnicos.

| Capacidad | Qué debe hacer ARKI | Qué no debe afirmarse todavía |
|---|---|---|
| Inteligencia arquitectónica | Interpretar intención, contexto, tipología, restricciones y objetivos de diseño. | No implica diseño autónomo profesional ni aprobación normativa. |
| Razonamiento causal | Explicar causas, dependencias, consecuencias, conflictos y datos faltantes. | No existe un grafo causal completo sólo por tener relaciones BIM. |
| Generación | Convertir parámetros, restricciones y decisiones aprobadas en alternativas y elementos. | Generar geometría no equivale a generar un proyecto constructible completo. |
| Cálculo | Ejecutar kernels deterministas con unidades, hipótesis, tolerancias y evidencia. | Un cálculo conceptual no es cálculo firmado ni validación profesional. |
| Aprendizaje | Proponer conocimiento a partir de decisiones, resultados y proyectos aprobados. | OCR, LLM o históricos no convierten automáticamente datos en norma canónica. |
| Diálogo | Guiar, preguntar, explicar, advertir y solicitar aprobación humana. | Conversar convincentemente no demuestra competencia técnica. |

Estas capacidades pertenecen a `ARKI Computational Intelligence`, junto con Knowledge Fabric, Reasoning Fabric, Computation Fabric, Evaluation y Human Authority. Su desarrollo continúa gobernado por `ARKI_COMPUTATIONAL_FABRIC_V1.md` y `ARKI_COMPUTATIONAL_INTELLIGENCE_ADDENDUM_V1.md`.

## 3. Capa B — Diez núcleos de infraestructura BIM

Estos núcleos son la base de una estación de trabajo BIM profesional. Cada núcleo debe tener contrato de datos, implementación, pruebas, outputs y límites.

### 3.1 BIM Object Kernel

Debe representar muros, losas, cubiertas, columnas, vigas, puertas, ventanas, escaleras, espacios, MEP, terreno y activos como objetos semánticos. Cada objeto necesita identidad, tipo, disciplina, clasificación, geometría, propiedades, materiales, cantidades, costos, fase, provenance y relaciones.

El objeto debe poder responder `WHY`, `CAUSES`, `DEPENDS_ON`, `REQUIRES`, `CONFLICTS_WITH`, `UNKNOWN`, `EVIDENCE` y `DECISION` cuando esas relaciones existan. Esto es una extensión diferencial de ARKI; no debe confundirse con una malla 3D ni con una simple entidad IFC.

**Estado actual:** parcial. Existen `ConstructionModel`, elementos constructivos, `SceneModel`, selección y relaciones básicas. Falta un objeto BIM canónico unificado con propiedades, provenance, decisiones y relaciones causales.

### 3.2 Parametric Constraint Engine

Debe soportar parámetros, fórmulas, unidades, referencias, restricciones geométricas, tipos, instancias, dependencias y regeneración determinista. Debe distinguir cambios directos, paramétricos y por intención.

**Estado actual:** parcial. Existe generación parametrizada, pero no un grafo completo de restricciones con propagación explicable, invalidación selectiva y revisión humana.

### 3.3 Relationship and Topology Engine

Debe representar relaciones como `host`, `hosted-by`, `connected-to`, `bounded-by`, `supports`, `penetrates`, `serves`, `belongs-to`, `intersects`, `depends-on` y `conflicts-with`. Las relaciones deben tener dirección, tipo, evidencia y ciclo de vida.

**Estado actual:** parcial. Existen `tracesTo`, relaciones constructivas y selección relacionada. Falta topología interdisciplinar gobernada y grafo causal de dependencias.

### 3.4 Transaction Engine

Debe permitir crear, modificar y eliminar de forma atómica. Debe incluir undo/redo, rollback, transacciones anidadas, historial, detección de operación inválida y recuperación después de fallo.

**Estado actual:** no demostrado. IndexedDB y snapshots no sustituyen un motor transaccional de edición del modelo.

### 3.5 BIM Documentation Engine

Debe compilar plantas, cortes, elevaciones, detalles, cotas, etiquetas, símbolos, tablas, cantidades y láminas desde el mismo modelo canónico. Ninguna representación debe convertirse en dibujo independiente que pierda sincronización.

**Estado actual:** parcial. Existen planta, canvas, expediente y documentación conceptual. Falta un compilador documental completo y verificable.

### 3.6 Family and Component System

Debe soportar familias o Smart Components con geometría, parámetros, materiales, conectores, comportamiento, restricciones, desempeño, cálculo, relaciones, clasificación, costo, mantenimiento y reglas causales.

**Estado actual:** parcial. Existen familias dinámicas y elementos constructivos. Falta el sistema completo de tipos, instancias, catálogos, conectores, desempeño y mantenimiento.

### 3.7 Coordination Engine

Debe coordinar disciplinas, vínculos, interferencias, federación, coordenadas, fases, opciones, revisiones y consecuencias. Un cambio debe mostrar elementos afectados, potencialmente afectados, recálculos requeridos y revisión humana.

**Estado actual:** parcial. Existen Clashes, filtros, niveles, comparación y selección sincronizada. Falta coordinación federada multi-disciplina con grafo de impactos.

### 3.8 BIM Data and IFC Engine

Debe soportar IFC, BCF, IDS, clasificaciones, cantidades, propiedades, GUID estables, importación, exportación, comparación y round-trip con pérdida explícita.

**Estado actual:** parcial en E6. Existe parser `web-ifc`, exporter inicial, GlobalId determinista, fixtures y lossReport inicial. Falta interoperabilidad IFC productiva con geometría, relaciones, propiedades, materiales, BCF, IDS y round-trip completo.

### 3.9 Worksharing Engine

Debe incluir usuarios, permisos, conflictos, versiones, sincronización, locks, merges, auditoría, recuperación y control de autoridad humana.

**Estado actual:** no implementado. La persistencia local-first de E6 no equivale a colaboración multiusuario real.

### 3.10 Performance Kernel

Debe permitir proyectos grandes mediante carga parcial, spatial indexing, LOD, streaming, caché, concurrencia, recuperación y pruebas de escala. Debe medirse con 1.000, 10.000, 100.000, 500.000 y 1.000.000 de objetos o fixtures equivalentes.

**Estado actual:** no demostrado. Que un modelo pequeño se renderice no prueba rendimiento profesional.

## 4. Relación correcta entre ambas capas

La relación propuesta es la siguiente:

```text
ARKI INTELLIGENCE
  ├─ inteligencia arquitectónica
  ├─ razonamiento causal
  ├─ generación
  ├─ cálculo
  ├─ aprendizaje controlado
  └─ diálogo y tutoría
          │
          ▼
BIM KERNEL
  ├─ objetos semánticos
  ├─ restricciones y parámetros
  ├─ relaciones y topología
  ├─ transacciones
  ├─ documentación compilada
  ├─ familias y componentes
  ├─ coordinación
  ├─ IFC/openBIM
  ├─ worksharing
  └─ rendimiento y recuperación
          │
          ▼
PROJECT STATE CANÓNICO
          │
          ├─ plantas, cortes, elevaciones y 3D
          ├─ metrados, 5D y 4D
          ├─ expediente técnico
          ├─ operación y mantenimiento
          └─ exportaciones gobernadas
```

La Inteligencia no debe escribir directamente sobre la interfaz ni sobre una malla. Debe proponer una operación sobre el Project State. El BIM Kernel valida la operación, calcula el grafo afectado, produce consecuencias y solicita revisión humana cuando corresponda.

## 5. Mejoras diferenciales que se proponen para ARKI

Estas mejoras no son afirmaciones de existencia. Son propuestas para superar una réplica superficial de Revit.

| Mejora | Diferencia | Evidencia requerida |
|---|---|---|
| Objetos causales | Cada elemento puede explicar causas, dependencias, evidencia y decisiones. | Grafo causal con propagación demostrable. |
| Tres formas de edición | Manipulación directa, paramétrica e intencional sobre el mismo modelo. | Una prueba que produzca el mismo cambio canónico por las tres vías. |
| Consequence Engine | Muestra afectados, potencialmente afectados, recálculos y revisión humana. | Caso retícula → estructura → MEP → documentación. |
| Documentation Compiler | Plantas, cortes, tablas y láminas compiladas del modelo. | Regeneración automática después de mover un muro. |
| Smart Components | Familias con conectores, cálculo, mantenimiento y comportamiento. | Bomba o equipo con efectos en MEP, costo, energía y mantenimiento. |
| MEP topológico | Redes con fuente, ramales, dispositivos, flujo, presión, pérdida y sistema. | Caso de demanda que propaga cambios a bomba y energía. |
| Provenance nativa | Cada decisión y resultado registra fuente, hipótesis, método, evidencia y aprobador. | Auditoría de una decisión desde requisito hasta expediente. |
| Human Authority | ARKI propone y explica; el especialista aprueba dominios regulados. | Gate que impide declarar cálculo firmado automáticamente. |
| Modelo abierto | IFC, BCF, IDS y clasificaciones tratados como interoperabilidad de primera clase. | Round-trip con pérdida explicada por elemento y propiedad. |
| Project Memory | El proyecto conserva decisiones, alternativas, resultados, errores y aprobaciones. | Reapertura y continuidad tras cierre, con identidad intacta. |

## 6. Plan de implementación propuesto para DeepSeek

No se autoriza implementar los diez núcleos simultáneamente. Se solicita a DeepSeek reformularlos en entregas pequeñas y verificables.

| Entrega | Alcance | Resultado mínimo |
|---|---|---|
| K0 | Gobierno del BIM Kernel | Vocabulario, estados, entidades canónicas y mapa de brechas. |
| K1 | BIM Object Kernel | Objeto semántico unificado y adaptación de ConstructionModel sin duplicación. |
| K2 | Constraint + Relationship Engine | Restricciones, dependencias, topología y propagación determinista. |
| K3 | Transaction Engine | Operaciones atómicas, undo/redo, rollback e historial. |
| K4 | Documentation Compiler | Planta, corte, elevación, tablas y láminas derivadas del mismo modelo. |
| K5 | Smart Components | Tipos, instancias, catálogos, conectores y desempeño. |
| K6 | Coordination Engine | Federación, fases, opciones, clashes y grafo de consecuencias. |
| K7 | IFC/openBIM | IFC4/4.3, BCF, IDS, cantidades, propiedades y round-trip. |
| K8 | Worksharing | Permisos, conflictos, locks, merges, sincronización y auditoría. |
| K9 | Performance Kernel | Índices espaciales, LOD, streaming, caché y pruebas de escala. |
| K10 | ARKI BIM-001 | Prueba extremo a extremo de edificio pequeño completo. |

Cada entrega debe indicar qué parte es ARKI Intelligence y qué parte es BIM Kernel. No se acepta una entrega que mezcle ambas capas sin definir la interfaz entre ellas.

## 7. Prueba de aceptación ARKI BIM-001

La prueba de frontera propuesta es construir un edificio pequeño, paramétrico y semántico. El caso debe producir planta, corte, elevación, tablas, cantidades, costos y un archivo IFC. Después debe cerrar y reabrir ARKI, modificar una retícula, propagar el cambio a arquitectura, estructura y documentación, detectar consecuencias MEP, comparar antes y después, ejecutar undo, volver a guardar y demostrar que se conservaron identidad, relaciones, propiedades, provenance y decisiones.

El resultado debe incluir código, fixtures, pruebas, outputs, capturas, manifest, límites y revisión humana. Un render o una exportación que simplemente abre en un visor no satisface ARKI BIM-001.

## 8. Solicitud concreta a DeepSeek

DeepSeek debe entregar una nueva Orden Maestra que:

1. Mantenga separadas las seis capacidades de ARKI Intelligence y los diez núcleos BIM.
2. Audite el estado real de cada núcleo contra el repositorio, no contra la arquitectura escrita.
3. Clasifique cada capacidad como `UNKNOWN`, `NOT_DEMONSTRATED`, `IMPLEMENTED`, `VERIFIED`, `E2E_VERIFIED` o `PROFESSIONAL_VALIDATION_REQUIRED`.
4. Proponga contratos, ADRs, dependencias, archivos autorizados, pruebas y outputs para K0–K10.
5. No modifique E5 ni declare E6 `VERIFIED` por la existencia de esta addenda.
6. No cree una lista genérica de funciones de Revit. Debe definir el diferencial de ARKI.
7. Incluya riesgos, límites y condiciones de avance.
8. Proponga qué mejoras deben entrar en el siguiente contrato y cuáles deben permanecer como FUTURE.

## 9. Decisión provisional

Esta addenda se registra como **propuesta de arquitectura y contratación**. No autoriza todavía K1–K10 ni modifica el estado de E5 o E6. La autorización de implementación deberá venir en una Orden Maestra posterior, después de que DeepSeek entregue el contrato reformulado y el Product Owner lo apruebe.

## Referencias

[1]: ARKI Computational Fabric v1.0, `ARKI_COMPUTATIONAL_FABRIC_V1.md`.

[2]: ARKI Computational Intelligence Addendum v1.0, `ARKI_COMPUTATIONAL_INTELLIGENCE_ADDENDUM_V1.md`.

[3]: Documento 76 recibido del Product Owner, 23 de septiembre de 2026.
