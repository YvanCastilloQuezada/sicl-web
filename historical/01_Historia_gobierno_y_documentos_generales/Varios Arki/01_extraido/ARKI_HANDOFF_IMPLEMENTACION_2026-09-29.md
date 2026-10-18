# HANDOFF OPERATIVO — ARKI/ARQUI
## Consolidación → Implementación del esqueleto, sistema nervioso y ciclo cognitivo
**Fecha de corte:** 29/09/2026  
**Human Authority / Product Owner:** Yvan Castillo  
**Estado:** implementación iniciada; arquitectura general consolidada; primeros commits especificados/auditados; ejecución física pendiente donde el acceso de escritura esté bloqueado.

---

## 1. PROPÓSITO DE ESTE HANDOFF

Continuar ARKI/ARQUI sin reiniciar discusiones ya cerradas.

ARKI (antes Vitruvio/SICL) debe convertirse en un **Super Arquitecto**: un sistema capaz de razonar, proponer, desarrollar, evaluar, corregir y representar arquitectura, preservando evidencia, UNKNOWN y Human Authority.

No se está construyendo un generador de imágenes ni una colección de módulos aislados.

Principio operativo actual:

**IMPLEMENTAR → TESTEAR → INSPECCIONAR → CORREGIR → CONTINUAR**

Los tests sirven para descubrir defectos durante el camino. No se debilitan para ocultar fallas.

---

## 2. CANON QUE NO DEBE ROMPERSE

1. **Un solo proyecto / una sola inteligencia arquitectónica.**
2. **D-2 es el estado arquitectónico canónico.** No crear segundo D-2.
3. **SICL es el ADN de ARKI**, no un órgano separado.
4. UI/frontend, Brain, D6.2, D6.3, Developer y representaciones NO son estados canónicos paralelos.
5. **D-2 sólo se muta desde Core**, mediante mecanismos controlados.
6. **Human Authority permanece explícita.**
7. **UNKNOWN es transversal.** Si falta evidencia, no inventar geometría, circulación, puertas, estructura, dimensiones, normativa ni relaciones.
8. **CLAIM ≠ IMPLEMENTED ≠ VERIFIED.**
9. **TEST GREEN ≠ corrección arquitectónica.**
10. **MODEL ONCE → REASON ONCE → REPRESENT MANY.**
11. No duplicar órganos existentes.
12. No ampliar módulos sólo por conveniencia técnica.
13. Generación y juicio deben permanecer distinguibles.
14. Parti no equivale a X/L/C/courtyard/massing; esas pueden ser manifestaciones geométricas.
15. El diseño es iterativo: función, espacio, geometría, contexto y restricciones se retroalimentan.
16. Las ideas pueden mutar, ser dominadas, rechazadas, quedar bloqueadas por UNKNOWN o requerir decisión humana.
17. Plaza Trujillo/UPAO Plaza Center queda fuera de este frente.

---

## 3. ARQUITECTURA CONSOLIDADA

Tres backbones prioritarios:

### A. CUERPO
**D-2 / estado arquitectónico canónico**

Contiene la arquitectura que realmente ha sido aceptada/publicada, con identidad, geometría restringida, propiedades, versión y relaciones controladas.

### B. SISTEMA NERVIOSO
**Derivation → Impact → Validity → Reaction → Recomputation → Event Store**

Debe explicar:
- de dónde salió algo;
- qué depende de qué;
- qué cambia cuando cambia una dependencia;
- qué queda inválido/UNKNOWN;
- qué debe recomputarse;
- qué requiere revisión/autoridad.

### C. CICLO COGNITIVO
**Encargo/Contexto → Project Brain → D6.2 → Synthesis/Parti → D6.3 → Architectural Developer → Human Review → D-2**

Developer no es un segundo cerebro ni un segundo estado canónico. Es un proceso controlado de desarrollo/mutación de propuestas.

Después de D-2:
**D-2 → ARE/Spatial Representation → ARKI-DRAW → SVG/PDF/IFC/otras representaciones.**

---

## 4. REPOSITORIOS Y BASELINES OBSERVADOS

### sicl-core
Repositorio: `YvanCastilloQuezada/sicl-core`  
Branch auditada: `main`  
HEAD observado durante auditoría: `71e72bb1abfb217bf4854f464ae443764281f469`

