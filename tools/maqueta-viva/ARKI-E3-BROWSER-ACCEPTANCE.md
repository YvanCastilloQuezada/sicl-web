# ARKI / ARBOL Vivo — E3 Browser Acceptance Protocol

Status: SPECIFIED_NOT_EXECUTED
Scope: Experimental local read-only UI only. No Core, FROZEN, or canonical mutation.
Baseline: use an installed candidate built from branch feat/arbol-vivo-precedencias-seguras-20261010 and record exact SOURCE_SHA.
Precondition: AV-UI-001 synthetic Node test passes on that SHA.

## Execution

1. Open the candidate HTML in a real browser (Edge or Chrome), preferably using the installed desktop shortcut.
2. Record browser name/version, timestamp, local HTML path, and candidate SHA.
3. Verify all five tabs: Plano Vivo, Arbol, Gemelo Digital, Cerebro relacional, Vista 3D. Each tab must be selectable without console exceptions.
4. Select a phase and an idea I-xx in Arbol. Verify that the A/B/C alternatives appear together and that each has a compact scientific dossier.
5. Create one ORIGINAL_LOCAL hypothesis under alternative A. Confirm it remains HYPOTHESIS_UNTESTED and does not demand an external citation.
6. Register a protocol linked to the hypothesis; record a local result with a unique runId and an evidence review. Confirm all remain unverified.
7. Open the scientific dossier and attach a JSON report with schema ARKI-REPRODUCIBILITY-001, status CONTRADICTORY_MEASUREMENTS, runs containing the exact runId, canonicalMutation false, knowledgeValidated false, promotion BLOCKED. Confirm the report is displayed as IMPORTED_REPORT_UNAUTHENTICATED.
8. Export proposal memory using the UI. Re-import that same file. Confirm the report and linked result survive the round trip, with no promotion.
9. Negative test: edit a copy of the exported JSON, setting dossiers[0].knowledgeValidated=true. Import must reject it, and the existing dossier must remain unchanged.
10. Negative test: edit a copy of the exported JSON, setting dossiers[0].report.promotion="AUTHORIZED". Import must reject it without changing the existing dossier.
11. Reload the browser tab. Session-only unsaved data may disappear; re-import the exported memory and verify restoration.
12. Inspect the browser developer console for uncaught errors. Capture a screenshot of A/B/C and the dossier, plus the console state.

## Exit criteria

- E3 PASS only when steps 1-12 have recorded evidence on a real browser, with no uncaught errors and no unauthorized promotion.
- Any missing control, failed round trip, stale HTML, or console exception => E3 FAIL.
- A synthetic Node test passing is not E3 PASS.
- Imported JSON, declared operators, and self-declared SHA-256 hashes do not prove scientific execution or independence.
- Never promote hypotheses or modify Core/FROZEN as a result of this test.

## Evidence template

```text
ARKI_E3_BROWSER=
SOURCE_SHA=
BROWSER_VERSION=
LOCAL_HTML_PATH=
TIMESTAMP_PERU=
FIVE_TABS=
ABC_VISIBLE=
HYPOTHESIS_CREATED=
PROTOCOL_CREATED=
RESULT_CREATED=
REVIEW_CREATED=
DOSSIER_ATTACHED=
ROUNDTRIP_PASSED=
TAMPER_KNOWLEDGE_REJECTED=
TAMPER_PROMOTION_REJECTED=
CONSOLE_ERRORS=
SCREENSHOT_PATH=
E3_VERDICT=NOT_EXECUTED
```
