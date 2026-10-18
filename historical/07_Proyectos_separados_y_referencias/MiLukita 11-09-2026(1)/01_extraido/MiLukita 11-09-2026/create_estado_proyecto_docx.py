from __future__ import annotations

from pathlib import Path
from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

OUTPUT = Path('/home/ubuntu/financial_deliverables/informe_ejecutivo_estado_y_cronograma_multi_juegos_peru.docx')

GREEN = '0D5D43'
GOLD = 'BB8A36'
INK = '15221B'
MINT = 'E7F6EC'
PALE_GOLD = 'F8F0DC'
RED = 'B42318'


def shade(cell, fill: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:fill'), fill)
    tc_pr.append(shd)


def set_cell_text(cell, text: str, bold: bool = False, color: str | None = None, size: int = 9) -> None:
    cell.text = ''
    paragraph = cell.paragraphs[0]
    run = paragraph.add_run(text)
    run.bold = bold
    run.font.name = 'Aptos'
    run.font.size = Pt(size)
    if color:
        run.font.color.rgb = RGBColor.from_string(color)
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER


def add_heading(document: Document, text: str, level: int = 1) -> None:
    paragraph = document.add_paragraph()
    paragraph.paragraph_format.space_before = Pt(14 if level == 1 else 9)
    paragraph.paragraph_format.space_after = Pt(6)
    run = paragraph.add_run(text)
    run.font.name = 'Aptos Display'
    run.font.size = Pt(16 if level == 1 else 12)
    run.bold = True
    run.font.color.rgb = RGBColor.from_string(GREEN if level == 1 else INK)


def add_body(document: Document, text: str, bold_start: str | None = None) -> None:
    paragraph = document.add_paragraph()
    paragraph.paragraph_format.space_after = Pt(6)
    paragraph.paragraph_format.line_spacing = 1.15
    if bold_start and text.startswith(bold_start):
        first = paragraph.add_run(bold_start)
        first.bold = True
        first.font.name = 'Aptos'
        first.font.size = Pt(10.5)
        rest = paragraph.add_run(text[len(bold_start):])
        rest.font.name = 'Aptos'
        rest.font.size = Pt(10.5)
    else:
        run = paragraph.add_run(text)
        run.font.name = 'Aptos'
        run.font.size = Pt(10.5)


def add_table(document: Document, headers: list[str], rows: list[list[str]], widths: list[float] | None = None) -> None:
    table = document.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.style = 'Table Grid'
    for index, header in enumerate(headers):
        cell = table.rows[0].cells[index]
        shade(cell, GREEN)
        set_cell_text(cell, header, bold=True, color='FFFFFF', size=8.5)
        if widths:
            cell.width = Cm(widths[index])
    for row in rows:
        cells = table.add_row().cells
        for index, value in enumerate(row):
            if value.startswith('IMPLEMENTADO'):
                shade(cells[index], MINT)
                set_cell_text(cells[index], value, bold=True, color=GREEN, size=8.5)
            elif value.startswith('PENDIENTE') or value.startswith('BLOQUEADO'):
                shade(cells[index], PALE_GOLD)
                set_cell_text(cells[index], value, bold=True, color=RED if value.startswith('BLOQUEADO') else GOLD, size=8.5)
            else:
                set_cell_text(cells[index], value, size=8.5)
            if widths:
                cells[index].width = Cm(widths[index])
    document.add_paragraph().paragraph_format.space_after = Pt(4)


def add_callout(document: Document, title: str, text: str, fill: str = PALE_GOLD) -> None:
    table = document.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    shade(cell, fill)
    cell.text = ''
    p = cell.paragraphs[0]
    r1 = p.add_run(title + ' ')
    r1.bold = True
    r1.font.name = 'Aptos'
    r1.font.size = Pt(10)
    r1.font.color.rgb = RGBColor.from_string(GREEN)
    r2 = p.add_run(text)
    r2.font.name = 'Aptos'
    r2.font.size = Pt(10)
    document.add_paragraph().paragraph_format.space_after = Pt(5)


def main() -> None:
    document = Document()
    section = document.sections[0]
    section.top_margin = Cm(1.7)
    section.bottom_margin = Cm(1.6)
    section.left_margin = Cm(1.8)
    section.right_margin = Cm(1.8)

    styles = document.styles
    styles['Normal'].font.name = 'Aptos'
    styles['Normal'].font.size = Pt(10.5)

    header = section.header.paragraphs[0]
    header.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run = header.add_run('MULTI JUEGOS PERÚ  |  ESTADO EJECUTIVO')
    run.font.name = 'Aptos'
    run.font.size = Pt(8)
    run.font.color.rgb = RGBColor.from_string(GREEN)

    footer = section.footer.paragraphs[0]
    footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    footer_run = footer.add_run('Piloto gratuito · créditos virtuales · sin dinero real · 24 de agosto de 2026')
    footer_run.font.name = 'Aptos'
    footer_run.font.size = Pt(8)
    footer_run.font.color.rgb = RGBColor.from_string('66756D')

    title = document.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = title.add_run('Informe ejecutivo de estado, cronograma y propuestas')
    run.font.name = 'Aptos Display'
    run.font.size = Pt(24)
    run.bold = True
    run.font.color.rgb = RGBColor.from_string(GREEN)
    subtitle = document.add_paragraph()
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    subtitle_run = subtitle.add_run('Multi Juegos Perú · Corte de estado: 24 de agosto de 2026')
    subtitle_run.font.name = 'Aptos'
    subtitle_run.font.size = Pt(11)
    subtitle_run.font.color.rgb = RGBColor.from_string(GOLD)

    add_callout(
        document,
        'Diagnóstico ejecutivo:',
        'el proyecto se encuentra en condición de piloto gratuito funcional, verificable y endurecido en seguridad básica. La prioridad ya no es añadir mecánicas de retención: es validar comprensión, accesibilidad e integridad con usuarios adultos y pruebas end-to-end aisladas.',
        MINT,
    )

    add_heading(document, '1. Estado actual')
    add_body(document, 'El portal ya funciona como demostración gratuita de juegos virtuales para Perú y Sudamérica. Mantiene separación explícita entre interfaz visual y resultados de servidor, no admite depósitos ni retiros y conserva evidencia comprobable para rondas, reglas y resultados.')
    add_table(document, ['Bloque', 'Estado', 'Resultado actual'], [
        ['Juegos y experiencia', 'IMPLEMENTADO', 'Ruleta, Jackpot, Bingo, Lotería y Trío 13 con créditos virtuales, reglas y comprobantes.'],
        ['Equidad verificable', 'IMPLEMENTADO', 'Semilla/hash, HMAC-SHA-256, rechazo uniforme, reglas versionadas y auditoría encadenada.'],
        ['MultiMarket', 'IMPLEMENTADO', 'Mercados virtuales curados, Sí/No, fuentes, cierre, resolución, anulación y reembolso virtual.'],
        ['Impacto y finanzas', 'IMPLEMENTADO / DOCUMENTADO', 'Modelo de gastos/utilidad y propuesta de aporte institucional; no se declara donación ejecutada.'],
        ['Seguridad HTTP', 'IMPLEMENTADO', 'Helmet, límites de solicitud, x-request-id, salud de aplicación y de base de datos.'],
        ['Accesibilidad', 'IMPLEMENTADO', 'Escala 100/125/150 %, alto contraste y reducción de movimiento en escritorio y móvil.'],
        ['Calidad', 'IMPLEMENTADO', 'TypeScript sin errores y 18 pruebas Vitest aprobadas al corte.'],
    ], [3.1, 3.3, 10.4])

    add_heading(document, '2. Qué se implementó en la última fase')
    add_body(document, 'La última fase elevó el estándar técnico y operativo sin cambiar las probabilidades ni incentivar más participación. Se añadieron cabeceras de protección, límites por ventana, identificadores de solicitud, rutas /health y /health/db, preferencias de accesibilidad persistentes, plan UAT, borrador de privacidad y procedimiento de incidentes.')
    add_body(document, 'El checkpoint de referencia es acea1071. La documentación y el código están preparados para auditoría en el consolidado actualizado entregado por separado.')

    add_heading(document, '3. Qué falta implementar')
    add_table(document, ['Prioridad', 'Pendiente', 'Por qué importa', 'Cierre esperado'], [
        ['Alta', 'UAT moderado con personas adultas', 'Valida comprensión real del carácter gratuito, verificación y límites responsables.', 'Dos rondas moderadas; hallazgos críticos corregidos y tareas repetidas.'],
        ['Alta', 'Revisión profesional de privacidad y términos', 'Debe definir entidad responsable, proveedores, canales y bases legales reales.', 'Textos legales revisados antes de abrir registro público.'],
        ['Alta', 'Pruebas E2E e integración aislada', 'Protege los flujos de ingreso, reserva, cierre, liquidación y verificación.', 'Flujos críticos repetibles contra base de prueba.'],
        ['Media', 'CSP estricta de producción', 'Reduce superficie web cuando se inventaríen activos permitidos.', 'Política probada sin romper fuentes, imágenes ni recursos.'],
        ['Media', 'Carga, observabilidad y decisión de escala', 'Evita incorporar Redis/colas sin datos de tráfico reales.', 'Métricas, alertas y prueba de carga con escenario realista.'],
        ['Media', 'Revisión independiente de RNG y reglas', 'Aporta confianza externa antes de ampliar audiencia.', 'Informe de tercero sobre sorteo, redondeo y liquidación virtual.'],
    ], [1.7, 4.1, 5.5, 5.5])

    add_heading(document, '4. Cronograma de trabajo propuesto')
    add_table(document, ['Fase', 'Horizonte', 'Trabajo', 'Puerta de decisión'], [
        ['0 · Completada', 'Hoy', 'Producto virtual, MultiMarket curado, seguridad y accesibilidad base.', 'Checkpoint acea1071 y pruebas aprobadas.'],
        ['1 · Validación externa', '1–2 semanas', 'UAT, incidentes simulados, ajustes de comprensión y accesibilidad.', 'Sin hallazgos críticos; límites responsables comprendidos.'],
        ['2 · Endurecimiento', '2–4 semanas', 'E2E, integración DB aislada, CSP, trazabilidad técnica y revisión legal.', 'Flujos críticos reproducibles y privacidad aprobada.'],
        ['3 · Piloto controlado', 'Después de fase 2', 'Audiencia limitada, sin dinero real, medición ética y respuesta a incidentes.', 'Revisión de riesgo antes de ampliar alcance.'],
        ['4 · Evaluación regulada', 'Sin fecha comprometida', 'Decidir si conviene una operación regulada, pausar o rediseñar.', 'Entidad, certificación, controles y asesoría aplicables.'],
    ], [3.2, 3.0, 6.6, 4.0])
    add_callout(document, 'Sobre plazos:', 'son estimaciones de planificación y dependen de UAT, revisión legal, carga real y auditoría independiente. No representan una fecha comprometida de lanzamiento.', PALE_GOLD)

    add_heading(document, '5. Propuestas priorizadas')
    add_table(document, ['Propuesta', 'Decisión', 'Justificación'], [
        ['Panel personal responsable', 'PROPONER DESPUÉS DEL UAT', 'Resumen de límites, última verificación y misiones no monetarias; no debe medir ni optimizar tiempo de sesión.'],
        ['Pruebas E2E e integración DB', 'PRIORIDAD ALTA', 'Entrega la evidencia técnica que falta para flujos críticos y reduce regresiones.'],
        ['Programa educativo de juego responsable', 'PROPONER DESPUÉS DEL UAT', 'Contenido breve y voluntario con evaluación de comprensión; no vinculado a premios por frecuencia.'],
        ['Temáticas visuales estacionales', 'PRIORIDAD MEDIA', 'Puede renovar la interfaz sin modificar matemáticas, pagos ni frecuencia de participación.'],
        ['Analítica ética de operación', 'PRIORIDAD MEDIA', 'RTP observado, errores, accesibilidad e incidentes; excluir métricas para empujar repetición.'],
    ], [4.0, 4.4, 8.4])

    add_heading(document, '6. Propuestas que no recomiendo implementar ahora')
    add_body(document, 'No recomiendo activar torneos semanales, rachas premiadas, bonos por frecuencia, referidos con multiplicadores, chat en vivo, intercambio P2P de insignias, mercados flash, pozos competitivos de contratos ni comodines que modifiquen pagos. Pueden incrementar presión temporal, abuso, riesgo regulatorio o uso excesivo.')
    add_body(document, 'También quedan bloqueados dinero real, Yape, depósitos, retiros, conversión de créditos, mercados políticos/financieros/sensibles, creación automática de mercados y descuentos obligatorios de premios para fines sociales. Cualquier futuro aporte social debe ser institucional, trazable y calculado sobre utilidad neta elegible.')

    add_heading(document, '7. Recomendación de dirección')
    add_body(document, 'La mejor decisión es mantener el producto en piloto gratuito y concentrar el siguiente ciclo en evidencia: UAT, pruebas end-to-end, revisión de privacidad y una auditoría independiente de RNG. Después, decidir con datos si conviene ampliar audiencia. No recomiendo abrir dinero real ni convertir el producto en una plataforma de alta frecuencia hasta que existan entidad operadora, certificaciones y controles profesionales verificables.')

    add_heading(document, '8. Artefactos para auditoría')
    add_body(document, 'La evidencia principal se encuentra en el consolidado de auditoría actualizado, el modelo financiero editable, la presentación ejecutiva, los documentos de incidentes/privacidad/UAT, las migraciones Drizzle, las pruebas Vitest y el checkpoint acea1071. Los archivos de entorno, dependencias instaladas, logs temporales y el XLSM legado permanecen excluidos por seguridad y privacidad.')

    document.save(OUTPUT)
    print(OUTPUT)


if __name__ == '__main__':
    main()
