# SiMS-DeI 2.2 — Informe de 10 demostraciones multiescala

**Ejecución:** CLI real del Core, no frontend simulado  
**Baseline:** `sicl-core@352efe6b7716ab16246fb6bfa5ad8cd02b277775`  
**Resultado global:** **10/10 PASS**, 0 FAIL  
**Tiempo total:** 0.337 s  
**Base de datos:** `/tmp/sims-dei-10-demo-results/sims-dei-10.sqlite`

## Alcance y transparencia

La orden adjunta describe diez proyectos, pero el archivo recibido termina en el inicio del proyecto 9 y no contiene comandos ejecutables ni proyecto 10. Para producir una demostración reproducible se usó la orden previa de sintaxis corregida para los proyectos 1–9 y se añadió un caso 10 sintético. El caso 10 está marcado como complementario. Por ello, este informe demuestra el funcionamiento del Core y de sus contratos reales, pero no debe presentarse como ejecución literal de todos los datos narrativos de la orden adjunta.

Se hicieron dos correcciones reales durante la ejecución del caso complementario: `multiscale` no es un `spatial_scope` válido y `estrategia_2050` no es un `temporal_scope` válido. El Core devolvió ambos errores explícitamente. La corrida final se repitió con `pais` y `escenario_2050`, usando una base SQLite limpia.

## Resumen de resultados

| # | Proyecto | Escala | Tiempo | Comandos | Entidades principales | Resultado |
|---:|---|---|---:|---:|---|---|
| 1 | LAMP-001 | objeto / proyecto | 0.0343 s | 20 | Facts 1, Assumptions 0, Evidence 1, Objectives 1, Constraints 1, Alternatives 2, Evaluations 2, Comparisons 1, Simulations 1, Pareto 0, HumanReview 1, Decision 1 | **PASS** |
| 2 | ROOM-001 | espacio / proyecto | 0.0256 s | 20 | Facts 1, Assumptions 0, Evidence 1, Objectives 1, Constraints 1, Alternatives 2, Evaluations 2, Comparisons 1, Simulations 1, Pareto 0, HumanReview 1, Decision 1 | **PASS** |
| 3 | BUILD-001 | edificio / proyecto | 0.022 s | 20 | Facts 1, Assumptions 0, Evidence 1, Objectives 1, Constraints 1, Alternatives 2, Evaluations 2, Comparisons 1, Simulations 1, Pareto 0, HumanReview 1, Decision 1 | **PASS** |
| 4 | SITE-001 | parcela_sitio / proyecto | 0.023 s | 20 | Facts 1, Assumptions 0, Evidence 1, Objectives 1, Constraints 1, Alternatives 2, Evaluations 2, Comparisons 1, Simulations 1, Pareto 0, HumanReview 1, Decision 1 | **PASS** |
| 5 | BARRIO-001 | barrio_sector / mediano_plazo | 0.0571 s | 20 | Facts 1, Assumptions 0, Evidence 1, Objectives 1, Constraints 1, Alternatives 2, Evaluations 2, Comparisons 1, Simulations 1, Pareto 0, HumanReview 1, Decision 1 | **PASS** |
| 6 | CIUDAD-001 | ciudad_distrito / largo_plazo | 0.0323 s | 23 | Facts 1, Assumptions 0, Evidence 1, Objectives 2, Constraints 1, Alternatives 2, Evaluations 4, Comparisons 1, Simulations 0, Pareto 1, HumanReview 1, Decision 1 | **PASS** |
| 7 | METRO-001 | provincia_metropoli / escenario_2030 | 0.0389 s | 23 | Facts 1, Assumptions 0, Evidence 1, Objectives 2, Constraints 1, Alternatives 2, Evaluations 4, Comparisons 1, Simulations 0, Pareto 1, HumanReview 1, Decision 1 | **PASS** |
| 8 | REGION-001 | region / escenario_2040 | 0.0271 s | 21 | Facts 1, Assumptions 0, Evidence 1, Objectives 2, Constraints 1, Alternatives 2, Evaluations 4, Comparisons 1, Simulations 0, Pareto 1, HumanReview 1, Decision 1 | **PASS** |
| 9 | PAIS-001 | pais / escenario_2050 | 0.0337 s | 23 | Facts 1, Assumptions 0, Evidence 1, Objectives 2, Constraints 1, Alternatives 2, Evaluations 4, Comparisons 1, Simulations 0, Pareto 1, HumanReview 1, Decision 1 | **PASS** |
| 10 | MULTI-001 | pais / escenario_2050 | 0.0332 s | 25 | Facts 2, Assumptions 1, Evidence 2, Objectives 2, Constraints 2, Alternatives 2, Evaluations 4, Comparisons 1, Simulations 0, Pareto 1, HumanReview 1, Decision 1 | **PASS** |

## Detalle de cada corrida

### Corrida 1 — LAMP-001

**Descripción del caso:** OBJETO (LAMP-001) ===
**Fuente:** orden-189-sintaxis-corregida
**Estado:** **PASS**
**Comandos ejecutados:** 20; **fallos:** 0; **tiempo:** 0.0343 s

#### Snapshot persistido

| Campo | Resultado |
|---|---|
| `project_id` | `LAMP-001` |
| `name` | `Lámpara de escritorio articulada` |
| `spatial_scope` | `objeto` |
| `temporal_scope` | `proyecto` |
| `stage` | `DRAFT` |
| `version` | `19` |
| `facts` | `1` |
| `assumptions` | `0` |
| `evidence` | `1` |
| `objectives` | `1` |
| `constraints` | `1` |
| `alternatives` | `2` |
| `evaluations` | `2` |
| `comparisons` | `1` |
| `simulations` | `1` |
| `multiobjectives` | `0` |
| `human_reviews` | `1` |
| `decisions` | `1` |
| `events` | `19` |

#### Salida exacta por comando

**1.** `$ /PROJECT CREATE LAMP-001 "Lámpara de escritorio articulada" objeto proyecto`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "project_id": "LAMP-001",
    "name": "Lámpara de escritorio articulada",
    "stage": "DRAFT",
    "version": 1,
    "objectives": {},
    "constraints": {},
    "roles": {},
    "actors": {},
    "positions": {},
    "temporal_cycles": {},
    "scenario_branches": {},
    "scenario_evolutions": {},
    "facts": {},
    "assumptions": {},
    "preferences": {},
    "decisions": {},
    "human_reviews": {},
    "alternatives": {},
    "evaluations": {},
    "comparisons": {},
    "recommendations": {},
    "evidence": {},
    "sources": {},
    "simulations": {},
    "multiobjective_results": {},
    "generated_alternatives": {},
    "planning_instruments": {},
    "regulations": {},
    "interpretations": {},
    "normative_snapshots": {},
    "spatial_scope": "objeto",
    "temporal_scope": "proyecto",
    "scale_relations": {}
  }
}
```

**2.** `$ /PROJECT OPEN LAMP-001`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "project_id": "LAMP-001",
    "name": "Lámpara de escritorio articulada",
    "stage": "DRAFT",
    "version": 1,
    "objectives": {},
    "constraints": {},
    "roles": {},
    "actors": {},
    "positions": {},
    "temporal_cycles": {},
    "scenario_branches": {},
    "scenario_evolutions": {},
    "facts": {},
    "assumptions": {},
    "preferences": {},
    "decisions": {},
    "human_reviews": {},
    "alternatives": {},
    "evaluations": {},
    "comparisons": {},
    "recommendations": {},
    "evidence": {},
    "sources": {},
    "simulations": {},
    "multiobjective_results": {},
    "generated_alternatives": {},
    "planning_instruments": {},
    "regulations": {},
    "interpretations": {},
    "normative_snapshots": {},
    "spatial_scope": "objeto",
    "temporal_scope": "proyecto",
    "scale_relations": {}
  }
}
```

**3.** `$ /FACT SET "La altura de escritorio estándar es 75 cm" ERGONOMIA`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "fact_id": "FACT-198293fd80",
    "project_id": "LAMP-001",
    "statement": "La altura de escritorio estándar es 75 cm",
    "source": "ERGONOMIA",
    "version": 1
  }
}
```

**4.** `$ /EVIDENCE ADD EVD-L001 "El brazo debe cubrir 60 cm de radio" OBSERVATION`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evidence_id": "EVD-L001",
    "project_id": "LAMP-001",
    "source_id": null,
    "statement": "El brazo debe cubrir 60 cm de radio",
    "evidence_type": "OBSERVATION",
    "captured_at": "2026-09-16 18:06:10.566666+00:00",
    "method_version": "CLI/1.0",
    "evidence_url": null,
    "evidence_hash": "0b0c249fea7839e273863044f25e2144b65a7b3ed0c6ef4920ec81c686cfefe2",
    "state": "OBSERVED",
    "version": 1
  }
}
```

**5.** `$ /OBJECTIVE SET ERGONOMIA MAXIMIZE 90`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "objective_id": "OBJ-81afc39596",
    "project_id": "LAMP-001",
    "key": "ERGONOMIA",
    "direction": "MAXIMIZE",
    "value": "90",
    "version": 1,
    "source_parent_objective_id": null
  }
}
```

**6.** `$ /CONSTRAINT SET PESO <= 2 KG`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "constraint_id": "CON-26ad4592a0",
    "project_id": "LAMP-001",
    "key": "PESO",
    "operator": "<=",
    "value": "2",
    "unit": "KG",
    "hard": true,
    "version": 1
  }
}
```

**7.** `$ /ALTERNATIVE CREATE LAMP-A`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-52308b59c6",
    "project_id": "LAMP-001",
    "name": "LAMP-A",
    "description": "",
    "parameters": {},
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**8.** `$ /ALTERNATIVE SET LAMP-A material aluminio`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-52308b59c6",
    "project_id": "LAMP-001",
    "name": "LAMP-A",
    "description": "",
    "parameters": {
      "material": "aluminio"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**9.** `$ /ALTERNATIVE SET LAMP-A joints 2`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-52308b59c6",
    "project_id": "LAMP-001",
    "name": "LAMP-A",
    "description": "",
    "parameters": {
      "material": "aluminio",
      "joints": "2"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**10.** `$ /ALTERNATIVE SET LAMP-A weight 1.8`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-52308b59c6",
    "project_id": "LAMP-001",
    "name": "LAMP-A",
    "description": "",
    "parameters": {
      "joints": "2",
      "material": "aluminio",
      "weight": "1.8"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**11.** `$ /ALTERNATIVE CREATE LAMP-B`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-8683afb8dd",
    "project_id": "LAMP-001",
    "name": "LAMP-B",
    "description": "",
    "parameters": {},
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**12.** `$ /ALTERNATIVE SET LAMP-B material aluminio`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-8683afb8dd",
    "project_id": "LAMP-001",
    "name": "LAMP-B",
    "description": "",
    "parameters": {
      "material": "aluminio"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**13.** `$ /ALTERNATIVE SET LAMP-B joints 3`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-8683afb8dd",
    "project_id": "LAMP-001",
    "name": "LAMP-B",
    "description": "",
    "parameters": {
      "material": "aluminio",
      "joints": "3"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**14.** `$ /ALTERNATIVE SET LAMP-B weight 1.6`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-8683afb8dd",
    "project_id": "LAMP-001",
    "name": "LAMP-B",
    "description": "",
    "parameters": {
      "joints": "3",
      "material": "aluminio",
      "weight": "1.6"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**15.** `$ /EVALUATE LAMP-A ERGONOMIA 70 SCORE 0.9 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-6cd361bfa9",
    "alternative_id": "ALT-52308b59c6",
    "objective_id": "OBJ-81afc39596",
    "value": 70.0,
    "unit": "SCORE",
    "confidence": 0.9,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**16.** `$ /EVALUATE LAMP-B ERGONOMIA 85 SCORE 0.9 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-ee13868978",
    "alternative_id": "ALT-8683afb8dd",
    "objective_id": "OBJ-81afc39596",
    "value": 85.0,
    "unit": "SCORE",
    "confidence": 0.9,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**17.** `$ /COMPARE LAMP-A LAMP-B`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "comparison_id": "CMP-9353317bd2",
    "project_id": "LAMP-001",
    "alternative_ids": [
      "ALT-52308b59c6",
      "ALT-8683afb8dd"
    ],
    "evaluations": [
      {
        "evaluation_id": "EVAL-6cd361bfa9",
        "alternative_id": "ALT-52308b59c6",
        "objective_id": "OBJ-81afc39596",
        "value": 70.0,
        "unit": "SCORE",
        "confidence": 0.9,
        "source": "USER_INPUT",
        "version": 1
      },
      {
        "evaluation_id": "EVAL-ee13868978",
        "alternative_id": "ALT-8683afb8dd",
        "objective_id": "OBJ-81afc39596",
        "value": 85.0,
        "unit": "SCORE",
        "confidence": 0.9,
        "source": "USER_INPUT",
        "version": 1
      }
    ],
    "tradeoffs": {},
    "version": 1
  }
}
```

**18.** `$ /SIMULATE RUN DETERMINISTIC deterministic_basic_v1 '{"alternative_id":"LAMP-B","objective_id":"ERGONOMIA","parameter_value":85}'`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "simulation": {
      "simulation_id": "SIM-8fc3a81371",
      "project_id": "LAMP-001",
      "simulation_type": "DETERMINISTIC",
      "method": "deterministic_basic_v1",
      "method_version": "1.0",
      "inputs": {
        "alternative_id": "LAMP-B",
        "objective_id": "ERGONOMIA",
        "parameter_value": 85
      },
      "outputs": {
        "missing_inputs": [
          "alternative_id"
        ]
      },
      "state": "INSUFFICIENT",
      "started_at": "2026-09-16T18:06:10.582523+00:00",
      "finished_at": "2026-09-16T18:06:10.582546+00:00",
      "evidence_hash": "3e2acf811a918a7bdfabc784b108b9258933e35f41bd062c7c5b11082a9582c7",
      "version": 1
    },
    "decision_created": false,
    "recommendation_created": false
  }
}
```

**19.** `$ /HUMAN REVIEW architect-yvan 2026-09-16T07:00:00Z "Revisión del análisis" "Diseño validado" "Product designer"`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "review_id": "REV-47eed220b4",
    "project_id": "LAMP-001",
    "actor": "architect-yvan",
    "timestamp": "2026-09-16T07:00:00Z",
    "review": "Revisión del análisis",
    "reason": "Diseño validado",
    "authority": "Product designer",
    "status": "APPROVED",
    "version": 1
  }
}
```

**20.** `$ /DECISION RECORD "Adoptar LAMP-B" architect-yvan "Product designer"`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "decision_id": "DEC-03a9988cc5",
    "project_id": "LAMP-001",
    "statement": "Adoptar LAMP-B",
    "actor": "architect-yvan",
    "authority": "Product designer",
    "version": 1
  }
}
```

### Corrida 2 — ROOM-001

**Descripción del caso:** ESPACIO (ROOM-001) ===
**Fuente:** orden-189-sintaxis-corregida
**Estado:** **PASS**
**Comandos ejecutados:** 20; **fallos:** 0; **tiempo:** 0.0256 s

#### Snapshot persistido

| Campo | Resultado |
|---|---|
| `project_id` | `ROOM-001` |
| `name` | `Sala de estar` |
| `spatial_scope` | `espacio` |
| `temporal_scope` | `proyecto` |
| `stage` | `DRAFT` |
| `version` | `19` |
| `facts` | `1` |
| `assumptions` | `0` |
| `evidence` | `1` |
| `objectives` | `1` |
| `constraints` | `1` |
| `alternatives` | `2` |
| `evaluations` | `2` |
| `comparisons` | `1` |
| `simulations` | `1` |
| `multiobjectives` | `0` |
| `human_reviews` | `1` |
| `decisions` | `1` |
| `events` | `19` |

#### Salida exacta por comando

**1.** `$ /PROJECT CREATE ROOM-001 "Sala de estar" espacio proyecto`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "project_id": "ROOM-001",
    "name": "Sala de estar",
    "stage": "DRAFT",
    "version": 1,
    "objectives": {},
    "constraints": {},
    "roles": {},
    "actors": {},
    "positions": {},
    "temporal_cycles": {},
    "scenario_branches": {},
    "scenario_evolutions": {},
    "facts": {},
    "assumptions": {},
    "preferences": {},
    "decisions": {},
    "human_reviews": {},
    "alternatives": {},
    "evaluations": {},
    "comparisons": {},
    "recommendations": {},
    "evidence": {},
    "sources": {},
    "simulations": {},
    "multiobjective_results": {},
    "generated_alternatives": {},
    "planning_instruments": {},
    "regulations": {},
    "interpretations": {},
    "normative_snapshots": {},
    "spatial_scope": "espacio",
    "temporal_scope": "proyecto",
    "scale_relations": {}
  }
}
```

**2.** `$ /PROJECT OPEN ROOM-001`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "project_id": "ROOM-001",
    "name": "Sala de estar",
    "stage": "DRAFT",
    "version": 1,
    "objectives": {},
    "constraints": {},
    "roles": {},
    "actors": {},
    "positions": {},
    "temporal_cycles": {},
    "scenario_branches": {},
    "scenario_evolutions": {},
    "facts": {},
    "assumptions": {},
    "preferences": {},
    "decisions": {},
    "human_reviews": {},
    "alternatives": {},
    "evaluations": {},
    "comparisons": {},
    "recommendations": {},
    "evidence": {},
    "sources": {},
    "simulations": {},
    "multiobjective_results": {},
    "generated_alternatives": {},
    "planning_instruments": {},
    "regulations": {},
    "interpretations": {},
    "normative_snapshots": {},
    "spatial_scope": "espacio",
    "temporal_scope": "proyecto",
    "scale_relations": {}
  }
}
```

