import json
from pathlib import Path

path = Path('docs/arki-research/ARKI_MASTER_CURRICULUM_5000.json')
data = json.loads(path.read_text(encoding='utf-8'))
assert data['topicCount'] == 5000
assert len(data['topics']) == 5000
assert data['matrix']['formula'] == '25 × 20 × 10 = 5,000'
assert data['topics'][0]['topicId'] == 'ARKI-0001'
assert data['topics'][-1]['topicId'] == 'ARKI-5000'
assert len(data['matrix']['professionalAxis']) == 25
assert len(data['matrix']['bimAxis']) == 20
assert len(data['matrix']['communicationAxis']) == 10
assert all(topic['status'] == 'RESEARCH_PENDING' for topic in data['topics'])
print('CURRICULUM_VALIDATION=PASS')
print(f"TOPICS={len(data['topics'])}")
print(f"AXES={len(data['matrix']['professionalAxis'])}x{len(data['matrix']['bimAxis'])}x{len(data['matrix']['communicationAxis'])}")
