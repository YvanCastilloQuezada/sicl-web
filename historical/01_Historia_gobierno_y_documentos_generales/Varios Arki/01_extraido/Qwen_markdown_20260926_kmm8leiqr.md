# ARKI-HARDENING-H002 — RED TEAM FINAL (10 ATAQUES)

## CONTEXTO
H-002 es un analizador de impacto WHAT-IF read-only construido sobre H-001 
(Derivation Integrity, 322 PASS). H-002 detecta dependencias transitivas 
cuando cambia una referencia versionada. NO ejecuta cambios, NO invalida, 
NO recomputa.

## CONTRATOS A ATACAR
- ImpactChange(before, after)
- ImpactPath[] (caminos explícitos)
- ImpactedArtifact (con identityStatus: VERIFIED | UNCERTAIN)
- ImpactReport (con identityUncertainArtifacts, cycles, failClosed)
- ImpactAnalyzer.analyze_dependency()
- ImpactAnalyzer.analyze_change()

## INVARIANTES QUE NO DEBEN ROMPERSE
- IMPACT DETECTED ≠ CHANGE EXECUTED
- PATH DISCOVERED ≠ CAUSAL EFFECT VERIFIED
- H-002 es read-only (ningún método de acción)
- Fail-closed, no truncamiento silencioso
- contractVersion = 1
- RC-01 a RC-07 (canonicalización de ciclos)
- F1-01 a F1-07 (identidad incierta)

## TU MISIÓN
Ejecutar los 10 ataques siguientes. Para cada uno:
1. Describir el escenario de ataque
2. Ejecutar contra el código real
3. Reportar: PASS (comportamiento esperado) o FAIL (vulnerabilidad encontrada)
4. Si FAIL: clasificar severidad (CRITICAL/HIGH/MEDIUM/LOW) y aportar contraejemplo reproducible
5. NO implementar correcciones. Solo atacar y reportar.

---

## LOS 10 ATAQUES

### RT-01: Grafo con 10,000 nodos y ciclos anidados
**Objetivo:** Path explosion, canonicalización incorrecta, hang/crash
**Escenario:**
- Crear grafo con 10,000 nodos
- Introducir 500 ciclos anidados
- Ejecutar analyzeImpact desde nodo raíz
**Esperado:** Fail-closed limpio con failClosedReason = 'MAX_PATHS_EXCEEDED'
**Qué buscar:**
- ¿Se cuelga el sistema?
- ¿Trunca silenciosamente?
- ¿Canonicaliza correctamente los ciclos?
- ¿Reporta todos los ciclos únicos sin duplicar?

---

### RT-02: Cambio G1@1(hashA) → G1@1(hashB) sin consumidores con hash
**Objetivo:** Gap F-1 (consumidores sin hash no encontrados)
**Escenario:**
- Registrar 100 consumidores de G1@1 SIN content_hash
- Ejecutar analyzeImpact sobre G1@1 con hash 'hB' (cambio)
**Esperado:** Los 100 consumidores aparecen en identityUncertainArtifacts
**Qué buscar:**
- ¿Se encuentran todos los consumidores sin hash?
- ¿Se marcan correctamente como UNCERTAIN?
- ¿uncertaintyReason = 'MISSING_CONTENT_HASH'?
- ¿identityUncertaintyCount = 100?

---

### RT-03: Output con 3 justificaciones independientes
**Objetivo:** Confusión entre justificaciones y paths causales
**Escenario:**
- Output O1 tiene 3 inputs: I1 (computacional), I2 (epistémico), I3 (arquitectónico)
- Ejecutar analyzeImpact sobre I1@1
**Esperado:** Paths separados por dominio relacional
**Qué buscar:**
- ¿Se confunden justificaciones epistémicas con paths computacionales?
- ¿relationDomains preserva la distinción?
- ¿Se reporta 1 path o 3 paths distintos?

---

