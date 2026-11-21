# ARKI — Generation and Funnel Evaluation Contract V1



**Contract ID:** ARKI-GENERATION-FUNNEL-CONTRACT-V1

**Version:** 1.0.0

**Status:** NORMATIVE CONTRACT — IMPLEMENTATION NOT YET VERIFIED

**Authority:** ARKI architectural decision system

**Scope:** Design generation, normative screening, architectural evaluation, progressive selection and evidence preservation.



---



## 1. Purpose



This contract establishes the mandatory process by which ARKI generates,

evaluates, filters, ranks and progressively reduces architectural proposals.



The Funnel is not a proposal generator and must not act as a substitute

for architectural evaluation. It is the visible and traceable representation

of evaluations already performed by ARKI.



No proposal may advance merely because a numerical slot is available.



## 2. Canonical sequence



The required target sequence is:



**100 → 40 → 25 → 16 → 9 → 4 → 1**



| Stage | Input | Target output | Required operation |

|---|---:|---:|---|

| S0 — Generation | — | 100 | Generate the initial candidate universe |

| S1 — Normative and urban viability | 100 | 40 | Apply verified hard constraints |

| S2 — Architectural quality selection | 40 | 25 | Evaluate and rank architectural quality |

| S3 — Funnel evaluation | 25 | 16 | Evaluate all 25 and select 16 |

| S4 — Funnel evaluation | 16 | 9 | Evaluate all 16 and select 9 |

| S5 — Deep comparative evaluation | 9 | 4 | Evaluate all 9 and select 4 finalists |

| S6 — Final comparative evaluation | 4 | 1 | Evaluate all 4 and identify the winner |



These numbers are target capacities, not permission to fabricate,

duplicate, promote or waive candidates.



If fewer candidates pass a mandatory gate, ARKI must stop at the

actual count, report the shortfall and preserve the reason. It must

not fill missing positions with ineligible, unknown or synthetic candidates.



## 3. Stage S0 — Initial generation



ARKI must generate the configured initial universe, with 100 as the

canonical default for this contract.



Each candidate must have:

- Unique candidate ID and generation ID.

- Project and site references.

- Explicit generation parameters and parameter values.

- Family, variant and typological identity.

- Geometry and geometry provenance.

- Generator and contract versions.

- AGK compilation result or an explicit pending/failed state.



The generated count must be reported separately from every subsequent

eligible, rejected, unknown, archived and selected count.



## 4. Stage S1 — Normative and urban viability: 100 → 40



Every generated candidate must be checked against applicable project,

site, urban and building constraints before architectural ranking.



The screening must include, when applicable and supported by verified

project data and authoritative rules:



- Land use, zoning and permitted activity.

- Urban parameters and building parameters.

- Maximum height and number of floors.

- Site occupancy and buildable area.

- Floor-area ratio or equivalent edificability limits.

- Setbacks, alignments and mandatory separations.

- Site access, circulation and required clearances.

- Parking and other applicable urban obligations.

- Programmatic capacity and minimum area requirements.

- Environmental, climatic, accessibility, safety and other mandatory

  requirements applicable to the project.



Every rule evaluation must record:

- Rule ID and rule-set version.

- Jurisdiction and applicable territory.

- Source, document, article or section.

- Effective date or validity period, when available.

- Candidate parameter and measured value.

- Required threshold or condition.

- Result: PASS, FAIL or UNKNOWN.

- Evidence reference and evaluation timestamp.



A hard constraint with result FAIL disqualifies the candidate from

the viable set.



A hard constraint with result UNKNOWN does not count as PASS.

Missing site data, missing parameters or missing authoritative

normative evidence must remain visible as uncertainty and block

automatic advancement whenever they affect compliance.



The target is 40 viable proposals. ARKI must not force exactly 40

when fewer than 40 pass the verified constraints.



## 5. Stage S2 — Architectural quality: 40 → 25



ARKI must evaluate every normatively viable candidate before selecting

the 25 proposals that advance.



The evaluation rubric must be explicit, versioned and reproducible.

It must consider, as applicable:



- Spatial and functional quality.

- Program organization and spatial hierarchy.

- Architectural composition and volumetric coherence.

- Circulation, accessibility and spatial relationships.

- Site implantation, orientation and climatic response.

- Environmental performance and passive strategies.

- Area efficiency and functional performance.

- Flexibility, adaptability and potential for future growth.

- Typological coherence and suitability to the project.

- Consistency between concept, PARTI, topology and geometry.

- Geometric integrity and AGK evidence.

- Constructive and technical feasibility at the evaluated level.



Each criterion must define its scale, evidence requirements, weight,

and treatment of missing information in a separately versioned rubric.



ARKI must produce an evaluation record and comparable score for each

candidate. It must explain the ranking and the reasons for exclusion.



Diversity is a complementary selection consideration. It may preserve

meaningful architectural alternatives among candidates with comparable

merit, but must not silently replace quality ranking or override a

mandatory constraint.



## 6. Stages S3–S6 — Progressive evaluation



The Funnel must represent the following evaluations:



### 25 → 16



ARKI evaluates all 25 candidates, records their comparative results,

