#!/usr/bin/env python3
"""ARKI's bounded parametric kernel.

This is deliberately not an arbitrary Python executor. It accepts a small,
versioned graph vocabulary and returns deterministic JSON plus an execution hash.
"""
from __future__ import annotations

import hashlib
import json
import math
import sys
from typing import Any

ALLOWED_OPS = {"constant", "add", "multiply", "rectangle_points", "translate_points", "scale_points"}


def canonical(value: Any) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True)


def resolve(value: Any, values: dict[str, Any]) -> Any:
    if isinstance(value, str) and value.startswith("$"):
        key = value[1:]
        if key not in values:
            raise ValueError(f"unknown graph reference: {key}")
        return values[key]
    return value


def number(value: Any) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(float(value)):
        raise ValueError("numeric parameter must be finite")
    return float(value)


def evaluate_node(node: dict[str, Any], values: dict[str, Any]) -> Any:
    op = node.get("op")
    if op not in ALLOWED_OPS:
        raise ValueError(f"operation not allowed: {op}")
    params = {key: resolve(value, values) for key, value in dict(node.get("params", {})).items()}
    if op == "constant":
        return params.get("value")
    if op == "add":
        return number(params.get("a")) + number(params.get("b"))
    if op == "multiply":
        return number(params.get("a")) * number(params.get("b"))
    if op == "rectangle_points":
        width, height = number(params.get("width")), number(params.get("height"))
        if width <= 0 or height <= 0:
            raise ValueError("rectangle dimensions must be positive")
        return [[0.0, 0.0], [width, 0.0], [width, height], [0.0, height], [0.0, 0.0]]
    if op == "translate_points":
        points = params.get("points")
        dx, dy = number(params.get("dx")), number(params.get("dy"))
        if not isinstance(points, list) or not all(isinstance(point, list) and len(point) == 2 for point in points):
            raise ValueError("points must be a list of [x,y] pairs")
        return [[float(point[0]) + dx, float(point[1]) + dy] for point in points]
    if op == "scale_points":
        points = params.get("points")
        factor = number(params.get("factor"))
        if factor <= 0 or not isinstance(points, list) or not all(isinstance(point, list) and len(point) == 2 for point in points):
            raise ValueError("scale requires a positive factor and [x,y] pairs")
        return [[float(point[0]) * factor, float(point[1]) * factor] for point in points]
    raise ValueError("unreachable")


def evaluate(request: dict[str, Any]) -> dict[str, Any]:
    if request.get("contractVersion") != "ARKI-PARAMETRIC-1.0":
        raise ValueError("unsupported contractVersion")
    nodes = request.get("nodes")
    if not isinstance(nodes, list) or not nodes or len(nodes) > 500:
        raise ValueError("nodes must contain 1..500 entries")
    values: dict[str, Any] = {}
    remaining = list(nodes)
    while remaining:
        progressed = False
        next_remaining = []
        for node in remaining:
            node_id = node.get("id")
            if not isinstance(node_id, str) or not node_id or node_id in values:
                raise ValueError("node ids must be unique non-empty strings")
            refs = [value[1:] for value in dict(node.get("params", {})).values() if isinstance(value, str) and value.startswith("$")]
            if any(ref not in values for ref in refs):
                next_remaining.append(node)
                continue
            values[node_id] = evaluate_node(node, values)
            progressed = True
        if not progressed:
            raise ValueError("graph contains an unresolved reference or cycle")
        remaining = next_remaining
    requested = request.get("outputs") or list(values.keys())
    if not isinstance(requested, list) or not all(output in values for output in requested):
        raise ValueError("outputs must reference evaluated nodes")
    result = {"contractVersion": request["contractVersion"], "outputs": {output: values[output] for output in requested}}
    execution_hash = hashlib.sha256(canonical({"request": request, "result": result}).encode("utf-8")).hexdigest()
    return {"status": "EXECUTED", "deterministic": True, "softRealtime": True, "result": result, "executionHash": f"sha256:{execution_hash}"}


def main() -> None:
    request = json.load(sys.stdin)
    try:
        print(json.dumps(evaluate(request), sort_keys=True, separators=(",", ":")))
    except Exception as error:
        print(json.dumps({"status": "REJECTED", "deterministic": True, "error": str(error)}, sort_keys=True, separators=(",", ":")))
        raise SystemExit(2)


if __name__ == "__main__":
    main()
