# COMMANDS_REFERENCE — SICL CLI

**Estado:** DOCUMENTACIÓN CANÓNICA DE SINTAXIS
**Fuente de verdad:** `src/sicl/cli.py` en `main`.
**Baseline:** `246417391dfb85c63596e1650faef39466378954`.

Esta referencia describe el dispatcher real y su forma compacta de interfaz. Si contradice `USER_MANUAL.md`, `OPERATIONS_MANUAL.md` u otro documento, prevalece esta referencia. Los comandos marcados **HTTP-only** no son aceptados por el CLI local. El frontend acepta el código compacto y conserva el nombre legacy como alias compatible antes de llamar al Core.

## 1. Cómo usar esta referencia

Cada ficha contiene nombre, sintaxis exacta, argumentos, ejemplo, comportamiento y errores frecuentes. Los valores entre `< >` son obligatorios; los valores entre `[ ]` son opcionales. Use comillas para argumentos con espacios y JSON inline con comillas simples externas en shells POSIX.

## 1. PROYECTO

### PRO-CRE

**Sintaxis:** `PRO-CRE <project_id> <name> [spatial_scope] [temporal_scope]`

**Ejemplo:**

```text
PRO-CRE UPAO-001 "UPAO Plaza" parcela_sitio proyecto
```

**Validación y comportamiento:** Requiere project_id y name; scopes se validan contra los enums del dominio; crea Project y evento PROJECT_CREATED.

**Errores comunes:** `PROJECT_ALREADY_EXISTS, INVALID_ARGUMENT, INVALID_SCOPE`

### PRO-OPE

**Sintaxis:** `PRO-OPE <project_id>`

**Ejemplo:**

```text
PRO-OPE UPAO-001
```

**Validación y comportamiento:** Requiere un proyecto existente; lo convierte en el proyecto actual.

**Errores comunes:** `PROJECT_NOT_FOUND, INVALID_ARGUMENT`

### PRO-SET

**Sintaxis:** `PRO-SET <spatial_scope> [temporal_scope]`

**Ejemplo:**

```text
PRO-SET edificacion proyecto
```

**Validación y comportamiento:** Requiere proyecto abierto; actualiza scopes y versión.

**Errores comunes:** `PROJECT_NOT_FOUND, INVALID_SCOPE, INVALID_ARGUMENT`

### PRO-IMP

**Sintaxis:** `PRO-IMP <source_project_id> <objective_id>`

**Ejemplo:**

```text
PRO-IMP CITY-001 OBJ-123
```

**Validación y comportamiento:** Requiere proyecto abierto, relación multiescala válida y objetivo existente.

**Errores comunes:** `PROJECT_NOT_FOUND, OBJECTIVE_NOT_FOUND, SCALE_RELATION_REQUIRED`

### PRO-SHO

**Sintaxis:** `PRO-SHO`

**Ejemplo:**

```text
PRO-SHO
```

**Validación y comportamiento:** Devuelve el snapshot del proyecto actual.

**Errores comunes:** `PROJECT_NOT_FOUND`

### PRO-LIS

**Sintaxis:** `PRO-LIS`

**Ejemplo:**

```text
PRO-LIS
```

**Validación y comportamiento:** Lista proyectos persistidos.

**Errores comunes:** `INVALID_STATE`

## 2. ESTADO Y AUDITORÍA

### STA-SET

**Sintaxis:** `STA-SET <DRAFT|ACTIVE|CLOSED>`

**Ejemplo:**

```text
STA-SET ACTIVE
```

**Validación y comportamiento:** Requiere proyecto abierto; solo acepta DRAFT, ACTIVE o CLOSED.

**Errores comunes:** `INVALID_ARGUMENT, PROJECT_NOT_FOUND`

### STA-TUS

**Sintaxis:** `STA-TUS`

**Ejemplo:**

```text
STA-TUS
```

**Validación y comportamiento:** Devuelve estado y snapshot del proyecto actual.

**Errores comunes:** `PROJECT_NOT_FOUND`

### HIS-TOR

**Sintaxis:** `HIS-TOR`

**Ejemplo:**

```text
HIS-TOR
```

**Validación y comportamiento:** Devuelve eventos del proyecto en orden temporal.

**Errores comunes:** `PROJECT_NOT_FOUND`

## 3. CONOCIMIENTO

### FAC-SET

**Sintaxis:** `FAC-SET <statement> <source>`

**Ejemplo:**

```text
FAC-SET "El lote tiene 2000 m2" CATASTRO
```

**Validación y comportamiento:** Requiere statement y source; crea Fact y evento append-only.

**Errores comunes:** `INVALID_ARGUMENT, PROJECT_NOT_FOUND`

### ASS-SET

**Sintaxis:** `ASS-SET <statement> <basis>`

**Ejemplo:**

```text
ASS-SET "La ocupación será 80 por ciento" ESTIMACION
```

**Validación y comportamiento:** Requiere statement y basis; crea Assumption separada de Fact.

**Errores comunes:** `INVALID_ARGUMENT, PROJECT_NOT_FOUND`

### EVI-ADD

**Sintaxis:** `EVI-ADD <evidence_id> <statement> <type> [source_id] [url]`

**Ejemplo:**

```text
EVI-ADD EVD-001 "Frente de 40 m" OBSERVATION
```

**Validación y comportamiento:** Tipo: DOCUMENT, OBSERVATION, MEASUREMENT, REFERENCE, TESTIMONY, NORMATIVE u OTHER.

