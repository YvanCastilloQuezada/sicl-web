# ARKI F5→F9 — RED TEAM OFFLINE EVIDENCE PACK V1

**Mode:** OFFLINE_EVIDENCE_MODE  
**Technical baseline under audit:** `533c9a876b0be3b1bb536f9349bcc9587f742ffa`  
**Repository:** `YvanCastilloQuezada/sicl-web`  
**Branch lineage:** `feat/agk-t4-t7-evidence-v2`  
**Pack purpose:** permit an auditor without GitHub access to distinguish documentary claim, source implementation and historical execution evidence. This pack is not a substitute for unavailable primary runtime logs; missing primary evidence remains UNKNOWN/EVIDENCE_REQUIRED.

## A. Repository identity evidence collected through GitHub

GitHub commit API returned:
- `533c9a876b0be3b1bb536f9349bcc9587f742ffa` — message `docs(f7): define S10 project cost baseline contract`, date 2026-10-06T03:43:34Z, parent `6d28da79f9f863f84aa8c88c92a0ba930fe82168`.
- `60268514186f65d2e55ee7aaa76b3a782502b689` — message `docs(agk): record final F6 local gate and GO verdict`, date 2026-10-05T18:28:38Z, parent `0d6bdd792e7d733622a31185f304bc189b80e7c5`.
- `bfacc987a1c0d87d4f0640c25fe9f6d62c22cd9b` — message `docs(master-map): close F6 AGK and freeze bounded delta contracts`, date 2026-10-05T18:28:58Z, parent `60268514186f65d2e55ee7aaa76b3a782502b689`.

Audit-document HEAD later advanced to `e9199e91e13fc0c2d6cfeca85c5643256b05e159`; that HEAD contains audit documentation added after the technical baseline. Do not treat those later documentation commits as new F5-F9 product capability.

## B. Evidence hierarchy

E0 = dossier/claim only.
E1 = contract/design document.
E2 = source implementation/test source inspected.
E3 = execution result recorded in repository document or supplied local log.
E4 = independently re-executed by auditor.

This pack supplies E1/E2 extensively and some E3 documentary/local-gate evidence. It does NOT grant E4. Auditor must not silently promote E3 to E4.

## C. F5 — Design Funnel source evidence

Canonical document `docs/arki-predictive/DESIGN_FUNNEL_16_4_1.md` states:
- canonical flow N → 16 → 4 → 1 → SELECTED_FOR_DEVELOPMENT;
- N configurable machine exploration; 16 human visual surface; 4 deeper comparison; 1 explicit architect decision;
- no automatic winner;
- nonselected candidates preserved ARCHIVED;
- each promotion creates HUMAN_DESIGN_SELECTION with project/exploration/generation/available set/selection/nonselected/actor/date/evidence/UI context.

Source inspected: `shared/arkiDesignFunnel.ts`.
Observed implementation:
- `FunnelStage` includes GENERATED, SCREENED, SURVIVOR, DESIGN_EXPLORER_16, FINALIST_4, SELECTED_FOR_DEVELOPMENT, DEVELOPMENT_IN_PROGRESS, BLOCKED, RETURNED_TO_FINALISTS, ARCHIVED, SUPERSEDED.
- `CandidateStatus = ELIGIBLE | UNKNOWN | FAILED`.
- `DesignCandidate` carries metrics, evidence, unknowns, failureReasons, provenance.
- `HumanDesignSelectionEvent` carries available/selected/nonSelected IDs, humanActor, timestamp, optionalReason, evidenceRefs and uiContext.
- `createDesignFunnel` rejects any input not exactly 16 candidates and waits for human 16→4.
- `promoteToFinalFour` requires human actor and exactly four unique current candidates; rejects cross-project/stale; archives 12; starts deep evaluation.
- `selectForDevelopment` requires completed deep-evaluation wait state and human actor; selects one; archives remaining finalists.
- `returnToFinalFour` restores prior finalist set.
- `setComparisonMode` currently accepts PREVIEW, PLAN, 3D, SECTION, PROGRAM, COST, TECHNICAL; unsupported modes fail.
- `requestNewGeneration` records a reasoned event.

Test source inspected:
`server/arkiDesignFunnel.test.ts` tests:
1. 16-candidate waiting state;
2. exactly four unique selections;
3. 4 promoted + 12 archived;
4. cross-project/stale rejection;
5. deeper evaluation before 4→1;
6. human 4→1 without auto-winner + preservation;
7. reversible return to Final Four;
8. unsupported comparison modes rejected.

