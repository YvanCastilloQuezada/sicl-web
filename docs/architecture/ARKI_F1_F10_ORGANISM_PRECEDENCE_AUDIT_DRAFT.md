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
