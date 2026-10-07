# ARKI MASTER MAP LIVE — Canonical Entry Point

**Version:** 0.1  
**Created:** 2026-10-04  
**Status:** ACTIVE / LIVING MAP  
**Scope:** ARKI/ARQUI as one system across `sicl-web`, `sicl-core`, ACS, AGK and future adapters.  
**Rule:** this file is the canonical entry point for continuity. It does not promote documentary claims to implementation.

## 0. Why this exists

ARKI already contains substantial architecture, code, tests, frozen contracts, ideas, UI, research and historical audits, but the state has been distributed across many artifacts. The purpose of this map is to prevent future work from reconstructing ARKI from memory or repeating old audits.

Every material architectural decision, capability implementation, verification, freeze, deprecation, discovered technology, blocker or authority change MUST update this map or a registry linked from it.

A future working session starts here before changing ARKI.

## 1. Product north star

ARKI is intended to become a highly autonomous, multiscale artificial architect: it understands an assignment and context, reasons architecturally, generates alternatives, evaluates and optimizes them, develops the selected design into professional deliverables, supports construction and operation, and preserves traceability throughout the lifecycle. Human authority remains the final validation gate where professional, regulatory, owner or safety authority is required.

ARKI is not a collection of disconnected tools. D-2, Core, Spatial Reasoning, Design Funnel, Family Generator, AGK, Capability Fabric, agents, evaluators, ACS, BIM/documentation and lifecycle intelligence are organs of one system.

## 2. Epistemic law

`CLAIM != DESIGN != IMPLEMENTED != EXECUTED != OBSERVED != VERIFIED != FROZEN`

No document, UI, type, test fixture or historical audit may silently promote a capability.

Orthogonal states: `UNKNOWN`, `BLOCKED`, `FUTURE_EMPIRICAL_TEST`, `DEPRECATED`, `SUPERSEDED`, `CONFLICTING`.

**NO EVIDENCE = NO GREEN.**

## 3. Existing canonical anchors recovered

| Capability / artifact | Evidence locus | Current interpretation |
|---|---|---|
| Design Funnel | `docs/arki-predictive/DESIGN_FUNNEL_16_4_1.md`, `shared/arkiDesignFunnel.ts`, `ArkiDesignFunnelPage.tsx` | Implemented contract: `N -> 16 -> 4 -> 1 -> SELECTED_FOR_DEVELOPMENT`; non-selected candidates archived; final promotion is human |
| Superpowers Pack | `docs/arki-superpowers/ARKI_SUPERPOWERS_PACK.md` | SP-01 Consequence Radar, SP-02 Value of Information, SP-03 Design Divergence, SP-04 Architectural Debt, SP-05 Counterfactual Explorer; implemented/focused tests with explicit bounds |
| Dynamic Family Generator | `shared/arkiDynamicFamilies.ts`, `shared/arkiFamilyComparison.ts`, `ArkiFamilyStudioPage.tsx`, `outputs/ARKI_GENERADOR_DINAMICO_FAMILIAS_CODIGO_COMPLETO.md` | Existing conceptual generator: family -> variant -> context -> parameters -> program -> rules -> 2D -> section -> 3D -> metrics -> gates; generated candidates do not mutate Project State automatically |
| Current Architecture Map | `docs/arki-inventory/ARKI_CURRENT_ARCHITECTURE_MAP.md` | Historical audited architecture snapshot; lineage evidence, not automatically current truth |
| Capability Maturity Matrix | `docs/arki-inventory/ARKI_CAPABILITY_MATURITY_MATRIX.md` | Historical maturity audit to be reconciled with current HEAD |
| Idea/Decision Inventory | `docs/arki-inventory/ARKI_IDEA_AND_DECISION_INVENTORY.md` | Identified the previous problem: effective idea repository was a distributed documentary archive |
| Autonomy Evidence Map | `docs/arki-post-513-inventory/ARKI_AUTONOMY_EVIDENCE_MAP.md` | Existing L0-L10 autonomy taxonomy/evidence; do not replace casually |
| Multimodal Capability Map | `docs/arki-post-513-inventory/ARKI_MULTIMODAL_CAPABILITY_MAP.md` | Text, voice/audio, image/camera, PDF/document, map/geo, 2D/SVG, 3D/massing and AR tracked with bounded claims |
| Visual product evidence | `docs/arki-ui-governance-001/A0/PO_VISUAL_REVIEW_R2/` | Existing UI/screens are product evidence and must be reconciled, not redesigned from memory |
| SICL Core | `YvanCastilloQuezada/sicl-core` | Separate repository containing canonical domain/runtime capabilities; must be included in every global ARKI audit |
| ACS | external/current ACS workstream | Technology laboratory: IMPORT -> INSPECT -> EXECUTE -> EXPERIMENT -> UNDERSTAND -> NORMALIZE -> COMPARE -> REMEMBER -> RECOMMEND. ACS is not architectural or geometry authority |
| AGK | ARKI Geometry Kernel workstream | Sole intended Operational Geometry Authority; current hypothesis: unified kernel, not runtime multi-backend Frankenstein |

