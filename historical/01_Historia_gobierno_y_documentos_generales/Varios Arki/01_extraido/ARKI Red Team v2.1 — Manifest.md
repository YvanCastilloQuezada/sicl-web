# ARKI Red Team v2.1 — Manifest

## Correcciones aplicadas

- Se añadió `test_impact_adversarial.py` con la API canónica `analyze_dependency()`.
- Se verificó que `tests/test_validity.py` no contiene `expose_legacy_derivations`.
- V-05 cambió de `PARTIALLY_VALID → NO_ACTION` a `PARTIALLY_VALID → REVIEW` con autoridad humana requerida.
- H-004 fue alineado con la nueva política V-05.
- Se mantuvo la garantía read-only.

## Archivos canónicos incluidos

- `derivation.py`
- `impact.py`
- `validity.py`
- `test_derivation.py`
- `test_impact.py`
- `test_impact_adversarial.py`
- `test_validity.py`
- `test_multiscale_wall_move_e2e.py`

## Validación

- Tests focales corregidos: 56 passed.
- Suite global del repositorio: 428 passed, 2 warnings no bloqueantes.
- `compileall`: PASS, código de retorno 0.
- Commit local de correcciones: `b7f22d6b31bd350d8814d299919bdaf163d9f68e`.
- No se hizo push, PR ni merge.