**Errores comunes:** `EVIDENCE_ALREADY_EXISTS, INVALID_EVIDENCE_TYPE, INVALID_ARGUMENT`

### EVI-LIS

**Sintaxis:** `EVI-LIS`

**Ejemplo:**

```text
EVI-LIS
```

**Validación y comportamiento:** Lista evidencia del proyecto actual.

**Errores comunes:** `PROJECT_NOT_FOUND`

### EVI-SHO

**Sintaxis:** `EVI-SHO <evidence_id>`

**Ejemplo:**

```text
EVI-SHO EVD-001
```

**Validación y comportamiento:** Requiere evidencia existente.

**Errores comunes:** `EVIDENCE_NOT_FOUND, INVALID_ARGUMENT`

## 4. FUENTES — HTTP-only

### /SOURCE ADD

**Sintaxis:** `HTTP: POST /v1/projects/{project_id}/sources`

**Ejemplo:**

```text
POST /v1/projects/UPAO-001/sources
```

**Validación y comportamiento:** No es comando CLI. Crear Source requiere API HTTP v1.

**Errores comunes:** `No aplica en CLI`

### /SOURCE LIST

**Sintaxis:** `HTTP: GET /v1/projects/{project_id}/sources`

**Ejemplo:**

```text
GET /v1/projects/UPAO-001/sources
```

**Validación y comportamiento:** No es comando CLI.

**Errores comunes:** `No aplica en CLI`

### /SOURCE SHOW

**Sintaxis:** `HTTP: GET /v1/projects/{project_id}/sources/{source_id}`

**Ejemplo:**

```text
GET /v1/projects/UPAO-001/sources/CATASTRO
```

**Validación y comportamiento:** No es comando CLI.

**Errores comunes:** `No aplica en CLI`

## 5. DISEÑO

### OBJ-SET

**Sintaxis:** `OBJ-SET <key> <MAXIMIZE|MINIMIZE> <value>`

**Ejemplo:**

```text
OBJ-SET CLIMATE MAXIMIZE 80
```

**Validación y comportamiento:** Direction obligatoria; crea Objective.

**Errores comunes:** `OBJECTIVE_DIRECTION_REQUIRED, INVALID_ARGUMENT, PROJECT_NOT_FOUND`

### CON-SET

**Sintaxis:** `CON-SET <key> <operator> <value> [unit]`

**Ejemplo:**

```text
CON-SET HEIGHT <= 6 FLOORS
```

**Validación y comportamiento:** Constraint MVP es siempre hard=true.

**Errores comunes:** `INVALID_ARGUMENT, PROJECT_NOT_FOUND`

### ROL-ADD

**Sintaxis:** `ROL-ADD <name> [actor]`

**Ejemplo:**

```text
ROL-ADD ARCHITECT "Yvan Castillo"
```

**Validación y comportamiento:** Crea Role asociado al proyecto.

**Errores comunes:** `INVALID_ARGUMENT, PROJECT_NOT_FOUND`

## 6. ALTERNATIVAS

### /ALTERNATIVE CREATE

**Sintaxis:** `/ALTERNATIVE CREATE <name>`

**Ejemplo:**

```text
/ALTERNATIVE CREATE CONVENCIONAL_A
```

**Validación y comportamiento:** Acepta exactamente un name; description no es argumento CLI.

**Errores comunes:** `INVALID_ARGUMENT, CONFLICT, PROJECT_NOT_FOUND`

### /ALTERNATIVE SET

**Sintaxis:** `/ALTERNATIVE SET <name> <parameter> <value>`

**Ejemplo:**

```text
/ALTERNATIVE SET CONVENCIONAL_A FLOORS 6
```

**Validación y comportamiento:** Requiere alternativa existente; agrega o actualiza parámetro.

**Errores comunes:** `CANDIDATE_NOT_FOUND, INVALID_ARGUMENT`

### /ALTERNATIVE LIST

**Sintaxis:** `/ALTERNATIVE LIST`

**Ejemplo:**

```text
/ALTERNATIVE LIST
```

**Validación y comportamiento:** Lista alternativas del proyecto.

**Errores comunes:** `PROJECT_NOT_FOUND`

### ALT-PRO

**Sintaxis:** `ALT-PRO <alternative_id>`

**Ejemplo:**

```text
ALT-PRO ALT-123
```

**Validación y comportamiento:** Promueve GeneratedAlternative; requiere candidato existente.

**Errores comunes:** `CANDIDATE_NOT_FOUND, INVALID_STATE`

## 7. EVALUACIÓN

### /EVALUATE

**Sintaxis:** `/EVALUATE <alternative> <objective> <value> <unit> <confidence> <source>`

**Ejemplo:**

```text
/EVALUATE CONVENCIONAL_A CLIMATE 80 SCORE 0.9 USER_INPUT
```

**Validación y comportamiento:** Requiere alternativa y objetivo; confidence debe ser numérica.

**Errores comunes:** `OBJECTIVE_NOT_FOUND, CANDIDATE_NOT_FOUND, INVALID_ARGUMENT`

### /COMPARE

**Sintaxis:** `/COMPARE <alternative_1> <alternative_2>`

**Ejemplo:**

```text
/COMPARE CONVENCIONAL_A BIOCLIMATICA_B
```

**Validación y comportamiento:** Compara alternativas y evaluaciones existentes.

**Errores comunes:** `CANDIDATE_NOT_FOUND, INVALID_STATE`

