# SICL 0.3 — Reproducibility Evidence

## Baseline

The functional SICL 0.3 baseline is identified by tag `sicl-0.3-profile-replay` and commit `1e8d3fd`. The current reproducibility evidence is maintained at tag `sicl-0.3-reproducibility-current` and commit `bc63a5a`.

## Clean installation

From a clean checkout:

```bash
python3 -m venv /tmp/sicl03-venv
/tmp/sicl03-venv/bin/pip install -e .
/tmp/sicl03-venv/bin/pip install pytest
```

The package installs successfully in an isolated environment and exposes both the legacy `sicl` entry point and the Core Contract 1.0 entry point `sicl-core`. The test runner is installed separately because it is a development verification dependency rather than a runtime dependency.

## Verification

```bash
/tmp/sicl03-venv/bin/pytest -q
/tmp/sicl03-venv/bin/sicl-core --help
/tmp/sicl03-venv/bin/python -m sicl.core_contract.cli --help
```

The clean environment produced **160 passing tests** and exposed the `profile` CLI command family, including `create`, `analyze` and `events`.

## Scope of the claim

This evidence verifies installation, imports, test execution and CLI discovery. It does not claim that SICL 0.3 is a complete decision engine. Profile analysis remains read-only and does not create Recommendations or Decisions.

## Boundary

Core Contract 1.0 and SICL 0.3 may use the same SQLite file, but SICL 0.3 writes only `sicl03_` tables. Cross-layer references remain explicit and are validated before analysis or persistence.