### sicl-web
Repositorio: `YvanCastilloQuezada/sicl-web`  
Branch auditada: `main`  
HEAD observado durante auditoría: `69ff2ad2f7537dd5b752ec8dce90f7c27d5ec3f6`

**Regla:** reconsultar HEAD antes de cualquier mutación. No asumir que estos SHA siguen siendo actuales.

---

## 5. ESTADO TÉCNICO VERIFICADO

### sicl-web
CI observado verde en el baseline auditado:
- `pnpm check`: OK
- 96 archivos de test
- 434 tests
- build: OK

Esto prueba consistencia del repo web, NO integración cross-repo completa ni calidad arquitectónica.

### sicl-core
CI observado rojo por dependencia:
- Python 3.11: falla en collection por `ModuleNotFoundError: reportlab`
- Python 3.12: cancelado

La falla proviene de `src/sicl/drawing/pdf_export.py`, que importa ReportLab en carga de módulo.

`pyproject.toml` real:

```toml
[project]
dependencies = ["jsonschema>=4,<5"]

[project.optional-dependencies]
test = ["pytest>=8,<9", "ifcopenshell>=0.8.5,<1"]
api = ["fastapi>=0.110", "uvicorn>=0.29", "httpx>=0.27", "python-multipart>=0.0.9,<1"]
```

CI instala:

```bash
python -m pip install -e '.[test,api]'
python -m pytest -ra
python -m compileall -q src api tests
```

Fix mínimo identificado:

```diff
-test = ["pytest>=8,<9", "ifcopenshell>=0.8.5,<1"]
+test = ["pytest>=8,<9", "ifcopenshell>=0.8.5,<1", "reportlab>=4,<5"]
```

No añadir `pypdf` sin evidencia: `pdf_export.py` inspeccionado no lo requiere.

La escritura desde el conector GitHub quedó bloqueada, por lo que **no declarar Commit 1 aplicado ni CI verde hasta verificarlo realmente**.

---

## 6. COMMIT 2 — D6.3: DEFECTO SEMÁNTICO CONFIRMADO

Archivo real:
`server/arkiD63GeometricBridge.ts`

Blob observado:
`ff78600ab0398e1cc1ceec486a6b3d4e4cd4fbbb`

Dos problemas confirmados:

### Problema A — falso canon
D6.3 produce hipótesis pero contiene:

```ts
metadata: {
  source,
  semanticStatus: "HYPOTHESIS",
  canonical: true
}
```

Debe dejar de presentarse como canonical. D6.3 no es D-2.

### Problema B — gate G12 falso
Declara:

```ts
G12_NO_TEMPLATE_HARDCODING: "PASS"
```

pero contiene coordenadas/dimensiones hardcodeadas para candidatos A/B.

El tipo actual del gate sólo admite:

```ts
"PASS" | "FAIL" | "UNKNOWN"
```

Por tanto, mientras exista hardcoding, la corrección semánticamente limpia es:

```ts
G12_NO_TEMPLATE_HARDCODING: "FAIL"
```

No introducir `PARTIAL` sólo para suavizar el resultado.

---

## 7. COMMIT 3 — TYPEDRELATION: DECISIÓN ACTUAL

Archivo auditado:
`src/sicl/derivation.py`

Blob:
`673b5752969f2db24b5cb42203db79e414aa74dc`

Contrato actual:

```python
RELATION_DOMAINS = frozenset({
    "ARCHITECTURAL",
    "COMPUTATIONAL",
    "EPISTEMIC",
    "NORMATIVE",
    "GOVERNANCE"
})

RELATION_TYPES = frozenset({
    "DERIVED_FROM",
    "COMPUTED_FROM",
    "SUPPORTED_BY"
})
```

`DerivationRecord` exige una relación `output → input` por cada input. Esto hace que H-001 sea deliberadamente un sistema de derivación/provenance, NO un grafo arquitectónico libre.

DeepSeek auditó y detectó correctamente que relaciones como:
- ADJACENT_TO
- CONNECTS_TO
- CONTAINS
- SERVES
- PART_OF
- BOUNDS
etc.

no son derivaciones.

Sin embargo, DeepSeek propuso extender `TypedRelation` para usarlas fuera de `DerivationRecord`.

### DECISIÓN ACTUAL DE RED TEAM

**NO autorizar todavía esa extensión.**

