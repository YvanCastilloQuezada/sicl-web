import json
from datetime import date
from pathlib import Path

OUT = Path('docs/arki-research/ARKI_MASTER_CURRICULUM_5000.json')

professional = [
    ('ARC', 'Arquitectura y diseño espacial'),
    ('URB', 'Urbanismo y planificación urbana'),
    ('LAN', 'Paisaje, ecología y territorio'),
    ('INT', 'Diseño interior y ambientación'),
    ('FUR', 'Mobiliario, carpintería y producto'),
    ('CER', 'Cerámica, alfarería y materialidad artesanal'),
    ('ART', 'Artes visuales, dibujo y representación'),
    ('HIS', 'Historia, teoría y crítica'),
    ('BIO', 'Arquitectura bioclimática y desempeño ambiental'),
    ('CON', 'Construcción, materiales y constructibilidad'),
    ('STR', 'Estructuras y comportamiento resistente'),
    ('GEO', 'Geotecnia, suelo y cimentaciones'),
    ('SAN', 'Ingeniería sanitaria e hidráulica'),
    ('ELE', 'Ingeniería eléctrica e iluminación'),
    ('MEC', 'Ingeniería mecánica, HVAC y electromecánica'),
    ('TEL', 'Telecomunicaciones, TIC y edificios inteligentes'),
    ('FIR', 'Seguridad contra incendios y evacuación'),
    ('ACC', 'Accesibilidad universal y diseño inclusivo'),
    ('TRA', 'Transporte, movilidad e infraestructura vial'),
    ('AER', 'Aeropuertos y sistemas aeronáuticos'),
    ('HOS', 'Hospitales y arquitectura para la salud'),
    ('CIV', 'Ingeniería civil e infraestructura'),
    ('REG', 'Desarrollo rural, regional y macroregional'),
    ('ECO', 'Economía, costos, inversión y viabilidad'),
    ('OPS', 'Operación, mantenimiento y facility management'),
]

bim = [
    ('01', 'Requisitos de información y alcance'),
    ('02', 'OIR, AIR, PIR y EIR'),
    ('03', 'BEP y estrategia de ejecución BIM'),
    ('04', 'CDE, estados, permisos y flujos'),
    ('05', 'LOIN, LOD y atributos'),
    ('06', 'Modelado semántico y clasificación'),
    ('07', 'IFC, openBIM e interoperabilidad'),
    ('08', 'BCF, incidencias y coordinación'),
    ('09', 'Federación de modelos y disciplinas'),
    ('10', 'Clash detection y resolución'),
    ('11', 'QA/QC, validación y auditoría'),
    ('12', 'Georreferenciación, GIS y multiescala'),
    ('13', 'Metrados, cantidades y trazabilidad'),
    ('14', 'Costos, presupuesto y cambios'),
    ('15', 'Cronograma, 4D y secuencias'),
    ('16', 'Especificaciones y procurement'),
    ('17', 'Entrega, handover y asset information'),
    ('18', 'Operación, mantenimiento y digital twin'),
    ('19', 'Versionado, provenance y UNKNOWNs'),
    ('20', 'Sostenibilidad, simulación y desempeño'),
]

communication = [
    ('01', 'Representación para pensar'),
    ('02', 'Representación para cliente'),
    ('03', 'Representación técnica'),
    ('04', 'Representación oficial y contractual'),
    ('05', 'Representación para construcción'),
    ('06', 'Representación para operación'),
    ('07', 'Comunicación con especialistas'),
    ('08', 'Comunicación con entidad y contratante'),
    ('09', 'Enseñanza, evaluación y transferencia'),
    ('10', 'Decisión, revisión humana y cierre'),
]

assert len(professional) * len(bim) * len(communication) == 5000

topics = []
number = 1
for p_code, p_name in professional:
    for b_code, b_name in bim:
        for c_code, c_name in communication:
            topics.append({
                'topicId': f'ARKI-{number:04d}',
                'name': f'{p_name} — {b_name} — {c_name}',
                'professionalAxis': {'code': p_code, 'name': p_name},
                'bimAxis': {'code': b_code, 'name': b_name},
                'communicationAxis': {'code': c_code, 'name': c_name},
                'competency': f'Aplicar {b_name.lower()} en {p_name.lower()} y comunicarlo mediante {c_name.lower()}.',
                'exercise': f'Construir un caso trazable de {p_name.lower()} que atraviese {b_name.lower()} y produzca una entrega de {c_name.lower()}.',
                'evidenceRequired': ['PROJECT_STATE', 'SOURCE_PROVENANCE', 'EXPLICIT_ASSUMPTIONS', 'UNKNOWN_REGISTER', 'HUMAN_REVIEW'],
                'transferQuestion': '¿Qué se conserva, qué se adapta y qué no se transfiere al cambiar tipología, escala, jurisdicción o receptor?',
                'status': 'RESEARCH_PENDING',
                'canonization': 'NOT_PERFORMED',
                'authority': 'HUMAN_REVIEW_REQUIRED',
            })
            number += 1

registry = {
    'registryId': 'ARKI-MASTER-CURRICULUM-5000-2026-09-21',
    'status': 'STRUCTURED_INCREMENTAL_CURRICULUM',
    'version': '1.0',
    'created': str(date.today()),
    'purpose': 'Currículo cruzado de ARKI para integrar conocimiento profesional, metodología BIM y comunicación sin mezclar conocimiento con capacidad de software ni autoridad profesional.',
    'capacity': 5000,
    'topicCount': len(topics),
    'matrix': {
        'professionalAxisCount': len(professional),
        'bimAxisCount': len(bim),
        'communicationAxisCount': len(communication),
        'formula': '25 × 20 × 10 = 5,000',
        'professionalAxis': professional,
        'bimAxis': bim,
        'communicationAxis': communication,
    },
    'learningPolicy': {
        'sequence': 'KNOWLEDGE → COMPETENCY → EXERCISE → PROJECT EVIDENCE → HUMAN REVIEW → OPTIONAL PROMOTION',
        'noAutomaticFactPromotion': True,
        'noProfessionalSignoff': True,
        'notAllTopicsAreStudied': True,
        'researchStatusMeaning': 'RESEARCH_PENDING means structured for study, not learned, verified or canonical.',
        'incrementalExpansion': 'Future additions require a new version or a controlled replacement with history; do not silently overwrite topic identity.',
    },
    'componentMapping': {
        'ARKI_SUPER_ARCHITECT': ['competency', 'exercise', 'transferQuestion', 'projectEvidence'],
        'ARKI_GRAPHIC_INTELLIGENCE': ['communicationAxis', 'representationType', 'audienceAndDeliverable'],
        'ARKI_ETI_BIM': ['bimAxis', 'evidenceRequired', 'provenance', 'handoverAndAssetInformation'],
    },
    'topicTemplate': ['topicId', 'name', 'professionalAxis', 'bimAxis', 'communicationAxis', 'competency', 'exercise', 'evidenceRequired', 'transferQuestion', 'status', 'canonization', 'authority'],
    'topics': topics,
}
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'CURRICULUM_TOPICS={len(topics)}')
print(f'OUTPUT={OUT}')
