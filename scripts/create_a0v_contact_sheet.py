from pathlib import Path

from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

ROOT = Path('/home/ubuntu/sicl-web/docs/arki-ui-governance-001/A0/PO_VISUAL_REVIEW')
OUT = ROOT / 'ARKI_UI_VISUAL_CONTACT_SHEET.pdf'
items = [
    ('SCREEN-SHELL-001', '/', ROOT / 'screens/SCREEN-SHELL-001__root-loading.webp'),
    ('SCREEN-DF-001', '/arki-design-funnel', ROOT / 'screens/SCREEN-DF-001__design-funnel-loading.webp'),
    ('SCREEN-GEN-001', '/arki-generator', ROOT / 'screens/SCREEN-GEN-001__generator-loading.webp'),
]

page_w, page_h = landscape(letter)
c = canvas.Canvas(str(OUT), pagesize=(page_w, page_h))
c.setTitle('ARKI UI Visual Contact Sheet — A0-V')
for idx, (screen_id, route, image_path) in enumerate(items):
    c.setFont('Helvetica-Bold', 16)
    c.drawString(36, page_h - 40, f'{screen_id} — {route}')
    c.setFont('Helvetica', 9)
    c.drawString(36, page_h - 56, 'Viewport 1280×720 · Manus Browser · A0-V audit-only')
    if image_path.exists():
        img = ImageReader(str(image_path))
        iw, ih = img.getSize()
        max_w, max_h = page_w - 72, page_h - 100
        scale = min(max_w / iw, max_h / ih)
        w, h = iw * scale, ih * scale
        c.drawImage(img, (page_w - w) / 2, 24, width=w, height=h, preserveAspectRatio=True, mask='auto')
    c.showPage()
c.save()
print(OUT)