Razón: `src/sicl/archi/relationships.py` ya posee relaciones arquitectónicas como `HOSTED_IN` y `BOUNDS`. Antes de tocar H-001 hay que auditar completamente ese sistema.

Separación conceptual:

**H-001 / Derivation = causalidad, provenance y explicación de por qué existe algo.**

**Architectural Relationships = cómo se relacionan arquitectónicamente las cosas entre sí.**

No convertir H-001 en un grafo universal sólo para reutilizar una dataclass.

Mantener `DerivationRecord` intacto.

Próxima acción para Commit 3:
**auditar `src/sicl/archi/relationships.py` y decidir la mínima extensión correcta del sistema arquitectónico de relaciones.**

---

## 8. ÓRGANOS EXISTENTES QUE NO DEBEN DUPLICARSE

Ya existen y deben reutilizarse donde corresponda:

- D-2 / ArchiElement
- VersionedRef
- TypedRelation
- DerivationRecord / DerivationLedger
- ImpactAnalyzer
- ValidityAnalyzer
- ReactionPlanner
- Selective Recomputation
- A-002
- ArchiTransaction
- Event Store append-only
- generación/optimización existentes
- Pareto
- memoria
- design knowledge
- site intelligence base
- SpatialRepresentation / ARE
- lineage/freshness de representación
- ARKI-DRAW
- IFC
- Human Review / Decision API
- Funnel selection contract

Regla:
**REUSE → COMPOSE → EXTEND → NEW**

---

## 9. GAPS PRINCIPALES OBSERVADOS

La cadena deseada es:

```text
ENCARGO
  ↓
PROJECT BRAIN
  ↓
D6.2 REASONING
  ↓
SYNTHESIS / PARTI
  ↓
D6.3 GEOMETRIC HYPOTHESIS
  ↓
ARKI ARCHITECTURAL DEVELOPER
  ↓
HUMAN REVIEW
  ↓
D-2 CANONICAL
  ↓
ARE / REPRESENTATION
  ↓
ARKI-DRAW / SVG / PDF / IFC
```

Gaps/defectos principales observados:
- dependencia ReportLab rompe baseline core;
- D6.3 afirma `canonical:true` siendo hipótesis;
- D6.3 declara G12 PASS pese a hardcoding;
- falta puente general Developer → D-2;
- web intenta POST de reasoning-executions pero Core no tenía ruta equivalente observada;
- riesgo de que web ProjectState sea interpretado como segundo estado;
- falta binding robusto propuesta/revisión/promoción para impedir sustitución de payload;
- CASE-001 sirve como fixture downstream, no como prueba de síntesis arquitectónica;
- no hay todavía demostración E2E completa de encargo → razonamiento → desarrollo → D-2 → representación.

---

## 10. DEVELOPER — CONTRATO OBJETIVO

Architectural Developer debe producir propuestas, NO mutar D-2 directamente.

Contrato V1 debe quedar preparado para iteración y genealogía, incluyendo conceptos equivalentes a:

```text
proposalId
parentProposalId
sourceExecutionId / sourceD63
fingerprint
mutation
rejectedBecause
feedbackLoops
unknowns
provenance
reviewRequired
```

V1 puede ser reducido, pero no debe bloquear la evolución posterior.

La promoción debe ser Core-owned:
1. persistir propuesta exacta;
2. calcular fingerprint;
3. Human Review referencia proposalId/fingerprint;
4. Core recupera propuesta persistida;
5. Core verifica identidad/fingerprint;
6. A-002/authority/sufficiency aplican;
7. ArchiTransaction controla mutación;
8. sólo entonces cambia D-2.

Nunca confiar en un payload arbitrario enviado desde web como si fuera la propuesta aprobada.

---

## 11. REASONING EXECUTIONS — CONTRATO OBJETIVO

No crear segunda base ni segundo ledger.

Usar Event Store append-only.

Concepto esperado:
- `execution_id` estable
- `kind` allowlist, por ejemplo:
  - PROJECT_BRAIN
  - D6_2
  - D6_3
  - DEVELOPER_PROPOSAL
- fingerprint
- payload
- epistemic/semantic status
- human authority reference cuando corresponda
- source refs/provenance

Evento propuesto conceptualmente:
`REASONING_EXECUTION_RECORDED`

Source:
`ARKI_REASONING`