## 4. Whole-system skeleton

The exact taxonomy remains subject to repository reconciliation. Until then these are functional domains, not claims of implementation.

1. Intent / assignment / client dialogue
2. Context / site / territory / multiscale world model
3. Project State / facts / hypotheses / unknowns / objectives / constraints / preferences / decisions
4. Knowledge / precedent / regulation / provenance / memory
5. Multimodal perception: text, documents, image, camera, voice, geo, sensors
6. Architectural reasoning / D-2
7. Program and architectural relationships
8. Parti / topology / spatial reasoning
9. Design generation and divergence
10. Design Funnel `N -> 16 -> 4 -> 1`
11. Dynamic families / parametric design
12. Geometry materialization / AGK / 3D-FIRST
13. BIM / interoperability / digital twin
14. Architectural representation / plans / sections / elevations / details / schedules
15. Regulatory intelligence by jurisdiction and scale
16. Environmental / climate / daylight / energy intelligence
17. Structural intelligence
18. MEP / technical systems
19. Cost / feasibility / constructability / procurement
20. Evaluation / simulation / adversarial checking
21. Multiobjective optimization / Pareto / trade-offs
22. Documentation / complete technical dossier
23. Construction support / field / change propagation
24. Commissioning / operation / digital twin feedback
25. Predictive / preventive / corrective maintenance
26. Agents / specialist intelligence
27. Autonomy / orchestration / human authority gates
28. Learning / knowledge evolution / monthly or versioned refresh
29. ACS technology intelligence
30. Capability Fabric / provider discovery and execution boundary
31. Security / provenance / audit / replay / determinism / observability
32. UI / Command Center / professional review surfaces

## 5. Authority skeleton

- **D-2 / Architectural Authority:** architectural semantic truth, intent, decisions, relationships and decomposition.
- **ARKI Core / Project State:** canonical state, evidence/provenance, cognitive/evaluation/runtime contracts according to verified implementation.
- **AGK:** operational geometry truth; external geometry engines may inform or execute bounded work but do not become a second canonical geometry.
- **Capability Fabric:** provider discovery/resolution/execution boundary; not architectural authority and not geometry authority.
- **ACS:** studies technology and produces reproducible evidence; it does not design, promote technology automatically, or become AGK.
- **Human authority:** final professional/regulatory/owner validation where required.

Any overlap found between `sicl-core` and `sicl-web` must be classified as `CANONICAL`, `ADAPTER`, `DUPLICATED`, `CONFLICTING`, `LEGACY` or `UNKNOWN`.

## 6. Lifecycle / nervous-system target

```text
PERCEIVE
  -> UNDERSTAND
  -> BUILD/UPDATE PROJECT STATE
  -> REASON
  -> GENERATE MANY CANDIDATES
  -> FILTER / TEST / EVALUATE
  -> N -> 16 -> 4 -> 1
  -> HUMAN VALIDATION
  -> DEVELOP SELECTED DESIGN
  -> MATERIALIZE GEOMETRY
  -> BIM + DRAWINGS + TECHNICAL DOSSIER
  -> CONSTRUCTION SUPPORT
  -> OPERATE
  -> MONITOR
  -> PREDICT / MAINTAIN / CORRECT
  -> LEARN / UPDATE KNOWLEDGE
  -> REPEAT
```

Every arrow must eventually have an executable, traceable contract. A disconnected capability is not an integrated ARKI capability.

## 7. Capability record contract

Every material capability added to the live registry must record:

