import json, pytest
from sicl.derivation import DerivationLedger, DerivationRecord, TypedRelation, VersionedRef, DerivationValidationError
from sicl.impact import ImpactAnalyzer
from sicl.domain import Event

class Store:
    def __init__(self): self.items=[]
    def add_event(self,e): self.items.append(e); return e
    def events(self,project_id=None): return [x for x in self.items if project_id is None or x.project_id==project_id]
def ref(t,i,v,h=None): return VersionedRef(t,i,v,h)
def rec(i,out,ins):
    return DerivationRecord(i,out,tuple(ins),"m","1",tuple(TypedRelation(out,x,"COMPUTED_FROM","COMPUTATIONAL") for x in ins))

def test_e4_same_output_multiple_justifications_preserved_in_why_and_impact():
    s=Store(); l=DerivationLedger(s); g1,g2=ref("Geometry","G1",1),ref("Geometry","G2",1); a=ref("Area","A",1); c=ref("Cost","C",1)
    l.record("P",rec("DA1",a,[g1])); l.record("P",rec("DA2",a,[g2])); l.record("P",rec("DC",c,[a]))
    assert [x.id for x in l.why("P",a)]==["DA1","DA2"]
    assert [x.ref for x in ImpactAnalyzer(l).analyze("P",g1).impacted]==[a,c]
    assert [x.ref for x in ImpactAnalyzer(l).analyze("P",g2).impacted]==[a,c]

def test_e5_identity_states_are_mutually_explicit():
    s=Store(); l=DerivationLedger(s); h1="a"*64; h2="b"*64
    cases=[
        (ref("Geometry","A",1),ref("Geometry","A",1),"IDENTITY_UNVERIFIABLE"),
        (ref("Geometry","B",1,h1),ref("Geometry","B",1),"IDENTITY_UNCERTAIN"),
        (ref("Geometry","C",1,h1),ref("Geometry","C",1,h2),"CONTENT_HASH_MISMATCH"),
        (ref("Geometry","D",1,h1),ref("Geometry","D",2,h1),"VERSION_MISMATCH"),
    ]
    for n,(expected,current,code) in enumerate(cases):
        out=ref("Metric",f"M{n}",1); l.record("P",rec(f"D{n}",out,[expected]))
    current={expected.key():current for expected,current,_ in cases}
    codes={x["record_id"]:x["code"] for x in l.integrity_checks("P",current)}
    assert codes=={f"D{i}":case[2] for i,case in enumerate(cases)}

def test_e6_identical_hash_and_version_produces_no_integrity_issue():
    s=Store(); l=DerivationLedger(s); h="a"*64; g=ref("Geometry","G",1,h); a=ref("Area","A",1)
    l.record("P",rec("D",a,[g]))
    assert l.integrity_checks("P",{g.key():g})==[]

def test_e7_historical_conflicting_same_id_fails_closed():
    s=Store(); l=DerivationLedger(s); a=ref("Area","A",1)
    r1=rec("D",a,[ref("Geometry","G1",1)]); r2=rec("D",a,[ref("Geometry","G2",1)])
    s.items += [
      Event(None,"t","P","DERIVATION_RECORDED",{"derivation":r1.to_dict()},"x","x"),
      Event(None,"t","P","DERIVATION_RECORDED",{"derivation":r2.to_dict()},"x","x")]
    with pytest.raises(DerivationValidationError): l.list("P")

def test_e8_report_serialization_is_deterministic():
    s=Store(); l=DerivationLedger(s); g=ref("Geometry","G",1); a=ref("Area","A",1)
    l.record("P",rec("D",a,[g])); analyzer=ImpactAnalyzer(l)
    one=json.dumps(analyzer.analyze("P",g).to_dict(),sort_keys=True,separators=(",",":"))
    two=json.dumps(analyzer.analyze("P",g).to_dict(),sort_keys=True,separators=(",",":"))
    assert one==two

def test_e9_analysis_is_strictly_read_only_even_repeated():
    s=Store(); l=DerivationLedger(s); g=ref("Geometry","G",1); a=ref("Area","A",1)
    l.record("P",rec("D",a,[g])); before=[x for x in s.items]
    for _ in range(10): ImpactAnalyzer(l).analyze("P",g)
    assert s.items==before and len(s.items)==1

def test_e10_changed_version_does_not_alias_old_exact_reference():
    s=Store(); l=DerivationLedger(s); old=ref("Geometry","G",1); new=ref("Geometry","G",2); a=ref("Area","A",1)
    l.record("P",rec("D",a,[old]))
    assert ImpactAnalyzer(l).analyze("P",new).impacted==()
    assert [x.ref for x in ImpactAnalyzer(l).analyze("P",old).impacted]==[a]
