# ARKI — BKH-2 Constraint Engine Contract

**Versión:** 1.0 — Contract Design Only  
**Estado:** CONTRACT DESIGN / NOT AUTHORIZED FOR IMPLEMENTATION  
**Baseline:** BKH-1 VERIFIED — Relationship Fabric scope  
**Product Owner:** pendiente de aprobación explícita

## 1. Propósito

BKH-2 definirá una infraestructura única para expresar, evaluar y explicar condiciones que deben cumplirse en ARKI. El motor responderá qué está permitido, qué está prohibido, qué está limitado y qué entra en conflicto.

Una **relación** describe un vínculo entre entidades. Una **restricción** describe una condición que debe evaluarse sobre una entidad, un conjunto de entidades, un parámetro o un contexto. Una relación `SUPPORTS` pertenece a BKH-1. La condición de que un apoyo cumpla una distancia, una capacidad o una compatibilidad pertenece a BKH-2.

## 2. Alcance incluido

BKH-2 diseñará un modelo canónico de restricciones, un registro único de tipos, dominios de aplicación, operandos tipados, unidades explícitas, severidades, políticas de evaluación, resultados explicables, conflictos y provenance.

El diseño deberá permitir restricciones geométricas, dimensionales, paramétricas, topológicas, espaciales, de compatibilidad de familias, de clearance, de fase y de dominio. El contrato no obliga a implementar todos los solvers profesionales en la primera implementación. Cada tipo deberá declarar si su evaluación es determinista local, requiere un adaptador externo o permanece contractual.

Las restricciones deberán referenciar entidades y relaciones existentes mediante sus identificadores canónicos. BKH-2 no copiará ni reemplazará la Relationship Fabric.

## 3. Exclusiones obligatorias

BKH-2 no implementará regeneración de geometría, propagación de cambios, commit, rollback, undo/redo, transacciones, worksharing, aprobación humana ni mutación del estado canónico.

BKH-2 tampoco se convertirá en owner de Geometry, Quantity, Cost, Schedule, Snapshot, SceneModel o HumanDecision. BKH-3 determinará qué debe regenerarse. BKH-4 determinará cómo un cambio puede validarse, aplicarse o revertirse.

La evaluación debe ser pura desde la perspectiva del producto: dados un contexto de evaluación, un conjunto de restricciones y una versión del modelo, el resultado debe poder reproducirse sin efectos secundarios ocultos.

## 4. Modelo canónico

Cada restricción deberá contener como mínimo:

| Campo | Obligatorio | Regla |
|---|---:|---|
| `constraintId` | Sí | Identidad estable de la condición. |
| `constraintType` | Sí | Tipo existente en `ConstraintTypeRegistry`. |
| `subjectEntityIds` | Sí | Entidades afectadas; no se crean entidades implícitas. |
| `relationIds` | Opcional | Relaciones BKH-1 referenciadas. |
| `predicate` | Sí | Condición evaluable y explicable. |
| `operands` | Sí | Parámetros, referencias, constantes o expresiones tipadas. |
| `domain` | Sí | Dominio donde la condición aplica. |
| `units` | Sí cuando corresponda | Unidad explícita y convertible. |
| `severity` | Sí | `HARD`, `SOFT`, `ADVISORY` o `INFORMATIONAL`. |
| `enforcement` | Sí | `REPORT_ONLY`, `BLOCK_HYPOTHETICAL` o `REQUIRE_REVIEW`. |
| `epistemicStatus` | Sí | Estado de conocimiento de la regla. |
| `projectVersion` | Sí | Versión contextual de evaluación. |
| `provenance` | Sí | Origen, autoría, adapter y transformaciones. |

La identidad semántica de `constraintId` no cambiará por cambiar `projectVersion` si el significado de la condición permanece igual. La revisión se conservará separadamente, con el mismo principio aplicado en BKH-1.

## 5. ConstraintTypeRegistry

El registro será la única autoridad de vocabulario de restricciones. Cada tipo declarará su familia, operandos permitidos, unidades, dominios compatibles, política de conflicto, solver requerido, determinismo esperado y evidencia mínima.

El registro inicial podrá contener, como mínimo, `DISTANCE_LIMIT`, `ALIGNMENT`, `DIMENSION_RANGE`, `PARAMETER_FORMULA`, `HOST_COMPATIBILITY`, `CLEARANCE`, `CONTAINMENT`, `PHASE_COMPATIBILITY`, `MATERIAL_COMPATIBILITY` y `DOMAIN_RULE`. Los nombres son contractuales hasta que el Product Owner apruebe la implementación.

Ningún módulo podrá crear sin registro una restricción paralela con otro nombre para expresar la misma condición.

## 6. Resultado de evaluación

La evaluación producirá un resultado serializable que incluya `constraintId`, `projectVersion`, `status`, `actualValue`, `expectedValue`, `tolerance`, `units`, `severity`, `explanation`, `evidence`, `conflictingConstraintIds` y `evaluatedAtRevision`.

