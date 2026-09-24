from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path('/home/ubuntu/sicl-web')
BASE = ROOT / 'docs/arki-ui-governance-001/A0'
REVIEW = BASE / 'PO_VISUAL_REVIEW'
SCREENS = REVIEW / 'screens'
EVIDENCE = BASE / 'evidence/screens'
SCREENSHOT_ROOT = Path('/home/ubuntu/screenshots')

ROUTES = [
    ('/', 'HashWorkspaceRoute'), ('/404', 'NotFound'), ('/ar-lu-orchestrator', 'ArLuOrchestratorPage'),
    ('/arki', 'HashWorkspaceRoute'), ('/arki-bim-visor', 'ArkiBimViewerPage'), ('/arki-book', 'ArkiBookPage'),
    ('/arki-design-funnel', 'ArkiDesignFunnelPage'), ('/arki-device-bridge', 'ArkiDeviceInteroperabilityPage'),
    ('/arki-family-studio', 'ArkiFamilyStudioPage'), ('/arki-generator', 'ArkiGeneratorPage'),
    ('/arki-host-connections', 'ArkiHostConnectionsPage'), ('/arki-marketplace', 'ArkiMarketplacePage'),
    ('/arki-operations', 'ArkiOperationsPage'), ('/arki-parametric-runtime', 'ArkiParametricRuntimePage'),
    ('/arki-research-review', 'ArkiResearchReviewPage'), ('/arki-self-care', 'ArkiSelfCarePage'),
    ('/arki-super-architect', 'ArkiSuperArchitectViewerPage'), ('/arki-tv', 'ArkiTvPage'),
    ('/audit', 'AuditRoute'), ('/comparisons', 'ComparisonsPage'), ('/control-center', 'ArkiControlCenterPage'),
    ('/evaluations', 'EvaluationsPage'), ('/evidence', 'EvidencePage'), ('/federated-handoffs', 'FederatedHandoffInboxPage'),
    ('/field', 'FieldModePage'), ('/help', 'HelpPage'), ('/help/commands', 'HelpArticlePage'),
    ('/help/operations', 'HelpArticlePage'), ('/help/user', 'HelpArticlePage'), ('/luka-control-center', 'LucaControlCenterPage'),
    ('/multiobjective', 'MultiobjectivePage'), ('/parametric-files', 'ParametricFilesPage'),
    ('/security-events', 'SecurityEventsPage'), ('/sources', 'SourceLibraryPage'), ('/spatial', 'SpatialViewerPage'),
    ('/spatial-comparison', 'SpatialComparisonPage'),
    ('UNKNOWN_FALLBACK', 'NotFound'), ('UNKNOWN_FALLBACK', 'UNKNOWN_COMPONENT'),
]

