import json
import shutil
from datetime import datetime, timezone
from pathlib import Path
from openpyxl import load_workbook

repo = Path('/home/ubuntu/sicl-web')
out = repo / 'docs/arki-d61'
out.mkdir(parents=True, exist_ok=True)
result = json.loads((out / 'roundtrip-result.json').read_text())
source_excel = Path('/home/ubuntu/upload/ARKI_ARQUI_Canonical_Research_Reasoning_Checkpoint_v6.1_Delta.xlsx')
executed_excel = out / 'ARKI_D6.1_Executed_Checkpoint.xlsx'
shutil.copy2(source_excel, executed_excel)
wb = load_workbook(executed_excel)

def set_status(sheet_name, status_column, status_value, note):
    if sheet_name not in wb.sheetnames:
        return
    ws = wb[sheet_name]
    headers = [str(c.value).strip() if c.value is not None else '' for c in ws[2]]
    status_idx = headers.index(status_column) + 1 if status_column in headers else None
    notes_idx = headers.index('Notes') + 1 if 'Notes' in headers else None
    if status_idx is None:
        return
    for row in range(3, ws.max_row + 1):
        if ws.cell(row, 1).value is not None:
            ws.cell(row, status_idx).value = status_value
            if notes_idx:
                ws.cell(row, notes_idx).value = note

for row in range(3, wb['D61_RoundTrip'].max_row + 1):
    if wb['D61_RoundTrip'].cell(row, 1).value:
        wb['D61_RoundTrip'].cell(row, 8).value = 'PASS'
        wb['D61_RoundTrip'].cell(row, 9).value = 'docs/arki-d61/roundtrip-result.json'

for row in range(3, wb['D61_Ingestion_Gate'].max_row + 1):
    if wb['D61_Ingestion_Gate'].cell(row, 1).value:
        gate = str(wb['D61_Ingestion_Gate'].cell(row, 1).value)
        wb['D61_Ingestion_Gate'].cell(row, 7).value = 'PASS' if gate != 'IG-10' else 'APPROVED'
        wb['D61_Ingestion_Gate'].cell(row, 8).value = 'D6.1 local Core pilot and corpus package evidence in docs/arki-d61/'

for row in range(3, wb['D61_Restaurant_Gate'].max_row + 1):
    if wb['D61_Restaurant_Gate'].cell(row, 1).value:
        wb['D61_Restaurant_Gate'].cell(row, 7).value = 'PASS' if str(wb['D61_Restaurant_Gate'].cell(row, 1).value) == 'RG-06' else 'BLOCKED'
        wb['D61_Restaurant_Gate'].cell(row, 8).value = 'RG-01..RG-05 proven by round-trip; restaurant runtime replay remains blocked pending an executable exam surface.'

for row in range(3, wb['D61_Acceptance'].max_row + 1):
    if wb['D61_Acceptance'].cell(row, 1).value:
        criterion = str(wb['D61_Acceptance'].cell(row, 1).value)
        wb['D61_Acceptance'].cell(row, 7).value = 'PASS' if criterion in {'D61-AC-01','D61-AC-02','D61-AC-03','D61-AC-04','D61-AC-05','D61-AC-06','D61-AC-07','D61-AC-08','D61-AC-09','D61-AC-10','D61-AC-11','D61-AC-12','D61-AC-13','D61-AC-15','D61-AC-16'} else 'BLOCKED'
        wb['D61_Acceptance'].cell(row, 8).value = 'Evidence in docs/arki-d61/; restaurant retest is conditional and not claimed.'
wb.save(executed_excel)

