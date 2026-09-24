from pathlib import Path
from xml.sax.saxutils import escape

OUT = Path('/home/ubuntu/sicl-web/outputs')
OUT.mkdir(parents=True, exist_ok=True)

BG = '#071a2b'
LINE = '#8de34f'
ACCENT = '#42d9c8'
TEXT = '#eaf6ef'
MUTED = '#9ab4b7'
ROOM = '#102d3f'
SERVICE = '#25394a'


def svg_start(title, subtitle, width=1400, height=920):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
<rect width="100%" height="100%" fill="{BG}"/>
<text x="55" y="55" fill="{LINE}" font-family="Arial" font-size="18" letter-spacing="3">COLEGIO DE BIÓLOGOS DEL PERÚ · ARKI</text>
<text x="55" y="95" fill="{TEXT}" font-family="Arial" font-size="34" font-weight="bold">{escape(title)}</text>
<text x="55" y="127" fill="{MUTED}" font-family="Arial" font-size="16">{escape(subtitle)}</text>
'''

def rect(x,y,w,h,label,fill=ROOM,fs=15):
    return f'''<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="5" fill="{fill}" stroke="{LINE}" stroke-width="2"/>
<text x="{x+w/2}" y="{y+h/2-3}" text-anchor="middle" fill="{TEXT}" font-family="Arial" font-size="{fs}" font-weight="bold">{escape(label)}</text>
'''

def note(x,y,text):
    return f'<text x="{x}" y="{y}" fill="{MUTED}" font-family="Arial" font-size="13">{escape(text)}</text>\n'

def common_end():
    return f'''<g transform="translate(1190 135)"><path d="M0 35 L18 0 L36 35" fill="none" stroke="{ACCENT}" stroke-width="3"/><text x="18" y="58" text-anchor="middle" fill="{TEXT}" font-family="Arial" font-size="14">N</text></g>
