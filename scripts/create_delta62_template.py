from pathlib import Path
from datetime import date
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter
from docx import Document
from docx.shared import Inches, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT

OUT = Path('/home/ubuntu/sicl-web/outputs')
OUT.mkdir(parents=True, exist_ok=True)

NAVY = '102A43'
BLUE = '1F5D8F'
TEAL = '0F766E'
LIGHT = 'EAF2F8'
YELLOW = 'FFF4CC'
GRAY = 'F3F4F6'
WHITE = 'FFFFFF'
THIN = Side(style='thin', color='D0D7DE')

headers = {
    'FUENTES': ['sourceId','sourceType','title','authorOrOrganization','editionOrVersion','publicationYear','language','publisherOrRepository','urlOrArchiveId','localFileName','rightsStatus','sourceScope','chaptersReviewed','pagesReviewed','extractionDate','extractedBy','notes'],
    'REGISTROS_DELTA62': ['recordId','formatVersion','product','domain','title','statement','recordType','state','provenance','sourceCommit','sourceFile','dependencies','confidence','humanReviewRequired','scope','limitations','unknowns','evidenceIds','relatedRecordIds','reviewerNotes'],
    'EVIDENCIA': ['evidenceId','recordId','sourceId','locationType','locationReference','verbatimExcerptOrData','context','interpretation','epistemicStatus','confidence','extractionNotes'],
    'GLOSARIO': ['termId','term','language','definition','synonyms','domain','sourceId','locationReference','epistemicStatus','notes'],
}

wb = Workbook()
ws = wb.active
ws.title = 'LEEME'
for s in ['PROMPT_IA','FUENTES','REGISTROS_DELTA62','EVIDENCIA','GLOSARIO','LISTAS']:
    wb.create_sheet(s)

# LEEME
readme = [
    ['PLANTILLA DELTA 6.2 PARA ARKI Y LUCA', ''],
    ['Versión del formato', 'DELTA-6.2-FEDERATED-KNOWLEDGE-1.0'],
    ['Fecha de creación', str(date.today())],
    ['Propósito', 'Capturar conocimiento extraído de libros, normas, cursos y documentos con provenance, estado epistemológico y revisión humana.'],
    ['Regla principal', 'No rellenar con opiniones generales. Cada registro debe poder rastrearse a una fuente y una ubicación concreta.'],
    ['Flujo recomendado', '1) Registrar la obra en FUENTES. 2) Extraer evidencia en EVIDENCIA. 3) Crear conclusiones atómicas en REGISTROS_DELTA62. 4) Completar términos en GLOSARIO. 5) Revisar antes de subir a ARKI o LUCA.'],
    ['Estados permitidos', 'CANDIDATE, STAGED, VALIDATED, CANONICAL, REJECTED, FROZEN. La IA normalmente usa CANDIDATE o STAGED.'],
    ['Importante', 'La IA no debe usar CANONICAL ni VALIDATED salvo que una persona autorizada lo indique. humanReviewRequired siempre debe ser TRUE.'],
    ['Qué no hacer', 'No inventar páginas, citas, autores, normas, cifras, derechos de uso ni conclusiones que el texto no permita sostener.'],
    ['Separación de productos', 'product=ARKI para arquitectura/BIM/ingeniería; product=LUCA para georreferenciación/visión/turismo/marketing/dispositivos; product=SHARED solo para conocimiento realmente común.'],
]
for row in readme:
    ws.append(row)
ws.column_dimensions['A'].width = 25
ws.column_dimensions['B'].width = 115
ws.freeze_panes = 'A2'

