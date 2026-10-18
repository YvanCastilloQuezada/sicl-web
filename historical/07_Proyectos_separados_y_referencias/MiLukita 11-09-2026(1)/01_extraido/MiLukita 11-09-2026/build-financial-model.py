from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

OUT = Path('/home/ubuntu/ruleta-peru-online')
wb = Workbook()
ws = wb.active
ws.title = 'Supuestos'

rows = [
    ('Modelo', 'Multi Juegos Perú — escenario 2026', 'Modelo ilustrativo; no sustituye revisión contable, tributaria ni legal.'),
    ('Fecha de corte', '2026-08-25', 'Fecha de trabajo del proyecto'),
    ('Precio por jugada (S/)', 1.0, 'Supuesto de producto solicitado; no se activa dinero real'),
    ('RTP técnico', 0.85, 'Supuesto de escenario; validar por juego y ruleset'),
    ('Comisión Yape Empresa', 0.0295, 'Dato publicado por Yape; aplicar solo como referencia de cobro real'),
    ('Impuesto juegos a distancia', 0.12, 'Dato SUNAT; proxy ilustrativo para escenario regulado'),
    ('Gastos mantenimiento sobre ingreso neto', 0.02, 'Dato SUNAT; proxy ilustrativo'),
    ('UIT 2026 (S/)', 5500, 'Dato SUNAT, D.S. N.° 301-2025-EF'),
    ('Rondas/jugadas por usuario/mes', 8, 'Supuesto gerencial editable'),
]
ws.append(['Variable', 'Valor', 'Clasificación / nota'])
for r in rows: ws.append(r)

costs = wb.create_sheet('Costos fijos')
costs.append(['Partida', 'Mensual S/', 'Clasificación'])
fixed = [
    ('Nómina base (4 FTE)', 15000, 'Supuesto gerencial'),
    ('Cargas y beneficios sobre nómina', 4500, 'Supuesto gerencial: 30%'),
    ('Legal, contable y regulatorio', 12000, 'Supuesto gerencial; validar cotizaciones'),
    ('Soporte y operaciones', 8000, 'Supuesto gerencial'),
    ('Marketing y contenido', 15000, 'Supuesto gerencial'),
    ('Cloud, CDN y observabilidad', 3000, 'Supuesto gerencial'),
    ('Software, IA y herramientas', 2500, 'Supuesto gerencial'),
    ('Administración y seguros', 4000, 'Supuesto gerencial'),
]
for r in fixed: costs.append(r)
costs.append(['TOTAL', '=SUM(B2:B9)', 'Editable'])

sc = wb.create_sheet('Escenarios')
sc.append(['Escenario', 'Jugadas/mes', 'Ventas brutas', 'Premios RTP', 'Margen antes de fees', 'Fee pago', 'Ingreso neto juego', 'Mantenimiento proxy', 'Impuesto proxy', 'Costos fijos', 'Resultado operativo proxy', 'Punto equilibrio jugadas'])
for idx, (name, volume) in enumerate([('Conservador', 100000), ('Base', 300000), ('Expansión', 1000000)], start=2):
    sc.cell(idx,1,name)
    sc.cell(idx,2,volume)
    sc.cell(idx,3,f'=B{idx}*Supuestos!$B$4')
    sc.cell(idx,4,f'=C{idx}*Supuestos!$B$5')
    sc.cell(idx,5,f'=C{idx}-D{idx}')
    sc.cell(idx,6,f'=C{idx}*Supuestos!$B$6')
    sc.cell(idx,7,f'=C{idx}-D{idx}')
    sc.cell(idx,8,f'=G{idx}*Supuestos!$B$8')
    sc.cell(idx,9,f'=MAX(0,(G{idx}-H{idx})*Supuestos!$B$7)')
    sc.cell(idx,10,'=\'Costos fijos\'!$B$10')
    sc.cell(idx,11,f'=E{idx}-F{idx}-I{idx}-J{idx}')
    sc.cell(idx,12,f'=J{idx}/(Supuestos!$B$4*(1-Supuestos!$B$5-Supuestos!$B$6-(1-Supuestos!$B$5-(1-Supuestos!$B$5)*Supuestos!$B$8)*Supuestos!$B$7))')

