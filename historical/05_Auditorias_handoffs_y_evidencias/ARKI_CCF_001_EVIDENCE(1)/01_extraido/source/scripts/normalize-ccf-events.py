import json
from pathlib import Path
path=Path('/home/ubuntu/generador-familias/client/public/__autopilot__/events.json')
events=json.loads(path.read_text())
for index,event in enumerate(events):
 event.setdefault('eventId', f"{event.get('at','unknown')}:{event.get('type','unknown')}:{index}")
 event.setdefault('timestamp', event.get('at'))
 event.setdefault('areaId', (event.get('sourceArea') or 'ARKI').lower().replace(' ','-'))
 event.setdefault('eventType', event.get('type','UNKNOWN'))
 event.setdefault('severity', 'ERROR' if 'FAIL' in event.get('type','') else 'INFO')
 event.setdefault('summary', event.get('reason') or event.get('result') or event.get('type','UNKNOWN'))
 event.setdefault('status', 'FAIL' if 'FAIL' in event.get('type','') else 'PASS' if 'PASS' in event.get('type','') or 'COMPLETED' in event.get('type','') else 'RUNNING')
 event.setdefault('evidenceRefs', [])
 event.setdefault('correlationId', f"ccf:{event.get('at','unknown')}")
path.write_text(json.dumps(events,indent=2)+'\n')
print(f'CCF_NORMALIZED_EVENTS={len(events)}')