`server/arkiDesignFunnelR1.test.ts` additionally tests:
- center-card UI governance by source inspection;
- rapid P1→P4→P9→P16 identity;
- same candidate identity for architecture/cost/inspector projection;
- exact Final Four restoration and second human decision;
- UI states “Sin ganador automático”.

Document `DESIGN_FUNNEL_EVIDENCE_MATRIX.md` explicitly classifies:
- N→16 implemented in bounded demo contract;
- human selects 4 implemented/tested;
- deep evaluation implemented as deterministic state without external solver;
- human selects 1 implemented/tested;
- preservation/reversibility implemented/tested;
- automatic winner/universal preference prohibited;
- CCF/autopilot productive integration PARTIAL;
- real solver NOT EVALUATED;
- bounded verdict DESIGN_FUNNEL_PARTIAL pending persistent CDE/Project State, real CCF/autopilot and persistent E2E capture.

This explicit PARTIAL state is material Red Team evidence. Do not infer F5 fully frozen.

## D. F5 — Human-selection epistemic evidence

`docs/arki-predictive/HUMAN_SELECTION_EVIDENCE.md` states:
- human selection is contextual evidence, not universal beauty law/global preference;
- records selection, available set, stage, project, generation, information, actor, date, evidence and optional reason;
- if reason absent, ARKI does not infer it;
- hypotheses from selected/rejected candidates do not automatically become canonical rules.

## E. F5 transversal superpowers evidence

`docs/arki-superpowers/ARKI_SUPERPOWERS_PACK.md` defines:
SP-01 Consequence Radar; SP-02 Value of Information; SP-03 Design Divergence; SP-04 Architectural Debt; SP-05 Counterfactual Explorer.

Explicit limits:
- SP-01 propagation heuristic, not simulation/calculation/normative verification.
- SP-02 score heuristic, not project probability.
- SP-03 measures architectural difference, does not decide best.
- SP-04 professional/evidence review required.
- SP-05 generates AI_PROPOSED scenarios; does not claim unobserved simulation results.

Source test inspected: `server/arkiSuperpowersPack.test.ts`.
It asserts:
- one unified motor executes all five;
- consequence classes include DIRECT/SECONDARY/TERTIARY/POSSIBLE/UNKNOWN;
- VOI prioritizes UNKNOWN;
- divergence returns three alternatives in specimen;
- debt risk and eight counterfactuals;
- humanAuthority FINAL;
- claim TRANSVERSAL_DECISION_SUPPORT_ONLY;
- no professional-completion claim;
- UNKNOWN preserved when change/alternative evidence absent.

No independent rerun is contained in this pack.

## F. F6 — AGK closure evidence and bounds

Canonical closure document: `docs/arki-master-map/ARKI_F6_AGK_INTEGRAL_CLOSURE_GATE_V1.md`.
Master Map interpretation: F6 FROZEN / GO_BOUNDED_DEMONSTRATED_BOUNDARY.

Recorded architecture:
- AGK = OCCT canonical BRep body + evidence-derived ARKI_KERNEL_DELTA.
- semantic identity belongs to ARKI, not raw BRep indices/handles/world coordinates/geometry-only identity.
- no second canonical geometry kernel earned admission.
- SolveSpace/libslvs = KEEP_ORACLE / RESEARCH_MASTER, not runtime backend.

Repository execution-evidence document `AGK_OCCT_EXECUTION_EVIDENCE_V1.md` records bounded campaigns including:
- T3: 12 tests; 11 PASS plus T303 KNOWN_TOLERANCE_BOUNDARY at tested 2.5e-7 overlap; T307 corrected to observation, not limitation.
- T4: 12/12 PASS with explicit nonclaims (e.g. open-surface volume not semantic; rational NURBS/G1/G2/etc not all proven).
- T5: 14/14 bounded parametric/dependency/editability assertions; AGK-DELTA-003 transaction pattern PROPOSE→DIRTY→SEMANTIC VALIDATION→REGENERATE→ACCEPTANCE→COMMIT|ROLLBACK.
- T6: 14/14 harness assertions for bounded constraint-math prototype; production geometric-constraint solver explicitly NOT demonstrated.
- T7-A: 11 PASS / 0 FAIL / 1 OBSERVATION / explicit gaps, including branch sensitivity and then-unimplemented conflict localization/stable identity/industrial semantics.
- T7-B1/B2/B3: SolveSpace/libslvs isolated oracle evidence; no AGK modification; oracle role only.

