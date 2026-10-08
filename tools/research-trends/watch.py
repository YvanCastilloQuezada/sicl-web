#!/usr/bin/env python3
"""External, read-only ARKI Research & Trends release watcher (stdlib only)."""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

SCHEMA = "ARKI-RESEARCH-WATCH-1"
REPO_PATTERN = re.compile(r"^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$")
ID_PATTERN = re.compile(r"^[a-z][a-z0-9_-]{1,40}$")
PHASES = {"F" + str(i) for i in range(1, 11)}
ALLOWED = {"geometry_kernel", "exact_geometry", "robust_mesh_boolean",
           "volumetric_geometry", "parametric_cad", "ifc_interoperability"}
MAX_BYTES = 1_000_000

# These are explicit existing-scope signals, not proof of functional equivalence.
CANONICAL_SIGNALS = {
    "geometry_kernel": [
        ("f6_agk_integral_closure.authority.canonical_brep", "VERIFIED_BOUNDED_AUTHORITY"),
        ("agk_delta_005.authority.brep_representation", "VERIFIED_BOUNDED_AUTHORITY")],
    "exact_geometry": [
        ("agk_delta_005.phase1.boolean_exact", "TESTED_SCOPE_NOT_GENERAL_EQUIVALENCE")],
    "robust_mesh_boolean": [
        ("agk_delta_005.phase1.boolean_local_move", "TESTED_SCOPE_NOT_GENERAL_EQUIVALENCE")],
    "volumetric_geometry": [
        ("f6_agk_integral_closure.authority.canonical_brep", "EXISTING_GEOMETRY_AUTHORITY_NOT_VOLUMETRIC_PROOF")],
    "parametric_cad": [
        ("f7_professional_technical_development.work_packages", "REGISTERED_SCOPE_ONLY")],
    "ifc_interoperability": [
        ("f7_professional_technical_development.work_packages", "REGISTERED_SCOPE_ONLY")],
}


def canonical_signals(canonical, capability):
    results = []
    for path, meaning in CANONICAL_SIGNALS.get(capability, []):
        value = canonical
        for part in path.split("."):
            if not isinstance(value, dict) or part not in value:
                value = None
                break
            value = value[part]
        if value is None:
            continue
        if isinstance(value, list):
            value = [v for v in value if isinstance(v, str) and
                     (("IFC" in v.upper() or "CAD" in v.upper()) if
                      capability in {"parametric_cad", "ifc_interoperability"} else True)]
        if not value:
            continue
        results.append({"canonical_path": path, "recorded_value": value,
                        "meaning": meaning})
    return results



def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def atomic_json(path: Path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(json.dumps(obj, indent=2, ensure_ascii=False, sort_keys=True) + "\n",
                   encoding="utf-8")
    tmp.replace(path)


def validate_sources(data):
    if not isinstance(data, dict) or data.get("schema") != "ARKI-RESEARCH-SOURCES-1":
        raise ValueError("Unknown source registry schema")
    entries = data.get("sources")
    if not isinstance(entries, list) or not 1 <= len(entries) <= 12:
        raise ValueError("Expected 1–12 curated sources")
    ids = set()
    for s in entries:
        if not isinstance(s, dict) or not ID_PATTERN.fullmatch(str(s.get("id", ""))):
            raise ValueError("Invalid source id")
        if s["id"] in ids:
            raise ValueError("Duplicate source id")
        ids.add(s["id"])
        repo = s.get("repository", "")
        if not isinstance(repo, str) or not REPO_PATTERN.fullmatch(repo):
            raise ValueError("Invalid pinned GitHub repository")
        if s.get("official") != "https://github.com/" + repo + "/releases":
            raise ValueError("Official URL must match pinned repository")
        if s.get("phase") not in PHASES or s.get("capability") not in ALLOWED:
            raise ValueError("Unknown phase/capability mapping")
    return entries


def fetch_release(source, token=None):
    repo = source["repository"]
    url = "https://api.github.com/repos/" + repo + "/releases/latest"
    headers = {"Accept": "application/vnd.github+json",
               "User-Agent": "ARKI-Research-Trends/1.0",
               "X-GitHub-Api-Version": "2022-11-28"}
    if token:
        headers["Authorization"] = "Bearer " + token
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=18) as response:
        if response.status != 200:
            raise RuntimeError("Unexpected GitHub API HTTP status")
        content = response.read(MAX_BYTES + 1)
        if len(content) > MAX_BYTES:
            raise ValueError("GitHub response too large")
    raw = json.loads(content)
    release_id, tag, link = raw.get("id"), raw.get("tag_name"), raw.get("html_url")
    if not isinstance(release_id, int) or not isinstance(tag, str) or not tag:
        raise ValueError("Missing verifiable release id/tag")
    if not isinstance(link, str) or not link.startswith(
        "https://github.com/" + repo + "/releases/tag/"
    ):
        raise ValueError("Release URL does not belong to pinned repository")
    return {"release_id": release_id, "tag": tag[:120],
            "published_at": raw.get("published_at"), "url": link,
            "api_url": url, "source_id": source["id"],
            "repository": repo, "phase": source["phase"],
            "capability": source["capability"]}


