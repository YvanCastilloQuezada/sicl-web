# Mock E2E Invariant Matrix

| Invariant | Scenario | Expected | Actual | Evidence | Verdict |
|---|---|---|---|---|---|
| Human Authority | E2E-03 | HUMAN_DECISION_REQUIRED | HUMAN_DECISION_REQUIRED | audit + state transition | **PASS** |
| Decision isolation | E2E-04/E2E-05 | revocation scoped; global kill global | observed | kill/revocation controls | **PASS** |
| Fail closed | E2E-09/E2E-11 | UNKNOWN, no blind redispatch | observed | effect status + audit | **PASS** |
| Kill precedence | E2E-05 | HALT | observed | controlDecision | **PASS** |
| Revocation | E2E-04 | late result not applied | observed | late_event_ignored | **PASS** |
| Budget preflight | E2E-06 | 0 provider calls when exhausted | observed | fake call counters | **PASS** |
| Loop boundedness | E2E-07 | HALT and no later call | observed | counter + call count | **PASS** |
| Idempotency | E2E-08/E2E-10 | one mutation / one winner | observed | event and claim rows | **PASS** |
| External-effect uncertainty | E2E-09/E2E-11 | UNKNOWN | observed | effect table | **PASS** |
| Restart recovery | E2E-09/E2E-10 | recovery required | observed | reopened SQLite | **PASS** |
| Evidence integrity | E2E-12 | hash/integrity distinct from verification | observed | evidence rows | **PASS** |
| No self-verification | E2E-12 | reject producer assertion | observed | error code + registry | **PASS** |
| Scope containment | E2E-13 | no automatic expansion | observed | HUMAN_REQUIRED | **PASS** |
| Audit reconstructability | E2E-14 | full record persisted | observed | snapshot | **PASS** |