Final F6 closure document records local final gate:
- TypeScript `--noEmit`: PASS / exit 0.
- DELTA-005 selected regression: 8 test files, 88/88 PASS / exit 0.
- production build: PASS / exit 0.
These are E3 recorded execution claims in repository/local-gate documentation, not E4 independent rerun by offline auditor.

Explicit F6 nonclaims preserved:
1. native C++ P9 envelope → actual TypeScript production machine-ingestion E2E not demonstrated;
2. durable filesystem/database persistence + crash recovery not demonstrated;
3. multiprocess/database/distributed concurrency not demonstrated;
4. industrial-scale long-duration performance not demonstrated;
5. production industrial sketch solver not claimed.

## G. DELTA-005 implementation evidence

Source inspected: `shared/arkiPersistentNaming.ts`.
Observed mechanisms:
- events PRESERVE/REMAP/SPLIT/MERGE/NEW/DELETED/AMBIGUOUS;
- evidence fields semanticId, featureId, role, context, operationHistory, geometrySignature, topologySignature, tolerance;
- unique high-confidence preserve threshold default .85 plus margin .1;
- ambiguous decisions fail closed and cannot commit;
- explicit split/merge lineage;
- ledger enforces unique record IDs and contiguous sequence;
- trusted geometry envelope requires schema ARKI_AGK_GEOMETRY_EVIDENCE_V1 and authority AGK_OCCT;
- envelope adapter intentionally does not manufacture semanticId;
- transaction manager supports begin/stage/commit/rollback and stale-base rejection;
- serialization/replay schema ARKI_NAMING_LEDGER_V1.

Test-source inventory at audit HEAD includes:
- shared/arkiPersistentNaming.test.ts
- server/arkiPersistentNaming.test.ts
- server/arkiPersistentNamingLedger.test.ts
- server/arkiPersistentNamingOrderedHardening.test.ts
- server/arkiPersistentNamingTransaction.test.ts
- server/arkiPersistentNamingPersistence.test.ts
- server/arkiPersistentNamingConcurrency.test.ts
- server/arkiPersistentNamingP10Stress.test.ts

Examples directly observed in test source:
- fail closed on competing/low-confidence naming;
- split/merge/new/deleted;
- immutable ordered ledger;
- transaction rollback atomicity;
- stale writer rejection;
- deterministic replay;
- malformed/tampered persistence rejection;
- P10 1000-record transaction/replay stress;
- 100 repeated exact serializations;
- stale 100-record competing writer publishes no partial records;
- rollback after 500 staged records leaves ledger empty;
- geometry signature changes cannot manufacture semantic identity.

Important: these are source tests (E2). The 88/88 execution is supplied separately as E3 recorded final-gate evidence.

## H. F7 current contract evidence

`docs/arki-master-map/ARKI_F7_PROFESSIONAL_TECHNICAL_DEVELOPMENT_GATE_V1.md` state is OPEN / CONTRACT FORMATION.

Candidate work packages:
F7.0 Professional Model Contract;
F7.1 Jurisdiction & Applicability;
F7.2 Architectural Technical Development;
F7.3 Structural Coordination;
F7.4 MEP Coordination;
F7.5 Accessibility & Life Safety;
F7.6 Quantities & Cost;
F7.7 BIM/IFC/CAD Interoperability;
F7.8 Professional Coordination Gate;
F7.9 F8 Handoff.

Candidate invariants include one project truth, D-2 semantic authority, AGK geometry authority, persistent lineage, explicit jurisdiction, visible UNKNOWN, proposal!=commit, specialist authority, derived quantities with provenance, export!=truth, evidence-based round-trip and F8 reading F7.

Existing BIM/IFC/CAD/structure/MEP/accessibility/cost assets are explicitly candidates pending repository reconciliation, not automatically verified F7 capability.

## I. Existing-project evidence/boundary

Product-owner decision preserved in F7 contract:
- input RVT/IFC, DWG/DXF/other exchange, technical dossier, combinations;
- immutable BASELINE_0 as received;
- L1 reconstruction/normalization;
- L2 technical coordination/QA;
- L3 architectural improvement;
- L4 controlled redesign/value improvement;
- project-local costs = PROJECT_COST_BASELINE;
- F7 owns reconstruction/normalization/coordination/professional analysis/cost-aware mutation;
- F8 generates/regenerates dossier from accepted F7 state.

