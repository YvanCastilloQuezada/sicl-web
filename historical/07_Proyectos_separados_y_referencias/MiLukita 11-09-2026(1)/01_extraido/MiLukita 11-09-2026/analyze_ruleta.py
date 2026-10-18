from pathlib import Path
from collections import Counter
import json
import zipfile
import xml.etree.ElementTree as ET
import openpyxl

path = Path('/home/ubuntu/projects/ruleta-peru-00154ef9/Ruleta Perú 28-7-2024.xlsm')
out = Path('/home/ubuntu/ruleta_analysis.json')

wb_f = openpyxl.load_workbook(path, data_only=False, keep_vba=True, read_only=False)
wb_v = openpyxl.load_workbook(path, data_only=True, keep_vba=True, read_only=False)

report = {
    'file': str(path),
    'size_bytes': path.stat().st_size,
    'sheetnames': wb_f.sheetnames,
    'properties': {
        'creator': wb_f.properties.creator,
        'title': wb_f.properties.title,
        'subject': wb_f.properties.subject,
        'description': wb_f.properties.description,
        'created': str(wb_f.properties.created),
        'modified': str(wb_f.properties.modified),
    },
    'defined_names': [],
    'sheets': [],
}

try:
    for name, obj in wb_f.defined_names.items():
        report['defined_names'].append({'name': name, 'value': str(obj.attr_text), 'hidden': bool(obj.hidden), 'localSheetId': obj.localSheetId})
except Exception as e:
    report['defined_names_error'] = repr(e)

for ws_f, ws_v in zip(wb_f.worksheets, wb_v.worksheets):
    formulas = []
    nonempty = []
    types = Counter()
    formula_by_row = Counter()
    for row in ws_f.iter_rows():
        for c in row:
            if c.value is not None:
                nonempty.append({'cell': c.coordinate, 'value': str(c.value), 'data_type': c.data_type, 'style_id': c.style_id})
                types[c.data_type] += 1
                if c.data_type == 'f' or (isinstance(c.value, str) and c.value.startswith('=')):
                    cv = ws_v[c.coordinate].value
                    formulas.append({'cell': c.coordinate, 'formula': str(c.value), 'cached_value': cv})
                    formula_by_row[c.row] += 1
    validations = []
    try:
        for dv in ws_f.data_validations.dataValidation:
            validations.append({'type': dv.type, 'formula1': dv.formula1, 'formula2': dv.formula2, 'sqref': str(dv.sqref), 'allow_blank': dv.allow_blank, 'error': dv.error, 'prompt': dv.prompt})
    except Exception as e:
        validations.append({'error': repr(e)})
    hyperlinks = []
    for row in ws_f.iter_rows():
        for c in row:
            if c.hyperlink:
                hyperlinks.append({'cell': c.coordinate, 'target': c.hyperlink.target, 'location': c.hyperlink.location, 'display': c.hyperlink.display})
    comments = []
    for row in ws_f.iter_rows():
        for c in row:
            if c.comment:
                comments.append({'cell': c.coordinate, 'author': c.comment.author, 'text': c.comment.text})
    merged = [str(x) for x in ws_f.merged_cells.ranges]
    sheet = {
        'title': ws_f.title,
        'state': ws_f.sheet_state,
        'dimensions': ws_f.calculate_dimension(),
        'max_row': ws_f.max_row,
        'max_column': ws_f.max_column,
        'freeze_panes': str(ws_f.freeze_panes) if ws_f.freeze_panes else None,
        'auto_filter': str(ws_f.auto_filter.ref) if ws_f.auto_filter and ws_f.auto_filter.ref else None,
        'merged_ranges': merged,
        'formula_count': len(formulas),
        'formula_rows_top': formula_by_row.most_common(20),
        'cell_type_counts': dict(types),
        'nonempty_count': len(nonempty),
        'validations': validations,
        'hyperlinks': hyperlinks,
        'comments': comments,
        'charts_count': len(ws_f._charts),
        'images_count': len(ws_f._images),
        'tables': list(ws_f.tables.keys()),
        'formulas': formulas,
        'sample_nonempty': nonempty[:250],
        'row_values': [],
    }
    # Capture compact row-wise view of populated region, values only, capped to 120 rows x 30 cols.
    for r in range(1, min(ws_f.max_row, 120) + 1):
        vals = []
        any_val = False
        for c in range(1, min(ws_f.max_column, 30) + 1):
            v = ws_v.cell(r, c).value
            if v is not None:
                any_val = True
            vals.append(v)
        if any_val:
            sheet['row_values'].append({'row': r, 'values': vals})
    report['sheets'].append(sheet)

with zipfile.ZipFile(path) as z:
    names = z.namelist()
    report['zip_entries'] = names
    report['vba_project_bytes'] = z.getinfo('xl/vbaProject.bin').file_size if 'xl/vbaProject.bin' in names else 0
    report['activeX_entries'] = [n for n in names if '/activeX/' in n]
    report['external_link_entries'] = [n for n in names if 'externalLink' in n]
    report['custom_ui_entries'] = [n for n in names if 'customUI' in n]
    report['connections_entries'] = [n for n in names if 'connections' in n]
    report['calc_chain_bytes'] = z.getinfo('xl/calcChain.xml').file_size if 'xl/calcChain.xml' in names else 0
    # Extract XML-level workbook metadata, relationships, and external link target.
    for ename in ['xl/workbook.xml', 'xl/_rels/workbook.xml.rels', 'xl/externalLinks/externalLink1.xml', 'xl/externalLinks/_rels/externalLink1.xml.rels']:
        if ename in names:
            report[ename] = z.read(ename).decode('utf-8', errors='replace')[:200000]

out.write_text(json.dumps(report, ensure_ascii=False, indent=2, default=str), encoding='utf-8')
print(out)
print('sheets', wb_f.sheetnames)
for s in report['sheets']:
    print(s['title'], s['state'], s['dimensions'], 'nonempty', s['nonempty_count'], 'formulas', s['formula_count'], 'validations', len(s['validations']), 'charts', s['charts_count'], 'images', s['images_count'], 'tables', s['tables'])
print('defined_names', len(report['defined_names']))
print('vba_bytes', report['vba_project_bytes'], 'activex', len(report['activeX_entries']), 'external_links', report['external_link_entries'])