notes = wb.create_sheet('Notas auditoría')
notes.append(['Tema', 'Tratamiento'])
notes.append(['Piloto actual', 'Créditos virtuales sin valor monetario; no se contabiliza ingreso, premio real, pago, retiro ni impuesto de operación real.'])
notes.append(['Escenario real futuro', 'El impuesto del 12% y la comisión Yape son referencias para modelar una posible operación posterior; requieren validación del contador y del asesor legal.'])
notes.append(['Costos', 'Solo Yape, UIT e impuesto tienen fuente externa en este modelo. Nómina, marketing, cloud, soporte y demás partidas son supuestos gerenciales editables, no cotizaciones.'])
notes.append(['RTP', 'El modelo usa RTP 85% como parámetro. Cada juego debe pasar su propia simulación y aprobación del ruleset antes de usarlo para decisión económica.'])
notes.append(['Exclusiones', 'No incluye IGV, renta, ISC u otras cargas no confirmadas; tampoco reservas, chargebacks, fraude, costos de certificación, homologación, geolocalización ni adquisición de hardware.'])

for sheet in wb.worksheets:
    sheet.freeze_panes = 'A2'
    sheet.auto_filter.ref = sheet.dimensions
    for cell in sheet[1]:
        cell.font = Font(bold=True, color='FFFFFF')
        cell.fill = PatternFill('solid', fgColor='0B5D49')
        cell.alignment = Alignment(horizontal='center')
    for column in range(1, sheet.max_column + 1):
        sheet.column_dimensions[get_column_letter(column)].width = min(52, max(16, max(len(str(sheet.cell(row=row, column=column).value or '')) for row in range(1, sheet.max_row + 1)) + 2))

for row in range(2, ws.max_row + 1):
    if row in (6,7): ws.cell(row,2).number_format = '0.00%'
    if row == 5: ws.cell(row,2).number_format = '0.00%'
for row in range(2, sc.max_row + 1):
    for col in range(3, 12): sc.cell(row,col).number_format = 'S/ #,##0.00'
    sc.cell(row,12).number_format = '#,##0'

xlsx = OUT / 'MJP_MODELO_FINANCIERO_PERU_2026.xlsx'
wb.save(xlsx)

