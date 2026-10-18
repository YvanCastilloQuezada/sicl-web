from pathlib import Path
import zipfile
import xml.etree.ElementTree as ET
path=Path('/home/ubuntu/projects/ruleta-peru-00154ef9/Ruleta Perú 28-7-2024.xlsm')
ns={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with zipfile.ZipFile(path) as z:
    root=ET.fromstring(z.read('xl/worksheets/sheet4.xml'))
for ref in ['K2','K3','K4','K5000','K5001','P2','P3','P4','P5000','Q2','Q3','Q4','Q4999']:
    c=root.find(f'.//m:c[@r="{ref}"]',ns)
    f=c.find('m:f',ns) if c is not None else None
    v=c.find('m:v',ns) if c is not None else None
    print(f'{ref}: cell_type={c.get("t") if c is not None else None}; formula_type={f.get("t") if f is not None else None}; formula_ref={f.get("ref") if f is not None else None}; cached={(v.text if v is not None else None)}')
    print((f.text or '')[:500] if f is not None else '')
