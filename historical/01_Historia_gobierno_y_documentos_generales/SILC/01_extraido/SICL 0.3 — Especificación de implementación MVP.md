# SICL 0.3 — Especificación de implementación MVP

## Estado

Esta especificación define el MVP de SICL 0.3 como una extensión aislada de Core Contract 1.0. No autoriza todavía perfiles profesionales, autenticación, autorización, IA autónoma ni decisiones automáticas.

## Objetivo

Permitir declarar y validar políticas de evaluación llamadas `Profile`, sus relaciones explícitas con `Objective` y las políticas de normalización requeridas para hacer comparables resultados. El MVP no produce ganadores ni Recommendations.

## Entidades

### Profile

Campos obligatorios: `profile_id`, `project_id`, `name`, `profile_version`, `status` y `contract_version`. `status` pertenece al catálogo `DRAFT`, `ACTIVE`, `RETIRED`. `profile_version` es entero positivo.

### ProfileObjectiveBinding

Campos obligatorios: `binding_id`, `project_id`, `profile_id`, `objective_id`, `rationale` y exactamente una política de preferencia: `weight` o `priority`. `weight` es finito y no negativo. `priority` es entero positivo. `normalization_policy_id` es obligatorio cuando se usa `weight`.

### ProfileEvaluationBinding

Campos obligatorios: `binding_id`, `project_id`, `profile_id`, `objective_id`, `evaluation_id`, `profile_version`, `evaluation_version`, `applicability_status` y `rationale`. La relación declara qué Evaluation considera un Profile sin modificar la Evaluation original.

`profile_version` y `evaluation_version` deben ser positivos y coincidir con las versiones verificadas. `applicability_status` pertenece al catálogo `APPLICABLE`, `NOT_APPLICABLE`, `UNKNOWN`. La Evaluation vinculada debe coincidir con la política en `criterion`, `unit` y `direction`; ninguna de esas propiedades se infiere.

### NormalizationPolicy

Campos obligatorios: `normalization_policy_id`, `project_id`, `criterion`, `method`, `direction`, `unit`, `version` y `parameters`. `direction` solo admite `MINIMIZE` o `MAXIMIZE`; `parameters` debe contener escalares JSON finitos cuando el método los requiere. `MIN_MAX` y `DECLARED_SCALE` requieren `lower < upper`; `RANK` no requiere límites. El método debe pertenecer al catálogo cerrado del módulo 0.3. `MIN_MAX` y `DECLARED_SCALE` son ejecutables para valores aislados; `RANK` es `DECLARED_ONLY` en 0.3 y nunca devuelve una normalización válida sin una cohorte explícita.

## Relaciones

Todas las relaciones se expresan por IDs. Profile, Binding, Objective, Evaluation y NormalizationPolicy deben pertenecer al mismo Project. Cada ProfileEvaluationBinding debe expresar explícitamente el par Objective–Evaluation. Un Profile no puede tener más de un binding para el mismo Objective o Evaluation. Ninguna entidad 0.3 se enlaza automáticamente con una entidad 1.0 por nombre o posición.

## Estados y resultados

La validación devuelve estados explícitos: `VALID`, `INVALID_REFERENCE`, `INCOMPLETE_DATA`, `INCOMPATIBLE_CRITERION`, `INCOMPATIBLE_UNIT` o `INCOMPATIBLE_DIRECTION`. La ausencia de normalización, dirección, peso o prioridad no se corrige con defaults. Ningún estado de validación produce por sí mismo Recommendation o Decision.

El MVP incluye `normalize_value` para `MIN_MAX` y `DECLARED_SCALE`. El cálculo usa límites declarados, respeta la dirección y devuelve `VALID`, `OUT_OF_RANGE` o `INSUFFICIENT_DATA`; nunca hace clamping silencioso. `RANK` permanece declarado pero devuelve `UNSUPPORTED_METHOD` cuando se intenta normalizar un valor aislado, porque requiere una cohorte explícita.

## Persistencia y eventos

La persistencia 0.3 utiliza tablas aisladas de Core 1.0, snapshots versionados y eventos append-only. Los Profiles admiten actualización mediante `expected_profile_version` y evento `PROFILE_UPDATED`; sus bindings actuales se reemplazan atómicamente y nunca se modifica una Evaluation histórica. Las `NormalizationPolicy` son inmutables por `normalization_policy_id`: una evolución semántica requiere una nueva identidad de política y un nuevo evento `NORMALIZATION_POLICY_CREATED`. La repetición exacta del mismo snapshot y evento es idempotente; un mismo ID con payload diferente se rechaza.

## Prohibiciones

Un Profile no es un actor, rol, identidad, credencial ni autorización. Un peso no se aplica directamente a outputs de unidades incompatibles. No se permite normalización implícita, aprendizaje automático de preferencias, desempate silencioso ni escritura automática de Decision.

## Criterios de aceptación

El MVP será aceptable si crea entidades válidas, rechaza referencias cruzadas y valores inválidos, impide duplicar bindings por Objective o Evaluation, conserva versiones explícitas y produce estados de validación deterministas. La suite de Core Contract 1.0 debe continuar pasando sin modificaciones semánticas.
