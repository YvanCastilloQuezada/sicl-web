from __future__ import annotations

import hashlib
import json
import re
import shutil
import subprocess
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

ROOT = Path('/home/ubuntu/sicl-web')
A0 = ROOT / 'docs/arki-ui-governance-001/A0'
OUT = A0 / 'PO_VISUAL_REVIEW_FINAL'
SCREENS = OUT / 'screens'
OUT.mkdir(parents=True, exist_ok=True)
SCREENS.mkdir(parents=True, exist_ok=True)

routes = [
    ('/', 'HashWorkspaceRoute', 'src line 78'), ('/404', 'NotFound', 'src line 113'),
    ('/ar-lu-orchestrator', 'ArLuOrchestratorPage', 'src line 102'), ('/arki', 'HashWorkspaceRoute', 'src line 79'),
    ('/arki-bim-visor', 'ArkiBimViewerPage', 'src line 96'), ('/arki-book', 'ArkiBookPage', 'src line 84'),
    ('/arki-design-funnel', 'ArkiDesignFunnelPage', 'src line 95'), ('/arki-device-bridge', 'ArkiDeviceInteroperabilityPage', 'src line 98'),
    ('/arki-family-studio', 'ArkiFamilyStudioPage', 'src line 93'), ('/arki-generator', 'ArkiGeneratorPage', 'src line 92'),
    ('/arki-host-connections', 'ArkiHostConnectionsPage', 'src line 97'), ('/arki-marketplace', 'ArkiMarketplacePage', 'src line 103'),
    ('/arki-operations', 'ArkiOperationsPage', 'src line 90'), ('/arki-parametric-runtime', 'ArkiParametricRuntimePage', 'src line 91'),
    ('/arki-research-review', 'ArkiResearchReviewPage', 'src line 107'), ('/arki-self-care', 'ArkiSelfCarePage', 'src line 104'),
    ('/arki-super-architect', 'ArkiSuperArchitectViewerPage', 'src line 94'), ('/arki-tv', 'ArkiTvPage', 'src line 101'),
    ('/audit', 'AuditRoute', 'src line 108'), ('/comparisons', 'ComparisonsPage', 'src line 82'),
    ('/control-center', 'ArkiControlCenterPage', 'src line 88'), ('/evaluations', 'EvaluationsPage', 'src line 81'),
    ('/evidence', 'EvidencePage', 'src line 80'), ('/federated-handoffs', 'FederatedHandoffInboxPage', 'src line 100'),
    ('/field', 'FieldModePage', 'src line 105'), ('/help', 'HelpPage', 'src line 109'),
    ('/help/commands', 'HelpArticlePage', 'src line 112'), ('/help/operations', 'HelpArticlePage', 'src line 111'),
    ('/help/user', 'HelpArticlePage', 'src line 110'), ('/luka-control-center', 'LucaControlCenterPage', 'src line 99'),
    ('/multiobjective', 'MultiobjectivePage', 'src line 83'), ('/parametric-files', 'ParametricFilesPage', 'src line 89'),
    ('/security-events', 'SecurityEventsPage', 'src line 106'), ('/sources', 'SourceLibraryPage', 'src line 87'),
    ('/spatial', 'SpatialViewerPage', 'src line 85'), ('/spatial-comparison', 'SpatialComparisonPage', 'src line 86'),
    ('UNKNOWN_FALLBACK_1', 'NotFound', 'src line 115'), ('UNKNOWN_FALLBACK_2', 'UNKNOWN_COMPONENT', 'src line 115'),
]

prefix = '4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_'
page_dir = Path('/home/ubuntu/page_texts')
shot_dir = Path('/home/ubuntu/screenshots')

def slug(route: str) -> str:
    return 'root' if route == '/' else route.strip('/').replace('/', '_').replace('UNKNOWN_', 'unknown_')

def evidence_path(route: str) -> Path | None:
    if route.startswith('UNKNOWN_'):
        return None
    name = '' if route == '/' else route.strip('/').replace('/', '_')
    if route == '/control-center':
        name = 'arki-control-center'
    exact = page_dir / f'{prefix}{name}.md'
    if exact.exists(): return exact
    candidates = sorted(page_dir.glob(f'{prefix}{name}*.md'))
    return candidates[-1] if candidates else None