# Prompt sheet
prompt_rows = [
    ['PROMPT PARA LA IA EXTRACTORA', ''],
    ['Instrucción', 'Procesa únicamente el libro o documento que te entregue el usuario. No inventes contenido. Tu tarea no es resumir superficialmente; debes extraer unidades de conocimiento verificables y devolverlas en las hojas de esta plantilla.'],
    ['Paso 1', 'Registra primero la obra en FUENTES. Indica autor, título, edición, año, idioma, editorial o repositorio, archivo local, derechos conocidos y capítulos/páginas realmente revisados.'],
    ['Paso 2', 'Lee el índice para construir el mapa del documento, pero no afirmes que estudiaste el libro completo solo por leer el índice. Registra la cobertura real en chaptersReviewed y pagesReviewed.'],
    ['Paso 3', 'Extrae en EVIDENCIA citas breves, datos, definiciones, reglas, métodos o casos. Cada evidencia debe tener sourceId y locationReference exactos: página, capítulo, sección, figura, tabla o minuto.'],
    ['Paso 4', 'Convierte cada evidencia o conjunto pequeño de evidencias en un registro atómico de REGISTROS_DELTA62. Un registro debe expresar una sola idea verificable.'],
    ['Paso 5', 'Clasifica recordType como FACT, METHOD, RULE, CASE, UNKNOWN, DECISION, SOURCE o CAPABILITY. Si el texto no permite concluir algo, usa UNKNOWN y explica qué falta.'],
    ['Paso 6', 'Usa state=CANDIDATE o STAGED. Usa confidence=DECLARED si procede del texto sin corroboración; EVIDENCED si tiene evidencia localizada; REVIEWED solo después de revisión humana.'],
    ['Paso 7', 'Selecciona product=ARKI, LUCA o SHARED según el destino. No mezcles dominios solo porque aparezcan en el mismo libro.'],
    ['Paso 8', 'Completa provenance con una referencia legible, por ejemplo: SRC-001:p.45, cap.2, tabla 3. Completa sourceFile con el nombre exacto del archivo o identificador del documento.'],
    ['Paso 9', 'Añade dependencias, limitaciones, unknowns y relaciones con otros recordId cuando sean necesarias. No ocultes contradicciones entre autores o ediciones.'],
    ['Paso 10', 'Al finalizar, entrega también una nota de cobertura: qué partes leíste, qué partes no leíste, qué requiere corroboración y qué derechos de uso deben verificarse.'],
    ['Respuesta prohibida', 'No generes directamente una verdad canónica para ARKI/LUCA. Devuelve candidatos trazables para revisión humana.'],
]
ps = wb['PROMPT_IA']
for row in prompt_rows:
    ps.append(row)
ps.column_dimensions['A'].width = 24
ps.column_dimensions['B'].width = 120
ps.freeze_panes = 'A2'

# Data sheets
for sheet_name, cols in headers.items():
    sh = wb[sheet_name]
    sh.append(cols)
    sh.freeze_panes = 'A2'
    sh.auto_filter.ref = f'A1:{get_column_letter(len(cols))}2'
    for i, col in enumerate(cols, 1):
        sh.cell(1, i).font = Font(bold=True, color=WHITE)
        sh.cell(1, i).fill = PatternFill('solid', fgColor=NAVY)
        sh.cell(1, i).alignment = Alignment(wrap_text=True, vertical='center')
        sh.column_dimensions[get_column_letter(i)].width = max(16, min(34, len(col) + 5))
        sh.cell(2, i).fill = PatternFill('solid', fgColor=YELLOW)
        sh.cell(2, i).border = Border(bottom=THIN)
    sh.row_dimensions[1].height = 32
    sh.row_dimensions[2].height = 42
    for row in sh.iter_rows(min_row=1, max_row=2):
        for cell in row:
            cell.alignment = Alignment(wrap_text=True, vertical='top')

# Add one blank row with examples of required structure? Keep empty values, only comments in headers.
for sheet_name in headers:
    sh = wb[sheet_name]
    for cell in sh[1]:
        cell.comment = None

# Validations
lists = wb['LISTAS']
list_values = {
    'A': ('product', ['SHARED','ARKI','LUCA']),
    'B': ('recordType', ['FACT','METHOD','RULE','CASE','UNKNOWN','DECISION','SOURCE','CAPABILITY']),
    'C': ('state', ['CANDIDATE','STAGED','VALIDATED','CANONICAL','REJECTED','FROZEN']),
    'D': ('confidence', ['DECLARED','EVIDENCED','REVIEWED']),
    'E': ('humanReviewRequired', ['TRUE']),
    'F': ('rightsStatus', ['UNKNOWN','PUBLIC_DOMAIN','OPEN_LICENSE','LICENSE_REQUIRED','USER_PROVIDED','RESTRICTED']),
    'G': ('epistemicStatus', ['FACT','HYPOTHESIS','UNKNOWN','CONFLICTED','OBSERVATION','INFERENCE']),
    'H': ('sourceType', ['BOOK','STANDARD','ARTICLE','COURSE','REPORT','WEB_PAGE','VIDEO','DATASET','OTHER']),
}
for col, (name, values) in list_values.items():
    lists[f'{col}1'] = name
    for r, value in enumerate(values, 2):
        lists[f'{col}{r}'] = value
    lists.column_dimensions[col].width = 24
