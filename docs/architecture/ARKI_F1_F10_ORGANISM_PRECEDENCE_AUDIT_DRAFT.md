# ARKI — Correspondencia F1–F10, organismo y precedencias
**Estado:** DRAFT / AUDITORÍA DE PLANIFICACIÓN — NO AUTORIZA IMPLEMENTACIÓN
**Fecha:** 2026-10-09
**Fuente primaria:** ARKI_CONSOLIDADO_ESQUELETO_SISTEMA_NERVIOSO_2026-09-29.txt (propuesta del 2026-09-29; estado NO IMPLEMENTAR TODAVÍA).
**Fuente secundaria:** etiquetas y descripciones F1–F10 de tools/maqueta-viva/maqueta-viva.template.html en feat/f7-f8-integral-closure.
**Regla:** REUSE → COMPOSE → EXTEND → NEW. Sin segundo D-2, segundo Project State, segundo event log, segundo motor de impacto ni promoción desde UI.

## 1. Dos ejes distintos
- **F1–F10**: alcance funcional/producto de ARKI. No equivalen a orden de commits ni a diez motores.
- **Etapas técnicas 0–6**: orden de integración sugerido en el documento consolidado. No reemplazan F1–F10.
- **P0–P7** (conexiones del consolidado): precedencias técnicas, no prioridades verificadas del HEAD actual.
- **Madurez 0**: falta de evidencia de madurez; NO implica igual urgencia o igual precedencia.
- **FROZEN**: restricción de modificación, no grado de madurez ni indicador automático de urgencia.

## 2. Matriz preliminar de correspondencia
| Fase funcional | Responsabilidad | Relación con organismo consolidado | Precedente técnico probable | Evidencia de ejecución actual |
|---|---|---|---|---|
| F1 Identidad / Project State | Identidad, confianza, estado y trazabilidad | Project Snapshot, event log, Human Authority | Baseline, ownership, event log | NO VERIFICADO EN ESTA AUDITORÍA |
| F2 Conocimiento y Universidad | Fuentes, curaduría, razonamiento y aprendizaje | KNOWLEDGE, sentidos, provenance | Identidad de fuentes, UNKNOWN, reasoning persistence | NO VERIFICADO |
| F3 Inteligencia arquitectónica | Razonamiento y decisiones | BRAIN, D6.2, reasoning | Semántica verdadera, transporte de reasoning | NO VERIFICADO |
| F4 Partido y topología | Programa, relaciones espaciales y parti | SYNTHESIS, PARTI, hipótesis, redes funcional/espacial | F3 + procedencia + constraints | NO VERIFICADO |
| F5 Evaluación / selección | Crítica, selección, comparación | EXPLORATION, EVALUATION, genealogía | Candidatos no canónicos + pruebas + UNKNOWN | NO VERIFICADO |
| F6 AGK / geometría 3D | Geometría operacional | KERNEL / D-2 y geometría; distinguir AGK de D-2 | Contratos geométricos, validación y ownership | NO VERIFICADO |
| F7 Desarrollo técnico | Desarrollo profesional y evidencia | DEVELOPER proposal-only, revisión, promotion gate | DeveloperProposal, HumanReview, Core promotion | NO VERIFICADO |
| F8 Expediente técnico | Documentación derivada | REPRESENTATION: ARE/DRAW/IFC | D-2 committed y representación derivada | NO VERIFICADO |
| F9 Construcción y obra | Campo, cambios, gemelo digital | Events, impact, reaction, recomputation | Baseline, D-2, eventos, validación | NO VERIFICADO |
| F10 Operación y aprendizaje | O&M y retroalimentación | Feedback, knowledge, event log | Evidencia operativa + provenance + control de cambios | NO VERIFICADO |

**Advertencia:** correspondencias arquitectónicas propuestas, NO prueba de que una API, test o integración exista o funcione.

## 3. Orden de auditoría técnica (no de ejecución)
1. P0: comprobar baseline real, dependencias y CI core.
2. P1: comprobar verdad semántica D6.3 G12 y ausencia de autoridad canónica en hipótesis.
3. P2: comprobar contrato de razonamiento append-only sobre event log existente.
4. P3: comprobar DeveloperProposal DTO/schema, compatibilidad y fingerprint.
5. P4: comprobar Developer proposal-only sin mutación D-2.
6. P5: comprobar Core-owned promotion, HumanReview, A002, ArchiTransaction, H-chain, protección TOCTOU.
7. P6: comprobar D-2 → ARE → DRAW sin estado paralelo.
8. P7: ejecutar MICROCASE-DEV-001, regresiones y evidencia E2E.