Los estados mínimos serán `SATISFIED`, `VIOLATED`, `UNRESOLVED`, `NOT_APPLICABLE`, `CONFLICTING` y `ERROR`. `UNRESOLVED` no podrá convertirse silenciosamente en `SATISFIED`. Un adaptador externo ausente deberá producir un resultado explícito y fail-closed.

El motor podrá proponer información diagnóstica, pero no podrá modificar parámetros, regenerar geometría ni cambiar el estado canónico para corregir una violación.

## 7. Conflictos

Una violación individual no es necesariamente un conflicto. Existe conflicto cuando dos o más restricciones aplicables no pueden satisfacerse simultáneamente dentro del mismo contexto.

El conflicto deberá conservar las restricciones participantes, el dominio común, la evidencia y el motivo de incompatibilidad. BKH-2 no elegirá cuál restricción gana ni aplicará una solución automáticamente. La resolución corresponde a HumanDecision y Transaction Engine en fases posteriores.

## 8. Invariantes obligatorios de diseño

BKH-2 deberá demostrar, antes de implementación, al menos estos invariantes:

1. Una restricción no puede existir fuera del `ConstraintTypeRegistry`.
2. Una restricción nunca sustituye una relación BKH-1.
3. La evaluación no muta entidades, relaciones ni snapshots.
4. La evaluación es determinista para el mismo contexto y versión.
5. Las unidades incompatibles producen `ERROR` o `UNRESOLVED`, nunca una conversión implícita peligrosa.
6. Una restricción fuera de su dominio produce `NOT_APPLICABLE`.
7. Una violación `HARD` se reporta y no se convierte en aprobación automática.
8. Un conflicto conserva todas las restricciones participantes.
9. Toda evaluación conserva provenance y evidencia suficiente para explicarla.
10. BKH-2 no inicia regeneración ni transacción como efecto secundario.

## 9. Gates de aprobación

El diseño no autoriza código. Antes de implementar se deberá aprobar el contrato principal, el esquema de datos, el registro inicial de tipos, la matriz de fronteras BKH-1/BKH-2/BKH-3/BKH-4, el plan de pruebas y los límites.

La implementación futura deberá comenzar con un baseline reproducible y una prueba negativa que demuestre que la evaluación no muta el modelo.

## 10. Estado

`BKH-2 CONTRACT DESIGN ONLY — NOT AUTHORIZED FOR IMPLEMENTATION`.

BKH-3, BKH-4, BKH-5, BKH-6 y BKH-7 permanecen bloqueados.

## References

[1]: https://www.buildingsmart.org/standards/bsi-standards/ "buildingSMART standards"

## 11. Requisitos adicionales de la Orden 89

El diseño debe comenzar con una auditoría de mecanismos existentes. Las reglas de familias, construcción, 4D, 5D, clashes, estructuras, MEP e IFC no se consideran ausentes por no estar dentro de un motor general. Su clasificación y destino están documentados en `BKH2_CONSTRAINT_MIGRATION_MATRIX.md`.

La taxonomía admite `CONDITIONAL` además de `HARD` y `SOFT`. Una preferencia no se eleva silenciosamente a `HARD`. Una condición condicional debe declarar su antecedente y su ámbito de aplicabilidad.

`UNKNOWN` es un resultado epistemológicamente seguro. Nunca puede convertirse automáticamente en `SATISFIED`. Si falta una relación requerida, la salida debe ser `UNKNOWN` o `MISSING_DEPENDENCY`; BKH-2 no inventará esa relación.

Las unidades, dimensiones, tolerancias, precisión, redondeo y moneda deben formar parte del contrato de evaluación. Comparar longitudes con masas deberá producir `ERROR` o `UNRESOLVED`, no un resultado booleano.

La aplicabilidad multiescala y multidisciplina será explícita. BKH-2 no extrapolará una regla de `BUILDING` a `SITE`, ni una regla de arquitectura a estructuras, sin declaración contractual.

Una constraint regulatoria deberá conservar jurisdicción, fuente, artículo o sección, versión, vigencia, escala, entidad aplicable, evidencia y estado de verificación. `RESEARCHED`, `GENERATED`, `INFERENCE` y `ASSUMPTION` no son equivalentes a `VERIFIED` o `FACT`.

BKH-2 tampoco confundirá causalidad con correlación ni con violación de constraint. Una violación puede conservar una causa externa como referencia, pero no la inventará.

Las pruebas futuras deben incluir casos adversariales: una constraint no puede autojustificarse; `UNKNOWN` no pasa por ausencia de datos; una `SOFT` no se vuelve `HARD`; una regla no contamina otra escala; y una constraint normativa pierde su validez si pierde evidencia o aplicabilidad.

Los documentos de ownership, migración, invariantes, hallazgos forenses y secuencia futura son parte integrante de este contrato.