lists.sheet_state = 'hidden'

validations = [
    ('REGISTROS_DELTA62','C','LISTAS!$A$2:$A$4'),
    ('REGISTROS_DELTA62','G','LISTAS!$B$2:$B$9'),
    ('REGISTROS_DELTA62','H','LISTAS!$C$2:$C$7'),
    ('REGISTROS_DELTA62','M','LISTAS!$D$2:$D$4'),
    ('REGISTROS_DELTA62','N','LISTAS!$E$2:$E$2'),
    ('FUENTES','B','LISTAS!$H$2:$H$9'),
    ('FUENTES','K','LISTAS!$F$2:$F$7'),
    ('EVIDENCIA','I','LISTAS!$G$2:$G$7'),
    ('EVIDENCIA','J','LISTAS!$D$2:$D$4'),
]
for sheet_name, col, formula in validations:
    dv = DataValidation(type='list', formula1=f'={formula}', allow_blank=True)
    dv.error = 'Selecciona un valor permitido en la lista.'
    dv.errorTitle = 'Valor no permitido'
    dv.prompt = 'Usa la lista oficial DELTA 6.2.'
    dv.promptTitle = 'Clasificación DELTA 6.2'
    wb[sheet_name].add_data_validation(dv)
    dv.add(f'{col}2:{col}1000')

for sh in wb.worksheets:
    for row in sh.iter_rows():
        for cell in row:
            if cell.value is not None:
                cell.alignment = Alignment(wrap_text=True, vertical='top')

xlsx_path = OUT / 'ARKI_LUCA_DELTA62_PLANTILLA_VACIA.xlsx'
wb.save(xlsx_path)

# Word manual
D = Document()
styles = D.styles
styles['Normal'].font.name = 'Aptos'
styles['Normal'].font.size = Pt(10.5)
D.add_heading('Plantilla DELTA 6.2 para ARKI y LUCA', 0)
p = D.add_paragraph()
p.add_run('Guía de llenado y prompt para inteligencias artificiales extractoras').bold = True
D.add_paragraph('Versión: DELTA-6.2-FEDERATED-KNOWLEDGE-1.0. Este documento explica cómo llenar el archivo Excel vacío y cómo producir registros de conocimiento trazables a partir de libros, normas, cursos y documentos.')
D.add_heading('1. Propósito del archivo', level=1)
D.add_paragraph('La plantilla no está diseñada para guardar un resumen libre. Está diseñada para convertir una fuente documental en unidades pequeñas, localizables y revisables. ARKI o LUCA pueden procesar después esas unidades, pero no deben tratarlas como conocimiento canónico hasta que una persona autorizada las revise.')
D.add_heading('2. Flujo de trabajo', level=1)
D.add_paragraph('Primero se registra la fuente. Después se documenta la evidencia exacta. Luego se redactan registros atómicos de conocimiento. Finalmente se agregan términos, dependencias, limitaciones y dudas. La IA debe dejar los registros en CANDIDATE o STAGED y conservar siempre el requisito de revisión humana.')
D.add_heading('3. Qué debe buscar la IA en cada libro', level=1)
for title, text in [
    ('Índice y estructura', 'Identificar capítulos, partes, anexos, tablas, figuras y secuencia temática. El índice sirve para planificar la lectura, no demuestra que el contenido haya sido estudiado.'),
    ('Definiciones', 'Extraer términos técnicos y su definición tal como aparecen en el texto. Registrar la ubicación exacta y distinguir una definición del comentario del autor.'),
    ('Hechos y datos', 'Extraer afirmaciones comprobables, cifras, unidades, fechas, condiciones y alcance. No quitar las condiciones que limitan la afirmación.'),
    ('Métodos', 'Describir procedimientos, pasos, entradas, salidas, supuestos y criterios de validez. Separar un método de un ejemplo narrativo.'),
    ('Reglas y restricciones', 'Registrar obligaciones, prohibiciones, umbrales, excepciones y ámbito de aplicación. No convertir recomendaciones en normas obligatorias.'),
    ('Casos y ejemplos', 'Describir el contexto, problema, intervención, resultado y lección del caso. No generalizar un caso único sin indicarlo.'),
    ('Contradicciones y límites', 'Registrar desacuerdos entre fuentes, conceptos no definidos, datos faltantes y conclusiones que no pueden sostenerse.'),
    ('Vocabulario', 'Extraer términos relevantes para el glosario, incluyendo idioma, sinónimos, definición y fuente.'),
]:
    D.add_heading(title, level=2)
    D.add_paragraph(text)