## 8. GOBERNANZA

### HUM-REV

**Sintaxis:** `HUM-REV <actor> <timestamp_utc> <review> <reason> [authority]`

**Ejemplo:**

```text
HUM-REV architect-yvan 2026-09-16T07:00:00Z "Revisé la recomendación" "Validación" "Architect"
```

**Validación y comportamiento:** Timestamp UTC obligatorio; crea HumanReview APPROVED.

**Errores comunes:** `HUMAN_AUTHORITY_REQUIRED, INVALID_ARGUMENT, PROJECT_NOT_FOUND`

### DEC-REC

**Sintaxis:** `DEC-REC <statement> <actor> <authority>`

**Ejemplo:**

```text
DEC-REC "Adoptar CONVENCIONAL_A" architect-yvan Architect
```

**Validación y comportamiento:** Requiere HumanReview APPROVED previo y autoridad humana; nunca es creado por Recommendation.

**Errores comunes:** `HUMAN_REVIEW_REQUIRED, HUMAN_AUTHORITY_REQUIRED, DECISIONAL_ACTOR_REQUIRED`

### /COUNCIL

**Sintaxis:** `HTTP-only: GET /v1/projects/{project_id}/council`

**Ejemplo:**

```text
GET /v1/projects/UPAO-001/council
```

**Validación y comportamiento:** No es comando CLI local; lectura HTTP.

**Errores comunes:** `No aplica en CLI`

## 9. SIMULACIÓN

### /SIMULATE RUN

**Sintaxis:** `/SIMULATE RUN <simulation_type> <method> [json_params|key=value ...]`

**Ejemplo:**

```text
/SIMULATE RUN DETERMINISTIC deterministic_basic_v1 '{"alternative_id":"ALT-1","objective_id":"OBJ-1","parameter_value":80}'
```

**Validación y comportamiento:** Simulation type y method deben coincidir; params pueden ser JSON o key=value.

**Errores comunes:** `METHOD_NOT_FOUND, METHOD_TYPE_MISMATCH, INVALID_INPUTS, PARAMETER_NOT_FOUND`

### /SIMULATE MONTE_CARLO

**Sintaxis:** `/SIMULATE MONTE_CARLO <alternative_id> <objective_id> <parameter_name> <distribution_json> [iterations]`

**Ejemplo:**

```text
/SIMULATE MONTE_CARLO ALT-1 OBJ-1 AREA '{"type":"NORMAL","parameters":{"mean":2000,"std_dev":100}}' 1000
```

**Validación y comportamiento:** Distribuciones NORMAL, UNIFORM o TRIANGULAR; iterations 1..10000; seed fija 20260916.

**Errores comunes:** `INVALID_DISTRIBUTION, INVALID_INPUTS, PARAMETER_NOT_FOUND`

### /SIMULATE METHODS

**Sintaxis:** `/SIMULATE METHODS`

**Ejemplo:**

```text
/SIMULATE METHODS
```

**Validación y comportamiento:** Lista métodos registrados.

**Errores comunes:** `INVALID_STATE`

### /SIMULATE LIST

**Sintaxis:** `/SIMULATE LIST`

**Ejemplo:**

```text
/SIMULATE LIST
```

**Validación y comportamiento:** Lista simulaciones del proyecto.

**Errores comunes:** `PROJECT_NOT_FOUND`

### /SIMULATE SHOW

**Sintaxis:** `/SIMULATE SHOW <simulation_id>`

**Ejemplo:**

```text
/SIMULATE SHOW SIM-123
```

**Validación y comportamiento:** Requiere simulación existente.

**Errores comunes:** `SIMULATION_NOT_FOUND, INVALID_ARGUMENT`

## 10. MULTIOBJETIVO

### MUL-TIO PARETO

**Sintaxis:** `MUL-TIO PARETO <objective_key_1> <objective_key_2> [...]`

**Ejemplo:**

```text
MUL-TIO PARETO ENERGY_SAVINGS CONSTRUCTION_COST
```

**Validación y comportamiento:** Requiere al menos dos objetivos existentes con dirección.

**Errores comunes:** `OBJECTIVE_NOT_FOUND, INVALID_ARGUMENT, INVALID_STATE`

### MUL-TIO TRADEOFFS

**Sintaxis:** `MUL-TIO TRADEOFFS <objective_key_1> <objective_key_2>`

**Ejemplo:**

```text
MUL-TIO TRADEOFFS ENERGY_SAVINGS CONSTRUCTION_COST
```

**Validación y comportamiento:** Requiere exactamente dos objetivos.

**Errores comunes:** `OBJECTIVE_NOT_FOUND, INVALID_ARGUMENT`

### MUL-TIO LIST

**Sintaxis:** `MUL-TIO LIST`

**Ejemplo:**

```text
MUL-TIO LIST
```

**Validación y comportamiento:** Lista resultados multiobjetivo.

**Errores comunes:** `PROJECT_NOT_FOUND`

### MUL-TIO SHOW

**Sintaxis:** `MUL-TIO SHOW <multiobjective_id>`

**Ejemplo:**

```text
MUL-TIO SHOW MO-123
```

**Validación y comportamiento:** Requiere resultado existente.

**Errores comunes:** `MULTIOBJECTIVE_NOT_FOUND, INVALID_ARGUMENT`

## 11. GENERACIÓN

### GEN-DES

**Sintaxis:** `GEN-DES <method> <parameters_json>`