ranks them and selects up to 16 for the next stage.



### 16 → 9



ARKI evaluates all 16 candidates with the next level of comparative

analysis, records the findings and selects up to 9.



### 9 → 4



ARKI evaluates all 9 candidates with deeper architectural and technical

comparison, records the ranking and selects 4 finalists.



### 4 → 1



ARKI evaluates all 4 finalists in depth and identifies the highest-ranked

candidate as the recommended winner.



The evaluation depth must increase as the candidate set decreases.

A stage must not merely inherit an old score or copy a previous ranking.



Every stage must record:

- Candidates entering evaluation.

- Candidates actually evaluated.

- Candidates selected to advance.

- Candidates not selected and their reasons.

- Evaluation rubric and evaluator version.

- Scores, findings, evidence and unknowns.

- Ranking and tie-breaking rationale.

- Timestamp and immutable stage reference.



The final winner recommendation must include its comparative rationale

against the other three finalists.



Professional review, approval and signature remain explicit governance

steps. They must not be represented as if ARKI had no evaluation or

ranking authority.



## 7. Architectural reasoning and geometry continuity



The canonical processing chain is:



**Brief → knowledge → D6.2 → PARTI → topology → D6.3 → AGK

→ architectural evaluation → pruning → Funnel**



The candidate evaluated at each stage must be traceable to its actual

project-specific reasoning, PARTI, topology, geometry and AGK state.



Synthetic fixtures, fixed examples, demo candidates or unrelated

project snapshots cannot be presented as project evaluation evidence.



A geometry rejected by AGK cannot be treated as a geometrically

validated candidate. Unsupported geometry strategies must remain

explicitly rejected until implemented and tested.



## 8. Selection and pruning rules



Selection must be deterministic for identical inputs, rule versions,

rubric versions and evaluator versions.



The ranking must be based on declared evaluation criteria.

Diversity may be used as a documented secondary criterion or tie-breaker.



Round-robin diversity alone is not architectural quality evaluation

and cannot satisfy this contract.



Unknown evidence cannot be silently converted into a passing score.

A candidate with an unresolved mandatory hard constraint cannot advance.



No stage may invent candidates, duplicate candidates or silently

change the target counts.



## 9. Evidence preservation and auditability



The system must preserve the complete candidate universe and the

complete decision history, not only the selected proposals.



The evidence record must include:

- All generated candidates.

- Normative and urban screening results.

- Architectural evaluation results.

- AGK compilation evidence.

- Scores, ranking and rubric version.

- Selected and non-selected candidate IDs.

- Rejection, blocking and uncertainty reasons.

- Stage transitions and provenance.

- Final recommendation and professional decision.



Records must be immutable or versioned append-only artifacts.

A repeated generation ID must never silently overwrite previous

evaluation evidence.



The audit trail must allow reconstruction of why a candidate

advanced, stopped or was excluded.



## 10. Funnel display requirements



The interface must display actual counts, not assumed counts.



For each stage it must show:

- Input universe.

- Number evaluated.

- Number passed.

- Number failed.

- Number unknown or blocked.

- Number selected to advance.

- Number excluded.

- Evaluation completion state.

- Evidence availability.



The canonical stage labels are:



**100 generated → 40 viable → 25 evaluated → 16 evaluated

→ 9 evaluated → 4 evaluated → 1 recommended winner**



The interface must distinguish generation, evaluation, selection,

professional approval and final promotion.



A visual transition is not evidence that an evaluation occurred.



## 11. Fail-closed governance



The governing principle is:



**CERO DEUDA — No Evidence = No Green.**



No candidate or stage may be marked compliant, evaluated, approved

or complete without the corresponding evidence.



Unknown is not PASS. Missing is not zero. A preview is not a validated

architectural result. A generated proposal is not a certified project.



Normative and structural compliance must retain their actual status;

the Funnel must not imply certification that has not been established.



## 12. Acceptance gates



This contract is not implemented merely by documenting the sequence.



Implementation acceptance requires:

1. Tests proving the 100-candidate generation contract.

2. Tests proving normative screening and fail-closed UNKNOWN handling.

3. Tests proving 100 → 40 when 40 candidates pass, and correct shortfall

   behavior when fewer pass.

4. Tests proving evaluation of all 40 before selection of 25.

5. Tests proving evaluation of all 25, 16, 9 and 4 before each reduction.

6. Tests proving ranking is based on versioned architectural criteria.

7. Tests proving diversity does not override hard constraints or quality

   ranking without an explicit documented rule.

8. Tests proving the API returns the actual selected candidates and

   complete stage evidence.

9. Tests proving complete persistence of selected and excluded candidates.

10. Tests proving the UI displays actual evaluation counts and states.

11. End-to-end evidence linking Brief, D6.2, PARTI, topology, D6.3,

    AGK, evaluation and Funnel.

12. Regression tests proving existing project and geometry contracts

    remain intact.



Until these gates pass, implementation status remains

**NOT VERIFIED**.



---



**Normative rule:** ARKI must evaluate the complete candidate set at

each stage before reducing it. The Funnel displays that evaluation;

it does not replace it.
