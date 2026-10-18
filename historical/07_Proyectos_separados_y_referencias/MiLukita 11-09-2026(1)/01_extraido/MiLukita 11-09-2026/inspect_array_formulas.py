from pathlib import Path
import zipfile
import xml.etree.ElementTree as ET

path=Path('/home/ubuntu/projects/ruleta-peru-00154ef9/Ruleta Perú 28-7-2024.xlsm')
ns={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with zipfile.ZipFile(path) as z:
    root=ET.fromstring(z.read('xl/worksheets/sheet4.xml'))
for c in root.findall('.//m:c',ns):
    f=c.find('m:f',ns)
    if f is not None and f.get('t') is not None:
        print(c.get('r'), 'type=', f.get('t'), 'ref=', f.get('ref'), 'text=', (f.text or '')[:1000])