**Ejemplo:**

```text
GEN-DES parametric_grid_v1 '{"FLOORS":[4,6]}'
```

**Validación y comportamiento:** Genera candidatos sin decidir; métodos dependen del catálogo.

**Errores comunes:** `METHOD_NOT_FOUND, INVALID_INPUTS`

### GEN-MET

**Sintaxis:** `GEN-MET`

**Ejemplo:**

```text
GEN-MET
```

**Validación y comportamiento:** Lista métodos de generación.

**Errores comunes:** `INVALID_STATE`

### GEN-LIS

**Sintaxis:** `GEN-LIS`

**Ejemplo:**

```text
GEN-LIS
```

**Validación y comportamiento:** Lista GeneratedAlternative.

**Errores comunes:** `PROJECT_NOT_FOUND`

### GEN-SHO

**Sintaxis:** `GEN-SHO <generation_id>`

**Ejemplo:**

```text
GEN-SHO GEN-123
```

**Validación y comportamiento:** Requiere generación existente.

**Errores comunes:** `GENERATION_NOT_FOUND, INVALID_ARGUMENT`

### GEN-ERA

**Sintaxis:** `GEN-ERA <method> <objective_keys_csv>`

**Ejemplo:**

```text
GEN-ERA evolutionary_v1 ENERGY_SAVINGS,CONSTRUCTION_COST
```

**Validación y comportamiento:** Genera alternativas; no crea Decision.

**Errores comunes:** `METHOD_NOT_FOUND, INVALID_INPUTS, LLM_NOT_CONFIGURED`

### PAR-ETO

**Sintaxis:** `PAR-ETO <objective_1> <objective_2>`

**Ejemplo:**

```text
PAR-ETO ENERGY_SAVINGS CONSTRUCTION_COST
```

**Validación y comportamiento:** Atajo de análisis Pareto.

**Errores comunes:** `OBJECTIVE_NOT_FOUND, INVALID_ARGUMENT`

### TRA-DEO

**Sintaxis:** `TRA-DEO <objective_1> <objective_2>`

**Ejemplo:**

```text
TRA-DEO ENERGY_SAVINGS CONSTRUCTION_COST
```

**Validación y comportamiento:** Atajo de matriz de trade-offs.

**Errores comunes:** `OBJECTIVE_NOT_FOUND, INVALID_ARGUMENT`

## 12. PRINCIPIOS DE DISEÑO

### /DESIGN PRINCIPLES

**Sintaxis:** `/DESIGN PRINCIPLES`

**Ejemplo:**

```text
/DESIGN PRINCIPLES
```

**Validación y comportamiento:** Lista principios de diseño disponibles.

**Errores comunes:** `INVALID_STATE`

### /DESIGN PRINCIPLE

**Sintaxis:** `/DESIGN PRINCIPLE <principle_id>`

**Ejemplo:**

```text
/DESIGN PRINCIPLE BIOCLIMATIC
```

**Validación y comportamiento:** Muestra un principio registrado.

**Errores comunes:** `PRINCIPLE_NOT_FOUND, INVALID_ARGUMENT`

## 13. PLANIFICACIÓN

### PLA-ADD

**Sintaxis:** `PLA-ADD <id> <type> <name> [jurisdiction] [url]`

**Ejemplo:**

```text
PLA-ADD PI-001 ZONING "Plan urbano" Trujillo https://example.org
```

**Validación y comportamiento:** Type debe ser PlanningInstrumentType válido.

**Errores comunes:** `CONFLICT, INVALID_ARGUMENT`

### PLA-LIS

**Sintaxis:** `PLA-LIS`

**Ejemplo:**

```text
PLA-LIS
```

**Validación y comportamiento:** Lista instrumentos.

**Errores comunes:** `INVALID_STATE`

### PLA-SHO

**Sintaxis:** `PLA-SHO <instrument_id>`

**Ejemplo:**

```text
PLA-SHO PI-001
```

**Validación y comportamiento:** Muestra instrumento existente.

**Errores comunes:** `PLANNING_INSTRUMENT_NOT_FOUND`

### PLA-TYP

**Sintaxis:** `PLA-TYP`

**Ejemplo:**

```text
PLA-TYP
```

**Validación y comportamiento:** Lista tipos válidos.

**Errores comunes:** `INVALID_STATE`

## 14. REGULACIÓN

### REG-ADD

**Sintaxis:** `REG-ADD <id> <code> <title> [jurisdiction] [source_url]`

**Ejemplo:**

```text
REG-ADD REG-001 RNE "Reglamento Nacional" Peru https://example.org
```

**Validación y comportamiento:** Registra regulación con estado NO_VERIFICADA.

**Errores comunes:** `CONFLICT, INVALID_ARGUMENT`

### REG-LIS

**Sintaxis:** `REG-LIS`

**Ejemplo:**

```text
REG-LIS
```

**Validación y comportamiento:** Lista regulaciones.

**Errores comunes:** `INVALID_STATE`

### REG-SHO

**Sintaxis:** `REG-SHO <regulation_id>`

**Ejemplo:**

```text
REG-SHO REG-001
```

**Validación y comportamiento:** Muestra regulación.

**Errores comunes:** `REGULATION_NOT_FOUND`

### REG-STA

**Sintaxis:** `REG-STA <regulation_id> <status>`

**Ejemplo:**

```text
REG-STA REG-001 VERIFICADA
```

**Validación y comportamiento:** Actualiza estado de regulación.