CAPTURES = [
    {
        'screenId': 'SCREEN-SHELL-001',
        'area': 'Global bootstrap',
        'route': '/',
        'state': 'LOADING_BLOCKED',
        'source': SCREENSHOT_ROOT / '3002-ioq0m1fmtd5iqzz_2026-09-24_21-45-54_2557.webp',
        'filename': 'SCREEN-SHELL-001__root-loading.webp',
        'observations': ['ARKI wordmark and Cargando Architectural Intelligence Workspace… are visible.', 'No route controls are exposed.', 'The page remains in the bootstrap shell.'],
        'visualIssues': ['LOADING_STATE_WEAK', 'PRIMARY_OBJECT_UNCLEAR', 'ARCHITECTURAL_CONTENT_TOO_SMALL'],
    },
    {
        'screenId': 'SCREEN-DF-001',
        'area': 'Design Funnel',
        'route': '/arki-design-funnel',
        'state': 'LOADING_BLOCKED',
        'source': SCREENSHOT_ROOT / '3002-ioq0m1fmtd5iqzz_2026-09-24_21-46-16_8699.webp',
        'filename': 'SCREEN-DF-001__design-funnel-loading.webp',
        'observations': ['The route does not reach the Design Funnel surface.', 'No proposals, cost panel, architecture panel, or inspector are visible.'],
        'visualIssues': ['LOADING_STATE_WEAK', 'ARCHITECTURAL_CONTENT_TOO_SMALL'],
    },
    {
        'screenId': 'SCREEN-CC-001',
        'area': 'Control Center',
        'route': '/control-center',
        'state': 'LOADING_BLOCKED',
        'source': None,
        'filename': None,
        'observations': ['Navigation returned the same global loading shell.', 'No raw screenshot path was exposed by the browser capture result for this navigation.'],
        'visualIssues': ['LOADING_STATE_WEAK', 'PRIMARY_ACTION_UNCLEAR'],
    },
    {
        'screenId': 'SCREEN-GEN-001',
        'area': 'Parametric Generator',
        'route': '/arki-generator',
        'state': 'LOADING_BLOCKED',
        'source': SCREENSHOT_ROOT / '3002-ioq0m1fmtd5iqzz_2026-09-24_21-48-07_1019.webp',
        'filename': 'SCREEN-GEN-001__generator-loading.webp',
        'observations': ['The route does not reach the generator controls.', 'No family, variant, parameter, or export controls are visible.'],
        'visualIssues': ['LOADING_STATE_WEAK', 'PRIMARY_ACTION_UNCLEAR'],
    },
]


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def main() -> None:
    for directory in (REVIEW, SCREENS, EVIDENCE):
        directory.mkdir(parents=True, exist_ok=True)

    copied = []
    for capture in CAPTURES:
        if capture['source'] and capture['source'].is_file():
            target = SCREENS / capture['filename']
            shutil.copy2(capture['source'], target)
            evidence_target = EVIDENCE / capture['filename']
            shutil.copy2(capture['source'], evidence_target)
            capture['sha256'] = sha256(target)
            capture['bytes'] = target.stat().st_size
            copied.append(target)
        else:
            capture['sha256'] = None
            capture['bytes'] = None

    registry = []
    for path, component in ROUTES:
        matching = next((c for c in CAPTURES if c['route'] == path), None)
        if matching:
            registry.append({
                'screenId': matching['screenId'], 'area': matching['area'], 'route': path,
                'component': component, 'state': matching['state'],
                'viewport': {'width': 1280, 'height': 720, 'browser': 'Manus Browser', 'devicePixelRatio': None},
                'activeEntity': None, 'visiblePanels': [], 'relatedControls': [],
                'screenshot': f"screens/{matching['filename']}" if matching['filename'] else None,
                'runtimeVerified': True, 'observations': matching['observations'],
                'visualIssues': matching['visualIssues'],
                'unknowns': ['Bootstrap prevented route content from mounting.'],
            })
        else:
            registry.append({
                'screenId': None, 'area': None, 'route': path, 'component': component,
                'state': 'NOT_CAPTURED_BOOTSTRAP_BLOCKED',
                'viewport': {'width': 1280, 'height': 720, 'browser': 'Manus Browser', 'devicePixelRatio': None},
                'activeEntity': None, 'visiblePanels': [], 'relatedControls': [], 'screenshot': None,
                'runtimeVerified': False,
                'observations': ['Not captured because the global bootstrap shell remained active during the A0-V run.'],
                'visualIssues': [],
                'unknowns': ['Route-specific UI could not be inspected without a product repair, which is outside A0-V.'],
            })

    (REVIEW / 'UI_SCREEN_REGISTRY.json').write_text(json.dumps({
        'contract': 'ARKI-UI-GOVERNANCE-001.A0-V',
        'mode': 'AUDIT_ONLY_READ_ONLY_NO_PRODUCT_FIXES',
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'routeCount': len(ROUTES),
        'reachableScreensCaptured': len(CAPTURES),
        'rawScreenshotsPreserved': len(copied),
        'globalBlocker': 'Bootstrap remained at Cargando Architectural Intelligence Workspace…',
        'screens': registry,
    }, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')

    lines = [
        '# UI Visual Review Matrix — A0-V', '',
        '> **Mode:** audit-only, read-only. No visual or product repair was performed.', '',
        '| Screen ID | Area | Route | State | Screenshot | Purpose | Visible result | Visual issues |',
        '|---|---|---|---|---|---|---|---|',
    ]
    for c in CAPTURES:
        shot = f"[open](screens/{c['filename']})" if c['filename'] else 'NOT_AVAILABLE'
        lines.append(f"| {c['screenId']} | {c['area']} | `{c['route']}` | {c['state']} | {shot} | Verify current route surface | {' '.join(c['observations'])} | {', '.join(c['visualIssues'])} |")
    lines += ['', '## Coverage', '', f'- Total routes discovered: **{len(ROUTES)}**.', f'- Route surfaces with authentic visual evidence: **{len(CAPTURES)}**.', f'- Raw screenshots preserved: **{len(copied)}**.', f'- Routes not captured: **{len(ROUTES) - len(CAPTURES)}**.', '- Reason: the same global bootstrap loading shell remained active; capturing route-specific controls would require a repair and would violate A0-V.', '']
    (REVIEW / 'UI_VISUAL_REVIEW_MATRIX.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')

    atlas = ['# ARKI UI Visual Atlas — A0-V', '', '> This atlas records what was actually observable during the run. It does not represent the intended or designed UI.', '', '## Global finding', '', 'The browser reached the ARKI shell at the temporary preview URL, but the application remained at **“Cargando Architectural Intelligence Workspace…”**. The same result was observed for `/`, `/arki-design-funnel`, `/control-center`, and `/arki-generator`. No route-specific controls were visible, and the browser console contained no output during the check.', '', '## Captured screens', '']
    for c in CAPTURES:
        atlas += [f"### {c['screenId']} — {c['area']}", '', f"- Route: `{c['route']}`", f"- State: `{c['state']}`", f"- Screenshot: `{('screens/' + c['filename']) if c['filename'] else 'not available'}`", '- Visible controls: none.', f"- Observed visual problems: {', '.join(c['visualIssues'])}.", f"- Notes: {' '.join(c['observations'])}", '']
    atlas += ['## Uncaptured product surfaces', '', f'{len(ROUTES) - len(CAPTURES)} of the {len(ROUTES)} inventoried routes were not captured as route-specific screens. They remain `NOT_CAPTURED_BOOTSTRAP_BLOCKED` in `UI_SCREEN_REGISTRY.json`. No screenshot was manufactured for them.', '']
    (REVIEW / 'ARKI_UI_VISUAL_ATLAS.md').write_text('\n'.join(atlas) + '\n', encoding='utf-8')

    index = ['# Product Owner Visual Review — A0-V', '', 'This package is a partial, evidence-based visual baseline captured before any repair wave.', '', '## Package contents', '', '- `ARKI_UI_VISUAL_ATLAS.md` — visual findings and route coverage.', '- `UI_VISUAL_REVIEW_MATRIX.md` — screen-by-screen review matrix.', '- `UI_SCREEN_REGISTRY.json` — stable screen/state registry.', '- `ARKI_UI_VISUAL_CONTACT_SHEET.pdf` — contact sheet of the authentic screenshots captured.', '- `screens/` — raw screenshots preserved from the browser.', '', '## Coverage result', '', f'- Routes inventoried: **{len(ROUTES)}**.', f'- Screen states captured: **{len(CAPTURES)}**.', f'- Raw screenshots preserved: **{len(copied)}**.', f'- Route-specific screens not captured: **{len(ROUTES) - len(CAPTURES)}**.', '- Global blocker: application remained on the bootstrap loading shell.', '', '## Audit boundary', '', 'No UI redesign, code repair, state fabrication, control renaming, spacing change, or deletion was performed. Human authority remains final.', '']
    (REVIEW / '00_VISUAL_INDEX.md').write_text('\n'.join(index) + '\n', encoding='utf-8')

    contact_md = ['# ARKI UI Visual Contact Sheet — A0-V', '', 'Viewport: 1280×720. Browser: Manus Browser. These are the authentic screenshots captured during the audit.', '']
    for c in CAPTURES:
        if c['filename']:
            contact_md += [f"## {c['screenId']} — {c['route']}", '', f"![{c['screenId']}](screens/{c['filename']})", '']
    (REVIEW / 'ARKI_UI_VISUAL_CONTACT_SHEET.md').write_text('\n'.join(contact_md) + '\n', encoding='utf-8')

    manifest = []
    for path in sorted(REVIEW.rglob('*')):
        if path.is_file() and path.name != 'A0V_EVIDENCE_MANIFEST.sha256.md':
            manifest.append(f"{sha256(path)}  {path.relative_to(REVIEW)}")
    (REVIEW / 'A0V_EVIDENCE_MANIFEST.sha256.md').write_text('\n'.join(manifest) + '\n', encoding='utf-8')

    print(json.dumps({'routes': len(ROUTES), 'captured': len(CAPTURES), 'rawScreenshots': len(copied), 'reviewDir': str(REVIEW)}, indent=2))


if __name__ == '__main__':
    main()