Huaura RVT is selected first real specimen. Its model contents are NOT verified in this evidence pack. Any assertion about actual Huaura levels/elements/geometry/MEP/etc is UNKNOWN until extraction evidence exists.

## J. F7 economic/S10 contract evidence

`docs/arki-master-map/ARKI_F7_S10_PROJECT_COST_BASELINE_CONTRACT_V1.md` is a contract/design artifact, not proof of a working adapter.

Target normalized entities include:
ProjectCostBaseline, Budget, SubBudget, WBS/Title, CostItem/Partida, Unit, Quantity/Metrado, UnitPrice, Resource, ResourceFamily, APU, APUComponent, SubPartida, DirectCost, GeneralExpense, Utility/Markup, Tax/footer concept, PolynomialFormula, Schedule/Period, Valuation/Progress, SourceProvenance, MappingConfidence/UNKNOWN.

Target bridge:
ARKI semantic entity → AGK geometry → quantity rule → measured quantity → S10 item/APU candidate mapping → confidence/provenance → accepted project-local mapping → cost contribution.

Mutation target:
baseline quantity/cost → accepted semantic/geometric mutation → quantity delta → affected partidas/resources → project-local APU/prices → cost delta → downstream effects → revised total/variance → uncertainty/unmapped items.

S10 strategy is a hypothesis:
READ → NORMALIZE → RECONCILE → GENERATE/WRITE → ROUND-TRIP VERIFY.
WRITE is NOT currently demonstrated.

## K. Capability insertion map / phase boundaries

`ARKI_CAPABILITY_INSERTION_MAP_FROM_BUSINESS_PUBLIC_WORKS_V1.md` explicitly classifies ideas as PRODUCT-OWNER IDEAS TRIAGED / NOT AUTOMATICALLY IMPLEMENTED.

Key corrections:
- no legal/regulatory certification without authorized regime;
- no zero-clash/compliance/savings guarantees without bounded evidence;
- vision evidence probabilistic, not physical truth;
- project APU/prices remain PROJECT_COST_BASELINE;
- imported RVT/DWG/DXF/IFC/PDF = BASELINE_0 evidence, not canonical truth;
- exports are representations/adapters, not second geometry authority.

Priority:
P0 existing-project ingestion, BASELINE_0/provenance, RVT/IFC/CAD reconciliation, cost-baseline schema, quantity/cost mapping, discipline/clash evidence, jurisdiction/applicability.
P1 coordinated architecture/structure/MEP, accessibility/life safety, spatial metrics, cost delta.
P2 controlled redesign/value engineering, N→16→4→1 reuse, professional audit gate, F8 handoff.

F9 target consumes accepted ET/baseline + authorized event sources + field evidence + schedule + valuations/cost + weather/logistics → temporal evidence graph → discrepancy/risk hypotheses → human/professional decision. It explicitly forbids observed=certified, anomaly=fraud and multiple stakeholder truths.

## L. Evidence gaps the offline auditor MUST preserve

Unless additional primary evidence is supplied, classify appropriately:
- exact F5 test execution at baseline SHA: EVIDENCE_REQUIRED (test source exists, but this pack does not contain an independent execution log);
- exact F5↔F6 production E2E semantic identity: EVIDENCE_REQUIRED;
- Huaura RVT content/extraction: UNKNOWN;
- working S10 READ adapter: NOT DEMONSTRATED;
- S10 WRITE/round-trip: NOT DEMONSTRATED;
- F7 coordinated architecture+structure+MEP E2E: NOT DEMONSTRATED by this pack;
- F8 dossier generation from coordinated F7 state: future hypothesis;
- F9 designed→budgeted→planned→built→measured→valued→paid E2E: future hypothesis;
- durable DELTA-005 crash recovery: NOT DEMONSTRATED;
- distributed concurrency: NOT DEMONSTRATED;
- industrial long-duration AGK performance: NOT DEMONSTRATED.

## M. Auditor instruction

Use this pack together with:
1. ARKI_RED_TEAM_A_DEEPSEEK_ORDER_V1.md (or independent Qwen order);
2. ARKI_F5_F9_PRE_IMPLEMENTATION_RED_TEAM_DOSSIER_V1.md.

For every finding identify the highest evidence tier actually available (E0-E4). Do not penalize ARKI merely because future F7-F9 capabilities are correctly marked PROPOSAL/UNKNOWN; instead attack contradictions, missing contracts, invalid authority, impossible phase boundaries, unsupported promotion, or downstream requirements that invalidate a frozen boundary.

END OF OFFLINE EVIDENCE PACK V1.
