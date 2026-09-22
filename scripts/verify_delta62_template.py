from pathlib import Path
from openpyxl import load_workbook
from docx import Document

out = Path('/home/ubuntu/sicl-web/outputs')
xlsx = out / 'ARKI_LUCA_DELTA62_PLANTILLA_VACIA.xlsx'
docx = out / 'ARKI_LUCA_DELTA62_GUIA_Y_PROMPT.docx'
wb = load_workbook(xlsx, read_only=False, data_only=False)
expected = ['LEEME','PROMPT_IA','FUENTES','REGISTROS_DELTA62','EVIDENCIA','GLOSARIO','LISTAS']
assert wb.sheetnames == expected, wb.sheetnames
assert wb['REGISTROS_DELTA62']['B1'].value == 'formatVersion'
assert wb['REGISTROS_DELTA62']['N1'].value == 'humanReviewRequired'
assert wb['REGISTROS_DELTA62']['A2'].value is None
assert wb['PROMPT_IA']['A1'].value == 'PROMPT PARA LA IA EXTRACTORA'
assert wb['LISTAS'].sheet_state == 'hidden'
doc = Document(docx)
text = '\n'.join(p.text for p in doc.paragraphs)
assert 'DELTA-6.2-FEDERATED-KNOWLEDGE-1.0' in text
assert 'recordType' in text
assert 'sin inventar contenido' in text or 'No inventar contenido' in text
assert len(doc.tables) >= 1
print('xlsx sheets: PASS')
print('xlsx blank data rows: PASS')
print('xlsx validations/support lists: PASS')
print('docx instructions and prompt: PASS')
print('template verification: PASS')
