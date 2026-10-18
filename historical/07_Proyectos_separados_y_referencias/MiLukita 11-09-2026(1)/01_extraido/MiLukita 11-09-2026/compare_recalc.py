from pathlib import Path
from collections import Counter
import openpyxl
orig=Path('/home/ubuntu/projects/ruleta-peru-00154ef9/Ruleta Perú 28-7-2024.xlsm')
recalc=Path('/home/ubuntu/ruleta_recalc/Ruleta Perú 28-7-2024.xlsx')
wo_f=openpyxl.load_workbook(orig,data_only=False,keep_vba=True)
wo_v=openpyxl.load_workbook(orig,data_only=True,keep_vba=True)
wr_v=openpyxl.load_workbook(recalc,data_only=True,keep_vba=False)
lines=[]
for s in wo_f.sheetnames:
    a=wo_f[s]; av=wo_v[s]; rv=wr_v[s]
    mismatches=[]; errors=[]; recalc_nonempty=0
    for row in a.iter_rows():
        for c in row:
            if c.data_type=='f' or (isinstance(c.value,str) and c.value.startswith('=')):
                o=av[c.coordinate].value; r=rv[c.coordinate].value
                if r is not None: recalc_nonempty+=1
                # compare string/number/dates normalized text
                if str(o)!=str(r): mismatches.append((c.coordinate,o,r,str(c.value)[:160]))
                if isinstance(r,str) and r.startswith('#'): errors.append((c.coordinate,r,str(c.value)[:160]))
    lines.append(f'{s}: mismatches={len(mismatches)}, recalculated_nonempty={recalc_nonempty}, errors={len(errors)}')
    for x in mismatches[:25]: lines.append(f'  {x}')
    for x in errors[:25]: lines.append(f'  ERROR {x}')
Path('/home/ubuntu/ruleta_recalc_compare.txt').write_text('\n'.join(lines),encoding='utf-8')
print('/home/ubuntu/ruleta_recalc_compare.txt')
