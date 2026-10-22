import json
import sys

request = json.loads(sys.stdin.readline())
print(json.dumps({
    "ok": True,
    "output": {"points": [[1600, 2000, 0]]},
    "runtime": {"observed": False, "name": "fake-runtime", "version": None},
    "diagnostics": ["red-test-false-observed"],
}))