**3.** `$ /FACT SET "El área útil es 24 m2" PLANO`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "fact_id": "FACT-77074b8c88",
    "project_id": "ROOM-001",
    "statement": "El área útil es 24 m2",
    "source": "PLANO",
    "version": 1
  }
}
```

**4.** `$ /EVIDENCE ADD EVD-R001 "Ventanal al norte" OBSERVATION`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evidence_id": "EVD-R001",
    "project_id": "ROOM-001",
    "source_id": null,
    "statement": "Ventanal al norte",
    "evidence_type": "OBSERVATION",
    "captured_at": "2026-09-16 18:06:10.600869+00:00",
    "method_version": "CLI/1.0",
    "evidence_url": null,
    "evidence_hash": "593a30ee258eb42ca0034756b1af345f79e87d2004999e98f449c55f6d958c8d",
    "state": "OBSERVED",
    "version": 1
  }
}
```

**5.** `$ /OBJECTIVE SET LUZ_NATURAL MAXIMIZE 85`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "objective_id": "OBJ-0f7c009671",
    "project_id": "ROOM-001",
    "key": "LUZ_NATURAL",
    "direction": "MAXIMIZE",
    "value": "85",
    "version": 1,
    "source_parent_objective_id": null
  }
}
```

**6.** `$ /CONSTRAINT SET RUIDO <= 40 DB`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "constraint_id": "CON-b2610676a3",
    "project_id": "ROOM-001",
    "key": "RUIDO",
    "operator": "<=",
    "value": "40",
    "unit": "DB",
    "hard": true,
    "version": 1
  }
}
```

**7.** `$ /ALTERNATIVE CREATE ROOM-A`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-07ed8fd2a6",
    "project_id": "ROOM-001",
    "name": "ROOM-A",
    "description": "",
    "parameters": {},
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**8.** `$ /ALTERNATIVE SET ROOM-A muebles 4`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-07ed8fd2a6",
    "project_id": "ROOM-001",
    "name": "ROOM-A",
    "description": "",
    "parameters": {
      "muebles": "4"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**9.** `$ /ALTERNATIVE SET ROOM-A ventana norte`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-07ed8fd2a6",
    "project_id": "ROOM-001",
    "name": "ROOM-A",
    "description": "",
    "parameters": {
      "muebles": "4",
      "ventana": "norte"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**10.** `$ /ALTERNATIVE SET ROOM-A area_libre 8`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-07ed8fd2a6",
    "project_id": "ROOM-001",
    "name": "ROOM-A",
    "description": "",
    "parameters": {
      "muebles": "4",
      "ventana": "norte",
      "area_libre": "8"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**11.** `$ /ALTERNATIVE CREATE ROOM-B`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-675cc78a41",
    "project_id": "ROOM-001",
    "name": "ROOM-B",
    "description": "",
    "parameters": {},
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**12.** `$ /ALTERNATIVE SET ROOM-B muebles 4`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-675cc78a41",
    "project_id": "ROOM-001",
    "name": "ROOM-B",
    "description": "",
    "parameters": {
      "muebles": "4"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**13.** `$ /ALTERNATIVE SET ROOM-B ventana norte`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-675cc78a41",
    "project_id": "ROOM-001",
    "name": "ROOM-B",
    "description": "",
    "parameters": {
      "muebles": "4",
      "ventana": "norte"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**14.** `$ /ALTERNATIVE SET ROOM-B area_libre 10`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-675cc78a41",
    "project_id": "ROOM-001",
    "name": "ROOM-B",
    "description": "",
    "parameters": {
      "muebles": "4",
      "ventana": "norte",
      "area_libre": "10"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**15.** `$ /EVALUATE ROOM-A LUZ_NATURAL 75 SCORE 0.85 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-bbbf02f24e",
    "alternative_id": "ALT-07ed8fd2a6",
    "objective_id": "OBJ-0f7c009671",
    "value": 75.0,
    "unit": "SCORE",
    "confidence": 0.85,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**16.** `$ /EVALUATE ROOM-B LUZ_NATURAL 88 SCORE 0.85 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-5a47274128",
    "alternative_id": "ALT-675cc78a41",
    "objective_id": "OBJ-0f7c009671",
    "value": 88.0,
    "unit": "SCORE",
    "confidence": 0.85,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**17.** `$ /COMPARE ROOM-A ROOM-B`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "comparison_id": "CMP-4b0b4c28ff",
    "project_id": "ROOM-001",
    "alternative_ids": [
      "ALT-07ed8fd2a6",
      "ALT-675cc78a41"
    ],
    "evaluations": [
      {
        "evaluation_id": "EVAL-bbbf02f24e",
        "alternative_id": "ALT-07ed8fd2a6",
        "objective_id": "OBJ-0f7c009671",
        "value": 75.0,
        "unit": "SCORE",
        "confidence": 0.85,
        "source": "USER_INPUT",
        "version": 1
      },
      {
        "evaluation_id": "EVAL-5a47274128",
        "alternative_id": "ALT-675cc78a41",
        "objective_id": "OBJ-0f7c009671",
        "value": 88.0,
        "unit": "SCORE",
        "confidence": 0.85,
        "source": "USER_INPUT",
        "version": 1
      }
    ],
    "tradeoffs": {},
    "version": 1
  }
}
```

**18.** `$ /SIMULATE RUN DETERMINISTIC deterministic_basic_v1 '{"alternative_id":"ROOM-B","objective_id":"LUZ_NATURAL","parameter_value":88}'`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "simulation": {
      "simulation_id": "SIM-d5a9ee890f",
      "project_id": "ROOM-001",
      "simulation_type": "DETERMINISTIC",
      "method": "deterministic_basic_v1",
      "method_version": "1.0",
      "inputs": {
        "alternative_id": "ROOM-B",
        "objective_id": "LUZ_NATURAL",
        "parameter_value": 88
      },
      "outputs": {
        "missing_inputs": [
          "alternative_id"
        ]
      },
      "state": "INSUFFICIENT",
      "started_at": "2026-09-16T18:06:10.619018+00:00",
      "finished_at": "2026-09-16T18:06:10.619034+00:00",
      "evidence_hash": "0bae7b8aa7600c0ddd70e6651791cbd61e9b774a8ab023c6cda0064a11b32fc5",
      "version": 1
    },
    "decision_created": false,
    "recommendation_created": false
  }
}
```

**19.** `$ /HUMAN REVIEW architect-yvan 2026-09-16T07:00:00Z "Revisión del análisis" "Diseño interior validado" "Interior designer"`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "review_id": "REV-af56af36f4",
    "project_id": "ROOM-001",
    "actor": "architect-yvan",
    "timestamp": "2026-09-16T07:00:00Z",
    "review": "Revisión del análisis",
    "reason": "Diseño interior validado",
    "authority": "Interior designer",
    "status": "APPROVED",
    "version": 1
  }
}
```

**20.** `$ /DECISION RECORD "Adoptar ROOM-B" architect-yvan "Interior designer"`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "decision_id": "DEC-d94e511cc1",
    "project_id": "ROOM-001",
    "statement": "Adoptar ROOM-B",
    "actor": "architect-yvan",
    "authority": "Interior designer",
    "version": 1
  }
}
```

### Corrida 3 — BUILD-001

**Descripción del caso:** EDIFICIO (BUILD-001) ===
**Fuente:** orden-189-sintaxis-corregida
**Estado:** **PASS**
**Comandos ejecutados:** 20; **fallos:** 0; **tiempo:** 0.022 s

#### Snapshot persistido

| Campo | Resultado |
|---|---|
| `project_id` | `BUILD-001` |
| `name` | `Edificio multifamiliar` |
| `spatial_scope` | `edificio` |
| `temporal_scope` | `proyecto` |
| `stage` | `DRAFT` |
| `version` | `19` |
| `facts` | `1` |
| `assumptions` | `0` |
| `evidence` | `1` |
| `objectives` | `1` |
| `constraints` | `1` |
| `alternatives` | `2` |
| `evaluations` | `2` |
| `comparisons` | `1` |
| `simulations` | `1` |
| `multiobjectives` | `0` |
| `human_reviews` | `1` |
| `decisions` | `1` |
| `events` | `19` |

#### Salida exacta por comando

**1.** `$ /PROJECT CREATE BUILD-001 "Edificio multifamiliar" edificio proyecto`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "project_id": "BUILD-001",
    "name": "Edificio multifamiliar",
    "stage": "DRAFT",
    "version": 1,
    "objectives": {},
    "constraints": {},
    "roles": {},
    "actors": {},
    "positions": {},
    "temporal_cycles": {},
    "scenario_branches": {},
    "scenario_evolutions": {},
    "facts": {},
    "assumptions": {},
    "preferences": {},
    "decisions": {},
    "human_reviews": {},
    "alternatives": {},
    "evaluations": {},
    "comparisons": {},
    "recommendations": {},
    "evidence": {},
    "sources": {},
    "simulations": {},
    "multiobjective_results": {},
    "generated_alternatives": {},
    "planning_instruments": {},
    "regulations": {},
    "interpretations": {},
    "normative_snapshots": {},
    "spatial_scope": "edificio",
    "temporal_scope": "proyecto",
    "scale_relations": {}
  }
}
```

**2.** `$ /PROJECT OPEN BUILD-001`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "project_id": "BUILD-001",
    "name": "Edificio multifamiliar",
    "stage": "DRAFT",
    "version": 1,
    "objectives": {},
    "constraints": {},
    "roles": {},
    "actors": {},
    "positions": {},
    "temporal_cycles": {},
    "scenario_branches": {},
    "scenario_evolutions": {},
    "facts": {},
    "assumptions": {},
    "preferences": {},
    "decisions": {},
    "human_reviews": {},
    "alternatives": {},
    "evaluations": {},
    "comparisons": {},
    "recommendations": {},
    "evidence": {},
    "sources": {},
    "simulations": {},
    "multiobjective_results": {},
    "generated_alternatives": {},
    "planning_instruments": {},
    "regulations": {},
    "interpretations": {},
    "normative_snapshots": {},
    "spatial_scope": "edificio",
    "temporal_scope": "proyecto",
    "scale_relations": {}
  }
}
```

**3.** `$ /FACT SET "El lote tiene 500 m2" CATASTRO`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "fact_id": "FACT-8dde3c241b",
    "project_id": "BUILD-001",
    "statement": "El lote tiene 500 m2",
    "source": "CATASTRO",
    "version": 1
  }
}
```

**4.** `$ /EVIDENCE ADD EVD-B001 "Zonificación C-2" DOCUMENT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evidence_id": "EVD-B001",
    "project_id": "BUILD-001",
    "source_id": null,
    "statement": "Zonificación C-2",
    "evidence_type": "DOCUMENT",
    "captured_at": "2026-09-16 18:06:10.626938+00:00",
    "method_version": "CLI/1.0",
    "evidence_url": null,
    "evidence_hash": "0fa13cc1b145b9e1ffbf69edf05bec9f394f92c460ba44e3634c8c54a4150728",
    "state": "OBSERVED",
    "version": 1
  }
}
```

**5.** `$ /OBJECTIVE SET RENTABILIDAD MAXIMIZE 80`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "objective_id": "OBJ-0d42129026",
    "project_id": "BUILD-001",
    "key": "RENTABILIDAD",
    "direction": "MAXIMIZE",
    "value": "80",
    "version": 1,
    "source_parent_objective_id": null
  }
}
```

