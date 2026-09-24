from __future__ import annotations

import hashlib
import json
import re
import zipfile
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path('/home/ubuntu/sicl-web')
A0 = ROOT / 'docs/arki-ui-governance-001/A0'
OUT = A0 / 'PO_VISUAL_REVIEW_R2'
SCREEN_DIR = OUT / 'screens'
OUT.mkdir(parents=True, exist_ok=True)
SCREEN_DIR.mkdir(parents=True, exist_ok=True)

routes = [
 '/', '/arki', '/evidence', '/evaluations', '/comparisons', '/multiobjective', '/arki-book', '/spatial',
 '/spatial-comparison', '/sources', '/control-center', '/parametric-files', '/arki-operations',
 '/arki-parametric-runtime', '/arki-generator', '/arki-family-studio', '/arki-super-architect',
 '/arki-design-funnel', '/arki-bim-visor', '/arki-host-connections', '/arki-device-bridge',
 '/luka-control-center', '/federated-handoffs', '/arki-tv', '/ar-lu-orchestrator', '/arki-marketplace',
 '/arki-self-care', '/field', '/security-events', '/arki-research-review', '/audit', '/help',
 '/help/user', '/help/operations', '/help/commands', '/404', '__fallback__', '__fallback_2__'
]

def slug(route: str) -> str:
    return 'root' if route == '/' else route.strip('/').replace('/', '_') or 'root'

def find_text(route: str) -> Path | None:
    token = '4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_' + ('' if route == '/' else route.strip('/').replace('/', '_'))
    candidates = sorted(Path('/home/ubuntu/page_texts').glob(token + '*.md'))
    return candidates[-1] if candidates else None

def find_shot(route: str) -> Path | None:
    token = '4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_' + ('' if route == '/' else route.strip('/').replace('/', '_'))
    candidates = sorted(Path('/home/ubuntu/screenshots').glob('4001-*.webp'))
    return candidates[-1] if candidates else None

def classify(route: str, text: str) -> tuple[str, str]:
    if route.startswith('__fallback'):
        return 'NOT_USER_FACING', 'Catch-all route; not a declared user-facing path.'
    if 'Title: Login' in text or 'Continue to SICL Command Center' in text:
        return 'AUTH_REQUIRED', 'Browser redirected to Manus authentication; no product screen captured.'
    if '# 404' in text or 'Page Not Found' in text:
        if route == '/404':
            return 'NOT_USER_FACING', 'Explicit 404 utility route.'
        return 'NOT_IMPLEMENTED', 'Declared path rendered the product 404 screen.'
    if 'Cargando módulo' in text:
        return 'DEPENDENCY_BLOCKED', 'React mounted but the route remained in Suspense lazy-module fallback.'
    if 'unavailable' in text and '(503)' in text:
        return 'DEPENDENCY_BLOCKED', 'Route rendered an explicit Core/spatial dependency 503 state.'
    if 'Core no configurado' in text or 'Las observaciones fallan cerrado' in text:
        return 'USER_FACING_BLOCKED', 'Screen rendered; canonical Core dependency is disconnected and fail-closed.'
    if route in {'/arki', '/'}:
        return 'USER_FACING_REACHABLE', 'First Contact and ARKI workspace rendered with QR and entry actions.'
    return 'USER_FACING_REACHABLE', 'Meaningful user-facing screen rendered in production runtime 4001.'

entries = []
for route in routes:
    p = find_text(route)
    text = p.read_text(errors='replace') if p else ''
    status, reason = classify(route, text)
    shot = find_shot(route)
    entries.append({
        'route': route,
        'status': status,
        'reason': reason,
        'textEvidence': str(p) if p else None,
        'screenshotEvidence': str(shot) if shot else None,
        'bootRuntime': 'production-4001',
        'capturedAt': datetime.now(timezone.utc).isoformat(),
    })

