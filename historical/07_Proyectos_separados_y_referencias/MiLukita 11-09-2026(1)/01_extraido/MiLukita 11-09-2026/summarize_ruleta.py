from pathlib import Path
from collections import Counter, defaultdict
import re
import openpyxl

path = Path('/home/ubuntu/projects/ruleta-peru-00154ef9/Ruleta Perú 28-7-2024.xlsm')
wf = openpyxl.load_workbook(path, data_only=False, keep_vba=True)
wv = openpyxl.load_workbook(path, data_only=True, keep_vba=True)
lines=[]
lines.append(f'ARCHIVO: {path.name}')
lines.append(f'Tamaño: {path.stat().st_size:,} bytes')
lines.append(f'Hojas: {", ".join(wf.sheetnames)}')
lines.append('')
for ws, wsv in zip(wf.worksheets, wv.worksheets):
    formulas=[]; errors=[]; refs=[]; func=Counter(); formula_by_col=Counter(); formula_by_row=Counter(); values=Counter(); dates=[]; strings=[]
    for row in ws.iter_rows():
        for c in row:
            if c.value is not None:
                values[c.data_type]+=1
                if isinstance(c.value, str) and not c.value.startswith('='):
                    strings.append((c.coordinate,c.value))
                if c.is_date or c.data_type=='d': dates.append((c.coordinate,str(c.value)))
                if c.data_type=='f' or (isinstance(c.value,str) and c.value.startswith('=')):
                    f=str(c.value)
                    cv=wsv[c.coordinate].value
                    formulas.append((c.coordinate,f,cv))
                    formula_by_col[c.column_letter]+=1; formula_by_row[c.row]+=1
                    if isinstance(cv,str) and cv.startswith('#'): errors.append((c.coordinate,f,cv))
                    if '#REF!' in f or '#NAME?' in f or '#VALUE!' in f or '#DIV/0!' in f: refs.append((c.coordinate,f,cv))
                    for m in re.findall(r'\b([A-Z][A-Z0-9\.]*)\s*\(', f.upper()): func[m]+=1
    lines.append(f'[{ws.title}] estado={ws.sheet_state} rango={ws.calculate_dimension()} filas={ws.max_row} columnas={ws.max_column}')
    lines.append(f'  Celdas no vacías: {sum(values.values())}; tipos={dict(values)}; fórmulas={len(formulas)}; fechas={len(dates)}; texto={len(strings)}')
    lines.append(f'  Fórmulas por columna: {dict(formula_by_col)}')
    lines.append(f'  Funciones detectadas: {dict(func)}')
    lines.append(f'  Errores de cálculo cacheados: {len(errors)}')
    if errors:
        for item in errors[:30]: lines.append(f'    ERROR {item}')
    lines.append(f'  Fórmulas con indicadores de referencia/error: {len(refs)}')
    if refs:
        for item in refs[:30]: lines.append(f'    REF {item}')
    lines.append('  Primeras fórmulas:')
    for item in formulas[:45]: lines.append(f'    {item[0]}: {item[1]} => {item[2]}')
    lines.append('  Últimas fórmulas:')
    for item in formulas[-15:]: lines.append(f'    {item[0]}: {item[1]} => {item[2]}')
    lines.append('  Texto visible relevante:')
    for cell,val in strings[:80]: lines.append(f'    {cell}: {val}')
    lines.append('  Valores de muestra por fila (primeras 35 filas no vacías):')
    n=0
    for r in range(1, min(ws.max_row,150)+1):
        vals=[wsv.cell(r,c).value for c in range(1,min(ws.max_column,20)+1)]
        if any(v is not None for v in vals):
            lines.append(f'    fila {r}: {vals}')
            n+=1
            if n>=35: break
    lines.append('')
Path('/home/ubuntu/ruleta_summary.txt').write_text('\n'.join(lines), encoding='utf-8')
print('/home/ubuntu/ruleta_summary.txt')