**6.** `$ /CONSTRAINT SET ALTURA <= 7 PISOS`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "constraint_id": "CON-609d07b210",
    "project_id": "BUILD-001",
    "key": "ALTURA",
    "operator": "<=",
    "value": "7",
    "unit": "PISOS",
    "hard": true,
    "version": 1
  }
}
```

**7.** `$ /ALTERNATIVE CREATE BUILD-A`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-dc4d763b96",
    "project_id": "BUILD-001",
    "name": "BUILD-A",
    "description": "",
    "parameters": {},
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**8.** `$ /ALTERNATIVE SET BUILD-A pisos 7`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-dc4d763b96",
    "project_id": "BUILD-001",
    "name": "BUILD-A",
    "description": "",
    "parameters": {
      "pisos": "7"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**9.** `$ /ALTERNATIVE SET BUILD-A unidades 21`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-dc4d763b96",
    "project_id": "BUILD-001",
    "name": "BUILD-A",
    "description": "",
    "parameters": {
      "pisos": "7",
      "unidades": "21"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**10.** `$ /ALTERNATIVE SET BUILD-A area_libre 100`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-dc4d763b96",
    "project_id": "BUILD-001",
    "name": "BUILD-A",
    "description": "",
    "parameters": {
      "pisos": "7",
      "unidades": "21",
      "area_libre": "100"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**11.** `$ /ALTERNATIVE CREATE BUILD-B`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-3aeda40d6f",
    "project_id": "BUILD-001",
    "name": "BUILD-B",
    "description": "",
    "parameters": {},
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**12.** `$ /ALTERNATIVE SET BUILD-B pisos 6`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-3aeda40d6f",
    "project_id": "BUILD-001",
    "name": "BUILD-B",
    "description": "",
    "parameters": {
      "pisos": "6"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**13.** `$ /ALTERNATIVE SET BUILD-B unidades 20`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-3aeda40d6f",
    "project_id": "BUILD-001",
    "name": "BUILD-B",
    "description": "",
    "parameters": {
      "pisos": "6",
      "unidades": "20"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**14.** `$ /ALTERNATIVE SET BUILD-B area_libre 150`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-3aeda40d6f",
    "project_id": "BUILD-001",
    "name": "BUILD-B",
    "description": "",
    "parameters": {
      "pisos": "6",
      "unidades": "20",
      "area_libre": "150"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**15.** `$ /EVALUATE BUILD-A RENTABILIDAD 85 SCORE 0.85 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-5cefe658d2",
    "alternative_id": "ALT-dc4d763b96",
    "objective_id": "OBJ-0d42129026",
    "value": 85.0,
    "unit": "SCORE",
    "confidence": 0.85,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**16.** `$ /EVALUATE BUILD-B RENTABILIDAD 78 SCORE 0.85 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-8542601c1a",
    "alternative_id": "ALT-3aeda40d6f",
    "objective_id": "OBJ-0d42129026",
    "value": 78.0,
    "unit": "SCORE",
    "confidence": 0.85,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**17.** `$ /COMPARE BUILD-A BUILD-B`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "comparison_id": "CMP-b1cbe4edce",
    "project_id": "BUILD-001",
    "alternative_ids": [
      "ALT-dc4d763b96",
      "ALT-3aeda40d6f"
    ],
    "evaluations": [
      {
        "evaluation_id": "EVAL-5cefe658d2",
        "alternative_id": "ALT-dc4d763b96",
        "objective_id": "OBJ-0d42129026",
        "value": 85.0,
        "unit": "SCORE",
        "confidence": 0.85,
        "source": "USER_INPUT",
        "version": 1
      },
      {
        "evaluation_id": "EVAL-8542601c1a",
        "alternative_id": "ALT-3aeda40d6f",
        "objective_id": "OBJ-0d42129026",
        "value": 78.0,
        "unit": "SCORE",
        "confidence": 0.85,
        "source": "USER_INPUT",
        "version": 1
      }
    ],
    "tradeoffs": {},
    "version": 1
  }
}
```

**18.** `$ /SIMULATE RUN DETERMINISTIC deterministic_basic_v1 '{"alternative_id":"BUILD-A","objective_id":"RENTABILIDAD","parameter_value":85}'`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "simulation": {
      "simulation_id": "SIM-e6428e14c4",
      "project_id": "BUILD-001",
      "simulation_type": "DETERMINISTIC",
      "method": "deterministic_basic_v1",
      "method_version": "1.0",
      "inputs": {
        "alternative_id": "BUILD-A",
        "objective_id": "RENTABILIDAD",
        "parameter_value": 85
      },
      "outputs": {
        "missing_inputs": [
          "alternative_id"
        ]
      },
      "state": "INSUFFICIENT",
      "started_at": "2026-09-16T18:06:10.642116+00:00",
      "finished_at": "2026-09-16T18:06:10.642129+00:00",
      "evidence_hash": "cfbf3f1c495ec05127b65b4ac90fe8134cbcde1925ce046361123664bb5dc836",
      "version": 1
    },
    "decision_created": false,
    "recommendation_created": false
  }
}
```

**19.** `$ /HUMAN REVIEW architect-yvan 2026-09-16T07:00:00Z "Revisión del análisis" "Proyecto validado" "Architect"`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "review_id": "REV-ffb127c039",
    "project_id": "BUILD-001",
    "actor": "architect-yvan",
    "timestamp": "2026-09-16T07:00:00Z",
    "review": "Revisión del análisis",
    "reason": "Proyecto validado",
    "authority": "Architect",
    "status": "APPROVED",
    "version": 1
  }
}
```

**20.** `$ /DECISION RECORD "Adoptar BUILD-A" architect-yvan "Architect"`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "decision_id": "DEC-32085906d7",
    "project_id": "BUILD-001",
    "statement": "Adoptar BUILD-A",
    "actor": "architect-yvan",
    "authority": "Architect",
    "version": 1
  }
}
```

### Corrida 4 — SITE-001

**Descripción del caso:** PARCELA/SITIO (SITE-001) ===
**Fuente:** orden-189-sintaxis-corregida
**Estado:** **PASS**
**Comandos ejecutados:** 20; **fallos:** 0; **tiempo:** 0.023 s

#### Snapshot persistido

| Campo | Resultado |
|---|---|
| `project_id` | `SITE-001` |
| `name` | `Sitio UPAO-001` |
| `spatial_scope` | `parcela_sitio` |
| `temporal_scope` | `proyecto` |
| `stage` | `DRAFT` |
| `version` | `19` |
| `facts` | `1` |
| `assumptions` | `0` |
| `evidence` | `1` |
| `objectives` | `1` |
| `constraints` | `1` |
| `alternatives` | `2` |
| `evaluations` | `2` |
| `comparisons` | `1` |
| `simulations` | `1` |
| `multiobjectives` | `0` |
| `human_reviews` | `1` |
| `decisions` | `1` |
| `events` | `19` |

#### Salida exacta por comando

**1.** `$ /PROJECT CREATE SITE-001 "Sitio UPAO-001" parcela_sitio proyecto`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "project_id": "SITE-001",
    "name": "Sitio UPAO-001",
    "stage": "DRAFT",
    "version": 1,
    "objectives": {},
    "constraints": {},
    "roles": {},
    "actors": {},
    "positions": {},
    "temporal_cycles": {},
    "scenario_branches": {},
    "scenario_evolutions": {},
    "facts": {},
    "assumptions": {},
    "preferences": {},
    "decisions": {},
    "human_reviews": {},
    "alternatives": {},
    "evaluations": {},
    "comparisons": {},
    "recommendations": {},
    "evidence": {},
    "sources": {},
    "simulations": {},
    "multiobjective_results": {},
    "generated_alternatives": {},
    "planning_instruments": {},
    "regulations": {},
    "interpretations": {},
    "normative_snapshots": {},
    "spatial_scope": "parcela_sitio",
    "temporal_scope": "proyecto",
    "scale_relations": {}
  }
}
```

**2.** `$ /PROJECT OPEN SITE-001`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "project_id": "SITE-001",
    "name": "Sitio UPAO-001",
    "stage": "DRAFT",
    "version": 1,
    "objectives": {},
    "constraints": {},
    "roles": {},
    "actors": {},
    "positions": {},
    "temporal_cycles": {},
    "scenario_branches": {},
    "scenario_evolutions": {},
    "facts": {},
    "assumptions": {},
    "preferences": {},
    "decisions": {},
    "human_reviews": {},
    "alternatives": {},
    "evaluations": {},
    "comparisons": {},
    "recommendations": {},
    "evidence": {},
    "sources": {},
    "simulations": {},
    "multiobjective_results": {},
    "generated_alternatives": {},
    "planning_instruments": {},
    "regulations": {},
    "interpretations": {},
    "normative_snapshots": {},
    "spatial_scope": "parcela_sitio",
    "temporal_scope": "proyecto",
    "scale_relations": {}
  }
}
```

**3.** `$ /FACT SET "El sitio tiene 2000 m2" CATASTRO`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "fact_id": "FACT-31e7edb27b",
    "project_id": "SITE-001",
    "statement": "El sitio tiene 2000 m2",
    "source": "CATASTRO",
    "version": 1
  }
}
```

**4.** `$ /EVIDENCE ADD EVD-S001 "Frente de 40 m a la avenida principal" DOCUMENT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evidence_id": "EVD-S001",
    "project_id": "SITE-001",
    "source_id": null,
    "statement": "Frente de 40 m a la avenida principal",
    "evidence_type": "DOCUMENT",
    "captured_at": "2026-09-16 18:06:10.649826+00:00",
    "method_version": "CLI/1.0",
    "evidence_url": null,
    "evidence_hash": "b5980ddf0014d7005d2c46618342a05fcc2a7ff76da773142d86a688b109e3ca",
    "state": "OBSERVED",
    "version": 1
  }
}
```

**5.** `$ /OBJECTIVE SET CONFORT MAXIMIZE 85`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "objective_id": "OBJ-b9891b7613",
    "project_id": "SITE-001",
    "key": "CONFORT",
    "direction": "MAXIMIZE",
    "value": "85",
    "version": 1,
    "source_parent_objective_id": null
  }
}
```

**6.** `$ /CONSTRAINT SET FAR <= 5`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "constraint_id": "CON-63213a2bd5",
    "project_id": "SITE-001",
    "key": "FAR",
    "operator": "<=",
    "value": "5",
    "unit": "",
    "hard": true,
    "version": 1
  }
}
```

**7.** `$ /ALTERNATIVE CREATE SITE-A`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-111e710e87",
    "project_id": "SITE-001",
    "name": "SITE-A",
    "description": "",
    "parameters": {},
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**8.** `$ /ALTERNATIVE SET SITE-A huella 800`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-111e710e87",
    "project_id": "SITE-001",
    "name": "SITE-A",
    "description": "",
    "parameters": {
      "huella": "800"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**9.** `$ /ALTERNATIVE SET SITE-A altura 6`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-111e710e87",
    "project_id": "SITE-001",
    "name": "SITE-A",
    "description": "",
    "parameters": {
      "huella": "800",
      "altura": "6"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**10.** `$ /ALTERNATIVE SET SITE-A area_libre 1200`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-111e710e87",
    "project_id": "SITE-001",
    "name": "SITE-A",
    "description": "",
    "parameters": {
      "altura": "6",
      "huella": "800",
      "area_libre": "1200"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**11.** `$ /ALTERNATIVE CREATE SITE-B`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-2d016d293b",
    "project_id": "SITE-001",
    "name": "SITE-B",
    "description": "",
    "parameters": {},
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**12.** `$ /ALTERNATIVE SET SITE-B huella 900`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-2d016d293b",
    "project_id": "SITE-001",
    "name": "SITE-B",
    "description": "",
    "parameters": {
      "huella": "900"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**13.** `$ /ALTERNATIVE SET SITE-B altura 5`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-2d016d293b",
    "project_id": "SITE-001",
    "name": "SITE-B",
    "description": "",
    "parameters": {
      "huella": "900",
      "altura": "5"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**14.** `$ /ALTERNATIVE SET SITE-B area_libre 1100`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-2d016d293b",
    "project_id": "SITE-001",
    "name": "SITE-B",
    "description": "",
    "parameters": {
      "altura": "5",
      "huella": "900",
      "area_libre": "1100"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**15.** `$ /EVALUATE SITE-A CONFORT 82 SCORE 0.85 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-3865160739",
    "alternative_id": "ALT-111e710e87",
    "objective_id": "OBJ-b9891b7613",
    "value": 82.0,
    "unit": "SCORE",
    "confidence": 0.85,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**16.** `$ /EVALUATE SITE-B CONFORT 88 SCORE 0.85 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-503aa4d6cd",
    "alternative_id": "ALT-2d016d293b",
    "objective_id": "OBJ-b9891b7613",
    "value": 88.0,
    "unit": "SCORE",
    "confidence": 0.85,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**17.** `$ /COMPARE SITE-A SITE-B`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "comparison_id": "CMP-cf4e90db65",
    "project_id": "SITE-001",
    "alternative_ids": [
      "ALT-111e710e87",
      "ALT-2d016d293b"
    ],
    "evaluations": [
      {
        "evaluation_id": "EVAL-3865160739",
        "alternative_id": "ALT-111e710e87",
        "objective_id": "OBJ-b9891b7613",
        "value": 82.0,
        "unit": "SCORE",
        "confidence": 0.85,
        "source": "USER_INPUT",
        "version": 1
      },
      {
        "evaluation_id": "EVAL-503aa4d6cd",
        "alternative_id": "ALT-2d016d293b",
        "objective_id": "OBJ-b9891b7613",
        "value": 88.0,
        "unit": "SCORE",
        "confidence": 0.85,
        "source": "USER_INPUT",
        "version": 1
      }
    ],
    "tradeoffs": {},
    "version": 1
  }
}
```

**18.** `$ /SIMULATE MONTE_CARLO SITE-B CONFORT huella '{"type":"NORMAL","parameters":{"mean":900,"std_dev":50}}' 1000`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "simulation": {
      "simulation_id": "SIM-7d4c7743ea",
      "project_id": "SITE-001",
      "simulation_type": "MONTE_CARLO",
      "method": "monte_carlo_v1",
      "method_version": "1.0",
      "inputs": {
        "alternative_id": "SITE-B",
        "iterations": 1000,
        "objective_id": "CONFORT",
        "parameter_distribution": {
          "parameters": {
            "mean": 900,
            "std_dev": 50
          },
          "type": "NORMAL"
        },
        "parameter_name": "huella",
        "seed": 20260916
      },
      "outputs": {
        "missing_inputs": [
          "alternative_id"
        ]
      },
      "state": "INSUFFICIENT",
      "started_at": "2026-09-16T18:06:10.665645+00:00",
      "finished_at": "2026-09-16T18:06:10.665662+00:00",
      "evidence_hash": "1cb859a9ecaa0f4761edc9252139946a7e7e5efce6dfa66b716910949a6f4649",
      "version": 1
    },
    "decision_created": false,
    "recommendation_created": false
  }
}
```

**19.** `$ /HUMAN REVIEW architect-yvan 2026-09-16T07:00:00Z "Revisión del sitio" "Sitio validado" "Architect"`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "review_id": "REV-fdeee49232",
    "project_id": "SITE-001",
    "actor": "architect-yvan",
    "timestamp": "2026-09-16T07:00:00Z",
    "review": "Revisión del sitio",
    "reason": "Sitio validado",
    "authority": "Architect",
    "status": "APPROVED",
    "version": 1
  }
}
```

**20.** `$ /DECISION RECORD "Adoptar SITE-B" architect-yvan "Architect"`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "decision_id": "DEC-24d39427e6",
    "project_id": "SITE-001",
    "statement": "Adoptar SITE-B",
    "actor": "architect-yvan",
    "authority": "Architect",
    "version": 1
  }
}
```

### Corrida 5 — BARRIO-001

**Descripción del caso:** BARRIO/SECTOR (BARRIO-001) ===
**Fuente:** orden-189-sintaxis-corregida
**Estado:** **PASS**
**Comandos ejecutados:** 20; **fallos:** 0; **tiempo:** 0.0571 s

#### Snapshot persistido

| Campo | Resultado |
|---|---|
| `project_id` | `BARRIO-001` |
| `name` | `Sector residencial Monserrate` |
| `spatial_scope` | `barrio_sector` |
| `temporal_scope` | `mediano_plazo` |
| `stage` | `DRAFT` |
| `version` | `19` |
| `facts` | `1` |
| `assumptions` | `0` |
| `evidence` | `1` |
| `objectives` | `1` |
| `constraints` | `1` |
| `alternatives` | `2` |
| `evaluations` | `2` |
| `comparisons` | `1` |
| `simulations` | `1` |
| `multiobjectives` | `0` |
| `human_reviews` | `1` |
| `decisions` | `1` |
| `events` | `19` |

#### Salida exacta por comando

**1.** `$ /PROJECT CREATE BARRIO-001 "Sector residencial Monserrate" barrio_sector mediano_plazo`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "project_id": "BARRIO-001",
    "name": "Sector residencial Monserrate",
    "stage": "DRAFT",
    "version": 1,
    "objectives": {},
    "constraints": {},
    "roles": {},
    "actors": {},
    "positions": {},
    "temporal_cycles": {},
    "scenario_branches": {},
    "scenario_evolutions": {},
    "facts": {},
    "assumptions": {},
    "preferences": {},
    "decisions": {},
    "human_reviews": {},
    "alternatives": {},
    "evaluations": {},
    "comparisons": {},
    "recommendations": {},
    "evidence": {},
    "sources": {},
    "simulations": {},
    "multiobjective_results": {},
    "generated_alternatives": {},
    "planning_instruments": {},
    "regulations": {},
    "interpretations": {},
    "normative_snapshots": {},
    "spatial_scope": "barrio_sector",
    "temporal_scope": "mediano_plazo",
    "scale_relations": {}
  }
}
```

**2.** `$ /PROJECT OPEN BARRIO-001`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "project_id": "BARRIO-001",
    "name": "Sector residencial Monserrate",
    "stage": "DRAFT",
    "version": 1,
    "objectives": {},
    "constraints": {},
    "roles": {},
    "actors": {},
    "positions": {},
    "temporal_cycles": {},
    "scenario_branches": {},
    "scenario_evolutions": {},
    "facts": {},
    "assumptions": {},
    "preferences": {},
    "decisions": {},
    "human_reviews": {},
    "alternatives": {},
    "evaluations": {},
    "comparisons": {},
    "recommendations": {},
    "evidence": {},
    "sources": {},
    "simulations": {},
    "multiobjective_results": {},
    "generated_alternatives": {},
    "planning_instruments": {},
    "regulations": {},
    "interpretations": {},
    "normative_snapshots": {},
    "spatial_scope": "barrio_sector",
    "temporal_scope": "mediano_plazo",
    "scale_relations": {}
  }
}
```

