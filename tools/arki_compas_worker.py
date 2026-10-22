#!/usr/bin/env python3
import json
import sys

def emit(payload):
    sys.stdout.write(json.dumps(payload, separators=(",", ":")) + "\n")
    sys.stdout.flush()

try:
    import compas
except Exception as exc:
    emit({"ok": False, "code": "COMPAS_RUNTIME_UNAVAILABLE", "diagnostic": type(exc).__name__})
    raise SystemExit(2)

line = sys.stdin.readline()
try:
    request = json.loads(line)
except Exception:
    emit({"ok": False, "code": "INVALID_REQUEST"})
    raise SystemExit(3)

capability = request.get("capability")
input_data = request.get("input") or {}

if capability == "COMPAS_RUNTIME_IDENTITY":
    output = {
        "runtime": "compas",
        "version": getattr(compas, "__version__", None),
    }
elif capability == "TRANSFORM_POINTS_3D":
    try:
        from compas.geometry import transform_points
        points = input_data["points"]
        matrix = input_data["matrix"]
        output = {"points": transform_points(points, matrix)}
    except (KeyError, TypeError, ValueError) as exc:
        emit({"ok": False, "code": "INVALID_GEOMETRY_INPUT", "diagnostic": type(exc).__name__})
        raise SystemExit(5)
else:
    emit({"ok": False, "code": "CAPABILITY_UNSUPPORTED"})
    raise SystemExit(4)

emit({
    "ok": True,
    "output": output,
    "runtime": {
        "observed": True,
        "name": "compas",
        "version": getattr(compas, "__version__", None),
    },
    "diagnostics": [],
})
