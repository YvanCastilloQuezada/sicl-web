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

if request.get("capability") != "COMPAS_RUNTIME_IDENTITY":
    emit({"ok": False, "code": "CAPABILITY_UNSUPPORTED"})
    raise SystemExit(4)

emit({
    "ok": True,
    "output": {
        "runtime": "compas",
        "version": getattr(compas, "__version__", None),
    },
    "runtime": {
        "observed": True,
        "name": "compas",
        "version": getattr(compas, "__version__", None),
    },
    "diagnostics": [],
})
