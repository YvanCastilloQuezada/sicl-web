# ARKI — Parti Contract Report

## Status

`PARTI_CONTRACT = IMPLEMENTED`  
`PARTI_GENERATIVE_ENGINE = NOT_CREATED`  
`PARTI_PROOF = PASS`  
`HUMAN_AUTHORITY = PRESERVED`  
`FUNCTIONAL_VALIDITY = UNKNOWN_UNTIL_HUMAN_REVIEW`

The parti is implemented as a **typed documentary contract and proof adapter** over the existing D6.2 reasoning-to-topology and D6.3 topology-to-geometry bridges. It does not create a parallel design engine, new ontology primitive, database schema, API or automatic architectural authority.

## Contract fields

Each `PartiContract` records:

- `intention`;
- `originConditions`;
- `organizingRules`;
- `functionalRelationships`;
- `hierarchies`;
- `circulation`;
- `scale`;
- `typology`;
- `limits`;
- `unknowns`;
- `provenance`;
- `topologyId`;
- `geometryIds`;
- `humanAuthority`.

The validator also preserves these distinctions:

`PARTI != FORM`  
`PARTI != ORGANIZATION`  
`PARTI != TOPOLOGY`  
`PARTI != GEOMETRY`  
`AI_PROPOSED != HUMAN_DECIDED`  
`UNKNOWN != FAILURE`

## Demonstrated proof

The proof pack creates three architecturally distinct parti hypotheses for one civic-service brief:

| Parti | Organizing idea | Topology | Geometry | Status |
|---|---|---|---|---|
| `PARTI-A` | Public spine with lateral controlled service edge | `D63G-MICRO-TOPOLOGY-A` | D6.3 candidate A | `AI_PROPOSED / HUMAN REVIEW REQUIRED` |
| `PARTI-B` | Transverse commons separating public and staff flows | `D63G-MICRO-TOPOLOGY-B` | D6.3 candidate B | `AI_PROPOSED / HUMAN REVIEW REQUIRED` |
| `PARTI-C` | Central anchor with controlled service edge | `D63G-MICRO-TOPOLOGY-C` | D6.3 candidate A under explicit expanded envelope | `AI_PROPOSED / HUMAN REVIEW REQUIRED` |

Each record has independent intention, rules, topology lineage, geometry lineage and provenance. The proof does not claim that any candidate is functionally or regulatorily valid.

## Adversarial case

The proof includes an adversarial mutation that is geometrically valid but removes the controlled service edge and merges incompatible flows. The resulting record is:

`GEOMETRIC_VALIDITY = PASS`  
`FUNCTIONAL_VALIDITY = FAIL`  
`RULE_PRESERVATION = FAIL`  
`DECISION = REJECT`  
`BACKTRACK = PARTI`

This demonstrates that a visually or geometrically coherent result cannot pass when it violates the parti's recorded functional rules.

## Mutation and backtracking

The proof includes:

- rejection of a malformed parti by returning to the parti layer;
- a proposed mutation that backtracks from topology after a controlled-interface rule must be restored;
- explicit changed rules and parent/result lineage.

## Typology transfer

`PARTI-A` is transferred from `CIVIC_SERVICE` toward `LIBRARY` using `ADAPT`, not copy or automatic transfer. The transferred rules are bounded to public orientation and service-edge reasoning. Civic staffing patterns are explicitly not transferred. Human review remains mandatory.

## Gates

- `G1_CONTRACT_FIELDS = PASS`
- `G2_THREE_PARTIS = PASS`
- `G3_PARTI_TO_TOPOLOGY = PASS`
- `G4_TOPOLOGY_TO_GEOMETRY = PASS`
- `G5_RULE_PRESERVATION = PASS`
- `G6_ADVERSARIAL_REJECTION = PASS`
- `G7_MUTATION_BACKTRACK = PASS`
- `G8_HUMAN_AUTHORITY = PASS`
- `G9_TRANSFER_BOUNDARY = PASS`
- `G10_NO_HARDCODED_GEOMETRY_CLAIM = PASS`

## Honest capability boundary

The current implementation demonstrates that ARKI can **represent and trace parti hypotheses**, connect them to existing topological and geometric artifacts, reject a known adversarial violation, record mutation/backtracking and express bounded typology adaptation.

It does not demonstrate autonomous architectural judgment, functional compliance, regulatory approval, structural validity, construction documentation, professional responsibility or automatic learning promotion. Functional validity remains `UNKNOWN` until the architect reviews the proposed alternatives.

## Evidence

Implementation: `server/arkiPartiContract.ts`  
Focused tests: `server/arkiPartiContract.test.ts`  
Existing bridge evidence: `server/arkiD62ReasoningHarness.ts`, `server/arkiD63GeometricBridge.ts`  
Validation: `5/5` focused tests passed.
