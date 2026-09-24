from __future__ import annotations

import json
import re
import hashlib
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path('/home/ubuntu/sicl-web')
OUT = ROOT / 'docs' / 'arki-ui-governance-001' / 'A0'
OUT.mkdir(parents=True, exist_ok=True)

ROUTE_RE = re.compile(r'<Route path=\{["\']([^"\']+)["\']\}[^>]*>(?:\{\(\) => )?\s*<([A-Za-z0-9_]+)')
ROUTE_COMPONENT_RE = re.compile(r'<Route path=\{["\']([^"\']+)["\']\} component=\{?([A-Za-z0-9_]+)')
CONTROL_RE = re.compile(r'<(Button|button|Link|a|Select|Checkbox|Switch|Slider|Input|Textarea|TabsTrigger|DropdownMenuItem|DialogTrigger|AccordionTrigger|Card|div)[\s>]')
HANDLER_RE = re.compile(r'on(?:Click|Change|Submit|Select|ValueChange|CheckedChange|OpenChange|Input|KeyDown|KeyUp|PointerDown|PointerUp|Drop|DragOver)\s*=')
HIGH_RISK_RE = re.compile(r'(?i)(delete|publish|commit|approve|reject|overwrite|recalcul|propagat|export|import|upload|convert|save|archive|promot|select|reset|retry|refresh|sign|firm|mutation)')
PLACEHOLDER_RE = re.compile(r'(?i)(TODO|FIXME|placeholder|mock|demo|stub|fake|temporary|coming soon|not implemented|sample|synthetic)')
SUCCESS_RE = re.compile(r'(?i)(guardado|completado|publicado|aplicado|actualizado|exportado|generado|éxito|success|saved|done|published)')

# Runtime acceptance evidence recorded previously for this A0 audit. No action is executed here.
RUNTIME_EVIDENCE = {
    'ArkiDesignFunnelPage.tsx': {'Planta', '3D', 'Corte', 'Programa', 'P1', 'P4', 'P9', 'P16'},
}


