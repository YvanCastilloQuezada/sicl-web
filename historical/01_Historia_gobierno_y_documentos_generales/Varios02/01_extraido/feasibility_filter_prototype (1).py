#!/usr/bin/env python3
"""Prototype RFC-020: FeasibilityState and feasible Pareto filtering.

This file is intentionally standalone. It does not import or modify SICL Core,
its database, HTTP API, or CLI. It uses only the Python standard library.

Prototype policy:
- FEASIBLE: every hard constraint is satisfied.
- INFEASIBLE: at least one hard constraint is evaluated and violated.
- INSUFFICIENT_DATA: a required value is missing for at least one applicable
  constraint and no hard constraint has already been proven violated.
- UNKNOWN: evaluation cannot be determined because of an unsupported operator,
  non-numeric value, or another evaluation error.
- Soft-constraint violations are reported but do not make an alternative
  INFEASIBLE in this prototype.
- UNKNOWN and INSUFFICIENT_DATA are excluded from feasible_pareto_front.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from math import isclose
from typing import Any, Iterable, Mapping, Sequence


class FeasibilityState(str, Enum):
    FEASIBLE = "FEASIBLE"
    INFEASIBLE = "INFEASIBLE"
    UNKNOWN = "UNKNOWN"
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA"


class Operator(str, Enum):
    LE = "<="
    LT = "<"
    EQ = "="
    GE = ">="
    GT = ">"


class Direction(str, Enum):
    MAXIMIZE = "MAXIMIZE"
    MINIMIZE = "MINIMIZE"


@dataclass(frozen=True)
class Constraint:
    constraint_id: str
    key: str
    operator: Operator
    limit: float
    hard: bool = True
    unit: str | None = None


@dataclass(frozen=True)
class Objective:
    key: str
    direction: Direction


@dataclass(frozen=True)
class Alternative:
    alternative_id: str
    values: Mapping[str, Any]
    # These fields are contextual metadata only; they do not infer factibility.
    spatial_scope: str = "edificacion"
    evidence_ids: tuple[str, ...] = ()
    assumption_ids: tuple[str, ...] = ()


@dataclass(frozen=True)
class ConstraintCheck:
    constraint_id: str
    key: str
    state: str
    hard: bool
    actual: Any = None
    expected: float | None = None
    operator: str | None = None
    reason: str | None = None


@dataclass(frozen=True)
class FeasibilityResult:
    alternative_id: str
    state: FeasibilityState
    checks: tuple[ConstraintCheck, ...]
    failed_constraint_ids: tuple[str, ...]
    unknown_constraint_ids: tuple[str, ...]
    insufficient_constraint_ids: tuple[str, ...]
    evidence_ids: tuple[str, ...]
    assumption_ids: tuple[str, ...]
    evaluated_by: str
    method: str = "constraint_filter_v1"

    @property
    def hard_failures(self) -> tuple[str, ...]:
        return tuple(
            check.constraint_id
            for check in self.checks
            if check.hard and check.state == "VIOLATED"
        )


def _compare(actual: float, operator: Operator, expected: float) -> bool:
    if operator is Operator.LE:
        return actual <= expected
    if operator is Operator.LT:
        return actual < expected
    if operator is Operator.EQ:
        return isclose(actual, expected, rel_tol=1e-9, abs_tol=1e-9)
    if operator is Operator.GE:
        return actual >= expected
    if operator is Operator.GT:
        return actual > expected
    raise ValueError(f"unsupported operator: {operator!r}")


def evaluate_feasibility(
    alternative: Alternative,
    constraints: Iterable[Constraint],
    *,
    evaluated_by: str = "prototype-human-review",
) -> FeasibilityResult:
    """Evaluate constraints without inferring missing facts or normative data."""
    checks: list[ConstraintCheck] = []

    for constraint in constraints:
        actual = alternative.values.get(constraint.key)
        if actual is None:
            checks.append(
                ConstraintCheck(
                    constraint_id=constraint.constraint_id,
                    key=constraint.key,
                    state="INSUFFICIENT_DATA",
                    hard=constraint.hard,
                    expected=constraint.limit,
                    operator=constraint.operator.value,
                    reason="required value is absent",
                )
            )
            continue

        try:
            actual_number = float(actual)
            satisfied = _compare(actual_number, constraint.operator, constraint.limit)
        except (TypeError, ValueError) as exc:
            checks.append(
                ConstraintCheck(
                    constraint_id=constraint.constraint_id,
                    key=constraint.key,
                    state="UNKNOWN",
                    hard=constraint.hard,
                    actual=actual,
                    expected=constraint.limit,
                    operator=getattr(constraint.operator, "value", str(constraint.operator)),
                    reason=str(exc),
                )
            )
            continue

        checks.append(
            ConstraintCheck(
                constraint_id=constraint.constraint_id,
                key=constraint.key,
                state="SATISFIED" if satisfied else "VIOLATED",
                hard=constraint.hard,
                actual=actual_number,
                expected=constraint.limit,
                operator=constraint.operator.value,
            )
        )

    hard_violations = [c for c in checks if c.hard and c.state == "VIOLATED"]
    hard_unknown = [c for c in checks if c.hard and c.state == "UNKNOWN"]
    hard_insufficient = [c for c in checks if c.hard and c.state == "INSUFFICIENT_DATA"]

    if hard_violations:
        state = FeasibilityState.INFEASIBLE
    elif hard_unknown:
        state = FeasibilityState.UNKNOWN
    elif hard_insufficient:
        state = FeasibilityState.INSUFFICIENT_DATA
    else:
        state = FeasibilityState.FEASIBLE

    return FeasibilityResult(
        alternative_id=alternative.alternative_id,
        state=state,
        checks=tuple(checks),
        failed_constraint_ids=tuple(c.constraint_id for c in checks if c.state == "VIOLATED"),
        unknown_constraint_ids=tuple(c.constraint_id for c in checks if c.state == "UNKNOWN"),
        insufficient_constraint_ids=tuple(
            c.constraint_id for c in checks if c.state == "INSUFFICIENT_DATA"
        ),
        evidence_ids=alternative.evidence_ids,
        assumption_ids=alternative.assumption_ids,
        evaluated_by=evaluated_by,
    )


def dominates(
    left: Alternative,
    right: Alternative,
    objectives: Sequence[Objective],
) -> bool:
    """Return True when left is no worse in every objective and better in one."""
    no_worse = True
    strictly_better = False
    for objective in objectives:
        left_value = float(left.values[objective.key])
        right_value = float(right.values[objective.key])
        if objective.direction is Direction.MAXIMIZE:
            if left_value < right_value:
                no_worse = False
            if left_value > right_value:
                strictly_better = True
        else:
            if left_value > right_value:
                no_worse = False
            if left_value < right_value:
                strictly_better = True
    return no_worse and strictly_better


def pareto_front(
    alternatives: Sequence[Alternative],
    objectives: Sequence[Objective],
) -> list[Alternative]:
    """Compute the raw Pareto front, preserving input order."""
    if not objectives:
        raise ValueError("at least one objective is required")
    return [
        candidate
        for candidate in alternatives
        if not any(
            other.alternative_id != candidate.alternative_id
            and dominates(other, candidate, objectives)
            for other in alternatives
        )
    ]


@dataclass(frozen=True)
class ParetoAnalysis:
    raw_front: tuple[Alternative, ...]
    feasible_front: tuple[Alternative, ...]
    feasibility: Mapping[str, FeasibilityResult]


def feasible_pareto_front(
    alternatives: Sequence[Alternative],
    objectives: Sequence[Objective],
    constraints: Iterable[Constraint],
    *,
    evaluated_by: str = "prototype-human-review",
) -> ParetoAnalysis:
    """Return raw and feasibility-filtered Pareto fronts separately."""
    materialized_constraints = tuple(constraints)
    results = {
        alternative.alternative_id: evaluate_feasibility(
            alternative, materialized_constraints, evaluated_by=evaluated_by
        )
        for alternative in alternatives
    }
    raw = pareto_front(alternatives, objectives)
    feasible = [
        alternative
        for alternative in raw
        if results[alternative.alternative_id].state is FeasibilityState.FEASIBLE
    ]
    return ParetoAnalysis(tuple(raw), tuple(feasible), results)


def _demo() -> ParetoAnalysis:
    """Run a synthetic investment/design scenario."""
    alternatives = [
        Alternative(
            "MULTI-A",
            {"energy_savings": 95, "construction_cost": 82, "investment": 100},
            evidence_ids=("EVID-A",),
        ),
        Alternative(
            "MULTI-B",
            {"energy_savings": 82, "construction_cost": 68, "investment": 72},
            evidence_ids=("EVID-B",),
        ),
        Alternative(
            "MULTI-C",
            {"energy_savings": 72, "construction_cost": 58, "investment": 48},
            evidence_ids=("EVID-C",),
        ),
        Alternative(
            "MULTI-D-UNKNOWN",
            {"energy_savings": 88, "construction_cost": 62},
            assumption_ids=("ASSUMP-D",),
        ),
        Alternative(
            "MULTI-E-INFEASIBLE",
            {"energy_savings": 98, "construction_cost": 120, "investment": 140},
            evidence_ids=("EVID-E",),
        ),
    ]
    objectives = (
        Objective("energy_savings", Direction.MAXIMIZE),
        Objective("construction_cost", Direction.MINIMIZE),
    )
    constraints = (
        Constraint("INV-001", "investment", Operator.LE, 100, hard=True, unit="USD_MILLION"),
    )
    return feasible_pareto_front(alternatives, objectives, constraints)


def _self_test() -> None:
    analysis = _demo()
    states = {key: value.state.value for key, value in analysis.feasibility.items()}
    assert states == {
        "MULTI-A": "FEASIBLE",
        "MULTI-B": "FEASIBLE",
        "MULTI-C": "FEASIBLE",
        "MULTI-D-UNKNOWN": "INSUFFICIENT_DATA",
        "MULTI-E-INFEASIBLE": "INFEASIBLE",
    }, states
    assert [a.alternative_id for a in analysis.raw_front] == [
        "MULTI-A",
        "MULTI-C",
        "MULTI-D-UNKNOWN",
        "MULTI-E-INFEASIBLE",
    ]
    assert [a.alternative_id for a in analysis.feasible_front] == ["MULTI-A", "MULTI-C"]


def _print_report(analysis: ParetoAnalysis) -> None:
    print("RFC-020 STANDALONE PROTOTYPE")
    print("CORE_MODIFIED=no")
    print("DATABASE_MODIFIED=no")
    print("HTTP_API_MODIFIED=no")
    print()
    print("FEASIBILITY_RESULTS")
    for alternative_id, result in analysis.feasibility.items():
        print(f"  {alternative_id}: {result.state.value}")
        if result.failed_constraint_ids:
            print(f"    failed_constraints={list(result.failed_constraint_ids)}")
        if result.insufficient_constraint_ids:
            print(f"    insufficient_constraints={list(result.insufficient_constraint_ids)}")
        if result.unknown_constraint_ids:
            print(f"    unknown_constraints={list(result.unknown_constraint_ids)}")
    print()
    print("RAW_PARETO_FRONT", [a.alternative_id for a in analysis.raw_front])
    print("FEASIBLE_PARETO_FRONT", [a.alternative_id for a in analysis.feasible_front])
    print()
    print("POLICY")
    print("  INFEASIBLE, UNKNOWN, and INSUFFICIENT_DATA are excluded from feasible_pareto_front")
    print("  all alternatives remain visible in raw_pareto_front and audit data")


if __name__ == "__main__":
    _self_test()
    _print_report(_demo())
