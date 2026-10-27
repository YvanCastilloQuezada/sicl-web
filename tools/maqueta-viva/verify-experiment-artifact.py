#!/usr/bin/env python3
"""ARKI experimental artifact verifier. Read-only; never promotes canonical knowledge."""
import argparse
import hashlib
import json
import pathlib
import sys

MAX_BYTES = 20 * 1024 * 1024

def digest_file(path):
    if not path.is_file() or path.is_symlink() or path.stat().st_size > MAX_BYTES:
        raise ValueError("FILE_NOT_ALLOWED")
    h = hashlib.sha256()
    with path.open("rb") as stream:
        while chunk := stream.read(65536):
            h.update(chunk)
    return h.hexdigest()

def verify(manifest_path, root):
    result = {
        "schema": "ARKI-ARTIFACT-VERIFICATION-001",
        "status": "REJECTED",
        "checks": {},
        "canonicalMutation": False,
        "knowledgeValidated": False,
        "promotion": "BLOCKED",
    }
    try:
        root = pathlib.Path(root).resolve(strict=True)
        manifest_path = pathlib.Path(manifest_path).resolve(strict=True)
        if not root.is_dir() or not manifest_path.is_relative_to(root):
            raise ValueError("INVALID_ROOT")
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        if not isinstance(manifest, dict) or manifest.get("schema") != "ARKI-EXPERIMENT-RUN-001":
            raise ValueError("INVALID_SCHEMA")
        if not all(isinstance(manifest.get(k), str) and manifest[k].strip()
                   for k in ("experimentId", "runId", "protocol", "artifact", "protocolSha256", "artifactSha256")):
            raise ValueError("MISSING_FIELDS")
        for kind in ("protocol", "artifact"):
            relative = pathlib.PurePosixPath(manifest[kind])
            if relative.is_absolute() or ".." in relative.parts or "\\" in manifest[kind]:
                raise ValueError("UNSAFE_PATH")
            path = root.joinpath(*relative.parts)
            if path.is_symlink() or not path.resolve(strict=True).is_relative_to(root):
                raise ValueError("UNSAFE_PATH")
            actual = digest_file(path)
            expected = manifest[kind + "Sha256"]
            if len(expected) != 64 or any(c not in "0123456789abcdef" for c in expected):
                raise ValueError("INVALID_DIGEST")
            result["checks"][kind + "Sha256"] = {"expected": expected, "actual": actual, "match": actual == expected}
        protocol = json.loads(root.joinpath(*pathlib.PurePosixPath(manifest["protocol"]).parts).read_text(encoding="utf-8"))
        result["checks"]["protocolBinding"] = bool(
            isinstance(protocol, dict)
            and protocol.get("experimentId") == manifest["experimentId"]
            and (protocol.get("runId") is None or protocol.get("runId") == manifest["runId"])
        )
        if all(result["checks"][k]["match"] for k in ("protocolSha256", "artifactSha256")) and result["checks"]["protocolBinding"]:
            result["status"] = "FILE_INTEGRITY_CONFIRMED_NOT_EXECUTION_VERIFIED"
        else:
            result["status"] = "INTEGRITY_OR_BINDING_FAILED"
    except (OSError, ValueError, TypeError, KeyError, json.JSONDecodeError) as exc:
        result["error"] = str(exc)[:200]
    return result

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--root", required=True)
    parser.add_argument("--output")
    args = parser.parse_args()
    report = verify(args.manifest, args.root)
    encoded = json.dumps(report, indent=2, sort_keys=True) + "\n"
    if args.output:
        pathlib.Path(args.output).write_text(encoded, encoding="utf-8")
    else:
        sys.stdout.write(encoded)
    return 0 if report["status"] == "FILE_INTEGRITY_CONFIRMED_NOT_EXECUTION_VERIFIED" else 1

if __name__ == "__main__":
    raise SystemExit(main())
