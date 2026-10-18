# SICL 0.2.1 — Evidence

## Instalación

```text
python3 -m pip install -e '.[dev]'
```

Resultado: instalación editable exitosa.

## Tests

```text
pytest -q -rA
```

Resultado: **8 passed**.

Pruebas ejecutadas:

```text
PASSED tests/test_application.py::test_project_and_semantic_flow
PASSED tests/test_application.py::test_unknown_and_future_commands_are_distinct
PASSED tests/test_domain_and_contract.py::test_semantic_types_remain_distinct
PASSED tests/test_domain_and_contract.py::test_constraint_operator_normalizes_double_equals
PASSED tests/test_domain_and_contract.py::test_invalid_constraint_operator_rejected
PASSED tests/test_persistence_and_architecture.py::test_state_and_events_survive_restart
PASSED tests/test_persistence_and_architecture.py::test_recommendation_and_decision_are_distinct
PASSED tests/test_persistence_and_architecture.py::test_domain_does_not_import_sqlite
```

## Vertical slice UPAO-001

```text
python3 examples/upao_vertical_slice.py
```

Resultado:

```text
UPAO-001 vertical slice: OK
{'events': 15, 'project_id': 'UPAO-001'}
Recommendation and Decision are both present and distinct.
```

Los datos del ejemplo están marcados como sintéticos/ilustrativos y no se presentan como datos reales de UPAO.

## CLI instalada

La entrada instalada `sicl` fue probada con creación, visualización y salida:

```text
OK: PROJECT_CREATED
OK: PROJECT_SHOWN
OK: EXIT
```

## Corrección encontrada durante la implementación

La primera instalación falló porque `pyproject.toml` tenía varias declaraciones duplicadas de `tool.pytest.ini_options`. Se consolidó la configuración en una sola sección.

La primera ejecución de tests reveló un error real en el `INSERT` de proyectos: la sentencia SQLite esperaba cuatro valores y recibía tres. Se corrigió proporcionando la versión inicial del proyecto.

También se corrigió el parser para argumentos con espacios, incluyendo nombres de proyectos, requisitos, recomendaciones y decisiones humanas.

## Estado honesto

El MVP es funcional y verificable en el alcance implementado. La trazabilidad actual es operacional básica. El almacenamiento de eventos todavía utiliza el snapshot completo del proyecto y no constituye un event log append-only completo. No se implementaron IA, agentes, perfiles completos, GIS, BIM, optimización, causalidad ni decisión autónoma.
