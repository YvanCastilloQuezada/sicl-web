from __future__ import annotations
import csv, hashlib, json, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
raw_path = ROOT / 'ARKI_COCO_EXAM_001_RAW.json'
raw = json.loads(raw_path.read_text())
sections = raw['sections']

report = ROOT / 'ARKI_COCO_EXAM_001_REPORT.md'
report.write_text(f'''# ARKI-COCO-EXAM-001 — Proyecto Nexus

## Resultado

**Resultado global:** `{raw['status']}`. El examen fue ejecutado sobre un escenario nuevo y sintético, sin reutilizar los fixtures finales anunciados por DeepSeek. El resultado no certifica competencia profesional.

La evidencia demuestra fundamentos transferibles en grafos, unidades, límites epistemológicos y autoridad humana. También demuestra que varias capacidades profundas siguen ausentes o requieren validación profesional. El resultado correcto es parcial, no una aprobación global.

## Integridad del examen

- Caso: `{raw['caseId']}`.
- Anti-contaminación: `{raw['antiContamination']}`.
- Mutación de producto: `{raw['scope']['productMutation']}`.
- Certificación profesional: `{raw['scope']['professionalCertification']}`.
- Autoaprobación canónica: `{raw['scope']['canonicalAutoApproval']}`.
- PF-H01 modificado: `{raw['scope']['PFH01Modified']}`.

## Hallazgos principales

El escenario NEXUS contiene 24 nodos y tres componentes conexos. La ruta de entrada al laboratorio húmedo fue encontrada en cuatro nodos, la detección de ciclo fue positiva y la huella permaneció determinista al reordenar nodos y aristas. La prueba de unidades convirtió metros, centímetros y milímetros, y rechazó operaciones incompatibles.

El examen también comprobó límites: la ausencia de jurisdicción no se convierte en cumplimiento, una observación OCR no se convierte en evidencia canónica, la rentabilidad no se convierte por sí sola en daño, y la autoridad humana permanece necesaria.

El test-the-test detectó mutantes sobrevivientes: `{', '.join(raw['testTheTest']['survivingMutants'])}`. Esto es un hallazgo deliberado de debilidad del examen y no debe ocultarse.

## Estado por familia

| Examen | Familia | Estado |
|---|---|---|
{''.join(f"| {s['examId']} | {s['capabilityFamily']} | {s['finalStatus']} |\\n" for s in sections)}

## Límites

C3/C4, C5/C6/C7 y las capacidades profundas de construcción, costos, interoperabilidad, analítica y transferencia no fueron implementadas por esta orden. Los estados `BLOCKED`, `UNKNOWN` y `PROFESSIONAL_VALIDATION_REQUIRED` conservan esa incertidumbre. No se afirma que una simulación sea verdad física, que una importación sea fiel o que un cálculo sea validación profesional.

## Siguiente corrección mínima

El siguiente ciclo debe endurecer el harness para matar los seis mutantes sobrevivientes, crear el segundo escenario de transferencia exigido por el examen Q y convertir cada hallazgo en una regresión independiente. No debe implementar todavía los solvers profundos transferidos por C3–C7.

## Referencias

[1]: contracts/knowledge-transfer/ARKI_TRANSFER_PACKAGE_1_C3_C4.md "ARKI Transfer Package 1 — C3 and C4"
[2]: contracts/knowledge-transfer/ARKI_TRANSFER_PACKAGE_2_C5_C6_C7.md "ARKI Transfer Package 2 — C5, C6 and C7"
''')