D.add_heading('4. Cómo llenar cada hoja', level=1)
table = D.add_table(rows=1, cols=3)
table.alignment = WD_TABLE_ALIGNMENT.CENTER
table.style = 'Table Grid'
for cell, text in zip(table.rows[0].cells, ['Hoja', 'Qué contiene', 'Regla de calidad']):
    cell.text = text
for row in [
    ('FUENTES', 'Una fila por libro, norma, curso o documento.', 'Registrar la obra y la cobertura real. Si no se conoce el derecho de uso, usar UNKNOWN.'),
    ('REGISTROS_DELTA62', 'Una idea verificable por fila.', 'No juntar cinco ideas en una fila. Usar CANDIDATE o STAGED y humanReviewRequired=TRUE.'),
    ('EVIDENCIA', 'Citas, datos o fragmentos localizables.', 'Indicar página, capítulo, sección, figura, tabla o minuto. No inventar ubicaciones.'),
    ('GLOSARIO', 'Términos y definiciones.', 'Separar la definición del término de la interpretación de la IA.'),
]:
    cells = table.add_row().cells
    for cell, text in zip(cells, row):
        cell.text = text
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.TOP
D.add_heading('5. Prompt listo para copiar y pegar', level=1)
D.add_paragraph('Copia el siguiente texto en la otra inteligencia artificial junto con el libro o documento y el archivo Excel vacío:')
quote = D.add_paragraph()
quote.style = 'Intense Quote'
quote.add_run('Procesa únicamente el libro o documento que te entrego. Llena la plantilla DELTA-6.2-FEDERATED-KNOWLEDGE-1.0 sin inventar contenido. Registra primero la obra en FUENTES. Lee el índice para planificar, pero declara exactamente qué capítulos y páginas revisaste. Extrae en EVIDENCIA citas breves, datos, definiciones, reglas, métodos y casos con una ubicación verificable. Después crea en REGISTROS_DELTA62 registros atómicos: una sola afirmación por fila, con recordId único, formatVersion exacto, product ARKI, LUCA o SHARED, domain, title, statement, recordType, state CANDIDATE o STAGED, provenance, sourceCommit, sourceFile, dependencies, confidence y humanReviewRequired TRUE. Usa UNKNOWN cuando falten datos. No conviertas hipótesis en hechos. No uses CANONICAL ni VALIDATED salvo instrucción humana explícita. Completa GLOSARIO con los términos técnicos relevantes. Al final informa qué partes fueron leídas, qué partes no fueron leídas, qué contradicciones encontraste, qué datos faltan y qué derechos o licencias deben verificarse. Devuelve el Excel conservando las hojas y columnas de la plantilla.')
D.add_heading('6. Criterios de rechazo', level=1)
D.add_paragraph('El archivo será rechazado o puesto en cuarentena si contiene registros sin fuente, páginas inventadas, afirmaciones sin evidencia, estados canónicos usados por la IA, ausencia de unknowns, mezcla de productos sin justificación, pérdida de checksum o procedencia, o material cuya licencia no pueda verificarse.')
D.add_heading('7. Ejemplo mínimo de registro correcto', level=1)
D.add_paragraph('Un registro correcto podría afirmar: “El método X requiere las entradas A y B antes de calcular C”. Debe enlazar una evidencia concreta, indicar la página o sección, declarar su alcance y permanecer en CANDIDATE o STAGED. Un registro incorrecto diría: “El libro demuestra que X siempre funciona”, si el libro solo presenta un caso o no aporta condiciones de validez.')
D.add_heading('8. Entrega a ARKI o LUCA', level=1)
D.add_paragraph('Cuando el archivo esté completo, súbelo sin cambiar los nombres de las hojas. ARKI procesará los registros, verificará su estructura y conservará su estado de candidato. La incorporación a conocimiento reutilizable o canónico requiere revisión humana y no se realiza por el solo hecho de cargar el Excel.')
D.add_paragraph('Documento preparado para ARKI y LUCA. Autor: Manus AI.')

docx_path = OUT / 'ARKI_LUCA_DELTA62_GUIA_Y_PROMPT.docx'
D.save(docx_path)
print(xlsx_path)
print(docx_path)