**3.** `$ /FACT SET "El sector tiene 12 manzanas" MUNICIPIO`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "fact_id": "FACT-7c4bb90073",
    "project_id": "BARRIO-001",
    "statement": "El sector tiene 12 manzanas",
    "source": "MUNICIPIO",
    "version": 1
  }
}
```

**4.** `$ /EVIDENCE ADD EVD-BR001 "Déficit de áreas verdes 2 m2 por habitante" DOCUMENT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evidence_id": "EVD-BR001",
    "project_id": "BARRIO-001",
    "source_id": null,
    "statement": "Déficit de áreas verdes 2 m2 por habitante",
    "evidence_type": "DOCUMENT",
    "captured_at": "2026-09-16 18:06:10.673506+00:00",
    "method_version": "CLI/1.0",
    "evidence_url": null,
    "evidence_hash": "a7d34ec212da31c5e4c9dd268984201b98124d547b2c0fb59e3a3562ffcf9563",
    "state": "OBSERVED",
    "version": 1
  }
}
```

**5.** `$ /OBJECTIVE SET AREA_VERDE MAXIMIZE 90`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "objective_id": "OBJ-f426a02766",
    "project_id": "BARRIO-001",
    "key": "AREA_VERDE",
    "direction": "MAXIMIZE",
    "value": "90",
    "version": 1,
    "source_parent_objective_id": null
  }
}
```

**6.** `$ /CONSTRAINT SET DENSIDAD <= 300 HAB_HA`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "constraint_id": "CON-1493fd337b",
    "project_id": "BARRIO-001",
    "key": "DENSIDAD",
    "operator": "<=",
    "value": "300",
    "unit": "HAB_HA",
    "hard": true,
    "version": 1
  }
}
```

**7.** `$ /ALTERNATIVE CREATE BARRIO-A`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-9a0a5d5f7c",
    "project_id": "BARRIO-001",
    "name": "BARRIO-A",
    "description": "",
    "parameters": {},
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**8.** `$ /ALTERNATIVE SET BARRIO-A parques 1`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-9a0a5d5f7c",
    "project_id": "BARRIO-001",
    "name": "BARRIO-A",
    "description": "",
    "parameters": {
      "parques": "1"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**9.** `$ /ALTERNATIVE SET BARRIO-A area_verde 8000`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-9a0a5d5f7c",
    "project_id": "BARRIO-001",
    "name": "BARRIO-A",
    "description": "",
    "parameters": {
      "parques": "1",
      "area_verde": "8000"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**10.** `$ /ALTERNATIVE SET BARRIO-A viviendas 400`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-9a0a5d5f7c",
    "project_id": "BARRIO-001",
    "name": "BARRIO-A",
    "description": "",
    "parameters": {
      "area_verde": "8000",
      "parques": "1",
      "viviendas": "400"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**11.** `$ /ALTERNATIVE CREATE BARRIO-B`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-4b58b27d2c",
    "project_id": "BARRIO-001",
    "name": "BARRIO-B",
    "description": "",
    "parameters": {},
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**12.** `$ /ALTERNATIVE SET BARRIO-B parques 4`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-4b58b27d2c",
    "project_id": "BARRIO-001",
    "name": "BARRIO-B",
    "description": "",
    "parameters": {
      "parques": "4"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**13.** `$ /ALTERNATIVE SET BARRIO-B area_verde 12000`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-4b58b27d2c",
    "project_id": "BARRIO-001",
    "name": "BARRIO-B",
    "description": "",
    "parameters": {
      "parques": "4",
      "area_verde": "12000"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**14.** `$ /ALTERNATIVE SET BARRIO-B viviendas 420`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-4b58b27d2c",
    "project_id": "BARRIO-001",
    "name": "BARRIO-B",
    "description": "",
    "parameters": {
      "area_verde": "12000",
      "parques": "4",
      "viviendas": "420"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**15.** `$ /EVALUATE BARRIO-A AREA_VERDE 60 SCORE 0.7 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-8ce955988f",
    "alternative_id": "ALT-9a0a5d5f7c",
    "objective_id": "OBJ-f426a02766",
    "value": 60.0,
    "unit": "SCORE",
    "confidence": 0.7,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**16.** `$ /EVALUATE BARRIO-B AREA_VERDE 85 SCORE 0.7 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-05f9b1e961",
    "alternative_id": "ALT-4b58b27d2c",
    "objective_id": "OBJ-f426a02766",
    "value": 85.0,
    "unit": "SCORE",
    "confidence": 0.7,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**17.** `$ /COMPARE BARRIO-A BARRIO-B`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "comparison_id": "CMP-5d5826a570",
    "project_id": "BARRIO-001",
    "alternative_ids": [
      "ALT-9a0a5d5f7c",
      "ALT-4b58b27d2c"
    ],
    "evaluations": [
      {
        "evaluation_id": "EVAL-8ce955988f",
        "alternative_id": "ALT-9a0a5d5f7c",
        "objective_id": "OBJ-f426a02766",
        "value": 60.0,
        "unit": "SCORE",
        "confidence": 0.7,
        "source": "USER_INPUT",
        "version": 1
      },
      {
        "evaluation_id": "EVAL-05f9b1e961",
        "alternative_id": "ALT-4b58b27d2c",
        "objective_id": "OBJ-f426a02766",
        "value": 85.0,
        "unit": "SCORE",
        "confidence": 0.7,
        "source": "USER_INPUT",
        "version": 1
      }
    ],
    "tradeoffs": {},
    "version": 1
  }
}
```

**18.** `$ /SIMULATE MONTE_CARLO BARRIO-B AREA_VERDE area_verde '{"type":"NORMAL","parameters":{"mean":12000,"std_dev":800}}' 1000`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "simulation": {
      "simulation_id": "SIM-16efe50cd9",
      "project_id": "BARRIO-001",
      "simulation_type": "MONTE_CARLO",
      "method": "monte_carlo_v1",
      "method_version": "1.0",
      "inputs": {
        "alternative_id": "BARRIO-B",
        "iterations": 1000,
        "objective_id": "AREA_VERDE",
        "parameter_distribution": {
          "parameters": {
            "mean": 12000,
            "std_dev": 800
          },
          "type": "NORMAL"
        },
        "parameter_name": "area_verde",
        "seed": 20260916
      },
      "outputs": {
        "missing_inputs": [
          "alternative_id"
        ]
      },
      "state": "INSUFFICIENT",
      "started_at": "2026-09-16T18:06:10.721039+00:00",
      "finished_at": "2026-09-16T18:06:10.721061+00:00",
      "evidence_hash": "75abf538d39b1c4d2160b22e4861d46cf71e623477460e1ca285a86f163b1694",
      "version": 1
    },
    "decision_created": false,
    "recommendation_created": false
  }
}
```

**19.** `$ /HUMAN REVIEW architect-yvan 2026-09-16T07:00:00Z "Revisión urbanística" "Sector validado" "Urban planner"`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "review_id": "REV-50efda13eb",
    "project_id": "BARRIO-001",
    "actor": "architect-yvan",
    "timestamp": "2026-09-16T07:00:00Z",
    "review": "Revisión urbanística",
    "reason": "Sector validado",
    "authority": "Urban planner",
    "status": "APPROVED",
    "version": 1
  }
}
```

**20.** `$ /DECISION RECORD "Adoptar BARRIO-B" architect-yvan "Urban planner"`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "decision_id": "DEC-25322027d6",
    "project_id": "BARRIO-001",
    "statement": "Adoptar BARRIO-B",
    "actor": "architect-yvan",
    "authority": "Urban planner",
    "version": 1
  }
}
```

### Corrida 6 — CIUDAD-001

**Descripción del caso:** CIUDAD/DISTRITO (CIUDAD-001) ===
**Fuente:** orden-189-sintaxis-corregida
**Estado:** **PASS**
**Comandos ejecutados:** 23; **fallos:** 0; **tiempo:** 0.0323 s

#### Snapshot persistido

| Campo | Resultado |
|---|---|
| `project_id` | `CIUDAD-001` |
| `name` | `Distrito de Trujillo` |
| `spatial_scope` | `ciudad_distrito` |
| `temporal_scope` | `largo_plazo` |
| `stage` | `DRAFT` |
| `version` | `22` |
| `facts` | `1` |
| `assumptions` | `0` |
| `evidence` | `1` |
| `objectives` | `2` |
| `constraints` | `1` |
| `alternatives` | `2` |
| `evaluations` | `4` |
| `comparisons` | `1` |
| `simulations` | `0` |
| `multiobjectives` | `1` |
| `human_reviews` | `1` |
| `decisions` | `1` |
| `events` | `22` |

#### Salida exacta por comando

**1.** `$ /PROJECT CREATE CIUDAD-001 "Distrito de Trujillo" ciudad_distrito largo_plazo`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "project_id": "CIUDAD-001",
    "name": "Distrito de Trujillo",
    "stage": "DRAFT",
    "version": 1,
    "objectives": {},
    "constraints": {},
    "roles": {},
    "actors": {},
    "positions": {},
    "temporal_cycles": {},
    "scenario_branches": {},
    "scenario_evolutions": {},
    "facts": {},
    "assumptions": {},
    "preferences": {},
    "decisions": {},
    "human_reviews": {},
    "alternatives": {},
    "evaluations": {},
    "comparisons": {},
    "recommendations": {},
    "evidence": {},
    "sources": {},
    "simulations": {},
    "multiobjective_results": {},
    "generated_alternatives": {},
    "planning_instruments": {},
    "regulations": {},
    "interpretations": {},
    "normative_snapshots": {},
    "spatial_scope": "ciudad_distrito",
    "temporal_scope": "largo_plazo",
    "scale_relations": {}
  }
}
```

**2.** `$ /PROJECT OPEN CIUDAD-001`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "project_id": "CIUDAD-001",
    "name": "Distrito de Trujillo",
    "stage": "DRAFT",
    "version": 1,
    "objectives": {},
    "constraints": {},
    "roles": {},
    "actors": {},
    "positions": {},
    "temporal_cycles": {},
    "scenario_branches": {},
    "scenario_evolutions": {},
    "facts": {},
    "assumptions": {},
    "preferences": {},
    "decisions": {},
    "human_reviews": {},
    "alternatives": {},
    "evaluations": {},
    "comparisons": {},
    "recommendations": {},
    "evidence": {},
    "sources": {},
    "simulations": {},
    "multiobjective_results": {},
    "generated_alternatives": {},
    "planning_instruments": {},
    "regulations": {},
    "interpretations": {},
    "normative_snapshots": {},
    "spatial_scope": "ciudad_distrito",
    "temporal_scope": "largo_plazo",
    "scale_relations": {}
  }
}
```

**3.** `$ /FACT SET "El distrito tiene 50000 habitantes" INEI`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "fact_id": "FACT-3e0a6b33c9",
    "project_id": "CIUDAD-001",
    "statement": "El distrito tiene 50000 habitantes",
    "source": "INEI",
    "version": 1
  }
}
```

**4.** `$ /EVIDENCE ADD EVD-C001 "Tasa de motorización 250 vehículos por 1000 habitantes" DOCUMENT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evidence_id": "EVD-C001",
    "project_id": "CIUDAD-001",
    "source_id": null,
    "statement": "Tasa de motorización 250 vehículos por 1000 habitantes",
    "evidence_type": "DOCUMENT",
    "captured_at": "2026-09-16 18:06:10.732952+00:00",
    "method_version": "CLI/1.0",
    "evidence_url": null,
    "evidence_hash": "b8b1f5bff01fc2bbe9806f189f7f1415d89c6f4f7b4fc8f08fc02759f40149f4",
    "state": "OBSERVED",
    "version": 1
  }
}
```

