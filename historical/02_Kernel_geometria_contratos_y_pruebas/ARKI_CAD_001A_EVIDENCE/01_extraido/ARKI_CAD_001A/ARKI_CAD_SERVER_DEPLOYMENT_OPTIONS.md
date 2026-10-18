# ARKI CAD Server Deployment Options

## Option A — Linux primary + ODA Linux worker

```text
ARKI Linux Core → durable job queue → CAD worker Linux → ODA SDK → ACIR
```

This is the best alignment with ARKI's intended server architecture. It remains conditional on ODA membership, release availability, security review and a real ABB-001 benchmark.

## Option B — Linux primary + Windows RealDWG worker

```text
ARKI Linux Core → isolated queue → Windows 64-bit worker → RealDWG → ACIR
```

This could provide a high-fidelity Autodesk reference path, but adds Windows infrastructure, licensing, patching, isolation and operational complexity. Autodesk's current RealDWG 2027 page publishes Windows 11 requirements; Tech Soft 3D describes RealDWG as Windows desktop-only and states that server hosting is not permitted. This option requires written vendor confirmation before any implementation.

## Option C — Linux primary + LibreDWG sandbox

```text
ARKI Linux Core → sandboxed parser job → LibreDWG → ACIR
```

This is technically attractive for an internal/open baseline and Linux deployment. It is not suitable as the sole production fidelity authority because modern writing and several object classes remain incomplete. The parser must be isolated because official security advisories document denial-of-service and memory/crash risks.

## Option D — ODA File Converter diagnostic worker

```text
ABB-001 copy → non-commercial diagnostic worker → DWG/DXF conversion → comparison only
```

Appropriate for a controlled benchmark if the usage category permits it. It is not approved as commercial ARKI infrastructure or a redistributable CAD gateway.

## Recommended topology for the next evidence phase

Use a **primary adapter plus validation oracle**. Provisional design: ODA Drawings SDK as primary candidate, LibreDWG as an open baseline, and RealDWG only if an authorized Windows validation environment and contract are obtained. The core remains Linux and ACIR remains the sole boundary before BIM.
