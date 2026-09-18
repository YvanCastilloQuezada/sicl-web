# SiMS-DeI — ARQUI A30
# Automated Accessible-Route Verification

## Estado

```text
A30 IMPLEMENTATION = PASS_WITH_OBSERVATIONS
CORE_CHANGED = NO
BIM_ENTITIES_CREATED = NO
AUTOMATIC_APPROVAL = NO
COMPLIANCE_CERTIFICATION = NOT_ASSESSED
HUMAN_REVIEW = REQUIRED
```

A30 verifica automáticamente la consistencia y completitud de la evidencia de rutas accesibles sobre los read models existentes de A20 y A29. No convierte una ruta propuesta en una ruta accesible certificada.

## Reutilización

A30 reutiliza:

- `ResidentialPlan` y `ResidentialRoute`;
- `ArchitecturalConnectionObservation` de A29;
- `CirculationEvidenceGraph` de A20-P1;
- `assessAccessibilityRoute()` de A20-P2;
- provenance y estados epistemológicos existentes.

No se añadió una segunda circulación, un segundo sistema normativo ni una entidad BIM.

## Verificaciones realizadas

Cada ruta se comprueba en cinco dimensiones:

1. **Identidad de nodos.** Todos los espacios y núcleos de la secuencia deben tener identidad explícita.
2. **Anchura registrada.** La ruta debe registrar una anchura positiva. Esto no demuestra suficiencia normativa.
3. **Continuidad.** Cada transición consecutiva debe tener evidencia de conexión explícita derivada de A29.
4. **Secuencia de niveles.** Los niveles deben estar declarados y no saltar sin evidencia.
5. **Separación normativa.** El resultado se entrega a A20-P2 cuando existe un perfil jurisdiccional; la conformidad sigue siendo `NOT_ASSESSED`.

## Estados

```text
GEOMETRICALLY_SUPPORTED
INCOMPLETE
CONFLICTING_EVIDENCE
UNKNOWN
```

Para HOUSE-001-EXPLICIT, el resultado esperado actual es `INCOMPLETE`: existen nodos y anchura registrada, pero la transición completa a través del núcleo vertical no tiene conexión observada suficiente.

Esto es un resultado correcto y evita un falso éxito.

## Perfil normativo

Cuando se proporciona un `AccessibilityProfile`, A30 puede detectar conflictos como:

```text
CLEAR_WIDTH_BELOW_PROFILE
SLOPE_ABOVE_PROFILE
TURNING_RADIUS_BELOW_PROFILE
LEVEL_CHANGE_ABOVE_PROFILE
```

La detección de un conflicto no equivale a una resolución normativa. El perfil debe incluir jurisdicción, versión de regla y provenance. Sin estos datos, A30 informa entradas incompletas.

## Invariantes

```text
ROUTE_WIDTH ≠ ACCESSIBILITY_COMPLIANCE
CONNECTION ≠ ACCESSIBLE_ROUTE
ACCESSIBLE_ROUTE ≠ CERTIFICATION
A30_CHECK ≠ HUMAN_APPROVAL
A30_CONFLICT ≠ AUTOMATIC_REPAIR
```

A30 no modifica geometría, no repara rutas, no crea puertas, muros, ascensores ni escaleras, y no crea decisiones o recomendaciones.

## Validación

```text
A30 FOCUSED TESTS = PASS
A29 REGRESSION TESTS = PASS
FULL WEB TEST FILES = 64 passed
FULL WEB TESTS = 314 passed
TYPECHECK = PASS
BUILD = PASS
GIT_DIFF_CHECK = PASS
```

El build mantiene el warning no bloqueante existente sobre chunks grandes.

## Commit local

El commit local contiene únicamente el verificador A30, sus pruebas y este informe. No se publica, fusiona ni despliega en esta orden.