- stable `capability_id`
- name and purpose
- functional domain
- applicable architectural scales
- lifecycle phases
- authority owner
- repository / branch / paths
- contract / schema
- dependencies and consumers
- inputs / outputs
- epistemic state
- execution/verification evidence
- deterministic/replay requirements
- provenance requirements
- human authority gate
- autonomy level using the existing ARKI taxonomy where applicable
- criticality to end-to-end ARKI
- integration state: `CONNECTED | PARTIAL | DISCONNECTED | CONFLICTING`
- known debt / UNKNOWN / blocker
- next transition and acceptance gate
- supersedes / superseded_by
- last evidence date and commit SHA

## 8. Mandatory update protocol

A change is not complete until the map reflects it.

### On implementation
Update capability state and code locus. Do not mark VERIFIED without execution evidence.

### On verification
Attach test/gate/commit evidence and exact environment when material.

### On freeze
Record frozen contract/version/SHA and forbidden mutation boundaries.

### On new idea
Record it as IDEA/DESIGN; do not mix it with implemented capabilities.

### On new technology
Route it through ACS when empirical characterization is needed. A technology discovery does not change ARKI architecture by itself.

### On deprecation/supersession
Preserve history; never delete lineage simply because a newer design exists.

### On every handoff
Update **Current Focus**, **Last Completed**, **Open Blockers**, **Next Exact Action**, and evidence SHA below.

## 9. Current focus — 2026-10-04

**Program-level priority:** assemble ARKI as one end-to-end system rather than continue isolated organs.

**Immediate work:** consolidate the live master map from current `sicl-web`, `sicl-core`, ACS and historical audits; reconcile current evidence against old Delta 513/515 maps; identify disconnected capabilities and authority conflicts.

**Parallel technical work:** ACS Stage 2/3 and Capability Lab/frontend work exists, but resumes after the global live map has a reliable baseline.

**AGK:** hypothesis/research continues under previously approved 3D-FIRST/unified-kernel constraints; no premature backend promotion.

## 10. Current known anchors that must not be lost

- ARKI target is a highly autonomous super-architect, not merely a geometry or visualization tool.
- 3D-FIRST is a system principle.
- Design Funnel is `N -> 16 -> 4 -> 1`.
- Non-selected design ideas remain traceable/archived rather than disappearing.
- Human validation remains the final authority gate where required.
- Technical dossiers must eventually support Peru and selected foreign jurisdictions through explicit jurisdiction-scoped normative evidence.
- ARKI must learn to construct professional geometric/graphic documentation, not only produce attractive conceptual design.
- Family Generator must be reconciled with D-2, Project State, AGK and ACS rather than remain an isolated generator.
- Vision, voice, document understanding, geo/sensors and future operational feedback belong to the whole-system roadmap, with state determined by evidence.
- Predictive/preventive/corrective maintenance belongs to the lifecycle target.
- Traceability, replay, evidence and deterministic behavior where applicable are cross-cutting requirements.

## 11. Historical sources to absorb, not duplicate

Priority consolidation set:

- `docs/arki-inventory/ARKI_CURRENT_ARCHITECTURE_MAP.md`
- `docs/arki-inventory/ARKI_CAPABILITY_MATURITY_MATRIX.md`
- `docs/arki-inventory/ARKI_EXTENSION_POTENTIAL_MAP.md`
- `docs/arki-inventory/ARKI_IDEA_AND_DECISION_INVENTORY.md`
- `docs/arki-post-513-inventory/ARKI_AUTONOMY_EVIDENCE_MAP.md`
- `docs/arki-post-513-inventory/ARKI_CAPABILITY_COMPOSITION_GRAPH.md`
- `docs/arki-post-513-inventory/ARKI_DISCONNECTED_CAPABILITIES.md`
- `docs/arki-post-513-inventory/ARKI_INTELLIGENCE_CAPABILITY_INVENTORY.md`
- `docs/arki-post-513-inventory/ARKI_KNOWLEDGE_MAP.md`
- `docs/arki-post-513-inventory/ARKI_LATENT_CAPABILITY_MAP.md`
- `docs/arki-post-513-inventory/ARKI_MULTIMODAL_CAPABILITY_MAP.md`
- `docs/arki-superpowers/ARKI_SUPERPOWERS_PACK.md`
- `docs/arki-predictive/DESIGN_FUNNEL_16_4_1.md`
- `docs/arki-ui-governance-001/A0/ARKI_CURRENT_PRODUCT_MAP.md`
- `docs/arki-ui-governance-001/A0/PO_VISUAL_REVIEW_R2/`
- `outputs/ARKI_GENERADOR_DINAMICO_FAMILIAS_CODIGO_COMPLETO.md`
- relevant frozen contracts and capability docs in `sicl-core`

