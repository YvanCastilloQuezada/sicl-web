"""H-002 read-only transitive impact analysis over H-001 derivations.

IMPACT DETECTED != CHANGE EXECUTED.
"""
from __future__ import annotations
from dataclasses import dataclass
from typing import Any
from .derivation import DerivationLedger, VersionedRef, DerivationValidationError

@dataclass(frozen=True)
class ImpactPath:
    refs: tuple[VersionedRef, ...]
    record_ids: tuple[str, ...]
    def __post_init__(self):
        if len(self.refs) < 2 or len(self.record_ids) != len(self.refs)-1:
            raise DerivationValidationError("impact path must align refs and derivation records")
    def to_dict(self)->dict[str,Any]:
        return {"refs":[x.to_dict() for x in self.refs],"recordIds":list(self.record_ids)}

@dataclass(frozen=True)
class ImpactedArtifact:
    ref: VersionedRef
    min_depth: int
    paths: tuple[ImpactPath, ...]
    def to_dict(self)->dict[str,Any]:
        return {"ref":self.ref.to_dict(),"minDepth":self.min_depth,"paths":[p.to_dict() for p in self.paths]}

@dataclass(frozen=True)
class ImpactReport:
    changed_ref: VersionedRef
    impacted: tuple[ImpactedArtifact,...]
    cycles_detected: tuple[tuple[VersionedRef,...],...]=()
    def to_dict(self)->dict[str,Any]:
        return {"changedRef":self.changed_ref.to_dict(),"impacted":[x.to_dict() for x in self.impacted],
                "cyclesDetected":[[r.to_dict() for r in cycle] for cycle in self.cycles_detected],"readOnly":True}

def _canonical_cycle(cycle: tuple[VersionedRef, ...]) -> tuple[VersionedRef, ...]:
    core = cycle[:-1] if len(cycle) > 1 and cycle[0] == cycle[-1] else cycle
    if not core:
        return cycle
    rotations = [core[i:] + core[:i] for i in range(len(core))]
    best = min(rotations, key=lambda seq: tuple((r.entity_type,r.entity_id,r.version,r.content_hash or "") for r in seq))
    return best + (best[0],)

class ImpactAnalyzer:
    def __init__(self, ledger: DerivationLedger, *, max_paths_per_artifact:int=32):
        if isinstance(max_paths_per_artifact,bool) or not isinstance(max_paths_per_artifact,int) or max_paths_per_artifact<1:
            raise DerivationValidationError("max_paths_per_artifact must be positive integer")
        self.ledger=ledger; self.max_paths=max_paths_per_artifact

    def analyze(self, project_id:str, changed_ref:VersionedRef)->ImpactReport:
        if not isinstance(changed_ref,VersionedRef):
            raise DerivationValidationError("changed_ref must be VersionedRef")
        records=self.ledger.list(project_id)
        consumers:dict[VersionedRef,list]= {}
        for rec in records:
            for inp in rec.inputs: consumers.setdefault(inp,[]).append(rec)
        for rs in consumers.values():
            rs.sort(key=lambda r:(r.output.entity_type,r.output.entity_id,r.output.version,r.id))

        paths_by_ref:dict[VersionedRef,list[ImpactPath]]={}
        cycles:set[tuple[VersionedRef,...]]=set()
        queue=[((changed_ref,),())]
        while queue:
            ref_path, record_path=queue.pop(0)
            current=ref_path[-1]
            for rec in consumers.get(current,()):
                out=rec.output
                if out in ref_path:
                    start=ref_path.index(out)
                    cycles.add(_canonical_cycle(ref_path[start:]+(out,)))
                    continue
                new_refs=ref_path+(out,); new_records=record_path+(rec.id,)
                ip=ImpactPath(new_refs,new_records)
                bucket=paths_by_ref.setdefault(out,[])
                key=(ip.refs,ip.record_ids)
                if not any((p.refs,p.record_ids)==key for p in bucket):
                    if len(bucket)>=self.max_paths:
                        raise DerivationValidationError(f"impact path limit exceeded for {out.to_dict()}")
                    bucket.append(ip); queue.append((new_refs,new_records))

        impacted=[]
        for ref,paths in paths_by_ref.items():
            ordered=tuple(sorted(paths,key=lambda p:(len(p.record_ids),tuple((r.entity_type,r.entity_id,r.version) for r in p.refs),p.record_ids)))
            impacted.append(ImpactedArtifact(ref,min(len(p.record_ids) for p in ordered),ordered))
        impacted.sort(key=lambda x:(x.min_depth,x.ref.entity_type,x.ref.entity_id,x.ref.version))
        ordered_cycles=tuple(sorted(cycles,key=lambda c:tuple((r.entity_type,r.entity_id,r.version) for r in c)))
        return ImpactReport(changed_ref,tuple(impacted),ordered_cycles)

__all__=["ImpactPath","ImpactedArtifact","ImpactReport","ImpactAnalyzer"]
