# ARKI Codebook for Architect v1.0 Candidate

**Estado:** APPROVED / CANONICAL
**Aprobación:** 23 de septiembre de 2026 — Product Owner / Human Authority

| Código | Qué significa | En palabras simples | Estado | ¿Debo preocuparme ahora? |
|---|---|---|---|---|
| AKI-001 | Programa de conocimiento del arquitecto | Libro y currículo para que ARKI conserve conocimiento útil | IMPLEMENTED / historical baseline | WATCH |
| BKH-0 | Mapeo forense | Revisó qué existía realmente antes de diseñar más kernel | VERIFIED | NO |
| BKH-1 | Relationship Fabric | Dice qué elemento se relaciona con cuál | VERIFIED | NO |
| BKH-2 | Constraint Engine | Dice qué condiciones están permitidas, prohibidas o desconocidas | VERIFIED | NO |
| BKH-3 | Regeneration Engine | Decide qué debe volver a calcularse cuando algo cambia | VERIFIED | NO |
| BKH-4 | Transaction Engine | Gobierna cómo se propone y controla un cambio | BKH4-0/1/2 VERIFIED FOR APPROVED SCOPE; BKH4-3 IMPLEMENTED / PENDING INDEPENDENT VERIFICATION | WATCH |
| BKH-5 | Documentation Compiler | Derivaría planos, láminas y documentos | BLOCKED | WATCH |
| BKH-6 | Performance | Mediría rendimiento con proyectos grandes | BLOCKED | WATCH |
| BKH-7 | Integrated Torture Test | Prueba integrada de todo el kernel | BLOCKED | WATCH |
| E5 | Entrega histórica de canvas/selección | Iteración congelada de visualización BIM | FROZEN | HISTORICAL |
| E6 | Entrega histórica IFC/persistencia | Iteración congelada de interoperabilidad/persistencia | PARTIAL / FROZEN | WATCH |
| E7 | Entrega histórica 4D/5D/clashes | Iteración congelada de coordinación y costos | PARTIAL / FROZEN | WATCH |
| UI-1 | Gateway y shell BIM | Entrada y marco general de trabajo | APPROVE / CLOSED | NO |
| UI-2 | Workspace BIM | Pantalla principal con módulos y paneles | APPROVE / CLOSED | NO |
| UI-3A | Canvas y selección | Área para ver y seleccionar elementos | APPROVED lineage | WATCH |
| ORDEN 95 | Fundación BKH4 | Implementó identidad, estados y mutations declarativas | VERIFIED FOR APPROVED SCOPE | WATCH |
| ORDEN 95A | Endurecimiento BKH4 | Cerró defectos defensivos de esa fundación | CLOSED / VERIFIED FOR APPROVED SCOPE | WATCH |
| IFC | Estándar externo de intercambio BIM | Formato común para intercambiar modelos | PARTIAL bounded support | WATCH |
| ISO 16739 | Norma externa relacionada con IFC | Norma que define IFC | REFERENCE | NO |
| D-series | Códigos históricos ARKI | Nombres de etapas antiguas cuyo detalle no está completamente recuperado | HISTORICAL / UNKNOWN details | HISTORICAL |
| OI-* | Open Items | Lista de pendientes o preguntas abiertas | MIXED | WATCH |
| FIX-* | Corrective Fixes | Correcciones acotadas de una revisión | MIXED by parent | WATCH |

## Regla práctica

`VERIFIED` siempre significa verificado dentro de un alcance definido. En esta versión, BKH-2 y BKH-3 tienen cierres verificados dentro de sus alcances respectivos, y BKH4-0/1/2 tiene verificación independiente para el alcance aprobado. No incluye capacidades futuras bloqueadas. No significa que ARKI sea un sustituto de software profesional firmado. `HARDENED` tampoco significa `COMMITTED` ni `PRODUCTION COMPLETE`.

**Preguntas importantes ahora:** mantener BKH4-3 y las etapas posteriores bloqueadas hasta una orden independiente, resolver ownership pendientes antes de stages posteriores y no confundir capacidades bounded con solvers profesionales.
