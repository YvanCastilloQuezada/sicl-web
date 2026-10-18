from pathlib import Path
import olefile
p=Path('/home/ubuntu/ruleta_vba/vbaProject.bin')
ole=olefile.OleFileIO(str(p), raise_defects=olefile.DEFECT_INCORRECT)
print('root:', ole.listdir(streams=True, storages=True)[:20])
for entry in ole.listdir(streams=True, storages=True):
    path='/'.join(entry)
    try:
        size=ole.get_size(entry)
    except Exception:
        size='?'
    print(size, path)
ole.close()
