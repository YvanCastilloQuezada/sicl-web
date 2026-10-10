# AV-UI-001 — Árbol Vivo · Preparación de la pantalla única

**Estado:** PREPARATION_ONLY · NOT_IMPLEMENTED · NOT_CANONICAL · NOT_AUTHORIZED_FOR_MERGE  
**Fecha:** 2026-10-10  
**Rama de trabajo:** `docs/av-ui-001-preparation-20261010`  
**Baseline de consulta:** `feat/m001-e3-gate-hardening`  
**Autoridad:** propuesta técnica, no decisión canónica.  
**Restricciones:** NO MERGE · NO FREEZE MUTATION · NO CANONICAL PROMOTION · NO CLAIM WITHOUT EVIDENCE.

## 1. Objetivo

Una sola pantalla de gobierno del sistema ARKI: izquierda = memoria y hechos acreditados; centro = árbol vertical F1 (base) → F10 (copa), con ramas de déficits/mejoras; derecha = propuestas, pruebas, métricas y decisiones del propietario.

Una selección de fase o rama sincroniza los tres paneles. El tronco F1–F10 representa fases, **no** presupone que F1 deba estar terminada por completo antes de iniciar toda F10. Cada rama se bloquea exclusivamente por sus **antecedentes obligatorios acreditados**.

## 2. Inventario de funciones existentes, inspeccionadas estáticamente

Archivo: `tools/maqueta-viva/maqueta-viva.template.html`.

| Función | Responsabilidad actual | Uso propuesto |
| --- | --- | --- |
| `render()` | Compone paneles izquierdo, centro y derecho | Mantener composición de tres columnas |
| `informationRail()` | Información contextual de selección | Memoria de fase/rama, evidencias y FROZEN |
| `decisionCockpit()` / `structure()` | Vista ejecutiva y estructura | Árbol F1–F10 y ramas seleccionables |
| `rightPanel()` | Panel lateral contextual | Bandeja de propuestas y decisiones |
| `arkiDependencyTopology()` | Dependencias explícitas en `reviews[id].dependencies`, ciclos y referencias ausentes | Grafo inicial, sin inventar relaciones |
| `arkiConstructionWaves()` | Orden de investigación, retención por ciclos, ausencias, FROZEN y predecesores bloqueados | Planificación local, **no** autorización de ejecución |
| `arkiDecisionDocket()` | Propuestas, evidencias y prioridades | Bandeja de decisión, sin equivalencia con aceptación canónica |
| `buildUnifiedTraceGraph()` | Proyección de nodos y aristas | Trazabilidad y proveniencia de la interfaz |

Inspección estática confirmada en el archivo; **no** implica pruebas de navegador, E3 o aceptación funcional.

## 3. Modelo de selección único

`selection = { kind: 'PHASE' | 'BRANCH', id, phaseId }`

- Seleccionar F2 muestra exclusivamente datos atribuibles a F2 en ambos paneles.
- Seleccionar una rama conserva su fase y muestra antecedentes directos/transitivos con proveniencia.
- Sin selección válida: árbol completo y mensaje contextual, nunca inventar estado.
- `viewScope`, `treePhaseId`, `activePhase` y `selected` actuales requieren reconciliación antes de implementar para evitar dos fuentes de selección.

## 4. Semántica de estado: tres dimensiones independientes

1. **Madurez:** IDEA, RESEARCH, DEVELOPMENT, TESTING, VERIFIED, FROZEN (FROZEN es protección, no sinónimo de madurez técnica).
2. **Preparación:** RESEARCH_READY, VALIDATION_READY, PROMOTION_READY, BLOCKED, UNKNOWN. No asignar PROMOTION_READY sin evidencias suficientes y autorización específica.
3. **Autoridad de evidencia:** CLAIM, IMPLEMENTED, EXECUTED, VERIFIED, FROZEN; `PASS_WEB_ONLY` no equivale a aceptación canónica.

La señal de atención de una rama y las aristas de precedencia usan semánticas visuales diferentes. Antecedentes hipotéticos se representan distintos de antecedentes verificados. No pintar de verde basándose en fichas locales completas.

