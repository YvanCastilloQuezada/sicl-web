from pathlib import Path
from xml.sax.saxutils import escape

OUT = Path('/home/ubuntu/sicl-web/outputs')
OUT.mkdir(parents=True, exist_ok=True)
W, H = 1600, 1100

def svg_start(title):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><rect width="100%" height="100%" fill="#f7f5ef"/><style>.t{{font-family:Arial,sans-serif;fill:#1e2933}}.h{{font-size:34px;font-weight:700}}.s{{font-size:18px}}.d{{stroke:#1e2933;stroke-width:3;fill:none}}.thin{{stroke:#52616b;stroke-width:2;fill:none}}.dim{{stroke:#b45309;stroke-width:2;fill:none}}.shade{{fill:#d8d1c4;stroke:#1e2933;stroke-width:3}}.green{{fill:#b7c9a8;stroke:#49634c;stroke-width:2}}.water{{fill:#94c6d8;stroke:#286074;stroke-width:3}}</style><text x="60" y="64" class="t h">{escape(title)}</text>'''

def end_svg(meta):
    return f'<text x="60" y="1045" class="t s">ARKI · Propuesta conceptual · {escape(meta)}</text></svg>'

def dim(x1,y1,x2,y2,label):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" class="dim"/><text x="{(x1+x2)/2}" y="{(y1+y2)/2-8}" class="t s" text-anchor="middle">{escape(label)}</text>'

def save(name, body, meta):
    (OUT/name).write_text(svg_start(body[0])+body[1]+end_svg(meta), encoding='utf-8')

# Site / ground floor: assumed 60 x 100 m lot, 20 x 12.5 m house footprint.
body = ('PLANTA GENERAL · IMPLANTACIÓN Y NIVEL 01', '''<rect x="170" y="170" width="1200" height="700" class="green"/><rect x="570" y="360" width="460" height="290" class="shade"/><rect x="610" y="680" width="380" height="100" class="water"/><rect x="1080" y="280" width="190" height="300" class="water"/><path d="M250 250 C360 190 470 240 500 300 M1120 720 C1220 650 1300 700 1330 780" class="thin"/><text x="610" y="405" class="t s">CASA · 20,00 × 12,50 m</text><text x="630" y="465" class="t s">sala / comedor / cocina</text><text x="650" y="510" class="t s">patio central ajardinado</text><text x="675" y="555" class="t s">escalera + ascensor</text><text x="680" y="735" class="t s">piscina 16,00 × 4,00 m</text><text x="1095" y="430" class="t s">piletas</text><text x="220" y="220" class="t s">parque de acceso</text><text x="1110" y="820" class="t s">jardín seco / sombra</text>'''+dim(570,335,1030,335,'20,00 m')+dim(540,360,540,650,'12,50 m')+dim(170,900,1370,900,'60,00 m · supuesto')+dim(1400,170,1400,870,'100,00 m · supuesto'), 'Escala conceptual 1:200 · Norte arriba · terreno supuesto 6.000 m²')
save('01_planta_general_implantacion.svg', body, body[0])

body = ('PLANTA TIPO · NIVELES 02–04', '''<rect x="390" y="260" width="820" height="520" class="shade"/><rect x="455" y="325" width="280" height="160" fill="#eee9df" class="thin"/><rect x="790" y="325" width="350" height="160" fill="#eee9df" class="thin"/><rect x="455" y="540" width="280" height="160" fill="#eee9df" class="thin"/><rect x="790" y="540" width="350" height="160" fill="#eee9df" class="thin"/><rect x="745" y="470" width="45" height="130" fill="#b7c9a8" stroke="#49634c" stroke-width="2"/><text x="510" y="415" class="t s">suite principal</text><text x="855" y="415" class="t s">estar / estudio</text><text x="510" y="630" class="t s">dormitorio 02</text><text x="855" y="630" class="t s">dormitorio 03</text><text x="758" y="540" class="t s" transform="rotate(-90 758 540)">patio</text>'''+dim(390,230,1210,230,'20,00 m')+dim(350,260,350,780,'12,50 m')+dim(390,830,1210,830,'250 m² aprox. por nivel'), 'Escala conceptual 1:100 · Niveles 02–04 modulados · distribución a validar')
save('02_planta_tipo_niveles_02_04.svg', body, body[0])

body = ('CORTE LONGITUDINAL · PATIO Y PISCINA', '''<rect x="220" y="770" width="1160" height="24" fill="#b7c9a8"/><rect x="430" y="260" width="670" height="510" class="shade"/><line x1="430" y1="390" x2="1100" y2="390" class="d"/><line x1="430" y1="515" x2="1100" y2="515" class="d"/><line x1="430" y1="640" x2="1100" y2="640" class="d"/><rect x="625" y="390" width="160" height="250" fill="#b7c9a8" stroke="#49634c" stroke-width="2"/><rect x="930" y="690" width="360" height="80" class="water"/><text x="470" y="350" class="t s">NIVEL 04 · dormitorio / terraza</text><text x="470" y="475" class="t s">NIVEL 03 · estudio / estar</text><text x="470" y="600" class="t s">NIVEL 02 · dormitorios</text><text x="470" y="725" class="t s">NIVEL 01 · áreas sociales</text><text x="650" y="520" class="t s" transform="rotate(-90 650 520)">patio vertical</text><text x="975" y="735" class="t s">piscina</text>'''+dim(1140,770,1140,260,'12,00 m altura estimada')+dim(430,820,1100,820,'20,00 m'), 'Escala conceptual 1:100 · altura y estructura requieren predimensionamiento profesional')
save('03_corte_longitudinal.svg', body, body[0])

body = ('ELEVACIONES · NORTE Y OESTE', '''<line x1="220" y1="800" x2="1380" y2="800" class="d"/><rect x="390" y="300" width="700" height="500" class="shade"/><rect x="500" y="360" width="190" height="100" fill="#23313a"/><rect x="790" y="360" width="220" height="100" fill="#23313a"/><rect x="500" y="500" width="280" height="90" fill="#23313a"/><rect x="820" y="500" width="160" height="90" fill="#23313a"/><rect x="500" y="640" width="450" height="80" fill="#23313a"/><line x1="390" y1="425" x2="1090" y2="425" class="d"/><line x1="390" y1="565" x2="1090" y2="565" class="d"/><line x1="390" y1="705" x2="1090" y2="705" class="d"/><text x="480" y="870" class="t s">ELEVACIÓN NORTE · concreto visto / vidrio profundo / parasoles</text><line x1="1190" y1="300" x2="1190" y2="800" class="d"/><rect x="1200" y="360" width="140" height="100" fill="#23313a"/><rect x="1200" y="500" width="140" height="90" fill="#23313a"/><rect x="1200" y="640" width="140" height="80" fill="#23313a"/><text x="1160" y="870" class="t s">OESTE</text>'''+dim(390,250,1090,250,'20,00 m')+dim(1120,300,1120,800,'12,00 m'), 'Escala conceptual 1:100 · fachada bioclimática a ajustar según orientación y clima local')
save('04_elevaciones_norte_oeste.svg', body, body[0])

# combined sheet
combined = '''<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1600" viewBox="0 0 2400 1600"><rect width="100%" height="100%" fill="#f7f5ef"/><text x="80" y="90" class="t h">CASA BRUTALISTA TRUJILLO · LÁMINA CONCEPTUAL</text><text x="80" y="128" class="t s">1.000 m² construidos · 4 niveles · paisaje, piletas y piscina · terreno supuesto 6.000 m²</text><image href="01_planta_general_implantacion.svg" x="60" y="170" width="1100" height="760"/><image href="03_corte_longitudinal.svg" x="1230" y="170" width="1100" height="760"/><image href="04_elevaciones_norte_oeste.svg" x="60" y="960" width="1100" height="760"/><image href="02_planta_tipo_niveles_02_04.svg" x="1230" y="960" width="1100" height="760"/></svg>'''
(OUT/'05_lamina_tecnica_compuesta.svg').write_text(combined, encoding='utf-8')
print('Generated:', *sorted(str(p) for p in OUT.glob('*.svg')), sep='\n')
