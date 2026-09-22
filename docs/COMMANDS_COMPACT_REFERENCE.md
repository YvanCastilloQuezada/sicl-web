# ARKI Compact Command Reference

**Versión:** ARKI-COMMANDS-COMPACT-1.0  
**Catálogo:** 67 comandos  
**Forma preferida:** `XXX-XXX` sin slash  
**Compatibilidad:** la forma legacy con slash permanece aceptada como alias de transición.

## Regla de resolución

Cada código compacto resuelve a un único comando interno. El Core y la auditoría conservan el nombre legacy técnico mientras se completa la migración. La interfaz muestra y sugiere el código compacto.

| # | Código compacto | Comando legacy compatible | Sintaxis compacta |
|---:|---|---|---|
| 1 | `PRO-CRE` | `/PROJECT CREATE` | `PRO-CRE <project_id> <name> [spatial_scope] [temporal_scope]` |
| 2 | `PRO-OPE` | `/PROJECT OPEN` | `PRO-OPE <project_id>` |
| 3 | `PRO-SET` | `/PROJECT SET SCOPE` | `PRO-SET <spatial_scope> [temporal_scope]` |
| 4 | `PRO-IMP` | `/PROJECT IMPORT OBJECTIVE` | `PRO-IMP <source_project_id> <objective_id>` |
| 5 | `PRO-SHO` | `/PROJECT SHOW` | `PRO-SHO` |
| 6 | `PRO-LIS` | `/PROJECT LIST` | `PRO-LIS` |
| 7 | `STA-SET` | `/STAGE SET` | `STA-SET <DRAFT|ACTIVE|CLOSED>` |
| 8 | `OBJ-SET` | `/OBJECTIVE SET` | `OBJ-SET <key> <MAXIMIZE|MINIMIZE> <value>` |
| 9 | `CON-SET` | `/CONSTRAINT SET` | `CON-SET <key> <operator> <value> [unit]` |
| 10 | `ROL-ADD` | `/ROLE ADD` | `ROL-ADD <name> [actor]` |
| 11 | `ACT-ADD` | `/ACTOR ADD` | `ACT-ADD <id> <role> <name> <authority> [interests_json constraints_json]` |
| 12 | `ACT-LIS` | `/ACTOR LIST` | `ACT-LIS` |
| 13 | `ACT-SHO` | `/ACTOR SHOW` | `ACT-SHO <actor_id>` |
| 14 | `POS-ADD` | `/POSITION ADD` | `POS-ADD <actor_id> <subject_type> <subject_id> <stance> <statement>` |
| 15 | `POS-LIS` | `/POSITION LIST` | `POS-LIS [actor_id] [subject_id]` |
| 16 | `CYC-CRE` | `/CYCLE CREATE` | `CYC-CRE <cycle_id> <horizon> <start_date> <end_date>` |
| 17 | `CYC-LIS` | `/CYCLE LIST` | `CYC-LIS` |
| 18 | `CYC-SHO` | `/CYCLE SHOW` | `CYC-SHO <cycle_id>` |
| 19 | `SCE-CRE` | `/SCENARIO CREATE` | `SCE-CRE <branch_id> <cycle_id> <name>` |
| 20 | `SCE-LIS` | `/SCENARIO LIST` | `SCE-LIS` |
| 21 | `SCE-SEL` | `/SCENARIO SELECT` | `SCE-SEL <branch_id>` |
| 22 | `FAC-SET` | `/FACT SET` | `FAC-SET <statement> <source>` |
| 23 | `ASS-SET` | `/ASSUMPTION SET` | `ASS-SET <statement> <basis>` |
| 24 | `EVI-ADD` | `/EVIDENCE ADD` | `EVI-ADD <evidence_id> <statement> <type> [source_id] [url]` |
| 25 | `EVI-LIS` | `/EVIDENCE LIST` | `EVI-LIS` |
| 26 | `EVI-SHO` | `/EVIDENCE SHOW` | `EVI-SHO <evidence_id>` |
| 27 | `HUM-REV` | `/HUMAN REVIEW` | `HUM-REV <actor> <timestamp_utc> <review> <reason> [authority]` |
| 28 | `SIT-INT` | `/SITE INTELLIGENCE` | `SIT-INT <location>` |
| 29 | `AGE-RUN` | `/AGENT RUN` | `AGE-RUN <agent_type> <alternative_id>` |
| 30 | `DEB-ATE` | `/DEBATE` | `DEB-ATE <alternative_id>` |
| 31 | `GEN-DES` | `/GENERATE DESIGN` | `GEN-DES <method> <parameters_json>` |
| 32 | `GEN-LIS` | `/GENERATE LIST` | `GEN-LIS` |
| 33 | `GEN-SHO` | `/GENERATE SHOW` | `GEN-SHO <generation_id>` |
| 34 | `GEN-MET` | `/GENERATE METHODS` | `GEN-MET` |
| 35 | `ALT-PRO` | `/ALTERNATIVE PROMOTE` | `ALT-PRO <alternative_id>` |
| 36 | `MEM-LIS` | `/MEMORY LIST` | `MEM-LIS` |
| 37 | `MEM-SHO` | `/MEMORY SHOW` | `MEM-SHO <memory_id>` |
| 38 | `MEM-EXT` | `/MEMORY EXTRACT` | `MEM-EXT <type> <title> <content>` |
| 39 | `MEM-REV` | `/MEMORY REVOKE` | `MEM-REV <memory_id>` |
| 40 | `MEM-APP` | `/MEMORY APPLY` | `MEM-APP <memory_id>` |
| 41 | `MEM-TYP` | `/MEMORY TYPES` | `MEM-TYP` |
| 42 | `GEN-ERA` | `/GENERATE` | `GEN-ERA <method> <objective_keys_csv>` |
| 43 | `PAR-ETO` | `/PARETO` | `PAR-ETO <objective_1> <objective_2>` |
| 44 | `TRA-DEO` | `/TRADEOFF_MATRIX` | `TRA-DEO <objective_1> <objective_2>` |
| 45 | `MUL-TIO` | `/MULTIOBJECTIVE` | `MUL-TIO` |
| 46 | `SCA-PAR` | `/SCALE PARENT` | `SCA-PAR <project_id>` |
| 47 | `SCA-CHI` | `/SCALE CHILDREN` | `SCA-CHI <project_id>` |
| 48 | `SCA-RLT` | `/SCALE RELATE` | `SCA-RLT <parent_id> <child_id> <relation_type>` |
| 49 | `SCA-RLS` | `/SCALE RELATIONS` | `SCA-RLS <project_id>` |
| 50 | `PLA-ADD` | `/PLANNING ADD` | `PLA-ADD <id> <type> <name> [jurisdiction] [url]` |
| 51 | `PLA-LIS` | `/PLANNING LIST` | `PLA-LIS` |
| 52 | `PLA-SHO` | `/PLANNING SHOW` | `PLA-SHO <instrument_id>` |
| 53 | `PLA-TYP` | `/PLANNING TYPES` | `PLA-TYP` |
| 54 | `REG-ADD` | `/REGULATION ADD` | `REG-ADD <id> <code> <title> [jurisdiction] [source_url]` |
| 55 | `REG-LIS` | `/REGULATION LIST` | `REG-LIS` |
| 56 | `REG-SHO` | `/REGULATION SHOW` | `REG-SHO <regulation_id>` |
| 57 | `REG-STA` | `/REGULATION STATUS` | `REG-STA <regulation_id> <status>` |
| 58 | `INT-ADD` | `/INTERPRET ADD` | `INT-ADD <id> <regulation_id> <article> <text>` |
| 59 | `INT-LIS` | `/INTERPRET LIST` | `INT-LIS [regulation_id]` |
| 60 | `INT-REV` | `/INTERPRET REVIEW` | `INT-REV <interpretation_id> <actor> <authority>` |
| 61 | `SNA-CRE` | `/SNAPSHOT CREATE` | `SNA-CRE <snapshot_id> <project_id> <cut_date>` |
| 62 | `SNA-LIS` | `/SNAPSHOT LIST` | `SNA-LIS` |
| 63 | `SNA-FRE` | `/SNAPSHOT FREEZE` | `SNA-FRE <snapshot_id>` |
| 64 | `DEC-REC` | `/DECISION RECORD` | `DEC-REC <statement> <actor> <authority>` |
| 65 | `STA-TUS` | `/STATUS` | `STA-TUS` |
| 66 | `HIS-TOR` | `/HISTORY` | `HIS-TOR` |
| 67 | `EXI-IT` | `/EXIT` | `EXI-IT` |

## Política de compatibilidad

Los ejemplos, documentos o integraciones que todavía envíen comandos con `/` no se invalidan automáticamente. Se normalizan al mismo comando interno antes de la ejecución. Los nuevos documentos y ejemplos deben utilizar el código compacto.

## Ejemplos

```text
PRO-CRE CASA-001 "Casa Yvan" PROJECT 2026
SNA-FRE SNAP-001
GEN-DES PARAMETRIC {"quality":"4K"}
HUM-REV owner 2026-09-22T02:00:00Z "Revisión explícita"
```

La revisión humana, los permisos, la validación del Core y la trazabilidad permanecen sin cambios.