**5.** `$ /OBJECTIVE SET MOVILIDAD_SOSTENIBLE MAXIMIZE 85`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "objective_id": "OBJ-b24db3c7de",
    "project_id": "CIUDAD-001",
    "key": "MOVILIDAD_SOSTENIBLE",
    "direction": "MAXIMIZE",
    "value": "85",
    "version": 1,
    "source_parent_objective_id": null
  }
}
```

**6.** `$ /OBJECTIVE SET EMISIONES MINIMIZE 5000`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "objective_id": "OBJ-7c836e0b4a",
    "project_id": "CIUDAD-001",
    "key": "EMISIONES",
    "direction": "MINIMIZE",
    "value": "5000",
    "version": 1,
    "source_parent_objective_id": null
  }
}
```

**7.** `$ /CONSTRAINT SET EMISIONES <= 5000 TON_ANO`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "constraint_id": "CON-05f90f914d",
    "project_id": "CIUDAD-001",
    "key": "EMISIONES",
    "operator": "<=",
    "value": "5000",
    "unit": "TON_ANO",
    "hard": true,
    "version": 1
  }
}
```

**8.** `$ /ALTERNATIVE CREATE CIUDAD-A`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-7be62a8c66",
    "project_id": "CIUDAD-001",
    "name": "CIUDAD-A",
    "description": "",
    "parameters": {},
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**9.** `$ /ALTERNATIVE SET CIUDAD-A vias 8`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-7be62a8c66",
    "project_id": "CIUDAD-001",
    "name": "CIUDAD-A",
    "description": "",
    "parameters": {
      "vias": "8"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**10.** `$ /ALTERNATIVE SET CIUDAD-A ciclovias 10`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-7be62a8c66",
    "project_id": "CIUDAD-001",
    "name": "CIUDAD-A",
    "description": "",
    "parameters": {
      "vias": "8",
      "ciclovias": "10"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**11.** `$ /ALTERNATIVE SET CIUDAD-A transporte_publico 2`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-7be62a8c66",
    "project_id": "CIUDAD-001",
    "name": "CIUDAD-A",
    "description": "",
    "parameters": {
      "ciclovias": "10",
      "vias": "8",
      "transporte_publico": "2"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**12.** `$ /ALTERNATIVE CREATE CIUDAD-B`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-33b6375f4b",
    "project_id": "CIUDAD-001",
    "name": "CIUDAD-B",
    "description": "",
    "parameters": {},
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**13.** `$ /ALTERNATIVE SET CIUDAD-B vias 5`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-33b6375f4b",
    "project_id": "CIUDAD-001",
    "name": "CIUDAD-B",
    "description": "",
    "parameters": {
      "vias": "5"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**14.** `$ /ALTERNATIVE SET CIUDAD-B ciclovias 40`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-33b6375f4b",
    "project_id": "CIUDAD-001",
    "name": "CIUDAD-B",
    "description": "",
    "parameters": {
      "vias": "5",
      "ciclovias": "40"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**15.** `$ /ALTERNATIVE SET CIUDAD-B transporte_publico 6`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-33b6375f4b",
    "project_id": "CIUDAD-001",
    "name": "CIUDAD-B",
    "description": "",
    "parameters": {
      "ciclovias": "40",
      "vias": "5",
      "transporte_publico": "6"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**16.** `$ /EVALUATE CIUDAD-A MOVILIDAD_SOSTENIBLE 55 SCORE 0.7 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-ad7f95bd0f",
    "alternative_id": "ALT-7be62a8c66",
    "objective_id": "OBJ-b24db3c7de",
    "value": 55.0,
    "unit": "SCORE",
    "confidence": 0.7,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**17.** `$ /EVALUATE CIUDAD-A EMISIONES 4800 SCORE 0.7 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-32f2431ed1",
    "alternative_id": "ALT-7be62a8c66",
    "objective_id": "OBJ-7c836e0b4a",
    "value": 4800.0,
    "unit": "SCORE",
    "confidence": 0.7,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**18.** `$ /EVALUATE CIUDAD-B MOVILIDAD_SOSTENIBLE 82 SCORE 0.7 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-3bc3cb924d",
    "alternative_id": "ALT-33b6375f4b",
    "objective_id": "OBJ-b24db3c7de",
    "value": 82.0,
    "unit": "SCORE",
    "confidence": 0.7,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**19.** `$ /EVALUATE CIUDAD-B EMISIONES 3500 SCORE 0.7 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-91cfa08338",
    "alternative_id": "ALT-33b6375f4b",
    "objective_id": "OBJ-7c836e0b4a",
    "value": 3500.0,
    "unit": "SCORE",
    "confidence": 0.7,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**20.** `$ /COMPARE CIUDAD-A CIUDAD-B`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "comparison_id": "CMP-b9a1c9b39d",
    "project_id": "CIUDAD-001",
    "alternative_ids": [
      "ALT-7be62a8c66",
      "ALT-33b6375f4b"
    ],
    "evaluations": [
      {
        "evaluation_id": "EVAL-ad7f95bd0f",
        "alternative_id": "ALT-7be62a8c66",
        "objective_id": "OBJ-b24db3c7de",
        "value": 55.0,
        "unit": "SCORE",
        "confidence": 0.7,
        "source": "USER_INPUT",
        "version": 1
      },
      {
        "evaluation_id": "EVAL-32f2431ed1",
        "alternative_id": "ALT-7be62a8c66",
        "objective_id": "OBJ-7c836e0b4a",
        "value": 4800.0,
        "unit": "SCORE",
        "confidence": 0.7,
        "source": "USER_INPUT",
        "version": 1
      },
      {
        "evaluation_id": "EVAL-3bc3cb924d",
        "alternative_id": "ALT-33b6375f4b",
        "objective_id": "OBJ-b24db3c7de",
        "value": 82.0,
        "unit": "SCORE",
        "confidence": 0.7,
        "source": "USER_INPUT",
        "version": 1
      },
      {
        "evaluation_id": "EVAL-91cfa08338",
        "alternative_id": "ALT-33b6375f4b",
        "objective_id": "OBJ-7c836e0b4a",
        "value": 3500.0,
        "unit": "SCORE",
        "confidence": 0.7,
        "source": "USER_INPUT",
        "version": 1
      }
    ],
    "tradeoffs": {},
    "version": 1
  }
}
```

**21.** `$ /MULTIOBJECTIVE PARETO MOVILIDAD_SOSTENIBLE EMISIONES`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "multiobjective": {
      "multiobjective_id": "MOBJ-e5c2a67909",
      "project_id": "CIUDAD-001",
      "method": "pareto_front_v1",
      "method_version": "1.0",
      "objectives": [
        "MOVILIDAD_SOSTENIBLE",
        "EMISIONES"
      ],
      "alternatives": [
        "ALT-7be62a8c66",
        "ALT-33b6375f4b"
      ],
      "pareto_front": [
        "ALT-33b6375f4b"
      ],
      "dominated": [
        "ALT-7be62a8c66"
      ],
      "incomplete": [],
      "tradeoffs": {
        "matrix": {
          "ALT-7be62a8c66": {
            "MOVILIDAD_SOSTENIBLE": 55.0,
            "EMISIONES": 4800.0
          },
          "ALT-33b6375f4b": {
            "MOVILIDAD_SOSTENIBLE": 82.0,
            "EMISIONES": 3500.0
          }
        }
      },
      "state": "EXECUTED",
      "inputs_hash": "5ddca1e97ed6ea6a5fb4af205fd6ca9b56c7c76b803987ad1e5f1f7cfca33d22",
      "created_at": "2026-09-16T18:06:10.756082+00:00",
      "version": 1
    },
    "decision_created": false,
    "recommendation_created": false
  }
}
```

**22.** `$ /HUMAN REVIEW architect-yvan 2026-09-16T07:00:00Z "Revisión distrital" "Distrito validado" "Urban planner"`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "review_id": "REV-dd831f8d87",
    "project_id": "CIUDAD-001",
    "actor": "architect-yvan",
    "timestamp": "2026-09-16T07:00:00Z",
    "review": "Revisión distrital",
    "reason": "Distrito validado",
    "authority": "Urban planner",
    "status": "APPROVED",
    "version": 1
  }
}
```

**23.** `$ /DECISION RECORD "Adoptar CIUDAD-B" architect-yvan "Urban planner"`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "decision_id": "DEC-ad34504f2f",
    "project_id": "CIUDAD-001",
    "statement": "Adoptar CIUDAD-B",
    "actor": "architect-yvan",
    "authority": "Urban planner",
    "version": 1
  }
}
```

### Corrida 7 — METRO-001

**Descripción del caso:** PROVINCIA/METRÓPOLI (METRO-001) ===
**Fuente:** orden-189-sintaxis-corregida
**Estado:** **PASS**
**Comandos ejecutados:** 23; **fallos:** 0; **tiempo:** 0.0389 s

#### Snapshot persistido

| Campo | Resultado |
|---|---|
| `project_id` | `METRO-001` |
| `name` | `Área metropolitana de Trujillo` |
| `spatial_scope` | `provincia_metropoli` |
| `temporal_scope` | `escenario_2030` |
| `stage` | `DRAFT` |
| `version` | `22` |
| `facts` | `1` |
| `assumptions` | `0` |
| `evidence` | `1` |
| `objectives` | `2` |
| `constraints` | `1` |
| `alternatives` | `2` |
| `evaluations` | `4` |
| `comparisons` | `1` |
| `simulations` | `0` |
| `multiobjectives` | `1` |
| `human_reviews` | `1` |
| `decisions` | `1` |
| `events` | `22` |

#### Salida exacta por comando

**1.** `$ /PROJECT CREATE METRO-001 "Área metropolitana de Trujillo" provincia_metropoli escenario_2030`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "project_id": "METRO-001",
    "name": "Área metropolitana de Trujillo",
    "stage": "DRAFT",
    "version": 1,
    "objectives": {},
    "constraints": {},
    "roles": {},
    "actors": {},
    "positions": {},
    "temporal_cycles": {},
    "scenario_branches": {},
    "scenario_evolutions": {},
    "facts": {},
    "assumptions": {},
    "preferences": {},
    "decisions": {},
    "human_reviews": {},
    "alternatives": {},
    "evaluations": {},
    "comparisons": {},
    "recommendations": {},
    "evidence": {},
    "sources": {},
    "simulations": {},
    "multiobjective_results": {},
    "generated_alternatives": {},
    "planning_instruments": {},
    "regulations": {},
    "interpretations": {},
    "normative_snapshots": {},
    "spatial_scope": "provincia_metropoli",
    "temporal_scope": "escenario_2030",
    "scale_relations": {}
  }
}
```

**2.** `$ /PROJECT OPEN METRO-001`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "project_id": "METRO-001",
    "name": "Área metropolitana de Trujillo",
    "stage": "DRAFT",
    "version": 1,
    "objectives": {},
    "constraints": {},
    "roles": {},
    "actors": {},
    "positions": {},
    "temporal_cycles": {},
    "scenario_branches": {},
    "scenario_evolutions": {},
    "facts": {},
    "assumptions": {},
    "preferences": {},
    "decisions": {},
    "human_reviews": {},
    "alternatives": {},
    "evaluations": {},
    "comparisons": {},
    "recommendations": {},
    "evidence": {},
    "sources": {},
    "simulations": {},
    "multiobjective_results": {},
    "generated_alternatives": {},
    "planning_instruments": {},
    "regulations": {},
    "interpretations": {},
    "normative_snapshots": {},
    "spatial_scope": "provincia_metropoli",
    "temporal_scope": "escenario_2030",
    "scale_relations": {}
  }
}
```

**3.** `$ /FACT SET "El área metropolitana tiene 1000000 habitantes" INEI`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "fact_id": "FACT-165740d6ef",
    "project_id": "METRO-001",
    "statement": "El área metropolitana tiene 1000000 habitantes",
    "source": "INEI",
    "version": 1
  }
}
```

**4.** `$ /EVIDENCE ADD EVD-M001 "Déficit de agua 15 por ciento" DOCUMENT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evidence_id": "EVD-M001",
    "project_id": "METRO-001",
    "source_id": null,
    "statement": "Déficit de agua 15 por ciento",
    "evidence_type": "DOCUMENT",
    "captured_at": "2026-09-16 18:06:10.765899+00:00",
    "method_version": "CLI/1.0",
    "evidence_url": null,
    "evidence_hash": "354995983a47d32a1f098b8cc5799c9e474aa86ac4e473f9207153f0ce76138b",
    "state": "OBSERVED",
    "version": 1
  }
}
```

**5.** `$ /OBJECTIVE SET COBERTURA_AGUA MAXIMIZE 95`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "objective_id": "OBJ-e6997bb7c3",
    "project_id": "METRO-001",
    "key": "COBERTURA_AGUA",
    "direction": "MAXIMIZE",
    "value": "95",
    "version": 1,
    "source_parent_objective_id": null
  }
}
```

**6.** `$ /OBJECTIVE SET INVERSION MINIMIZE 500`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "objective_id": "OBJ-736fbbc219",
    "project_id": "METRO-001",
    "key": "INVERSION",
    "direction": "MINIMIZE",
    "value": "500",
    "version": 1,
    "source_parent_objective_id": null
  }
}
```

