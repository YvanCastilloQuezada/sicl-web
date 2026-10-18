# ARKI Living Knowledge System v1.0

**Código:** ARKI-LKS-001  
**Estado máximo:** `IMPLEMENTED / PENDING EVIDENCE REVIEW`  
**Autoridad:** Product Owner / Human Authority

## Boundary

LKS mantiene conocimiento externo versionado, trazable y revisable. Researcher descubre; Curator intenta refutar y verifica dentro del alcance demostrado; Human Authority decide candidaturas canónicas. Ningún hallazgo externo entra directamente al ARKI Master Codebook.

## Implemented contract surface

- Living Codebook común para IFC/openBIM, Smart Cities y Urban Digital Twins.
- Registro versionado con source identity, version, status, dates, applicability, evidence, provenance, epistemic state, gaps and history.
- State machine fail-closed sin transiciones arbitrarias.
- ACP dimensions separadas: authority, authenticity, version, currentness, claim support, semantic mapping, ARKI implementation, conflicts and unknowns.
- Two-key rule: Researcher no puede auto-validar.
- Human Authority gate para `CANONICAL_CANDIDATE` y `CANONICAL`.
- Capability Atlas derivado, no base paralela.
- Gap Register derivado.
- Change detection determinista.
- No-change closure y material-change escalation.
- Scheduler status explícito: `NOT_DEMONSTRATED / EXTERNAL_ORCHESTRATION_REQUIRED`.

## External research baseline

The first source register uses official/primary sources for the three initial codebooks. External findings remain staged research evidence and are not canonical ARKI knowledge.

## Explicit non-goals

No automatic web crawler, no autonomous canonical promotion, no external scheduler activation, no daemon, no LLM researcher, no automatic implementation of gaps, no overwrite of historical BKH evidence, and no second knowledge database.