Reglas:
- registrar reasoning ≠ mutar D-2;
- registrar evento ≠ incrementar automáticamente versión de proyecto;
- reasoning history es append-only;
- no declarar canon;
- no auto-promover.

---

## 12. PRUEBAS QUE DEBEN EJECUTARSE

### FASE A — recuperar baseline Core

Después de aplicar ReportLab:

```bash
python -m pip install -e '.[test,api]'
python -m pytest -ra
python -m compileall -q src api tests
```

Verificar específicamente drawing/RFC030 y ausencia de nuevas fallas.

**Resultado requerido:** CI core verde antes de atribuir regresiones a nuevos commits.

### FASE B — D6.3 semantic truth

Tests deben demostrar:
- `semanticStatus == HYPOTHESIS`
- `canonical != true`
- hardcoded geometry ⇒ `G12_NO_TEMPLATE_HARDCODING == FAIL`
- no D-2 mutation
- determinismo/fingerprint donde aplique

### FASE C — relaciones

Antes de implementar nuevas relaciones:
- regresión completa de `archi/relationships.py`;
- verificar qué expresa realmente `RelationshipKind`;
- verificar dirección/simetría;
- verificar persistencia;
- verificar integración con D-2;
- demostrar con test cada insuficiencia antes de crear un nuevo relation kind.

### FASE D — reasoning endpoint

Tests mínimos:
- acepta kind permitido;
- rechaza kind desconocido;
- fingerprint determinista;
- idempotencia si corresponde;
- persistencia real en Event Store;
- lectura posterior devuelve exactamente lo persistido;
- registrar reasoning NO cambia D-2;
- registrar reasoning NO incrementa versión canónica por sí solo;
- payload inválido falla cerrado.

### FASE E — Developer Proposal

Tests mínimos:
- D6.3 → DeveloperProposal conserva provenance;
- UNKNOWN permanece UNKNOWN;
- no inventa geometría ausente;
- proposal tiene fingerprint estable;
- parentProposalId permite genealogía;
- Developer no muta D-2;
- propuestas rechazadas conservan causa.

### FASE F — promoción

Tests críticos:
- Human Review de proposal A no puede promover proposal B;
- fingerprint alterado ⇒ rechazo;
- proposal inexistente ⇒ rechazo;
- falta autoridad ⇒ rechazo/needs review;
- falta evidencia bloqueante ⇒ fail closed;
- sólo Core ejecuta D-2 mutation;
- mutación aprobada genera trazabilidad completa.

### FASE G — microcaso explícito

Usar un caso pequeño con geometría de entrada explícita.

No permitir que el test “pase” porque el sistema inventó:
- dimensiones;
- puertas;
- accesos;
- estructura;
- niveles;
- relaciones.

El microcaso prueba la cadena mecánica, no que ARKI ya sea un gran arquitecto.

### FASE H — downstream

Después de promover D-2:
- ARE deriva del D-2 correcto;
- ARKI-DRAW consume representación vigente;
- SVG/PDF se generan;
- IFC exporta;
- lineage/freshness detectan representación obsoleta;
- CASE-001 puede reutilizarse como fixture downstream.

---

## 13. PRUEBAS DE ARQUITECTURA, NO SÓLO UNIT TESTS

Cuando la cadena mecánica esté verde, ejecutar pruebas de comportamiento arquitectónico.

### Prueba 1 — UNKNOWN
Dar programa incompleto y verificar que ARKI pregunta/bloquea donde corresponda en lugar de completar datos silenciosamente.

### Prueba 2 — cambio causal
Cambiar una restricción del encargo y comprobar:
`dependency → impact → validity → reaction → recomputation/review`.

### Prueba 3 — función vs forma
Introducir una forma atractiva que viole circulación/programa. El sistema debe detectar el conflicto; no premiar apariencia sobre funcionamiento.

### Prueba 4 — backtracking
Forzar una solución inicialmente válida que falle por una restricción posterior. ARKI debe poder mutar/rechazar y conservar genealogía.

### Prueba 5 — Human Authority
El usuario rechaza una propuesta técnicamente válida. El rechazo debe preservarse sin que el sistema la auto-promueva después.

### Prueba 6 — representación
Modificar D-2 y comprobar que una representación previa se marca stale/obsoleta y no se presenta como vigente.

---

## 14. ORDEN DE IMPLEMENTACIÓN RECOMENDADO