**7.** `$ /CONSTRAINT SET INVERSION <= 500 MILLONES_USD`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "constraint_id": "CON-bcde67c528",
    "project_id": "METRO-001",
    "key": "INVERSION",
    "operator": "<=",
    "value": "500",
    "unit": "MILLONES_USD",
    "hard": true,
    "version": 1
  }
}
```

**8.** `$ /ALTERNATIVE CREATE METRO-A`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-a89f5708d3",
    "project_id": "METRO-001",
    "name": "METRO-A",
    "description": "",
    "parameters": {},
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**9.** `$ /ALTERNATIVE SET METRO-A plantas 1`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-a89f5708d3",
    "project_id": "METRO-001",
    "name": "METRO-A",
    "description": "",
    "parameters": {
      "plantas": "1"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**10.** `$ /ALTERNATIVE SET METRO-A cobertura 80`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-a89f5708d3",
    "project_id": "METRO-001",
    "name": "METRO-A",
    "description": "",
    "parameters": {
      "plantas": "1",
      "cobertura": "80"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**11.** `$ /ALTERNATIVE SET METRO-A inversion 450`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-a89f5708d3",
    "project_id": "METRO-001",
    "name": "METRO-A",
    "description": "",
    "parameters": {
      "cobertura": "80",
      "plantas": "1",
      "inversion": "450"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**12.** `$ /ALTERNATIVE CREATE METRO-B`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-dbb36be516",
    "project_id": "METRO-001",
    "name": "METRO-B",
    "description": "",
    "parameters": {},
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**13.** `$ /ALTERNATIVE SET METRO-B plantas 3`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-dbb36be516",
    "project_id": "METRO-001",
    "name": "METRO-B",
    "description": "",
    "parameters": {
      "plantas": "3"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**14.** `$ /ALTERNATIVE SET METRO-B cobertura 92`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-dbb36be516",
    "project_id": "METRO-001",
    "name": "METRO-B",
    "description": "",
    "parameters": {
      "plantas": "3",
      "cobertura": "92"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**15.** `$ /ALTERNATIVE SET METRO-B inversion 480`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-dbb36be516",
    "project_id": "METRO-001",
    "name": "METRO-B",
    "description": "",
    "parameters": {
      "cobertura": "92",
      "plantas": "3",
      "inversion": "480"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**16.** `$ /EVALUATE METRO-A COBERTURA_AGUA 80 SCORE 0.8 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-766a780dc3",
    "alternative_id": "ALT-a89f5708d3",
    "objective_id": "OBJ-e6997bb7c3",
    "value": 80.0,
    "unit": "SCORE",
    "confidence": 0.8,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**17.** `$ /EVALUATE METRO-A INVERSION 450 SCORE 0.8 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-21f6f9c76b",
    "alternative_id": "ALT-a89f5708d3",
    "objective_id": "OBJ-736fbbc219",
    "value": 450.0,
    "unit": "SCORE",
    "confidence": 0.8,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**18.** `$ /EVALUATE METRO-B COBERTURA_AGUA 92 SCORE 0.8 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-deaec6d83d",
    "alternative_id": "ALT-dbb36be516",
    "objective_id": "OBJ-e6997bb7c3",
    "value": 92.0,
    "unit": "SCORE",
    "confidence": 0.8,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**19.** `$ /EVALUATE METRO-B INVERSION 480 SCORE 0.8 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-295dabe3a8",
    "alternative_id": "ALT-dbb36be516",
    "objective_id": "OBJ-736fbbc219",
    "value": 480.0,
    "unit": "SCORE",
    "confidence": 0.8,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**20.** `$ /COMPARE METRO-A METRO-B`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "comparison_id": "CMP-26ad61c64d",
    "project_id": "METRO-001",
    "alternative_ids": [
      "ALT-a89f5708d3",
      "ALT-dbb36be516"
    ],
    "evaluations": [
      {
        "evaluation_id": "EVAL-766a780dc3",
        "alternative_id": "ALT-a89f5708d3",
        "objective_id": "OBJ-e6997bb7c3",
        "value": 80.0,
        "unit": "SCORE",
        "confidence": 0.8,
        "source": "USER_INPUT",
        "version": 1
      },
      {
        "evaluation_id": "EVAL-21f6f9c76b",
        "alternative_id": "ALT-a89f5708d3",
        "objective_id": "OBJ-736fbbc219",
        "value": 450.0,
        "unit": "SCORE",
        "confidence": 0.8,
        "source": "USER_INPUT",
        "version": 1
      },
      {
        "evaluation_id": "EVAL-deaec6d83d",
        "alternative_id": "ALT-dbb36be516",
        "objective_id": "OBJ-e6997bb7c3",
        "value": 92.0,
        "unit": "SCORE",
        "confidence": 0.8,
        "source": "USER_INPUT",
        "version": 1
      },
      {
        "evaluation_id": "EVAL-295dabe3a8",
        "alternative_id": "ALT-dbb36be516",
        "objective_id": "OBJ-736fbbc219",
        "value": 480.0,
        "unit": "SCORE",
        "confidence": 0.8,
        "source": "USER_INPUT",
        "version": 1
      }
    ],
    "tradeoffs": {},
    "version": 1
  }
}
```

**21.** `$ /MULTIOBJECTIVE PARETO COBERTURA_AGUA INVERSION`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "multiobjective": {
      "multiobjective_id": "MOBJ-dd716408e6",
      "project_id": "METRO-001",
      "method": "pareto_front_v1",
      "method_version": "1.0",
      "objectives": [
        "COBERTURA_AGUA",
        "INVERSION"
      ],
      "alternatives": [
        "ALT-a89f5708d3",
        "ALT-dbb36be516"
      ],
      "pareto_front": [
        "ALT-a89f5708d3",
        "ALT-dbb36be516"
      ],
      "dominated": [],
      "incomplete": [],
      "tradeoffs": {
        "matrix": {
          "ALT-a89f5708d3": {
            "COBERTURA_AGUA": 80.0,
            "INVERSION": 450.0
          },
          "ALT-dbb36be516": {
            "COBERTURA_AGUA": 92.0,
            "INVERSION": 480.0
          }
        }
      },
      "state": "EXECUTED",
      "inputs_hash": "fc77de46068b4dd6d591a473c248bd8cbfaa504e447affda854e6ef69624a015",
      "created_at": "2026-09-16T18:06:10.795730+00:00",
      "version": 1
    },
    "decision_created": false,
    "recommendation_created": false
  }
}
```

**22.** `$ /HUMAN REVIEW architect-yvan 2026-09-16T07:00:00Z "Revisión metropolitana" "Área validada" "Regional planner"`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "review_id": "REV-da6e5ff598",
    "project_id": "METRO-001",
    "actor": "architect-yvan",
    "timestamp": "2026-09-16T07:00:00Z",
    "review": "Revisión metropolitana",
    "reason": "Área validada",
    "authority": "Regional planner",
    "status": "APPROVED",
    "version": 1
  }
}
```

**23.** `$ /DECISION RECORD "Adoptar METRO-B" architect-yvan "Regional planner"`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "decision_id": "DEC-60e0f7a082",
    "project_id": "METRO-001",
    "statement": "Adoptar METRO-B",
    "actor": "architect-yvan",
    "authority": "Regional planner",
    "version": 1
  }
}
```

### Corrida 8 — REGION-001

**Descripción del caso:** REGIÓN (REGION-001) ===
**Fuente:** orden-189-sintaxis-corregida
**Estado:** **PASS**
**Comandos ejecutados:** 21; **fallos:** 0; **tiempo:** 0.0271 s

#### Snapshot persistido

| Campo | Resultado |
|---|---|
| `project_id` | `REGION-001` |
| `name` | `Región La Libertad` |
| `spatial_scope` | `region` |
| `temporal_scope` | `escenario_2040` |
| `stage` | `DRAFT` |
| `version` | `20` |
| `facts` | `1` |
| `assumptions` | `0` |
| `evidence` | `1` |
| `objectives` | `2` |
| `constraints` | `1` |
| `alternatives` | `2` |
| `evaluations` | `4` |
| `comparisons` | `1` |
| `simulations` | `0` |
| `multiobjectives` | `1` |
| `human_reviews` | `1` |
| `decisions` | `1` |
| `events` | `20` |

#### Salida exacta por comando

**1.** `$ /PROJECT CREATE REGION-001 "Región La Libertad" region escenario_2040`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "project_id": "REGION-001",
    "name": "Región La Libertad",
    "stage": "DRAFT",
    "version": 1,
    "objectives": {},
    "constraints": {},
    "roles": {},
    "actors": {},
    "positions": {},
    "temporal_cycles": {},
    "scenario_branches": {},
    "scenario_evolutions": {},
    "facts": {},
    "assumptions": {},
    "preferences": {},
    "decisions": {},
    "human_reviews": {},
    "alternatives": {},
    "evaluations": {},
    "comparisons": {},
    "recommendations": {},
    "evidence": {},
    "sources": {},
    "simulations": {},
    "multiobjective_results": {},
    "generated_alternatives": {},
    "planning_instruments": {},
    "regulations": {},
    "interpretations": {},
    "normative_snapshots": {},
    "spatial_scope": "region",
    "temporal_scope": "escenario_2040",
    "scale_relations": {}
  }
}
```

**2.** `$ /PROJECT OPEN REGION-001`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "project_id": "REGION-001",
    "name": "Región La Libertad",
    "stage": "DRAFT",
    "version": 1,
    "objectives": {},
    "constraints": {},
    "roles": {},
    "actors": {},
    "positions": {},
    "temporal_cycles": {},
    "scenario_branches": {},
    "scenario_evolutions": {},
    "facts": {},
    "assumptions": {},
    "preferences": {},
    "decisions": {},
    "human_reviews": {},
    "alternatives": {},
    "evaluations": {},
    "comparisons": {},
    "recommendations": {},
    "evidence": {},
    "sources": {},
    "simulations": {},
    "multiobjective_results": {},
    "generated_alternatives": {},
    "planning_instruments": {},
    "regulations": {},
    "interpretations": {},
    "normative_snapshots": {},
    "spatial_scope": "region",
    "temporal_scope": "escenario_2040",
    "scale_relations": {}
  }
}
```

**3.** `$ /FACT SET "La región tiene 2000000 habitantes" INEI`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "fact_id": "FACT-cdc2f20de8",
    "project_id": "REGION-001",
    "statement": "La región tiene 2000000 habitantes",
    "source": "INEI",
    "version": 1
  }
}
```

**4.** `$ /EVIDENCE ADD EVD-RG001 "PBI regional 30000 millones USD" DOCUMENT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evidence_id": "EVD-RG001",
    "project_id": "REGION-001",
    "source_id": null,
    "statement": "PBI regional 30000 millones USD",
    "evidence_type": "DOCUMENT",
    "captured_at": "2026-09-16 18:06:10.805708+00:00",
    "method_version": "CLI/1.0",
    "evidence_url": null,
    "evidence_hash": "954af2ff7efded11f179840fdc65ab4c738199349234364127e4f74ef55d88e4",
    "state": "OBSERVED",
    "version": 1
  }
}
```

**5.** `$ /OBJECTIVE SET PBI_PER_CAPITA MAXIMIZE 9000`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "objective_id": "OBJ-039629be5a",
    "project_id": "REGION-001",
    "key": "PBI_PER_CAPITA",
    "direction": "MAXIMIZE",
    "value": "9000",
    "version": 1,
    "source_parent_objective_id": null
  }
}
```

**6.** `$ /OBJECTIVE SET DESIGUALDAD MINIMIZE 0.35`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "objective_id": "OBJ-bbb9605b1c",
    "project_id": "REGION-001",
    "key": "DESIGUALDAD",
    "direction": "MINIMIZE",
    "value": "0.35",
    "version": 1,
    "source_parent_objective_id": null
  }
}
```

**7.** `$ /CONSTRAINT SET DESIGUALDAD <= 0.35 GINI`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "constraint_id": "CON-909a9b77e4",
    "project_id": "REGION-001",
    "key": "DESIGUALDAD",
    "operator": "<=",
    "value": "0.35",
    "unit": "GINI",
    "hard": true,
    "version": 1
  }
}
```

**8.** `$ /ALTERNATIVE CREATE REGION-A`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-4c6e56d16b",
    "project_id": "REGION-001",
    "name": "REGION-A",
    "description": "",
    "parameters": {},
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**9.** `$ /ALTERNATIVE SET REGION-A pbi_per_capita 9000`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-4c6e56d16b",
    "project_id": "REGION-001",
    "name": "REGION-A",
    "description": "",
    "parameters": {
      "pbi_per_capita": "9000"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**10.** `$ /ALTERNATIVE SET REGION-A gini 0.42`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-4c6e56d16b",
    "project_id": "REGION-001",
    "name": "REGION-A",
    "description": "",
    "parameters": {
      "pbi_per_capita": "9000",
      "gini": "0.42"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**11.** `$ /ALTERNATIVE CREATE REGION-B`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-84cb9f3d05",
    "project_id": "REGION-001",
    "name": "REGION-B",
    "description": "",
    "parameters": {},
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**12.** `$ /ALTERNATIVE SET REGION-B pbi_per_capita 9500`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-84cb9f3d05",
    "project_id": "REGION-001",
    "name": "REGION-B",
    "description": "",
    "parameters": {
      "pbi_per_capita": "9500"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**13.** `$ /ALTERNATIVE SET REGION-B gini 0.30`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-84cb9f3d05",
    "project_id": "REGION-001",
    "name": "REGION-B",
    "description": "",
    "parameters": {
      "pbi_per_capita": "9500",
      "gini": "0.30"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**14.** `$ /EVALUATE REGION-A PBI_PER_CAPITA 9000 SCORE 0.8 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-4e8e3dbe19",
    "alternative_id": "ALT-4c6e56d16b",
    "objective_id": "OBJ-039629be5a",
    "value": 9000.0,
    "unit": "SCORE",
    "confidence": 0.8,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**15.** `$ /EVALUATE REGION-A DESIGUALDAD 0.42 SCORE 0.8 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-3787f5e7a2",
    "alternative_id": "ALT-4c6e56d16b",
    "objective_id": "OBJ-bbb9605b1c",
    "value": 0.42,
    "unit": "SCORE",
    "confidence": 0.8,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**16.** `$ /EVALUATE REGION-B PBI_PER_CAPITA 9500 SCORE 0.8 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-5eca8c89dc",
    "alternative_id": "ALT-84cb9f3d05",
    "objective_id": "OBJ-039629be5a",
    "value": 9500.0,
    "unit": "SCORE",
    "confidence": 0.8,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**17.** `$ /EVALUATE REGION-B DESIGUALDAD 0.30 SCORE 0.8 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-5cc5732f04",
    "alternative_id": "ALT-84cb9f3d05",
    "objective_id": "OBJ-bbb9605b1c",
    "value": 0.3,
    "unit": "SCORE",
    "confidence": 0.8,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**18.** `$ /COMPARE REGION-A REGION-B`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "comparison_id": "CMP-f28c0d26a2",
    "project_id": "REGION-001",
    "alternative_ids": [
      "ALT-4c6e56d16b",
      "ALT-84cb9f3d05"
    ],
    "evaluations": [
      {
        "evaluation_id": "EVAL-4e8e3dbe19",
        "alternative_id": "ALT-4c6e56d16b",
        "objective_id": "OBJ-039629be5a",
        "value": 9000.0,
        "unit": "SCORE",
        "confidence": 0.8,
        "source": "USER_INPUT",
        "version": 1
      },
      {
        "evaluation_id": "EVAL-3787f5e7a2",
        "alternative_id": "ALT-4c6e56d16b",
        "objective_id": "OBJ-bbb9605b1c",
        "value": 0.42,
        "unit": "SCORE",
        "confidence": 0.8,
        "source": "USER_INPUT",
        "version": 1
      },
      {
        "evaluation_id": "EVAL-5eca8c89dc",
        "alternative_id": "ALT-84cb9f3d05",
        "objective_id": "OBJ-039629be5a",
        "value": 9500.0,
        "unit": "SCORE",
        "confidence": 0.8,
        "source": "USER_INPUT",
        "version": 1
      },
      {
        "evaluation_id": "EVAL-5cc5732f04",
        "alternative_id": "ALT-84cb9f3d05",
        "objective_id": "OBJ-bbb9605b1c",
        "value": 0.3,
        "unit": "SCORE",
        "confidence": 0.8,
        "source": "USER_INPUT",
        "version": 1
      }
    ],
    "tradeoffs": {},
    "version": 1
  }
}
```

