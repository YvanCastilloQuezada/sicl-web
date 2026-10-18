from pathlib import Path
from PIL import Image

source = Path('/home/ubuntu/ruleta-peru-online/avatar-concepts/lukita_show.png')
out_dir = source.parent
image = Image.open(source).convert('RGB')
image.save(out_dir / 'lukita_show.jpg', format='JPEG', quality=95, optimize=True)
image.save(out_dir / 'lukita_show.bmp', format='BMP')
print(image.size)
