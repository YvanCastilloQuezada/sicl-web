# ARKI-K10 — Knowledge Storage Architecture

## Result

K10 defines a portable logical storage architecture with three separated source-of-truth roles:

- `SOURCE_STORE` retains source metadata, bounded content units, artifact references and rights/access status.
- `KNOWLEDGE_STORE` retains source-derived knowledge units, K4 records and provenance links.
- `PROJECT_EXPERIENCE_STORE` is reserved for project experience and human feedback records.

The client reads through the existing deterministic K4 retrieval boundary. A local cache is optional and non-authoritative. Production persistence is explicitly deferred; this phase does not add a database, vector database, embedding system, RAG runtime or second identity system.

## Architectural properties

The model is portable because its records are serializable and its source references are explicit. It is separated because source records, derived knowledge and project experience cannot be silently merged. It is reversible because the contract is logical and does not require infrastructure migration.

## Validation

The K10 proof verifies three distinct stores, one K4 read boundary, non-authoritative caching, deferred production persistence and the absence of vector, embedding or RAG dependencies.