## 4. Universo de elementos del plan
F1–F10, pendientes, ideas dispersas, FROZEN, Ideas ARKI, Research & Trends, historial de fuentes (incluido 0), pruebas E3 Windows, componentes y adecuaciones.
Cada elemento debe registrar: ID estable, fase(s), procedencia, estado epistémico, predecesores, dependientes, evidencia, versión/fingerprint, restricción FROZEN, urgencia, prioridad de investigación, pruebas requeridas, resultados y decisión PO.
Sin dependencia registrada = **NO DEMOSTRADA**, nunca inferir precedencia por parecido de nombre.

## 5. Reglas de priorización
- Priorizar investigación de raíces que bloquean múltiples capacidades; distinguir dependientes teóricos de desbloqueos demostrados.
- Riesgos críticos de integridad/seguridad exigen contención, pero NO habilitan promoción automática.
- Detectar ciclos, referencias ausentes y cambios de fingerprint.
- Tres colas separadas: investigar, probar, implementar.
- Una pieza sólo pasa a IMPLEMENTABLE si tiene prueba reproducible, comparación atribuible, regresiones, revisión y autorización limitada al cambio exacto.
- FROZEN no se modifica por optimización automática.
- Las decisiones del PO deben persistirse en sistema autorizado, no sólo en localStorage de navegador.

## 6. Contrato de autoridad del consolidado
- Un solo Project Snapshot, un solo D-2, un solo event log.
- Exploration y Developer emiten propuestas; no mutan D-2.
- Core recupera propuesta persistida, verifica fingerprint, HumanReview para esa versión, DTO/schema, A002, ArchiTransaction y H-chain antes de commit.
- UNKNOWN no se rellena con geometría o defaults inventados.
- UI es proyección, no fuente canónica.
- El documento de 2026-09-29 ordena NO IMPLEMENTAR TODAVÍA hasta revisión y cierre contractual.

## 7. Próximas verificaciones obligatorias
- Contrastar la matriz con HEAD exactos de sicl-core y sicl-web, no sólo con maqueta.
- Identificar archivos, funciones, tests, CI y fingerprints que prueben cada fila.
- Separar HECHO / SUPUESTO / UNKNOWN / DECISIÓN.
- Confirmar si el consolidado histórico sigue vigente frente a contratos y freezes posteriores.
- Sólo entonces aprobar un delta mínimo; no añadir un motor de planificación duplicado.

**Veredicto:** correspondencia conceptual registrada. IMPLEMENTACIÓN=NO AUTORIZADA; E2E=NO VERIFICADO; ZERO_DEBT_FREEZE=NO DEMOSTRADO.

## 8. Primer contraste directo con GitHub — 2026-10-09

**Alcance de esta comprobación:** lectura de archivos específicos en rama `main` de ambos repositorios. No constituye barrido repo-wide, ejecución de tests ni confirmación de CI. Los SHA indicados son **blob SHA**, no HEAD commit SHA.

| Repositorio / archivo | Blob SHA observado | Hecho comprobado | Límite |
|---|---|---|---|
| sicl-web / shared/arkiDeveloperProposal.ts | `0b68b8f7846ab9c4927832d5d1fe684c62343cb8` | Existe contrato DeveloperProposal pre-D-2; declara propuesta no canónica y no promotora | No verifica interoperabilidad real con Core |
| sicl-web / shared/arkiDeveloperProposal.test.ts | `72b0bc661fe240485b313ff23091b07fd95f025a` | Existen pruebas Vitest de validación del contrato, incluyendo fingerprint/UNKNOWN | No se ejecutaron |
| sicl-web / package.json | `f83eb6683287a168cf733e1b34783d68df0ce943` | Declara `test: vitest run` y scripts E2E canónicos | No hay resultado de ejecución |
| sicl-core / pyproject.toml | `b288cb03149880ac2a012532dedc49b18b427ae4` | Declara `reportlab>=4,<5` en extras de pruebas, además de pytest | No confirma CI verde ni que todas las instalaciones usen el extra |
| sicl-core / requirements.txt | `5c94cbe4467da119b7390ae9fa518340b042942` | Lista FastAPI, uvicorn, ifcopenshell, python-multipart; **no lista reportlab** | Diferencia de manifiestos requiere examinar workflow de instalación antes de diagnosticar fallo |
| sicl-core / README.md | `6266af04c5934f23906312131b005bda8c77e87c` | Describe Core como fuente de verdad y una verificación local histórica | README no sustituye evidencia actual de CI |

**Corrección de estado:** DeveloperProposal contract = **EXISTE EN ARCHIVO** (no «NO VERIFICADO» para su existencia); test de contrato = **EXISTE EN ARCHIVO / NO EJECUTADO**; reportlab = **DECLARADO EN EXTRA TEST / NO DEMOSTRADO EN ENTORNO**. Las otras filas de la matriz mantienen estado **NO VERIFICADO** hasta inspección y pruebas concretas.

