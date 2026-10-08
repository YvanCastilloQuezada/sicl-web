import copy
import importlib.util
import pathlib
import unittest

PATH = pathlib.Path(__file__).with_name("watch.py")
spec = importlib.util.spec_from_file_location("arki_watch", PATH)
watch = importlib.util.module_from_spec(spec)
spec.loader.exec_module(watch)

SOURCE = {"id": "test", "repository": "owner/repo", "phase": "F6",
          "capability": "geometry_kernel",
          "official": "https://github.com/owner/repo/releases"}
SOURCES = {"schema": "ARKI-RESEARCH-SOURCES-1", "sources": [SOURCE]}
CANONICAL = {"roadmap": {"phases": [{"id": "F" + str(i), "status": "FROZEN" if i == 6 else "IN_PROGRESS"}
                                     for i in range(1, 11)]}}


def release(version=1):
    return {"release_id": version, "tag": "v" + str(version),
            "published_at": "2026-10-08T00:00:00Z",
            "url": "https://github.com/owner/repo/releases/tag/v" + str(version),
            "api_url": "https://api.github.com/repos/owner/repo/releases/latest",
            "source_id": "test", "repository": "owner/repo",
            "phase": "F6", "capability": "geometry_kernel"}


class WatchTests(unittest.TestCase):
    def test_baseline_is_not_novelty(self):
        r = watch.run(SOURCES, CANONICAL, None, lambda _: release())
        self.assertEqual(r["report"]["counts"]["candidates"], 0)
        self.assertEqual(r["report"]["sources"][0]["status"], "BASELINE")

    def test_unchanged_does_not_duplicate(self):
        baseline = watch.run(SOURCES, CANONICAL, None, lambda _: release())
        r = watch.run(SOURCES, CANONICAL, baseline["snapshot"], lambda _: release())
        self.assertEqual(r["report"]["sources"][0]["status"], "UNCHANGED")
        self.assertEqual(r["report"]["candidates"], [])

    def test_changed_release_creates_review_only_candidate(self):
        baseline = watch.run(SOURCES, CANONICAL, None, lambda _: release())
        r = watch.run(SOURCES, CANONICAL, baseline["snapshot"], lambda _: release(2))
        c = r["report"]["candidates"][0]
        self.assertEqual(c["type"], "UPDATE_CANDIDATE")
        self.assertEqual(c["status"], "PENDING_HUMAN_VALIDATION")
        self.assertEqual(c["phase_context"][0]["canonical_status"], "FROZEN")
        self.assertEqual(c["deduplication"]["existing_capability_equivalence"], "NOT_VERIFIED")
        self.assertFalse(r["report"]["governance"]["canonical_mutation"])
        self.assertEqual(CANONICAL["roadmap"]["phases"][5]["status"], "FROZEN")

    def test_bad_source_rejected(self):
        tampered = copy.deepcopy(SOURCES)
        tampered["sources"][0]["official"] = "https://evil.invalid/"
        with self.assertRaises(ValueError):
            watch.validate_sources(tampered)

    def test_source_failure_is_not_unchanged(self):
        previous = watch.run(SOURCES, CANONICAL, None, lambda _: release())["snapshot"]
        def failing(_):
            raise ValueError("offline")
        r = watch.run(SOURCES, CANONICAL, previous, failing)
        self.assertEqual(r["report"]["sources"][0]["status"], "SOURCE_ERROR")
        self.assertEqual(r["report"]["counts"]["errors"], 1)
        self.assertEqual(r["snapshot"]["releases"]["test"]["release_id"], 1)

    def test_group_same_capability_into_one_candidate(self):
        sources = copy.deepcopy(SOURCES)
        second = copy.deepcopy(SOURCE)
        second.update(id="test2", repository="other/repo",
                      official="https://github.com/other/repo/releases")
        sources["sources"].append(second)
        prev = {"schema": watch.SCHEMA, "releases": {
            "test": release(1), "test2": dict(release(1), source_id="test2", repository="other/repo")}}
        def fetch(s):
            return dict(release(2), source_id=s["id"], repository=s["repository"])
        r = watch.run(sources, CANONICAL, prev, fetch)
        self.assertEqual(r["report"]["counts"]["new_releases"], 2)
        self.assertEqual(r["report"]["counts"]["candidates"], 1)
        self.assertEqual(len(r["report"]["candidates"][0]["evidence"]), 2)


if __name__ == "__main__":
    unittest.main()
