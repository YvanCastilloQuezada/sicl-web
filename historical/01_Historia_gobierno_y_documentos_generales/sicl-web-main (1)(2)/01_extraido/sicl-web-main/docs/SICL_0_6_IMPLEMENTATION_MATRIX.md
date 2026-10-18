# SICL 0.6 — Matriz de implementación y evidencia

## Propósito

Esta matriz contrasta el Product Acceptance Contract con el estado verificable del proyecto. No convierte una prueba local en evidencia de operación remota y no declara terminado el producto completo mientras falten las pruebas pobladas de navegador y el núcleo Python desplegado.

| Criterio | Estado local | Evidencia | Pendiente o límite |
|---|---|---|---|
| PA-01 Identidad y acceso | Implementado | Manus OAuth y procedimientos protegidos. | Validar flujo funcional con usuario real en navegador. |
| PA-02 Proyecto persistente | Implementado localmente | SQLite/MySQL web, versiones y conflictos cubiertos. | Confirmar persistencia del Core Python remoto. |
| PA-03 Contexto espacial | Implementado como marco declarado | `spatialScope`, `temporalScope`, banner y representación contextual. | Coordenadas y geometría real requieren evidencia explícita; no hay GIS profesional. |
| PA-04 Evidencia | Implementado localmente | Sources/evidence y referencias obligatorias. | Validar dataset poblado real. |
| PA-05 Objetivos | Implementado localmente | Direction obligatoria y referencias a requirements. | Confirmar semántica contra Core remoto en flujo completo. |
| PA-06 Restricciones | Implementado localmente | Métrica y umbral numérico validados. | Ampliar operadores y reglas solo mediante contrato posterior. |
| PA-07 Preferencias | Implementado localmente | Registro `preferences`, fuerza y justificación; no se promueve a constraint. | Contrato canónico Python aún debe incorporar la entidad antes de delegación remota. |
| PA-08 Alternativas | Implementado localmente | Registro y referencias por proyecto. | Validar experiencia poblada en navegador. |
| PA-09 Evaluation | Implementado localmente | Inputs, provenance, método, unidad y factibilidad. | No calcula por sí misma resultados profesionales. |
| PA-10 Comparison | Implementado localmente | Dirección, referencias, tipo y factibilidad obligatorios. | No produce ganador automático ni reemplaza método analítico. |
| PA-11 Recommendation | Implementado localmente con fallback y adapter preparado | Referencia `basedOnKind`, razón y versión. | Confirmar ciclo canónico monotónico remoto; no inferirlo. |
| PA-12 HumanReview | Implementado localmente y delegado en contrato | Actor, confirmation, versión y authority basis. | Verificar contra servicio Python desplegado. |
| PA-13 Decision | Implementado localmente y delegado en contrato | Preparación read-only y registro humano separado. | Verificar errores, conflicto y autoridad contra Core remoto. |
| PA-14 Audit | Implementado localmente | Timeline y filtrado `safeAuditData`. | Confirmar append-only durable en el entorno canónico. |
| PA-15 Report | Implementado localmente como JSON seguro | `ReportExportButton` usa `safeAuditData`. | Diseñar formato profesional/PDF solo mediante decisión posterior; no se declara certificación. |
| PA-16 Spatial view | Implementado como representación contextual | Panel visible, scope y no inferencia geográfica. | Mapas georreferenciados requieren coordenadas y provenance. |
| PA-17 Prueba de uso | No ejecutada | La UI y pruebas estáticas pasan. | Requiere persona no programadora y proyecto poblado real. |
| PA-18 Prueba de integridad | Parcial local | 56 pruebas web y suite Python previa. | Falta E2E poblada contra núcleo Python real y persistencia remota. |

## Invariantes preservadas

SICL 0.6 no calcula ganadores al registrar una Comparison, no convierte una Recommendation en Decision, no asigna autoridad por autenticación, no infiere coordenadas desde un nombre de lugar, no promociona una Preference a requisito o restricción, no muestra secretos en auditoría y no usa la existencia de un módulo como evidencia de validez profesional.

## Decisión de alcance

El incremento actual implementa únicamente capacidades locales que pueden probarse sin inventar infraestructura: Preferences explícitas, representación espacial contextual, reporte JSON filtrado, pruebas contractuales y Product Acceptance Contract. La delegación completa de todas las escrituras al Core remoto, la URL real, HTTPS, persistencia `/data/sicl/`, la verificación poblada en navegador y cualquier certificación profesional permanecen fuera de lo que puede declararse completado sin Cloud Computer.

## Evidencia actual

La última ejecución local verificable reporta TypeScript sin errores y **56 pruebas web aprobadas**, incluyendo las regresiones de dominio para Preferences y las pruebas contractuales de UI para Preferences, representación espacial y reporte seguro. Estos resultados prueban invariantes locales; no sustituyen la prueba de uso ni la verificación E2E remota.