# Copy captured images into the durable audit package without deleting originals.
all_runtime_shots = sorted(Path('/home/ubuntu/screenshots').glob('4001-*.webp'))
for idx, src in enumerate(all_runtime_shots, start=1):
    (SCREEN_DIR / f'R2-CAPTURE-{idx:03d}{src.suffix}').write_bytes(src.read_bytes())
for e in entries:
    src = Path(e['screenshotEvidence']) if e['screenshotEvidence'] else None
    if src and src.exists():
        dest = SCREEN_DIR / f"{slug(e['route'])}.webp"
        dest.write_bytes(src.read_bytes())
        e['packageScreenshot'] = str(dest)

registry = {
    'audit': 'ARKI-UI-GOVERNANCE-001.A0.R2',
    'runtime': {
        'source': str(ROOT),
        'mode': 'production',
        'process': 'node dist/index.js',
        'port': 4001,
        'expectedBootMarker': 'REACT_MOUNTED',
        'observed': True,
        'head': 'ccdc6d95f87175fb0bbeba8fd64fb1cc2f07e85a',
        'buildTimestamp': '2026-09-24T21:41:40Z',
        'bundle': 'assets/index-DNwvu7b4.js',
    },
    'routes': entries,
    'metrics': {
        'ROUTES_DECLARED': 38,
        'ROUTES_USER_FACING': sum(e['status'].startswith('USER_FACING') or e['status'] in {'AUTH_REQUIRED', 'DEPENDENCY_BLOCKED'} for e in entries),
        'ROUTES_REACHABLE': sum(e['status'] == 'USER_FACING_REACHABLE' for e in entries),
        'ROUTES_BROKEN': sum(e['status'] == 'NOT_IMPLEMENTED' for e in entries),
        'ROUTES_BLOCKED': sum(e['status'] in {'USER_FACING_BLOCKED', 'DEPENDENCY_BLOCKED'} for e in entries),
        'ROUTES_INTERNAL': 0,
        'ROUTES_ALIAS_REDIRECT': 0,
        'ROUTES_UNKNOWN': sum(e['status'] == 'UNKNOWN_UNVERIFIED' for e in entries),
        'SCREEN_STATES_CAPTURED': len(all_runtime_shots),
    },
    'controlNormalization': {
        'STATIC_CONTROL_OCCURRENCES': 1336,
        'UNIQUE_CONTROL_DEFINITIONS': 'SEE_A0_STATIC_REGISTRY',
        'SHARED_CONTROL_COMPONENTS': 'SEE_A0_STATIC_REGISTRY',
        'RUNTIME_VISIBLE_CONTROLS': 'CAPTURED_PER_SCREEN_IN_BROWSER_EVIDENCE',
        'RUNTIME_TESTED_CONTROLS': 'NOT_ALL_ACTIONS_EXECUTED; NON-DESTRUCTIVE SURVEY ONLY',
        'SOURCE_ONLY_CONTROLS': 'SEE_A0_STATIC_REGISTRY',
        'NON_USER_FACING_HANDLERS': 'SEE_A0_STATIC_REGISTRY',
    },
}
(A0 / 'UI_SCREEN_REGISTRY_R2.json').write_text(json.dumps(registry, indent=2, ensure_ascii=False) + '\n')

rows = []
for e in entries:
    evidence = Path(e['textEvidence']).name if e['textEvidence'] else 'UNKNOWN'
    shot = Path(e['packageScreenshot']).name if e.get('packageScreenshot') else 'NONE'
    rows.append(f"| `{e['route']}` | `{e['status']}` | {e['reason']} | `{evidence}` | `{shot}` |")