<line x1="55" y1="850" x2="355" y2="850" stroke="{TEXT}" stroke-width="3"/><text x="205" y="878" text-anchor="middle" fill="{MUTED}" font-family="Arial" font-size="13">escala gráfica conceptual · 10 m</text>
<text x="55" y="905" fill="{MUTED}" font-family="Arial" font-size="12">AI_PROPOSED · Planta conceptual no apta para construcción · verificar RNE, aforos, bioseguridad, estructura e instalaciones.</text></svg>'''

# Laboratories: 60 x 30 m = 1,800 m² conceptual, with separate public/service circulation.
s = svg_start('PLANTA PRIMER PISO · ÁREA DE LABORATORIOS', 'Ala científica de 60 m × 30 m · acceso controlado desde parque y circulación técnica posterior')
s += '<rect x="120" y="175" width="960" height="480" fill="none" stroke="#d7f6d0" stroke-width="4"/>\n'
s += rect(120,175,960,55,'GALERÍA PÚBLICA / ACCESO DESDE PARQUE',fill='#183f45',fs=16)
s += rect(120,600,960,55,'CIRCULACIÓN TÉCNICA · CARGA · RESIDUOS · MANTENIMIENTO',fill=SERVICE,fs=15)
# top lab band
s += rect(120,230,320,185,'LABORATORIO DE ECOLOGÍA Y BIODIVERSIDAD',fill=ROOM,fs=15)
s += rect(440,230,320,185,'LABORATORIO DE BIOLOGÍA MOLECULAR',fill=ROOM,fs=15)
s += rect(760,230,320,185,'LABORATORIO DE DOCENCIA Y MICROSCOPÍA',fill=ROOM,fs=15)
# support band
s += rect(120,415,160,185,'PREPARACIÓN / LAVADO',fill=SERVICE,fs=13)
s += rect(280,415,160,185,'ALMACÉN LIMPIO',fill=SERVICE,fs=13)
s += rect(440,415,160,185,'VESTUARIO Y EPP',fill=SERVICE,fs=13)
s += rect(600,415,160,185,'CÁMARA FRÍA / MUESTRAS',fill=SERVICE,fs=13)
s += rect(760,415,160,185,'RESIDUOS CONTROLADOS',fill=SERVICE,fs=13)
s += rect(920,415,160,185,'OFICINA TÉCNICA',fill=SERVICE,fs=13)
# doors and arrows
s += '<path d="M600 175 L600 230 M285 600 L285 655 M885 600 L885 655" stroke="#ffcf62" stroke-width="5"/>\n'
s += note(120,700,'Criterio: separar circulación pública, técnica y de muestras; definir bioseguridad según operación real.')
s += note(120,728,'Laboratorios dimensionados conceptualmente; equipos, gases, extracción, presión y residuos requieren ingeniería especializada.')
s += note(120,775,'Área referencial: 1.800 m² · modulación estructural sugerida: 8 m × 8 m · patios de servicio posibles en fachada posterior.')
s += common_end()
(OUT/'colegio_biologos_planta_laboratorios.svg').write_text(s, encoding='utf-8')

# Administration: 45 x 20 m = 900 m² conceptual.
s = svg_start('PLANTA PRIMER PISO · ÁREA ADMINISTRATIVA', 'Franja de 45 m × 20 m · atención colegiada al frente y oficinas alrededor de patio de trabajo')
s += '<rect x="120" y="175" width="960" height="320" fill="none" stroke="#d7f6d0" stroke-width="4"/>\n'
s += rect(120,175,960,55,'PLAZA / ACCESO INSTITUCIONAL · ATENCIÓN PÚBLICA',fill='#183f45',fs=16)
s += rect(120,230,190,145,'RECEPCIÓN Y CONTROL',fs=14)
s += rect(310,230,190,145,'ATENCIÓN AL COLEGIADO',fs=14)
s += rect(500,230,190,145,'SALA DE ESPERA',fs=14)
s += rect(690,230,190,145,'SECRETARÍA GENERAL',fs=14)
s += rect(880,230,200,145,'ARCHIVO / MESA DE PARTES',fs=14)
s += rect(120,375,190,120,'DIRECCIÓN',fill=SERVICE,fs=14)
s += rect(310,375,190,120,'SALA DE CONSEJO',fill=SERVICE,fs=14)
s += rect(500,375,190,120,'OFICINAS ABIERTAS',fill=SERVICE,fs=14)
s += rect(690,375,190,120,'RR. HH. / FINANZAS',fill=SERVICE,fs=14)
s += rect(880,375,200,120,'SERVICIOS / DATA',fill=SERVICE,fs=14)
s += rect(120,495,960,55,'GALERÍA INTERIOR HACIA PARQUE CIENTÍFICO',fill='#183f45',fs=16)
s += '<path d="M215 175 L215 230 M405 175 L405 230 M595 175 L595 230 M785 175 L785 230 M980 175 L980 230" stroke="#ffcf62" stroke-width="5"/>\n'
s += note(120,600,'Criterio: atención pública en primera línea; administración y consejo con control visual hacia el parque.')
s += note(120,628,'Área referencial: 900 m² · posibilidad de crecimiento en segundo nivel parcial y conexión directa con biblioteca/aulas.')
s += note(120,676,'El patio central del campus se ubica al fondo de la galería y recibe la escultura de ADN de 15 m como hito institucional.')
s += common_end()
(OUT/'colegio_biologos_planta_administracion.svg').write_text(s, encoding='utf-8')

try:
    import cairosvg
    for name in ('colegio_biologos_planta_laboratorios','colegio_biologos_planta_administracion'):
        cairosvg.svg2png(url=str(OUT/f'{name}.svg'), write_to=str(OUT/f'{name}.png'), output_width=2400, output_height=1577)
except Exception as exc:
    (OUT/'floorplan_conversion_note.txt').write_text(f'PNG conversion unavailable: {exc}\nSVG files are the canonical editable deliverables.\n', encoding='utf-8')

print('Created conceptual floor plans')
for p in sorted(OUT.glob('colegio_biologos_planta_*')):
    print(p)