1. Recuperar CI core / ReportLab.
2. Corregir verdad semántica D6.3.
3. Cerrar auditoría de `archi/relationships.py`; no contaminar H-001.
4. Implementar reasoning-executions reutilizando Event Store.
5. Definir ownership map explícito.
6. Implementar Developer Proposal DTO/contrato.
7. Persistir propuesta + fingerprint.
8. Implementar Human Review binding.
9. Implementar promoción Core-owned a D-2.
10. Ejecutar microcaso explícito E2E.
11. Reusar CASE-001 downstream.
12. Sólo después aumentar complejidad/generación/poblaciones.

El número exacto de commits NO es sagrado. Deben ser pequeños, coherentes, reversibles y testeados.

---

## 15. QUÉ PUEDE CAMBIAR SIN CONSULTAR A YVAN

Decisiones técnicas rutinarias que preserven el canon:
- nombres internos menores;
- organización de tests;
- helpers;
- refactors locales;
- implementación equivalente más limpia;
- adaptación a estructuras reales del repo;
- corrección de errores encontrados por tests.

No detenerse por burocracia.

---

## 16. CUÁNDO ESCALAR A YVAN

Escalar sólo si aparece:
- contradicción cognitiva real;
- decisión arquitectónica que pertenece a Human Authority;
- riesgo de segundo estado canónico;
- pérdida de provenance/evidencia;
- fabricación de UNKNOWN;
- cambio de principio del sistema;
- contradicción estructural con la arquitectura consolidada.

No pedirle decisiones técnicas que el equipo puede resolver.

---

## 17. PROTOCOLO DE REPORTE

Para cada fase/commit:

```text
CAMBIO
- qué se modificó
- repo/branch/SHA

TESTS
- comandos reales
- passed/failed/skipped

RESULTADO
- qué quedó funcionando realmente

HALLAZGO
- defecto nuevo o divergencia encontrada

SIGUIENTE
- siguiente acción concreta
```

Para repo touches:

```text
RECIBIDO
ENTREGADO
DIVERGENCIA: NO / SÍ
FALTA: NADA / SÍ
```

No declarar “implementado”, “integrado” o “verificado” sin evidencia correspondiente.

---

## 18. INFORMES QUE YVAN ADJUNTARÁ AL NUEVO CHAT

Yvan adjuntará los informes de auditoría/consolidación previos.

Usarlos como evidencia histórica y técnica, pero contrastar cualquier estado mutable contra repositorios actuales antes de actuar.

Especialmente relevantes:
- auditoría profunda de ARKI;
- auditoría Cut 2;
- consolidado Esqueleto + Sistema Nervioso;
- respuestas/consolidaciones de DeepSeek;
- auditoría TypedRelation recién producida.

No reiniciar desde cero ni volver a debatir principios ya consolidados salvo contradicción demostrada.

---

## 19. PRIMERA ACCIÓN DEL NUEVO CHAT

1. Leer este handoff y los informes adjuntos.
2. Reconsultar HEAD de `sicl-core` y `sicl-web`.
3. Verificar si Commit 1/ReportLab y Commit 2/D6.3 fueron realmente aplicados.
4. Si no: ejecutarlos/coordinar ejecución y correr tests.
5. Recuperar y auditar `src/sicl/archi/relationships.py`.
6. Entregar a DeepSeek los archivos reales que solicite (`routes/v1.py`, `schemas.py`, etc.) sin hacer que Yvan los busque.
7. Continuar Commit 3/4 siguiendo el orden anterior.
8. Mantener el ciclo:
   **BUILD → TEST → INSPECT → CORRECT → CONTINUE.**

---

# MENSAJE DE ARRANQUE PARA EL NUEVO CHAT

**Continuamos ARKI/ARQUI desde implementación, no desde ideación. Lee el handoff y los informes adjuntos como contexto de continuidad. Revalida los HEAD actuales antes de tocar código. No crees segundo D-2, segundo estado, segundo ledger ni segundo cerebro. Reutiliza órganos existentes. Recupera primero baseline Core, corrige D6.3, cierra la auditoría de relaciones arquitectónicas y continúa con reasoning-executions, Developer Proposal y promoción Core-owned. Si DeepSeek pide archivos reales del repositorio, recupéralos tú y entrégamelos listos para reenviar. No me conviertas en operador técnico. Implementar → testear → inspeccionar → corregir → continuar.**