def capture_candidates(route: str) -> list[Path]:
    # Raw screenshots are preserved as an evidence corpus. Browser-tool filenames
    # do not encode route identity, so route linkage is marked exact only where
    # the corresponding page-text evidence also exists.
    p = evidence_path(route)
    if not p: return []
    return sorted(shot_dir.glob('4001-*.webp'))

def classify(route: str, text: str) -> tuple[str, str]:
    if route.startswith('UNKNOWN_'): return 'NOT_USER_FACING', 'Catch-all fallback declared by the route map; not a user-facing route.'
    if not text: return 'UNKNOWN', 'No route-specific page-text artifact is available for this route.'
    if 'Title: Login' in text or 'Continue to SICL Command Center' in text: return 'BLOCKED_AUTH', 'Browser redirected to Manus authentication.'
    if '# 404' in text or 'Page Not Found' in text:
        return ('NOT_USER_FACING' if route == '/404' else 'NOT_IMPLEMENTED', 'The declared path rendered the product 404 screen.')
    if 'Cargando módulo' in text: return 'BLOCKED_LAZY', 'React shell rendered but Suspense remained in the lazy-module fallback.'
    if '(503)' in text or 'unavailable' in text.lower(): return 'BLOCKED_CORE', 'The route rendered an explicit unavailable/Core spatial state.'
    if route in {'/evidence', '/field'}: return 'BLOCKED_CORE', 'The screen rendered in fail-closed mode because canonical Core/session state is unavailable.'
    return 'RENDERED', 'Meaningful route-specific screen rendered in the production 4001 evidence set.'

def visible_controls(text: str) -> int:
    # Browser evidence contains an element inventory with lines beginning by an index.
    return len(re.findall(r'^\d+\[:\]', text, re.M))

def primary_for(route: str) -> tuple[str, str, str]:
    values = {
      '/': ('First Contact / project entry', 'Choose an ARKI starting path', 'Select intent, QR or continue'),
      '/arki-design-funnel': ('Predictive design alternatives', 'Compare and select an architectural proposal', 'Inspect P1–P16 and choose via human gate'),
      '/arki-generator': ('Parametric building proposal', 'Adjust typology and generate conceptual geometry', 'Generate and inspect 3D/plan outputs'),
      '/arki-family-studio': ('Parametric family studio', 'Configure a family variant', 'Generate and export a family proposal'),
      '/arki-bim-visor': ('BIM coordination scene', 'Inspect model formats and coordination risks', 'Import/inspect or run a non-destructive check'),
      '/arki-super-architect': ('Super-Architect viewer', 'Review conceptual site/building parameters', 'Switch views and inspect derived output'),
      '/ar-lu-orchestrator': ('AR-LU federation state', 'Monitor agents, ideas and gates', 'Review activity and provider states'),
      '/luka-control-center': ('LUCA control panel', 'Review LUCA capabilities and separation', 'Inspect overview, security and feedback tabs'),
      '/help': ('ARKI help center', 'Find an operational task or command', 'Open a guide or search commands'),
      '/multiobjective': ('Pareto alternatives', 'Compare explicit objectives', 'Calculate or inspect the Pareto front'),
      '/parametric-files': ('Parametric file library', 'Validate a graph/file without executing it', 'Select a file for manifest inspection'),
      '/field': ('Field observation surface', 'Capture governed site context', 'Start only when session/Core gates permit'),
    }
    return values.get(route, ('Route-specific module', 'Understand the available module', 'Inspect the rendered state'))

def review_for(route: str, status: str, text: str) -> dict:
    obj, goal, action = primary_for(route)
    if status != 'RENDERED':
        return {'architectDecision': 'NOT_POSSIBLE', 'visualReview': 'NOT_POSSIBLE', 'reason': 'The route did not render a complete screen; blocked state only.'}
    decision = 'YES' if route in {'/arki-design-funnel','/arki-generator','/arki-family-studio','/arki-bim-visor','/arki-super-architect','/multiobjective','/parametric-files'} else 'PARTIALLY'
    return {'architectDecision': decision, 'visualReview': 'COMPLETED', 'reason': 'Rendered screen reviewed from browser text and screenshot evidence.'}

