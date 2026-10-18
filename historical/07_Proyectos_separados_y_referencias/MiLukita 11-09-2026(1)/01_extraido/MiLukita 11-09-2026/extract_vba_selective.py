from pathlib import Path
import olefile
from oletools.olevba import _extract_vba

p=Path('/home/ubuntu/ruleta_vba/vbaProject.bin')
out=Path('/home/ubuntu/ruleta_vba/modules')
out.mkdir(exist_ok=True)
ole=olefile.OleFileIO(str(p), raise_defects=olefile.DEFECT_INCORRECT)
results=[]
try:
    for stream_path, filename, code in _extract_vba(ole, '', 'PROJECT', 'VBA/dir', True):
        if code is None:
            results.append((stream_path,filename,0))
            continue
        text=code if isinstance(code,str) else code.decode('utf-8','replace')
        safe=filename.replace('/','_').replace('\\\\','_')
        (out/(safe+'.txt')).write_text(text,encoding='utf-8',errors='replace')
        results.append((stream_path,filename,len(text)))
finally:
    ole.close()
for x in results: print(x)
