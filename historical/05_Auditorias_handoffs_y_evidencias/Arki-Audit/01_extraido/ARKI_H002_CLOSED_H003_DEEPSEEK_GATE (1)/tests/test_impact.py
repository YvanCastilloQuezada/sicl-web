import pytest
from sicl.derivation import DerivationLedger, DerivationRecord, TypedRelation, VersionedRef, DerivationValidationError
from sicl.impact import ImpactAnalyzer
from sicl.domain import Event

class MemoryStore:
    def __init__(self): self.items=[]
    def add_event(self,e): self.items.append(e); return e
    def events(self,project_id=None): return [x for x in self.items if project_id is None or x.project_id==project_id]

def ref(t,i,v): return VersionedRef(t,i,v)
def rec(i,out,inputs):
    return DerivationRecord(i,out,tuple(inputs),"m","1",tuple(TypedRelation(out,x,"COMPUTED_FROM","COMPUTATIONAL") for x in inputs))

def chain():
    store=MemoryStore(); ledger=DerivationLedger(store)
    g=ref("Geometry","G1",3); a=ref("RoomArea","A1",1); q=ref("Quantity","Q1",2); c=ref("Cost","C1",4)
    ledger.record("P",rec("D-A",a,[g])); ledger.record("P",rec("D-Q",q,[a])); ledger.record("P",rec("D-C",c,[q]))
    return store,ledger,g,a,q,c

def test_transitive_what_if_is_read_only():
    store,ledger,g,a,q,c=chain(); before=len(store.items)
    report=ImpactAnalyzer(ledger).analyze("P",g)
    assert [(x.ref,x.min_depth) for x in report.impacted]==[(a,1),(q,2),(c,3)]
    assert len(store.items)==before and report.to_dict()["readOnly"] is True

def test_exact_version_matters():
    store,ledger,g,a,q,c=chain()
    assert ImpactAnalyzer(ledger).analyze("P",ref("Geometry","G1",4)).impacted == ()

def test_branching_join_preserves_all_paths():
    store=MemoryStore(); l=DerivationLedger(store)
    g=ref("Geometry","G",1); a=ref("Area","A",1); p=ref("Perimeter","P",1); c=ref("Cost","C",1)
    l.record("X",rec("DA",a,[g])); l.record("X",rec("DP",p,[g])); l.record("X",rec("DC",c,[a,p]))
    r=ImpactAnalyzer(l).analyze("X",g)
    item=next(x for x in r.impacted if x.ref==c)
    assert item.min_depth==2
    assert {path.record_ids for path in item.paths}=={("DA","DC"),("DP","DC")}

def test_unrelated_branch_not_impacted():
    store,ledger,g,a,q,c=chain()
    assert ImpactAnalyzer(ledger).analyze("P",ref("Geometry","G9",1)).impacted == ()

def test_cycle_is_bounded_reported_and_canonical():
    store=MemoryStore(); l=DerivationLedger(store)
    a,b,c=ref("Metric","A",1),ref("Metric","B",1),ref("Metric","C",1)
    l.record("P",rec("DA",a,[c])); l.record("P",rec("DB",b,[a])); l.record("P",rec("DC",c,[b]))
    ra=ImpactAnalyzer(l).analyze("P",a); rb=ImpactAnalyzer(l).analyze("P",b)
    assert ra.cycles_detected == rb.cycles_detected
    assert len(ra.impacted)==2

def test_project_isolation():
    store=MemoryStore(); l=DerivationLedger(store)
    g=ref("Geometry","G",1); a=ref("Area","A",1); l.record("P1",rec("D1",a,[g]))
    assert len(ImpactAnalyzer(l).analyze("P1",g).impacted)==1
    assert ImpactAnalyzer(l).analyze("P2",g).impacted==()

def test_path_explosion_fails_closed_not_truncated():
    store=MemoryStore(); l=DerivationLedger(store); g=ref("Geometry","G",1)
    mids=[ref("Metric",f"M{i}",1) for i in range(3)]; out=ref("Cost","C",1)
    for i,m in enumerate(mids): l.record("P",rec(f"DM{i}",m,[g]))
    l.record("P",rec("DC",out,mids))
    with pytest.raises(DerivationValidationError):
        ImpactAnalyzer(l,max_paths_per_artifact=2).analyze("P",g)

def test_rt_a_multiple_derivations_same_output_are_all_impact_paths():
    store=MemoryStore(); l=DerivationLedger(store)
    g1,g2=ref("Geometry","G1",1),ref("Geometry","G2",1); a=ref("Area","A",1); c=ref("Cost","C",1)
    l.record("P",rec("DA1",a,[g1])); l.record("P",rec("DA2",a,[g2])); l.record("P",rec("DC",c,[a]))
    r1=ImpactAnalyzer(l).analyze("P",g1); r2=ImpactAnalyzer(l).analyze("P",g2)
    assert [x.ref for x in r1.impacted]==[a,c]
    assert [x.ref for x in r2.impacted]==[a,c]
    assert next(x for x in r1.impacted if x.ref==a).paths[0].record_ids==("DA1",)
    assert next(x for x in r2.impacted if x.ref==a).paths[0].record_ids==("DA2",)
