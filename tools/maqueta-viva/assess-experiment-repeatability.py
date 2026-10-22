#!/usr/bin/env python3
"""ARKI reproducibility gate: independently rechecks artifact manifests; no canonical promotion."""
import argparse
import importlib.util
import json
import math
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
SPEC = importlib.util.spec_from_file_location("arki_artifact_verifier", HERE / "verify-experiment-artifact.py")
verifier = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(verifier)

def assess(plan_path, root):
    report = {"schema":"ARKI-REPRODUCIBILITY-001","status":"REJECTED",
              "canonicalMutation":False,"knowledgeValidated":False,"promotion":"BLOCKED","runs":[]}
    try:
        root = pathlib.Path(root).resolve(strict=True)
        plan_path = pathlib.Path(plan_path).resolve(strict=True)
        if not root.is_dir() or not plan_path.is_relative_to(root):
            raise ValueError("INVALID_ROOT")
        plan = json.loads(plan_path.read_text(encoding="utf-8"))
        if not isinstance(plan,dict) or plan.get("schema")!="ARKI-REPRODUCIBILITY-PLAN-001":
            raise ValueError("INVALID_SCHEMA")
        manifests=plan.get("manifests")
        tolerance=plan.get("absoluteTolerance")
        if not isinstance(manifests,list) or not 2<=len(manifests)<=20 or not isinstance(tolerance,(int,float)) or isinstance(tolerance,bool) or not math.isfinite(tolerance) or tolerance<0:
            raise ValueError("INVALID_PLAN")
        values=[]; identities=set(); protocol_hashes=set(); operators=set(); experiment_ids=set()
        for relative in manifests:
            if not isinstance(relative,str) or not relative or len(relative)>300:
                raise ValueError("INVALID_MANIFEST_PATH")
            path=pathlib.PurePosixPath(relative)
            if path.is_absolute() or ".." in path.parts or "\\" in relative:
                raise ValueError("UNSAFE_PATH")
            manifest_path=root.joinpath(*path.parts)
            if manifest_path.is_symlink() or not manifest_path.resolve(strict=True).is_relative_to(root):
                raise ValueError("UNSAFE_PATH")
            check=verifier.verify(manifest_path,root)
            manifest=json.loads(manifest_path.read_text(encoding="utf-8"))
            report["runs"].append({"manifest":relative,"integrity":check["status"],"runId":manifest.get("runId")})
            if check["status"]!="FILE_INTEGRITY_CONFIRMED_NOT_EXECUTION_VERIFIED":
                report["status"]="INTEGRITY_FAILED"
                return report
            value=manifest.get("measuredValue")
            operator=manifest.get("operator")
            if not isinstance(value,(int,float)) or isinstance(value,bool) or not math.isfinite(value) or not isinstance(operator,str) or not operator.strip():
                raise ValueError("INVALID_MEASUREMENT")
            identity=(manifest.get("experimentId"),manifest.get("runId"))
            if identity in identities:
                report["status"]="DUPLICATE_RUN"
                return report
            identities.add(identity);values.append(value);operators.add(operator.strip())
            protocol_hashes.add(manifest["protocolSha256"]);experiment_ids.add(manifest["experimentId"])
        report["runCount"]=len(values)
        report["operatorCount"]=len(operators)
        report["observedRange"]=max(values)-min(values)
        report["absoluteTolerance"]=tolerance
        if len(experiment_ids)!=1 or len(protocol_hashes)!=1:
            report["status"]="PROTOCOL_MISMATCH"
        elif len(operators)<2:
            report["status"]="INDEPENDENCE_NOT_ESTABLISHED"
        elif report["observedRange"]>tolerance:
            report["status"]="CONTRADICTORY_MEASUREMENTS"
        else:
            report["status"]="REPEATABILITY_CANDIDATE_UNVERIFIED"
    except (OSError,ValueError,TypeError,KeyError,json.JSONDecodeError) as exc:
        report["error"]=str(exc)[:200]
    return report

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--plan",required=True)
    parser.add_argument("--root",required=True)
    parser.add_argument("--output")
    args=parser.parse_args()
    report=assess(args.plan,args.root)
    payload=json.dumps(report,indent=2,sort_keys=True)+"\n"
    if args.output:
        pathlib.Path(args.output).write_text(payload,encoding="utf-8")
    else:
        sys.stdout.write(payload)
    return 0 if report["status"]=="REPEATABILITY_CANDIDATE_UNVERIFIED" else 1

if __name__=="__main__":
    raise SystemExit(main())
