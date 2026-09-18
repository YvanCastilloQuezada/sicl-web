# DL-ARKI-KNOWLEDGE-ARCHITECTURE-01

**Status:** APPROVED / CLOSED / ACTIVE / FROZEN DIRECTION  
**Authority:** Product Owner / Human Architect  
**Scope:** Decision, documentation and architecture freeze only.

## A. Status

ARKI is the primary user-facing architectural design intelligence. The approved architecture combines general architectural competence, project intelligence, system intelligence and future knowledge orchestration. Deep specialist knowledge is federated by domain rather than copied into one monolithic ARKI repository.

This document registers the architecture only. It does not activate specialist agents, source ingestion, retrieval, RAG, embeddings, vector databases, servers, APIs, persistence, caches, cloud storage or infrastructure.

## B. Decision

The approved conceptual model is:

```text
HUMAN ARCHITECT
        ↓
       ARKI
        ↓
GENERAL ARCHITECTURAL DESIGN INTELLIGENCE
        ↓
KNOWLEDGE ORCHESTRATION
        ↓
FEDERATED KNOWLEDGE DOMAINS
        ↓
SHARED SOURCE LIBRARY
```

Future perspectives may include Housing, Bioclimatic, Structural, Urbanism, Landscape, Construction, Materials, Building Systems, Accessibility, Regulatory, Life Safety, Sustainability, Economics, Healthcare, Education, Hospitality, Industrial, Laboratory and Heritage. This list is extensible guidance, not authorization to create agents.

## C. ARKI role

ARKI remains the primary architectural interlocutor and generalist design intelligence. It must retain competence in architectural fundamentals, spatial reasoning, program, parti, site/context, typologies, circulation, synthesis, representation, reading, criticism, alternatives and trade-offs.

ARKI must not be reduced to a message router. It may identify relevant specialist perspectives, integrate their findings, preserve contradictions, explain trade-offs and return a hypothesis or explanation to the Human Architect.

## D. General architectural competence

General competence is mandatory for ARKI to qualify as architectural design intelligence. It includes space, form, mass/void, scale, proportion, composition, hierarchy, program, spatial relationships, parti, organization, circulation, site/context fundamentals, typology, design process, synthesis, representation, architectural reading, criticism, comparison and basic cross-disciplinary awareness.

```text
NO GENERAL ARCHITECTURAL COMPETENCE
→ ARKI IS NOT AN ARCHITECTURAL DESIGN INTELLIGENCE
```

## E. Specialist role

A specialist is a domain-expert perspective with access to relevant federated knowledge and contextual analysis. A specialist is not a mandatory separate chatbot, independent assistant, source owner or holder of universal truth.

The preferred user flow is:

```text
HUMAN ARCHITECT → ARKI → INTERNAL SPECIALIST CONSULTATION → ARKI → INTEGRATED RESPONSE
```

ARKI remains the visible primary interface.

## F. Specialist authority boundary

```text
SPECIALIST ≠ AUTHORITY
SPECIALIST OUTPUT ≠ FACT BY DEFAULT
SPECIALIST RECOMMENDATION ≠ DECISION
SPECIALIST DISAGREEMENT ≠ ERROR
SPECIALIST CONSENSUS ≠ HUMAN DECISION
```

The Human Architect is the final authority. No specialist vote, consensus or hidden ranking may create a winner or decision.

## G. ARKI orchestration

The future conceptual flow is:

```text
PROJECT QUESTION
→ ARKI UNDERSTANDS QUESTION
→ RELEVANT KNOWLEDGE DOMAINS
→ SPECIALIST NEED IDENTIFIED
→ SPECIALIST PERSPECTIVE(S)
→ DOMAIN KNOWLEDGE / PROJECT EVIDENCE
→ SPECIALIST FINDINGS
→ ARKI INTEGRATION
→ TRADE-OFFS / CONTRADICTIONS / UNKNOWN
→ HYPOTHESIS OR EXPLANATION
→ HUMAN ARCHITECT
```

This architecture preserves the distinction between knowledge, evidence, simulation, compliance, hypothesis and decision.

## H. Contradiction handling

ARKI must preserve differences between perspectives. For a courtyard alternative, architectural composition, Housing, Bioclimatic, Structural, Economics, Accessibility and Regulatory perspectives may identify different implications. ARKI must explain the trade-off rather than silently vote among them.

```text
SPECIALIST A ≠ SPECIALIST B
→ PRESERVE DIFFERENCE
CONFLICT → EXPLAIN TRADE-OFF
NO AUTOMATIC WINNER
```

## I. Shared Source Library

A future Shared Source Library is approved conceptually for books, papers, standards, regulations, manuals, theses, technical guides, catalogs, precedent documentation, datasets, post-occupancy studies and project documentation.