These remain source evidence. This live map becomes the continuity index over them.

## 12. Next exact actions

1. Reconcile `sicl-web@current main` and `sicl-core@current main` into a capability registry without assuming historical statuses are current.
2. Recover all explicit FROZEN contracts and their SHAs/evidence.
3. Reconcile Superpowers, Design Funnel, Family Generator, D-2, spatial reasoning, Developer, AGK, Capability Fabric, multimodal inputs, BIM/drawing, evaluation/optimization, agents and lifecycle capabilities.
4. Mark disconnected and conflicting capabilities.
5. Establish the minimum end-to-end path for a real project: assignment -> design exploration -> 16 -> 4 -> 1 -> selected design development -> geometry -> BIM/drawings -> technical dossier -> human validation.
6. Only then resume ACS Stage 2/3 and its frontend against this global map.

## 13. Visual Live Map contract — v0.2

The Master Map is not complete as a product if it exists only as Markdown. The operational target is a visible **ARKI SUPERARCHITECT — LIVE MAP** driven by the machine-readable registry `docs/arki-master-map/ARKI_MASTER_MAP_STATE.json`.

### 13.1 Permanent screen header

The screen MUST expose without opening documentation:

- **10-phase roadmap** with explicit `DONE / CURRENT / NEXT / RECONCILIATION_REQUIRED` state.
- **YOU ARE HERE / ESTAMOS AQUÍ** at macro phase and micro iteration/contract level.
- Current Focus.
- Last Completed.
- Next Exact Action / next gate.
- Open blockers / UNKNOWNs.
- Last evidence date and verified SHA when available.

The current user-declared position is **Phase 6, approximately the F6.3–F6.5 transition toward F7**. This is a navigation fact, not evidence that F1–F5 are technically frozen. Their exact historical contracts and completion evidence remain to be reconciled before green status is shown.

### 13.2 Organ/system view

The visual organism MUST make the Superarchitect legible as one system. Initial organ groups:

`PERCEPTION -> PROJECT STATE/MEMORY -> D-2/REASONING -> PROGRAM/TOPOLOGY/SPATIAL -> GENERATION -> N→16→4→1 -> EVALUATION/OPTIMIZATION -> AGK/3D-FIRST -> BIM/DRAWINGS/DOSSIER -> CONSTRUCTION/OPERATION/MAINTENANCE -> LEARNING`

ACS and Capability Fabric are transverse nervous-system services and MUST NOT be drawn as competing architectural or geometry authorities.

Each organ opens a detail panel containing at minimum: epistemic state, integration state, applicable phase(s), authority, repo/branch/path, contract, evidence/test/SHA, dependencies, blockers, next transition and acceptance gate.

### 13.3 Live progression rule

A material process/product iteration is not closed until the Live Map records its state transition. Example:

`IN_PROGRESS -> EXECUTED -> VERIFIED -> FROZEN`

The exact states used depend on evidence; no step is automatic. Closing one gate moves `CURRENT` to the next accepted gate while preserving the prior state and lineage.

### 13.4 Idea / feedback loop

New ideas enter a visible Evolution Radar rather than silently changing architecture:

`NEW -> INVESTIGATE -> {ACCEPT | HOLD | REJECT} -> IMPLEMENT -> VERIFY -> FREEZE`

An idea may also be classified `DUPLICATE_OR_IMPROVEMENT` or later `RECONSIDER`. Rejected/held ideas remain in history with rationale. Technology-dependent claims route through ACS when empirical evidence is required.

### 13.5 Single-source rule

The UI, handoff, Markdown summary and future automation MUST derive status from the structured state registry rather than maintain independent manual truth. Markdown remains human-readable continuity documentation; the structured registry is the machine-readable state surface.

### 13.6 Handoff behavior

A future session should be able to read the structured registry and answer immediately:

1. What is ARKI trying to become?
2. Which of the 10 phases is current?
3. What exact sub-process is active?
4. What was just completed?
5. What is blocked or unknown?
6. What is the next exact action?
7. Which evidence supports every green/frozen claim?

If any of those cannot be answered, the Live Map is incomplete.

---

## Handoff rule

**Future assistant/session:** read this file first, then inspect the linked current evidence before changing state. Do not restart a global audit from zero. Update this file as part of material work so the next session inherits the exact project position.


## 14. Reconciliation checkpoint — 2026-10-07

