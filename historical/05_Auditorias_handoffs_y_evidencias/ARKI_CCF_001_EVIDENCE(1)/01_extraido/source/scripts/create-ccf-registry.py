import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
path=root/'client/public/__autopilot__/areas.json'
areas=json.loads(path.read_text())
existing={item['areaId']:item for item in areas}
future=[
 ('architecture-design','ARCHITECTURE / DESIGN','DOCUMENT_ONLY','DOCUMENTED','Architecture/design domain is not a separate runtime area in the current UI.'),
 ('cad','CAD','DOCUMENT_ONLY','DOCUMENTED','CAD gateway exists as a contract; production CAD runtime is not demonstrated.'),
 ('structures','STRUCTURES','DOCUMENT_ONLY','DOCUMENTED','Structural contracts exist; professional solver runtime is not claimed.'),
 ('geotechnical','GEOTECHNICAL','NOT_IMPLEMENTED','UNKNOWN','No demonstrated geotechnical runtime area in the inspected repository.'),
 ('mep','MEP','DOCUMENT_ONLY','DOCUMENTED','MEP contracts/adapters exist; professional MEP runtime is not claimed.'),
 ('fire-life-safety','FIRE / LIFE SAFETY','NOT_IMPLEMENTED','UNKNOWN','No demonstrated fire/life-safety runtime area.'),
 ('simulation','SIMULATION','DOCUMENT_ONLY','DOCUMENTED','Simulation sandbox contract exists; this is not a professional simulation area.'),
 ('gis-site-territory','GIS / SITE / TERRITORY','NOT_IMPLEMENTED','UNKNOWN','No demonstrated GIS/site runtime area.'),
 ('cost-finance','COST / FINANCE','PARTIAL','IMPLEMENTED_BOUNDED','Bounded 5D cost and PriceBook evidence exists.'),
 ('construction','CONSTRUCTION','PARTIAL','IMPLEMENTED_BOUNDED','Construction model and bounded 4D evidence exist.'),
 ('optimization','OPTIMIZATION','DOCUMENT_ONLY','DOCUMENTED','Optimization is registry/contract material; no broad solver area is claimed.'),
 ('knowledge','KNOWLEDGE','FOUNDATIONAL','FOUNDATIONAL','Knowledge/digest/assimilation foundations exist.'),
 ('digital-twin-operations','DIGITAL TWIN / OPERATIONS','DOCUMENT_ONLY','DOCUMENTED','Operations contracts exist; no full digital twin runtime claimed.'),
 ('security','SECURITY','FOUNDATIONAL','TESTED','Autopilot authority/security policy and tests exist.'),
 ('system-workers','SYSTEM / WORKERS','ACTIVE','IMPLEMENTED_BOUNDED','Autopilot worker, campaign, resources and audit projection exist.')]
for area_id,name,status,maturity,description in future:
 if area_id in existing: continue
 existing[area_id]={
  'areaId':area_id,'name':name,'description':description,'domain':name.lower(),'status':status,'maturity':maturity,'route':'/autopilot','capabilities':[],'pipelines':[],'dependencies':['overview'],'dependents':[],'tools':[],'workers':[],'availableViews':['DIRECTOR','LIVE','FORENSIC'],'currentObjective':None,'currentTask':None,'lastActivity':None,'health':'OBSERVED' if status in ('FOUNDATIONAL','PARTIAL','ACTIVE') else 'UNKNOWN','source':['repository inspection / no separate runtime page'] if status in ('DOCUMENT_ONLY','NOT_IMPLEMENTED','UNKNOWN') else ['repository evidence'] ,'unknowns':['runtime scope' ] if status in ('DOCUMENT_ONLY','NOT_IMPLEMENTED','UNKNOWN') else [],'deficits':['separate area runtime'] if status in ('DOCUMENT_ONLY','NOT_IMPLEMENTED') else [],'risks':['false promotion from documentation'] if status in ('DOCUMENT_ONLY','NOT_IMPLEMENTED') else [],'tests':[],'evidence':[],'humanGates':0}
path.write_text(json.dumps(list(existing.values()),indent=2)+'\n')
print(f'CCF_AREA_REGISTRY={len(existing)}')