md = OUT / 'MJP_MODELO_FINANCIERO_PERU_2026.md'
md.write_text('''# Modelo financiero preliminar — Multi Juegos Perú — 2026\n\n**Fecha de corte:** 25 de agosto de 2026. **Autor:** Manus AI.\n\n## Alcance y advertencia\n\nEste documento es un **modelo de planificación**, no una proyección certificada ni una opinión tributaria. El piloto vigente continúa exclusivamente en créditos virtuales, sin dinero real, cobros, retiros o conversión. La hoja de escenarios muestra qué ocurriría bajo una operación futura hipotética y regulada; no debe usarse para activar pagos. Un contador peruano y un asesor legal deben validar el tratamiento tributario, contractual y regulatorio antes de cualquier decisión.\n\n## Datos externos usados\n\n| Parámetro | Valor | Tratamiento | Fuente |\n| --- | ---: | --- | --- |\n| UIT 2026 | S/ 5,500 | Referencia tributaria | [1] |\n| Comisión Yape Empresa | 2.95% | Referencia de cobro; sujeto a contrato y producto | [2] |\n| Impuesto a juegos a distancia | 12% | Proxy de escenario futuro; no aplica al piloto virtual por sí solo | [3] |\n| Gastos de mantenimiento | 2% del ingreso neto | Proxy indicado por SUNAT; validar base exacta | [3] |\n\nLa RMV, alquileres, servicios, salarios y cotizaciones no se han rellenado con cifras inventadas. Las partidas internas aparecen como **supuestos editables** en el archivo XLSX y deben reemplazarse por cotizaciones, contratos o planillas reales.\n\n## Escenarios ilustrativos\n\nCon precio unitario de S/ 1 y RTP técnico de 85%, el margen bruto antes de pagos, impuestos y costos fijos es 15% de las ventas. El escenario de 12% de impuesto y 2% de mantenimiento aplica una fórmula simplificada para sensibilidad, no una liquidación tributaria definitiva.\n\n| Escenario | Jugadas/mes | Ventas brutas | Resultado operativo proxy* |\n| --- | ---: | ---: | ---: |\n| Conservador | 100,000 | S/ 100,000 | Se calcula en el XLSX |\n| Base | 300,000 | S/ 300,000 | Se calcula en el XLSX |\n| Expansión | 1,000,000 | S/ 1,000,000 | Se calcula en el XLSX |\n\n\* El resultado proxy descuenta premios al RTP indicado, comisión Yape, proxy de impuesto, mantenimiento y costos fijos gerenciales. No incluye IGV, renta, ISC, chargebacks, fraude, reservas, certificación, homologación, geolocalización, adquisición de hardware ni otros costos no confirmados.\n\n## Lectura para auditoría\n\nLa variable crítica es la combinación **RTP + volumen + costo de adquisición + costo regulatorio**. Con jugadas de S/ 1, un RTP de 85% deja un margen teórico estrecho antes de costos; por ello no es responsable presentar utilidad neta como hecho sin cotizaciones y sin definir el régimen tributario completo. La hoja **Supuestos** permite probar RTP de 85%, 86% u otro valor por escenario, pero la decisión de producto debe seguir las tablas y simulaciones de cada juego, no un promedio del catálogo.\n\nEl piloto debe mantener una contabilidad separada para créditos virtuales y cualquier futura operación monetaria. No se debe reutilizar el ledger virtual como libro de dinero real ni migrar saldos automáticamente. La eventual operación real requeriría una evaluación independiente de autorización MINCETUR, homologación, juego responsable, KYC/AML, geolocalización, pagos, protección de datos y fiscalidad.\n\n## Pendientes del contador y del asesor legal\n\n| Prioridad | Entregable | Responsable | Evidencia requerida |\n| --- | --- | --- | --- |\n| Alta | Cotizaciones de cloud, CDN, observabilidad y soporte | Finanzas/Operaciones | 3 cotizaciones o contratos |\n| Alta | Planilla y cargas laborales | Contador | Planilla y régimen aplicable |\n| Alta | Tratamiento tributario completo | Contador/Abogado | Memo firmado con base legal |\n| Alta | Estructura de pagos y conciliación | Finanzas | Contrato del adquirente y flujo de settlement |\n| Alta | Costos de homologación y certificación | Legal/QA | Cotizaciones de laboratorios autorizados |\n| Media | CAC, retención y conversión | Producto/Marketing | Cohortes observadas, no supuestas |\n\n## Referencias\n\n[1]: https://www.sunat.gob.pe/indicestasas/uit.html — SUNAT, “Unidad Impositiva Tributaria - UIT”, valor 2026: S/ 5,500.\n\n[2]: https://www.yape.com.pe/productos/yape-empresa — Yape, “Yape Empresa”, tarifa de recaudación publicada en su página de producto.\n\n[3]: https://emprender.sunat.gob.pe/principales-impuestos/otros/impuesto-los-juegos-apuestas-deportivas-distancia — SUNAT, “Impuesto a los juegos y apuestas deportivas a distancia”.\n\n[4]: https://apuestasdeportivas.mincetur.gob.pe/ — MINCETUR, portal de juegos online y apuestas deportivas a distancia, legislación y registros.\n''', encoding='utf-8')
print(xlsx)
print(md)
