from pathlib import Path
import runpy
import shutil
import subprocess
import tempfile

root = Path('/home/ubuntu/sicl-web')
source = root / 'scripts/create_viewer_ui_bundle.py'
ns = runpy.run_path(str(source))
files = ns['FILES']
with tempfile.TemporaryDirectory(prefix='arki-viewer-bundle-') as tmp:
    project = Path(tmp)
    for rel, content in files.items():
        target = project / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding='utf-8')
    subprocess.run(['pnpm', 'install', '--ignore-scripts'], cwd=project, check=True, stdout=subprocess.DEVNULL)
    subprocess.run(['pnpm', 'build'], cwd=project, check=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    print('standalone viewer bundle build: PASS')
    print(f'files: {len(files)}')
