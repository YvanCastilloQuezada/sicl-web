import pytest
from sicl.derivation import DerivationLedger,DerivationRecord,TypedRelation,VersionedRef,DerivationValidationError
from sicl.impact import ImpactAnalyzer
class Store:
 def __init__(self): self.x=[]
 def add_event(self,e): self.x.append(e); return e
 def events(self,p=None): return [e for e in self.x if p is None or e.project_id==p]
def R(t,i,v): return VersionedRef(t,i,v)
def D(i,o,ins): return DerivationRecord(i,o,tuple(ins),"m","1",tuple(TypedRelation(o,x,"COMPUTED_FROM","COMPUTATIONAL") for x in ins))
def test_chain_read_only():
 s=Store();l=DerivationLedger(s);g=R("Geometry","G",1);a=R("Area","A",1);q=R("Quantity","Q",1);c=R("Cost","C",1)
 for d in [D("A",a,[g]),D("Q",q,[a]),D("C",c,[q])]: l.record("P",d)
 n=len(s.x);r=ImpactAnalyzer(l).analyze("P",g)
 assert [(x.ref.entity_id,x.min_depth) for x in r.impacted]==[("A",1),("Q",2),("C",3)] and len(s.x)==n and r.to_dict()["readOnly"]
def test_exact_version_and_project():
 s=Store();l=DerivationLedger(s);g=R("Geometry","G",1);a=R("Area","A",1);l.record("P",D("A",a,[g]))
 assert not ImpactAnalyzer(l).analyze("P",R("Geometry","G",2)).impacted
 assert not ImpactAnalyzer(l).analyze("X",g).impacted
def test_join_preserves_two_paths():
 s=Store();l=DerivationLedger(s);g=R("Geometry","G",1);a=R("Area","A",1);p=R("Perimeter","P",1);c=R("Cost","C",1)
 for d in [D("A",a,[g]),D("P",p,[g]),D("C",c,[a,p])]: l.record("P",d)
 x=next(x for x in ImpactAnalyzer(l).analyze("P",g).impacted if x.ref==c)
 assert len(x.paths)==2 and {z.record_ids for z in x.paths}=={("A","C"),("P","C")}
def test_cycle_canonical():
 s=Store();l=DerivationLedger(s);a,b,c=[R("Metric",x,1) for x in "ABC"]
 for d in [D("A",a,[c]),D("B",b,[a]),D("C",c,[b])]: l.record("P",d)
 assert ImpactAnalyzer(l).analyze("P",a).cycles_detected==ImpactAnalyzer(l).analyze("P",b).cycles_detected
def test_path_limit_fail_closed():
 s=Store();l=DerivationLedger(s);g=R("Geometry","G",1);ms=[R("Metric",str(i),1) for i in range(3)];c=R("Cost","C",1)
 for i,m in enumerate(ms): l.record("P",D(str(i),m,[g]))
 l.record("P",D("C",c,ms))
 with pytest.raises(DerivationValidationError): ImpactAnalyzer(l,max_paths_per_artifact=2).analyze("P",g)
