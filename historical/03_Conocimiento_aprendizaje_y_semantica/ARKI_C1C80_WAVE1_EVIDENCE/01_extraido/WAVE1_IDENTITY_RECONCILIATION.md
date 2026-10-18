# WAVE 1 — Identity Reconciliation

**Estado máximo:** `RECONCILED / OWNER RECOMMENDATION PENDING INDEPENDENT REVIEW`

## Resultado

WAVE 1 no canoniza automáticamente `ArchiElementId` ni `GlobalId` como identidad universal. El contrato común define `StableIdentity.arkiId` y `IdentityMapping` como una capa de identidad ARKI con mappings externos explícitos. La recomendación provisional es:

```text
ARKI_ENTITY_ID
    ↓
EXTERNAL IDENTITY MAPPINGS
```

La recomendación no es todavía una decisión irreversible de ownership.

## Criterios auditados

| Criterio | Resultado | Evidencia |
|---|---|---|
| Stability | CONTRATO DEFINIDO | `StableIdentity.arkiId` + `createdAt` |
| Uniqueness | VALIDATED BY TEST | `assertNoDuplicateIdentities()` |
| Cross-domain applicability | CONTRACTED | `semanticType` + `Applicability` |
| Version behavior | PRESERVED | `supersedes` + external version |
| Lineage | CONTRACTED | `ProvenanceRecord` + `DependencyEdge` |
| External mapping | CONTRACTED | `IdentityMapping` |
| Collision handling | VALIDATED BY TEST | `assertNoIdentityCollisions()` |
| Persistence compatibility | BOUNDED | compatible with `TX003C_CAS`; no migration executed |

## Curator boundary

El Semantic Curator queda limitado a `REGISTER`, `MAP`, `VALIDATE`, `DETECT CONFLICT`, `CHECK APPLICABILITY`, `TRACE LINEAGE` y `PROPOSE`. No realiza commit canónico, autoaprobación ni bypass de Human Authority.

## Decision required

Recomendar un owner definitivo requiere evidencia cross-domain y persistencia productiva adicional. Si esa decisión se vuelve irreversible, debe emitirse `DECISION_REQUIRED`; WAVE 1 no la fuerza.