### RT-04: Consulta WHAT-IF sobre proyecto inexistente
**Objetivo:** Contaminación cross-proyecto o crash
**Escenario:**
- Ejecutar analyzeImpact sobre proyecto 'PROYECTO_INEXISTENTE'
**Esperado:** Reporte vacío, sin error
**Qué buscar:**
- ¿Contamina otros proyectos?
- ¿Crash o excepción no manejada?
- ¿affectedArtifacts = []?

---

### RT-05: Cambio en nodo raíz con 50 niveles de profundidad
**Objetivo:** Stack overflow, timeout, truncamiento silencioso
**Escenario:**
- Crear cadena lineal de 50 niveles: N0 → N1 → N2 → ... → N50
- Ejecutar analyzeImpact sobre N0@1
**Esperado:** Resultado completo o fail-closed explícito
**Qué buscar:**
- ¿Stack overflow?
- ¿Timeout?
- ¿Trunca silenciosamente?
- ¿Reporta todos los 50 niveles o solo algunos?

---

### RT-06: Dos cambios simultáneos before1→after1 + before2→after2
**Objetivo:** Composición incorrecta de impactos
**Escenario:**
- Ejecutar analyze_change con dos cambios simultáneos
**Esperado:** Impactos separados o composición explícita
**Qué buscar:**
- ¿Se mezclan los impactos?
- ¿Se pierden paths de uno de los cambios?
- ¿affectedArtifacts contiene uniones incorrectas?

---

### RT-07: Ciclo con aristas de dominios mixtos
**Objetivo:** Colapso semántico, fingerprint incorrecto
**Escenario:**
- Ciclo A→B→C→A con aristas: DERIVED_FROM (computational), SUPPORTED_BY (epistemic), COMPUTED_FROM (arquitectónico)
**Esperado:** Dominios preservados en cycle.relationDomains
**Qué buscar:**
- ¿Se colapsan los dominios?
- ¿Fingerprint ignora la mezcla de dominios?
- ¿Se reporta como 1 ciclo o 3 ciclos?

---

### RT-08: content_hash ausente en productor pero presente en consumidor
**Objetivo:** Asimetría de identidad no manejada
**Escenario:**
- Productor G1@1 SIN content_hash
- Consumidor A1@1 CON content_hash que referencia G1@1
- Ejecutar analyzeImpact sobre G1@1
**Esperado:** UNCERTAIN con razón explícita
**Qué buscar:**
- ¿Se maneja la asimetría?
- ¿uncertaintyReason = 'VERSION_AMBIGUITY' o similar?
- ¿Se reporta en identityUncertainArtifacts?

---

### RT-09: Replay determinista — misma consulta 100 veces
**Objetivo:** No-determinismo en fingerprint o orden de artefactos
**Escenario:**
- Ejecutar analyzeImpact 100 veces sobre mismo grafo
**Esperado:** 100 resultados idénticos
**Qué buscar:**
- ¿Fingerprint varía entre ejecuciones?
- ¿Orden de affectedArtifacts cambia?
- ¿cyclesDetected varía?

---

### RT-10: Combinación — ciclo + cambio externo + path explosion simultáneos
**Objetivo:** Interacción de debilidades
**Escenario:**
- Grafo con 5,000 nodos
- 100 ciclos anidados
- Cambio en nodo raíz
- Límite max_paths_per_artifact = 10
**Esperado:** Fail-closed o reporte completo sin truncamiento
**Qué buscar:**
- ¿Se activan múltiples fail-closed?
- ¿Se pierden ciclos por truncamiento?
- ¿identityUncertainArtifacts se mezcla con impactedArtifacts?

---

## FORMATO DE REPORTE

| Ataque | Resultado | Severidad | Evidencia | Contraejemplo |
|--------|-----------|-----------|-----------|---------------|
| RT-01  | PASS/FAIL | CRITICAL/HIGH/MEDIUM/LOW | Log de ejecución | Código reproducible |
| RT-02  | PASS/FAIL | ... | ... | ... |
| ...    | ...       | ...       | ...       | ...           |

## REGLA
**No implementar. No corregir. Solo atacar y reportar.**