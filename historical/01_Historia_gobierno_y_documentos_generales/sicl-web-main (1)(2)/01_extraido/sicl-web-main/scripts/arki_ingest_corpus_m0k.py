#!/usr/bin/env python3
"""Ingest ARKI Architectural Knowledge Corpus v0.1 into a safe M0-K bundle.

The workbook is treated as a user-provided research baseline. Copyrighted sources
are represented only by metadata and abstract knowledge statements already present
in the workbook. No source text is reproduced. Promotion to FACT is limited to
human-confirmed K3-supported invariants; K2 candidates, provisional typologies,
and proposed domain primitives remain non-canonical.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from openpyxl import load_workbook

REPO = Path(__file__).resolve().parents[1]
WORKBOOK = Path('/home/ubuntu/upload/ARKI_Architectural_Knowledge_Corpus_v0.1.xlsx')
OUT_DIR = REPO / 'docs/arki-m0k'
OUT_DIR.mkdir(parents=True, exist_ok=True)

PROMOTION_AUTHORITY = 'HUMAN_ARCHITECT_USER_AUTHORIZATION_2026-09-20'
INGESTION_ID = 'ARKI-M0K-CORPUS-2026-09-20'


def rows_with_headers(sheet_name: str) -> list[dict[str, Any]]:
    wb = load_workbook(WORKBOOK, data_only=True, read_only=True)
    ws = wb[sheet_name]
    rows = list(ws.iter_rows(values_only=True))
    header_idx = next((i for i, row in enumerate(rows) if row and str(row[0]).strip() == sheet_name), None)
    if header_idx is None:
        raise ValueError(f'No section marker for {sheet_name}')
    header_row = header_idx + 1
    headers = [str(v).strip() if v is not None else '' for v in rows[header_row]]
    records: list[dict[str, Any]] = []
    for raw in rows[header_row + 1:]:
        if not any(v is not None and str(v).strip() for v in raw):
            continue
        values = list(raw) + [None] * max(0, len(headers) - len(raw))
        record = {headers[i]: values[i] for i in range(len(headers)) if headers[i]}
        if any(v is not None and str(v).strip() for v in record.values()):
            records.append(record)
    return records


def clean(value: Any) -> Any:
    if value is None:
        return None
    if isinstance(value, str):
        return value.strip()
    return value

sources = [{k: clean(v) for k, v in row.items()} for row in rows_with_headers('01_SOURCES')]
knowledge_rows = [{k: clean(v) for k, v in row.items()} for row in rows_with_headers('03_KNOWLEDGE')]
domain_rows = [{k: clean(v) for k, v in row.items()} for row in rows_with_headers('04_DOMAIN_CORE')]
typologies = [{k: clean(v) for k, v in row.items()} for row in rows_with_headers('09_TYPOLOGY')]
strategies = [{k: clean(v) for k, v in row.items()} for row in rows_with_headers('12_STRATEGIES')]

promotable_ids = {
    row['KNOWLEDGE_ID']
    for row in knowledge_rows
    if row.get('K_STATE') == 'K3_SUPPORTED'
    and row.get('STATUS') == 'PROPOSED'
    and row.get('HUMAN_AUTHORITY_REQUIRED') is True
}

knowledge: list[dict[str, Any]] = []
for row in knowledge_rows:
    kid = row.get('KNOWLEDGE_ID')
    if kid in promotable_ids:
        epistemic_status = 'FACT'
        k_state = 'K7_CANONICAL_HUMAN_CONFIRMED'
        promotion = 'PROMOTED_BY_HUMAN_VALIDATION'
    else:
        epistemic_status = 'HYPOTHESIS'
        k_state = row.get('K_STATE') or 'UNKNOWN'
        promotion = 'NOT_PROMOTED_REQUIRES_FURTHER_EVIDENCE'
    knowledge.append({
        'knowledgeId': kid,
        'kind': row.get('KNOWLEDGE_KIND'),
        'layer': row.get('LAYER'),
        'title': row.get('TITLE'),
        'statement': row.get('ARKI_ABSTRACTION'),
        'epistemicStatus': epistemic_status,
        'kState': k_state,
        'scopeId': row.get('SCOPE_ID'),
        'useMode': row.get('KNOWLEDGE_USE_MODE'),
        'modality': row.get('MODALITY'),
        'applicability': row.get('APPLICABILITY_DEFAULT'),
        'transferability': row.get('TRANSFERABILITY_DEFAULT'),
        'humanAuthorityRequired': row.get('HUMAN_AUTHORITY_REQUIRED'),
        'failureIfMisapplied': row.get('FAILURE_IF_MISAPPLIED'),
        'designRelevance': row.get('DESIGN_RELEVANCE'),
        'provenance': 'ABSTRACT_ONLY_FROM_USER_PROVIDED_WORKBOOK',
        'sourceIds': ['SRC-WHITE-PROG', 'SRC-WHITE-FORM', 'SRC-NEUFERT', 'SRC-PLAZOLA-V01', 'SRC-PLAZOLA-V02', 'SRC-PLAZOLA-V03', 'SRC-PLAZOLA-V04', 'SRC-PLAZOLA-V05', 'SRC-PLAZOLA-V06', 'SRC-PLAZOLA-V07', 'SRC-PLAZOLA-V08', 'SRC-PLAZOLA-V09', 'SRC-PLAZOLA-V10'],
        'promotionDecision': promotion,
        'promotionAuthority': PROMOTION_AUTHORITY if kid in promotable_ids else None,
    })

bundle = {
    'schema': 'ARKI-M0K-CORPUS-INGESTION-0.2',
    'ingestionId': INGESTION_ID,
    'createdAt': datetime.now(timezone.utc).isoformat(),
    'input': {
        'workbook': 'ARKI_Architectural_Knowledge_Corpus_v0.1.xlsx',
        'classification': 'RESEARCH_BASELINE',
        'sourceRightsPolicy': 'ABSTRACT_AND_REFERENCE_ONLY',
        'sourceTextReproduced': False,
    },
    'humanValidation': {
        'authority': PROMOTION_AUTHORITY,
        'instruction': 'Promote knowledge from the Excel to FACT in SICL Core with human validation and complete corpus ingestion.',
        'scope': 'Only K3_SUPPORTED proposed invariants with explicit human-authority requirement are promoted. All other records retain non-canonical epistemic states.',
        'validatedKnowledgeIds': sorted(promotable_ids),
        'date': '2026-09-20',
    },
    'records': {
        'sources': sources,
        'knowledge': knowledge,
        'domainPrimitives': domain_rows,
        'typologies': typologies,
        'strategies': strategies,
    },
    'counts': {
        'sources': len(sources),
        'knowledgeTotal': len(knowledge),
        'knowledgePromotedToFact': len(promotable_ids),
        'knowledgeRetainedNonCanonical': len(knowledge) - len(promotable_ids),
        'domainPrimitives': len(domain_rows),
        'typologies': len(typologies),
        'strategies': len(strategies),
    },
    'corePersistence': {
        'status': 'BLOCKED_MISSING_SICL_CORE_CONNECTOR',
        'urlConfigured': False,
        'tokenConfigured': False,
        'requiredNextStep': 'Configure SICL_CORE_URL and SICL_CORE_SERVICE_TOKEN, then replay this bundle through the canonical Core API with the same human-validation record.',
        'noSilentLocalFallbackClaim': True,
    },
    'epistemicGuards': [
        'SOURCE != KNOWLEDGE',
        'COPYRIGHTED_SOURCE != SOURCE_TEXT_REPRODUCTION',
        'K3_SUPPORTED + HUMAN_VALIDATION -> FACT/K7 only for selected invariants',
        'K2_CANDIDATE remains HYPOTHESIS',
        'PROVISIONAL_TYPOLOGY remains non-canonical',
        'PROPOSED_DOMAIN_PRIMITIVE remains non-canonical',
        'HUMAN_ARCHITECT remains final authority',
    ],
}

bundle_path = OUT_DIR / 'corpus-ingestion.json'
bundle_path.write_text(json.dumps(bundle, ensure_ascii=False, indent=2) + '\n')

review = {
    'schema': 'ARKI-M0K-HUMAN-PROMOTION-REVIEW-0.1',
    'ingestionId': INGESTION_ID,
    'humanValidation': bundle['humanValidation'],
    'promotedToFact': [k for k in knowledge if k['epistemicStatus'] == 'FACT'],
    'notPromoted': [k for k in knowledge if k['epistemicStatus'] != 'FACT'],
    'corePersistence': bundle['corePersistence'],
}
review_path = OUT_DIR / 'human-promotion-review.json'
review_path.write_text(json.dumps(review, ensure_ascii=False, indent=2) + '\n')

print(json.dumps({'bundle': str(bundle_path), 'review': str(review_path), 'counts': bundle['counts'], 'corePersistence': bundle['corePersistence']}, ensure_ascii=False, indent=2))