**19.** `$ /MULTIOBJECTIVE PARETO PBI_PER_CAPITA DESIGUALDAD`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "multiobjective": {
      "multiobjective_id": "MOBJ-e96f19d476",
      "project_id": "REGION-001",
      "method": "pareto_front_v1",
      "method_version": "1.0",
      "objectives": [
        "PBI_PER_CAPITA",
        "DESIGUALDAD"
      ],
      "alternatives": [
        "ALT-4c6e56d16b",
        "ALT-84cb9f3d05"
      ],
      "pareto_front": [
        "ALT-84cb9f3d05"
      ],
      "dominated": [
        "ALT-4c6e56d16b"
      ],
      "incomplete": [],
      "tradeoffs": {
        "matrix": {
          "ALT-4c6e56d16b": {
            "PBI_PER_CAPITA": 9000.0,
            "DESIGUALDAD": 0.42
          },
          "ALT-84cb9f3d05": {
            "PBI_PER_CAPITA": 9500.0,
            "DESIGUALDAD": 0.3
          }
        }
      },
      "state": "EXECUTED",
      "inputs_hash": "2885cb3b25c22fe278e03618392916346693cdc30fd24865607389e25cdcebd7",
      "created_at": "2026-09-16T18:06:10.825076+00:00",
      "version": 1
    },
    "decision_created": false,
    "recommendation_created": false
  }
}
```

**20.** `$ /HUMAN REVIEW architect-yvan 2026-09-16T07:00:00Z "Revisión regional" "Región validada" "Regional planner"`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "review_id": "REV-80e40d7649",
    "project_id": "REGION-001",
    "actor": "architect-yvan",
    "timestamp": "2026-09-16T07:00:00Z",
    "review": "Revisión regional",
    "reason": "Región validada",
    "authority": "Regional planner",
    "status": "APPROVED",
    "version": 1
  }
}
```

**21.** `$ /DECISION RECORD "Adoptar REGION-B" architect-yvan "Regional planner"`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "decision_id": "DEC-7f63018512",
    "project_id": "REGION-001",
    "statement": "Adoptar REGION-B",
    "actor": "architect-yvan",
    "authority": "Regional planner",
    "version": 1
  }
}
```

### Corrida 9 — PAIS-001

**Descripción del caso:** PAÍS (PAIS-001) ===
**Fuente:** orden-189-sintaxis-corregida
**Estado:** **PASS**
**Comandos ejecutados:** 23; **fallos:** 0; **tiempo:** 0.0337 s

#### Snapshot persistido

| Campo | Resultado |
|---|---|
| `project_id` | `PAIS-001` |
| `name` | `Perú al 2050` |
| `spatial_scope` | `pais` |
| `temporal_scope` | `escenario_2050` |
| `stage` | `DRAFT` |
| `version` | `22` |
| `facts` | `1` |
| `assumptions` | `0` |
| `evidence` | `1` |
| `objectives` | `2` |
| `constraints` | `1` |
| `alternatives` | `2` |
| `evaluations` | `4` |
| `comparisons` | `1` |
| `simulations` | `0` |
| `multiobjectives` | `1` |
| `human_reviews` | `1` |
| `decisions` | `1` |
| `events` | `22` |

#### Salida exacta por comando

**1.** `$ /PROJECT CREATE PAIS-001 "Perú al 2050" pais escenario_2050`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "project_id": "PAIS-001",
    "name": "Perú al 2050",
    "stage": "DRAFT",
    "version": 1,
    "objectives": {},
    "constraints": {},
    "roles": {},
    "actors": {},
    "positions": {},
    "temporal_cycles": {},
    "scenario_branches": {},
    "scenario_evolutions": {},
    "facts": {},
    "assumptions": {},
    "preferences": {},
    "decisions": {},
    "human_reviews": {},
    "alternatives": {},
    "evaluations": {},
    "comparisons": {},
    "recommendations": {},
    "evidence": {},
    "sources": {},
    "simulations": {},
    "multiobjective_results": {},
    "generated_alternatives": {},
    "planning_instruments": {},
    "regulations": {},
    "interpretations": {},
    "normative_snapshots": {},
    "spatial_scope": "pais",
    "temporal_scope": "escenario_2050",
    "scale_relations": {}
  }
}
```

**2.** `$ /PROJECT OPEN PAIS-001`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "project_id": "PAIS-001",
    "name": "Perú al 2050",
    "stage": "DRAFT",
    "version": 1,
    "objectives": {},
    "constraints": {},
    "roles": {},
    "actors": {},
    "positions": {},
    "temporal_cycles": {},
    "scenario_branches": {},
    "scenario_evolutions": {},
    "facts": {},
    "assumptions": {},
    "preferences": {},
    "decisions": {},
    "human_reviews": {},
    "alternatives": {},
    "evaluations": {},
    "comparisons": {},
    "recommendations": {},
    "evidence": {},
    "sources": {},
    "simulations": {},
    "multiobjective_results": {},
    "generated_alternatives": {},
    "planning_instruments": {},
    "regulations": {},
    "interpretations": {},
    "normative_snapshots": {},
    "spatial_scope": "pais",
    "temporal_scope": "escenario_2050",
    "scale_relations": {}
  }
}
```

**3.** `$ /FACT SET "El Perú tiene 34000000 habitantes" INEI`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "fact_id": "FACT-23c8d37022",
    "project_id": "PAIS-001",
    "statement": "El Perú tiene 34000000 habitantes",
    "source": "INEI",
    "version": 1
  }
}
```

**4.** `$ /EVIDENCE ADD EVD-P001 "PBI per cápita actual 7000 USD" DOCUMENT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evidence_id": "EVD-P001",
    "project_id": "PAIS-001",
    "source_id": null,
    "statement": "PBI per cápita actual 7000 USD",
    "evidence_type": "DOCUMENT",
    "captured_at": "2026-09-16 18:06:10.834731+00:00",
    "method_version": "CLI/1.0",
    "evidence_url": null,
    "evidence_hash": "d192e8fcbb0711176b1d6b88973828f3b468c5108e21eebc50736ca1b67fa023",
    "state": "OBSERVED",
    "version": 1
  }
}
```

**5.** `$ /OBJECTIVE SET DESARROLLO_HUMANO MAXIMIZE 95`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "objective_id": "OBJ-504ea1d37f",
    "project_id": "PAIS-001",
    "key": "DESARROLLO_HUMANO",
    "direction": "MAXIMIZE",
    "value": "95",
    "version": 1,
    "source_parent_objective_id": null
  }
}
```

**6.** `$ /OBJECTIVE SET GINI MINIMIZE 0.30`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "objective_id": "OBJ-afda1ed13a",
    "project_id": "PAIS-001",
    "key": "GINI",
    "direction": "MINIMIZE",
    "value": "0.30",
    "version": 1,
    "source_parent_objective_id": null
  }
}
```

**7.** `$ /CONSTRAINT SET DEUDA_PUBLICA <= 40 PERCENT_PBI`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "constraint_id": "CON-7fed816215",
    "project_id": "PAIS-001",
    "key": "DEUDA_PUBLICA",
    "operator": "<=",
    "value": "40",
    "unit": "PERCENT_PBI",
    "hard": true,
    "version": 1
  }
}
```

**8.** `$ /ALTERNATIVE CREATE PAIS-A`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-a242f00094",
    "project_id": "PAIS-001",
    "name": "PAIS-A",
    "description": "",
    "parameters": {},
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**9.** `$ /ALTERNATIVE SET PAIS-A pbi_per_capita 15000`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-a242f00094",
    "project_id": "PAIS-001",
    "name": "PAIS-A",
    "description": "",
    "parameters": {
      "pbi_per_capita": "15000"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**10.** `$ /ALTERNATIVE SET PAIS-A idh 0.72`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-a242f00094",
    "project_id": "PAIS-001",
    "name": "PAIS-A",
    "description": "",
    "parameters": {
      "pbi_per_capita": "15000",
      "idh": "0.72"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**11.** `$ /ALTERNATIVE SET PAIS-A gini 0.40`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-a242f00094",
    "project_id": "PAIS-001",
    "name": "PAIS-A",
    "description": "",
    "parameters": {
      "idh": "0.72",
      "pbi_per_capita": "15000",
      "gini": "0.40"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**12.** `$ /ALTERNATIVE CREATE PAIS-B`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-fe6be8f331",
    "project_id": "PAIS-001",
    "name": "PAIS-B",
    "description": "",
    "parameters": {},
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**13.** `$ /ALTERNATIVE SET PAIS-B pbi_per_capita 18000`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-fe6be8f331",
    "project_id": "PAIS-001",
    "name": "PAIS-B",
    "description": "",
    "parameters": {
      "pbi_per_capita": "18000"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**14.** `$ /ALTERNATIVE SET PAIS-B idh 0.85`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-fe6be8f331",
    "project_id": "PAIS-001",
    "name": "PAIS-B",
    "description": "",
    "parameters": {
      "pbi_per_capita": "18000",
      "idh": "0.85"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**15.** `$ /ALTERNATIVE SET PAIS-B gini 0.30`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-fe6be8f331",
    "project_id": "PAIS-001",
    "name": "PAIS-B",
    "description": "",
    "parameters": {
      "idh": "0.85",
      "pbi_per_capita": "18000",
      "gini": "0.30"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**16.** `$ /EVALUATE PAIS-A DESARROLLO_HUMANO 72 SCORE 0.7 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-302b163e51",
    "alternative_id": "ALT-a242f00094",
    "objective_id": "OBJ-504ea1d37f",
    "value": 72.0,
    "unit": "SCORE",
    "confidence": 0.7,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**17.** `$ /EVALUATE PAIS-A GINI 0.40 SCORE 0.7 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-5686dc1de7",
    "alternative_id": "ALT-a242f00094",
    "objective_id": "OBJ-afda1ed13a",
    "value": 0.4,
    "unit": "SCORE",
    "confidence": 0.7,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**18.** `$ /EVALUATE PAIS-B DESARROLLO_HUMANO 85 SCORE 0.7 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-cc7243e2f8",
    "alternative_id": "ALT-fe6be8f331",
    "objective_id": "OBJ-504ea1d37f",
    "value": 85.0,
    "unit": "SCORE",
    "confidence": 0.7,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**19.** `$ /EVALUATE PAIS-B GINI 0.30 SCORE 0.7 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-bdedeea771",
    "alternative_id": "ALT-fe6be8f331",
    "objective_id": "OBJ-afda1ed13a",
    "value": 0.3,
    "unit": "SCORE",
    "confidence": 0.7,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**20.** `$ /COMPARE PAIS-A PAIS-B`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "comparison_id": "CMP-6cd41a93ba",
    "project_id": "PAIS-001",
    "alternative_ids": [
      "ALT-a242f00094",
      "ALT-fe6be8f331"
    ],
    "evaluations": [
      {
        "evaluation_id": "EVAL-302b163e51",
        "alternative_id": "ALT-a242f00094",
        "objective_id": "OBJ-504ea1d37f",
        "value": 72.0,
        "unit": "SCORE",
        "confidence": 0.7,
        "source": "USER_INPUT",
        "version": 1
      },
      {
        "evaluation_id": "EVAL-5686dc1de7",
        "alternative_id": "ALT-a242f00094",
        "objective_id": "OBJ-afda1ed13a",
        "value": 0.4,
        "unit": "SCORE",
        "confidence": 0.7,
        "source": "USER_INPUT",
        "version": 1
      },
      {
        "evaluation_id": "EVAL-cc7243e2f8",
        "alternative_id": "ALT-fe6be8f331",
        "objective_id": "OBJ-504ea1d37f",
        "value": 85.0,
        "unit": "SCORE",
        "confidence": 0.7,
        "source": "USER_INPUT",
        "version": 1
      },
      {
        "evaluation_id": "EVAL-bdedeea771",
        "alternative_id": "ALT-fe6be8f331",
        "objective_id": "OBJ-afda1ed13a",
        "value": 0.3,
        "unit": "SCORE",
        "confidence": 0.7,
        "source": "USER_INPUT",
        "version": 1
      }
    ],
    "tradeoffs": {},
    "version": 1
  }
}
```

**21.** `$ /MULTIOBJECTIVE PARETO DESARROLLO_HUMANO GINI`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "multiobjective": {
      "multiobjective_id": "MOBJ-5477a3a2f7",
      "project_id": "PAIS-001",
      "method": "pareto_front_v1",
      "method_version": "1.0",
      "objectives": [
        "DESARROLLO_HUMANO",
        "GINI"
      ],
      "alternatives": [
        "ALT-a242f00094",
        "ALT-fe6be8f331"
      ],
      "pareto_front": [
        "ALT-fe6be8f331"
      ],
      "dominated": [
        "ALT-a242f00094"
      ],
      "incomplete": [],
      "tradeoffs": {
        "matrix": {
          "ALT-a242f00094": {
            "DESARROLLO_HUMANO": 72.0,
            "GINI": 0.4
          },
          "ALT-fe6be8f331": {
            "DESARROLLO_HUMANO": 85.0,
            "GINI": 0.3
          }
        }
      },
      "state": "EXECUTED",
      "inputs_hash": "96fbfd0def6d6c38c37896257528a5f4528baf4bfd213af53d26e52fe9e321aa",
      "created_at": "2026-09-16T18:06:10.859833+00:00",
      "version": 1
    },
    "decision_created": false,
    "recommendation_created": false
  }
}
```

**22.** `$ /HUMAN REVIEW architect-yvan 2026-09-16T07:00:00Z "Revisión nacional" "País validado" "National planner"`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "review_id": "REV-67a4eb65fd",
    "project_id": "PAIS-001",
    "actor": "architect-yvan",
    "timestamp": "2026-09-16T07:00:00Z",
    "review": "Revisión nacional",
    "reason": "País validado",
    "authority": "National planner",
    "status": "APPROVED",
    "version": 1
  }
}
```

**23.** `$ /DECISION RECORD "Adoptar PAIS-B" architect-yvan "National planner"`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "decision_id": "DEC-8e0475f5c6",
    "project_id": "PAIS-001",
    "statement": "Adoptar PAIS-B",
    "actor": "architect-yvan",
    "authority": "National planner",
    "version": 1
  }
}
```

### Corrida 10 — MULTI-001

**Descripción del caso:** 10 — MULTIESCALA (MULTI-001) — caso sintético añadido porque la orden adjunta termina en el proyecto 9
**Fuente:** caso-sintético-complementario
**Estado:** **PASS**
**Comandos ejecutados:** 25; **fallos:** 0; **tiempo:** 0.0332 s

#### Snapshot persistido

| Campo | Resultado |
|---|---|
| `project_id` | `MULTI-001` |
| `name` | `Corredor territorial Andes-Costa` |
| `spatial_scope` | `pais` |
| `temporal_scope` | `escenario_2050` |
| `stage` | `DRAFT` |
| `version` | `24` |
| `facts` | `2` |
| `assumptions` | `1` |
| `evidence` | `2` |
| `objectives` | `2` |
| `constraints` | `2` |
| `alternatives` | `2` |
| `evaluations` | `4` |
| `comparisons` | `1` |
| `simulations` | `0` |
| `multiobjectives` | `1` |
| `human_reviews` | `1` |
| `decisions` | `1` |
| `events` | `24` |

#### Salida exacta por comando

**1.** `$ /PROJECT CREATE MULTI-001 "Corredor territorial Andes-Costa" pais escenario_2050`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "project_id": "MULTI-001",
    "name": "Corredor territorial Andes-Costa",
    "stage": "DRAFT",
    "version": 1,
    "objectives": {},
    "constraints": {},
    "roles": {},
    "actors": {},
    "positions": {},
    "temporal_cycles": {},
    "scenario_branches": {},
    "scenario_evolutions": {},
    "facts": {},
    "assumptions": {},
    "preferences": {},
    "decisions": {},
    "human_reviews": {},
    "alternatives": {},
    "evaluations": {},
    "comparisons": {},
    "recommendations": {},
    "evidence": {},
    "sources": {},
    "simulations": {},
    "multiobjective_results": {},
    "generated_alternatives": {},
    "planning_instruments": {},
    "regulations": {},
    "interpretations": {},
    "normative_snapshots": {},
    "spatial_scope": "pais",
    "temporal_scope": "escenario_2050",
    "scale_relations": {}
  }
}
```

