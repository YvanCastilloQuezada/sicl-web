"""H-002 read-only transitive impact analysis. IMPACT DETECTED != CHANGE EXECUTED."""
from __future__ import annotations
from dataclasses import dataclass
from typing import Any
from .derivation import DerivationLedger, VersionedRef, DerivationValidationError

@dataclass(frozen=True)
class ImpactPath:
    refs: tuple[VersionedRef,...]
    record_ids: tuple[str,...]
    def __post_init__(self):
        if len(self.refs)<2 or len(self.record_ids)!=len(self.refs)-1:
            raise DerivationValidationError("impact path alignment invalid")
    def to_dict(self): return {"refs":[x.to_dict() for x in self.refs],"recordIds":list(self.record_ids)}

@dataclass(frozen=True)
class ImpactedArtifact:
    ref: VersionedRef
    min_depth: int
    paths: tuple[ImpactPath,...]
    def to_dict(self): return {"ref":self.ref.to_dict(),"minDepth":self.min_depth,"paths":[p.to_dict() for p in self.paths]}

@dataclass(frozen=True)
class ImpactReport:
    changed_ref: VersionedRef
    impacted: tuple[ImpactedArtifact,...]
    cycles_detected: tuple[tuple[VersionedRef,...],...]=()
    def to_dict(self): return {"changedRef":self.changed_ref.to_dict(),"impacted":[x.to_dict() for x in self.impacted],"cyclesDetected":[[r.to_dict() for r in c] for c in self.cycles_detected],"readOnly":True}

def _rk(r): return (r.entity_type,r.entity_id,r.version,r.content_hash or "")
def _canonical_cycle(cycle):
    core=cycle[:-1] if len(cycle)>1 and cycle[0]==cycle[-1] else cycle
    rotations=[core[i:]+core[:i] for i in range(len(core))]
    best=min(rotations,key=lambda seq:tuple(_rk(r) for r in seq))
    return best+(best[0],)

class ImpactAnalyzer:
    def __init__(self,ledger:DerivationLedger,*,max_paths_per_artifact:int=32):
        if isinstance(max_paths_per_artifact,bool) or not isinstance(max_paths_per_artifact,int) or max_paths_per_artifact<1:
            raise DerivationValidationError("max_paths_per_artifact must be positive integer")
        self.ledger=ledger; self.max_paths=max_paths_per_artifact
    def analyze(self,project_id:str,changed_ref:VersionedRef)->ImpactReport:
        if not isinstance(changed_ref,VersionedRef): raise DerivationValidationError("changed_ref must be VersionedRef")
        consumers={}
        for rec in self.ledger.list(project_id):
            for inp in rec.inputs: consumers.setdefault(inp,[]).append(rec)
        for rs in consumers.values(): rs.sort(key=lambda r:(_rk(r.output),r.id))
        paths={}; cycles=set(); queue=[((changed_ref,),())]
        while queue:
            refs,rids=queue.pop(0); current=refs[-1]
            for rec in consumers.get(current,()):
                out=rec.output
                if out in refs:
                    cycles.add(_canonical_cycle(refs[refs.index(out):]+(out,))); continue
                ip=ImpactPath(refs+(out,),rids+(rec.id,))
                bucket=paths.setdefault(out,[])
                if not any((p.refs,p.record_ids)==(ip.refs,ip.record_ids) for p in bucket):
                    if len(bucket)>=self.max_paths: raise DerivationValidationError(f"impact path limit exceeded for {out.to_dict()}")
                    bucket.append(ip); queue.append((ip.refs,ip.record_ids))
        items=[]
        for ref,ps in paths.items():
            ordered=tuple(sorted(ps,key=lambda p:(len(p.record_ids),tuple(_rk(r) for r in p.refs),p.record_ids)))
            items.append(ImpactedArtifact(ref,min(len(p.record_ids) for p in ordered),ordered))
        items.sort(key=lambda x:(x.min_depth,_rk(x.ref)))
        return ImpactReport(changed_ref,tuple(items),tuple(sorted(cycles,key=lambda c:tuple(_rk(r) for r in c))))