## 5. Reglas de dependencia

- Precedencia entre **ramas/capacidades**, no orden total entre fases.
- Propagación hacia atrás: reconstruir requisitos de una propuesta F10 hasta F1 si corresponde.
- Propagación hacia delante: identificar dependientes afectados cuando cambia un antecedente.
- Ciclos: bloquear promoción y abrir expediente de corrección.
- Referencias ausentes: bloquear promoción y marcar UNKNOWN; no asumir inexistencia de dependencia.
- FROZEN: consulta permitida; mutación prohibida sin procedimiento y autorización explícita.
- La falta de dependencias **declaradas** no prueba ausencia de dependencias reales.
- Las oleadas actuales solo programan investigación hipotética; no ejecutan cambios.

## 6. Política de la bandeja derecha

Toda propuesta debe mostrar: ID estable, fase/rama, origen, baseline, antecedentes, pruebas ejecutadas, métricas con unidades y denominador, incertidumbre, riesgos, impactos directos/transitivos, estado de auditoría, alcance FROZEN y acciones permitidas.

Estados de decisión separados: PROPOSED → UNDER_REVIEW → APPROVED_FOR_PREPARATION → AUTHORIZED_FOR_EXECUTION → EXECUTED → VERIFIED → CANONICALLY_ACCEPTED, con registros de autoridad. No inferir transiciones a partir de clics o flags de UI.

Sin evidencia atribuible: `NO_RESULT`, sin porcentaje inventado. El botón de promoción se mantiene deshabilitado.

## 7. Política del panel izquierdo

Mostrar por separado:
- decisiones aprobadas (no equivalen a código ejecutado);
- capacidades implementadas;
- capacidades verificadas y evidencia SHA/job/test;
- FROZEN con alcance y candado;
- ideas e historial local diferenciados de verdad canónica;
- antecedentes satisfechos y pendientes.

## 8. Evidencia externa reciente, con límites

Expediente facilitado por el propietario: PR #52, HEAD `ddb248afd179bae4e35a47916141c934f189dee7`; workflow `38023258522`, Web CI `38023258687`. Consultas de GitHub confirman ambos workflows SUCCESS; 12 jobs de evidencia SUCCESS. Dictamen aportado por el usuario: `RT-PR52-E3-001 = PARTIAL / PENDING_CANONICAL_ACCEPTANCE`; merge candidate `5b054fc59a4838664e6afb7f43ac0a55b63c51ff` no ejecutado en ese paquete. **No merge, no FREEZE, no tag, no promoción.**

Los cuatro casos adversariales F10→F1 incompleta, F2↔F6, referencias inexistentes y FROZEN fueron reportados como ya realizados por el propietario; **no duplicar ejecución sin motivo**, pero recuperar IDs de tests y resultados específicos antes de usarlos como evidencia de aceptación de AV-UI-001.

## 9. Secuencia implementable, pendiente de autorización

A. Unificar selección en el frontend sin alterar estado canónico.  
B. Representar tronco vertical y ramas reales con accesibilidad de teclado.  
C. Conectar panel izquierdo a registros existentes y autoridad de procedencia.  
D. Conectar panel derecho a `arkiDecisionDocket()` sin crear autorización ficticia.  
E. Añadir indicadores de bloqueo y propagación a partir del grafo existente.  
F. Validar navegación, estados vacíos, ciclos, ausencias, FROZEN y no promoción; CI y auditoría independientes.

**Criterio de aceptación:** selección coherente entre tres paneles, ninguna transición canónica por UI, no false-green, sin regresiones E3, accesibilidad básica, evidencia exacta de pruebas. No se declara cumplido hasta ejecución y auditoría.

## 10. Registro de decisiones y límites

- `DEC-AV-001`: preparación conceptual de propagación de impactos; **implementación y promoción no autorizadas**.
- Este documento es un artefacto de preparación aislado. No modifica `maqueta-viva.template.html` ni contratos FROZEN.
- Cualquier PR, merge, implementación o promoción posterior exige autorización conforme al procedimiento correspondiente.
