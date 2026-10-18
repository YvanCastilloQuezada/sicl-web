# ARKI — BKH-1 Relationship Fabric Contract

**Estado:** CONTRATO DE DISEÑO — NO IMPLEMENTADO  
**Baseline:** BKH v1.1 + BKH-0 VERIFIED  
**Product Owner:** pendiente de revisión y autorización de implementación

## 1. Objetivo

BKH-1 diseñará una única infraestructura relacional para ARKI. La Fabric deberá absorber las relaciones actualmente distribuidas sin crear un segundo Dependency Engine, Impact Graph, BIM Graph o Causal Graph.

La Fabric será una infraestructura transversal de relaciones. No será owner de la geometría, cantidades, costos, versiones, snapshots ni schedule. Su función será expresar y consultar vínculos con identidad, dirección, escala, disciplina, procedencia y estado epistémico.

## 2. Principios obligatorios

`ConstructionModel.relations` es el candidato actual de owner constructivo, pero no se declara owner definitivo de todos los dominios. `SceneModel` permanece como representación derivada. `HumanDecision` continúa siendo un déficit y no se inventará en BKH-1 un mecanismo de commit reservado para BKH-4.

Toda relación debe tener una fuente identificable. Una correlación no se convierte automáticamente en causalidad. Una relación derivada debe conservar su origen y no sustituir la relación semántica original. Ninguna relación existente desaparece sin una estrategia explícita de adaptación, migración o deprecación.

## 3. Modelo mínimo

Una relación debe expresar, como mínimo:

| Campo | Obligatorio | Naturaleza |
|---|---:|---|
| `relationshipId` | Sí | Identidad estable de la relación. |
| `relationshipType` | Sí | Tipo perteneciente a una familia relacional. |
| `sourceEntityId` | Sí | Entidad origen existente. |
| `targetEntityId` | Sí | Entidad destino existente. |
| `direction` | Sí | `DIRECTED`, `UNDIRECTED` o `BIDIRECTIONAL`. |
| `scale` | Sí | Escala de aplicabilidad. |
| `discipline` | Sí | Disciplina o dominio que origina la relación. |
| `origin` | Sí | `CANONICAL`, `LEGACY_ADAPTER`, `DERIVED`, `IMPORTED` o `HUMAN_ASSERTED`. |
| `evidence` | Sí | Referencia al dato, cálculo, fixture o decisión que la sustenta. |
| `epistemicStatus` | Sí | `PROPOSED`, `OBSERVED`, `COMPUTED`, `VERIFIED`, `REJECTED` o `UNKNOWN`. |
| `projectVersion` | Sí | Versión del proyecto donde aplica. |
| `validFrom` | Opcional | Inicio de validez temporal. |
| `validTo` | Opcional | Fin de validez temporal. |
| `scenario` | Opcional | Opción, fase o escenario. |
| `provenance` | Sí | Cadena de origen y transformaciones. |

Los campos `relationshipId`, tipo, entidades, dirección, escala, disciplina, origen, estado epistémico, versión y provenance son autoridad de la Fabric. Las métricas geométricas, cantidades, precios y fechas pertenecen a sus owners respectivos y sólo se referencian.

## 4. Familias

La Fabric soportará `SPATIAL`, `GEOMETRIC`, `STRUCTURAL`, `MEP`, `FUNCTIONAL`, `PARAMETRIC`, `CAUSAL`, `DOCUMENTAL` y `EPISTEMIC`. Cada familia deberá declarar sus tipos permitidos, invariantes, dirección, evidencia mínima y reglas de validación.

## 5. Escalas

La escala no se limita a BUILDING. El contrato debe aceptar HUMAN, COMPONENT, OBJECT, ACTIVITY, SPACE, SYSTEM, BUILDING, SITE, BLOCK, NEIGHBORHOOD, DISTRICT, CITY, METROPOLITAN-PROVINCIAL, REGION y COUNTRY. BKH-1 no implementará capacidades urbanas ni territoriales. Sólo conservará escala, aplicabilidad y provenance para que el contrato no quede encerrado arquitectónicamente en BUILDING.

## 6. Compatibilidad

El código consumidor no se romperá silenciosamente. Las rutas legacy deben usar el patrón `legacy → adapter → Relationship Fabric`. Durante la migración puede existir una lectura adaptada, pero no se permitirá mantener indefinidamente dos fuentes de verdad. La autoridad final, una vez migrada una relación, será la Fabric.

## 7. Cierre de BKH-1

BKH-1 sólo podrá implementarse cuando el Product Owner apruebe este diseño y la matriz de migración, esquema, plan de pruebas, límites y secuencia. BKH-1 no incluye Transaction Engine, Constraint Engine, HumanDecision authority, worksharing ni nuevas capacidades territoriales.

**Estado final del documento:** listo para revisión; no autorizado para implementación.
