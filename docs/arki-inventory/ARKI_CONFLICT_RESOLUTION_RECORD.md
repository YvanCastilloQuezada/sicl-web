# ARKI — Conflict Resolution Record

## Resolución de los 11 conflictos de Delta 515

**Fecha de resolución:** 2026-09-20  
**Repositorio:** `YvanCastilloQuezada/sicl-web`  
**Baseline ejecutable adoptado:** `main@a565a90952c5b219e97f73607ff32db29bf8712d`  
**Autoridad de la resolución:** orden explícita del Product Owner / Arquitecto Jefe en la sesión actual  
**Alcance:** resolución documental y de clasificación; no implementación, no reparación, no promoción de conocimiento y no despliegue.

## Criterio general

Los conflictos no se resuelven convirtiendo documentos históricos en capacidades actuales. Se resuelven fijando la interpretación que debe usar el proyecto a partir de ahora, preservando la evidencia histórica y manteniendo `UNKNOWN`, `NOT_RECORDED`, `BLOCKED` y `NOT_VERIFIED` cuando la evidencia técnica no permite una afirmación positiva.

> **Resolución de una ambigüedad no equivale a implementación, validación profesional ni promoción de conocimiento.**

## Matriz de resoluciones

| Nº | Conflicto | Resolución adoptada | Estado resultante | Efecto operativo |
|---:|---|---|---|---|
| 1 | Baseline actual versus inventarios en disco | Se adopta `HEAD == origin/main == a565a909...` como baseline reproducible. Los inventarios no rastreados son anexos documentales del worktree, no baseline adoptado. | `RESOLVED — COMMITTED_BASELINE_SELECTED` | Las afirmaciones de código actual deben referirse al HEAD. Los informes no rastreados se citan como evidencia de auditoría, no como release. |
| 2 | Lenguaje de órdenes Delta 513/514/515 versus evidencia de finalización | Las órdenes existen y fueron parcialmente documentadas en el worktree, pero no existe prueba de commit, push ni aceptación formal en el baseline. Se clasifican como órdenes documentadas con ejecución documental parcial, no como órdenes completamente validadas. | `RESOLVED — DOCUMENTED_PARTIAL / NOT_COMMITTED` | No se afirma ejecución completa ni cierre de producto. Delta 515 queda cerrado sólo como informe de inventario, no como implementación. |
| 3 | Reportes históricos congelados versus capacidad actual | D6.x, L2, E-KNOW y M0-K se conservan como evidencia de sus checkpoints. No se transfieren automáticamente al estado actual. La capacidad actual se limita a lo que el HEAD y una evidencia reproducible vigente establecen. | `RESOLVED — HISTORICAL_LINEAGE_ONLY` | Un `PASS` histórico no se presenta como `PASS` actual sin ejecución o evidencia equivalente actual. |
| 4 | Geometría D6.3 versus diseño profesional | D6.3-G se reconoce como demostración conceptual controlada de dos candidatos en un microcaso. No es diseño constructivo, documentación para licencia, BIM ni validación normativa. | `RESOLVED — CONCEPTUAL_MICROCASE_ONLY` | Se conserva el puente topología→geometría, pero se prohíbe usarlo como prueba de capacidad profesional. |
| 5 | Publicación de ARKI-BOOK versus conocimiento canónico | ARKI-BOOK se clasifica como interfaz editorial y educativa. Sus capítulos y estados de publicación no canonizan conocimiento ni sustituyen M0-K/SICL Core. | `RESOLVED — EDITORIAL_VIEW_ONLY` | El Libro Vivo puede presentar contenido, pero toda promoción a conocimiento canónico requiere un flujo separado de evidencia y revisión humana. |
| 6 | Tests E-KNOW 6/6 versus canonización semántica | El resultado de tests valida el comportamiento local de las reglas implementadas, no la verdad universal de SPACE/ROOM ni SPATIAL_BOUNDARY/WALL. Se conserva `HYPOTHESIS / K2_CANDIDATE / HUMAN_REVIEW_REQUIRED`. | `RESOLVED — HYPOTHESIS_NOT_FACT` | No se generan automáticamente muros, habitaciones, dimensiones o cumplimiento normativo a partir de esas reglas. |
| 7 | Persistencia local L2 versus persistencia canónica remota | La persistencia local y el replay quedan aceptados como demostrados en el checkpoint. La persistencia remota permanece bloqueada porque no hay endpoint canónico, configuración ni E2E verificable. | `RESOLVED — LOCAL_PASS / REMOTE_BLOCKED` | No se afirma que el conocimiento o las ejecuciones estén guardados en SICL Core remoto. |
| 8 | Órdenes R-PARTI versus ausencia de artefactos | Las órdenes adjuntas prueban que R-PARTI fue solicitado, pero no prueban ejecución. Al no existir implementación, informe, manifest, test, commit o push en el repositorio auditado, R-PARTI se resuelve como no verificado y no ejecutado a efectos del baseline. | `RESOLVED — NOT_VERIFIED / NOT_IN_BASELINE` | No se reutiliza ningún supuesto resultado R-PARTI ni se afirma que I0–I11 estén completados. |
| 9 | Aprobación de RFC/product-decision versus despliegue | La aprobación de una propuesta autoriza conceptualmente la dirección descrita en el artefacto de decisión. No prueba endpoint configurado, token, despliegue, persistencia remota o E2E. | `RESOLVED — APPROVED_PROPOSAL / DEPLOYMENT_UNVERIFIED` | La aprobación permanece documental; la capacidad desplegada sigue sin demostrarse. |
| 10 | Delta como producto unificado versus componentes por capas | ARKI/SICL se clasifica como una familia de componentes y contratos parcialmente conectados, no como un único runtime Delta 515 verificable. | `RESOLVED — LAYERED_SYSTEM / NO_UNIFIED_DELTA_RUNTIME` | Los claims deben nombrar el módulo, checkpoint y evidencia concreta; no se usa “Delta 515” como garantía de integración total. |
| 11 | HEAD actual versus selección del baseline congelado | Se selecciona el HEAD actual como baseline ejecutable vigente. Los baselines congelados históricos permanecen preservados como lineage/replay y no se consideran superseded ni current runtime. | `RESOLVED — HEAD_CURRENT / HISTORICAL_BASELINES_PRESERVED` | La selección resuelve la ambigüedad de ejecución sin borrar, invalidar ni sobrescribir los checkpoints históricos. |