**No inferir ausencia de implementación** por resultados vacíos de búsqueda indexada ni por un 404 en una ruta supuesta. Verificar rutas y ramas efectivas.

### Próximo corte de auditoría
1. Resolver HEAD commit exacto y CI de ambos repositorios, incluyendo branch de integración frente a main.
2. Examinar semántica de `validateDeveloperProposal`, fingerprints y pruebas adversariales.
3. Localizar API Core de reasoning-executions, promoción y HumanReview por árbol real, no por nombres presumidos.
4. Ejecutar tests pertinentes en entorno reproducible; registrar PASS/FAIL/UNKNOWN con comando, SHA, artefacto y hora.
5. Reconciliar hallazgos con el consolidado de septiembre, respetando freezes posteriores.

**Resultado:** auditoría documental y lectura de archivos; ninguna mutación canónica, promoción ni implementación de producto.

## 9. Corte de auditoría Developer → Core — 2026-10-09

**Repositorios y referencia:** lectura directa de `sicl-web/main` (archivos individuales); no se ejecutó test, no se inspeccionó el árbol completo de Core y no se verificó CI. No atribuir resultados de búsqueda indexada vacía a ausencia de código.

| Contrato / paso | Evidencia directa en sicl-web/main | Estado |
|---|---|---|
| DeveloperProposal DTO y validación | `shared/arkiDeveloperProposal.ts`, blob `0b68b8f7846ab9c4927832d5d1fe684c62343cb8`; `validateDeveloperProposal()` y control de propiedad `canonical` | **EXISTE EN CÓDIGO / NO EJECUTADO** |
| Developer proposal-only | `server/arkiArchitecturalDeveloper.ts`, blob `0d31cffb4850ed3263b7fa5f9638ff5fad73bd24`; `developProposal()`, sin llamada Core en ese archivo; produce propuesta y validación | **EXISTE EN CÓDIGO / NO EJECUTADO** |
| Candidate/Parti gate | `developProposal()` exige `SELECTED_FOR_DEVELOPMENT`, comprueba `projectId` y fingerprint de Parti | **EXISTE EN CÓDIGO / NO EJECUTADO** |
| UNKNOWN y semántica G12 | Developer registra UNKNOWN y limitación `G12_NO_TEMPLATE_HARDCODING=FAIL` si procede | **EXISTE EN CÓDIGO / NO EJECUTADO** |
| Pruebas adversariales del Developer | `server/arkiArchitecturalDeveloper.test.ts`, blob `4e19d4b8116e8a7b360fe305e47e6804e899ce82`; pruebas declaradas de fingerprint, UNKNOWN, ausencia de DOOR inventada y `canonical:true` | **PRUEBAS ESCRITAS / NO EJECUTADAS** |
| Motor geométrico existente | `server/arkiGeometryKernel.ts`, blob `3ca30eef47ad9a66e814d05f213648751a9c74bc`; importa bridge D63→D2 y fingerprint | **ARCHIVO EXISTE / SEMÁNTICA NO AUDITADA** |
| Proposal persistida en event log Core | No se verificó ruta, implementación ni test | **UNKNOWN** |
| HumanReview exacto con fingerprint persistido | No se verificó ruta, implementación ni test | **UNKNOWN** |
| Core-owned promotion + A002/ArchiTransaction/H-chain | No se verificó ruta, implementación ni test | **UNKNOWN** |
| D-2 committed → ARE/DRAW + impacto/recomputación | No se verificó circuito E2E | **UNKNOWN** |

### Hallazgo de precedencia
El **Developer ya existe**, por lo que crear otro Developer o DTO sería duplicación. La siguiente investigación de máximo valor es **recorrer desde la salida de `developProposal()` hacia persistencia, HumanReview y Core promotion**, y ejecutar pruebas sobre HEAD exacto. No afirmar que Core promotion falta: está **UNKNOWN** hasta inspección por rutas reales.

### Prueba mínima para pasar de UNKNOWN a VERIFIED
- Identificar endpoints, propietarios, DTOs y eventos reales en Core y Web.
- Demostrar persistencia append-only y fingerprint estable en propuesta recuperada.
- Rechazar propuesta alterada después de HumanReview (TOCTOU).
- Verificar rechazo de UNKNOWN no sustentado y de `canonical:true` desde Web.
- Verificar transacción fail-closed y ausencia de mutación D-2 ante rechazo.
- Verificar commit D-2 solamente tras aprobación exacta y representación desde ese commit.
- Registrar comandos, SHA exactos, salida y CI, sin dar verde por la mera existencia de pruebas.

**No implementar hasta cerrar contrato y evidencia.**

