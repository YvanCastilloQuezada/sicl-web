# ARKI CAD — Security Analysis

## Required baseline

DWG/DXF are untrusted input. Any parser or converter must run in a least-privilege worker with CPU, memory, wall-clock and output-size limits; no access to canonical project state; read-only source mount; isolated temporary storage; restricted network; deterministic logs; and a kill/recovery path.

## Candidate observations

**LibreDWG:** official repository security material lists denial-of-service, excessive allocation and crash advisories for malformed files. It therefore requires a hardened sandbox and a pinned release with advisory review.

**ODA / RealDWG:** vendor SDKs reduce the need to reverse-engineer the format, but proprietary vendor status does not prove immunity. ARKI still requires fuzzing, malformed-input tests, dependency scanning and a vendor security/support agreement.

**ODA File Converter:** a binary batch tool must not be placed in the commercial service path without a contract and sandbox. Its Audit mode is not a neutral read operation.

## Security gates before implementation

1. Pinned version and reproducible build or vendor package hash.
2. Malformed DWG/DXF corpus and bounded fuzzing.
3. Parser process isolation and resource limits.
4. No network access from the parser worker unless explicitly required.
5. Source and derived artifact hashes.
6. ACIR schema validation and maximum geometry/entity limits.
7. Security review of licensing, updates and vulnerability response.

No security gate has been executed in ARKI-CAD-001A.
