# BKH4-3 Integrated Torture Test

## Scenario

A canonical V10 state contains a wall and a door. The proposed declarative mutation changes the wall width from 3 to 4. A real BKH-1 `OPENS_TO` relationship is present. BKH-2 evaluates a dimension predicate against the isolated entity. BKH-3 receives a derived quantity change and executes a registered quantity regenerator.

## Required chain

```text
V10 canonical
  → UPDATE_PROPERTY wall.width
  → isolated state
  → BKH-1 relationship impact
  → BKH-2 evaluation
  → BKH-3 invalidation/regeneration
  → derived consequence
  → simulated V10'
```

## Adversarial branches

The same fixture also exercises stale base version, a violated constraint, an UNKNOWN constraint caused by missing dependency, blocked regeneration, failed regeneration, malformed transaction and deterministic repetition.

## Result

```text
CANONICAL_STATE_UNCHANGED: PASS
SIMULATION_DETERMINISM: PASS
STALE_BASE_VERSION: PASS
CONSTRAINT_VIOLATION: PASS
CONSTRAINT_UNKNOWN: PASS
MISSING_DEPENDENCY: PASS
REGENERATION_BLOCKED: PASS
REGENERATION_FAILED: PASS
MALFORMED_TRANSACTION: PASS
NO_COMMIT_PATH_CREATED: PASS
```

The canonical V10 state remains unchanged; only the isolated simulation state contains the proposed width.