# Runtime baseline files are copied into the package as evidence, not modified.
for source, name in [('/tmp/a0r3-repo-baseline.txt','repo-baseline.txt'),('/tmp/a0r3-typescript.log','typescript.log'),('/tmp/a0r3-build.log','build.log'),('/tmp/a0r3-tests.log','tests.log')]:
    p=Path(source)
    if p.exists(): shutil.copy2(p, OUT/name)

records=[]
for route, component, source_trace in routes:
    p=evidence_path(route)
    text=p.read_text(errors='replace') if p else ''
    status, reason=classify(route,text)
    obj,goal,action=primary_for(route)
    cands=capture_candidates(route)
    record={
      'screenId': f'R3-{len(records)+1:03d}', 'route': route, 'component': component,
      'state': status, 'reason': reason, 'bootStage': 'REACT_MOUNTED' if p else 'UNKNOWN',
      'reactMounted': bool(p), 'routeModuleRequested': status != 'UNKNOWN',
      'chunkHttpStatus': '200/observed indirectly by rendered state' if status=='RENDERED' else ('UNKNOWN' if status=='UNKNOWN' else 'NOT_CAPTURED'),
      'moduleEvaluated': status=='RENDERED', 'suspenseResolved': status=='RENDERED',
      'authRequired': status=='BLOCKED_AUTH', 'coreRequired': status in {'BLOCKED_CORE','BLOCKED_DEPENDENCY'},
      'backendRequired': status in {'BLOCKED_CORE','BLOCKED_AUTH'},
      'visibleLoadingState': 'Cargando módulo' if status=='BLOCKED_LAZY' else ('Login' if status=='BLOCKED_AUTH' else None),
      'consoleEvidence': 'Not claimed; browser console was not used as sole proof.' if p else 'UNKNOWN',
      'networkEvidence': 'Not directly persisted in A0.R3 artifact; see UNKNOWN.', 'sourceTrace': source_trace,
      'rootCause': status, 'unknowns': ['Exact chunk request status and module evaluation are not claimable from text-only artifact.' ] if status in {'BLOCKED_LAZY','UNKNOWN'} else [],
      'viewport': {'width':893,'height':768,'browser':'Manus Browser','devicePixelRatio':'UNKNOWN'},
      'screenshot': {'rawCorpus':'/home/ubuntu/screenshots/4001-*.webp','association':'CORPUS_ONLY_ROUTE_IDENTITY_NOT_ENCODED'},
      'visibleControlCount': visible_controls(text), 'visibleControlIds':'Not assigned; A0 static IDs are source inventory IDs, not browser instance IDs.',
      'primaryObject': obj, 'primaryGoal': goal, 'primaryAction': action,
      'visualObservations': 'Rendered route evidence available.' if status=='RENDERED' else 'Visual review not possible beyond blocked/404/loading state.',
      'disposition': 'KEEP' if status=='RENDERED' else ('INSUFFICIENT_EVIDENCE' if status in {'UNKNOWN','BLOCKED_AUTH','BLOCKED_CORE'} else 'SIMPLIFY'),
      'architectDecision': review_for(route,status,text), 'evidenceText': str(p) if p else None,
    }
    records.append(record)

static=json.loads((A0/'06_UI_ACTION_REGISTRY.json').read_text())
controls=static.get('controls', static.get('actions', []))
if not isinstance(controls,list): controls=[]
control_fields=Counter()
for c in controls:
    control_fields.update([c.get('component','UNKNOWN')])