## 10. CORRECCIÓN MAYOR — integración hasta F8 existente (2026-10-09)

**Este corte reemplaza los juicios históricos de las secciones 1–9 cuando discrepen.** Las secciones anteriores documentan el progreso de la investigación y NO son el veredicto vigente.

### Evidencia transversal recuperada
- **Core PR #27** (merged): persistencia D-2 durable, append-only, rollback y API.
- **Core PR #28** (merged): HumanReview vinculada a DeveloperProposal persistida con fingerprint exacto.
- **Core PR #29** (merged): frontera reutilizable de publicación ArchiTransaction.
- **Core PR #37** (merged): servicio Core-owned de promoción Developer.
- **Core PR #38** (merged, 2026-09-29): endpoint POST /v1/projects/{project_id}/developer-promotions y pruebas HTTP.
- **Core PR #39** (merged, 2026-09-29): MICROCASE-DEV-001, HTTP E2E, idempotencia, restart, persistencia y controles fail-closed (pruebas añadidas; ejecución actual NO revalidada).
- **Web PR #30** (merged, 2026-09-29): orquestación DeveloperProposal → HumanReview → Core promotion → D-2.
- **Web PR #49** (open): F7→F8 integral closure; referencias canónicas Core/D-2/AGK, BASELINE_0, estado F7, gemelo económico y dossier F8, tests adversariales; el PR declara EXECUTION_VERIFICATION_PENDING.
- **Web PR #50** (open): entrega profesional F7/F8 V1, cambios adicionales en interfaz, mapa y contratos.

### Estado declarado por el estado estructurado de la rama de integración
Archivo `docs/arki-master-map/ARKI_MASTER_MAP_STATE.json` (blob `8867c065fc4216257c777c3cfcb6ef61cab47ba4`, fecha interna 2026-10-07):
| Fase | Estado declarado | Evidencia declarada |
|---|---|---|
| F1 | RECONCILIATION_REQUIRED | NOT_YET_RECONCILED |
| F2 | RECONCILIATION_REQUIRED | NOT_YET_RECONCILED |
| F3 | RECONCILIATION_REQUIRED | NOT_YET_RECONCILED |
| F4 | RECONCILIATION_REQUIRED | NOT_YET_RECONCILED |
| F5 | RECONCILED_WITH_POST_AUDIT_CORRECTIONS | SEMANTIC_CATEGORY_HARDENING_IMPLEMENTED_LOCAL_EVIDENCE_RECORDED |
| F6 | FROZEN | GO_BOUNDED_DEMONSTRATED_BOUNDARY |
| F7 | IN_PROGRESS | IMPLEMENTATION_PRESENT_EXECUTION_VERIFICATION_PENDING |
| F8 | IN_PROGRESS | DERIVED_DOSSIER_CONTRACT_IMPLEMENTED_EXECUTION_VERIFICATION_PENDING |
| F9 | RECONCILIATION_REQUIRED | NOT_YET_RECONCILED |
| F10 | RECONCILIATION_REQUIRED | NOT_YET_RECONCILED |

`docs/arki-master-map/ARKI_F7_F8_F9_EXECUTION_HANDOFF_2026-10-08.md` (blob `184bb7174016a62ae0663db8fc7716d74772b39f`) confirma F7/F8 código implementado y pruebas escritas, pendiente ejecutar pruebas exactas, y F9 contrato acotado sin demostración integral.

### Veredicto rectificado
1. **El usuario tiene razón:** el trabajo llegó hasta **F8 a nivel de implementación en rama**. No se debe describir F7/F8 como etapas aún por construir.
2. **No equivale a F1–F8 todos verificados ni F8 FROZEN.** El propio mapa declara F7/F8 IN_PROGRESS y EXECUTION_VERIFICATION_PENDING, F1–F4 pendientes de reconciliación histórica.
3. **La promoción Developer/Core ya está implementada y fusionada.** Retirar su tratamiento genérico como UNKNOWN; lo pendiente es verificar CI/ejecución en SHA actual, no inventar otro motor.
4. **F6 permanece FROZEN** en su alcance probado; no reabrirla.
5. **Prioridad real:** cerrar pruebas de F7/F8 (TypeScript, tests focales/regresión, build, evidencia profesional real, reconciliación Core), antes de fusionar PR #49/#50. Luego F9 con evidencia de campo, no con nuevos contratos paralelos.
6. El ejecutor GitHub controlado V0 (`docs/arki-master-map/ARKI_CONTROLLED_GITHUB_EXECUTOR_V0.md`) es puerta de verificación de alcance, NO ejecutor autónomo de correcciones.

**NO EVIDENCE = NO GREEN.** Ningún status de fase fue modificado por esta auditoría.