**Errores comunes:** `REGULATION_NOT_FOUND, INVALID_ARGUMENT`

### INT-ADD

**Sintaxis:** `INT-ADD <id> <regulation_id> <article> <text>`

**Ejemplo:**

```text
INT-ADD INT-001 REG-001 Art-10 "Interpretación técnica"
```

**Validación y comportamiento:** Regulación debe existir; incluye disclaimer legal.

**Errores comunes:** `REGULATION_NOT_FOUND, CONFLICT, INVALID_ARGUMENT`

### INT-LIS

**Sintaxis:** `INT-LIS [regulation_id]`

**Ejemplo:**

```text
INT-LIS REG-001
```

**Validación y comportamiento:** Lista interpretaciones opcionalmente filtradas.

**Errores comunes:** `INVALID_ARGUMENT`

### INT-REV

**Sintaxis:** `INT-REV <interpretation_id> <actor> <authority>`

**Ejemplo:**

```text
INT-REV INT-001 architect-yvan Architect
```

**Validación y comportamiento:** Requiere actor y authority no vacíos.

**Errores comunes:** `INTERPRETATION_NOT_FOUND, INVALID_ARGUMENT`

### SNA-CRE

**Sintaxis:** `SNA-CRE <snapshot_id> <project_id> <cut_date>`

**Ejemplo:**

```text
SNA-CRE SNAP-001 UPAO-001 2026-09-16
```

**Validación y comportamiento:** cut_date debe ser ISO date.

**Errores comunes:** `PROJECT_NOT_FOUND, INVALID_ARGUMENT`

### SNA-LIS

**Sintaxis:** `SNA-LIS`

**Ejemplo:**

```text
SNA-LIS
```

**Validación y comportamiento:** Lista snapshots.

**Errores comunes:** `INVALID_STATE`

### SNA-FRE

**Sintaxis:** `SNA-FRE <snapshot_id>`

**Ejemplo:**

```text
SNA-FRE SNAP-001
```

**Validación y comportamiento:** Congela snapshot existente.

**Errores comunes:** `SNAPSHOT_NOT_FOUND, INVALID_ARGUMENT`

## 15. MULTIESCALA

### SCA-PAR

**Sintaxis:** `SCA-PAR <project_id>`

**Ejemplo:**

```text
SCA-PAR CITY-001
```

**Validación y comportamiento:** Busca proyecto padre en relaciones.

**Errores comunes:** `PROJECT_NOT_FOUND`

### SCA-CHI

**Sintaxis:** `SCA-CHI <project_id>`

**Ejemplo:**

```text
SCA-CHI CITY-001
```

**Validación y comportamiento:** Lista hijos relacionados.

**Errores comunes:** `PROJECT_NOT_FOUND`

### SCA-RLT

**Sintaxis:** `SCA-RLT <parent_id> <child_id> <relation_type>`

**Ejemplo:**

```text
SCA-RLT CITY-001 SITE-001 CONTAINS
```

**Validación y comportamiento:** Proyectos deben existir; relation_type se valida.

**Errores comunes:** `PROJECT_NOT_FOUND, INVALID_SCOPE_RELATION`

### SCA-RLS

**Sintaxis:** `SCA-RLS <project_id>`

**Ejemplo:**

```text
SCA-RLS CITY-001
```

**Validación y comportamiento:** Lista relaciones del proyecto.

**Errores comunes:** `PROJECT_NOT_FOUND`

## 16. ACTORES

### ACT-ADD

**Sintaxis:** `ACT-ADD <id> <role> <name> <authority> [interests_json constraints_json]`

**Ejemplo:**

```text
ACT-ADD architect-yvan ARCHITECT "Yvan" DECISIONAL
```

**Validación y comportamiento:** Role y authority se validan; JSON opcional debe ser lista.

**Errores comunes:** `CONFLICT, INVALID_ARGUMENT`

### ACT-LIS

**Sintaxis:** `ACT-LIS`

**Ejemplo:**

```text
ACT-LIS
```

**Validación y comportamiento:** Lista actores.

**Errores comunes:** `PROJECT_NOT_FOUND`

### ACT-SHO

**Sintaxis:** `ACT-SHO <actor_id>`

**Ejemplo:**

```text
ACT-SHO architect-yvan
```

**Validación y comportamiento:** Muestra actor.

**Errores comunes:** `ACTOR_NOT_FOUND`

### POS-ADD

**Sintaxis:** `POS-ADD <actor_id> <subject_type> <subject_id> <stance> <statement>`

**Ejemplo:**

```text
POS-ADD architect-yvan ALTERNATIVE ALT-1 SUPPORT "Apoyo"
```

**Validación y comportamiento:** Actor, subject type y stance se validan.

**Errores comunes:** `ACTOR_NOT_FOUND, INVALID_ARGUMENT`

### POS-LIS

**Sintaxis:** `POS-LIS [actor_id] [subject_id]`

**Ejemplo:**

```text
POS-LIS architect-yvan
```

**Validación y comportamiento:** Lista posiciones con filtros opcionales.

**Errores comunes:** `ACTOR_NOT_FOUND, INVALID_ARGUMENT`

## 17. TIEMPO

### CYC-CRE

**Sintaxis:** `CYC-CRE <cycle_id> <horizon> <start_date> <end_date>`

**Ejemplo:**

```text
CYC-CRE CYCLE-2030 2030 2026-01-01 2030-12-31
```

**Validación y comportamiento:** Horizon y fechas se validan.