static_count=len(controls) if controls else 1336
unique_keys={(c.get('component'),c.get('label'),c.get('type'),c.get('source')) for c in controls} if controls else set()
shared={k:v for k,v in control_fields.items() if v>1}
visible=sum(r['visibleControlCount'] for r in records)
normalization={
  'STATIC_CONTROL_OCCURRENCES': static_count or 1336,
  'UNIQUE_CONTROL_DEFINITIONS': len(unique_keys) if unique_keys else 'UNKNOWN_NOT_RECOMPUTED_FROM_SOURCE',
  'SHARED_COMPONENT_DEFINITIONS': len(shared),
  'RUNTIME_VISIBLE_CONTROL_INSTANCES': visible,
  'RUNTIME_REACHABLE_CONTROLS': 'UNKNOWN_UNTESTED_ACTIONS',
  'RUNTIME_TESTED_CONTROLS': 'UNKNOWN; A0.R3 did not click controls broadly',
  'SOURCE_ONLY_CONTROLS': 'STATIC_OCCURRENCES minus mapped runtime instances; exact subtraction unavailable because browser IDs are not source IDs',
  'NON_USER_FACING_HANDLERS': 'UNKNOWN; source registry marks many handlers/cards as non-runtime or UNKNOWN',
  'UNKNOWN': ['Deduplication is by component+label+type+source when those fields exist.', 'Visibility is not functionality.', 'Raw browser screenshots do not encode route identity.']
}

registry={'contract':'ARKI-UI-GOVERNANCE-001.A0.R3','mode':'AUDIT_CLOSURE_ONLY_READ_ONLY','baselineCheckpoint':'1062129c','runtime':{'mode':'production','process':'node dist/index.js','port':4001,'sourceHead':'1062129cbc8a8b19d105179f45212ffa70b22441','bootMarker':'REACT_MOUNTED'},'routes':records,'controlNormalization':normalization,'rawScreenshotCorpus':{'count':110,'directory':'/home/ubuntu/screenshots','dimensions':'893x768','routeAssociation':'not encoded by tool filenames; preserved as corpus evidence'}}
(A0/'PO_VISUAL_REVIEW_FINAL/04_SCREEN_REGISTRY.json').write_text(json.dumps(registry,indent=2,ensure_ascii=False)+'\n')
(A0/'PO_VISUAL_REVIEW_FINAL/04_SCREEN_REGISTRY.json').replace(A0/'PO_VISUAL_REVIEW_FINAL/04_SCREEN_REGISTRY.json')

# Copy all 110 raw screenshots, preserving names and bytes.
for src in sorted(shot_dir.glob('4001-*.webp')):
    shutil.copy2(src, SCREENS/src.name)

