from pathlib import Path
from collections import Counter, defaultdict
import openpyxl

path=Path('/home/ubuntu/projects/ruleta-peru-00154ef9/Ruleta Perú 28-7-2024.xlsm')
wf=openpyxl.load_workbook(path,data_only=False,keep_vba=True)
wv=openpyxl.load_workbook(path,data_only=True,keep_vba=True)
lines=[]
ws=wv['BaseDeDatos']; wsf=wf['BaseDeDatos']
lines.append('PRUEBAS DE CONSISTENCIA - BaseDeDatos')
# Actual input rows by boleto/cell A
rows=[]
for r in range(2,ws.max_row+1):
    vals=[ws.cell(r,c).value for c in range(1,11)]
    if any(v is not None for v in vals): rows.append((r,vals))
lines.append(f'Filas con entradas A:J: {len(rows)} de 5000')
# duplicates and missing ids
ids=[v[1][0] for v in rows if v[1][0] is not None]
phones=[v[1][1] for v in rows if v[1][1] is not None]
lines.append(f'Boletos: mínimo={min(ids) if ids else None}, máximo={max(ids) if ids else None}, únicos={len(set(ids))}, duplicados={len(ids)-len(set(ids))}')
lines.append(f'Teléfonos: valores={len(phones)}, únicos={len(set(phones))}, duplicados={len(phones)-len(set(phones))}')
# invalid ranges
bad_multi=[]; bad_apuesta=[]; bad_num=[]; repeated=[]; incomplete=[]
for r, vals in rows:
    boleto, phone, multi, apuesta, *nums=vals
    if multi is not None and multi not in [1,2,3,4,5,6,7,8,9,10]: bad_multi.append((r,multi))
    if apuesta is not None and apuesta not in [1,2,3]: bad_apuesta.append((r,apuesta))
    num_vals=[n for n in nums if n is not None]
    if len(num_vals) < (3 if apuesta==1 else 5 if apuesta==2 else 6 if apuesta==3 else 0): incomplete.append((r,apuesta,len(num_vals),num_vals))
    if any(not isinstance(n,(int,float)) or n<1 or n>50 for n in num_vals): bad_num.append((r,num_vals))
    if len(num_vals)!=len(set(num_vals)): repeated.append((r,num_vals))
lines.append(f'Multi fuera de rango 1..10: {len(bad_multi)} {bad_multi[:10]}')
lines.append(f'Apuesta fuera de rango 1..3: {len(bad_apuesta)} {bad_apuesta[:10]}')
lines.append(f'Boletos con menos números de los esperados por tipo: {len(incomplete)} {incomplete[:10]}')
lines.append(f'Boletos con números fuera de 1..50: {len(bad_num)} {bad_num[:10]}')
lines.append(f'Boletos con números repetidos dentro de la jugada: {len(repeated)} {repeated[:10]}')
# computed values distribution
for label,col in [('Aciertos',11),('Adicional',12),('Fija1',13),('Fija2',14),('Fija3',15),('Premio',16),('Premio adicional',17),('Premio fijo',18),('Resumen',30)]:
    ctr=Counter(ws.cell(r,col).value for r in range(2,ws.max_row+1) if ws.cell(r,col).value not in (None,''))
    lines.append(f'{label}: {dict(ctr.most_common(20))}')
# Input and calc formula coverage per row
for col in range(1,31):
    n_input=sum(wsf.cell(r,col).value is not None for r in range(2,ws.max_row+1))
    n_formula=sum(wsf.cell(r,col).data_type=='f' or str(wsf.cell(r,col).value).startswith('=') for r in range(2,ws.max_row+1))
    if n_input or n_formula: lines.append(f'Col {openpyxl.utils.get_column_letter(col)}: no-vacías={n_input}, fórmulas={n_formula}')
# Calculate category totals from cached AD/T
summary=Counter(ws.cell(r,30).value for r in range(2,ws.max_row+1) if ws.cell(r,30).value not in (None,''))
lines.append(f'Resumen de categorías AD: {dict(summary)}')
# Jugadas checks
j=wv['Jugadas']; jf=wf['Jugadas']
lines.append('')
lines.append('PRUEBAS DE CONSISTENCIA - Jugadas')
for r in range(2,j.max_row+1):
    b=j.cell(r,2).value; c=j.cell(r,3).value; d=j.cell(r,4).value
    if b is not None and c is not None and d is not None:
        if hasattr(c,'date') and hasattr(b,'date') and b.date()!=c.date():
            pass
# Compare B = C+D where formula exists and cached values approx
diff=[]
for r in range(2,j.max_row+1):
    if isinstance(jf.cell(r,2).value,str) and jf.cell(r,2).value.startswith('='):
        c=j.cell(r,3).value; d=j.cell(r,4).value; b=j.cell(r,2).value
        try:
            expected=__import__('datetime').datetime.combine(c.date(),d) if hasattr(c,'date') and hasattr(d,'hour') else None
            if expected and b!=expected: diff.append((r,b,expected))
        except Exception: pass
lines.append(f'Filas con horario B distinto de C+D: {len(diff)} {diff[:5]}')
# Registro checks
reg=wv['Registro']; regf=wf['Registro']
lines.append('')
lines.append('PRUEBAS DE CONSISTENCIA - Registro')
lines.append(f'Filas de datos visibles: {sum(reg.cell(r,1).value is not None for r in range(2,reg.max_row+1))}')
lines.append(f'Premio ganado no-cero: {sum((reg.cell(r,6).value not in (None,0,'')) for r in range(2,reg.max_row+1))}')
# protection state / calc props
for wsx in wf.worksheets:
    lines.append(f'Protección {wsx.title}: sheet={wsx.protection.sheet}, workbook? n/a')
Path('/home/ubuntu/ruleta_consistency.txt').write_text('\n'.join(lines),encoding='utf-8')
print('/home/ubuntu/ruleta_consistency.txt')