## Decisiones que esta resolución no toma

Esta resolución no afirma que ARKI tenga documentación constructiva, DWG, DXF, RVT, IFC, MEP, estructura, GIS territorial completo, CFD, cumplimiento RNE, licencia, aprendizaje autónomo, generalización tipológica, persistencia Core remota o autonomía profesional. Todas esas capacidades mantienen el estado documentado en la matriz de madurez.

Tampoco se promueve E-KNOW a `FACT`, no se promueve una tipología a conocimiento universal, no se selecciona un ganador geométrico y no se considera R-PARTI ejecutado. La resolución sólo fija cómo deben interpretarse las evidencias existentes.

## Consecuencias para la memoria de ARKI

La memoria de ARKI queda organizada en cuatro capas:

1. **Baseline ejecutable vigente:** el código y los artefactos rastreados en `a565a909...`.
2. **Evidencia histórica congelada:** M0-K, D6.1–D6.4, E-KNOW, L2 y sus manifests, reportes, pruebas y commits asociados.
3. **Archivo documental de auditoría:** los inventarios Delta 513–515 que existen en el worktree y deben conservar sus referencias de commit/no-commit.
4. **Órdenes no demostradas:** órdenes adjuntas, incluyendo R-PARTI, que no pueden convertirse en resultados sólo por estar redactadas.

La cadena de autoridad queda así:

`SOURCE / RESEARCH → KNOWLEDGE → IDEA → PROPOSAL → HUMAN DECISION → FROZEN DECISION → ORDER → IMPLEMENTATION → TEST → DEMONSTRATION → CURRENT CAPABILITY`

La resolución actual fija el baseline y la interpretación de los enlaces. No completa los enlaces que carecen de evidencia.

## Estado de cierre

- Conflictos identificados: **11**.
- Conflictos resueltos como clasificación o decisión documental: **11**.
- Conflictos resueltos como capacidades implementadas nuevas: **0**.
- Promociones de conocimiento: **0**.
- Órdenes nuevas ejecutadas: **0**.
- Código modificado: **NO**.
- Esquema o base de datos modificados: **NO**.
- Commit: **NO**.
- Push: **NO**.
- Deploy: **NO**.

La resolución queda sujeta a reapertura únicamente mediante una nueva decisión humana que aporte evidencia nueva o cambie explícitamente el baseline, la autoridad, el alcance o la clasificación.

## Referencias

[1]: file:///home/ubuntu/sicl-web/docs/arki-inventory/ARKI_IDEA_AND_DECISION_INVENTORY.md "ARKI Idea and Decision Inventory — Delta 515"
[2]: file:///home/ubuntu/sicl-web/docs/arki-inventory/ARKI_TOTAL_SYSTEM_INVENTORY.md "ARKI Total System Capability Inventory"
[3]: file:///home/ubuntu/sicl-web/docs/arki-d63g/D6.3-G-REPORT.md "D6.3-G topology-to-geometry report"
[4]: file:///home/ubuntu/sicl-web/docs/arki-l2/ARKI-L2-TRANSFER-RUNTIME.md "ARKI L2 transfer runtime"
[5]: file:///home/ubuntu/sicl-web/docs/arki-block2/E-KNOW-BLOCK-2-SPATIAL-SEMANTICS.md "E-KNOW Block 2 spatial semantics"
[6]: file:///home/ubuntu/sicl-web/docs/arki-d64/D6.4-MULTIMODAL-SOURCE-INGESTION-REPORT.md "D6.4 multimodal source ingestion report"
[7]: file:///home/ubuntu/upload/pasted_content_491.txt "Uploaded R-PARTI order material"
[8]: file:///home/ubuntu/upload/pasted_content_493.txt "Uploaded R-PARTI order material"
[9]: file:///home/ubuntu/upload/pasted_content_515.txt "Delta 515 mandatory supplement"