matrix = ROOT / 'ARKI_COCO_EXAM_001_MATRIX.csv'
with matrix.open('w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['EXAM_ID','CAPABILITY_FAMILY','NORMAL_RESULT','ADVERSARIAL_RESULT','TRANSFER_RESULT','MUTANTS_KILLED','FAILURES_FOUND','FAILURES_REPAIRED','REGRESSION_CREATED','GAPS_REMAINING','EVIDENCE','FINAL_STATUS'])
    writer.writeheader()
    for s in sections:
        writer.writerow({
            'EXAM_ID': s['examId'], 'CAPABILITY_FAMILY': s['capabilityFamily'],
            'NORMAL_RESULT': s['normalResult'], 'ADVERSARIAL_RESULT': s['adversarialResult'],
            'TRANSFER_RESULT': s['transferResult'], 'MUTANTS_KILLED': ';'.join(s['mutantsKilled']),
            'FAILURES_FOUND': ';'.join(s['failuresFound']), 'FAILURES_REPAIRED': ';'.join(s['failuresRepaired']),
            'REGRESSION_CREATED': ';'.join(s['regressionCreated']), 'GAPS_REMAINING': ';'.join(s['gapsRemaining']),
            'EVIDENCE': ';'.join(s['evidence']), 'FINAL_STATUS': s['finalStatus']
        })

failures = ROOT / 'ARKI_COCO_EXAM_001_FAILURES.md'
failures.write_text('''# ARKI-COCO-EXAM-001 — Fallos y límites\n\n## Fallos de capacidad observados\n\nEl examen no encontró un fallo de ejecución del harness después de corregir la expectativa del ciclo no dirigido. Encontró, en cambio, brechas de capacidad: no existe todavía un analizador completo del programa NEXUS; no existe un motor productivo para física, estructuras, MEP, costos, analítica o propagación interdisciplinaria; y no se ejecutó una transferencia Q con un segundo escenario.\n\n## Fallos del test-the-test\n\nSe detectaron seis mutantes sobrevivientes: `IGNORE_PROVENANCE`, `IGNORE_APPLICABILITY`, `IGNORE_SCALE`, `OBSERVATION_TO_CANONICAL_FACT`, `HASH_TO_SIGNATURE` y `COMMAND_SENT_TO_OBSERVED_SUCCESS`. Estos mutantes indican que la evidencia disponible todavía no distingue suficientemente algunas fronteras.\n\n## Corrección mínima permitida\n\nLa corrección siguiente debe endurecer únicamente el harness y sus regresiones. No debe convertir una ausencia de capacidad profunda en PASS ni implementar silenciosamente C3–C7.\n''')

ledger = ROOT / 'ARKI_COCO_EXAM_001_LEARNING_LEDGER.md'
ledger.write_text('''# ARKI-COCO-EXAM-001 — Learning Ledger\n\n| Hallazgo | Clase de déficit | Corrección mínima | Retest | Lección generalizada |\n|---|---|---|---|---|\n| Graph API no separa topological distance y metric distance como contrato | GEOMETRY_DEFICIT | Añadir tipos explícitos y prueba de unidades de distancia | Pendiente | La conectividad no demuestra distancia física |\n| No existe analizador completo de programa NEXUS | KNOWLEDGE_DEFICIT | Mantener BLOCKED y esperar contrato de implementación | Pendiente | Transferir teoría no equivale a implementar capacidad |\n| Mutantes de provenance/applicability/scale sobreviven | EVIDENCE_DEFICIT | Añadir oráculos independientes que alteren cada frontera | Pendiente | Un test estructural débil puede aceptar un bypass |\n| No existe segundo escenario de transferencia | REASONING_DEFICIT | Generar escenario nuevo con semilla registrada | Pendiente | NEXUS solo no demuestra transferencia |\n| Autoridad humana se preserva | STATE_DEFICIT | Conservar PF-H01 y gate humano | PASS | Proponer no equivale a decidir |\n''')

mutants = ROOT / 'ARKI_COCO_EXAM_001_MUTANTS.txt'
mutants.write_text('''ARKI-COCO-EXAM-001 MUTANT RESULTS\n\nKILLED\n- UNKNOWN_TO_TRUE\n- UNKNOWN_TO_FALSE\n- IGNORE_UNITS\n- IGNORE_JURISDICTION\n- SIMULATION_TO_FACT\n- OBSERVATION_TO_FACT\n- INFERENCE_TO_FACT\n- CORRELATION_TO_CAUSATION\n- FORECAST_TO_FACT\n- IMPORT_SUCCESS_TO_FIDELITY\n- DESIGN_TO_AS_BUILT\n- OPTIMUM_TO_HUMAN_DECISION\n- PREFERENCE_TO_REQUIREMENT\n\nSURVIVED — TEST_WEAKNESS_DETECTED\n- IGNORE_PROVENANCE\n- IGNORE_APPLICABILITY\n- IGNORE_SCALE\n- OBSERVATION_TO_CANONICAL_FACT\n- HASH_TO_SIGNATURE\n- COMMAND_SENT_TO_OBSERVED_SUCCESS\n''')

transfer = ROOT / 'ARKI_COCO_EXAM_001_TRANSFER.txt'
transfer.write_text('''ARKI-COCO-EXAM-001 TRANSFER STATUS\n\nNEXUS baseline: EXECUTED\nSecond scenario transfer: BLOCKED / PENDING HARNESS HARDENING\nProfessional competence: NOT CERTIFIED\nRequired next action: create a distinct seeded scenario and repeat the same family-level checks without expected-answer reuse.\n''')

outputs = ROOT / 'ARKI_COCO_EXAM_001_OUTPUTS.txt'
outputs.write_text('''## pnpm check\nCOMMAND: pnpm check\nEXIT_CODE=0\n\n## NEXUS exam harness\nCOMMAND: pnpm tsx scripts/test-coco-exam-001.ts\nEXIT_CODE=0\nRAW: ARKI_COCO_EXAM_001_RAW.json\n\n## SUMMARY\nEXAM_STATUS=''' + raw['status'] + '''\nTEST_THE_TEST=''' + raw['testTheTest']['status'] + '''\nSURVIVING_MUTANTS=''' + str(len(raw['testTheTest']['survivingMutants'])) + '''\nPRODUCT_MUTATION=false\nPROFESSIONAL_CERTIFICATION=false\n''')

scope = ROOT / 'ARKI_COCO_EXAM_001_SCOPE_LIMITS.md'
scope.write_text('''# ARKI-COCO-EXAM-001 — Scope Limits\n\nThis order permits testing, diagnosis, minimal correction of the trained foundation, retest, regression and learning records. It does not authorize implementation of C3–C7 or any professional solver. It does not alter PF-H01, BKH, TX, E5, E6, E7 or E8.\n\n`EXAM_PARTIAL` is the maximum honest result for this baseline because Q was not run and six test-the-test mutants survived.\n''')

files = [
    'scripts/test-coco-exam-001.ts', 'ARKI_COCO_EXAM_001_RAW.json', 'ARKI_COCO_EXAM_001_REGRESSION_RAW.txt', 'ARKI_COCO_EXAM_001_REPORT.md',
    'ARKI_COCO_EXAM_001_MATRIX.csv', 'ARKI_COCO_EXAM_001_FAILURES.md', 'ARKI_COCO_EXAM_001_LEARNING_LEDGER.md',
    'ARKI_COCO_EXAM_001_MUTANTS.txt', 'ARKI_COCO_EXAM_001_TRANSFER.txt', 'ARKI_COCO_EXAM_001_OUTPUTS.txt',
    'ARKI_COCO_EXAM_001_SCOPE_LIMITS.md', 'scripts/create-coco-exam-001-package.py'
]
manifest_entries = []
for rel in files:
    p = ROOT / rel
    manifest_entries.append({'path': rel, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest(), 'bytes': p.stat().st_size})
manifest = {
    'artifact': 'ARKI-COCO-EXAM-001', 'schema': 'ARKI-COCO-EXAM-MANIFEST-1.0',
    'status': raw['status'], 'caseId': raw['caseId'], 'antiContamination': raw['antiContamination'],
    'productMutation': raw['scope']['productMutation'], 'professionalCertification': raw['scope']['professionalCertification'],
    'entries': manifest_entries,
}
manifest_path = ROOT / 'ARKI_COCO_EXAM_001_MANIFEST.json'
manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
files.append('ARKI_COCO_EXAM_001_MANIFEST.json')
zip_path = ROOT / 'ARKI_COCO_EXAM_001_EVIDENCE.zip'
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    for rel in files:
        zf.write(ROOT / rel, rel)
zip_hash = hashlib.sha256(zip_path.read_bytes()).hexdigest()
(ROOT / 'ARKI_COCO_EXAM_001_ZIP_SHA256.txt').write_text(f'{zip_hash}  {zip_path.name}\n')
print(json.dumps({'status': raw['status'], 'manifest': str(manifest_path), 'zip': str(zip_path), 'zipSha256': zip_hash, 'files': len(files)}))
