from pathlib import Path
p=Path('/home/ubuntu/generador-familias/client/src/pages/AutopilotCommandCenter.tsx')
s=p.read_text()
old='href={area.areaId === "bim" ? "/" : "#area-registry"}'
new='href={area.areaId === "bim" ? "/" : area.areaId === "design-exploration" ? "/predictive" : "#area-registry"}'
assert old in s
p.write_text(s.replace(old,new))
print('PREDICTIVE_MASTER_LINK=UPDATED')