def label_from_line(line: str) -> str:
    text = re.sub(r'<[^>]+>', ' ', line)
    text = re.sub(r'\{[^}]*\}', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text[:180] or 'UNKNOWN'


def area_for(path: Path) -> str:
    name = path.stem
    if name == 'ArkiDesignFunnelPage': return 'DESIGN_FUNNEL'
    if 'ControlCenter' in name or 'Operations' in name: return 'CONTROL_CENTER'
    if 'Viewer' in name or 'Spatial' in name or 'Generator' in name or 'FamilyStudio' in name or 'Parametric' in name: return 'VIEWER_PARAMETRIC'
    if 'Bim' in name or 'Host' in name or 'Device' in name: return 'BIM_INTEROPERABILITY'
    if 'Luca' in name or 'ArLu' in name or 'Federated' in name: return 'AR_LU'
    if 'Security' in name or 'SelfCare' in name: return 'SECURITY_GOVERNANCE'
    if 'Help' in name or 'Book' in name or 'Research' in name or 'Source' in name: return 'KNOWLEDGE_HELP'
    if name in {'Home', 'ProjectWorkspace'}: return 'WORKSPACE'
    if 'Field' in name or 'Tv' in name: return 'FIELD_MEDIA'
    return 'OTHER'


def route_map() -> dict[str, str]:
    text = (ROOT / 'client/src/App.tsx').read_text(errors='replace')
    result: dict[str, str] = {}
    for raw_line in text.splitlines():
        if '<Route' not in raw_line:
            continue
        path_match = re.search(r'<Route\s+path=\{["\']([^"\']+)["\']\}', raw_line)
        path = path_match.group(1) if path_match else 'UNKNOWN_FALLBACK'
        component_match = re.search(r'component=\{?([A-Za-z0-9_]+)', raw_line)
        if component_match:
            component = component_match.group(1)
        else:
            names = re.findall(r'<([A-Z][A-Za-z0-9_]*(?:Page|Route))\b', raw_line)
            component = names[-1] if names else 'UNKNOWN_COMPONENT'
        result[f'{component}@{path}'] = path
    return result


def primary_status(line: str, has_handler: bool, is_control: bool) -> str:
    if not is_control: return 'UNKNOWN_UNVERIFIED'
    if 'disabled' in line and ('true' in line or 'disabled' in line): return 'DISABLED_WITH_REASON'
    if has_handler: return 'UNKNOWN_UNVERIFIED'
    if re.search(r'<(Button|button|Link|a|Select|Checkbox|Switch|Slider|Input|Textarea|TabsTrigger|DropdownMenuItem|DialogTrigger|AccordionTrigger)', line):
        return 'UNKNOWN_UNVERIFIED'
    return 'UNKNOWN_UNVERIFIED'


def main() -> None:
    routes = route_map()
    controls: list[dict] = []
    counters = Counter()
    source_files = sorted((ROOT / 'client/src').rglob('*.tsx'))
    index = 0
    for path in source_files:
        rel = path.relative_to(ROOT).as_posix()
        if '/ui/' in rel and path.name not in {'button.tsx'}:
            # Shared primitives are still included when they contain behavior, but are marked as component-level sources.
            pass
        lines = path.read_text(errors='replace').splitlines()
        area = area_for(path)
        route = routes.get(path.stem, 'UNKNOWN')
        for lineno, line in enumerate(lines, 1):
            has_handler = bool(HANDLER_RE.search(line))
            matches = list(CONTROL_RE.finditer(line))
            # Also record standalone handler lines that do not contain an opening control tag.
            if matches:
                for match in matches:
                    tag = match.group(1)
                    if tag == 'div' and 'role="button"' not in line and 'onClick' not in line and not has_handler:
                        continue
                    index += 1
                    label = label_from_line(line)
                    runtime = any(token.lower() in line.lower() for token in RUNTIME_EVIDENCE.get(path.name, set()))
                    high = bool(HIGH_RISK_RE.search(line))
                    placeholder = bool(PLACEHOLDER_RE.search(line))
                    success = bool(SUCCESS_RE.search(line))
                    aid = f'UI-{area[:3]}-{index:04d}'
                    controls.append({
                        'auditId': aid, 'area': area, 'route': route, 'component': path.stem,
                        'label': label, 'type': tag, 'source': f'{rel}:{lineno}',
                        'visibleCondition': 'SOURCE_VISIBLE_CONDITION_UNKNOWN',
                        'enabledCondition': 'SOURCE_ENABLED_CONDITION_UNKNOWN',
                        'handler': 'PRESENT_ON_LINE' if has_handler else 'NOT_FOUND_ON_LINE',
                        'action': 'SOURCE_ACTION_UNKNOWN', 'authority': 'UNKNOWN',
                        'stateImpact': 'UNKNOWN', 'dependency': 'UNKNOWN', 'feedback': 'UNKNOWN',
                        'persistence': 'UNKNOWN', 'primaryStatus': primary_status(line, has_handler, True),
                        'secondaryTags': (["HIGH_RISK_CANDIDATE"] if high else []) + (["PLACEHOLDER_TERMS_PRESENT"] if placeholder else []) + (["SUCCESS_MESSAGE_CANDIDATE"] if success else []),
                        'severity': None, 'sourceVerified': True, 'runtimeVerified': runtime,
                        'evidence': [], 'unknowns': ['Runtime outcome and persistence require control-specific evidence.'],
                    })
                    counters['TOTAL_DISCOVERED'] += 1
                    counters[f'AREA:{area}'] += 1
                    counters['TOTAL_RUNTIME_REACHABLE' if runtime else 'TOTAL_SOURCE_ONLY'] += 1
                    if high: counters['HIGH_RISK_CANDIDATES'] += 1
            elif has_handler:
                index += 1
                aid = f'UI-{area[:3]}-{index:04d}'
                controls.append({
                    'auditId': aid, 'area': area, 'route': route, 'component': path.stem,
                    'label': label_from_line(line), 'type': 'HANDLER_ONLY', 'source': f'{rel}:{lineno}',
                    'visibleCondition': 'UNKNOWN', 'enabledCondition': 'UNKNOWN', 'handler': 'PRESENT_ON_LINE',
                    'action': 'SOURCE_ACTION_UNKNOWN', 'authority': 'UNKNOWN', 'stateImpact': 'UNKNOWN',
                    'dependency': 'UNKNOWN', 'feedback': 'UNKNOWN', 'persistence': 'UNKNOWN',
                    'primaryStatus': 'UNKNOWN_UNVERIFIED', 'secondaryTags': [], 'severity': None,
                    'sourceVerified': True, 'runtimeVerified': False, 'evidence': [],
                    'unknowns': ['Handler requires associated control reconciliation.'],
                })
                counters['TOTAL_DISCOVERED'] += 1
                counters[f'AREA:{area}'] += 1
                counters['TOTAL_SOURCE_ONLY'] += 1

    # Enrich every record with explicit audit dimensions. These are evidence fields,
    # not claims about product behavior; UNKNOWN is intentional until runtime proof exists.
    for control in controls:
        control.update({
            'purpose': 'UNKNOWN', 'userGoal': 'UNKNOWN', 'targetRoute': control['route'],
            'targetComponent': control['component'], 'handlerSymbol': 'UNKNOWN', 'eventName': 'UNKNOWN',
            'interactionType': control['type'], 'requestMethod': 'UNKNOWN', 'endpoint': 'UNKNOWN',
            'requestPayload': 'UNKNOWN', 'responseContract': 'UNKNOWN', 'errorContract': 'UNKNOWN',
            'loadingState': 'UNKNOWN', 'successState': 'UNKNOWN', 'failureState': 'UNKNOWN',
            'optimisticUpdate': 'UNKNOWN', 'rollbackStrategy': 'UNKNOWN', 'sourceOfTruth': 'UNKNOWN',
            'projectScope': 'UNKNOWN', 'userScope': 'UNKNOWN', 'tenantScope': 'UNKNOWN',
            'authRequired': 'UNKNOWN', 'rolesAllowed': 'UNKNOWN', 'humanGate': 'UNKNOWN',
            'coreMutation': 'UNKNOWN', 'projectStateMutation': 'UNKNOWN', 'auditEvent': 'UNKNOWN',
            'idempotency': 'UNKNOWN', 'concurrency': 'UNKNOWN', 'offlineBehavior': 'UNKNOWN',
            'retryBehavior': 'UNKNOWN', 'externalService': 'UNKNOWN', 'browserApi': 'UNKNOWN',
            'fileInput': 'UNKNOWN', 'fileOutput': 'UNKNOWN', 'localeKey': 'UNKNOWN',
            'accessibilityName': 'UNKNOWN', 'keyboardPath': 'UNKNOWN', 'focusBehavior': 'UNKNOWN',
            'ariaState': 'UNKNOWN', 'screenReaderText': 'UNKNOWN', 'visualFeedback': 'UNKNOWN',
            'telemetry': 'UNKNOWN', 'privacyClassification': 'UNKNOWN', 'securityLevel': 'UNKNOWN',
            'testId': 'UNKNOWN', 'fixture': 'UNKNOWN', 'testStatus': 'NOT_RUN',
            'runtimeEvidence': 'NONE', 'evidenceDate': None, 'defectId': None,
            'owner': 'UNASSIGNED', 'remediation': 'PENDING_EVIDENCE', 'reversible': 'UNKNOWN',
            'confidence': 'LOW_UNTIL_RUNTIME', 'lastObservedVersion': 'UNKNOWN',
        })

    for status in ['TOTAL_FUNCTIONAL', 'TOTAL_DISABLED_WITH_REASON', 'TOTAL_HIDDEN_BY_POLICY', 'TOTAL_NOT_IMPLEMENTED_EXPLICITLY', 'TOTAL_BLOCKED_BY_PERMISSION', 'TOTAL_BLOCKED_BY_DEPENDENCY', 'TOTAL_BROKEN', 'TOTAL_UNKNOWN_UNVERIFIED']:
        counters.setdefault(status, counters['TOTAL_DISCOVERED'] if status == 'TOTAL_UNKNOWN_UNVERIFIED' else 0)

    registry = {
        'contract': 'ARKI-UI-GOVERNANCE-001.A0',
        'mode': 'AUDIT_ONLY_READ_ONLY_NO_PRODUCT_FIXES',
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'repository': 'YvanCastilloQuezada/sicl-web',
        'branch': 'feature/arki-native-generator-v1',
        'head': 'd22e71ddba8d610ddca1f0a3ae38381ee5062de5',
        'routeCount': len(routes), 'routes': [{'path': p, 'component': c.split('@', 1)[0]} for c, p in sorted(routes.items(), key=lambda x: x[1])],
        'counts': dict(counters), 'controls': controls,
        'classificationPolicy': 'Conservative: source presence does not imply runtime functionality; unknown is preserved until direct evidence exists.',
    }
    reg_path = OUT / '06_UI_ACTION_REGISTRY.json'
    reg_path.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + '\n')

    # Human matrix
    matrix = ['# UI Action Matrix — A0', '', f'Generated from source discovery. **{len(controls)} control occurrences** were inventoried. Source discovery is not proof of runtime functionality.', '', '| ID | AREA | CONTROL | PURPOSE | SOURCE PATH | RUNTIME | AUTHORITY | STATE IMPACT | STATUS | DEFECT | EVIDENCE |', '|---|---|---|---|---|---|---|---|---|---|---|']
    for c in controls:
        defect = '; '.join(c['secondaryTags']) or 'NONE_RECORDED'
        matrix.append(f"| {c['auditId']} | {c['area']} | {c['label'].replace('|','/')} | UNKNOWN | `{c['source']}` | {'YES' if c['runtimeVerified'] else 'NO'} | {c['authority']} | {c['stateImpact']} | {c['primaryStatus']} | {defect} | SOURCE_ONLY |")
    (OUT / '05_UI_ACTION_MATRIX.md').write_text('\n'.join(matrix) + '\n')

    # Route map
    route_lines = ['# Route Map — A0', '', '| Route | Component | Reachability evidence | Auth | Runtime status |', '|---|---|---|---|---|']
    for component_key, path in sorted(routes.items(), key=lambda x: x[1]):
        route_lines.append(f'| `{path}` | `{component_key.split("@", 1)[0]}` | Route declared in `client/src/App.tsx` | UNKNOWN | UNKNOWN_UNVERIFIED |')
    (OUT / '03_ROUTE_MAP.md').write_text('\n'.join(route_lines) + '\n')

    print(json.dumps({'registry': str(reg_path), 'controls': len(controls), 'routes': len(routes), 'counts': dict(counters)}, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
