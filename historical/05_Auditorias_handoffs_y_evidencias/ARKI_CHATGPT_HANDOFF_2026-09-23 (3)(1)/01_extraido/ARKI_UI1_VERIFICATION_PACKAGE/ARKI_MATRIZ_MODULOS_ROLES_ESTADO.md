# ARKI — Matriz de módulos por rol y estado

**Estados:** `IMPLEMENTED`, `VERIFIED`, `PARTIAL`, `CONCEPTUAL`, `NOT AVAILABLE`, `FUTURE REFERENCE`, `PENDING E2E`.

| Módulo | Visitante | Usuario | Especialista | Corporativo | Estado real |
|---|---|---|---|---|---|
| Gateway | permitido | permitido | permitido | permitido | VERIFIED visual |
| Inicio | permitido | permitido | permitido | permitido | PARTIAL |
| Proyectos | no disponible | permitido | permitido | permitido | CONCEPTUAL / local |
| Generador | no disponible | permitido | permitido | permitido | VERIFIED dominio |
| Biblioteca | permitido | permitido | permitido | permitido | PARTIAL |
| Modelo BIM | no disponible | permitido | permitido | permitido | VERIFIED dominio / PENDING E2E |
| Planta | no disponible | permitido | permitido | permitido | CONCEPTUAL |
| Corte | no disponible | permitido | permitido | permitido | CONCEPTUAL |
| 3D | no disponible | permitido | permitido | permitido | CONCEPTUAL |
| Metrados | no disponible | permitido | permitido | permitido | VERIFIED referencial |
| Presupuesto | no disponible | permitido | permitido | permitido | VERIFIED referencial |
| 4D / avance | no disponible | permitido | permitido | permitido | PARTIAL / simulación |
| Clashes | no disponible | permitido | permitido | permitido | PARTIAL / heurístico |
| Expediente | no disponible | permitido | permitido | permitido | PARTIAL, readiness 50% |
| Encofrados | no disponible | permitido | permitido | permitido | VERIFIED cálculo referencial |
| S10 / CAPECO | no disponible | no disponible | permitido | permitido | VERIFIED local |
| CDE | no disponible | permitido | permitido | permitido | PARTIAL / local |
| Aprobaciones | no disponible | no disponible | permitido | permitido | CONCEPTUAL / no legal |
| O&M | no disponible | permitido | permitido | permitido | FUTURE REFERENCE |
| Administración | no disponible | no disponible | no disponible | permitido | FUTURE REFERENCE |
| RVT/RFA | no disponible | no disponible | no disponible | no disponible | NOT AVAILABLE |
| BCF productivo | no disponible | no disponible | no disponible | no disponible | FUTURE REFERENCE |
| Autenticación corporativa | no disponible | no disponible | no disponible | no disponible | NOT AVAILABLE |

## Regla de promoción

La existencia de una pestaña o botón no promueve un módulo a `IMPLEMENTED`. Para promoverlo se exige contrato de dominio, integración, comportamiento verificable, test reproducible y evidencia de navegador cuando corresponda.

## Evidencia de UI-1

- El gateway fue navegado visualmente.
- Usuario / Proyecto abrió el shell.
- Generar propuesta produjo modelo constructivo, costos, 4D, clashes, expediente y encofrados visibles.
- `pnpm check` y `pnpm build` finalizaron con código 0.
- La suite de dominio terminó con código 0.