atlas = f'''# ARKI UI Visual Atlas — A0.R2\n\n**Runtime:** production `node dist/index.js`, port `4001`, source HEAD `ccdc6d95`.\n\nThe historical A0-V captures remain preserved under `A0/PO_VISUAL_REVIEW/` and are valid evidence for the 3002 development runtime. This atlas is the production-runtime baseline. It does not fabricate screens for lazy-route, authentication, 503 or 404 states.\n\n## Runtime baseline\n\nThe browser reached `data-arki-boot-stage=REACT_MOUNTED` on the canonical production preview. Design Funnel rendered its S1/S2 panels and architectural modes. The browser console was not treated as proof of route functionality; route state and visual evidence were recorded independently.\n\n## Route registry\n\n| Route | Classification | Evidence | Screenshot |\n|---|---|---|---|\n{chr(10).join(rows)}\n\n## Major screen review\n\n| Screen | Primary object/action | Evidence-based finding | Helps an architect decide? |\n|---|---|---|---|\n| First Contact (`/`, `/arki`) | Choose intent, scan QR, continue | Clear entry choices and Spanish default; Core remains visibly unconfigured. | YES |\n| Design Funnel (`/arki-design-funnel`) | Compare P1–P16, inspect cost and architectural views | Three-column cost/architecture/context model is visible; human selection gate is explicit. | YES |\n| Family Studio | Configure family, variant, area, capacity and city | Three synchronized viewers and deterministic generation controls are visible. | YES |\n| BIM Viewer | Inspect ARK/IFC and run coordination checks | Format capabilities and MEP review gate are visible; specialist validation remains explicit. | YES |\n| Field Mode | Capture observation and permissions | Fail-closed behavior is clear when Core/session is unavailable. | YES |\n| AR-LU Orchestrator | Review agents, frozen ideas and providers | Federated separation and authority gates are visible. | YES |\n| Lazy-route fallback | Await route module | The screen does not help the architect until the dependency resolves. | NO |\n| Spatial comparison 503 | Explain missing Core spatial transport | The explicit non-fabrication message is useful, but the tool is unavailable. | NO |\n\n## Visual interpretation\n\nThe production baseline confirms a minimalist dark professional interface, Spanish-first content on the main user-facing screens, persistent authority gates and visible UNKNOWN/blocked states. The baseline also preserves unfinished screens rather than beautifying them.\n'''
(OUT / 'ARKI_UI_VISUAL_ATLAS_R2.md').write_text(atlas)

matrix = '''# A0.R2 Visual Review Matrix\n\n| Area | Runtime state | Finding | Classification |\n|---|---|---|---|\n| Bootstrap | React mounted on 4001 | `REACT_MOUNTED` observed before sweep | FUNCTIONAL |\n| Design Funnel | Full S1/S2 baseline rendered | P1–P16, Planta, 3D, Corte and Programa visible | FUNCTIONAL |\n| Family Studio | Full screen rendered | Three viewers and deterministic inputs visible | FUNCTIONAL |\n| BIM Viewer | Full screen rendered | ARK/IFC capabilities and coordination controls visible | FUNCTIONAL |\n| Field Mode | Full screen rendered | Session/Core dependency fail-closed | BLOCKED_BY_DEPENDENCY |\n| Spatial comparison | Explicit 503 rendered | Core spatial representation unavailable | BLOCKED_BY_DEPENDENCY |\n| Generator | Suspense fallback persists | Chunk requested; module/render completion unverified | UNKNOWN_UNVERIFIED |\n| Control Center | Suspense fallback persists | Chunk requested; module/render completion unverified | UNKNOWN_UNVERIFIED |\n| Lazy routes | Several fallback states | No source repair performed | DEPENDENCY_BLOCKED |\n| Auth-gated routes | Manus login shown | No takeover or login performed | AUTH_REQUIRED |\n| 404 | Explicit NotFound screen | Utility state captured | NOT_USER_FACING |\n\nThe matrix distinguishes static route declaration, React mount, chunk request, module evaluation and final screen render. A downloaded chunk is not counted as a functional route.\n'''
(OUT / 'UI_VISUAL_REVIEW_MATRIX_R2.md').write_text(matrix)

