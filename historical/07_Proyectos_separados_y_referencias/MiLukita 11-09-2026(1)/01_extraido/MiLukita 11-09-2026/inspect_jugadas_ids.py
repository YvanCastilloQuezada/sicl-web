import openpyxl
from pathlib import Path
p=Path('/home/ubuntu/projects/ruleta-peru-00154ef9/Ruleta Perú 28-7-2024.xlsm')
wf=openpyxl.load_workbook(p,data_only=False,keep_vba=True)
wv=openpyxl.load_workbook(p,data_only=True,keep_vba=True)
ws=wf['Jugadas']; wsv=wv['Jugadas']
for r in range(1,12):
    print('row',r)
    for col in 'ABCD':
        c=ws[f'{col}{r}']; v=wsv[f'{col}{r}']
        print(col, 'formula=',repr(c.value), 'cached=',repr(v.value), 'numfmt=',repr(c.number_format), 'style=',c.style_id)