**Errores comunes:** `INVALID_ARGUMENT, CONFLICT`

### CYC-LIS

**Sintaxis:** `CYC-LIS`

**Ejemplo:**

```text
CYC-LIS
```

**Validación y comportamiento:** Lista ciclos.

**Errores comunes:** `PROJECT_NOT_FOUND`

### CYC-SHO

**Sintaxis:** `CYC-SHO <cycle_id>`

**Ejemplo:**

```text
CYC-SHO CYCLE-2030
```

**Validación y comportamiento:** Muestra ciclo.

**Errores comunes:** `CYCLE_NOT_FOUND`

### SCE-CRE

**Sintaxis:** `SCE-CRE <branch_id> <cycle_id> <name>`

**Ejemplo:**

```text
SCE-CRE BASE-2030 CYCLE-2030 "Base"
```

**Validación y comportamiento:** Ciclo debe existir.

**Errores comunes:** `CYCLE_NOT_FOUND, CONFLICT`

### SCE-LIS

**Sintaxis:** `SCE-LIS`

**Ejemplo:**

```text
SCE-LIS
```

**Validación y comportamiento:** Lista escenarios.

**Errores comunes:** `PROJECT_NOT_FOUND`

### SCE-SEL

**Sintaxis:** `SCE-SEL <branch_id>`

**Ejemplo:**

```text
SCE-SEL BASE-2030
```

**Validación y comportamiento:** Selecciona rama de escenario.

**Errores comunes:** `SCENARIO_NOT_FOUND`

### /EVOLUTION CREATE

**Sintaxis:** `/EVOLUTION CREATE <evolution_id> <branch_id> <version> <title>`

**Ejemplo:**

```text
/EVOLUTION CREATE EVO-001 BASE-2030 1 "Cambio de densidad"
```

**Validación y comportamiento:** Crea evolución append-only.

**Errores comunes:** `SCENARIO_NOT_FOUND, CONFLICT`

### /EVOLUTION ADD

**Sintaxis:** `/EVOLUTION ADD <evolution_id> <key> <value>`

**Ejemplo:**

```text
/EVOLUTION ADD EVO-001 FAR 5
```

**Validación y comportamiento:** Agrega cambio a evolución.

**Errores comunes:** `EVOLUTION_NOT_FOUND, INVALID_ARGUMENT`

### /EVOLUTION APPLY

**Sintaxis:** `/EVOLUTION APPLY <evolution_id>`

**Ejemplo:**

```text
/EVOLUTION APPLY EVO-001
```

**Validación y comportamiento:** Aplica evolución autorizada al escenario.

**Errores comunes:** `EVOLUTION_NOT_FOUND, INVALID_STATE`

### /EVOLUTION LIST

**Sintaxis:** `/EVOLUTION LIST [branch_id]`

**Ejemplo:**

```text
/EVOLUTION LIST BASE-2030
```

**Validación y comportamiento:** Lista evoluciones.

**Errores comunes:** `INVALID_ARGUMENT`

### /EVOLUTION SHOW

**Sintaxis:** `/EVOLUTION SHOW <evolution_id>`

**Ejemplo:**

```text
/EVOLUTION SHOW EVO-001
```

**Validación y comportamiento:** Muestra evolución.

**Errores comunes:** `EVOLUTION_NOT_FOUND`

## 18. MEMORIA INSTITUCIONAL

### MEM-LIS

**Sintaxis:** `MEM-LIS`

**Ejemplo:**

```text
MEM-LIS
```

**Validación y comportamiento:** Lista memorias activas.

**Errores comunes:** `PROJECT_NOT_FOUND`

### MEM-SHO

**Sintaxis:** `MEM-SHO <memory_id>`

**Ejemplo:**

```text
MEM-SHO MEM-001
```

**Validación y comportamiento:** Muestra memoria.

**Errores comunes:** `MEMORY_NOT_FOUND`

### MEM-EXT

**Sintaxis:** `MEM-EXT <type> <title> <content>`

**Ejemplo:**

```text
MEM-EXT LESSON_LEARNED "Lección" "Contenido"
```

**Validación y comportamiento:** Crea memoria desde conocimiento del proyecto.

**Errores comunes:** `INVALID_ARGUMENT`

### MEM-REV

**Sintaxis:** `MEM-REV <memory_id>`

**Ejemplo:**

```text
MEM-REV MEM-001
```

**Validación y comportamiento:** Revoca memoria sin borrarla.

**Errores comunes:** `MEMORY_NOT_FOUND, MEMORY_REVOKED`

### MEM-APP

**Sintaxis:** `MEM-APP <memory_id>`

**Ejemplo:**

```text
MEM-APP MEM-001
```

**Validación y comportamiento:** Aplica memoria vigente.

**Errores comunes:** `MEMORY_NOT_FOUND, MEMORY_REVOKED`

### MEM-TYP

**Sintaxis:** `MEM-TYP`

**Ejemplo:**

```text
MEM-TYP
```

**Validación y comportamiento:** Lista tipos de memoria.

**Errores comunes:** `INVALID_STATE`

## 19. EXPORTACIÓN

### /REPORT

**Sintaxis:** `No registrado en CLI actual`

**Ejemplo:**

```text
Usar /EXPORT REPORT <path>
```

**Validación y comportamiento:** La salida report se genera mediante export_report_command.

**Errores comunes:** `UNKNOWN_COMMAND`

### /EXPORT PROJECT