**Scope:** deep cross-repository reconciliation of `sicl-web` and `sicl-core`, followed by bounded F7/F8 assembly on `feat/f7-f8-integral-closure`.

### 14.1 Repository authority law

The following boundary is now the working integration law and MUST be preserved by F7/F8:

- **sicl-core / CORE:** canonical Project State, evidence/provenance and governed state authority.
- **D-2:** architectural semantic authority.
- **AGK:** sole Operational Geometry Authority.
- **sicl-web professional models:** analysis/projection/coordination surfaces that reference canonical authorities; they are not a second canonical Project State.
- **F8 dossier:** derived publication/delivery projection of an accepted F7 state; export is not truth.
- **ACS:** technology/source acquisition, experimentation and reproducible evidence; not architectural or geometry authority.

### 14.2 Implemented F7/F8 integration spine

The active branch contains:

- `shared/arkiCanonicalRefs.ts` — typed Core/D-2/AGK references and authority validation.
- `server/arkiProfessionalState.ts` — immutable BASELINE_0 source evidence, contradictions, professional projections/issues and coordinated F7 state.
- `server/arkiProjectEconomicTwin.ts` — project-local cost baseline and provenance-preserving quantity/cost deltas.
- `server/arkiTechnicalDossier.ts` — F8 dossier generated only from `ACCEPTED_FOR_F8` F7 state.
- `server/arkiF7F8Closure.test.ts` — adversarial tests for contradiction visibility, economic mapping/provenance and F7→F8 lineage.

**Epistemic state:** IMPLEMENTED / EXECUTION_VERIFICATION_PENDING. No green/freeze is authorized until the branch is executed through TypeScript, focused tests, regression and production build.

### 14.3 Reconciled findings

1. F6 remains **FROZEN / GO_BOUNDED_DEMONSTRATED_BOUNDARY**. Do not reopen without counterevidence or a versioned requirement.
2. F7 is no longer only contract formation; an executable integration spine exists, but is not yet VERIFIED.
3. F8 has an implemented derived-dossier contract; it is not yet VERIFIED and is not frozen.
4. Existing web BIM/cost/lifecycle structures must be classified as projections/adapters where they overlap Core concepts.
5. F5 selected-candidate → persistent Core semantic identity remains a missing integration capability, not a reason to invent a second truth.
6. RVT remains HOST_REQUIRED; no native proprietary RVT parsing claim is authorized.
7. ACS/OECE → complete technical dossier → ARKI BASELINE_0 remains an E2E target, not a demonstrated claim.

### 14.4 Next exact action

Run the F7/F8 branch gate on the exact remote HEAD. If any compile/test/build failure appears, correct it before adding further capability. When green, integrate existing jurisdiction, coordination, BIM/IFC and S10/project-cost adapters into the same professional-state spine rather than creating parallel subsystems.

**Continuity rule:** continue from this checkpoint and `ARKI_MASTER_MAP_STATE.json`; do not restart the global audit.


## 15. S10 + OECE/ACS readiness checkpoint — 2026-10-07

### 15.1 S10

Bounded implementation now covers:

`external S10 evidence → runtime validation → normalization → budget hierarchy/APU/resources → declared-total reconciliation → immutable PROJECT_COST_BASELINE → F7 Economic Twin`

Hard limits remain explicit: no native S10 WRITE, no round-trip claim, no native project/database parser claim until a legitimate specimen is characterized and executed.

### 15.2 OECE / ACS

A cross-language evidence contract now covers:

`OECE/ACS → runtime-validated immutable evidence package → checksummed records/documents → missing-surface report → BASELINE_0 → D-2/AGK/F7`

OECE/ACS remains upstream evidence only. It cannot mutate Core, D-2 or AGK and cannot publish directly to F8.

A document is `VERIFIED` only with checksum + local evidence reference. A procedure/metadata record does not imply a complete dossier. The implementation deliberately uses `TECHNICAL_CORE_SET_VERIFIED` rather than claiming a complete technical dossier.

### 15.3 External verification gates

The next evidence campaign requires:
1. one legitimate real S10 project/export and reconciliation against S10-produced totals/reports;
2. one real ACS/OECE procedure resolving records + documents, downloading/checksumming available files and producing the ARKI evidence package;
3. local TypeScript/focused/regression/build gate on the exact integration HEAD.

Until those executions occur: `IMPLEMENTED != VERIFIED`.