def validate_previous(previous):
    if previous is None:
        return {}
    if not isinstance(previous, dict) or previous.get("schema") != SCHEMA:
        raise ValueError("Invalid previous snapshot schema")
    data = previous.get("releases")
    if not isinstance(data, dict):
        raise ValueError("Invalid previous releases")
    return data


def run(sources, canonical, previous, fetcher=fetch_release):
    registry = validate_sources(sources)
    prev = validate_previous(previous)
    if not isinstance(canonical, dict) or len(canonical.get("roadmap", {}).get("phases", [])) != 10:
        raise ValueError("Canonical ARKI state lacks ten phases")
    phases = {p["id"]: p for p in canonical["roadmap"]["phases"]}
    now = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
    baseline = previous is None
    current, observations, changes = {}, [], []
    for s in registry:
        try:
            r = fetcher(s)
            if r["repository"] != s["repository"] or r["capability"] != s["capability"]:
                raise ValueError("Fetcher returned mismatched identity")
            current[s["id"]] = r
            prior = prev.get(s["id"])
            kind = ("BASELINE" if baseline or prior is None else
                    "UNCHANGED" if prior.get("release_id") == r["release_id"] else
                    "NEW_RELEASE")
            obs = {"source_id": s["id"], "status": kind, "release": r}
            observations.append(obs)
            if kind == "NEW_RELEASE":
                changes.append(r)
        except (urllib.error.URLError, ValueError, RuntimeError, KeyError,
                json.JSONDecodeError, TimeoutError) as e:
            # Preserve the last known release for future comparison; no false "unchanged".
            if s["id"] in prev:
                current[s["id"]] = prev[s["id"]]
            observations.append({"source_id": s["id"], "status": "SOURCE_ERROR",
                                 "reason": type(e).__name__ + ": " + str(e)[:250]})
    groups = {}
    for r in changes:
        groups.setdefault(r["capability"], []).append(r)
    candidates = []
    for capability, releases in sorted(groups.items()):
        phase_ids = sorted({r["phase"] for r in releases})
        stable_key = capability + "|" + "|".join(sorted(
            r["source_id"] + ":" + str(r["release_id"]) for r in releases
        ))
        candidate_id = "RT-" + hashlib.sha256(stable_key.encode()).hexdigest()[:14].upper()
        phase_context = [{"phase": p, "canonical_status": phases[p].get("status", "UNKNOWN")}
                         for p in phase_ids]
        existing = canonical_signals(canonical, capability)
        candidates.append({
            "id": candidate_id, "type": "UPDATE_CANDIDATE",
            "capability_key": capability, "proposed_phases": phase_ids,
            "phase_context": phase_context,
            "status": "PENDING_HUMAN_VALIDATION",
            "evidence": [{"source_id": r["source_id"], "repository": r["repository"],
                          "release_id": r["release_id"], "tag": r["tag"],
                          "published_at": r["published_at"], "url": r["url"]}
                         for r in releases],
            "deduplication": {"grouped_by_capability": True,
                              "existing_capability_equivalence": "NOT_VERIFIED",
                              "possible_existing_scope": bool(existing),
                              "canonical_signals": existing,
                              "action": "REUSE_OR_EXTEND_EXISTING_CAPABILITY_BEFORE_NEW_FUNCTION"},
            "integration": "NOT_REQUESTED",
            "note": "A new release is not proof of a missing ARKI capability or an upgrade requirement."
        })
    return {
        "report": {"schema": SCHEMA, "generated_at": now,
                   "baseline_only": baseline, "scope": "GITHUB_RELEASES_ONLY",
                   "sources": observations, "candidates": candidates,
                   "governance": {"offline_maqueta": True, "human_review": True,
                                  "canonical_mutation": False, "automatic_promotion": False},
                   "counts": {"sources": len(registry),
                              "errors": sum(o["status"] == "SOURCE_ERROR" for o in observations),
                              "new_releases": len(changes), "candidates": len(candidates)}},
        "snapshot": {"schema": SCHEMA, "generated_at": now, "releases": current}
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sources", type=Path, required=True)
    parser.add_argument("--canonical", type=Path, required=True)
    parser.add_argument("--previous", type=Path)
    parser.add_argument("--out-dir", type=Path, required=True)
    args = parser.parse_args()
    try:
        prior = read_json(args.previous) if args.previous and args.previous.is_file() else None
        output = run(read_json(args.sources), read_json(args.canonical), prior,
                     fetcher=lambda s: fetch_release(s, os.environ.get("GITHUB_TOKEN")))
        atomic_json(args.out_dir / "report.json", output["report"])
        atomic_json(args.out_dir / "snapshot.json", output["snapshot"])
        print(json.dumps({"report": str(args.out_dir / "report.json"),
                          "snapshot": str(args.out_dir / "snapshot.json"),
                          "counts": output["report"]["counts"]}))
        if output["report"]["counts"]["errors"]:
            print("SOURCE_ERRORS_PRESENT: inspect report; no claims of complete coverage",
                  file=sys.stderr)
            return 2
        return 0
    except (ValueError, OSError, KeyError, json.JSONDecodeError) as e:
        print("WATCH_FAILED: " + str(e), file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