```text
ONE SHARED SOURCE LIBRARY
+ FEDERATED KNOWLEDGE DOMAINS
+ MULTIPLE SPECIALIST PERSPECTIVES
+ ONE PRIMARY ARKI INTERFACE
```

The library is shared; sources must not be duplicated per specialist.

## J. Source vs knowledge

```text
SOURCE LIBRARY ≠ ARKI MEMORY
SOURCE LIBRARY ≠ SPECIALIST MEMORY
SOURCE LIBRARY ≠ VALIDATED KNOWLEDGE
SOURCE FILE ≠ KNOWLEDGE UNIT
SOURCE TEXT ≠ FACT
EXTRACTED CLAIM ≠ VALIDATED KNOWLEDGE
AUTHOR OPINION ≠ UNIVERSAL RULE
BOOK STATEMENT ≠ PROJECT FACT
PRECEDENT ≠ PRESCRIPTION
REGULATION ≠ DESIGN PREFERENCE
```

A source may yield many knowledge units, and one knowledge unit may be relevant to many domains and perspectives.

## K. Knowledge extraction direction

The future conceptual flow is:

```text
SOURCE
→ SOURCE RECORD
→ CONTENT ANALYSIS
→ KNOWLEDGE UNIT / CLAIM
→ EPISTEMIC CLASSIFICATION
→ DOMAIN CLASSIFICATION
→ CONTEXT CLASSIFICATION
→ PROVENANCE
→ KNOWLEDGE CANDIDATE
→ CONTROLLED VALIDATION
→ CONTEXT-BOUNDED REUSABLE KNOWLEDGE
```

No part of this flow is activated by this Decision Lock.

## L. Provenance

Every source-derived knowledge unit must remain traceable, where legally and technically appropriate, through:

```text
KNOWLEDGE → SOURCE_ID → AUTHOR / ORGANIZATION → SOURCE
→ EDITION / VERSION → DATE → CHAPTER / SECTION / PAGE / LOCATION
```

Future source preservation is distinct from knowledge representation. Original materials may be preserved for verification, reprocessing, provenance, audit and updated extraction, but must not be embedded into the ARKI client by default.

## M. Storage separation

The future architecture distinguishes three stores:

| Store | Purpose | Current state |
|---|---|---|
| Source Storage | Books, papers, standards, images, videos, datasets and heavy documents | Not implemented |
| Knowledge Store | Concepts, claims, strategies, patterns, precedents, applicability, provenance and validation | Not implemented |
| Project / Experience Store | Project experiences, human feedback, alternatives, observations, outcomes and corrections | K1 foundation proven only |

```text
SOURCE STORAGE ≠ KNOWLEDGE STORE ≠ PROJECT EXPERIENCE STORE
```

No database, storage provider, API or persistence change is authorized.

## N. Client weight principle

```text
ARKI CLIENT ≠ COMPLETE SOURCE LIBRARY
```

The future preferred model is a lightweight client receiving relevant project context and relevant knowledge, with source access only when required. No client/server implementation is authorized now.

## O. Future server direction

Heavy source libraries and potentially large knowledge repositories may eventually reside in server or cloud infrastructure. Technology selection is explicitly deferred. No provider, object storage, database, vector database, server, API, authentication change, deployment or infrastructure is authorized.

Infrastructure follows capability proof.

## P. Future cache direction

A bounded local cache may eventually hold knowledge and context relevant to the active project.

```text
LOCAL CACHE ≠ SOURCE OF TRUTH
LOCAL CACHE ≠ COMPLETE LIBRARY
```

Offline and synchronization behavior are not authorized.

## Q. One Library / Many Perspectives

The canonical direction is one shared source library consulted by many federated knowledge domains and specialist perspectives through one primary ARKI interface. The architecture prohibits one library copy per agent and prohibits a monolithic ARKI knowledge silo.

## R. K1 compatibility

ARKI-K1 remains unchanged and frozen:

```text
ARCHITECTURAL_LEARNING_CONTRACT = PROVEN
PROJECT_EXPERIENCE = PROVEN
HUMAN_FEEDBACK_CAPTURE = PROVEN
CONTEXT_BOUNDING = PROVEN
PROVENANCE = PROVEN
CONTROLLED_PROMOTION = PROVEN
AUTOMATIC_PROMOTION = PROHIBITED
```

Project experience, bibliographic knowledge and human teaching remain distinct sources of candidates, each preserving provenance.

## S. K2 compatibility

ARKI-K2 remains compatible and frozen as the declarative architectural knowledge curriculum. K2 defines what the ecosystem must know; this Decision Lock defines how general ARKI competence, future specialist perspectives and shared sources relate.

