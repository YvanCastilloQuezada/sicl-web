import hashlib
import importlib.util
import json
import pathlib
import tempfile
import unittest

HERE=pathlib.Path(__file__).resolve().parent
SPEC=importlib.util.spec_from_file_location("repeatability",HERE/"assess-experiment-repeatability.py")
module=importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(module)

def digest(data):
    return hashlib.sha256(data).hexdigest()

class RepeatabilityTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.root=pathlib.Path(self.temp.name)
        self.protocols=[]
        self.manifests=[]
        for i,(value,operator) in enumerate(((10.0,"Operator-A"),(10.2,"Operator-B")),1):
            protocol=json.dumps({"experimentId":"EXP-1","procedure":"identical controlled experiment"}).encode()
            artifact=f"raw sample {i}".encode()
            p=f"protocol-{i}.json";a=f"artifact-{i}.dat";m=f"manifest-{i}.json"
            (self.root/p).write_bytes(protocol);(self.root/a).write_bytes(artifact)
            self.protocols.append(digest(protocol))
            self.manifests.append(m)
            (self.root/m).write_text(json.dumps({"schema":"ARKI-EXPERIMENT-RUN-001",
                "experimentId":"EXP-1","runId":f"RUN-{i}","protocol":p,"artifact":a,
                "protocolSha256":digest(protocol),"artifactSha256":digest(artifact),
                "operator":operator,"measuredValue":value}))
        self.plan=self.root/"plan.json"
        self.save_plan(0.5)
    def tearDown(self):
        self.temp.cleanup()
    def save_plan(self,tolerance):
        self.plan.write_text(json.dumps({"schema":"ARKI-REPRODUCIBILITY-PLAN-001",
            "manifests":self.manifests,"absoluteTolerance":tolerance}))
    def test_matching_protocol_is_candidate_only(self):
        report=module.assess(self.plan,self.root)
        self.assertEqual(report["status"],"REPEATABILITY_CANDIDATE_UNVERIFIED")
        self.assertFalse(report["knowledgeValidated"])
        self.assertEqual(report["promotion"],"BLOCKED")
    def test_contradiction_detected(self):
        self.save_plan(0.1)
        self.assertEqual(module.assess(self.plan,self.root)["status"],"CONTRADICTORY_MEASUREMENTS")
    def test_independence_required(self):
        second=self.root/self.manifests[1]
        m=json.loads(second.read_text());m["operator"]="Operator-A"
        second.write_text(json.dumps(m))
        self.assertEqual(module.assess(self.plan,self.root)["status"],"INDEPENDENCE_NOT_ESTABLISHED")
    def test_protocol_mismatch(self):
        second=self.root/self.manifests[1]
        m=json.loads(second.read_text())
        protocol=b'{"experimentId":"EXP-1","procedure":"different protocol"}'
        (self.root/m["protocol"]).write_bytes(protocol)
        m["protocolSha256"]=digest(protocol)
        second.write_text(json.dumps(m))
        self.assertEqual(module.assess(self.plan,self.root)["status"],"PROTOCOL_MISMATCH")
    def test_tamper_fails(self):
        (self.root/"artifact-1.dat").write_bytes(b"tampered")
        self.assertEqual(module.assess(self.plan,self.root)["status"],"INTEGRITY_FAILED")
    def test_duplicate_run_fails(self):
        second=self.root/self.manifests[1]
        m=json.loads(second.read_text());m["runId"]="RUN-1"
        second.write_text(json.dumps(m))
        self.assertEqual(module.assess(self.plan,self.root)["status"],"DUPLICATE_RUN")
    def test_unsafe_path(self):
        self.manifests[1]="../escape.json"
        self.save_plan(0.5)
        self.assertEqual(module.assess(self.plan,self.root)["status"],"REJECTED")

if __name__=="__main__":
    unittest.main()
