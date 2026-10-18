from __future__ import annotations
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
registry = json.loads((root / 'C1_C80_WAVE1_REGISTRY.json').read_text())
foundations = {
    'identity': 'shared/arkiSharedFoundation.ts::StableIdentity + IdentityMapping',
    'epistemic': 'shared/arkiSharedFoundation.ts::EpistemicStatus',
    'evidence': 'shared/arkiSharedFoundation.ts::EvidenceRecord',
    'provenance': 'shared/arkiSharedFoundation.ts::ProvenanceRecord',
    'units': 'shared/arkiSharedFoundation.ts::UnitValue + normalizeUnit',
    'relationships': 'shared/arkiRelationshipFabric.ts::RelationshipRecord',
    'geometry': 'shared/arkiConstructionOntology.ts::ConstructionModel',
    'semantic-registry': 'shared/arkiSharedFoundation.ts::SemanticConcept + curator review',
    'architectural-core': 'shared/arkiArchitecturalProgram.ts',
    'engineering-model': 'shared/arkiStructuralModel.ts / shared/arkiMepModel.ts',
    'solver-interface': 'contract only; no solver installed',
    'interoperability': 'shared/arkiCadGateway.ts + shared/ifc4',
    'simulation': 'shared/arkiSimulationSandbox.ts',
    'lifecycle': 'E8-B contracts and assets',
    'evaluation-framework': 'COCO / examination evidence',
    'explanation': 'contract only; no separate engine promoted',
    'learning-framework': 'shared/arkiLivingKnowledge.ts',
    'human-authority': 'PF-H01 + HumanDecision boundaries',
}
rows = []
for capability in registry['capabilities']:
    consumed = []
    for dependency in capability['dependencies']:
        if dependency.startswith('W1:'):
            consumed.append(dependency[3:])
        elif dependency.startswith('W') and ':' in dependency:
            consumed.append(dependency)
    rows.append({
        'capabilityId': capability['id'],
        'capabilityName': capability['name'],
        'consumes': consumed,
        'implementationStatus': capability.get('implementationStatus', 'DOCUMENTED'),
        'reuseStrategy': capability.get('reuseDecision', 'REUSE_OR_EXTEND'),
        'runtimeStatus': capability.get('runtimeStatus', 'NOT_DEMONSTRATED'),
        'stateRule': 'DEPENDENCY_DOES_NOT_ELEVATE_CAPABILITY_STATUS',
    })

out = {
    'artifact': 'F0_C1_C80_FOUNDATION_MAP',
    'status': 'DOCUMENTED / NO_CAPABILITY_PROMOTION',
    'foundations': foundations,
    'capabilities': rows,
}
(root / 'F0_C1_C80_FOUNDATION_MAP.json').write_text(json.dumps(out, indent=2) + '\n')
md = ['# F0 ↔ C1–C80 Foundation Map', '', '**Status:** DOCUMENTED / NO CAPABILITY PROMOTION', '', 'The map binds existing foundations to registered capabilities. A binding is not runtime evidence and does not promote any C1–C80 status.', '', '| ID | Capability | Foundations consumed | Implementation status | Reuse strategy | Runtime status |', '|---|---|---|---|---|---|']
for row in rows:
    md.append(f"| {row['capabilityId']} | {row['capabilityName']} | {', '.join(row['consumes'])} | {row['implementationStatus']} | {row['reuseStrategy']} | {row['runtimeStatus']} |")
md += ['', '## Global rule', '', '`FOUNDATION_DEPENDENCY ≠ CAPABILITY_VERIFIED`. Registered capabilities retain their evidence status until their own tests and evidence close them.']
(root / 'F0_C1_C80_FOUNDATION_MAP.md').write_text('\n'.join(md) + '\n')
print(f'F0_C1_C80_FOUNDATION_MAP: {len(rows)} capabilities mapped')
