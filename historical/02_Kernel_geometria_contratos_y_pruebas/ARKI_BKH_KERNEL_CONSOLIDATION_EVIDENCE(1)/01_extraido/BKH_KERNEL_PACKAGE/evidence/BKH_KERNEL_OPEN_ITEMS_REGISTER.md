# ARKI — BKH Kernel Open Items Register

**Orden:** 93 · **Baseline:** post-92A · **Estado:** auditoría en ejecución

| ID | Área | Clasificación | Evidencia / razón | Acción |
|---|---|---|---|---|
| OI-001 | Worktree histórico | DEFERRED_WITH_REASON | `main@c62183a`; cambios UI-3A y numerosos artefactos no versionados ya existían antes de Orden 93 | No resetear ni borrar; conservar clasificación en baseline |
| OI-002 | BKH-1 | PROVEN_SAFE | Suite específica y regresión ejecutadas; fixes de inversa, revisiones y evidencia cubiertos | Mantener cerrado |
| OI-003 | BKH-2 | PROVEN_SAFE | Suite específica y regresión ejecutadas; estados, evidencia, dependencias y moneda cubiertos en la suite vigente | Mantener cerrado para este audit |
| OI-004 | BKH-3 | PROVEN_SAFE | Suite original y suite correctiva 92A PASS; paquete hash-verified | Someter a tortura adicional |
| OI-005 | BKH-3 cross-engine | FIX_NOW | La cobertura 92A demuestra gates, pero no cubre aún toda la matriz KITM-001 | Añadir pruebas adversariales sin rediseño |
| OI-006 | Serialization/reload integral | DEFERRED_WITH_REASON | Hay pruebas locales por subsistema, no una secuencia única Relationship/Constraint/Derived close-reopen | Documentar; no inventar persistencia BKH-3 |
| OI-007 | Worksharing / multiusuario | OUT_OF_SCOPE | Firewall explícito pre-BKH-4 | No implementar |
| OI-008 | Transaction/commit/rollback | OUT_OF_SCOPE | BKH-4 bloqueado | No implementar |
| OI-009 | Solvers profesionales | DEFERRED_WITH_REASON | No existen adapters/hosts productivos autorizados | Preservar UNKNOWN/UNSUPPORTED_SOLVER |
| OI-010 | Ownership global Geometry/Quantity/Cost/Schedule | ARCHITECTURAL_DECISION_REQUIRED | BKH-0 reporta ownership paralelo | No resolver durante Orden 93 |
| OI-011 | Evidence package | PROVEN_SAFE | 22 archivos declarados, presentes y con hash coincidente en ZIP 92A | Reutilizar como evidencia post-92A |
| OI-012 | Bypass hunt | FIX_NOW | Deben verificarse escritores directos y regeneración fuera de BKH-3 | Clasificar por evidencia; no borrar automáticamente |

No se utiliza `TODO`, `later`, `probably okay` ni deuda silenciosa. Cada elemento queda en una de las categorías permitidas por la Orden 93.