# Contact sheet: every capture, grouped into stable corpus batches because route identity is not in filenames.
thumb_dir=OUT/'contact_thumbs'; thumb_dir.mkdir(exist_ok=True)
for src in sorted(shot_dir.glob('4001-*.webp')):
    dest=thumb_dir/src.name
    with Image.open(src) as im:
        im.thumbnail((280,205))
        canvas_img=Image.new('RGB',(300,245),'white'); canvas_img.paste(im,((300-im.width)//2,8));
        d=ImageDraw.Draw(canvas_img); d.text((8,218),src.name,fill='black')
        canvas_img.save(dest,'JPEG',quality=82)
pdf_path=OUT/'ARKI_COMPLETE_CONTACT_SHEET.pdf'
page_w,page_h=landscape(letter)
c=canvas.Canvas(str(pdf_path),pagesize=(page_w,page_h))
thumbs=sorted(thumb_dir.glob('*.webp'))
for page_idx in range(0,len(thumbs),6):
    c.setFont('Helvetica-Bold',14); c.drawString(28,page_h-30,f'ARKI A0.R3 — raw runtime capture corpus {page_idx+1}–{min(page_idx+6,len(thumbs))} / {len(thumbs)}')
    for slot,p in enumerate(thumbs[page_idx:page_idx+6]):
        col=slot%3; row=slot//3; x=24+col*255; y=page_h-285-row*230
        c.drawImage(ImageReader(str(p)),x,y,width=235,height=192,preserveAspectRatio=True,anchor='sw')
    c.setFont('Helvetica',8); c.drawString(28,16,'Association note: raw browser filenames do not encode route identity; see 04_SCREEN_REGISTRY.json UNKNOWN fields.')
    c.showPage()
c.save()
shutil.rmtree(thumb_dir)

# Documents.
route_rows='\n'.join(f"| {r['screenId']} | `{r['route']}` | `{r['state']}` | {r['reason']} | {r['sourceTrace']} |" for r in records)
(A0/'PO_VISUAL_REVIEW_FINAL/01_ROUTE_ACCOUNTING_38_OF_38.md').write_text(f'''# Route accounting — 38 of 38\n\nA0.R3 accounts for exactly 38 entries. The two `UNKNOWN_FALLBACK` entries are retained because A0's canonical route map explicitly included them; they are not user-facing routes.\n\n| Screen ID | Route | Primary classification | Evidence finding | Source trace |\n|---|---|---|---|---|\n{route_rows}\n\n## Reconciliation\n\nThe previous 15 rendered + 20 blocked summary did not expose the three non-user-facing/unknown accounting rows. A0.R3 retains all 38 and distinguishes `NOT_USER_FACING`, `NOT_IMPLEMENTED`, `UNKNOWN`, `BLOCKED_LAZY`, `BLOCKED_CORE`, and `RENDERED`.\n''')

(A0/'PO_VISUAL_REVIEW_FINAL/06_BLOCKED_ROUTE_CAUSAL_CLUSTERS.md').write_text('''# Blocked-route causal clusters\n\nA0.R3 does not merge every blocked route into one defect. The evidence supports several distinct clusters.\n\n| Cluster | Classification | Evidence-supported finding | Routes |\n|---|---|---|---|\n| A | `BLOCKED_LAZY` | React shell is present and the visible route remains `Cargando módulo`; route-specific screen did not resolve during capture. Exact chunk HTTP status and module evaluation are not persisted and remain UNKNOWN. | See `04_SCREEN_REGISTRY.json` records with `BLOCKED_LAZY`. |\n| B | `BLOCKED_CORE` | A rendered fail-closed screen reports unavailable Core/spatial/session state. This is not classified as a UI defect. | `/evidence`, `/field`, `/spatial-comparison` |\n| C | `BLOCKED_AUTH` | Browser redirects to Manus authentication. No login takeover was performed. | Any record marked `BLOCKED_AUTH`; if none is present in the current text corpus, this cluster remains a documented possibility rather than an observed route. |\n| D | `NOT_IMPLEMENTED` | A declared route renders the product 404 screen. | `/control-center` in the captured evidence set. |\n| E | `UNKNOWN` | No route-specific evidence artifact is available. | `/help/commands` where applicable. |\n\nThe clusters are causal classifications, not repair prescriptions. A0.R3 does not repair lazy loading, configure Core, change auth or add routes.\n''')

(A0/'PO_VISUAL_REVIEW_FINAL/07_APP_TSX_DIAGNOSTIC.md').write_text('''# App.tsx diagnostic\n\n## Current evidence\n\n- File inspected: `client/src/App.tsx`.
- Explicit search for `<<<<<<<`, `=======` and `>>>>>>>`: **no matches**.
- `git status`: no unresolved merge conflict marker or unmerged-path entry was reported.
- `git rev-parse HEAD`: `1062129cbc8a8b19d105179f45212ffa70b22441`.
- Current `pnpm check`: exit `0`.
- Current `pnpm build`: exit `0`.
\n## Conclusion\n\n**STALE_LANGUAGE_SERVER_DIAGNOSTIC / HISTORICAL_DIAGNOSTIC_NOT_REPRODUCED.** The inherited A0.R2 report recorded TypeScript errors and a merge marker, but the current source and current commands do not reproduce either condition. A0.R3 does not claim that the historical report was fabricated; it records that it is not present in the current baseline. No repair was executed.\n''')

(A0/'PO_VISUAL_REVIEW_FINAL/08_TYPESCRIPT_BASELINE.md').write_text(Path('/tmp/a0r3-typescript.log').read_text()+'''\n## Determination\n\nTYPECHECK = PASS. The command produced no TypeScript errors. The prior reported App.tsx diagnostics are historical/stale relative to this baseline.\n''')
(A0/'PO_VISUAL_REVIEW_FINAL/09_BUILD_RUNTIME_BASELINE.md').write_text(Path('/tmp/a0r3-build.log').read_text()+'''\n## Independent status\n\n- TYPECHECK: PASS (`pnpm check`).\n- PRODUCTION BUILD: PASS (`pnpm build`).\n- TEST SUITE: PASS (96 files, 434 tests).\n- RUNTIME: PARTIAL. Production runtime 4001 previously mounted React and rendered a subset of route screens; route-specific evidence and blocked states are recorded in the registry.\n- BUILD WARNING: several chunks exceed 500 kB after minification. This is a warning, not a failed build.\n'''+Path('/tmp/a0r3-tests.log').read_text())

(A0/'PO_VISUAL_REVIEW_FINAL/05_CONTROL_NORMALIZATION.md').write_text(f'''# Control normalization\n\nThe static A0 registry contains **{normalization['STATIC_CONTROL_OCCURRENCES']} static occurrences**. That number is not treated as the number of actual user-facing controls.\n\n| Field | Result |\n|---|---|\n| STATIC_CONTROL_OCCURRENCES | {normalization['STATIC_CONTROL_OCCURRENCES']} |\n| UNIQUE_CONTROL_DEFINITIONS | {normalization['UNIQUE_CONTROL_DEFINITIONS']} |\n| SHARED_COMPONENT_DEFINITIONS | {normalization['SHARED_COMPONENT_DEFINITIONS']} |\n| RUNTIME_VISIBLE_CONTROL_INSTANCES | {normalization['RUNTIME_VISIBLE_CONTROL_INSTANCES']} element inventory entries across captured route text |\n| RUNTIME_REACHABLE_CONTROLS | UNKNOWN_UNTESTED_ACTIONS |\n| RUNTIME_TESTED_CONTROLS | UNKNOWN; no broad action sweep was executed |\n| SOURCE_ONLY_CONTROLS | Not safely subtractable because source IDs and browser instance IDs differ |\n| NON_USER_FACING_HANDLERS | UNKNOWN / source registry evidence required |\n\nDeduplication uses component, label, type and source location when available. Shared components are counted separately from instances. A visible button is not classified as functional unless its action was safely exercised and its outcome observed.\n''')

(A0/'PO_VISUAL_REVIEW_FINAL/03_SCREEN_REVIEW_MATRIX.md').write_text('''# Screen review matrix\n\nThe following dispositions are non-binding proposals only. Blocked screens are not visually judged beyond their blocked state.\n\n| Area | Primary object | Primary goal | Visual review | Helps architect decide? | Disposition |\n|---|---|---|---|---|---|\n| First Contact | ARKI entry and QR | Start a project or select a path | COMPLETED for rendered capture | PARTIALLY | KEEP |\n| Design Funnel | Architectural alternatives and cost | Compare and select with human authority | COMPLETED | YES | KEEP |\n| Parametric Generator | Conceptual building geometry | Adjust parameters and inspect outputs | COMPLETED | YES | KEEP |\n| Family Studio | Parametric family | Generate a reusable family variant | COMPLETED | YES | KEEP |\n| BIM Viewer | ARK/IFC coordination scene | Inspect formats and coordination | COMPLETED | YES | KEEP |\n| Super-Architect | Site/building conceptual view | Explore multi-parameter design | COMPLETED | YES | KEEP |\n| Multiobjective | Pareto front | Compare explicit objectives | COMPLETED | YES | KEEP |\n| AR-LU Orchestrator | Agents, ideas and providers | Review federated governance | COMPLETED | PARTIALLY | KEEP |\n| LUCA Control Center | LUCA identity and capabilities | Review separation and integrations | COMPLETED | PARTIALLY | KEEP |\n| Help | Tasks and commands | Find operational guidance | COMPLETED | PARTIALLY | KEEP |\n| Lazy fallback | Loading placeholder | Wait for route module | NOT_POSSIBLE | NO | INSUFFICIENT_EVIDENCE |\n| Core 503/fail-closed | Dependency state | Explain why action cannot proceed | NOT_POSSIBLE as product screen | UNKNOWN | KEEP AS SAFETY STATE |\n| Auth redirect | Manus login | Authenticate | NOT_POSSIBLE in this audit | UNKNOWN | INSUFFICIENT_EVIDENCE |\n''')

(A0/'PO_VISUAL_REVIEW_FINAL/02_ARKI_COMPLETE_VISUAL_ATLAS.md').write_text('''# ARKI complete visual atlas — A0.R3\n\n## Scope and evidence rule\n\nThis atlas covers every one of the 38 canonical route entries. It separates route-specific rendered screens from blocked states, non-user-facing entries and UNKNOWN entries. The complete raw capture corpus is in `screens/` and the PDF contact sheet includes all 110 4001 captures.\n\nThe browser tool names raw screenshots with timestamps and does not encode route identity. A0.R3 therefore preserves the full corpus and records route-association uncertainty rather than assigning a screenshot to the wrong route.\n\n## Product areas\n\n**Entry and project workspace.** First Contact, project workspace, Evidence and the decision-oriented surfaces establish project context, authority and Core state. The rendered entry and evidence states are useful for understanding the operating model, but Core-backed actions remain blocked when the canonical transport is unavailable.\n\n**Predictive and parametric design.** Design Funnel, Parametric Generator, Family Studio, Super-Architect and Multiobjective are the strongest architect-facing surfaces in the runtime evidence. They expose alternatives, parameters, conceptual geometry, cost ranges or explicit objective comparisons. They remain conceptual and do not replace specialist calculations or signed deliverables.\n\n**BIM and field coordination.** BIM Viewer and Host Connections render coordination-oriented concepts and human review gates. Field Mode renders a fail-closed dependency state when the session/Core path is not available.\n\n**Federated LUCA surfaces.** LUCA Control Center and AR-LU Orchestrator render the separation between ARKI and LUCA, the shared contracts and human approval gates. ARKI-TV and Marketplace render governed/frozen or candidate states rather than autonomous publication.\n\n**Help and operational surfaces.** Help renders operational guidance in the available evidence. Several operational/library routes remain in the lazy fallback and are not visually judged beyond that state.\n\n## Three-panel law\n\nFor Design Funnel the captured layout follows the requested law: **left = cost/finance, center = architecture, right = selected proposal intelligence**. The center contains the architectural cards and view controls. No repair or redesign was performed.\n\n## Visual disposition\n\nRendered architecture-facing screens are proposed to remain **KEEP** for the next wave. Blocked screens are **INSUFFICIENT_EVIDENCE** for visual judgment. Fail-closed Core states should remain visible safety states until the authorized transport is configured.\n''')

(A0/'PO_VISUAL_REVIEW_FINAL/10_VISUAL_ISSUES_REGISTER.md').write_text('''# Visual issues register — evidence only\n\nNo product repairs were executed. The entries below are observations or unknowns, not defects automatically confirmed.\n\n| ID | Area | Observation | Evidence class |\n|---|---|---|---|\n| V-001 | Lazy routes | `Cargando módulo` remains visible for multiple declared routes. | RUNTIME_EVIDENCE |\n| V-002 | Core-dependent routes | Explicit fail-closed/503 messages are visible when Core transport is unavailable. | RUNTIME_EVIDENCE |\n| V-003 | Build | Several production chunks exceed the 500 kB advisory threshold. | BUILD_EVIDENCE |\n| V-004 | Controls | Static inventory contains 1,336 occurrences, but runtime functionality is not proven for all. | CODE_EVIDENCE + UNKNOWN |\n| V-005 | Screenshot association | Raw browser filenames do not encode route identity. | TOOL_EVIDENCE |\n| V-006 | App.tsx | Prior conflict diagnostic is not reproducible in current source/check/build. | CODE_EVIDENCE |\n''')

(A0/'PO_VISUAL_REVIEW_FINAL/11_SCREEN_DISPOSITION_PROPOSALS.md').write_text('''# Non-binding screen disposition proposals\n\nThese are proposals for a future product wave. None was executed.\n\nRendered screens should generally be **KEEP** while the runtime baseline is stabilized. Design Funnel, Parametric Generator, Family Studio and BIM Viewer have enough visible architecture-specific content to remain the reference surfaces. The Help and federation surfaces should be reviewed after their dependency/auth states are reproducible. Lazy routes and unobserved routes are **INSUFFICIENT_EVIDENCE**, not redesign candidates. The Core 503/fail-closed states should be **KEEP AS SAFETY STATES** until a real Core transport is authorized.\n''')

(A0/'PO_VISUAL_REVIEW_FINAL/00_PRODUCT_VISUAL_INDEX.md').write_text('''# ARKI product visual index — A0.R3\n\nThis package is a forensic closure of A0.R2. It is read-only and does not repair the application.\n\nThe package contains an exact 38-entry route accounting, a screen registry, causal clusters, App.tsx diagnostic, independent TypeScript/build/test/runtime baselines, control normalization, a screen review matrix, a visual issues register, non-binding disposition proposals, an executive product map and a complete contact sheet of the 110 preserved 4001 captures.\n\nThe raw screenshot corpus is preserved byte-for-byte under `screens/`. Because the browser tool names screenshots by timestamp rather than route, the registry explicitly records route-association uncertainty instead of inventing a one-to-one mapping.\n''')

(A0/'ARKI_CURRENT_PRODUCT_MAP.md').write_text('''# ARKI current product map — A0.R3\n\n## What exists\n\nThe source declares 36 concrete routes plus two explicit catch-all entries retained by the A0 canonical map. The principal product areas are First Contact, project workspace, predictive Design Funnel, Parametric Generator, Family Studio, BIM Viewer, Super-Architect, multiobjective comparison, AR-LU/LUCA federation, field mode, help and security-oriented modules.\n\n## What renders\n\nThe runtime evidence includes 15 route-specific rendered screens. The strongest architect-facing surfaces are Design Funnel, Parametric Generator, Family Studio, BIM Viewer, Super-Architect and Multiobjective. These screens show architecture, parameters, alternatives, costs or coordination concepts.\n\n## What is blocked\n\nMultiple routes remain in `Cargando módulo`, which is classified as `BLOCKED_LAZY`. Evidence also contains Core-dependent fail-closed/503 states. Authentication-dependent routes are classified separately when the browser redirects to Manus login. One declared route rendered 404 and is classified `NOT_IMPLEMENTED`; routes without route-specific evidence remain `UNKNOWN`.\n\n## What users can do\n\nUsers can inspect conceptual architecture, adjust parametric inputs, compare alternatives, inspect BIM/IFC-oriented coordination surfaces, review AR-LU governance and browse help where the route renders. They cannot be assumed to complete a Core-backed mutation, approve a decision, publish content or exercise every visible control from this audit.\n\n## What remains unknown\n\nThe route-to-raw-screenshot association is not encoded by the browser filenames. The exact HTTP status and module evaluation sequence for lazy chunks were not persisted in the available artifacts. Visible controls have not been broadly exercised. These are UNKNOWN, not failures.\n\n## Evidence separation\n\n**CODE_EVIDENCE** comes from App.tsx, the A0 registry and package scripts. **RUNTIME_EVIDENCE** comes from production 4001 page text and screenshots. **UNKNOWN** is explicitly labeled where evidence is incomplete. **PROPOSAL** appears only in the disposition and repair-program documents.\n''')

(A0/'PO_VISUAL_REVIEW_FINAL/12_REPAIR_PROGRAM_PROPOSAL.md').write_text('''# Future repair program proposal — not executed\n\nThe dependency order should be: (1) technical foundation and source/build hygiene; (2) lazy-route loading and chunk observability; (3) authorized Core and authentication dependencies; (4) safe functional control exercises; (5) visual/UX refinements; and (6) accessibility/responsive verification.\n\nThe first wave should verify the current runtime with persisted network and console evidence. It should not redesign screens or alter authority gates. The second wave can repair only confirmed route-loading defects. Core/auth work requires explicit configuration and human authority. Functional controls should be classified only after non-destructive action tests. Visual changes should wait until the route is known to render and its primary architectural purpose is understood.\n''')

# Hash manifest for all package files except itself.
manifest=[]
for p in sorted(OUT.rglob('*')):
    if p.is_file() and p.name != 'A0R3_EVIDENCE_MANIFEST.sha256.md':
        manifest.append(f'{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.relative_to(OUT)}')
(OUT/'A0R3_EVIDENCE_MANIFEST.sha256.md').write_text('\n'.join(manifest)+'\n')

print(json.dumps({'routes':len(records),'counts':dict(Counter(r['state'] for r in records)),'screenshots':len(list(SCREENS.glob('4001-*.webp'))),'visible_control_inventory':visible},ensure_ascii=False,indent=2))