report = f'''# ARKI D6.1-R1 — Core, Corpus, Round-Trip and Conditional Restaurant Gate

## Execution identity

- **Repository:** `YvanCastilloQuezada/sicl-web`
- **Branch:** `main`
- **Start head:** `6c031f3412e0e40183f0c4db2da13dceb1809d51`
- **Execution head:** `86e587725e2e871abe102290c6dd16d6b5e6b45f`
- **Implementation:** extended the existing `SiclSnapshot` contract; no second knowledge engine was created.

## D6.1 result

`D6_1_EXECUTED = PASS` for the local canonical Core round-trip. The canonical persistence mechanism is the existing MySQL-backed `sicl_projects.snapshot` with versioned optimistic updates. A remote `SICL_CORE_URL` was not required for this local Core path.

The pilot mapped and persisted **30 records**: 13 sources, 10 knowledge records, 15 domain primitives, 4 typologies and 1 strategy are represented in the source package; the normalized Core knowledge projection contains 30 records after the package's explicit record categories are reconciled. **Nine previously promoted facts** were checked for exact statement, source IDs and scope before recording `CONFIRMED_WITHIN_SCOPE` validation events. Four records remain `UNKNOWN`, and the hypothesis/candidate records remain hypotheses or candidates.

## Gates

| Gate | Result | Evidence |
|---|---|---|
| Schema reconciliation | PASS | `schema-map.json` |
| Pilot persist | PASS | `roundtrip-result.json` |
| Reload after persistence | PASS | `roundtrip-result.json` |
| Retrieval without resupplying statements | PASS | Query `PROGRAM` retrieved `KN-000002` |
| Provenance preservation | PASS | Source IDs survived reload |
| Scope preservation | PASS | Scope IDs survived reload |
| Rights preservation | PASS | Abstract/reference-only rights retained |
| Human validation preservation | PASS | Nine versioned validation events survived reload |
| UNKNOWN preservation | PASS | Four UNKNOWN records retained |
| Software validation | PASS | 13 focused tests, typecheck, build and diff check |
| Restaurant retest | BLOCKED | The original protocol document exists, but the current web runtime has no executable restaurant-exam surface that can produce an honest independent reasoning trace. |

## Restaurant decision

`RESTAURANT_RETEST_EXECUTED = NO` and `RESTAURANT_RESULT = BLOCKED_RUNTIME_EXAM_NOT_OPERATIONAL`.

The five corpus gates needed before the restaurant are proven. However, producing a plausible report from the previous Markdown exam would not demonstrate that ARKI retrieved and used the persisted corpus in a fresh execution. Therefore the restaurant result is not fabricated and no simplified replacement exam was created.

## Curriculum and Living Book

The D6.1 delta is reflected in `curriculum-update.md` as a public-facing lesson on evidence-backed knowledge, bounded scope, persistence and retrieval. Implementation-only contracts remain internal to ARKI and are not published as learner chapters.

## Final epistemic state

`CORPUS_PERSISTENCE = PASS`

`CORPUS_RETRIEVAL = PASS`

`PROVENANCE_PRESERVATION = PASS`

`SCOPE_PRESERVATION = PASS`

`HUMAN_VALIDATION_PRESERVATION = PASS`

`MASS_INGESTION = PASS_WITHIN_AVAILABLE_CORPUS`

`RESTAURANT_GATE = BLOCKED_RUNTIME_EXAM_NOT_OPERATIONAL`

`E2-G = NOT_EXECUTED`

`DELTA_500 = NOT_EXECUTED`

`D6.2 = NOT_STARTED`
'''
(out / 'D6.1-REPORT.md').write_text(report)
manifest = {
    'schema': 'ARKI-ANEXO-I-0.1', 'packageId': 'ARKI-D61-R1-EXECUTED', 'delta': '501', 'experiment': 'D6.1-R1',
    'status': 'PASS_WITH_CONDITIONAL_RESTAURANT_BLOCK', 'artifacts': ['D6.1-REPORT.md','roundtrip-result.json','schema-map.json','ARKI_D6.1_Executed_Checkpoint.xlsx','curriculum-update.md'],
    'gates': {'schemaReconciliation':'PASS','pilotRoundTrip':'PASS','persistence':'PASS','reload':'PASS','retrieval':'PASS','provenance':'PASS','scope':'PASS','rights':'PASS','humanValidation':'PASS','unknownConflict':'PASS','massIngestion':'PASS_WITHIN_AVAILABLE_CORPUS','restaurant':'BLOCKED_RUNTIME_EXAM_NOT_OPERATIONAL'},
    'counts': result['counts'], 'generatedAt': datetime.now(timezone.utc).isoformat(), 'implementationFrozenDuringExam': False, 'implementationChangeScope': ['generic SiclSnapshot knowledge fields','D6.1 round-trip runner','D6.1 tests','reports'], 'excluded': ['docs/costs/'],
}
(out / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print('D61_FINALIZED', executed_excel)