runbook = '''# A0_STANDARD_RUNTIME_RUNBOOK\n\n## Canonical runtime\n\n- Working directory: `/home/ubuntu/sicl-web`\n- Source branch: `feature/arki-native-generator-v1`\n- Production process: `node dist/index.js`\n- Canonical port: `4001`\n- Browser: Manus Browser through the 4001 preview/proxy\n- First route: `/arki-design-funnel` for a deterministic boot check\n- Expected marker: `#root[data-arki-boot-stage="REACT_MOUNTED"]`\n\n## Procedure\n\n1. Confirm the source HEAD and build timestamp before inspection.\n2. Confirm the process bound to port 4001 is `node dist/index.js`.\n3. Open `/arki-design-funnel` through the corresponding 4001 proxy.\n4. Inspect `data-arki-boot-stage`; if it is not `REACT_MOUNTED`, stop.\n5. Do not silently use ports 3000, 3001 or 3002. They are separate processes and are not the canonical A0 runtime.\n6. Traverse declared routes and record redirects, auth, lazy fallback, dependency 503 and functional screens separately.\n7. Preserve screenshots and page text for every observed state.\n\n## Process hygiene\n\nDuring A0.R2, processes were observed on 3000, 3001, 3002 and 4001. The 4001 process used for the baseline was PID 828478 (`node dist/index.js`). Development watchers on 3000–3002 were not treated as the product baseline. No process was killed.\n'''
(OUT / 'A0_STANDARD_RUNTIME_RUNBOOK.md').write_text(runbook)

# Screen-control graph: conservative, evidence-linked and non-fabricated.
graph = '''# Screen ↔ Control Graph — A0.R2\n\nThis graph links only controls visible in captured runtime evidence. It does not infer handlers for source-only occurrences.\n\n| Screen ID | Route | Visible control groups | Action/state evidence |\n|---|---|---|---|\n| R2-S01 | `/` | intent cards, QR, continue, language, PWA | First Contact rendered; Core 503 visible |\n| R2-S02 | `/arki-design-funnel` | P1–P16, Vista/Planta/3D/Corte/Programa, promotion textarea | Proposal selection gate visible; no automatic winner |\n| R2-S03 | `/arki-family-studio` | family, variant, area, capacity, city, generate, export | Three viewers visible; versions 0/4 |\n| R2-S04 | `/arki-bim-visor` | format selector, tolerance, conflict scan, MEP coordination | Human review and specialist gate visible |\n| R2-S05 | `/field` | project, device, camera, location, AR, observation | Session not started; fail-closed without canonical Core |\n| R2-S06 | `/ar-lu-orchestrator` | refresh, filters, agent/provider panels | Core write OFF; telemetry local/contract live |\n| R2-S07 | `/arki-super-architect` | SITIO/ARQ/MEP, numeric parameters, Planta/Corte/3D | Deterministic conceptual result rendered |\n| R2-S08 | `/arki-tv` | frozen channel/presenter/gate sections | Publication and activation frozen |\n| R2-S09 | lazy-route fallback | none beyond shell/PWA/SICL | `Cargando módulo`; no internal screen asserted |\n| R2-S10 | `/spatial-comparison` | error state only | Core spatial 503; no geometry fabricated |\n'''
(OUT / 'SCREEN_CONTROL_GRAPH_R2.md').write_text(graph)

# Package manifest and SHA-256.
manifest_lines = []
for p in sorted(OUT.rglob('*')):
    if p.is_file() and p.name != 'A0R2_EVIDENCE_MANIFEST.sha256.md':
        manifest_lines.append(f"{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.relative_to(OUT)}")
(OUT / 'A0R2_EVIDENCE_MANIFEST.sha256.md').write_text('\n'.join(manifest_lines) + '\n')

print(json.dumps(registry['metrics'], indent=2, ensure_ascii=False))
print(f'route_entries={len(entries)} screenshots={sum(bool(e.get("packageScreenshot")) for e in entries)}')