**Sintaxis:** `/EXPORT PROJECT [path]`

**Ejemplo:**

```text
/EXPORT PROJECT exports/UPAO-001.json
```

**Validación y comportamiento:** Exporta snapshot JSON.

**Errores comunes:** `PROJECT_NOT_FOUND, INVALID_ARGUMENT`

### /EXPORT CSV

**Sintaxis:** `/EXPORT CSV [directory]`

**Ejemplo:**

```text
/EXPORT CSV exports
```

**Validación y comportamiento:** Exporta tablas CSV.

**Errores comunes:** `PROJECT_NOT_FOUND, IMPORT_FAILED`

### /EXPORT REPORT

**Sintaxis:** `/EXPORT REPORT [path]`

**Ejemplo:**

```text
/EXPORT REPORT exports/report.json
```

**Validación y comportamiento:** Exporta reporte derivado.

**Errores comunes:** `PROJECT_NOT_FOUND, INVALID_ARGUMENT`

### /IMPORT CSV

**Sintaxis:** `/IMPORT CSV <directory>`

**Ejemplo:**

```text
/IMPORT CSV imports/UPAO-001
```

**Validación y comportamiento:** Importa CSV al proyecto actual.

**Errores comunes:** `IMPORT_FAILED, INVALID_ARGUMENT`

## 20. OTROS

### /HELP

**Sintaxis:** `/HELP`

**Ejemplo:**

```text
/HELP
```

**Validación y comportamiento:** Lista el catálogo de comandos expuesto por el CLI.

**Errores comunes:** `INVALID_STATE`

### /TRADEOFFS

**Sintaxis:** `No es un comando independiente registrado`

**Ejemplo:**

```text
Usar MUL-TIO TRADEOFFS A B
```

**Validación y comportamiento:** El dispatcher usa TRA-DEO y MUL-TIO TRADEOFFS.

**Errores comunes:** `UNKNOWN_COMMAND`

### /DASHBOARD

**Sintaxis:** `No es un comando independiente registrado`

**Ejemplo:**

```text
Usar STA-TUS o PRO-SHO
```

**Validación y comportamiento:** No existe en el dispatcher actual.

**Errores comunes:** `UNKNOWN_COMMAND`

### SIT-INT

**Sintaxis:** `SIT-INT <location>`

**Ejemplo:**

```text
SIT-INT "Trujillo, Peru"
```

**Validación y comportamiento:** Consulta inteligencia de sitio y registra observaciones.

**Errores comunes:** `INVALID_ARGUMENT, INVALID_STATE`

### AGE-RUN

**Sintaxis:** `AGE-RUN <agent_type> <alternative_id>`

**Ejemplo:**

```text
AGE-RUN BIOCLIMATIC CONVENCIONAL_A
```

**Validación y comportamiento:** Ejecuta agente experto; genera evaluaciones, no decisiones.

**Errores comunes:** `CANDIDATE_NOT_FOUND, INVALID_ARGUMENT`

### DEB-ATE

**Sintaxis:** `DEB-ATE <alternative_id>`

**Ejemplo:**

```text
DEB-ATE CONVENCIONAL_A
```

**Validación y comportamiento:** Read-only; resume evaluaciones de agentes.

**Errores comunes:** `CANDIDATE_NOT_FOUND, INVALID_ARGUMENT`

### DEC-REC

**Sintaxis:** `DEC-REC <statement> <actor> <authority>`

**Ejemplo:**

```text
DEC-REC "Adoptar A" architect-yvan Architect
```

**Validación y comportamiento:** Repetido aquí para el catálogo transversal.

**Errores comunes:** `HUMAN_REVIEW_REQUIRED, HUMAN_AUTHORITY_REQUIRED`

### EXI-IT

**Sintaxis:** `EXI-IT`

**Ejemplo:**

```text
EXI-IT
```

**Validación y comportamiento:** Finaliza la sesión del intérprete.

**Errores comunes:** `INVALID_STATE`

## 3. Tabla de errores

