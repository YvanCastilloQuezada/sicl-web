from pathlib import Path
p = Path('/home/ubuntu/sicl-web/docs/arki-d61/D6.1-REPORT.md')
s = p.read_text()
s = s.replace('| Software validation | PASS | 13 focused tests, typecheck, build and diff check |', '| Software validation | PARTIAL | 13 focused tests, typecheck/build PASS; full suite 167/173 tests passed, with 6 pre-existing phase-a-theme failures caused by missing tRPC provider in AppHeader |')
s = s.replace('`MASS_INGESTION = PASS_WITHIN_AVAILABLE_CORPUS`', '`MASS_INGESTION = PASS_WITHIN_AVAILABLE_CORPUS`\n\n`SOFTWARE_REGRESSION = PREEXISTING_FAILURE (6 phase-a-theme tests; no D6.1 attribution)`')
p.write_text(s)

m = Path('/home/ubuntu/sicl-web/docs/arki-d61/manifest.json')
import json
data = json.loads(m.read_text())
data['gates']['softwareRegression'] = 'PREEXISTING_FAILURE'
data['regression'] = {'fullSuite': 'PARTIAL', 'passedTests': 167, 'failedTests': 6, 'failureSurface': 'client/src/pages/phase-a-theme.test.ts', 'cause': 'AppHeader tRPC hook mounted without provider', 'd61Attribution': False}
m.write_text(json.dumps(data, indent=2) + '\n')