Future domain ownership may classify domains as:

```text
ARKI_GENERAL
SPECIALIST_DEEP
CROSS_CUTTING
```

Examples are guidance only: Foundations, Spatial Composition, Synthesis and Criticism are generally ARKI-general; Housing, Bioclimatic, Structural and Regulatory deep knowledge may be specialist; Site and Context and Materials may be cross-cutting depending on the question.

## T. Knowledge domain ownership and access

Future specialist access should be filtered by domain, context, SpatialScope, typology, design stage, geography, jurisdiction, source, epistemic status and applicability. Specialists should not own isolated book collections.

ARKI may access general architectural knowledge, project knowledge, project experience, cross-cutting knowledge, specialist findings and source provenance when needed. It need not preload all deep sources into its active context.

## U. Human Authority

The permanent authority chain is:

```text
SPECIALIST
→ ARKI INTEGRATION
→ ARCHITECTURAL HYPOTHESIS / EXPLANATION
→ HUMAN ARCHITECT
→ DECISION
```

ARKI may act with bounded authority inside authorized operations, but may not usurp human authority.

## V. Experience feedback

```text
BOOK / PAPER / STANDARD → SOURCE-DERIVED KNOWLEDGE
PROJECT → EXPERIENCE-DERIVED KNOWLEDGE CANDIDATE
HUMAN TEACHING → HUMAN-FEEDBACK-DERIVED KNOWLEDGE CANDIDATE
```

These may later converge through controlled validation, but provenance must remain intact. No automatic generalization is permitted: one source, project, correction, specialist finding or repeated finding is not automatically a universal rule.

Future temporal statuses may include `CURRENT`, `SUPERSEDED`, `DEPRECATED`, `UNKNOWN_VALIDITY` and `CONTEXT_VALIDATED`. No vigency infrastructure is implemented now.

## W. Source rights

Future source ingestion and storage must respect provenance, access rights, copyright, licensing, user permissions, organizational permissions and redistribution restrictions. Rights management is not implemented by this order.

## X. Frozen implementation status

```text
ARKI GENERALIST ROLE = APPROVED PRODUCT DIRECTION
SPECIALIST ORCHESTRATION = REGISTERED / NOT ACTIVATED
SPECIALIST AGENTS = NOT ACTIVATED
FEDERATED KNOWLEDGE = REGISTERED / FROZEN
SHARED SOURCE LIBRARY = REGISTERED / NOT IMPLEMENTED
SOURCE STORAGE = NOT IMPLEMENTED
KNOWLEDGE STORE = NOT IMPLEMENTED
PROJECT EXPERIENCE = K1 FOUNDATION PROVEN
SOURCE INGESTION = NOT ACTIVATED
RETRIEVAL = NOT ACTIVATED
RAG = NOT ACTIVATED
EMBEDDINGS = NOT ACTIVATED
VECTOR DATABASE = NOT ACTIVATED
SERVER INFRASTRUCTURE = NOT IMPLEMENTED
LOCAL CACHE = NOT IMPLEMENTED
A21-P4E = REAL_GATE / FROZEN AT GATE
```

No A21-P4, P4E, P4R, spatial realization bridge, containment, A17, A29, A30 or A31 work is executed or altered.

## Y. Non-authorized work

This Decision Lock does not authorize:

- specialist agents or specialist chatbots;
- Knowledge Federation runtime;
- books, PDFs, OCR or external sources;
- source ingestion, extraction or automatic classification;
- retrieval, RAG, embeddings or vector databases;
- source storage, knowledge storage or project persistence changes;
- servers, APIs, cloud storage, caching, offline behavior or synchronization;
- new infrastructure or deployment;
- changes to K1, K2, A21 or Core;
- automatic design operations, decisions, compliance claims or simulation results.

## Validation and final state

```text
DOCUMENT_CONSISTENCY = PASS
IDENTITY_CONSISTENCY = PASS
K1_STATE_CONSISTENCY = PASS
K2_STATE_CONSISTENCY = PASS
A21_STATE_CONSISTENCY = PASS
GIT_DIFF_CHECK = PASS
PRODUCT_CODE_CHANGED = NO
RUNTIME_CODE_CHANGED = NO
CORE_CHANGED = NO
UI_CHANGED = NO
API_CHANGED = NO
PERSISTENCE_CHANGED = NO
```

The canonical architecture is now:

```text
ARKI KNOWLEDGE ARCHITECTURE
= APPROVED / CLOSED / ACTIVE / FROZEN DIRECTION
```

This means future K3, K4, Federation and Specialist work must respect the architecture. It does not mean those capabilities are implemented.