**2.** `$ /PROJECT OPEN MULTI-001`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "project_id": "MULTI-001",
    "name": "Corredor territorial Andes-Costa",
    "stage": "DRAFT",
    "version": 1,
    "objectives": {},
    "constraints": {},
    "roles": {},
    "actors": {},
    "positions": {},
    "temporal_cycles": {},
    "scenario_branches": {},
    "scenario_evolutions": {},
    "facts": {},
    "assumptions": {},
    "preferences": {},
    "decisions": {},
    "human_reviews": {},
    "alternatives": {},
    "evaluations": {},
    "comparisons": {},
    "recommendations": {},
    "evidence": {},
    "sources": {},
    "simulations": {},
    "multiobjective_results": {},
    "generated_alternatives": {},
    "planning_instruments": {},
    "regulations": {},
    "interpretations": {},
    "normative_snapshots": {},
    "spatial_scope": "pais",
    "temporal_scope": "escenario_2050",
    "scale_relations": {}
  }
}
```

**3.** `$ /FACT SET "El corredor conecta ciudades de costa y sierra con presión creciente sobre agua y movilidad" CEPLAN`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "fact_id": "FACT-8ad152c7ef",
    "project_id": "MULTI-001",
    "statement": "El corredor conecta ciudades de costa y sierra con presión creciente sobre agua y movilidad",
    "source": "CEPLAN",
    "version": 1
  }
}
```

**4.** `$ /FACT SET "La población urbana del corredor supera 2 millones de habitantes" INEI`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "fact_id": "FACT-cef715f91e",
    "project_id": "MULTI-001",
    "statement": "La población urbana del corredor supera 2 millones de habitantes",
    "source": "INEI",
    "version": 1
  }
}
```

**5.** `$ /ASSUMPTION SET "La coordinación intermunicipal continuará hasta 2050" GOBERNANZA`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "assumption_id": "ASM-ee5d624e16",
    "project_id": "MULTI-001",
    "statement": "La coordinación intermunicipal continuará hasta 2050",
    "basis": "GOBERNANZA",
    "version": 1
  }
}
```

**6.** `$ /EVIDENCE ADD EVD-M001 "Diagnóstico territorial y de infraestructura" DOCUMENT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evidence_id": "EVD-M001",
    "project_id": "MULTI-001",
    "source_id": null,
    "statement": "Diagnóstico territorial y de infraestructura",
    "evidence_type": "DOCUMENT",
    "captured_at": "2026-09-16 18:06:10.870659+00:00",
    "method_version": "CLI/1.0",
    "evidence_url": null,
    "evidence_hash": "e44a8ed3a123e2dafea0a1e2f2852523ad29ff101e192d5c0b7e263ccc5a3c27",
    "state": "OBSERVED",
    "version": 1
  }
}
```

**7.** `$ /EVIDENCE ADD EVD-M002 "Serie histórica de movilidad y agua" MEASUREMENT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evidence_id": "EVD-M002",
    "project_id": "MULTI-001",
    "source_id": null,
    "statement": "Serie histórica de movilidad y agua",
    "evidence_type": "MEASUREMENT",
    "captured_at": "2026-09-16 18:06:10.871963+00:00",
    "method_version": "CLI/1.0",
    "evidence_url": null,
    "evidence_hash": "f358dfdc0d667bf6b3567a22d3b8efac6f34b840d9fddad65845d46943789318",
    "state": "OBSERVED",
    "version": 1
  }
}
```

**8.** `$ /OBJECTIVE SET CONECTIVIDAD MAXIMIZE 90`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "objective_id": "OBJ-9be2c3bcc5",
    "project_id": "MULTI-001",
    "key": "CONECTIVIDAD",
    "direction": "MAXIMIZE",
    "value": "90",
    "version": 1,
    "source_parent_objective_id": null
  }
}
```

**9.** `$ /OBJECTIVE SET RESILIENCIA MAXIMIZE 85`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "objective_id": "OBJ-d0c783e95b",
    "project_id": "MULTI-001",
    "key": "RESILIENCIA",
    "direction": "MAXIMIZE",
    "value": "85",
    "version": 1,
    "source_parent_objective_id": null
  }
}
```

**10.** `$ /CONSTRAINT SET INVERSION <= 1200 USD_MILLION`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "constraint_id": "CON-09986c6332",
    "project_id": "MULTI-001",
    "key": "INVERSION",
    "operator": "<=",
    "value": "1200",
    "unit": "USD_MILLION",
    "hard": true,
    "version": 1
  }
}
```

**11.** `$ /CONSTRAINT SET EMISIONES <= 5000 TON_YEAR`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "constraint_id": "CON-8a46a28fb8",
    "project_id": "MULTI-001",
    "key": "EMISIONES",
    "operator": "<=",
    "value": "5000",
    "unit": "TON_YEAR",
    "hard": true,
    "version": 1
  }
}
```

**12.** `$ /ALTERNATIVE CREATE MULTI-A`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-4746aa27b7",
    "project_id": "MULTI-001",
    "name": "MULTI-A",
    "description": "",
    "parameters": {},
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**13.** `$ /ALTERNATIVE SET MULTI-A corredores_ferroviarios 2`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-4746aa27b7",
    "project_id": "MULTI-001",
    "name": "MULTI-A",
    "description": "",
    "parameters": {
      "corredores_ferroviarios": "2"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**14.** `$ /ALTERNATIVE SET MULTI-A inversion 1100`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-4746aa27b7",
    "project_id": "MULTI-001",
    "name": "MULTI-A",
    "description": "",
    "parameters": {
      "corredores_ferroviarios": "2",
      "inversion": "1100"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**15.** `$ /ALTERNATIVE CREATE MULTI-B`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-7c3af1266f",
    "project_id": "MULTI-001",
    "name": "MULTI-B",
    "description": "",
    "parameters": {},
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**16.** `$ /ALTERNATIVE SET MULTI-B corredores_ferroviarios 3`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-7c3af1266f",
    "project_id": "MULTI-001",
    "name": "MULTI-B",
    "description": "",
    "parameters": {
      "corredores_ferroviarios": "3"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**17.** `$ /ALTERNATIVE SET MULTI-B inversion 1180`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "alternative_id": "ALT-7c3af1266f",
    "project_id": "MULTI-001",
    "name": "MULTI-B",
    "description": "",
    "parameters": {
      "corredores_ferroviarios": "3",
      "inversion": "1180"
    },
    "status": "GENERATED",
    "version": 1,
    "source": "USER_COMMAND"
  }
}
```

**18.** `$ /EVALUATE MULTI-A CONECTIVIDAD 78 SCORE 0.8 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-379d89b316",
    "alternative_id": "ALT-4746aa27b7",
    "objective_id": "OBJ-9be2c3bcc5",
    "value": 78.0,
    "unit": "SCORE",
    "confidence": 0.8,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**19.** `$ /EVALUATE MULTI-A RESILIENCIA 70 SCORE 0.8 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-55e6e38246",
    "alternative_id": "ALT-4746aa27b7",
    "objective_id": "OBJ-d0c783e95b",
    "value": 70.0,
    "unit": "SCORE",
    "confidence": 0.8,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**20.** `$ /EVALUATE MULTI-B CONECTIVIDAD 90 SCORE 0.8 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-084d2e1ebe",
    "alternative_id": "ALT-7c3af1266f",
    "objective_id": "OBJ-9be2c3bcc5",
    "value": 90.0,
    "unit": "SCORE",
    "confidence": 0.8,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**21.** `$ /EVALUATE MULTI-B RESILIENCIA 86 SCORE 0.8 USER_INPUT`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "evaluation_id": "EVAL-d8bcdcc84b",
    "alternative_id": "ALT-7c3af1266f",
    "objective_id": "OBJ-d0c783e95b",
    "value": 86.0,
    "unit": "SCORE",
    "confidence": 0.8,
    "source": "USER_INPUT",
    "version": 1
  }
}
```

**22.** `$ /COMPARE MULTI-A MULTI-B`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "comparison_id": "CMP-fa70caa560",
    "project_id": "MULTI-001",
    "alternative_ids": [
      "ALT-4746aa27b7",
      "ALT-7c3af1266f"
    ],
    "evaluations": [
      {
        "evaluation_id": "EVAL-379d89b316",
        "alternative_id": "ALT-4746aa27b7",
        "objective_id": "OBJ-9be2c3bcc5",
        "value": 78.0,
        "unit": "SCORE",
        "confidence": 0.8,
        "source": "USER_INPUT",
        "version": 1
      },
      {
        "evaluation_id": "EVAL-55e6e38246",
        "alternative_id": "ALT-4746aa27b7",
        "objective_id": "OBJ-d0c783e95b",
        "value": 70.0,
        "unit": "SCORE",
        "confidence": 0.8,
        "source": "USER_INPUT",
        "version": 1
      },
      {
        "evaluation_id": "EVAL-084d2e1ebe",
        "alternative_id": "ALT-7c3af1266f",
        "objective_id": "OBJ-9be2c3bcc5",
        "value": 90.0,
        "unit": "SCORE",
        "confidence": 0.8,
        "source": "USER_INPUT",
        "version": 1
      },
      {
        "evaluation_id": "EVAL-d8bcdcc84b",
        "alternative_id": "ALT-7c3af1266f",
        "objective_id": "OBJ-d0c783e95b",
        "value": 86.0,
        "unit": "SCORE",
        "confidence": 0.8,
        "source": "USER_INPUT",
        "version": 1
      }
    ],
    "tradeoffs": {},
    "version": 1
  }
}
```

**23.** `$ /MULTIOBJECTIVE PARETO CONECTIVIDAD RESILIENCIA`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "multiobjective": {
      "multiobjective_id": "MOBJ-8b6699b05d",
      "project_id": "MULTI-001",
      "method": "pareto_front_v1",
      "method_version": "1.0",
      "objectives": [
        "CONECTIVIDAD",
        "RESILIENCIA"
      ],
      "alternatives": [
        "ALT-4746aa27b7",
        "ALT-7c3af1266f"
      ],
      "pareto_front": [
        "ALT-7c3af1266f"
      ],
      "dominated": [
        "ALT-4746aa27b7"
      ],
      "incomplete": [],
      "tradeoffs": {
        "matrix": {
          "ALT-4746aa27b7": {
            "CONECTIVIDAD": 78.0,
            "RESILIENCIA": 70.0
          },
          "ALT-7c3af1266f": {
            "CONECTIVIDAD": 90.0,
            "RESILIENCIA": 86.0
          }
        }
      },
      "state": "EXECUTED",
      "inputs_hash": "f310e5ff2e8b7ec3e3e22bde5cbf6fa5c04a33172e25de45da52c284424e38f7",
      "created_at": "2026-09-16T18:06:10.893471+00:00",
      "version": 1
    },
    "decision_created": false,
    "recommendation_created": false
  }
}
```

**24.** `$ /HUMAN REVIEW architect-yvan 2026-09-16T07:00:00Z "Revisión multiescala" "Corredor validado para demostración" "Arquitecto principal"`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "review_id": "REV-034dc75150",
    "project_id": "MULTI-001",
    "actor": "architect-yvan",
    "timestamp": "2026-09-16T07:00:00Z",
    "review": "Revisión multiescala",
    "reason": "Corredor validado para demostración",
    "authority": "Arquitecto principal",
    "status": "APPROVED",
    "version": 1
  }
}
```

**25.** `$ /DECISION RECORD "Adoptar MULTI-B como escenario preferente sujeto a coordinación territorial" architect-yvan "Arquitecto principal"`
```json
{
  "status": "OK",
  "code": "OK",
  "message": "ok",
  "data": {
    "decision_id": "DEC-97c3991cc6",
    "project_id": "MULTI-001",
    "statement": "Adoptar MULTI-B como escenario preferente sujeto a coordinación territorial",
    "actor": "architect-yvan",
    "authority": "Arquitecto principal",
    "version": 1
  }
}
```

## Qué demuestra la ejecución

Los nueve casos de la orden previa corregida y el décimo caso complementario ejecutaron el flujo de creación de proyecto, apertura, Facts, Evidence, Objectives, Constraints, Alternatives, Evaluations, Comparison, análisis determinista o Pareto, HumanReview y Decision. La persistencia quedó comprobada mediante snapshots recuperados desde SQLite y conteos del event log.

El Core no convirtió automáticamente una recomendación en decisión. Las corridas registraron HumanReview antes de Decision. En los casos Pareto, el resultado incluye estados de frontera y, cuando corresponde, `INSUFFICIENT` si existen alternativas sin evaluaciones completas; eso es una salida honesta del sistema, no un falso PASS.

## Limitaciones que deben comunicarse a usuarios

1. El archivo adjunto recibido está incompleto y no contiene el proyecto 10 ni comandos de ejecución.
2. Los proyectos 1–9 ejecutados corresponden a la orden previa de sintaxis corregida, no a todas las narrativas detalladas del archivo adjunto actual.
3. Los casos 1–9 de esa orden previa incluyen un conjunto mínimo de Facts/Evidence y no siempre incluyen Assumptions; por eso sus snapshots muestran `assumptions: 0`.
4. El décimo caso fue creado para completar la demostración y está marcado como sintético.
5. La ejecución fue directa contra el Core local en `sicl-core@352efe6`; no constituye una prueba del dominio público ni del despliegue WebDev.

## Artefactos reproducibles

- `report.json`: reporte estructurado de todas las respuestas.
- `console-output.txt`: resumen de consola de la corrida final.
- `01-command-output.json` a `10-command-output.json`: salida detallada por proyecto.
- `sims-dei-10.sqlite`: base SQLite generada por la corrida final.
- Runner: `/tmp/run_sims_dei_10_demos.py`.

## Conclusión

**Resultado demostrativo: 10/10 PASS en la corrida final sobre el Core real `352efe6`.** Los errores encontrados durante la preparación fueron errores de datos de entrada del caso sintético y quedaron corregidos antes de declarar el resultado final. La evidencia más importante es que el Core rechazó explícitamente valores ontológicos inválidos, persistió las entidades válidas, registró eventos y permitió completar HumanReview y Decision con actor y authority.
