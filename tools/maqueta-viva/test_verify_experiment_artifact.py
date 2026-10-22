import hashlib
import importlib.util
import json
import pathlib
import tempfile
import unittest

HERE = pathlib.Path(__file__).resolve().parent
SPEC = importlib.util.spec_from_file_location("verifier", HERE / "verify-experiment-artifact.py")
module = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(module)

def sha(data):
    return hashlib.sha256(data).hexdigest()

class ArtifactVerifierTests(unittest.TestCase):
    def test_integrity_and_tampering(self):
        with tempfile.TemporaryDirectory() as temp:
            root = pathlib.Path(temp)
            protocol = json.dumps({"experimentId": "EXP-001", "runId": "RUN-001"}).encode()
            artifact = b"observed raw experimental output"
            (root / "protocol.json").write_bytes(protocol)
            (root / "output.dat").write_bytes(artifact)
            manifest = {
                "schema": "ARKI-EXPERIMENT-RUN-001",
                "experimentId": "EXP-001", "runId": "RUN-001",
                "protocol": "protocol.json", "artifact": "output.dat",
                "protocolSha256": sha(protocol), "artifactSha256": sha(artifact)
            }
            path = root / "manifest.json"
            path.write_text(json.dumps(manifest))
            result = module.verify(path, root)
            self.assertEqual(result["status"], "FILE_INTEGRITY_CONFIRMED_NOT_EXECUTION_VERIFIED")
            self.assertFalse(result["knowledgeValidated"])
            self.assertEqual(result["promotion"], "BLOCKED")
            (root / "output.dat").write_bytes(b"tampered")
            self.assertEqual(module.verify(path, root)["status"], "INTEGRITY_OR_BINDING_FAILED")
            (root / "output.dat").write_bytes(artifact)
            manifest["runId"] = "RUN-OTHER"
            path.write_text(json.dumps(manifest))
            self.assertEqual(module.verify(path, root)["status"], "INTEGRITY_OR_BINDING_FAILED")
            manifest["artifact"] = "../outside.dat"
            path.write_text(json.dumps(manifest))
            self.assertEqual(module.verify(path, root)["status"], "REJECTED")
    def test_missing_manifest(self):
        with tempfile.TemporaryDirectory() as temp:
            self.assertEqual(module.verify(pathlib.Path(temp) / "missing.json", temp)["status"], "REJECTED")

if __name__ == "__main__":
    unittest.main()