| Código | Significado | Cómo resolver |
|---|---|---|
| `ACTOR_NOT_FOUND` | El actor no existe. Verifique `ACT-LIS`. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `ACTOR_REQUIRED` | Falta actor. Proporcione un actor válido. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `CANDIDATE_NOT_FOUND` | La alternativa/candidato no existe. Use `/ALTERNATIVE LIST`. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `CONFLICT` | El identificador ya existe o hay conflicto de estado. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `CYCLE_NOT_FOUND` | El ciclo no existe. Use `CYC-LIS`. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `DECISIONAL_ACTOR_REQUIRED` | El actor no tiene autoridad DECISIONAL. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `EVIDENCE_ALREADY_EXISTS` | El evidence_id ya existe; use otro identificador. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `EVIDENCE_NOT_FOUND` | La evidencia no existe. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `EVOLUTION_NOT_FOUND` | La evolución no existe. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `GENERATION_NOT_FOUND` | La generación no existe. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `HUMAN_AUTHORITY_REQUIRED` | Falta autoridad humana explícita. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `HUMAN_REVIEW_REQUIRED` | Debe existir HumanReview APPROVED antes de decidir. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `IMPORT_FAILED` | Falló la importación; revise archivos y columnas. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `INTERPRETATION_NOT_FOUND` | La interpretación no existe. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `INVALID_ARGUMENT` | Cantidad u orden de argumentos inválido. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `INVALID_DISTRIBUTION` | Distribución Monte Carlo inválida. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `INVALID_EVIDENCE_TYPE` | Tipo Evidence no permitido. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `INVALID_INPUTS` | Parámetros inválidos o fuera de rango. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `INVALID_SCOPE` | Scope espacial o temporal inválido. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `INVALID_SCOPE_RELATION` | Relación multiescala inválida. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `INVALID_STATE` | La operación no es válida en el estado actual. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `MEMORY_NOT_FOUND` | La memoria no existe. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `MEMORY_REVOKED` | La memoria fue revocada y no puede aplicarse. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `METHOD_NOT_FOUND` | Método de simulación o generación no registrado. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `METHOD_TYPE_MISMATCH` | El método no corresponde al tipo de simulación. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `LLM_NOT_CONFIGURED` | LLM no configurado; use método determinista u configure el proveedor. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `OBJECTIVE_DIRECTION_REQUIRED` | Debe indicar MAXIMIZE o MINIMIZE. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `OBJECTIVE_NOT_FOUND` | El objetivo no existe. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `PARAMETER_NOT_FOUND` | El parámetro requerido no existe en la alternativa. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `PLANNING_INSTRUMENT_NOT_FOUND` | El instrumento de planificación no existe. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `PRINCIPLE_NOT_FOUND` | El principio de diseño no existe. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `PROJECT_ALREADY_EXISTS` | El project_id ya existe. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `PROJECT_NOT_FOUND` | No existe el proyecto indicado. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `REGULATION_NOT_FOUND` | La regulación no existe. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `SCALE_RELATION_REQUIRED` | Falta relación multiescala válida. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `SCENARIO_NOT_FOUND` | El escenario no existe. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `SIMULATION_NOT_FOUND` | La simulación no existe. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `SNAPSHOT_NOT_FOUND` | El snapshot no existe. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `MULTIOBJECTIVE_NOT_FOUND` | El resultado multiobjetivo no existe. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `UNKNOWN_COMMAND` | Comando no registrado; consulte `/HELP`. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |
| `VETO_BLOCKED` | Un actor con veto bloqueó la operación. | Consulte la sintaxis del comando y verifique el estado, identificadores y autoridad requeridos. |

## 4. Formatos especiales

### Timestamp UTC

```text
2026-09-16T07:00:00Z
```

### JSON inline

```text
'{"key":"value"}'
```

### Distribuciones Monte Carlo

- `NORMAL`: `{"type":"NORMAL","parameters":{"mean":10,"std_dev":1}}`
- `UNIFORM`: `{"type":"UNIFORM","parameters":{"low":0,"high":100}}`
- `TRIANGULAR`: `{"type":"TRIANGULAR","parameters":{"low":0,"mode":50,"high":100}}`
- Iterations: entero entre 1 y 10000; la semilla CLI actual es `20260916`.

### Scopes espaciales

`pais`, `macro_region`, `region`, `provincia_metropoli`, `distrito_ciudad`, `zona_barrio_sector`, `parcela_sitio`, `edificacion`, `sistema`, `espacio`, `objeto`.

### Scopes temporales

`proyecto`, `corto_plazo`, `mediano_plazo`, `largo_plazo`, `escenario_2030`, `escenario_2040`, `escenario_2050`.

### Evidence types

`DOCUMENT`, `OBSERVATION`, `MEASUREMENT`, `REFERENCE`, `TESTIMONY`, `NORMATIVE`, `OTHER`.

## 5. Cobertura y límites

Esta referencia incluye 100 fichas de comandos o superficies relacionadas. El catálogo efectivo del dispatcher se obtiene siempre con `/HELP` y corresponde a los comandos implementados en `src/sicl/cli.py`.

Source y Council están documentados como HTTP-only. `/REPORT`, `/TRADEOFFS` y `/DASHBOARD` se conservan como nombres históricos o conceptuales cuando no son comandos independientes del dispatcher actual; no deben presentarse como comandos CLI ejecutables.

**Invariante constitucional:** una Recommendation, simulación, evaluación, comparación o salida de agente nunca crea una Decision automáticamente. La Decision requiere HumanReview y autoridad humana explícitas.



## Estado vigente de capacidades — actualización 2026-09-16

> Esta sección supersede las afirmaciones históricas de este documento que indiquen que GIS, BIM o el Copiloto local están fuera de alcance. El baseline vigente incluye RFC-027, RFC-028 y RFC-029.

El Core actual incluye importación IFC física de solo lectura, snapshots BIM persistentes, BIMChangeSet en modo PREVIEW, detección de conflictos BIM, contratos de exportación que exigen HumanReview, persistencia SQLite de ParcelSnapshot, catálogo GIS por jurisdicción, caducidad y ParcelBoundaryConflict, consulta OGC API Features y traducción Ollama a comandos SICL en modo PREVIEW_ONLY.

Estas capacidades no otorgan autoridad automática. El Copiloto no ejecuta comandos ni crea decisiones. Los adaptadores Revit y Archicad requieren sus hosts y SDKs nativos. La exportación BIM queda pendiente de ejecución externa después de una HumanReview aprobada. Las fuentes catastrales requieren registro explícito, licencia y validación humana.

La referencia operativa es [`PRODUCTION_CORE_DEPLOYMENT_MANUAL.md`](PRODUCTION_CORE_DEPLOYMENT_MANUAL.md). La suite E2E se ejecuta con `PYTHONPATH=.:src pytest -q tests/test_e2e_ollama_sicl.py -ra`.
